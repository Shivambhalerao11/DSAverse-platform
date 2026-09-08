import { createClient } from "@supabase/supabase-js"
import dotenv from "dotenv"
dotenv.config()

const SUPABASE_URL = process.env.SUPABASE_URL || "https://tkdasgjcpucrrzvhfvqb.supabase.co"
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const BACKEND_URL = "http://localhost:8000/api/v1"

async function main() {
  console.log("=== 1. Supabase Admin Setup ===")
  const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  const testEmail = "verifier_" + Date.now() + "@dsaverse.dev"
  const testPassword = "Password123!"

  console.log(`Creating auto-confirmed test user: ${testEmail}`)
  const { data: userData, error: createError } = await supabase.auth.admin.createUser({
    email: testEmail,
    password: testPassword,
    email_confirm: true,
  })

  if (createError) {
    console.error("Failed to create admin user:", createError)
    process.exit(1)
  }

  console.log("✓ Test user created:", userData.user.id)

  // Sign in as this user to get a fresh JWT access token
  const { data: signinData, error: signinError } = await supabase.auth.signInWithPassword({
    email: testEmail,
    password: testPassword,
  })

  if (signinError || !signinData.session) {
    console.error("Failed to sign in:", signinError)
    process.exit(1)
  }

  const token = signinData.session.access_token
  console.log("✓ Authenticated session obtained! Token starts with:", token.substring(0, 25) + "...")

  console.log("\n=== 2. Testing Endpoints on Backend ===")

  // 1. Health check
  const healthRes = await fetch(`${BACKEND_URL}/health`)
  console.log("GET /health ->", await healthRes.json())

  // 2. /users/me
  const meRes = await fetch(`${BACKEND_URL}/users/me`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  console.log("GET /users/me ->", await meRes.json())

  // 3. /execute for 4 languages
  const tests = [
    { language: "python", code: "print('Hello from Python!')" },
    { language: "javascript", code: "console.log('Hello from JavaScript!');" },
    {
      language: "java",
      code: "public class Main { public static void main(String[] args) { System.out.println(\"Hello from Java!\"); } }",
    },
    {
      language: "cpp",
      code: "#include <iostream>\nint main() { std::cout << \"Hello from C++!\" << std::endl; return 0; }",
    },
  ]

  console.log("\n=== 3. Executing Code via Piston ===")
  for (const t of tests) {
    console.log(`\nTesting ${t.language.toUpperCase()}...`)
    const res = await fetch(`${BACKEND_URL}/execute`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(t),
    })
    const data = await res.json()
    console.log(`Status: ${res.status}`)
    console.log("Result:", JSON.stringify(data, null, 2))
  }
}

main().catch(console.error)
