DSAverse — Enhanced Figma Design Prompt

Your original brief is strong on vision, tone, and content scope — that part is untouched below. What's added is everything a real Figma deliverable needs that a written brief usually skips: file/page architecture, tokens as Figma Variables, component/variant specs, grid and breakpoints, prototyping connections, states, and handoff notes. Without these, an AI design tool (or a human designer) will produce pretty static frames that don't hold together as an actual usable design system.

ROLE

Act as a world-class Product Designer, UX Architect, UI Designer, EdTech Expert, Game UX Designer, and Senior Full-Stack Product Designer with 20+ years of experience designing products for Apple, Google, Stripe, Linear, Duolingo, Brilliant.org, Figma, Framer, and top EdTech companies.

Design a complete, production-ready Figma file for DSAverse — not a moodboard, not a set of disconnected screens, but a real, developer-handoff-ready design system with connected prototype flows.

This should not look like LeetCode, GeeksForGeeks, HackerRank, or a traditional educational website. Build the world's most engaging DSA learning experience: interactive visualizations, simulations, games, and animation-driven teaching for students, with the same visual tools usable by teachers.

FIGMA FILE ARCHITECTURE (build this first)

Before designing any screen, set up the file so it stays navigable as it grows:

📁 DSAverse — Design System
 ├─ 00 · Cover & Overview        (project summary, version, changelog)
 ├─ 01 · Foundations             (color, type, spacing, radius, shadow, grid — as Variables + Styles)
 ├─ 02 · Icons & Illustrations   (icon set, world-specific illustration style)
 ├─ 03 · Components              (all reusable components with variants, organized by category)
 ├─ 04 · Patterns                (composed patterns: card grids, empty states, form patterns)
 ├─ 05 · Public Website          (Landing, About, Features, Pricing, etc.)
 ├─ 06 · Authentication          (Login, Register, OTP, role selection, onboarding)
 ├─ 07 · Student Dashboard
 ├─ 08 · Teacher Dashboard
 ├─ 09 · DSA Worlds              (one sub-page per world: Array, String, Stack, Queue, Linked List, Tree, Graph, Sorting, Searching, DP, Interview Arena)
 ├─ 10 · Coding Playground
 ├─ 11 · Prototype Flows         (connected, clickable flows — see Prototyping section)
 └─ 12 · Handoff & Dev Notes     (redlines, spacing annotations, responsive behavior notes)

Use consistent layer naming throughout: world/array/memory-block, component/button/primary, page/dashboard/student/overview — so components stay searchable and instances trace back to source cleanly.

DESIGN TOKENS — AS FIGMA VARIABLES, NOT JUST A MOODBOARD

Build a real token system using Figma Variables (not just color styles), with light/dark mode as variable modes so every component swaps automatically:

Color — organize as primitive → semantic layers:

Primitives: blue.50…900, indigo.50…900, cyan, purple, violet, emerald, orange, red, green, slate.50…900
Semantic: color/bg/surface, color/bg/surface-elevated, color/text/primary, color/text/muted, color/border/subtle, color/accent/primary, color/state/success, color/state/error — each mapped per-mode (Light/Dark)

Typography — full type scale as text styles: Display, H1–H4, Body Large/Regular/Small, Caption, Code/Mono (for the coding playground) — with defined line-height and letter-spacing per style, not just font size.

Spacing & Radius — an 8px-based spacing scale (space.1 = 4px through space.12 = 96px) and a radius scale (radius.sm/md/lg/xl/full) as number variables, referenced by every component's auto-layout padding/gap and corner radius — never a hardcoded pixel value on an individual frame.

Elevation — effect styles shadow.sm through shadow.2xl, plus a distinct glass effect style (background blur + subtle border + soft shadow) used consistently across every glassmorphic surface so "glass" doesn't visually drift between screens.

Deliverable: a single Foundations page where every token is visually cataloged with its name, value, and both mode variants shown side-by-side.

GRID SYSTEM & BREAKPOINTS

Define explicit frame sizes and grid specs so every screen is built consistently:

Breakpoint	Frame width	Columns	Margin	Gutter
Desktop	1440px (design at), 1280px (min-supported)	12	80px	24px
Tablet	768px	8	32px	16px
Mobile	375px	4	16px	12px

Every page must be designed at all three breakpoints — not just desktop with an assumption it'll "reflow." The DSA World visualizations (memory blocks, tree nodes, graph canvas) need a deliberately redesigned mobile layout, not a shrunk desktop one — annotate specifically how each world's core interaction simplifies on mobile (e.g., Tree Kingdom on mobile: vertical-scroll tree with pinch-zoom, vs. free-canvas pan/zoom on desktop).

COMPONENT SYSTEM — WITH VARIANTS AND STATES

