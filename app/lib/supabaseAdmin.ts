import "server-only";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

/** true si la clé service_role est configurée côté serveur. */
export const isSupabaseAdminConfigured = Boolean(supabaseUrl && serviceRoleKey);

if (!isSupabaseAdminConfigured) {
  console.warn(
    "SUPABASE_SERVICE_ROLE_KEY n'est pas configurée : l'API /api/share ne pourra pas créer de partages."
  );
}

/**
 * ⚠️ Ce client utilise la clé service_role, qui contourne toutes les règles
 * RLS. Il ne doit JAMAIS être importé depuis un fichier "use client" ni
 * exposé au navigateur — uniquement depuis app/api/**\/route.ts.
 */
export const supabaseAdmin = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  serviceRoleKey || "placeholder-service-role-key",
  { auth: { persistSession: false } }
);
