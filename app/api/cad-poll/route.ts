import { NextResponse } from "next/server";
import { ImapFlow } from "imapflow";
import { simpleParser } from "mailparser";
import { isDuplicate, saveCall, logPollRun } from "@/lib/cad/db";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

// Mirrors millstadt-ems's CAD poll logic, but over IMAP since the Villa Hills
// account isn't on Gmail OAuth yet:
//   - Only fetch UNREAD messages (analogous to Gmail's `is:unread` filter).
//   - For each unread message, run the strict CAD filter.
//   - Mark every message as read after we look at it, so the next poll only
//     ever sees brand-new emails — no "last 40 by sequence number" guessing.
// This makes the pipeline self-clearing: a real CAD email arrives → next
// minute's cron sees it as unread → ingests it → marks read → done.

const CAD_BODY_RE =
  /\[\d+\s+Fire\s+CAD\]\s+(.+?)\s+--\s+(.+?)\s+--\s+Box:\s+.+?\s+--\s+Units:\s+(.+)/i;

function stripSubjectPrefixes(s: string): string {
  return s.replace(/^(?:(?:fwd?|re|fw):\s*)+/i, "").trim();
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");
  if (process.env.CRON_SECRET && token !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = process.env.GMAIL_CAD_USER ?? process.env.GMAIL_USER ?? process.env.GMAIL_EMAIL;
  const pass = process.env.GMAIL_CAD_APP_PASSWORD ?? process.env.GMAIL_CAD_PASSWORD ?? process.env.GMAIL_PASSWORD;
  const dbUrl = process.env.DATABASE_URL;
  if (!user || !pass || !dbUrl) {
    return NextResponse.json({ error: "Missing credentials" }, { status: 500 });
  }

  const startedAt = Date.now();
  const results = {
    inboxTotal: 0,
    unreadCount: 0,
    matched: 0,
    stored: 0,
    duplicates: 0,
    skipped: 0,
    errors: [] as string[],
  };

  const client = new ImapFlow({
    host: "imap.gmail.com",
    port: 993,
    secure: true,
    auth: { user, pass },
    logger: false,
  });

  try {
    await client.connect();
    const lock = await client.getMailboxLock("INBOX");

    try {
      // -- mailbox total (just for diagnostics) --
      try {
        const status = await client.status("INBOX", { messages: true });
        results.inboxTotal = status.messages ?? 0;
      } catch {
        // ignore
      }

      // -- find UNSEEN messages only --
      const unseenUids = (await client.search({ seen: false }, { uid: true })) || [];
      results.unreadCount = Array.isArray(unseenUids) ? unseenUids.length : 0;

      if (results.unreadCount === 0) {
        await logPollRun({
          checked: 0,
          stored: 0,
          inboxTotal: results.inboxTotal,
          durationMs: Date.now() - startedAt,
        });
        return NextResponse.json({ ok: true, ...results });
      }

      // -- fetch each unseen message, parse, decide --
      for await (const msg of client.fetch(unseenUids as number[], { envelope: true, source: true }, { uid: true })) {
        if (!msg.source || typeof msg.uid !== "number") continue;
        const uid = msg.uid;

        try {
          const parsed = await simpleParser(msg.source);
          const fromAddr = Array.isArray(parsed.from?.value)
            ? parsed.from.value.map((a: { address?: string }) => (a.address ?? "").toLowerCase()).join(",")
            : "";
          const subject = stripSubjectPrefixes(parsed.subject ?? "");
          const bodyText = String(parsed.text ?? "");

          const fromOk =
            fromAddr.includes("alert@cfmsg.co") || fromAddr.includes(user.toLowerCase());
          const subjectOk = subject === "Chief Alert";
          const bodyMatch = bodyText.match(CAD_BODY_RE);
          const unitsOk = bodyMatch ? /\bVLHL\b/i.test(bodyMatch[3]) : false;

          if (!(fromOk && subjectOk && bodyMatch && unitsOk)) {
            results.skipped++;
            // Still mark as read so we don't re-evaluate it forever.
            await client.messageFlagsAdd(uid, ["\\Seen"], { uid: true }).catch(() => {});
            continue;
          }

          results.matched++;

          const stableMessageId =
            parsed.messageId ?? `imap-${uid}`;

          if (await isDuplicate(stableMessageId)) {
            results.duplicates++;
            await client.messageFlagsAdd(uid, ["\\Seen"], { uid: true }).catch(() => {});
            continue;
          }

          const callType = bodyMatch[1].trim();
          const dateObj = parsed.date ?? new Date();
          // Build Chicago-local date/time for display fields.
          const chicagoStr = dateObj.toLocaleString("en-US", {
            timeZone: "America/Chicago",
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          });
          // chicagoStr looks like "05/03/2026, 12:15"
          const m = chicagoStr.match(/(\d{2})\/(\d{2})\/(\d{4}),?\s+(\d{2}):(\d{2})/);
          const dispatchDate = m ? `${m[1]}/${m[2]}/${m[3]}` : dateObj.toLocaleDateString("en-US");
          const dispatchTime = m ? `${m[4]}:${m[5]}` : dateObj.toLocaleTimeString("en-US");
          const sourceYear = m ? Number(m[3]) : new Date().getFullYear();

          await saveCall({
            gmailMessageId: stableMessageId,
            dispatchDatetime: dateObj.toISOString(),
            dispatchDate,
            dispatchTime,
            dispatchNature: callType,
            sourceYear,
          });
          results.stored++;

          await client.messageFlagsAdd(uid, ["\\Seen"], { uid: true }).catch(() => {});
        } catch (innerErr) {
          results.errors.push(`uid ${uid}: ${String(innerErr).slice(0, 200)}`);
          // mark seen so a poison-pill email can't permanently block future polls
          await client.messageFlagsAdd(uid, ["\\Seen"], { uid: true }).catch(() => {});
        }
      }
    } finally {
      lock.release();
    }

    await client.logout();

    await logPollRun({
      checked: results.matched,
      stored: results.stored,
      inboxTotal: results.inboxTotal,
      durationMs: Date.now() - startedAt,
      error: results.errors.length ? results.errors.join("; ").slice(0, 500) : undefined,
    });

    return NextResponse.json({ ok: true, ...results });
  } catch (err) {
    try { await client.logout(); } catch {}
    const detail = String(err).slice(0, 500);
    await logPollRun({
      checked: results.matched,
      stored: results.stored,
      inboxTotal: results.inboxTotal,
      durationMs: Date.now() - startedAt,
      error: detail,
    });
    return NextResponse.json({ error: "Poll failed", detail: detail.slice(0, 200) }, { status: 500 });
  }
}
