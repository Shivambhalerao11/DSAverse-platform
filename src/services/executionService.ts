// Code Execution Service Client — talks to the real backend /execute route
// (backend/src/routes/execute.ts), which proxies to a self-hosted Piston
// instance (D4). This used to silently fall back to a templated fake
// "Program finished successfully" response on any failure — that pattern is
// exactly what this migration exists to remove (see
// docs/dsaverse-2-migration-plan.md §2.3/§2.7), so it's gone: a failure here
// is now a real thrown error, not a fabricated success.

export interface CodeExecutionRequest {
  language: string
  code: string
  stdin?: string
}

export interface CodeExecutionResponse {
  stdout: string
  stderr: string
  exitCode: number
  runtimeMs: number
  memoryKb: number
  compilationError?: string
}

// First-class languages actually wired to the Piston backend (D4). Not the
// 13-language wishlist the old simulation pretended to support — expanding
// this list means installing the matching Piston package
// (backend/scripts/setup-piston-packages.mjs) and adding it to
// backend/src/lib/piston.ts's LANGUAGE_ALIASES first.
export const SUPPORTED_LANGUAGES = ["python", "javascript", "java", "cpp"] as const

/** Requires an authenticated session — the backend's /execute route is requireAuth-gated (see backend/src/routes/execute.ts). */
export async function executeCode(req: CodeExecutionRequest): Promise<CodeExecutionResponse> {
  const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1'
  const token = localStorage.getItem('dsaverse-auth-token') || sessionStorage.getItem('dsaverse-auth-token')

  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(`${apiBase}/execute`, {
    method: 'POST',
    headers,
    body: JSON.stringify(req),
  })

  if (!res.ok) {
    const errorText = await res.text()
    throw new Error(errorText || `Code execution failed: ${res.status} ${res.statusText}`)
  }

  return (await res.json()) as CodeExecutionResponse
}
