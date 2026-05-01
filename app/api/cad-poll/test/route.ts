import { NextResponse } from "next/server";
import { ImapFlow } from "imapflow";
import { simpleParser } from "mailparser";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// Dry-run: applies the same matching criteria as /api/cad-poll
// against messages since ?since=YYYY-MM-DD (default 2026-04-27).
// Does NOT write to the database.
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");
  if (process.env.CRON_SECRET && token !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sinceParam = searchParams.get("since") ?? "2026-04-27";
  const since = new Date(`${sinceParam}T00:00:00Z`);
  if (Number.isNaN(since.getTime())) {
    return NextResponse.json({ error: "Bad since param" }, { status: 400 });
  }

  const user = process.env.GMAIL_CAD_USER
    ?? process.env.GMAIL_USER
    ?? process.env.GMAIL_EMAIL;
  const pass = process.env.GMAIL_CAD_APP_PASSWORD
    ?? process.env.GMAIL_CAD_PASSWORD
    ?? process.env.GMAIL_PASSWORD;

  if (!user || !pass) {
    return NextResponse.json({ error: "Missing credentials" }, { status: 500 });
  }

  const client = new ImapFlow({
    host: "imap.gmail.com",
    port: 993,
    secure: true,
    auth: { user, pass },
    logger: false,
  });

  type Scanned = {
    date: string;
    from: string;
    subject: string;
    fromMatch: boolean;
    subjectFormatMatch: boolean;
    cadKeywordMatch: boolean;
    wouldStore: boolean;
    parsedCallType: string | null;
    bodyPreview?: string;
  };
  const showBodies = searchParams.get("body") === "1";

  try {
    await client.connect();
    await client.mailboxOpen("INBOX");

    const mailbox = searchParams.get("mailbox") ?? "INBOX";
    if (mailbox !== "INBOX") {
      await client.mailboxOpen(mailbox);
    }
    const uids = await client.search({ since }, { uid: true });
    const status = await client.status(mailbox, { messages: true });

    const scanned: Scanned[] = [];
    let cadAlertCount = 0;

    if (uids && uids.length > 0) {
      for await (const msg of client.fetch(uids, { envelope: true, source: true }, { uid: true })) {
        if (!msg.source) continue;
        const parsed = await simpleParser(msg.source);
        const fromAddr = Array.isArray(parsed.from?.value)
          ? parsed.from.value.map((a: { address?: string }) => a.address ?? "").join(",")
          : "";
        const subject = parsed.subject ?? "";

        const cadBodyRe = /\[\d+\s+Fire\s+CAD\]\s+(.+?)\s+--\s+(.+?)\s+--\s+Box:\s+.+?\s+--\s+Units:\s+(.+)/i;
        const bodyText = String(parsed.text ?? "");

        const fromMatch = fromAddr.toLowerCase() === "alert@cfmsg.co";
        const subjectFormatMatch = subject.trim() === "Chief Alert";
        const bodyMatch = bodyText.match(cadBodyRe);
        const cadKeywordMatch = !!bodyMatch && /\bVLHL\b/i.test(bodyMatch[3]);
        const isCadAlert = fromMatch && subjectFormatMatch && cadKeywordMatch;

        const callTypeRaw = bodyMatch?.[1]?.trim() ?? null;

        if (isCadAlert) cadAlertCount++;

        scanned.push({
          date: (parsed.date ?? new Date(0)).toISOString(),
          from: fromAddr,
          subject,
          fromMatch,
          subjectFormatMatch,
          cadKeywordMatch,
          wouldStore: isCadAlert,
          parsedCallType: callTypeRaw,
          ...(showBodies && fromMatch ? { bodyPreview: bodyText.slice(0, 2000) } : {}),
        });
      }
    }

    await client.logout();

    scanned.sort((a, b) => (a.date < b.date ? 1 : -1));

    return NextResponse.json({
      since: since.toISOString(),
      mailbox,
      mailboxTotal: status.messages ?? 0,
      uidsMatched: Array.isArray(uids) ? uids.length : 0,
      totalSinceDate: scanned.length,
      cadAlertMatches: cadAlertCount,
      messages: scanned,
    });
  } catch (err) {
    console.error("CAD poll test error:", err);
    try { await client.logout(); } catch {}
    return NextResponse.json({ error: "Test failed", detail: String(err) }, { status: 500 });
  }
}
