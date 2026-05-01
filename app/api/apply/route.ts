import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { saveApplication } from "@/lib/applications/db";
import { buildApplicationPDF } from "@/lib/applications/pdf";

// ─── Route handler ────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  let data: Record<string, string>;
  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!data.firstName || !data.lastName || !data.email || !data.signature) {
    return NextResponse.json({ error: "Required fields are missing." }, { status: 400 });
  }

  let application;
  try {
    application = await saveApplication(data);
  } catch (err) {
    console.error("Database save failed:", err);
    return NextResponse.json({ error: "Failed to save application." }, { status: 500 });
  }

  let pdfBytes: Uint8Array;
  try {
    pdfBytes = await buildApplicationPDF(data);
  } catch (err) {
    console.error("PDF generation failed:", err);
    return NextResponse.json({ error: "Failed to generate application PDF." }, { status: 500 });
  }

  // Use whichever Gmail credentials are configured. The CAD inbox is
  // always provisioned on prod, so fall back to it if the dedicated
  // applications mailbox isn't set.
  const sendUser = process.env.GMAIL_USER ?? process.env.GMAIL_CAD_USER;
  const sendPass = process.env.GMAIL_APP_PASSWORD ?? process.env.GMAIL_CAD_APP_PASSWORD;

  if (!sendUser || !sendPass) {
    console.error("No Gmail credentials configured for outbound email");
    return NextResponse.json(
      { error: "Application saved, but email delivery is not configured. The department has a copy in the admin portal." },
      { status: 200 }
    );
  }

  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: { user: sendUser, pass: sendPass },
    });

    const applicantName = `${data.firstName} ${data.lastName}`;
    const safeName = applicantName.replace(/[^a-zA-Z0-9]+/g, "_");

    await transporter.sendMail({
      from: `"Villa Hills Fire Dept — Applications" <${sendUser}>`,
      to: "villahillsfd@gmail.com",
      replyTo: data.email,
      subject: `New Volunteer Application — ${applicantName}`,
      html: `
        <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;border:1px solid #ddd;">
          <div style="background:#8B0000;padding:18px 22px;">
            <h2 style="color:#fff;margin:0;font-size:17px;font-weight:bold;">New Volunteer Application Received</h2>
          </div>
          <div style="padding:22px;background:#fafafa;">
            <p style="margin:0 0 10px;"><strong>Applicant:</strong> ${applicantName}</p>
            <p style="margin:0 0 10px;"><strong>Email:</strong> ${data.email}</p>
            <p style="margin:0 0 10px;"><strong>Phone:</strong> ${data.phone}</p>
            <p style="margin:0 0 10px;"><strong>Submitted:</strong> ${data.signatureDate || new Date().toLocaleDateString()}</p>
            <p style="margin:18px 0 6px;color:#555;font-size:13px;">The full application is attached as a PDF (paper-form layout).</p>
            <p style="margin:0;color:#555;font-size:13px;">It is also viewable in the admin portal at <a href="https://villahillsfd.org/admin/applications" style="color:#8B0000;">villahillsfd.org/admin/applications</a>.</p>
          </div>
          <div style="padding:10px 22px;background:#eee;font-size:11px;color:#888;">
            Villa Hills Fire Protection District · St. Clair County, Illinois · Est. 1955
          </div>
        </div>
      `,
      attachments: [
        {
          filename: `Application_${safeName}_${Date.now()}.pdf`,
          content: Buffer.from(pdfBytes),
          contentType: "application/pdf",
        },
      ],
    });
  } catch (err) {
    console.error("Email send failed:", err);
    // The application is still saved + retrievable from the admin portal.
    return NextResponse.json(
      { error: "Application received, but email delivery failed. The department has a copy in the admin portal." },
      { status: 200 }
    );
  }

  return NextResponse.json({ ok: true, applicationId: application.id });
}
