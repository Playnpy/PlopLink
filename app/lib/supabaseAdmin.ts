import "server-only";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

/** true if the service_role key is configured server-side. */
export const isSupabaseAdminConfigured = Boolean(supabaseUrl && serviceRoleKey);

if (!isSupabaseAdminConfigured) {
  console.warn(
    "SUPABASE_SERVICE_ROLE_KEY is not configured: the /api/share endpoint won't be able to create shares."
  );
}

/**
 * ⚠️ This client uses the service_role key, which bypasses all RLS rules.
 * NEVER import this file from a "use client" component or expose it to the
 * browser — only from app/api/**\/route.ts.
 */
export const supabaseAdmin = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  serviceRoleKey || "placeholder-service-role-key",
  { auth: { persistSession: false } }
);
