import { NextResponse } from "next/server";
import { isSupabaseAdminConfigured, supabaseAdmin } from "@/app/lib/supabaseAdmin";
import { CATEGORIES, type PocketItem } from "@/app/types";

export const runtime = "nodejs";

const MAX_ITEMS = 20;
const MAX_CONTENT_LENGTH = 500_000; // ~500 Ko par élément (couvre des images raisonnables en base64)
const MAX_PAYLOAD_BYTES = 4_000_000; // 4 Mo au total par partage
const SHARE_TTL_DAYS = 7;

const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 5;

// ⚠️ Limiteur en mémoire : suffisant comme première barrière contre le spam,
// mais il repart de zéro à chaque redémarrage/instance froide de la fonction
// serverless. Pour une vraie protection à l'échelle, remplacez par un store
// partagé (ex. Upstash Redis) si le trafic augmente.
const requestLog = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (requestLog.get(ip) ?? []).filter((timestamp) => now - timestamp < WINDOW_MS);
  recent.push(now);
  requestLog.set(ip, recent);
  return recent.length > MAX_REQUESTS_PER_WINDOW;
}

function isValidItem(item: unknown): item is PocketItem {
  if (!item || typeof item !== "object") return false;
  const candidate = item as Record<string, unknown>;
  return (
    typeof candidate.id === "string" &&
    candidate.id.length > 0 &&
    candidate.id.length <= 100 &&
    typeof candidate.content === "string" &&
    candidate.content.length > 0 &&
    candidate.content.length <= MAX_CONTENT_LENGTH &&
    typeof candidate.createdAt === "string" &&
    candidate.createdAt.length <= 100 &&
    typeof candidate.category === "string" &&
    (CATEGORIES as readonly string[]).includes(candidate.category) &&
    (candidate.title === undefined || (typeof candidate.title === "string" && candidate.title.length <= 300))
  );
}

export async function POST(request: Request) {
  if (!isSupabaseAdminConfigured) {
    return NextResponse.json({ error: "Service indisponible pour le moment." }, { status: 503 });
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: "Trop de requêtes, réessayez dans une minute." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Corps de requête invalide." }, { status: 400 });
  }

  const items = (body as { items?: unknown })?.items;
  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: "Aucun élément à partager." }, { status: 400 });
  }
  if (items.length > MAX_ITEMS) {
    return NextResponse.json({ error: `Maximum ${MAX_ITEMS} éléments par partage.` }, { status: 400 });
  }

  const payloadSize = new TextEncoder().encode(JSON.stringify(items)).length;
  if (payloadSize > MAX_PAYLOAD_BYTES) {
    return NextResponse.json({ error: "Le contenu sélectionné est trop volumineux." }, { status: 413 });
  }

  if (!items.every(isValidItem)) {
    return NextResponse.json({ error: "Format d'élément invalide." }, { status: 400 });
  }

  const expiresAt = new Date(Date.now() + SHARE_TTL_DAYS * 24 * 60 * 60 * 1000).toISOString();

  const { data, error } = await supabaseAdmin
    .from("shares")
    .insert({ items, expires_at: expiresAt })
    .select("id")
    .single();

  if (error || !data) {
    console.error("Erreur lors de la création du partage", error);
    return NextResponse.json({ error: "Échec de l'enregistrement." }, { status: 500 });
  }

  return NextResponse.json({ id: data.id });
}
