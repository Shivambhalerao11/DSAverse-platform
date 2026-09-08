import "dotenv/config"

function optional(name: string): string | undefined {
  const v = process.env[name]
  return v && v.trim() !== "" ? v : undefined
}

function required(name: string): string {
  const v = optional(name)
  if (!v) throw new Error(`Missing required environment variable: ${name}`)
  return v
}

export const env = {
  port: Number(optional("PORT") ?? 8000),
  nodeEnv: optional("NODE_ENV") ?? "development",
  corsOrigins: (optional("CORS_ORIGINS") ?? "http://localhost:8443")
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean),

  supabaseUrl: optional("SUPABASE_URL"),
  supabaseServiceRoleKey: optional("SUPABASE_SERVICE_ROLE_KEY"),
  supabaseJwtSecret: optional("SUPABASE_JWT_SECRET"),

  geminiApiKey: optional("GEMINI_API_KEY"),
  pistonApiUrl: optional("PISTON_API_URL") ?? "http://localhost:2001",
}

/** Supabase is configured only when all three of its vars are present. Auth routes fail loudly, not silently, when it isn't. */
export const isSupabaseConfigured = Boolean(
  env.supabaseUrl && env.supabaseServiceRoleKey && env.supabaseJwtSecret
)

export { required }
