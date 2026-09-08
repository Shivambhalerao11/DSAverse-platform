import { createApp } from "./app.js"
import { env, isSupabaseConfigured } from "./config/env.js"

const app = createApp()

app.listen(env.port, () => {
  console.log(`[dsaverse-backend] listening on http://localhost:${env.port}`)
  if (!isSupabaseConfigured) {
    console.warn(
      "[dsaverse-backend] Supabase env vars are not set — health check will report " +
        "supabaseConfigured:false and auth-protected routes will return 503. " +
        "See backend/.env.example."
    )
  }
})
