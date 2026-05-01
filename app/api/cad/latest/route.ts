/**
 * GET /api/cad/latest
 * Returns the 10 most recent calls (public — no sensitive data).
 */

import { NextResponse } from "next/server";
import { getLatestCalls } from "@/lib/cad/db";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const calls = await getLatestCalls(10);
    return NextResponse.json(calls);
  } catch {
    return NextResponse.json([]);
  }
}
