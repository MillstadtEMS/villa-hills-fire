import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { isAdminAuthed } from "@/lib/admin/auth";

export const dynamic = "force-dynamic";

// Sends a real email to the CAD inbox in the exact Chief 360 format,
// then immediately triggers the cron poll so the call lands on the ticker
// without waiting on the cron-job.org schedule.
//
// This proves the entire pipeline end-to-end: SMTP send → Gmail INBOX
// → IMAP fetch → strict filter → DB insert → /api/cad/latest → ticker.
export async function POST() {
  if (!(await isAdminAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = process.env.GMAIL_CAD_USER
    ?? process.env.GMAIL_USER
    ?? process.env.GMAIL_EMAIL;
  const pass = process.env.GMAIL_CAD_APP_PASSWORD
    ?? process.env.GMAIL_CAD_PASSWORD
    ?? process.env.GMAIL_PASSWORD;

  if (!user || !pass) {
    return NextResponse.json({ error: "GMAIL credentials not configured" }, { status: 500 });
  }

  const stamp = new Date().toISOString().replace(/[^0-9]/g, "").slice(0, 14);
  const body = `[99 Fire CAD] TEST DISPATCH ${stamp} -- 100 Test St VILLA HILLS, IL 62223 -- Box: TEST -- Units: VLHL TEST`;

  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: { user, pass },
    });

    const info = await transporter.sendMail({
      from: user,
      to: user,
      subject: "Chief Alert",
      text: body,
    });

    // Immediately poll the inbox so the test call shows up right away.
    let pollResult: unknown = null;
    try {
      const url = new URL("/api/cad-poll", process.env.NEXT_PUBLIC_SITE_URL ?? "https://villahillsfd.org");
      if (process.env.CRON_SECRET) url.searchParams.set("token", process.env.CRON_SECRET);
      const r = await fetch(url.toString(), { cache: "no-store" });
      pollResult = await r.json();
    } catch (e) {
      pollResult = { error: String(e) };
    }

    return NextResponse.json({
      ok: true,
      messageId: info.messageId,
      bodySent: body,
      pollResult,
      hint: "Email sent to the CAD inbox. The cron poll was triggered automatically. Reload the ticker — it should show ACTIVE CALL within a few seconds.",
    });
  } catch (err) {
    return NextResponse.json({ error: "Send failed", detail: String(err) }, { status: 500 });
  }
}
