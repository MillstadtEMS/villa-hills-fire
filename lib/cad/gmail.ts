/**
 * Gmail API client for reading Chief 360 dispatch emails.
 * Cloned from millstadt-ems with the search query changed for Villa Hills FD.
 *
 * Auth: OAuth2 with a stored refresh token for villahillscad@gmail.com.
 * The refresh token is obtained once (see setup instructions in .env.example)
 * and stored as an environment variable. The client auto-refreshes the access
 * token on every poll so no manual intervention is needed.
 *
 * Required env vars:
 *   GMAIL_CLIENT_ID
 *   GMAIL_CLIENT_SECRET
 *   GMAIL_REFRESH_TOKEN
 *   GMAIL_USER          (villahillscad@gmail.com)
 */

import { google } from "googleapis";

// ── OAuth2 client ──────────────────────────────────────────────────────────

function getOAuthClient() {
  const { GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET, GMAIL_REFRESH_TOKEN } = process.env;

  if (!GMAIL_CLIENT_ID || !GMAIL_CLIENT_SECRET || !GMAIL_REFRESH_TOKEN) {
    throw new Error(
      "Missing Gmail OAuth2 credentials. Set GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET, GMAIL_REFRESH_TOKEN in .env"
    );
  }

  const auth = new google.auth.OAuth2(GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET);
  auth.setCredentials({ refresh_token: GMAIL_REFRESH_TOKEN });
  return auth;
}

// ── Types ──────────────────────────────────────────────────────────────────

export interface RawEmail {
  id: string;        // Gmail message ID (deduplication key)
  from: string;      // Sender email address (lowercase)
  subject: string;
  body: string;      // Plain text (HTML stripped)
  received: Date;    // Date the email was delivered
}

// ── Fetch unread dispatch emails ───────────────────────────────────────────

/**
 * Search Gmail for unread Chief 360 fire dispatch emails.
 * Returns raw email data — parsing happens separately in parser.ts.
 *
 * Default search: from:alert@cfmsg.co OR from the inbox itself (forwarded
 * test alerts), subject "Chief Alert" or "Fwd: Chief Alert", and unread.
 */
export async function fetchUnreadDispatchEmails(): Promise<RawEmail[]> {
  const auth   = getOAuthClient();
  const gmail  = google.gmail({ version: "v1", auth });
  const userId = process.env.GMAIL_USER ?? "villahillscad@gmail.com";

  const searchQuery = process.env.GMAIL_SEARCH_QUERY
    ?? `(from:alert@cfmsg.co OR from:${userId}) subject:"Chief Alert" is:unread`;

  const listRes = await gmail.users.messages.list({
    userId,
    q: searchQuery,
    maxResults: 50,
  });

  const messages = listRes.data.messages ?? [];
  if (messages.length === 0) return [];

  const emails: RawEmail[] = [];

  for (const msg of messages) {
    if (!msg.id) continue;

    const full = await gmail.users.messages.get({
      userId,
      id: msg.id,
      format: "full",
    });

    const payload  = full.data.payload;
    const headers  = payload?.headers ?? [];
    const subject  = headers.find(h => h.name === "Subject")?.value ?? "(no subject)";
    const dateHdr  = headers.find(h => h.name === "Date")?.value;
    const received = dateHdr ? new Date(dateHdr) : new Date();
    const fromHdr  = headers.find(h => h.name === "From")?.value ?? "";
    const fromMatch = fromHdr.match(/<([^>]+)>/) ?? fromHdr.match(/(\S+@\S+)/);
    const from = (fromMatch?.[1] ?? fromHdr).toLowerCase().trim();

    const body = extractPlainText(payload);

    emails.push({ id: msg.id, from, subject, body, received });
  }

  return emails;
}

/**
 * Mark a Gmail message as read so it won't be returned on the next poll.
 * Called after successful (or failed) processing.
 */
export async function markAsRead(messageId: string): Promise<void> {
  const auth   = getOAuthClient();
  const gmail  = google.gmail({ version: "v1", auth });
  const userId = process.env.GMAIL_USER ?? "villahillscad@gmail.com";

  await gmail.users.messages.modify({
    userId,
    id: messageId,
    requestBody: { removeLabelIds: ["UNREAD"] },
  });
}

// ── Body extraction helpers ────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractPlainText(payload: any): string {
  if (!payload) return "";

  if (payload.mimeType === "text/plain" && payload.body?.data) {
    return decodeBase64(payload.body.data);
  }

  if (payload.mimeType === "text/html" && payload.body?.data) {
    return stripHtml(decodeBase64(payload.body.data));
  }

  if (payload.parts && Array.isArray(payload.parts)) {
    for (const part of payload.parts) {
      if (part.mimeType === "text/plain" && part.body?.data) {
        return decodeBase64(part.body.data);
      }
    }
    for (const part of payload.parts) {
      if (part.mimeType === "text/html" && part.body?.data) {
        return stripHtml(decodeBase64(part.body.data));
      }
      if (part.mimeType?.startsWith("multipart/")) {
        const nested = extractPlainText(part);
        if (nested) return nested;
      }
    }
  }

  return "";
}

function decodeBase64(data: string): string {
  return Buffer.from(data.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf-8");
}

function stripHtml(html: string): string {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, "\"")
    .replace(/\s+/g, " ")
    .trim();
}
