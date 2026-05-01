import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthed } from "@/lib/admin/auth";
import {
  getChecklistItems,
  addChecklistItem,
  updateChecklistItem,
  deleteChecklistItem
} from "@/lib/applications/db";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  if (!(await isAdminAuthed())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const applicationId = searchParams.get("applicationId");
  if (!applicationId) {
    return NextResponse.json({ error: "Missing applicationId" }, { status: 400 });
  }

  const items = await getChecklistItems(applicationId);
  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  if (!(await isAdminAuthed())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { applicationId, item } = await req.json();
  if (!applicationId || !item?.trim()) {
    return NextResponse.json({ error: "Missing applicationId or item" }, { status: 400 });
  }

  try {
    const checklistItem = await addChecklistItem(applicationId, item.trim());
    return NextResponse.json(checklistItem);
  } catch {
    return NextResponse.json({ error: "Failed to add checklist item" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  if (!(await isAdminAuthed())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, completed } = await req.json();
  if (!id || typeof completed !== "boolean") {
    return NextResponse.json({ error: "Missing id or invalid completed status" }, { status: 400 });
  }

  try {
    await updateChecklistItem(id, completed);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to update checklist item" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!(await isAdminAuthed())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await req.json();
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  try {
    await deleteChecklistItem(id);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete checklist item" }, { status: 500 });
  }
}