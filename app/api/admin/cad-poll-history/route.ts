import { NextResponse } from "next/server";
import { isAdminAuthed } from "@/lib/admin/auth";
import { getPollHistory } from "@/lib/cad/db";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAdminAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const rows = await getPollHistory(100);
  return NextResponse.json(rows);
}
