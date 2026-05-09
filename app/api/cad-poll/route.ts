/**
 * GET / POST /api/cad-poll
 *
 * Cloned from millstadt-ems's /api/cad/poll. Triggered by cron-job.org every
 * minute. Also callable manually with the correct secret for testing.
 *
 * Auth: accepts a Bearer token, an `?token=` query param, or the
 * x-vercel-cron-signature header (sent by Vercel Cron). If CRON_SECRET is
 * not set in env, all requests are accepted (open endpoint).
 */

import { NextRequest, NextResponse } from "next/server";
import { fetchUnreadDispatchEmails, markAsRead } from "@/lib/cad/gmail";
import { parseDispatchEmail } from "@/lib/cad/parser";
import { isDuplicate, saveCall, logPollRun } from "@/lib/cad/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const maxDuration = 60;

export async function GET(req: NextRequest) {
  return handlePoll(req);
}
export async function POST(req: NextRequest) {
  return handlePoll(req);
}

function isAuthorized(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return true; // open endpoint when not configured

  // Vercel Cron sends this header automatically
  const cronSig = req.headers.get("x-vercel-cron-signature");
  if (cronSig) return true;

  // Manual trigger with bearer token
  const auth = req.headers.get("authorization") ?? "";
  if (auth === `Bearer ${secret}`) return true;

  // Query parameter auth (cron-job.org)
  const qsSecret = req.nextUrl.searchParams.get("token")
    ?? req.nextUrl.searchParams.get("secret");
  return qsSecret === secret;
}

async function handlePoll(req: NextRequest): Promise<NextResponse> {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const startedAt = Date.now();
  const results = {
    processed: 0,
    duplicates: 0,
    skipped: 0,
    failed: 0,
    errors: [] as string[],
  };

  try {
    const emails = await fetchUnreadDispatchEmails();

    for (const email of emails) {
      try {
        // Dedup by Gmail message id
        if (await isDuplicate(email.id)) {
          results.duplicates++;
          await markAsRead(email.id).catch(() => {});
          continue;
        }

        const parsed = parseDispatchEmail(email.subject, email.body, email.received);

        if (parsed.status === "failed") {
          // Not a real CAD dispatch (newsletter, status update, etc.) —
          // mark as read so we don't re-evaluate it forever.
          results.skipped++;
          await markAsRead(email.id).catch(() => {});
          continue;
        }

        await saveCall({
          gmailMessageId: email.id,
          dispatchDatetime: parsed.dispatchDatetime,
          dispatchDate: parsed.dispatchDate,
          dispatchTime: parsed.dispatchTime,
          dispatchNature: parsed.dispatchNature,
          sourceYear: parsed.sourceYear,
        });
        results.processed++;

        await markAsRead(email.id).catch(() => {});
      } catch (err) {
        results.errors.push(`${email.id}: ${String(err).slice(0, 200)}`);
        results.failed++;
        await markAsRead(email.id).catch(() => {});
      }
    }

    await logPollRun({
      checked: emails.length,
      stored: results.processed,
      durationMs: Date.now() - startedAt,
      error: results.errors.length ? results.errors.join("; ").slice(0, 500) : undefined,
    });

    return NextResponse.json({ ok: true, ...results, examined: emails.length });
  } catch (err) {
    const detail = String(err).slice(0, 500);
    await logPollRun({
      checked: 0,
      stored: results.processed,
      durationMs: Date.now() - startedAt,
      error: detail,
    });
    return NextResponse.json({ error: "Poll failed", detail: detail.slice(0, 200) }, { status: 500 });
  }
}
