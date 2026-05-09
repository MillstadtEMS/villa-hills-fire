import { NextResponse } from "next/server";
import { ImapFlow } from "imapflow";
import { simpleParser } from "mailparser";
import { isDuplicate, saveCall, logPollRun } from "@/lib/cad/db";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";
export const maxDuration = 60;

// Mirrors millstadt-ems's CAD poll logic via IMAP:
//   1. Search for UNSEEN messages only (Gmail's `is:unread` equivalent).
//   2. Two-stage fetch: cheap envelope first, then full source ONLY for
//      messages whose subject/from look like real CAD alerts. Avoids
//      paying parser cost on every newsletter and bot email.
//   3. Mark every UID we looked at as \Seen at the end (single batch STORE)
//      so the next poll only ever sees brand-new emails. Self-clearing
//      queue means a poison-pill message can't permanently block ingest.

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
    candidates: 0,
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
    // Bound how long any single IMAP operation can hang. Without these,
    // a flaky Vercel<->Gmail connection can wedge the function for 5min.
    socketTimeout: 15_000,
  });

  // Helper: bound any await with a timeout so a hung IMAP op fails fast.
  async function withTimeout<T>(p: Promise<T>, ms: number, label: string): Promise<T> {
    let timer: ReturnType<typeof setTimeout> | undefined;
    try {
      return await Promise.race([
        p,
        new Promise<T>((_, rej) => { timer = setTimeout(() => rej(new Error(`${label} timed out after ${ms}ms`)), ms); }),
      ]);
    } finally {
      if (timer) clearTimeout(timer);
    }
  }

  // Track every UID we look at so we mark them \Seen at the end in one shot.
  const uidsTouched: number[] = [];

  try {
    await withTimeout(client.connect(), 10_000, "IMAP connect");
    await withTimeout(client.mailboxOpen("INBOX"), 10_000, "IMAP open INBOX");

    try {
      const status = await client.status("INBOX", { messages: true });
      results.inboxTotal = status.messages ?? 0;
    } catch { /* ignore */ }

    // --- Stage 1: list UNSEEN UIDs ---
    const allUnseen = (await client.search({ seen: false }, { uid: true })) || [];
    results.unreadCount = Array.isArray(allUnseen) ? allUnseen.length : 0;

    // Cap per-poll work — process the 25 most recent unseen UIDs.
    const unseenUids = Array.isArray(allUnseen)
      ? [...allUnseen].sort((a, b) => b - a).slice(0, 25)
      : [];

    if (unseenUids.length === 0) {
      await client.logout();
      await logPollRun({ checked: 0, stored: 0, inboxTotal: results.inboxTotal, durationMs: Date.now() - startedAt });
      return NextResponse.json({ ok: true, ...results });
    }

    // --- Stage 2: cheap envelope-only fetch to triage ---
    type Candidate = { uid: number; subject: string; fromLower: string };
    const candidates: Candidate[] = [];

    for await (const msg of client.fetch(unseenUids, { envelope: true }, { uid: true })) {
      if (typeof msg.uid !== "number") continue;
      uidsTouched.push(msg.uid);

      const subjectRaw = msg.envelope?.subject ?? "";
      const subject = stripSubjectPrefixes(subjectRaw);
      const fromLower = (msg.envelope?.from ?? [])
        .map(a => (a?.address ?? "").toLowerCase())
        .join(",");

      if (subject !== "Chief Alert") continue;
      if (!(fromLower.includes("alert@cfmsg.co") || fromLower.includes(user.toLowerCase()))) continue;

      candidates.push({ uid: msg.uid, subject, fromLower });
    }
    results.candidates = candidates.length;

    // --- Stage 3: for each candidate, fetch full source and validate body ---
    for (const c of candidates) {
      try {
        // Re-open the source for this single UID
        let source: Buffer | null = null;
        for await (const m of client.fetch(c.uid, { source: true }, { uid: true })) {
          if (m.source) source = m.source as Buffer;
        }
        if (!source) { results.skipped++; continue; }

        const parsed = await simpleParser(source);
        const bodyText = String(parsed.text ?? "");
        const bodyMatch = bodyText.match(CAD_BODY_RE);
        const unitsOk = bodyMatch ? /\bVLHL\b/i.test(bodyMatch[3]) : false;

        if (!bodyMatch || !unitsOk) {
          results.skipped++;
          continue;
        }

        results.matched++;
        const stableMessageId = parsed.messageId ?? `imap-${c.uid}`;

        if (await isDuplicate(stableMessageId)) {
          results.duplicates++;
          continue;
        }

        const callType = bodyMatch[1].trim();
        const dateObj = parsed.date ?? new Date();
        const chicagoStr = dateObj.toLocaleString("en-US", {
          timeZone: "America/Chicago",
          year: "numeric", month: "2-digit", day: "2-digit",
          hour: "2-digit", minute: "2-digit", hour12: false,
        });
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
      } catch (innerErr) {
        results.errors.push(`uid ${c.uid}: ${String(innerErr).slice(0, 200)}`);
      }
    }

    // --- Stage 4: mark every UID we examined as \Seen (single batch STORE) ---
    if (uidsTouched.length > 0) {
      await client.messageFlagsAdd(uidsTouched, ["\\Seen"], { uid: true }).catch(() => {});
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
