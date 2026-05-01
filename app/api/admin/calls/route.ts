import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthed } from "@/lib/admin/auth";
import { neon } from "@neondatabase/serverless";

export const dynamic = "force-dynamic";

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export async function POST(req: NextRequest) {
  if (!(await isAdminAuthed())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { dispatchDate, dispatchTime, dispatchNature } = await req.json();
  if (!dispatchDate || !dispatchTime || !dispatchNature?.trim()) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }
  const id = uid();
  const gmailMessageId = `manual-${id}`;
  const [year, month, day] = dispatchDate.split("-");
  const formattedDate = `${month}/${day}/${year}`;
  const dispatchDatetime = `${dispatchDate}T${dispatchTime}:00`;
  const sourceYear = parseInt(year, 10);
  const db = neon(process.env.DATABASE_URL!);
  await db`
    INSERT INTO cad_calls
      (id, gmail_message_id, dispatch_datetime, dispatch_date, dispatch_time,
       dispatch_nature, source_year)
    VALUES
      (${id}, ${gmailMessageId}, ${dispatchDatetime},
       ${formattedDate}, ${dispatchTime}, ${dispatchNature.trim()}, ${sourceYear})
  `;
  return NextResponse.json({ ok: true });
}

export async function PATCH(req: NextRequest) {
  if (!(await isAdminAuthed())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id, dispatchNature } = await req.json();
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  const db = neon(process.env.DATABASE_URL!);
  if (typeof dispatchNature === "string") {
    await db`UPDATE cad_calls SET dispatch_nature = ${dispatchNature.trim()} WHERE id = ${id}`;
  }
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  if (!(await isAdminAuthed())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await req.json();
  const db = neon(process.env.DATABASE_URL!);
  await db`DELETE FROM cad_calls WHERE id = ${id}`;
  return NextResponse.json({ ok: true });
}
