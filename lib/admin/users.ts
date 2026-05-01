/**
 * Admin user management — Neon Postgres.
 * Passwords hashed with Node crypto scrypt (no extra deps).
 */

import { neon } from "@neondatabase/serverless";
import { randomBytes, scryptSync, timingSafeEqual } from "crypto";

function sql() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL not set");
  return neon(url);
}

// -- Types --

export interface AdminUser {
  id: string;
  username: string;
  role: "superuser" | "admin";
  createdAt: string;
}

// -- Schema --

async function ensureSchema() {
  const db = sql();
  await db`
    CREATE TABLE IF NOT EXISTS admin_users (
      id            TEXT PRIMARY KEY,
      username      TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role          TEXT NOT NULL DEFAULT 'admin',
      created_at    TIMESTAMPTZ DEFAULT NOW()
    )
  `;
}

// -- Password hashing --

function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const buf = scryptSync(password, salt, 64);
  return timingSafeEqual(buf, Buffer.from(hash, "hex"));
}

// -- Helpers --

function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function rowToUser(row: Record<string, unknown>): AdminUser {
  return {
    id:        String(row.id),
    username:  String(row.username),
    role:      String(row.role) as "superuser" | "admin",
    createdAt: row.created_at instanceof Date
      ? row.created_at.toISOString()
      : String(row.created_at),
  };
}

// -- Public API --

/**
 * Ensure at least one superuser exists.
 * Seeds from ADMIN_USERNAME / ADMIN_PASSWORD env vars on first run.
 */
export async function ensureSuperuser(): Promise<void> {
  await ensureSchema();
  const db = sql();
  const existing = await db`SELECT 1 FROM admin_users WHERE role = 'superuser' LIMIT 1`;
  if (existing.length > 0) return;

  const username = process.env.ADMIN_USERNAME ?? "admin";
  const password = process.env.ADMIN_PASSWORD ?? "VHFD2026!";
  const id = uid();
  const passwordHash = hashPassword(password);
  await db`
    INSERT INTO admin_users (id, username, password_hash, role)
    VALUES (${id}, ${username}, ${passwordHash}, 'superuser')
    ON CONFLICT (username) DO NOTHING
  `;
}

/**
 * Authenticate a user. Returns the user on success, null on failure.
 */
export async function authenticate(username: string, password: string): Promise<AdminUser | null> {
  await ensureSchema();
  await ensureSuperuser();
  const db = sql();
  const rows = await db`SELECT * FROM admin_users WHERE username = ${username} LIMIT 1`;
  if (rows.length === 0) return null;
  const row = rows[0] as Record<string, unknown>;
  if (!verifyPassword(password, String(row.password_hash))) return null;
  return rowToUser(row);
}

/**
 * Change a user's password.
 */
export async function changePassword(userId: string, newPassword: string): Promise<void> {
  await ensureSchema();
  const db = sql();
  const passwordHash = hashPassword(newPassword);
  await db`UPDATE admin_users SET password_hash = ${passwordHash} WHERE id = ${userId}`;
}

/**
 * List all users (no password hashes returned).
 */
export async function listUsers(): Promise<AdminUser[]> {
  await ensureSchema();
  const db = sql();
  const rows = await db`SELECT * FROM admin_users ORDER BY created_at ASC`;
  return (rows as Record<string, unknown>[]).map(rowToUser);
}

/**
 * Create a new user.
 */
export async function createUser(username: string, password: string, role: "superuser" | "admin"): Promise<AdminUser> {
  await ensureSchema();
  const db = sql();
  const id = uid();
  const passwordHash = hashPassword(password);
  await db`
    INSERT INTO admin_users (id, username, password_hash, role)
    VALUES (${id}, ${username}, ${passwordHash}, ${role})
  `;
  return { id, username, role, createdAt: new Date().toISOString() };
}

/**
 * Delete a user by ID.
 */
export async function deleteUser(userId: string): Promise<void> {
  await ensureSchema();
  const db = sql();
  await db`DELETE FROM admin_users WHERE id = ${userId}`;
}

/**
 * Get a user by ID.
 */
export async function getUserById(userId: string): Promise<AdminUser | null> {
  await ensureSchema();
  const db = sql();
  const rows = await db`SELECT * FROM admin_users WHERE id = ${userId} LIMIT 1`;
  if (rows.length === 0) return null;
  return rowToUser(rows[0] as Record<string, unknown>);
}
