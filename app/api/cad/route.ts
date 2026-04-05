import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// Called by StatusBar every 60 seconds — reads from DB, not Gmail directly
export async function GET() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    return NextResponse.json({ incident: null });
  }

  const sql = neon(dbUrl);

  try {
    const rows = await sql`
      SELECT call_type, location, units, received_at
      FROM incidents
      ORDER BY received_at DESC
      LIMIT 1
    `;

    if (rows.length === 0) {
      return NextResponse.json({ incident: null });
    }

    const row = rows[0];
    return NextResponse.json({
      incident: {
        type: row.call_type,
        location: row.location,
        units: row.units,
        receivedAt: row.received_at,
      },
    });
  } catch (err) {
    console.error("CAD read error:", err);
    return NextResponse.json({ incident: null });
  }
}
