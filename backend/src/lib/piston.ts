import { env } from "../config/env.js"

/**
 * Client for a self-hosted Piston instance (D4). NOT exercised against a
 * live Piston server in this session - no Docker was available (verified:
 * `docker --version` not found). The request/response shapes here are
 * written against Piston's documented API v2; verify field names against a
 * real response once `docker compose up` has run (see backend/README notes
 * in docs/dsaverse-2-migration-plan.md Phase 2).
 */

export type OurLanguage = "python" | "javascript" | "java" | "cpp"

/**
 * Maps our language keys to the candidate Piston package/runtime "language"
 * strings to try, in order. Piston's naming isn't perfectly predictable
 * across releases (see setup-piston-packages.mjs) - resolveRuntime() below
 * checks the live /api/v2/runtimes list rather than trusting index 0 blindly.
 */
const LANGUAGE_ALIASES: Record<OurLanguage, string[]> = {
  python: ["python", "python3"],
  javascript: ["javascript", "node", "nodejs"],
  java: ["java"],
  cpp: ["c++", "cpp", "gcc"],
}

interface PistonRuntime {
  language: string
  version: string
  aliases: string[]
}

interface RuntimeCache {
  fetchedAt: number
  runtimes: PistonRuntime[]
}

let cache: RuntimeCache | null = null
const CACHE_TTL_MS = 60_000

async function getRuntimes(): Promise<PistonRuntime[]> {
  if (cache && Date.now() - cache.fetchedAt < CACHE_TTL_MS) {
    return cache.runtimes
  }
  const res = await fetch(`${env.pistonApiUrl}/api/v2/runtimes`)
  if (!res.ok) {
    throw new Error(`Piston /api/v2/runtimes failed: ${res.status} ${await res.text()}`)
  }
  const runtimes = (await res.json()) as PistonRuntime[]
  cache = { fetchedAt: Date.now(), runtimes }
  return runtimes
}

/** Resolves our language key to an installed Piston (language, version) pair, or throws with a clear message if none is installed. */
async function resolveRuntime(ourLanguage: OurLanguage): Promise<{ language: string; version: string }> {
  const runtimes = await getRuntimes()
  const candidates = LANGUAGE_ALIASES[ourLanguage]

  for (const candidate of candidates) {
    const match = runtimes.find((r) => r.language === candidate || r.aliases?.includes(candidate))
    if (match) return { language: match.language, version: match.version }
  }

  throw new Error(
    `No installed Piston runtime found for "${ourLanguage}" (tried: ${candidates.join(", ")}). ` +
      "Run backend/scripts/setup-piston-packages.mjs against the live Piston instance first."
  )
}

export interface PistonExecuteResult {
  stdout: string
  stderr: string
  exitCode: number
  runtimeMs: number
  memoryKb: number
  compilationError?: string
}

interface PistonRunResult {
  stdout: string
  stderr: string
  output: string
  code: number | null
  signal: string | null
  // Timing/memory fields are reported inconsistently across Piston
  // versions/configs - treated as optional here, defaulted to 0 below.
  cpu_time?: number
  wall_time?: number
  memory?: number
}

interface PistonExecuteResponse {
  language: string
  version: string
  run: PistonRunResult
  compile?: PistonRunResult
}

export async function executeOnPiston(params: {
  language: OurLanguage
  code: string
  stdin?: string
}): Promise<PistonExecuteResult> {
  const { language, version } = await resolveRuntime(params.language)

  const res = await fetch(`${env.pistonApiUrl}/api/v2/execute`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      language,
      version,
      files: [{ name: fileNameFor(params.language), content: params.code }],
      stdin: params.stdin ?? "",
      // Piston defaults are generally sane; these caps bound worst-case
      // resource use for a public-facing execute endpoint.
      compile_timeout: 10_000,
      run_timeout: 5_000,
      compile_memory_limit: -1,
      run_memory_limit: -1,
    }),
  })

  if (!res.ok) {
    throw new Error(`Piston /api/v2/execute failed: ${res.status} ${await res.text()}`)
  }

  const data = (await res.json()) as PistonExecuteResponse

  const compilationError =
    data.compile && data.compile.code !== 0 ? data.compile.stderr || data.compile.output : undefined

  return {
    stdout: data.run.stdout ?? "",
    stderr: data.run.stderr ?? "",
    exitCode: data.run.code ?? -1,
    runtimeMs: Math.round(data.run.wall_time ?? 0),
    memoryKb: data.run.memory ? Math.round(data.run.memory / 1024) : 0,
    compilationError,
  }
}

function fileNameFor(language: OurLanguage): string {
  switch (language) {
    case "python":
      return "main.py"
    case "javascript":
      return "main.js"
    case "java":
      // Piston's Java package expects a public class named Main.
      return "Main.java"
    case "cpp":
      return "main.cpp"
  }
}
