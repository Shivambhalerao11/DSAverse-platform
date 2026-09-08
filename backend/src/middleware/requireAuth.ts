import type { NextFunction, Request, Response } from "express"
import jwt from "jsonwebtoken"
import { env, isSupabaseConfigured } from "../config/env.js"

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
 * Verifies a Supabase-issued access token locally against the project's JWT
 * secret (HS256) — no network round-trip to Supabase per request. Rejects
 * loudly with 401 on any missing/invalid/expired token; never falls back to
 * a fabricated session (see docs/dsaverse-2-migration-plan.md §2.3-2.4 for
 * why that pattern is being removed, not repeated).
 */
export function requireAuth(req: Request, res: Response, next: NextFunction): void {
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

  try {
    const claims = jwt.verify(token, env.supabaseJwtSecret as string, {
      algorithms: ["HS256"],
    }) as SupabaseAccessTokenClaims

    req.user = { id: claims.sub, email: claims.email ?? null }
    next()
  } catch {
    res.status(401).json({ error: "Invalid or expired token." })
  }
}
