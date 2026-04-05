import { NextResponse } from "next/server";
import { ImapFlow } from "imapflow";
import { simpleParser } from "mailparser";
import { neon } from "@neondatabase/serverless";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// Called by cron-job.org every minute
export async function GET(req: Request) {
  // Optional: protect with a secret token
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");
  if (process.env.CRON_SECRET && token !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = process.env.GMAIL_CAD_USER;
  const pass = process.env.GMAIL_CAD_APP_PASSWORD;
  const dbUrl = process.env.DATABASE_URL;

  if (!user || !pass || !dbUrl) {
    return NextResponse.json({ error: "Missing credentials" }, { status: 500 });
  }

  const sql = neon(dbUrl);

  // Ensure table exists
  await sql`
    CREATE TABLE IF NOT EXISTS incidents (
      id SERIAL PRIMARY KEY,
      received_at TIMESTAMPTZ NOT NULL,
      call_type TEXT,
      location TEXT,
      units TEXT,
      raw_subject TEXT,
      raw_body TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;

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

    // Fetch last 10 messages
    const messages: { subject: string; text: string; date: Date }[] = [];

    // Only fetch the 5 most recent messages by UID
    const status = await client.status("INBOX", { messages: true });
    const total = status.messages ?? 0;
    const start = Math.max(1, total - 4);
    const range = `${start}:${total}`;

    for await (const msg of client.fetch(range, { envelope: true, source: true })) {
      if (!msg.source) continue;
      const parsed = await simpleParser(msg.source);
      messages.push({
        subject: parsed.subject ?? "",
        text: parsed.text ?? "",
        date: parsed.date ?? new Date(0),
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
      // Skip if already in DB (same timestamp)
      const existing = await sql`
        SELECT id FROM incidents WHERE received_at = ${msg.date.toISOString()} LIMIT 1
      `;
      if (existing.length > 0) continue;

      const lines = msg.text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);

      // Try keyword extraction first
      const extract = (keys: string[]): string | null => {
        for (const line of lines) {
          for (const key of keys) {
            const re = new RegExp(`^${key}[:\\s]+(.+)$`, "i");
            const m = line.match(re);
            if (m) return m[1].trim();
          }
        }
        return null;
      };

      // Nature: try body keywords, fall back to subject line
      const callType =
        extract(["Nature", "Call Type", "Incident Type", "Type", "Call", "Incident"]) ??
        msg.subject.replace(/^(Dispatch|CAD|Alert|Inc|Incident):?\s*/i, "").trim();

      // Address: try keywords, then look for any line with a number + street pattern
      const rawLocation =
        extract(["Address", "Location", "Incident Address", "Street", "Cross", "Addr"]) ??
        lines.find((l) => /^\d+\s+[A-Za-z]/.test(l)) ??
        null;

      // Strip house number — show street name only
      const location = rawLocation
        ? rawLocation.replace(/^\d+[-\w]*\s+/, "").replace(/,.*$/, "").trim()
        : null;

      const units = extract(["Units", "Unit", "Responding", "Apparatus", "Assigned", "Resources"]);

      await sql`
        INSERT INTO incidents (received_at, call_type, location, units, raw_subject, raw_body)
        VALUES (
          ${msg.date.toISOString()},
          ${callType},
          ${location},
          ${units},
          ${msg.subject},
          ${msg.text.slice(0, 2000)}
        )
      `;
      stored++;
    }

    return NextResponse.json({ stored, checked: messages.length });
  } catch (err) {
    console.error("CAD poll error:", err);
    try { await client.logout(); } catch {}
    return NextResponse.json({ error: "Poll failed" }, { status: 500 });
  }
}
