import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthed } from "@/lib/admin/auth";
import { getApplication } from "@/lib/applications/db";
import { buildApplicationPDF, applicationToFormData } from "@/lib/applications/pdf";

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const app = await getApplication(id);
  if (!app) {
    return NextResponse.json({ error: "Application not found" }, { status: 404 });
  }

  const pdfBytes = await buildApplicationPDF(applicationToFormData(app));
  const safeName = `${app.firstName}_${app.lastName}`.replace(/[^a-zA-Z0-9_]+/g, "_");

  return new NextResponse(Buffer.from(pdfBytes), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="Application_${safeName}.pdf"`,
      "Cache-Control": "private, no-store",
    },
  });
}
