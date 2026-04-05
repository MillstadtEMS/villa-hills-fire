import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  if (searchParams.get("token") !== "vhfd-reset-2026") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sql = neon(process.env.DATABASE_URL!);
  await sql`TRUNCATE TABLE incidents RESTART IDENTITY`;
  return NextResponse.json({ ok: true, message: "Incidents cleared — status bar will show In Service." });
}