For every component listed (Buttons, Inputs, Cards, Modals, Navigation, Sidebar, Forms, Charts, Tables, Tooltips, Toasts, Dropdowns, Progress Bars, Badges, Loading Skeletons, Pagination, Breadcrumbs), build it as a Figma component with variants covering, at minimum:

States: Default, Hover, Focus, Active, Disabled, Loading, Error
Themes: Light, Dark (via the mode variable, not duplicate components)
Sizes: where relevant (sm/md/lg for buttons and inputs)

Every component must use Auto Layout with spacing/padding bound to the spacing variables, so resizing and content changes behave predictably — this is what makes the file usable for real screen assembly rather than a static gallery.

Also design, explicitly, the states that briefs typically forget:

Empty states for: no courses yet, no achievements yet, empty leaderboard, no notes/bookmarks
Loading/skeleton states for every data-driven screen (dashboard cards, tables, world-load transitions)
Error states for failed code execution, failed form submission, network error banners
DSA WORLDS — VISUAL SPEC PER WORLD

For each world (Array, String, Stack, Queue, Linked List, Tree Kingdom, Graph Galaxy, Sorting Arena, Searching Lab, Dynamic Programming, Interview Arena), design and document:

Entry transition frame — the moment the "SaaS personality" transforms into the "game personality" (annotate this as a prototype Smart Animate transition, not just a hard cut)
Core visualization canvas — the actual interactive surface (memory blocks / tree / graph / stack of plates / etc.), at both desktop and mobile scale
Operation control panel — how a student triggers insert/delete/traverse/etc., and where live complexity + step explanation displays relative to the canvas
Practice / Challenge / Boss Level screens — each as its own frame, following the shared "Learning Structure" pattern (Intro → Analogy → Visualization → Explanation → Simulation → Practice → Challenge → Quiz → Coding Exercise → Summary → Progress)
Reward moment — XP/achievement/level-up screen specific to completing that world

Keep each world's illustration/color-accent identity distinct (e.g., Tree Kingdom = forest greens/emerald accents, Graph Galaxy = deep indigo/violet space accents) while every structural element — spacing, type scale, button style, card shape — stays identical across worlds. Distinctness should live in accent color and illustration only, never in structure.

CODING PLAYGROUND — LANGUAGE-SWITCHING UI

Design the language selector (Python, C, C++, Java, JavaScript, Go, Rust, TypeScript, Kotlin, Swift) as a single, consistent component appearing wherever code appears — lesson snippets, practice exercises, boss levels. Design the code editor panel itself (syntax-highlighted, dark-mode-first even within an otherwise light-mode page, since code panels conventionally stay dark) plus its states: running, success output, error output with line-highlighted error location.

PROTOTYPING REQUIREMENTS

This file must include actual connected, clickable prototype flows — not just static screens sitting side by side:

Auth flow: Welcome → Register → OTP → Role Selection → Onboarding (per role) → Dashboard, fully click-through
World entry flow: Dashboard → World selection → Entry transition → Core learning loop → Boss Level → Reward screen → back to Dashboard with updated XP
Teacher flow: Dashboard → Course Builder → Lesson Builder → Publish → Student Analytics

Use Smart Animate for the SaaS-to-game transformation moments and for XP/reward pop animations specifically — annotate transition duration and easing (e.g., "320ms, ease-out") directly on the frame so it's implementable, not just implied by the visual.

ACCESSIBILITY REQUIREMENTS
All text/background color pairs in both themes must meet WCAG AA contrast (4.5:1 body text, 3:1 large text) — verify token pairs, don't just eyeball it
Every interactive component needs a visible focus state, not just hover
Annotate reading order and ARIA-relevant grouping on complex custom widgets (the graph editor, the tree builder) in the handoff notes, since these are the pieces most likely to be inaccessible if left unannotated
HANDOFF & DEV NOTES PAGE

Close the file with a dedicated handoff page containing:

Spacing/redline annotations on 3–4 representative complex screens (a World canvas, the Dashboard, a Form)
A note on which values are tokens vs. one-off exceptions (there should be almost none of the latter)
Responsive behavior notes per world explaining what changes structurally at each breakpoint (not just "it shrinks")
A short glossary mapping design-token names to what a frontend dev would expect (e.g., color/accent/primary → CSS variable --accent-primary) so the handoff maps cleanly onto a Tailwind/CSS-variable implementation
FINAL GOAL

Produce a Figma file that functions as a real, buildable design system — reusable components, tokenized styles, connected prototype flows, and explicit responsive/accessibility specs — polished enough to hand directly to an engineering team, not just a set of beautiful static mockups. The two personalities (professional SaaS shell vs. immersive game world) should be visually distinct in mood but structurally consistent in spacing, type, and component behavior throughout.