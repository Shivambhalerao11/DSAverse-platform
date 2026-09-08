# DSAverse 2.0 Migration Plan

**Status:** Phase 0 complete and approved. Decisions D1–D5 resolved (§7).
Phase 1 (backend scaffold + Supabase auth) done and verified where this
sandbox allows — one open item needs the user (a live Supabase project).
Awaiting check-in before Phase 2 (Piston code execution).
**Branch:** `dsaverse-2-migration`
**Last updated:** 2026-09-08

> Methodology note: every factual claim below is backed by a file this session
> actually opened and read, or a command this session actually ran. Where a
> command's output is the evidence, the command is shown. Nothing here is
> inferred from what a project "usually" has. Anything not verified is
> explicitly marked **unverified**.

---

## 1. Executive Summary

DSAverse today is a **100% client-side React app with no backend of any
kind**. Every "backend", "auth", and "AI" integration in the codebase is a
`fetch()` call to `http://localhost:8000/api/v1` (a FastAPI server that does
not exist anywhere in this repo or its dependency tree) that **always fails**
in this environment and falls back to a hardcoded mock response. XP, streaks,
badges, notes, and assignments all live in `localStorage`. There is no
database, no server code (no `.py`, no `Dockerfile`, no SQL), and no auth
library in `package.json` — only `react`, `react-dom`, and dev tooling.

