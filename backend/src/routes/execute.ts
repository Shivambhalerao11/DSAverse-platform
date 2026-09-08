import { Router } from "express"
import { requireAuth } from "../middleware/requireAuth.js"
import { executeOnPiston, type OurLanguage } from "../lib/piston.js"

export const executeRouter = Router()

const SUPPORTED_LANGUAGES: OurLanguage[] = ["python", "javascript", "java", "cpp"]

interface ExecuteRequestBody {
  language?: string
  code?: string
  stdin?: string
}

/**
 * Gated behind requireAuth: this endpoint runs arbitrary user-submitted code
 * against a self-hosted sandbox, which is a real abuse/cost vector even
 * though the sandbox itself isolates execution - unauthenticated access to
 * "run compute for free" isn't something to expose by default. No current
 * UI calls this yet (src/components/dsa/DebuggerPanel.tsx, the only caller
 * of the frontend's executeCode(), isn't rendered anywhere in the app as of
 * this session's discovery) - real UI wiring is Phase 4-6.
 */
executeRouter.post("/execute", requireAuth, async (req, res) => {
  const body = req.body as ExecuteRequestBody

  if (!body || typeof body.code !== "string" || body.code.trim() === "") {
    res.status(400).json({ error: "Missing or empty 'code'." })
    return
  }
  if (!body.language || !SUPPORTED_LANGUAGES.includes(body.language as OurLanguage)) {
    res.status(400).json({
      error: `Unsupported or missing 'language'. Supported: ${SUPPORTED_LANGUAGES.join(", ")}.`,
    })
    return
  }

  try {
    const result = await executeOnPiston({
      language: body.language as OurLanguage,
      code: body.code,
      stdin: typeof body.stdin === "string" ? body.stdin : undefined,
    })
    res.status(200).json(result)
  } catch (err) {
    res.status(502).json({ error: `Execution service unavailable: ${String(err instanceof Error ? err.message : err)}` })
  }
})
