import { Router } from "express"
import { requireAuth } from "../middleware/requireAuth.js"
import { getSupabaseAdmin } from "../lib/supabase.js"

export const usersRouter = Router()

/**
 * Returns the authenticated user's profile row. This is the first real,
 * end-to-end protected round trip: verified Supabase JWT -> req.user.id ->
 * a query scoped to that id, never a fabricated fallback.
 */
usersRouter.get("/users/me", requireAuth, async (req, res) => {
  const userId = req.user!.id

  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).maybeSingle()

  if (error) {
    res.status(502).json({ error: `Supabase query failed: ${error.message}` })
    return
  }

  if (!data) {
    res.status(404).json({ error: "No profile row found for this user yet." })
    return
  }

  res.status(200).json(data)
})
