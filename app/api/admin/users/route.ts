import { NextRequest, NextResponse } from "next/server";
import { isSuperuser } from "@/lib/admin/auth";
import { listUsers, createUser, deleteUser } from "@/lib/admin/users";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isSuperuser())) return NextResponse.json({ error: "Superuser required" }, { status: 403 });
  const users = await listUsers();
  return NextResponse.json(users);
}

export async function POST(req: NextRequest) {
  if (!(await isSuperuser())) return NextResponse.json({ error: "Superuser required" }, { status: 403 });
  const { username, password, role } = await req.json();
  if (!username?.trim() || !password) {
    return NextResponse.json({ error: "Username and password required" }, { status: 400 });
  }
  if (password.length < 6) {
    return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
  }
  const validRole = role === "superuser" ? "superuser" : "admin";
  try {
    const user = await createUser(username.trim().toLowerCase(), password, validRole);
    return NextResponse.json(user);
  } catch {
    return NextResponse.json({ error: "Username already exists" }, { status: 409 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!(await isSuperuser())) return NextResponse.json({ error: "Superuser required" }, { status: 403 });
  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "Missing user ID" }, { status: 400 });
  await deleteUser(id);
  return NextResponse.json({ ok: true });
}
