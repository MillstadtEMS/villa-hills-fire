/**
 * Chief 360 Fire CAD email parser.
 *
 * Tuned for the actual email format Villa Hills receives:
 *
 *   Subject: Chief Alert
 *   Body:    [NN Fire CAD] CALL TYPE -- ADDRESS CITY, ST ZIP -- Box: ... -- Units: ...
 *
 * Strict by design — we only ingest emails that match this exact body
 * pattern AND list a Villa Hills unit (VLHL) in the units list.
 */

const CAD_BODY_RE =
  /\[\d+\s+Fire\s+CAD\]\s+(.+?)\s+--\s+(.+?)\s+--\s+Box:\s+.+?\s+--\s+Units:\s+(.+)/i;

export interface ParsedCall {
  status: "ok";
  dispatchDate: string;     // "MM/DD/YYYY" Chicago-local
  dispatchTime: string;     // "HH:MM" Chicago-local 24h
  dispatchNature: string;   // e.g. "WIRES DOWN"
  dispatchDatetime: string; // ISO-8601 UTC
  sourceYear: number;       // Chicago calendar year
}

export interface ParseFailure {
  status: "failed";
  reason: string;
}

export type ParseResult = ParsedCall | ParseFailure;

function stripSubjectPrefixes(s: string): string {
  return s.replace(/^(?:(?:fwd?|re|fw):\s*)+/i, "").trim();
}

/**
 * Parse a Chief 360 Fire CAD dispatch email.
 *
 * Returns a ParsedCall on success, or ParseFailure with a reason if the
 * email doesn't look like a real Villa Hills dispatch (subject wrong,
 * body doesn't match the [NN Fire CAD] pattern, or no VLHL unit listed).
 */
export function parseDispatchEmail(
  subject: string,
  body: string,
  received: Date,
): ParseResult {
  const cleanSubject = stripSubjectPrefixes(subject);
  if (cleanSubject !== "Chief Alert") {
    return { status: "failed", reason: `Wrong subject: "${cleanSubject}"` };
  }

  const m = body.match(CAD_BODY_RE);
  if (!m) {
    return { status: "failed", reason: "Body does not match [NN Fire CAD] pattern" };
  }

  const [, callType, , units] = m;
  if (!/\bVLHL\b/i.test(units)) {
    return { status: "failed", reason: "No VLHL unit in dispatch" };
  }

  // Build Chicago-local date/time strings from the received date.
  const chicagoStr = received.toLocaleString("en-US", {
    timeZone: "America/Chicago",
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", hour12: false,
  });
  const parts = chicagoStr.match(/(\d{2})\/(\d{2})\/(\d{4}),?\s+(\d{2}):(\d{2})/);
  const dispatchDate = parts ? `${parts[1]}/${parts[2]}/${parts[3]}` : received.toLocaleDateString("en-US");
  const dispatchTime = parts ? `${parts[4]}:${parts[5]}` : received.toLocaleTimeString("en-US");
  const sourceYear = parts ? Number(parts[3]) : new Date().getFullYear();

  return {
    status: "ok",
    dispatchDate,
    dispatchTime,
    dispatchNature: callType.trim(),
    dispatchDatetime: received.toISOString(),
    sourceYear,
  };
}
