import type { NextFunction, Request, Response } from "express"
import jwt from "jsonwebtoken"
import { env, isSupabaseConfigured } from "../config/env.js"
import { getSupabaseAdmin } from "../lib/supabase.js"

export interface AuthedUser {
  id: string
  email: string | null
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: AuthedUser
    }
  }
}

interface SupabaseAccessTokenClaims {
  sub: string
  email?: string
  exp: number
}

/**
 * Verifies a Supabase-issued access token. First tries fast local verification
 * (for HS256 tokens), and falls back to Supabase client verification (for ES256 / ECC asymmetric tokens).
 */
export async function requireAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
  if (!isSupabaseConfigured) {
    res.status(503).json({ error: "Auth is not configured on this server yet (Supabase env vars missing)." })
    return
  }

  const header = req.headers.authorization
  if (!header || !header.startsWith("Bearer ")) {
    res.status(401).json({ error: "Missing Authorization: Bearer <token> header." })
    return
  }

  const token = header.slice("Bearer ".length)

  // 1. Try local HS256 verification
  try {
    const claims = jwt.verify(token, env.supabaseJwtSecret as string, {
      algorithms: ["HS256"],
    }) as SupabaseAccessTokenClaims

    req.user = { id: claims.sub, email: claims.email ?? null }
    next()
    return
  } catch {
    // If local HS256 fails (e.g. Supabase uses ES256 asymmetric signing), verify with Supabase Auth API
  }

  try {
    const supabase = getSupabaseAdmin()
    const { data: { user }, error } = await supabase.auth.getUser(token)

    if (error || !user) {
      console.error("[requireAuth] supabase.auth.getUser error:", error)
      res.status(401).json({ error: "Invalid or expired token.", details: error?.message })
      return
    }

    req.user = { id: user.id, email: user.email ?? null }
    next()
  } catch (err) {
    console.error("[requireAuth] catch error:", err)
    res.status(401).json({ error: "Invalid or expired token.", details: String(err) })
  }
}

