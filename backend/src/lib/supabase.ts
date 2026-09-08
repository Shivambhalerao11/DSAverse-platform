import { createClient, type SupabaseClient } from "@supabase/supabase-js"
import { env, isSupabaseConfigured } from "../config/env.js"

let _client: SupabaseClient | null = null

/**
 * Server-side Supabase client using the service role key — bypasses Row-Level
 * Security, so every query here MUST be scoped by hand to the verified
 * req.user.id from requireAuth. Never forward this client or its key to the
 * frontend.
 */
export function getSupabaseAdmin(): SupabaseClient {
  if (!isSupabaseConfigured) {
    throw new Error(
      "Supabase is not configured (SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY / SUPABASE_JWT_SECRET). " +
        "Set these in backend/.env — see backend/.env.example."
    )
  }
  if (!_client) {
    _client = createClient(env.supabaseUrl as string, env.supabaseServiceRoleKey as string, {
      auth: { autoRefreshToken: false, persistSession: false },
    })
  }
  return _client
}