The Claude Design ("DSAverse Lab") is a **LeetCode-style problem workspace**:
a 184-problem library (table of title/difficulty/pattern/attempts), a
workspace screen (statement + approach on the left; a synchronized
visualizer + code editor + terminal on the right), a profile page
(submission heatmap, XP/level, topic mastery, activity feed, bookmarks), and
a legacy "DSA Worlds" section with an 11-topic taxonomy that **does not match**
the current app's 16-topic taxonomy. Of the 184 listed problems, exactly
**one** (#206, Reverse Linked List) has a real, hand-authored, step-by-step
visualization; the other 183 are static table rows with no visualization
data behind them — this is direct evidence for why the "AI-generates-
visualization-data" phase is necessary at scale.

A second, important discovery: this repo already contains an **unexecuted
spec** at `.kiro/specs/interactive-dsa-visualization-engine/` (requirements,
design, and a 56-task plan, all still `[ ]` unchecked) that targets almost
exactly the code↔visualization synchronization problem this migration cares
about. It should inform, not be duplicated by, the plan below.

Baseline verified this session: `npx tsc --noEmit` passes with zero errors,
`npm run build` succeeds (22 lazy-loaded chunks, react-vendor 189KB), and
`npm run dev` serves HTTP 200 on port 8443.

---

## 2. Repo Discovery (Phase 0 evidence)

### 2.1 Stack — verified via `package.json`

```json
"dependencies": { "react": "^19.0.0", "react-dom": "^19.0.0", "@rolldown/binding-win32-x64-msvc": "^1.2.3" },
"devDependencies": { "@tailwindcss/vite", "@types/node", "@types/react", "@types/react-dom",
                      "@vitejs/plugin-react", "oxfmt", "tailwindcss", "typescript", "vite" }
```

No routing library, no state-management library, no HTTP client library, no
auth SDK, no AI SDK (`openai`, `@google/generative-ai`, etc.), no database
client, no test runner (no `vitest`/`jest`, and no `"test"` script in
`package.json`). `tsconfig.json` has `"strict": true`. Confirmed via
`npx tsc --noEmit` (0 errors) and `npm run build` (succeeds) this session.

### 2.2 Routing / App shell

`src/App.tsx` is a hand-rolled state router: a `View` union type, a
`ROUTE_MAP` to `window.history.pushState`, and a big conditional render list
inside `<Suspense>`. Auth gating is client-only:

```ts
// src/App.tsx:234-238
if (PROTECTED_VIEWS.includes(target)) {
  const token = localStorage.getItem('dsaverse-auth-token') || sessionStorage.getItem('dsaverse-auth-token')
  if (!token) target = 'auth'
}
```

Any string can be written to `dsaverse-auth-token` in devtools to "log in" —
there is no server to validate it.

### 2.3 "Backend" — does not exist

`src/services/api.ts` is explicitly commented `// Production FastAPI Service
Client for DSAVerse Backend (/api/v1/)`, but every exported function follows
the same pattern: try `fetch` against `VITE_API_BASE_URL` (defaults to
`http://localhost:8000/api/v1`), and on **any** failure (there is no server,
so this always throws), return a hardcoded mock object and, in several
cases, write a fake JWT (`'jwt-token-production-mock-12345'`) to
`localStorage` as if login succeeded:

```ts
// src/services/api.ts:83-99 (loginUser)
} catch (err) {
  ...
  const mockRes = { token: 'jwt-token-production-mock-12345', user: { id: 'usr-1', ... } }
  localStorage.setItem('dsaverse-auth-token', mockRes.token)
  return mockRes
}
```

Confirmed no server code exists anywhere in the tree:
`find . -iname "*.py" -o -iname "requirements.txt" -o -iname "Dockerfile" -o -iname "*.sql"` → no results
(searched excluding `node_modules`). No `.env`/`.env.example` file exists
either — every `VITE_*` var referenced in code is unset in this repo.

### 2.4 Auth — client-only, OAuth is simulated

`src/services/auth/{authService,githubAuth,googleAuth}.ts`: real OAuth URL
construction exists (`getGithubOAuthUrl`, `getGoogleOAuthUrl` build correct
`accounts.google.com`/`github.com` authorize URLs), but when no
`VITE_GITHUB_CLIENT_ID`/`VITE_GOOGLE_CLIENT_ID` is set (never is, here), it
redirects to a **self-generated mock code**:

```ts
// src/services/auth/githubAuth.ts:31-39
export function initiateGithubLogin(): void {
  if (CLIENT_ID) { window.location.href = getGithubOAuthUrl() }
  else {
    const mockCode = `mock_github_code_${Date.now()}`
    window.location.href = `${window.location.origin}/login?provider=github&code=${mockCode}`
  }
}
```

`handleOAuthCallback` in `authService.ts` then tries to POST that code to a
backend that doesn't exist, catches the failure, and fabricates a session.
Session storage is pure `localStorage`/`sessionStorage` (`authService.ts:5-6,33-37`).

### 2.5 XP / streak / gamification — localStorage only, dashboard data is hardcoded

`src/services/xpService.ts` reads/writes `localStorage` keys directly
(`dsaverse-user-xp`, `dsaverse-user-streak`, `dsaverse-user-badges`). There
is no server-side leaderboard — `getGlobalLeaderboard()` literally returns a
single-entry array containing only the current browser's user
(`xpService.ts:87-98`, comment: `// Honest Leaderboard Representation`).

`src/pages/Dashboard.tsx` renders a leaderboard, achievements list, and
recommended-problems list from **hardcoded arrays in the component file**
(`Sofia Cruz`, `Priya Sharma`, `Marcus Lee`, etc. — `Dashboard.tsx:23-44`),
not from `xpService` or any data source. `src/services/teacherService.ts`
similarly persists assignments to a `localStorage` key
(`dsaverse-assignments-db`) seeded with two hardcoded `DEFAULT_ASSIGNMENTS`.

### 2.6 AI — multi-provider factory exists, defaults to mock, client-side keys

`src/services/ai/AIFactory.ts` picks a provider via `VITE_AI_PROVIDER`
(`openai`/`gemini`/`mock`), defaulting to `MockProvider` when unset (always,
here) or when the corresponding API key env var is missing. `GeminiProvider`
and `OpenAIProvider` call the vendor APIs **directly from the browser**:

```ts
// src/services/ai/GeminiProvider.ts:16
const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`
```

This means if `VITE_GEMINI_API_KEY`/`VITE_OPENAI_API_KEY` were ever set, the
key would ship in the client bundle (Vite inlines `VITE_*` vars at build
time) — a real credential-exposure risk to flag for the target architecture,
not just a migration nice-to-have.

### 2.7 Code execution — 100% simulated, no sandbox

`src/services/executionService.ts` also tries a backend `/execute` endpoint
first, then falls back to `simulateLocalExecution()`, which returns
templated strings like `"Program finished successfully.\nOutput: Hello from
DSAVerse Python Engine!"` regardless of what the user's code actually does
(`executionService.ts:73-98`). **No language is actually executed or
compiled anywhere in this codebase.** `SUPPORTED_LANGUAGES` lists 13
languages (`executionService.ts:18-32`) — all equally fake.

### 2.8 Visualization engine — the type contract exists; the sync it implies does not work

`src/types/algorithmStep.ts` defines a clean, documented
`AlgorithmStep<TState>` contract (`stepIndex`, `description`, `stateSnapshot`,
`variables`, `complexity`, `highlights: { activeIndices, compareIndices,
swapIndices, foundIndex, activeNodes, activeEdges, codeLine }`). 11 files
under `src/engines/` implement `StepGenerator` functions against this
contract (verified: `arrayEngine.ts`, `backtrackEngine.ts`, `dpEngine.ts`,
`graphEngine.ts`, `greedyEngine.ts`, `hashTableEngine.ts`, `heapEngine.ts`,
`linkedListEngine.ts`, `sortSearchEngine.ts`, `treeEngine.ts`, `trieEngine.ts`).

**But the `codeLine` half of the contract is not wired to the UI anywhere.**
Verified two ways:
- `grep -rn "activeLine" src/pages` → **zero matches**. No page passes
  `activeLine` into `DSAWorkspace`.
- `DSAWorkspace.tsx:593` falls back to a fabricated value when `activeLine`
  isn't supplied: `activeLine={activeLine ?? ((stepIndex || 0) % 4) + 1}` —
  a modulo cycle with no relationship to the actual executing line.
- Only 2 of 11 engines (`arrayEngine.ts`, `treeEngine.ts`) even populate
  `highlights.codeLine` in their step output (`grep -c codeLine
  src/engines/*` → 8 occurrences total, 2 files). The other 9 engines never
  set it.

So the "code panel highlights the line matching the current visualization
step" behavior — which the type contract implies exists — **does not
function in the shipped app today**, for any of the 16 modules. This is a
real gap, not a "check if it already works" formality, and it's the exact
gap `.kiro/specs/interactive-dsa-visualization-engine/requirements.md`
Requirement 20 was written to close.

`src/components/dsa/useVisualization.ts` is a solid, generic, well-tested-
looking playback hook (play/pause/step/speed/goToStep over a precomputed
`steps[]` array) — this part is reusable as-is and matches the "steps[]
computed once, playback is pure index movement" pattern the new engine
should keep.

### 2.9 Pre-existing unexecuted spec: `.kiro/specs/interactive-dsa-visualization-engine/`

This directory (requirements.md, design.md, tasks.md, all Kiro-authored)
proposes exactly the fix for §2.8: a `src/engine/` layer
(`types.ts`, `useStepPlayer.ts`, `parseInput.ts`, `runners/*.ts` with
`CANONICAL_CODE` co-located per runner so `codeLine` numbers can't drift),
plus new pages for Heap/Hash/Trie/Greedy/Backtrack (already since built —
see §2.10) and an "Interview Patterns" arena. **All 56 tasks in `tasks.md`
are unchecked; none of this has been implemented.** `design.md` explicitly
states existing UI (`DSALayout`, `CodePanel`, `BottomWorkspace`, etc.) is
meant to stay unchanged — the engine is meant to plug into it. This plan
should treat that spec as a **candidate blueprint to adapt**, not redo from
scratch, since it already solved the requirements-gathering step for the
"visualization sync" and "per-module unit tests" parts of scope.

### 2.10 DSA Worlds — 16 topics, all present and building

`src/App.tsx:23-27` and `src/components/DSALayout.tsx:29-64` both define the
same 16-topic list across 3 sections (Foundations: array, strings,
linkedlist, stack, queue; Intermediate: trees, sorting, searching, bst,
heap, hashtables; Advanced: graphs, dp, trie, greedy, backtrack). Each has a
lazy-loaded page in `src/pages/`. Verified `ArrayWorld.tsx` end-to-end: pure
input parsing → calls `arrayEngine.ts` step generators → renders
`ArrayVisualizer` + `DSAWorkspace`. This pattern is consistent with what
`.kiro`'s design.md describes as the target pattern, confirming the existing
architecture is a reasonable foundation, not something to discard.

Two competing layout components exist and both render DSA topic UI:
`src/components/DSALayout.tsx` (older, simpler `activeWorkspaceTab` starts
`null`) and `src/components/dsa/DSAWorkspace.tsx` (newer, richer — has the
XP badge, step-playback bar, and the fake `activeLine` fallback).
`ArrayWorld.tsx` uses `DSAWorkspace`; **unverified** which of the other 16
pages use which layout — needs a per-page audit before Phase to avoid
wiring the visualization engine into a layout that's about to be dropped.

### 2.11 Baseline verified working (this session)

- `npm install` → 44 packages, installs clean.
- `npx tsc --noEmit` → 0 errors (strict mode).
- `npm run build` → succeeds, 22 separate lazy chunks, largest is
  `react-vendor` at 189.58 kB (59.61 kB gzip).
- `npm run dev` (port 8443) → `curl -s -o /dev/null -w "%{http_code}"` → `200`.

---

## 3. Claude Design Analysis

**Fetched successfully** via the design tool against project
`4c2a1ba7-aad4-40ec-963e-dc5d3fa68234` (owner-confirmed name: *"Linked-list
reversal prototype"*, type `PROJECT_TYPE_PROJECT`). Files present:
`DSAverse Lab.dc.html` (the canvas/prototype) and `support.js` (the Claude
Design canvas runtime — generic templating engine, not product code; not
analyzed further, it carries no product logic).

The `.dc.html` file is a **single-file interactive prototype** — one
`Component extends DCLogic` class with `state = { screen, authMode, query,
diff, status, step, playing, speed, xp, ... }` driving six conditionally-
rendered screens. It is a design-tool mock, not a real app: all data is
either hardcoded inline (`RAW` problem list, `MASTERY`, `ACTIVITY`,
`WORLDS` arrays) or procedurally faked (the submission heatmap uses a
seeded pseudo-random function, not real data).

### 3.1 Screens (verified from the fetched file)

**Auth** — split-screen: left is marketing copy ("Stop reading algorithms.
Watch them run.") plus a small animated fake trace preview; right is a
sign-in/create-account form (handle/email/password) and a "Continue with
GitHub" button. All fields have `defaultValue`s pre-filled
(`arnav@iitk.ac.in`). Submitting anything just calls `goLab` — no
validation, no real auth call.

**Lab / Library** — the new home screen. A "resume session" card (last
problem, tests passed, time since edit), a "today" streak card (`3 of 4
problems`), then the **Problem Library**: search box, difficulty filter
(ALL/EASY/MEDIUM/HARD), state filter (ANY/SOLVED/UNSOLVED/BOOKMARKED), a
topic-tag filter row, and a table (checkbox-state icon / # / title /
difficulty / pattern tags / attempts / bookmark). Backed by a 184-row
pipe-delimited string (`RAW`) hardcoded in the script — real LeetCode
problem numbers/titles/tags (Two Sum, 3Sum, Reverse Linked List, etc.),
each with a fake solved/attempted/new state and attempt count.

**Workspace** — the core new feature. Left panel: tags, problem statement,
3 worked examples, constraints, then a prose "Approach" write-up with
inline color-coded pointer names (`prev`/`curr`/`next`) and a time/space
complexity callout. Right column, stacked: (1) **Visualizer** — a bordered
canvas showing linked-list nodes as boxes with directional arrows (lime =
already-flipped edge, hairline = original edge), a caption line showing
`L{{lineNo}}` + a plain-English description of the current step, and a
transport bar (reset/step-back/play-pause/step-forward/speed-cycle/scrubber
+ step counter); (2) **Editor** — language tabs (C++17/Python/Java/Go, only
C++ has real content), Run/Submit buttons, and code lines that highlight
when `l.n === currentLine`; (3) **Terminal** — output panel (idle/running/
done states with a pass-count summary), not fully captured in this excerpt
but state-driven off `term: "idle"|"running"|"done"`.

Critically: **the visualizer, the editor's highlighted line, and the
caption are all driven by one `STEPS` array built by a single hand-written
`buildSteps()` function specific to the Reverse Linked List problem**
(`DSAverse Lab.dc.html`, `buildSteps()`). This *is* the same
`AlgorithmStep[]`-driven-by-`useStepPlayer` shape the current codebase
already has (§2.8) — the design didn't invent a new contract, it's a
polished restatement of the same idea, scoped to one problem.

**Mobile** — responsive workspace: header collapses to a 3-tab bar
(PROBLEM / VISUAL / CODE) inside a simulated 390px phone frame, with
Run/Submit pinned to a 56px thumb-reachable bottom bar. This is presented
as a design spec/annotation screen (explains *why* the layout collapses this
way) as much as a literal screen to ship.

**Profile** — avatar + handle + school + join date; 4 stat tiles (solved,
streak, level, acceptance %); a 26-week submission heatmap (GitHub-style,
4 intensity levels); an XP/level progress bar with quartile ticks and a
"SIMULATE +45 XP" demo button; 3 weekly stat tiles (this week XP, best
streak, avg/day); a **Topic Mastery** grid (10 pattern categories —
"Arrays & Hashing", "Two Pointers", "Sliding Window", etc. — each a
percentage bar); a recent-activity feed (title/verdict/time, colored by
pass/fail); a bookmarks list.

**DSA Worlds (legacy)** — explicitly labeled `LEGACY SECTION · STILL
MAINTAINED` in the design itself. A table of **11** worlds (not 16):
Arrays & Indexing, Strings & Chars, Two Pointers, Stacks & Queues, Linked
Lists, Recursion & Trees, Graphs, Heaps & Intervals, Dynamic Programming,
Backtracking, Advanced Structures — each with an exercise-count progress
bar, locked/in-progress/cleared state, and a one-line copy: *"Your Lab
progress unlocks worlds automatically."*

### 3.2 What's static vs. what needs real wiring

| Design element | Static in prototype | Real system it must connect to |
|---|---|---|
| Problem list (184 rows) | Hardcoded `RAW` string | Problem database/content store |
| Solved/attempted/bookmark state | Hardcoded per-row flag | Per-user submission + bookmark records |
| Reverse Linked List visualizer | One hand-written `STEPS` array | Generalized `AlgorithmStep[]` per problem (existing contract, §2.8) |
| Code editor content/language tabs | Only C++ has real lines; other tabs are inert | Real per-language solution content + execution |
| Run / Submit | `setTimeout` fakes a 1.2–1.4s "run", always "8/8 passed" | Real code execution + test-case grading |
| XP / streak / level / toast | In-memory `state.xp`, animated on a fake "SIMULATE +45 XP" button | Real progress service tied to actual submissions |
| Submission heatmap | Seeded pseudo-random generator | Real per-day submission counts |
| Topic mastery % | Hardcoded array | Derived from real per-tag solve data |
| Auth screen | Any submit navigates to Lab | Real session/auth |
| "DSA Worlds" 11-topic list + lock state | Hardcoded array, arbitrary lock rule (`done===0 && i>6`) | Reconciled against the real 16 DSA World topics (see Decision D1) |

### 3.3 Interactions/animations that need to become real behavior

- Playback transport (reset/step/play/scrub/speed) — direct match for the
  existing `useVisualization`/`useStepPlayer` pattern; low risk to port.
- Line-highlight-follows-step in the editor — needs the `codeLine` sync
  fix from §2.8, generalized to arbitrary languages (design shows this
  only for C++; the current app's `CodePanel` is language-aware already).
- Filter/search/sort over the problem table — pure client-side state in the
  prototype; fine to keep client-side once problems come from a real store,
  but should be paginated/indexed once the store is real (184 problems is
  small, but is expected to be the permanent scale per the brief, not a
  placeholder to grow past).
- XP toast + level bar animation — cosmetic, portable as-is once driven by
  real submission events instead of a demo button.
- Submission heatmap — needs a real per-day aggregation query once accounts
  exist; the visual design (4-level GitHub-style grid) is portable as-is.

---

## 4. Gap Analysis

Legend: **Reuse** = works as-is or near-as-is · **Modify** = exists, needs
real rework · **New** = does not exist, must be built.

| Area | Current state (verified) | Target need | Verdict |
|---|---|---|---|
| Frontend framework/build | React 19 + Vite 8 + Tailwind v4, TS strict, lazy-chunked pages | Same, plus a problem-library/workspace UI in the new visual language | **Reuse** the toolchain; **New** UI surfaces |
| Routing | Hand-rolled `View` string-union + `pushState` | Needs `/lab`, `/lab/:id`, `/worlds/...`, `/profile`, `/login` etc. | **Modify** — extend `ROUTE_MAP`/`View`, keep the pattern (no reason to add a router lib for this scale) |
| Backend/API server | **None** — all `fetch` calls target a nonexistent `localhost:8000` and silently fall back to mocks | Node/Express + TS, `/api/v1`, deployed to Railway/Render (D2) | **New**, entirely |
| Database | **None** | Postgres via Supabase: profiles, problems, submissions, progress, bookmarks, classes/assignments (D2, D3) | **New**, entirely |
| Auth | Client-only fake tokens, simulated OAuth redirects | Supabase Auth (client-side `supabase-js`) issuing JWTs the Express backend verifies (D2) | **New** backend verification middleware; **Replace** the simulated OAuth exchange in `githubAuth.ts`/`googleAuth.ts` with Supabase's built-in OAuth handling |
| XP/streak/progress | `localStorage` counters, hardcoded dashboard leaderboard | Server-persisted, multi-user, real leaderboard | **New** backend; **Modify** `xpService.ts` into an API client keeping its function signatures |
| Problem content | Doesn't exist (DSA Worlds pages, not "problems") | 100–200 curated problems w/ statement, examples, constraints, solution(s), visualization data | **New** |
| Code execution | Fully simulated (`executionService.ts`) | Self-hosted Piston via Docker; Python/JS/Java/C++ first (D4), landed early (Phase 2) | **New** |
| Visualization engine (contract) | `AlgorithmStep<T>` type exists, well-designed | Same shape works for problems too | **Reuse** the type contract |
| Visualization engine (wiring) | `codeLine` populated in only 2/11 engines; **never** consumed by any page (§2.8) | Every problem's code execution must drive the visualizer per-line | **Modify/rebuild** — this is the `.kiro` spec's job, generalized to also cover problems, not just DSA Worlds |
| Visualization data authoring at scale | 1 problem, hand-authored (`buildSteps()` in the design) | 100–200 problems | **New** — needs the deterministic/traced/LLM-hybrid pipeline the brief calls for (own later phase) |
| AI tutor/assistant | Real multi-provider factory + Mock default; Gemini/OpenAI call the vendor API **from the browser** with a client-exposed key | Gemini only (D5), proxied through the backend | **Modify** — reuse `AIProvider` interface, move network calls behind a backend proxy |
| DSA Worlds (16 topics) | Fully built, builds clean, `useVisualization` hook is solid | Must keep working, reachable from new nav; all 16 stay (D1) | **Reuse** the pages/engines; **Modify** navigation/shell only (per user's "preserve capability, not the old UI" instruction) |
| Teacher dashboard | Exists, `localStorage`-backed | In scope (D3) — real backend wiring (Phase 7) | **Modify** `teacherService.ts` into a real API client |
| Tests | **None** — no test runner installed, no test files exist despite `.kiro` spec calling for `vitest`-style unit tests | Per-runner unit tests per `.kiro` requirements | **New** — install a test runner as part of engine work |

---

## 5. Target Architecture (finalized per Decisions D1–D5, §7)

**Frontend stays React 19 + Vite 8 + Tailwind v4, hand-rolled router
extended, not replaced.** The existing router is small, already handles
protected routes and lazy loading, and the new design's screens (`auth`,
`lab`, `ws`, `mobile`, `profile`, `worlds`) map cleanly onto more `View`
union members and `ROUTE_MAP` entries. Introducing React Router or similar
would touch all 20 existing pages for a benefit the current app doesn't
need at this scale.

**Backend: Node.js + Express + TypeScript, in a new `backend/` directory in
this repo (D2).** Shares types (`AlgorithmStep`, API DTOs) with the frontend
via a small shared-types package or path, matches the existing `/api/v1`
convention already assumed by `src/services/api.ts`, and needs no new
language toolchain in an already-TypeScript-strict codebase.

**Data + auth: Supabase (managed Postgres + Auth) (D2).** Auth flow: the
frontend authenticates directly against Supabase Auth via `@supabase/
supabase-js` (email/password + GitHub/Google OAuth — Supabase handles the
OAuth exchange itself, which replaces the simulated flow in `githubAuth.ts`/
`googleAuth.ts`, §2.4) and receives a Supabase-issued JWT. The Express
backend never issues its own tokens — it **verifies** the Supabase JWT on
every protected route (via Supabase's JWKS/JWT secret) and uses the
verified `user.id` to scope all queries. Postgres (via Supabase) holds
`profiles`, `problems`, `submissions`, `bookmarks`, `xp_events`,
`classes`/`assignments` (for the Teacher Dashboard, D3). Row-Level Security
policies enforce per-user scoping at the DB layer as a second line of
defense behind the Express auth middleware.

**Deploy target: Railway or Render, not serverless (D2).** Code execution
(next paragraph) needs a persistent, long-lived process that can talk to a
sibling Piston container over the private network — this rules out
serverless functions (Vercel/Netlify-style), which cannot host a
co-located Docker daemon or hold a warm connection to one.

**Code execution: self-hosted Piston via Docker, no paid execution API
(D4).** [Piston](https://github.com/engineer-man/piston) runs as its own
container (official image `ghcr.io/engineer-man/piston`), and the Express
backend proxies `/api/v1/execute` to Piston's HTTP API. First-class
languages: **Python, JavaScript, Java, C++** (matches the design's editor
language tabs plus the team's stated priority — Go and the other 9
languages `executionService.ts` currently fakes are explicitly deferred,
not promised). This lands in Phase 2, immediately after the backend
scaffold — per the team's explicit instruction that real execution is core
to the product, not a stretch feature, it is **not** deferred to the
problem-library phase the way the original Phase 0 draft had it.

**Visualization stays deterministic and decoupled from real code
execution.** The type contract already in `src/types/algorithmStep.ts` is
sound and the design's prototype uses the same shape. For the ~100-200
curated problems, visualization data should be **pre-generated at content-
authoring time** (deterministic step generators / execution tracing against
the *reference* solution, per the brief's later AI-pipeline phase) and
served as data, not computed live from arbitrary user-submitted code. This
matches what's already built for the 16 DSA Worlds (engines run upfront,
`steps[]` is static, playback is pure index movement) and avoids the much
harder, more fragile problem of mapping arbitrary student code in 4+
languages to visualization state in real time. Live user code only goes
through Piston for pass/fail + stdout; the *visualizer* plays the
canonical, pre-traced reference solution.

**AI tutor: Gemini, proxied through the new backend (D5).** `GeminiProvider.ts`
is already the stubbed provider and the team's existing preference
elsewhere, so it becomes the sole AI path going forward (OpenAI/Mock
providers stay in the codebase as the existing `AIProvider` interface's
other implementations but are not wired to a live key). The interface
(`sendMessage(prompt, context)`) is already provider-agnostic; the only real
problem (§2.6) is that a real API key would currently leak into the client
bundle. The backend holds `GEMINI_API_KEY` server-side and proxies
`/api/v1/ai/tutor` — no frontend interface change.

**DSA Worlds: all 16 topics stay the source of truth; the design's nav is
extended, not the app's content collapsed (D1).** The design's "legacy"
11-topic grouping was made without visibility into the real app's 16 built,
working topics (Searching, BST, Hash Tables, Trie, and Greedy as their own
entries, §2.10) — collapsing to match the mockup would delete real,
working content to fit a wireframe. The new shell's worlds-nav is extended
to list all 16, grouped using the design's Foundations/Intermediate/
Advanced-style presentation rather than its specific 11-item list. Per the
user's standing instruction, preserving capability doesn't mean preserving
the old UI: the 11 engine files and `useVisualization` hook are reusable;
`DSALayout.tsx` and `DSAWorkspace.tsx` (two competing shells, §2.10) get
consolidated into one shell matching the new visual language, reusing
`CodePanel`/visualizer components underneath.

**Teacher Dashboard stays in scope (D3).** `TeacherDashboard.tsx` and
`teacherService.ts` get wired to real backend data (`classes`,
`assignments`, `assignment_submissions` tables) alongside the student-facing
build-out rather than being frozen or dropped — see Phase 7.

---

## 6. Phased Plan

Phase 0 is the analysis above. Phase order below is revised from the
original Phase-0 draft to reflect D4 explicitly: **code execution moves up
to Phase 2**, immediately after the backend scaffold, instead of being
deferred to the problem-library phase.

### Phase 1 — Backend scaffold + Supabase auth ✅ done, verified where this sandbox allows
- **Objective:** Stand up a real Express + TypeScript backend with a
  health-checked `/api/v1` base and real Supabase-backed authentication, so
  every later phase has something real to call instead of a fallback mock.
- **Prerequisites:** none — decisions resolved.
- **What was built:** `backend/` — Express + TS scaffold (`src/app.ts`,
  `src/index.ts`), env loader (`src/config/env.ts`, fails loudly rather than
  silently defaulting when Supabase vars are missing — the opposite of the
  §2.3 pattern this migration exists to remove), a Supabase admin client
  (`src/lib/supabase.ts`, service-role key, server-side only), a
  `requireAuth` middleware (`src/middleware/requireAuth.ts`) that verifies
  Supabase-issued JWTs locally via `SUPABASE_JWT_SECRET` (HS256, no
  network round-trip per request), a `GET /api/v1/health` route, a
  protected `GET /api/v1/users/me` route as the first real end-to-end
  round trip, and a `profiles` table SQL migration
  (`backend/db/migrations/0001_init_profiles.sql`) with RLS policies and an
  `on_auth_user_created` trigger so every signup gets a profile row
  automatically. `.env.example` added for both `backend/` and the repo root
  (frontend `VITE_*` vars documented now, not wired into `src/services/`
  yet — that's Phase 5). Root `.gitignore` fixed with a `!**/.env.example`
  exception (`.env*` was blocking the example files themselves, not just
  real secrets).
- **Verified this session:**
  - `cd backend && npm install && npx tsc --noEmit` → 0 errors.
  - `npm run build` → succeeds (`tsc` emits `dist/`).
  - Booted `node dist/index.js` and, with curl:
    - `GET /api/v1/health` → `200 {"status":"ok","supabaseConfigured":false}`
      with no env vars set, and `supabaseConfigured:true` once Supabase vars
      are present — proves the "fail loudly, report status honestly" env
      handling actually works in both states, not just on paper.
    - `GET /api/v1/users/me` with no Supabase configured → `503` with a
      clear message (not a fabricated profile).
    - Same route with Supabase vars set (a fake project) and no
      `Authorization` header → `401 "Missing Authorization: Bearer <token>
      header."`
    - Same route with a garbage token → `401 "Invalid or expired token."`
    - Same route with a **correctly HS256-signed** token (signed with the
      same `SUPABASE_JWT_SECRET`, proving the verify path itself is
      correct) → passes auth, `req.user.id` reaches the Supabase query,
      and fails honestly with `502 "Supabase query failed: ..."` because
      the project URL is a fake placeholder — this is the expected/correct
      failure mode for a fake project, not a bug.
    - Unknown route → `404`.
  - Root frontend `npx tsc --noEmit` and `npm run build` re-run after the
    backend scaffold was added → still 0 errors, still succeeds (this phase
    doesn't touch `src/`).
- **What could not be verified in this sandbox (needs the user):** an
  actual Supabase project doesn't exist yet. To close this out: (1) create
  a Supabase project, (2) run `backend/db/migrations/0001_init_profiles.sql`
  in its SQL editor, (3) copy `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` /
  `SUPABASE_JWT_SECRET` (Project Settings → API) into `backend/.env`, (4)
  sign up a real user via Supabase Auth (e.g. the Supabase dashboard's Auth
  UI, or `supabase-js` from a scratch script) and confirm `GET /api/v1/
  users/me` with that user's real access token returns their profile row
  (200, not 502/503).
- **Acceptance criteria:** met for everything buildable without a live
  Supabase project (see above); the live-project round trip is the one
  remaining open item, explicitly not silently assumed done.

### Phase 2 — Code execution: self-hosted Piston
- **Objective:** Real Run/Submit for Python, JavaScript, Java, C++ — no more
  `simulateLocalExecution()` (§2.7). Landed early per D4.
- **Prerequisites:** Phase 1's Express scaffold.
- **Areas touched:** `docker-compose.yml` for the Piston container; backend
  `/api/v1/execute` route proxying to Piston; `src/services/
  executionService.ts` on the frontend points at the real endpoint instead
  of the simulation fallback (fallback code stays only as an offline/dev
  convenience, not the default path).
- **Risks:** this session's sandbox has no Docker available (verified:
  `docker --version` → not found, checked both in the Bash tool and via
  PowerShell `Get-Command docker`) — the compose file and proxy route will
  be written and code-reviewed here, but **actually running Piston and
  confirming real execution needs to happen on a machine/host with Docker**
  (the user's machine, or directly on the Railway/Render deploy target).
- **Verification:** here — backend route compiles and returns a well-formed
  error when Piston is unreachable (proves the proxy logic, not execution
  itself). On a Docker-capable host — `docker compose up`, then a real
  `POST /api/v1/execute` for each of the 4 languages returns correct stdout
  for a trivial program.
- **Acceptance criteria:** all 4 first-class languages execute real
  submitted code and return real stdout/stderr/exit code; documented in
  this doc which parts were verified here vs. still need a Docker-capable
  host.

### Phase 3 — Visualization engine rewrite (generalizes `.kiro` spec)
- **Objective:** Fix the `codeLine` sync gap (§2.8) and generalize the
  existing `AlgorithmStep` contract so it can drive both DSA Worlds *and*
  problem solutions.
- **Prerequisites:** none — can run in parallel with Phases 1–2.
- **Areas touched:** adapt `.kiro/specs/interactive-dsa-visualization-engine/`
  into `src/engine/` (types, `useStepPlayer`, `parseInput`); wire real
  `activeLine` through all 16 `pages/*World.tsx` → `DSAWorkspace`; add a
  test runner (none currently installed) and per-runner unit tests as the
  `.kiro` spec's requirement 22 already specifies.
- **Risks:** touching all 16 pages is broad-surface; do it one module at a
  time (as `.kiro`'s task wave plan already lays out) with the Arrays
  module as the reference implementation before touching the rest.
- **Verification:** `npx tsc --noEmit`; new unit tests pass; manual check
  that `CodePanel`'s highlighted line now actually matches
  `currentStep.codeLine` for at least Arrays and Trees (the 2 engines that
  already populate it) before expanding to the other 9.
- **Acceptance criteria:** Requirement 20 from `.kiro/.../requirements.md`
  is met for all 16 modules.

### Phase 4 — New frontend shell (Lab/Workspace/Profile/Mobile screens, no real data yet)
- **Objective:** Build the new screens from §3.1 as real React components in
  this stack (not the exported `.dc.html`), wired to local/mock data first
  so layout and interaction can be verified before backend integration.
  Worlds nav is extended to all 16 real topics per D1, not collapsed to the
  design's 11.
- **Areas touched:** new `src/pages/{Lab,Workspace,Profile}.tsx` (or similar),
  extend `View`/`ROUTE_MAP` in `App.tsx`, a new shared shell component
  consolidating `DSALayout`/`DSAWorkspace` per §5.
- **Risks:** scope creep into pixel-matching every animation in the
  prototype; the design is direction, not spec — flag deviations rather
  than blocking on exact parity.
- **Verification:** manual click-through of every screen in the running
  dev server; confirm DSA Worlds nav still reachable and functional.
- **Acceptance criteria:** all 6 screens exist and navigate correctly with
  placeholder/mock data; worlds nav lists all 16 real topics.

### Phase 5 — Frontend/backend integration
- **Objective:** Replace Phase 4's mock data with real calls to the Phase 1
  backend (Supabase auth, profile, XP/streak) and the Phase 2 executor.
- **Verification:** multi-account manual test (two browsers/sessions show
  independent progress); reload persistence check; Run button in the new
  Workspace shell calls the real Piston-backed endpoint.

### Phase 6 — Problem library + workspace content
- **Objective:** Real problem storage (`problems`, `submissions`,
  `bookmarks` tables), the library table backed by a real query (search/
  filter/sort), Run/Submit end-to-end against Piston with grading.
- **Risks:** this is the largest single phase; consider seeding with a
  small problem set (10–20) before the full 100–200.
- **Verification:** at least one problem, end-to-end, for a real logged-in
  user: browse → open → edit → run → submit → XP awarded → shows solved in
  library.

### Phase 7 — Teacher Dashboard backend wiring (D3)
- **Objective:** `classes`, `assignments`, `assignment_submissions` tables;
  `teacherService.ts` becomes a real API client instead of `localStorage`.
- **Verification:** a teacher account can create an assignment a student
  account can see and submit against.

### Phase 8 — Visualization data pipeline (deterministic/traced/LLM-assisted)
- **Objective:** Generate `AlgorithmStep[]` data for the seeded problem set
  using the Phase 3 engine contract, per the brief's evaluation of
  deterministic logic / execution tracing / structured LLM output /
  templates — not a custom model. Gemini (D5) is the LLM path where a
  structured-output step is used.
- **Note:** this is explicitly a later phase per the brief; not designed in
  depth here.

### Phase 9 — DSA Worlds re-integration into the new shell
- **Objective:** Point the 16 existing topic pages at the Phase 4 shell,
  retire the old `DSALayout`/`DSAWorkspace` split.
- **Verification:** every one of the 16 existing topic URLs still resolves
  and functions.

### Phase 10 — Content population to full scale (100–200 problems)
### Phase 11 — Testing/polish/accessibility pass
- Ports `.kiro` requirement 21 (accessibility) across both DSA Worlds and
  the new Lab/Workspace screens.

Every phase ends with: run `npx tsc --noEmit` (frontend and backend), run
`npm run build`, run the test suite (once one exists, from Phase 3 on),
boot `npm run dev` and manually click through both DSA Worlds and the new
screens, and a commit checkpoint on `dsaverse-2-migration` describing what
changed and what was verified — explicitly flagging anything that could
only be verified partially in this sandboxed session (e.g. no Docker, no
live Supabase project) versus what still needs the user to confirm on a
capable host.

---

## 7. Decisions (resolved 2026-09-08)

- **D1 — DSA Worlds taxonomy: keep all 16 real topics as source of truth.**
  The design's 11-topic "legacy" grouping was made without visibility into
  the real app; the new nav is extended to represent all 16 rather than
  deleting real, working content to fit a wireframe made without that
  context.
- **D2 — Backend: Node/Express + TypeScript; Postgres via Supabase (managed
  auth + DB); deploy to Railway or Render, not serverless** — a persistent
  process is required for code execution (D4), which rules out serverless
  hosting.
- **D3 — Teacher Dashboard stays in scope.** Gets real backend wiring in
  Phase 7 rather than being frozen or dropped.
- **D4 — Code execution: self-hosted Piston via Docker, no paid execution
  API.** First languages: Python, JavaScript, Java, C++. Landed early
  (Phase 2, right after the backend scaffold) — real execution is core to
  the product, not deferred to a late "nice to have" phase.
- **D5 — AI provider: Gemini** — already the stubbed provider in
  `GeminiProvider.ts` and the team's existing choice elsewhere.
