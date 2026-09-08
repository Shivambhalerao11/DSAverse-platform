import { Router } from "express"
import { isSupabaseConfigured } from "../config/env.js"

export const healthRouter = Router()

healthRouter.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    time: new Date().toISOString(),
    supabaseConfigured: isSupabaseConfigured,
  })
})
