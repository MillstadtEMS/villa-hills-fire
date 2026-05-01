import { NextRequest, NextResponse } from "next/server";
import { makeSessionToken, sessionCookieOptions } from "@/lib/admin/auth";
import { authenticate } from "@/lib/admin/users";

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();
  if (!username || !password) {
    return NextResponse.json({ error: "Username and password required" }, { status: 400 });
  }
  const user = await authenticate(username, password);
  if (!user) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }
  const token = makeSessionToken(user.id, user.role);
  const res = NextResponse.json({ ok: true, role: user.role });
  res.cookies.set(sessionCookieOptions(token));
  return res;
}
