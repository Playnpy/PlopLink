import { NextResponse } from "next/server";
import { isSupabaseAdminConfigured, supabaseAdmin } from "@/app/lib/supabaseAdmin";
import { CATEGORIES } from "@/app/types";

export const runtime = "nodejs";

const MAX_ITEMS = 20;
const MAX_CONTENT_LENGTH = 500_000; // ~500 KB per item (covers reasonably-sized base64 images)
const MAX_PAYLOAD_BYTES = 4_000_000; // 4 MB total per share
const SHARE_TTL_DAYS = 7;

const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 5;

// ⚠️ In-memory limiter: good enough as a first line of defense against
// spam, but it resets on every cold start/serverless instance restart. For
// real protection at scale, replace it with a shared store (e.g. Upstash
// Redis) once traffic grows.
const requestLog = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (requestLog.get(ip) ?? []).filter((timestamp) => now - timestamp < WINDOW_MS);
  recent.push(now);
  requestLog.set(ip, recent);
  return recent.length > MAX_REQUESTS_PER_WINDOW;
}

function validateItem(item: unknown): string | null {
  if (!item || typeof item !== "object") return "not an object";
  const candidate = item as Record<string, unknown>;

  if (typeof candidate.id !== "string" || candidate.id.length === 0) return "missing id";
  if (candidate.id.length > 100) return "id too long";
  if (typeof candidate.content !== "string" || candidate.content.length === 0) return "missing content";
  if (candidate.content.length > MAX_CONTENT_LENGTH) {
    return `content too long (${candidate.content.length} chars, max ${MAX_CONTENT_LENGTH})`;
  }
  if (typeof candidate.createdAt !== "string") return "missing createdAt";
  if (candidate.createdAt.length > 100) return "createdAt too long";
  if (typeof candidate.category !== "string") return "missing category";
  if (!(CATEGORIES as readonly string[]).includes(candidate.category)) {
    return `unknown category "${candidate.category}"`;
  }
  if (candidate.title !== undefined && (typeof candidate.title !== "string" || candidate.title.length > 300)) {
    return "title invalid or too long";
  }
  return null;
}

export async function POST(request: Request) {
  if (!isSupabaseAdminConfigured) {
    return NextResponse.json({ error: "Service temporarily unavailable." }, { status: 503 });
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: "Too many requests, try again in a minute." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const items = (body as { items?: unknown })?.items;
  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: "No items to share." }, { status: 400 });
  }
  if (items.length > MAX_ITEMS) {
    return NextResponse.json({ error: `Maximum ${MAX_ITEMS} items per share.` }, { status: 400 });
  }

  const payloadSize = new TextEncoder().encode(JSON.stringify(items)).length;
  if (payloadSize > MAX_PAYLOAD_BYTES) {
    return NextResponse.json({ error: "The selected content is too large." }, { status: 413 });
  }

  for (let i = 0; i < items.length; i++) {
    const reason = validateItem(items[i]);
    if (reason) {
      return NextResponse.json({ error: `Item ${i + 1} is invalid: ${reason}.` }, { status: 400 });
    }
  }

  const expiresAt = new Date(Date.now() + SHARE_TTL_DAYS * 24 * 60 * 60 * 1000).toISOString();

  const { data, error } = await supabaseAdmin
    .from("shares")
    .insert({ items, expires_at: expiresAt })
    .select("id")
    .single();

  if (error || !data) {
    console.error("Error creating the share", error);
    return NextResponse.json({ error: "Failed to save." }, { status: 500 });
  }

  return NextResponse.json({ id: data.id });
}
