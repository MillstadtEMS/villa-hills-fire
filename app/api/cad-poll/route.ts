import { NextResponse } from "next/server";
import { ImapFlow } from "imapflow";
import { simpleParser } from "mailparser";
import { isDuplicate, saveCall } from "@/lib/cad/db";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// Called by cron-job.org every minute
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");
  if (process.env.CRON_SECRET && token !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = process.env.GMAIL_CAD_USER
    ?? process.env.GMAIL_USER
    ?? process.env.GMAIL_EMAIL;
  const pass = process.env.GMAIL_CAD_APP_PASSWORD
    ?? process.env.GMAIL_CAD_PASSWORD
    ?? process.env.GMAIL_PASSWORD;
  const dbUrl = process.env.DATABASE_URL;

  if (!user || !pass || !dbUrl) {
    return NextResponse.json({ error: "Missing credentials" }, { status: 500 });
  }

  const client = new ImapFlow({
    host: "imap.gmail.com",
    port: 993,
    secure: true,
    auth: { user, pass },
    logger: false,
  });

  try {
    await client.connect();
    await client.mailboxOpen("INBOX");

    const messages: { subject: string; text: string; html: string; date: Date; from: string; id: string }[] = [];

    const status = await client.status("INBOX", { messages: true });
    const total = status.messages ?? 0;
    const maxMessages = 40;
    const start = Math.max(1, total - maxMessages + 1);
    const range = `${start}:${total}`;

    // Strict CAD body format from Chief 360:
    //   [NN Fire CAD] CALL TYPE -- ADDRESS CITY, ST ZIP -- Box: ... -- Units: ...
    // Must include a Villa Hills unit (VLHL) so we don't ingest unrelated mutual-aid alerts.
    const cadBodyRe = /\[\d+\s+Fire\s+CAD\]\s+(.+?)\s+--\s+(.+?)\s+--\s+Box:\s+.+?\s+--\s+Units:\s+(.+)/i;

    for await (const msg of client.fetch(range, { envelope: true, source: true })) {
      if (!msg.source) continue;
      const parsed = await simpleParser(msg.source);
      const fromAddr = Array.isArray(parsed.from?.value)
        ? parsed.from.value.map((a: { address?: string }) => a.address ?? "").join(",")
        : "";
      const subject = (parsed.subject ?? "").trim();
      const bodyText = String(parsed.text ?? "");

      const fromOk = fromAddr.toLowerCase() === "alert@cfmsg.co";
      const subjectOk = subject === "Chief Alert";
      const bodyMatch = bodyText.match(cadBodyRe);
      const unitsOk = bodyMatch ? /\bVLHL\b/i.test(bodyMatch[3]) : false;
      if (!fromOk || !subjectOk || !bodyMatch || !unitsOk) continue;

      const stableMessageId = parsed.messageId
        ?? (typeof msg.uid === "number" ? `imap-${msg.uid}` : `imap-${msg.seq}`);

      messages.push({
        subject,
        text: bodyText,
        html: typeof parsed.html === "string" ? parsed.html : "",
        date: parsed.date ?? new Date(0),
        from: fromAddr,
        id: stableMessageId,
      });
    }

    await client.logout();

    if (messages.length === 0) {
      return NextResponse.json({ stored: 0 });
    }

    // Sort newest first
    messages.sort((a, b) => b.date.getTime() - a.date.getTime());
    const recent = messages.slice(0, 5);

    let stored = 0;
    for (const msg of recent) {
      if (await isDuplicate(msg.id)) continue;

      const bodyMatch = msg.text.match(cadBodyRe);
      if (!bodyMatch) continue;
      const callType = bodyMatch[1].trim();

      // Build date/time from email received time (Chicago timezone)
      const chicago = new Date(msg.date.toLocaleString("en-US", { timeZone: "America/Chicago" }));
      const dispatchDate = `${String(chicago.getMonth() + 1).padStart(2, "0")}/${String(chicago.getDate()).padStart(2, "0")}/${chicago.getFullYear()}`;
      const dispatchTime = `${String(chicago.getHours()).padStart(2, "0")}:${String(chicago.getMinutes()).padStart(2, "0")}`;
      const sourceYear = chicago.getFullYear();

      await saveCall({
        gmailMessageId: msg.id,
        dispatchDatetime: msg.date.toISOString(),
        dispatchDate,
        dispatchTime,
        dispatchNature: callType,
        sourceYear,
      });
      stored++;
    }

    return NextResponse.json({ stored, checked: messages.length });
  } catch (err) {
    console.error("CAD poll error:", err);
    try { await client.logout(); } catch {}
    return NextResponse.json({ error: "Poll failed" }, { status: 500 });
  }
}
