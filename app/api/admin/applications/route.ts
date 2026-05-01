import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthed } from "@/lib/admin/auth";
import {
  getApplications,
  getApplication,
  updateApplicationStatus,
  getChecklistItems,
  addChecklistItem,
  updateChecklistItem,
  deleteChecklistItem
} from "@/lib/applications/db";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAdminAuthed())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const applications = await getApplications();
  return NextResponse.json(applications);
}

export async function PATCH(req: NextRequest) {
  if (!(await isAdminAuthed())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, status, notes } = await req.json();
  if (!id || !status) {
    return NextResponse.json({ error: "Missing id or status" }, { status: 400 });
  }

  if (!["pending", "approved", "denied", "waitlisted"].includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  try {
    await updateApplicationStatus(id, status, notes);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to update application" }, { status: 500 });
  }
}