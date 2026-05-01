import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { saveApplication } from "@/lib/applications/db";

// ─── PDF Builder ─────────────────────────────────────────────────────────────

async function buildPDF(data: Record<string, string>): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const boldFont = await doc.embedFont(StandardFonts.HelveticaBold);
  const font = await doc.embedFont(StandardFonts.Helvetica);

  const RED = rgb(0.545, 0, 0);
  const BLACK = rgb(0, 0, 0);
  const GRAY = rgb(0.4, 0.4, 0.4);
  const LIGHT = rgb(0.95, 0.95, 0.95);

  const W = 612;
  const MARGIN = 50;
  const COL = W - MARGIN * 2;

  let page = doc.addPage([W, 792]);
  let y = 742;

  function checkPage(needed = 60) {
    if (y < needed + 50) {
      page = doc.addPage([W, 792]);
      y = 742;
      drawHeader();
    }
  }

  function drawHeader() {
    page.drawRectangle({ x: 0, y: 762, width: W, height: 30, color: RED });
    page.drawText("VILLA HILLS FIRE PROTECTION DISTRICT", {
      x: MARGIN, y: 771, size: 9, font: boldFont, color: rgb(1, 1, 1),
    });
    page.drawText("VOLUNTEER FIREFIGHTER APPLICATION — CONFIDENTIAL", {
      x: W - MARGIN - 240, y: 771, size: 9, font, color: rgb(1, 1, 1),
    });
  }

  function sectionTitle(title: string) {
    checkPage(50);
    y -= 10;
    page.drawRectangle({ x: MARGIN, y: y - 4, width: COL, height: 22, color: RED });
    page.drawText(title.toUpperCase(), { x: MARGIN + 8, y: y + 1, size: 9, font: boldFont, color: rgb(1, 1, 1) });
    y -= 24;
  }

  function field(label: string, value: string) {
    checkPage(30);
    page.drawText(label, { x: MARGIN, y, size: 8, font: boldFont, color: GRAY });
    y -= 14;
    const val = value?.trim() || "—";
    // Wrap long values
    const maxChars = 95;
    const lines = [];
    for (let i = 0; i < val.length; i += maxChars) {
      lines.push(val.slice(i, i + maxChars));
    }
    lines.forEach((line) => {
      checkPage(16);
      page.drawText(line, { x: MARGIN + 10, y, size: 9, font, color: BLACK });
      y -= 13;
    });
    y -= 4;
  }

  function twoCol(pairs: [string, string][]) {
    checkPage(30);
    pairs.forEach(([label, value], i) => {
      const xOff = i % 2 === 0 ? MARGIN : W / 2 + 10;
      if (i % 2 === 0 && i > 0) y -= 0;
      if (i % 2 === 0 && i !== 0) checkPage(28);
      page.drawText(label, { x: xOff, y, size: 8, font: boldFont, color: GRAY });
    });
    y -= 14;
    pairs.forEach(([, value], i) => {
      const xOff = i % 2 === 0 ? MARGIN + 10 : W / 2 + 20;
      page.drawText(value?.trim() || "—", { x: xOff, y, size: 9, font, color: BLACK });
    });
    y -= 17;
  }

  function blank() { y -= 8; }

  // ── Draw ──
  drawHeader();
  y = 730;

  // Title block
  page.drawText("VOLUNTEER FIREFIGHTER APPLICATION", { x: MARGIN, y, size: 16, font: boldFont, color: RED });
  y -= 18;
  page.drawText(`Submitted: ${data.signatureDate || new Date().toLocaleDateString()}`, { x: MARGIN, y, size: 9, font, color: GRAY });
  y -= 6;
  page.drawLine({ start: { x: MARGIN, y }, end: { x: W - MARGIN, y }, thickness: 0.5, color: rgb(0.8, 0.8, 0.8) });
  y -= 18;

  // Section 1
  sectionTitle("Section 1 — Personal Information");
  twoCol([["First Name", data.firstName], ["Last Name", data.lastName]]);
  twoCol([["Date of Birth", data.dob], ["Phone Number", data.phone]]);
  field("Email Address", data.email);
  field("Street Address", data.address);
  twoCol([["City", data.city], ["State / ZIP", `${data.state} ${data.zip}`]]);
  blank();

  // Section 2
  sectionTitle("Section 2 — General Qualifications");
  field("Completed Illinois Basic Operations Firefighter Course?", data.basicOpsClass);
  field("Available for Monday Night Training Sessions?", data.mondayTraining);
  blank();

  // Section 3
  sectionTitle("Section 3 — Military Service");
  field("Served in the United States Armed Forces?", data.militaryService);
  if (data.militaryService === "yes") {
    twoCol([["Branch of Service", data.militaryBranch], ["Discharge Status", data.dischargeStatus]]);
    field("DD-214 Status", data.dd214);
  }
  blank();

  // Section 4
  sectionTitle("Section 4 — Medical Credentials");
  field("Licensed First Responder / EMT / Paramedic (Illinois)?", data.medicalLicense);
  if (data.medicalLicense === "yes") {
    twoCol([["License Type", data.medicalLicenseType], ["License Number", data.medicalLicenseNumber]]);
    field("License Expiration Date", data.medicalLicenseExpiration);
    field("Medical Services Disclaimer Acknowledged?", data.medicalDisclaimer === "yes" ? "Yes — acknowledged" : "NOT ACKNOWLEDGED");
  }
  blank();

  // Section 5
  sectionTitle("Section 5 — Background Information");
  field("Convicted of a Misdemeanor?", data.convictedMisdemeanor);
  if (data.convictedMisdemeanor === "yes") field("Misdemeanor Explanation", data.misdemeanorExplanation);
  field("Convicted of a Felony?", data.convictedFelony);
  if (data.convictedFelony === "yes") field("Felony Explanation", data.felonyExplanation);
  field("Convicted of an Offense Involving Moral Turpitude?", data.moralTurpitude);
  if (data.moralTurpitude === "yes") field("Moral Turpitude Explanation", data.moralTurpitudeExplanation);
  blank();

  // Section 6
  sectionTitle("Section 6 — Certification & Signature");
  field("Electronic Signature", data.signature);
  field("Date Signed", data.signatureDate);

  // Footer on last page
  y -= 20;
  page.drawLine({ start: { x: MARGIN, y }, end: { x: W - MARGIN, y }, thickness: 0.5, color: rgb(0.8, 0.8, 0.8) });
  y -= 14;
  page.drawText("Villa Hills Fire Protection District · St. Clair County, Illinois · Est. 1955 · CONFIDENTIAL", {
    x: MARGIN, y, size: 7, font, color: GRAY,
  });

  return doc.save();
}

