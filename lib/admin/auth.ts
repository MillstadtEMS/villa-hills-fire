import { createHmac } from "crypto";
import { cookies } from "next/headers";

const COOKIE = "vhfd_admin";
const MAX_AGE = 60 * 60 * 8; // 8 hours

function secret(): string {
  return process.env.SESSION_SECRET ?? process.env.ADMIN_PASSWORD ?? "changeme";
}

function sign(value: string): string {
  return createHmac("sha256", secret()).update(value).digest("hex");
}

/**
 * Session token format: userId:role:timestamp.signature
 */
export function makeSessionToken(userId: string, role: string): string {
  const payload = `${userId}:${role}:${Date.now()}`;
  return `${payload}.${sign(payload)}`;
}

export function verifySessionToken(token: string): { userId: string; role: string } | null {
  const dotIdx = token.lastIndexOf(".");
  if (dotIdx === -1) return null;
  const payload = token.slice(0, dotIdx);
  const sig = token.slice(dotIdx + 1);
  if (sign(payload) !== sig) return null;

  const [userId, role, ts] = payload.split(":");
  if (!userId || !role || !ts) return null;
  if (Date.now() - Number(ts) > MAX_AGE * 1000) return null;

  return { userId, role };
}

export async function isAdminAuthed(): Promise<boolean> {
  const session = await getSession();
  return session !== null;
}

export async function getSession(): Promise<{ userId: string; role: string } | null> {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export async function isSuperuser(): Promise<boolean> {
  const session = await getSession();
  return session?.role === "superuser";
}

export function sessionCookieOptions(token: string) {
  return {
    name: COOKIE,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge: MAX_AGE,
    path: "/",
  };
}
