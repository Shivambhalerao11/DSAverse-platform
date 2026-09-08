#!/usr/bin/env node
// Checks available runtimes on the public Piston API (emkc.org) and
// prints which of DSAverse's required languages are available.
//
// Run: node scripts/setup-piston-packages.mjs

const PISTON_API_URL = process.env.PISTON_API_URL || "https://emkc.org/api/v2/piston"

const TARGETS = {
  python: ["python", "python3"],
  javascript: ["javascript", "node", "nodejs"],
  java: ["java"],
  cpp: ["c++", "cpp", "gcc"],
  typescript: ["typescript", "ts-node"],
  go: ["go", "golang"],
  rust: ["rust"],
  csharp: ["csharp", "mono", "dotnet"],
}

async function main() {
  console.log(`\nFetching runtimes from ${PISTON_API_URL}/api/v2/runtimes ...\n`)

  let runtimes
  try {
    const res = await fetch(`${PISTON_API_URL}/api/v2/runtimes`)
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${await res.text()}`)
    }
    runtimes = await res.json()
  } catch (err) {
    console.error("Failed to fetch runtimes:", err.message)
    process.exit(1)
  }

  console.log(`Total runtimes available: ${runtimes.length}\n`)
  console.log("DSAverse language mapping check:")
  console.log("─".repeat(50))

  for (const [ourName, candidates] of Object.entries(TARGETS)) {
    const match = runtimes.find(
      (r) =>
        candidates.includes(r.language) ||
        r.aliases?.some((a) => candidates.includes(a))
    )
    if (match) {
      console.log(`  ✓ ${ourName.padEnd(14)} -> ${match.language}@${match.version}`)
    } else {
      console.warn(`  ✗ ${ourName.padEnd(14)} -> NOT FOUND (tried: ${candidates.join(", ")})`)
    }
  }

  console.log("\n" + "─".repeat(50))
  console.log("Done. Update LANGUAGE_ALIASES in src/lib/piston.ts if any ✗ entries appear above.")
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