// ─── Route handler ────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  let data: Record<string, string>;
  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  // Basic server-side validation
  if (!data.firstName || !data.lastName || !data.email || !data.signature) {
    return NextResponse.json({ error: "Required fields are missing." }, { status: 400 });
  }

  // Save to database
  let application;
  try {
    application = await saveApplication(data);
  } catch (err) {
    console.error("Database save failed:", err);
    return NextResponse.json({ error: "Failed to save application." }, { status: 500 });
  }

  // Build PDF
  let pdfBytes: Uint8Array;
  try {
    pdfBytes = await buildPDF(data);
  } catch (err) {
    console.error("PDF generation failed:", err);
    return NextResponse.json({ error: "Failed to generate application PDF." }, { status: 500 });
  }

  // Send email
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    const applicantName = `${data.firstName} ${data.lastName}`;

    await transporter.sendMail({
      from: `"Villa Hills Fire Dept — Applications" <${process.env.GMAIL_USER}>`,
      to: "villahillsfd@gmail.com",
      subject: `New Volunteer Application — ${applicantName}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
          <div style="background:#8B0000;padding:20px 24px;">
            <h2 style="color:#fff;margin:0;font-size:18px;">New Volunteer Application Received</h2>
          </div>
          <div style="padding:24px;background:#f9f9f9;border:1px solid #e5e5e5;">
            <p style="margin:0 0 12px;"><strong>Applicant:</strong> ${applicantName}</p>
            <p style="margin:0 0 12px;"><strong>Email:</strong> ${data.email}</p>
            <p style="margin:0 0 12px;"><strong>Phone:</strong> ${data.phone}</p>
            <p style="margin:0 0 12px;"><strong>Submitted:</strong> ${data.signatureDate || new Date().toLocaleDateString()}</p>
            <p style="margin:16px 0 0;color:#666;font-size:13px;">The full application is attached as a PDF. Please review and follow up with the applicant.</p>
          </div>
          <div style="padding:12px 24px;background:#eee;font-size:11px;color:#999;">
            Villa Hills Fire Protection District · St. Clair County, Illinois · Est. 1955
          </div>
        </div>
      `,
      attachments: [
        {
          filename: `Application_${applicantName.replace(/\s+/g, "_")}_${Date.now()}.pdf`,
          content: Buffer.from(pdfBytes),
          contentType: "application/pdf",
        },
      ],
    });
  } catch (err) {
    console.error("Email send failed:", err);
    return NextResponse.json({ error: "Application received but email delivery failed. Please contact the department directly." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
