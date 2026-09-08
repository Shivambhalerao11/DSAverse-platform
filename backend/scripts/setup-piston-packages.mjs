#!/usr/bin/env node
// Installs the language runtimes Piston needs for DSAverse's first-class
// languages (D4: Python, JavaScript, Java, C++), then prints what actually
// got installed so the alias mapping in src/lib/piston.ts can be checked
// against reality.
//
// NOT RUN IN THIS SESSION — no Docker/live Piston instance was available.
// Run this once after `docker compose up -d` in backend/:
//   node scripts/setup-piston-packages.mjs
//
// Piston's package catalog is versioned and can change; this script does
// NOT hardcode version numbers — it reads the live catalog from
// GET /api/v2/packages and installs the latest version of each requested
// language, so it stays correct regardless of exactly which versions are
// currently published.

const PISTON_API_URL = process.env.PISTON_API_URL || "http://localhost:2000"

// Piston's package "language" field is not always the same string as the
// language name Piston's /execute endpoint expects (e.g. JavaScript often
// installs under the package name "node" or "javascript" depending on the
// Piston release) - this is exactly the kind of thing that needs checking
// against the live catalog, so we search by a few candidate names per
// target and report every match rather than assuming one.
const TARGETS = {
  python: ["python", "python3"],
  javascript: ["javascript", "node", "nodejs"],
  java: ["java"],
  cpp: ["c++", "cpp", "gcc"],
}

async function main() {
  console.log(`Fetching package catalog from ${PISTON_API_URL}/api/v2/packages ...`)
  const catalogRes = await fetch(`${PISTON_API_URL}/api/v2/packages`)
  if (!catalogRes.ok) {
    throw new Error(`GET /api/v2/packages failed: ${catalogRes.status} ${await catalogRes.text()}`)
  }
  /** @type {Array<{ language: string, language_version: string, installed: boolean }>} */
  const catalog = await catalogRes.json()

  for (const [ourName, candidates] of Object.entries(TARGETS)) {
    const matches = catalog.filter((pkg) => candidates.includes(pkg.language))
    if (matches.length === 0) {
      console.warn(`[${ourName}] No catalog entry matched any of: ${candidates.join(", ")}. Check the catalog output above manually.`)
      continue
    }

    // Pick the highest version string available (naive but adequate for
    // typical semver-ish Piston version strings like "3.12.0").
    const latest = matches.sort((a, b) => b.language_version.localeCompare(a.language_version, undefined, { numeric: true }))[0]

    if (latest.installed) {
      console.log(`[${ourName}] Already installed: ${latest.language}@${latest.language_version}`)
      continue
    }

    console.log(`[${ourName}] Installing ${latest.language}@${latest.language_version} ...`)
    const installRes = await fetch(`${PISTON_API_URL}/api/v2/packages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ language: latest.language, version: latest.language_version }),
    })
    if (!installRes.ok) {
      console.error(`[${ourName}] Install failed: ${installRes.status} ${await installRes.text()}`)
      continue
    }
    console.log(`[${ourName}] Installed: ${latest.language}@${latest.language_version}`)
  }

  console.log("\nFinal installed runtimes (GET /api/v2/runtimes):")
  const runtimesRes = await fetch(`${PISTON_API_URL}/api/v2/runtimes`)
  console.log(await runtimesRes.text())
  console.log(
    "\nCompare the \"language\" values above against backend/src/lib/piston.ts's LANGUAGE_ALIASES map " +
      "and correct it if Piston's actual language identifiers differ from what's assumed there."
  )
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
