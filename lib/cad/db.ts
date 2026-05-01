/**
 * CAD Call database — Neon Postgres (serverless).
 * Simplified from Millstadt EMS: no closeout logic.
 * Calls persist indefinitely — the most recent one shows on the ticker.
 */

import { neon } from "@neondatabase/serverless";

function sql() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL not set");
  return neon(url);
}

// -- Types --

export interface Call {
  id: string;
  dispatchDatetime: string;
  dispatchDate: string;
  dispatchTime: string;
  dispatchNature: string;
  sourceYear: number;
  createdAt: string;
}

// -- Schema --

async function ensureSchema() {
  const db = sql();
  await db`
    CREATE TABLE IF NOT EXISTS cad_calls (
      id               TEXT PRIMARY KEY,
      gmail_message_id TEXT UNIQUE NOT NULL,
      dispatch_datetime TIMESTAMPTZ NOT NULL,
      dispatch_date    TEXT NOT NULL,
      dispatch_time    TEXT NOT NULL,
      dispatch_nature  TEXT NOT NULL,
      source_year      INTEGER NOT NULL,
      created_at       TIMESTAMPTZ DEFAULT NOW()
    )
  `;
}

// -- Helpers --

function nowChicago(): Date {
  return new Date(new Date().toLocaleString("en-US", { timeZone: "America/Chicago" }));
}

export function currentChicagoYear(): number {
  return nowChicago().getFullYear();
}

function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function rowToCall(row: Record<string, unknown>): Call {
  return {
    id:               String(row.id),
    dispatchDatetime: row.dispatch_datetime instanceof Date
      ? row.dispatch_datetime.toISOString()
      : String(row.dispatch_datetime),
    dispatchDate:     String(row.dispatch_date),
    dispatchTime:     String(row.dispatch_time),
    dispatchNature:   String(row.dispatch_nature),
    sourceYear:       Number(row.source_year),
    createdAt:        row.created_at instanceof Date
      ? row.created_at.toISOString()
      : String(row.created_at),
  };
}

// -- Public API --

export async function isDuplicate(gmailMessageId: string): Promise<boolean> {
  await ensureSchema();
  const db = sql();
  const rows = await db`SELECT 1 FROM cad_calls WHERE gmail_message_id = ${gmailMessageId} LIMIT 1`;
  return rows.length > 0;
}

export async function saveCall(data: {
  gmailMessageId: string;
  dispatchDatetime: string;
  dispatchDate: string;
  dispatchTime: string;
  dispatchNature: string;
  sourceYear: number;
}): Promise<Call> {
  await ensureSchema();
  const db = sql();
  const id = uid();
  await db`
    INSERT INTO cad_calls
      (id, gmail_message_id, dispatch_datetime, dispatch_date, dispatch_time, dispatch_nature, source_year)
    VALUES
      (${id}, ${data.gmailMessageId}, ${data.dispatchDatetime}, ${data.dispatchDate},
       ${data.dispatchTime}, ${data.dispatchNature}, ${data.sourceYear})
    ON CONFLICT (gmail_message_id) DO NOTHING
  `;
  const rows = await db`SELECT * FROM cad_calls WHERE gmail_message_id = ${data.gmailMessageId}`;
  return rowToCall(rows[0] as Record<string, unknown>);
}

export async function getLatestCalls(limit = 10): Promise<Call[]> {
  await ensureSchema();
  const db = sql();
  const rows = await db`
    SELECT * FROM cad_calls
    ORDER BY dispatch_datetime DESC
    LIMIT ${limit}
  `;
  return (rows as Record<string, unknown>[]).map(rowToCall);
}

export async function getCallsForCurrentYear(): Promise<Call[]> {
  await ensureSchema();
  const db = sql();
  const year = currentChicagoYear();
  const rows = await db`
    SELECT * FROM cad_calls
    WHERE source_year = ${year}
    ORDER BY dispatch_datetime DESC
  `;
  return (rows as Record<string, unknown>[]).map(rowToCall);
}

export async function updateCallNature(callId: string, newNature: string): Promise<void> {
  await ensureSchema();
  const db = sql();
  await db`UPDATE cad_calls SET dispatch_nature = ${newNature} WHERE id = ${callId}`;
}

export async function deleteCall(callId: string): Promise<void> {
  await ensureSchema();
  const db = sql();
  await db`DELETE FROM cad_calls WHERE id = ${callId}`;
}
