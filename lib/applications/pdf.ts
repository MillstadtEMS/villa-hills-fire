import { PDFDocument, rgb, StandardFonts, PDFFont, PDFPage } from "pdf-lib";
import type { Application } from "./db";

/**
 * Renders an application as a paper-form-style PDF — typewriter answers
 * on top of underlined blanks, X marks in checkbox squares for yes/no,
 * formal serif headers. Looks like something filled out with a pen.
 */
export async function buildApplicationPDF(data: Record<string, string | undefined>): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const serif      = await doc.embedFont(StandardFonts.TimesRoman);
  const serifBold  = await doc.embedFont(StandardFonts.TimesRomanBold);
  const serifItal  = await doc.embedFont(StandardFonts.TimesRomanItalic);
  const mono       = await doc.embedFont(StandardFonts.Courier);
  const monoBold   = await doc.embedFont(StandardFonts.CourierBold);

  const BLACK = rgb(0, 0, 0);
  const GRAY  = rgb(0.45, 0.45, 0.45);
  const RULE  = rgb(0.15, 0.15, 0.15);

  const W = 612, H = 792, MARGIN = 54;
  const COL = W - MARGIN * 2;

  let page: PDFPage = doc.addPage([W, H]);
  let y = H - MARGIN;

  function newPage() {
    page = doc.addPage([W, H]);
    y = H - MARGIN;
    drawTopBorder();
  }
  function checkRoom(needed: number) { if (y < MARGIN + needed) newPage(); }

  function drawTopBorder() {
    page.drawLine({ start: { x: MARGIN, y }, end: { x: W - MARGIN, y }, thickness: 1.2, color: BLACK });
    y -= 4;
    page.drawLine({ start: { x: MARGIN, y }, end: { x: W - MARGIN, y }, thickness: 0.4, color: BLACK });
    y -= 22;
  }
  function drawBottomBorder() {
    const yLine = MARGIN - 4;
    page.drawLine({ start: { x: MARGIN, y: yLine + 4 }, end: { x: W - MARGIN, y: yLine + 4 }, thickness: 0.4, color: BLACK });
    page.drawLine({ start: { x: MARGIN, y: yLine },     end: { x: W - MARGIN, y: yLine },     thickness: 1.2, color: BLACK });
  }

  function section(num: number, title: string) {
    checkRoom(60);
    y -= 8;
    page.drawLine({ start: { x: MARGIN, y }, end: { x: W - MARGIN, y }, thickness: 0.6, color: BLACK });
    y -= 16;
    page.drawText(`SECTION ${num}.`, { x: MARGIN, y, size: 10.5, font: serifBold, color: BLACK });
    page.drawText(title.toUpperCase(), { x: MARGIN + 70, y, size: 10.5, font: serifBold, color: BLACK });
    y -= 6;
    page.drawLine({ start: { x: MARGIN, y }, end: { x: W - MARGIN, y }, thickness: 0.4, color: BLACK });
    y -= 18;
  }

  function fieldOnLine(label: string, value: string, x: number, width: number, valFont: PDFFont = mono) {
    page.drawText(label, { x, y, size: 8.5, font: serifItal, color: GRAY });
    const lineY = y - 4;
    page.drawLine({ start: { x, y: lineY }, end: { x: x + width, y: lineY }, thickness: 0.6, color: RULE });
    const val = (value ?? "").trim();
    if (val) page.drawText(val, { x: x + 3, y: lineY + 2, size: 10, font: valFont, color: BLACK });
  }

  function fieldRow(fields: Array<[string, string | undefined, number]>) {
    checkRoom(34);
    let cursorX = MARGIN;
    const gap = 10;
    const totalGap = gap * (fields.length - 1);
    const usable = COL - totalGap;
    fields.forEach(([label, val, frac]) => {
      const w = Math.floor(usable * frac);
      fieldOnLine(label, val ?? "", cursorX, w);
      cursorX += w + gap;
    });
    y -= 30;
  }

  function yesNo(label: string, value: string | undefined) {
    checkRoom(28);
    page.drawText(label, { x: MARGIN, y, size: 10, font: serif, color: BLACK });
    const isYes = value === "yes", isNo = value === "no";
    const boxSize = 11;
    const boxYesX = W - MARGIN - 110;
    const boxNoX  = W - MARGIN - 50;
    const boxY    = y - 2;
    function box(x: number, checked: boolean, lbl: string) {
      page.drawRectangle({ x, y: boxY, width: boxSize, height: boxSize, borderColor: BLACK, borderWidth: 0.8 });
      if (checked) {
        page.drawLine({ start: { x: x + 1.5, y: boxY + 1.5 }, end: { x: x + boxSize - 1.5, y: boxY + boxSize - 1.5 }, thickness: 1.4, color: BLACK });
        page.drawLine({ start: { x: x + 1.5, y: boxY + boxSize - 1.5 }, end: { x: x + boxSize - 1.5, y: boxY + 1.5 }, thickness: 1.4, color: BLACK });
      }
      page.drawText(lbl, { x: x + boxSize + 4, y: boxY + 2, size: 10, font: serifBold, color: BLACK });
    }
    box(boxYesX, isYes, "Yes");
    box(boxNoX,  isNo,  "No");
    y -= 24;
  }

  function paragraph(label: string, value: string | undefined) {
    if (!value || !value.trim()) return;
    checkRoom(80);
    page.drawText(label, { x: MARGIN, y, size: 8.5, font: serifItal, color: GRAY });
    y -= 12;
    const lineCount = 4, lineSpacing = 16;
    const startY = y;
    for (let i = 0; i < lineCount; i++) {
      const lineY = startY - i * lineSpacing;
      page.drawLine({ start: { x: MARGIN, y: lineY }, end: { x: W - MARGIN, y: lineY }, thickness: 0.4, color: RULE });
    }
    const wrapped: string[] = [];
    const words = value.trim().split(/\s+/);
    let cur = "";
    for (const w of words) {
      if ((cur + " " + w).trim().length > 78) { wrapped.push(cur.trim()); cur = w; }
      else cur = (cur + " " + w).trim();
    }
    if (cur) wrapped.push(cur);
    wrapped.slice(0, lineCount).forEach((line, i) => {
      page.drawText(line, { x: MARGIN + 3, y: startY - i * lineSpacing + 2, size: 10, font: mono, color: BLACK });
    });
    y = startY - lineCount * lineSpacing - 10;
  }

  // ── Render ──
  drawTopBorder();
  page.drawText("VILLA HILLS FIRE PROTECTION DISTRICT", { x: MARGIN, y, size: 12, font: serifBold, color: BLACK });
  y -= 16;
  page.drawText("Volunteer Firefighter Application", { x: MARGIN, y, size: 18, font: serifBold, color: BLACK });
  y -= 14;
  page.drawText("St. Clair County, Illinois  ·  Established 1955", { x: MARGIN, y, size: 9, font: serifItal, color: GRAY });

  const today = data.signatureDate || new Date().toLocaleDateString("en-US");
  const formId = `Form #${(Math.floor(Math.random() * 9000) + 1000).toString()}`;
  page.drawText(formId,           { x: W - MARGIN - 90,  y: y + 30, size: 9, font: monoBold,  color: BLACK });
  page.drawText(`Date: ${today}`, { x: W - MARGIN - 130, y: y + 16, size: 9, font: mono,      color: BLACK });
  page.drawText("CONFIDENTIAL",   { x: W - MARGIN - 75,  y,         size: 8, font: serifBold, color: GRAY });
  y -= 18;

  page.drawText("Please print clearly. All fields marked with answers below were completed and certified by the applicant.",
    { x: MARGIN, y, size: 8.5, font: serifItal, color: GRAY });
  y -= 18;

  section(1, "Personal Information");
  fieldRow([["First Name", data.firstName, 0.5], ["Last Name", data.lastName, 0.5]]);
  fieldRow([["Date of Birth", data.dob, 0.5], ["Phone Number", data.phone, 0.5]]);
  fieldRow([["Email Address", data.email, 1.0]]);
  fieldRow([["Street Address", data.address, 1.0]]);
  fieldRow([["City", data.city, 0.55], ["State", data.state, 0.20], ["ZIP", data.zip, 0.25]]);
  y -= 4;

  section(2, "General Qualifications");
  yesNo("Have you completed the Illinois Basic Operations Firefighter Course?", data.basicOpsClass);
  yesNo("Are you available for Monday night training sessions?", data.mondayTraining);

  section(3, "Military Service");
  yesNo("Have you served in the United States Armed Forces?", data.militaryService);
  if (data.militaryService === "yes") {
    fieldRow([["Branch of Service", data.militaryBranch, 0.5], ["Discharge Status", data.dischargeStatus, 0.5]]);
    fieldRow([["DD-214 Status", data.dd214, 1.0]]);
  }

  section(4, "Medical Credentials");
  yesNo("Are you a licensed First Responder, EMT, or Paramedic in Illinois?", data.medicalLicense);
  if (data.medicalLicense === "yes") {
    fieldRow([["License Type", data.medicalLicenseType, 0.5], ["License Number", data.medicalLicenseNumber, 0.5]]);
    fieldRow([["License Expiration Date", data.medicalLicenseExpiration, 1.0]]);
    yesNo("Have you read and acknowledged the Medical Services Disclaimer?", data.medicalDisclaimer);
  }

  section(5, "Background Information");
  yesNo("Have you ever been convicted of a misdemeanor?", data.convictedMisdemeanor);
  if (data.convictedMisdemeanor === "yes") paragraph("If yes, explain (charge, date, jurisdiction, disposition):", data.misdemeanorExplanation);
  yesNo("Have you ever been convicted of a felony?", data.convictedFelony);
  if (data.convictedFelony === "yes") paragraph("If yes, explain (charge, date, jurisdiction, disposition):", data.felonyExplanation);
  yesNo("Have you ever been convicted of an offense involving moral turpitude?", data.moralTurpitude);
  if (data.moralTurpitude === "yes") paragraph("If yes, explain (charge, date, jurisdiction, disposition):", data.moralTurpitudeExplanation);

  section(6, "Certification & Signature");
  const certLines = [
    "I certify that all information provided in this application is true and complete to the best of my",
    "knowledge. I understand that any misrepresentation or omission of facts may result in disqualification",
    "from consideration or, if discovered after appointment, may be grounds for dismissal. I authorize the",
    "Villa Hills Fire Protection District to conduct any investigation necessary to verify this information.",
  ];
  certLines.forEach((l) => { page.drawText(l, { x: MARGIN, y, size: 9.5, font: serif, color: BLACK }); y -= 12; });
  y -= 12;
  fieldRow([["Applicant Signature", data.signature, 0.65], ["Date Signed", data.signatureDate, 0.35]]);

  y -= 4;
  checkRoom(80);
  page.drawLine({ start: { x: MARGIN, y }, end: { x: W - MARGIN, y }, thickness: 0.6, color: BLACK });
  y -= 14;
  page.drawText("FOR DEPARTMENT USE ONLY", { x: MARGIN, y, size: 9, font: serifBold, color: BLACK });
  y -= 16;
  fieldRow([["Date Received", "", 0.33], ["Reviewed By", "", 0.33], ["Status", "", 0.34]]);
  fieldRow([["Notes", "", 1.0]]);

  drawBottomBorder();
  page.drawText("Villa Hills Fire Protection District  ·  CONFIDENTIAL  ·  Page 1",
    { x: MARGIN, y: MARGIN - 16, size: 7.5, font: serifItal, color: GRAY });

  return doc.save();
}

export function applicationToFormData(app: Application): Record<string, string | undefined> {
  return {
    firstName: app.firstName,
    lastName: app.lastName,
    email: app.email,
    phone: app.phone,
    address: app.address,
    city: app.city,
    state: app.state,
    zip: app.zip,
    dob: app.dob,
    basicOpsClass: app.basicOpsClass,
    mondayTraining: app.mondayTraining,
    militaryService: app.militaryService,
    militaryBranch: app.militaryBranch,
    dischargeStatus: app.dischargeStatus,
    dd214: app.dd214,
    medicalLicense: app.medicalLicense,
    medicalLicenseType: app.medicalLicenseType,
    medicalLicenseNumber: app.medicalLicenseNumber,
    medicalLicenseExpiration: app.medicalLicenseExpiration,
    medicalDisclaimer: app.medicalDisclaimer,
    convictedMisdemeanor: app.convictedMisdemeanor,
    misdemeanorExplanation: app.misdemeanorExplanation,
    convictedFelony: app.convictedFelony,
    felonyExplanation: app.felonyExplanation,
    moralTurpitude: app.moralTurpitude,
    moralTurpitudeExplanation: app.moralTurpitudeExplanation,
    signature: app.signature,
    signatureDate: app.signatureDate,
  };
}
