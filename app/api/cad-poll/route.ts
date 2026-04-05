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

    for await (const msg of client.fetch("1:*", { envelope: true, source: true })) {
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

    // Sort newest first, only process emails from last 2 hours
    messages.sort((a, b) => b.date.getTime() - a.date.getTime());
    const cutoff = Date.now() - 2 * 60 * 60 * 1000;
    const recent = messages.filter((m) => m.date.getTime() > cutoff);

    let stored = 0;
    for (const msg of recent) {
      // Skip if already in DB (same timestamp)
      const existing = await sql`
        SELECT id FROM incidents WHERE received_at = ${msg.date.toISOString()} LIMIT 1
      `;
      if (existing.length > 0) continue;

      // Search both subject line and body
      const combined = msg.subject + "\n" + msg.text;
      const lines = combined.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);

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

      // Nature / call type — check subject first, then body
      const callType =
        extract(["Nature", "Call Type", "Incident Type", "Type", "Call"]) ??
        msg.subject.replace(/^(Dispatch|CAD|Alert|Inc):?\s*/i, "").trim();

      // Full address from body, then strip house number — only keep street name
      const rawLocation = extract(["Address", "Location", "Incident Address", "Street", "Cross"]);
      const location = rawLocation
        ? rawLocation.replace(/^\d+[-\d]*\s+/, "").trim()  // strip leading house number
        : null;

      const units = extract(["Units", "Unit", "Responding", "Apparatus", "Assigned"]);

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
