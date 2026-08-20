# Design â€” Interactive DSA Visualization Engine

## Overview

The engine is a thin layer over the existing component library. It introduces one new abstraction â€” `AlgorithmStep<S>` â€” and one shared hook â€” `useStepPlayer`. Every module-specific page uses the same pattern: parse input â†’ run a pure `AlgorithmRunner` â†’ hand the `steps[]` array to `useStepPlayer` â†’ render `player.currentStep.state` into the existing visualizer components.

No existing UI is redesigned. `DSALayout`, `CodePanel`, `ComplexityCard`, `BottomWorkspace`, `AITutor`, `QuizPanel`, and all existing visualizer components remain unchanged. The engine plugs into them.

## Architecture

```
src/
â”œâ”€â”€ engine/
â”‚   â”œâ”€â”€ types.ts                       # AlgorithmStep, AlgorithmRunner contracts
â”‚   â”œâ”€â”€ useStepPlayer.ts               # Universal playback hook
â”‚   â”œâ”€â”€ parseInput.ts                  # Shared input parser + validator
â”‚   â””â”€â”€ runners/
â”‚       â”œâ”€â”€ arrayRunners.ts            # Arrays + CANONICAL_CODE
â”‚       â”œâ”€â”€ stringRunners.ts
â”‚       â”œâ”€â”€ linkedListRunners.ts
â”‚       â”œâ”€â”€ stackRunners.ts
â”‚       â”œâ”€â”€ queueRunners.ts
â”‚       â”œâ”€â”€ treeRunners.ts
â”‚       â”œâ”€â”€ sortRunners.ts
â”‚       â”œâ”€â”€ searchRunners.ts
â”‚       â”œâ”€â”€ graphRunners.ts
â”‚       â”œâ”€â”€ dpRunners.ts
â”‚       â”œâ”€â”€ heapRunners.ts
â”‚       â”œâ”€â”€ hashRunners.ts
â”‚       â”œâ”€â”€ trieRunners.ts
â”‚       â”œâ”€â”€ greedyRunners.ts
â”‚       â”œâ”€â”€ backtrackRunners.ts
â”‚       â”œâ”€â”€ patternRunners.ts
â”‚       â””â”€â”€ __tests__/                 # Vitest unit tests per runner
â”œâ”€â”€ components/dsa/
â”‚   â”œâ”€â”€ StepPlayer.tsx                 # Playback toolbar â€” wraps useStepPlayer
â”‚   â”œâ”€â”€ InputPanel.tsx                 # Enhanced with per-module validation
â”‚   â””â”€â”€ (all existing components unchanged)
â””â”€â”€ pages/
    â”œâ”€â”€ (10 existing pages â€” wired to engine)
    â””â”€â”€ (6 new pages â€” HeapWorld, HashWorld, TrieWorld, GreedyWorld, BacktrackWorld, InterviewArena)
```

**Data flow:**
```
rawInput â†’ parseInput â†’ AlgorithmRunner â†’ steps[]
                                              â†“
                                        useStepPlayer
                                              â†“
                             player.currentStep â†’ visualizer state
                                              â†“
                             player.currentStep.codeLine â†’ CodePanel activeLine
                             player.currentStep.description â†’ aria-live region
                             player.currentStep.variables â†’ variable inspector
```

## Components and Interfaces

### `src/engine/types.ts`

```typescript
export interface AlgorithmStep<S = unknown> {
  id: number
  description: string
  codeLine: number
  state: S
  highlight: {
    compared?: number[]
    swapped?: number[]
    inserted?: number[]
    deleted?: number[]
    visited?: number[]
    active?: number[]
  }
  complexity: { time: string; space: string }
  variables?: Record<string, string | number | boolean>
  output?: string
}

export type AlgorithmRunner<I = unknown, S = unknown> =
  (input: I) => AlgorithmStep<S>[]

export interface ParsedInput<T> {
  data: T
  error: string | null
}
```

### `src/engine/useStepPlayer.ts`

```typescript
interface UseStepPlayerOptions<S> {
  steps: AlgorithmStep<S>[]
  onStepChange?: (step: AlgorithmStep<S>, index: number) => void
  onComplete?: () => void
  initialSpeed?: number
}

interface UseStepPlayerReturn<S> {
  currentIndex: number          // -1 before first step
  currentStep: AlgorithmStep<S> | null
  isPlaying: boolean
  speed: number                 // 0.25 | 0.5 | 1 | 2 | 4
  progress: number              // 0â€“100
  isComplete: boolean
  totalSteps: number
  play: () => void
  pause: () => void
  toggle: () => void
  reset: () => void
  stepForward: () => void
  stepBack: () => void
  goToStep: (index: number) => void
  setSpeed: (speed: number) => void
}
```

**Timing:** `interval = Math.max(minInterval, Math.round(800 / speed))` ms.
`minInterval = 50` normally; `minInterval = 800` when `prefers-reduced-motion` is active.
On speed change: current timer cleared, new timer started â€” no step skipped.

**Keyboard handler:** `keydown` on `document`, attached on mount, cleaned on unmount.
Space = toggle, ArrowRight = stepForward, ArrowLeft = stepBack, R = reset.

### `src/components/dsa/StepPlayer.tsx`

```typescript
interface StepPlayerProps {
  steps: AlgorithmStep<unknown>[]
  accentColor?: string
  onStepChange: (step: AlgorithmStep<unknown>, index: number) => void
  onComplete?: () => void
}
```

Renders before first step: single "â–¶ Auto Visualize" button.
Renders during/after playback: â® | â–¶/â¸ | â­ | â†º Reset, progress bar, step counter, speed picker (0.25Ã— 0.5Ã— 1Ã— 2Ã— 4Ã—).
Hidden `aria-live="polite"` div receives `currentStep.description` on every change.

### `src/engine/parseInput.ts`

```typescript
export function parseNumericArray(
  raw: string,
  options: { max: number; allowDuplicates?: boolean }
): ParsedInput<number[]>

export function parseBSTInput(raw: string): ParsedInput<number[]>

export function parseGraphInput(
  raw: string
): ParsedInput<{ vertices: string[]; edges: { from: string; to: string; weight: number }[] }>

export function parseStringInput(raw: string, maxLen: number): ParsedInput<string>
```

All parsers: split on `/[\s,;]+/`, trim, validate each token, return `{ data, error }`.

### Runner File Convention

Every runner file follows this template:

```typescript
// src/engine/runners/arrayRunners.ts
import { type AlgorithmStep, type AlgorithmRunner } from '../types'

// State types
export interface ArrayCell {
  value: number; index: number; address: string
  state: 'default' | 'active' | 'comparing' | 'sorted' | 'found' | 'deleted' | 'inserted'
}

// Canonical Python reference â€” line numbers are source of truth for step.codeLine
export const CANONICAL_CODE: Record<string, string> = {
  traverse: [
    'def traverse(arr):',      // line 1
    '    n = len(arr)',        // line 2
    '    for i in range(n):', // line 3
    '        print(arr[i])',  // line 4
    '    return arr',          // line 5
  ].join('\n'),
}

// Pure runner â€” no side effects
export const runTraversal: AlgorithmRunner<number[], ArrayCell[]> = (arr) => {
  const steps: AlgorithmStep<ArrayCell[]>[] = []
  // ... pure algorithm with step pushes
  return steps
}

// Multi-language display code (line numbers not guaranteed)
export const LANGUAGE_CODE: Record<string, Record<string, string>> = {
  Python: { traverse: CANONICAL_CODE.traverse },
  'C++': { traverse: `void traverse(vector<int>& arr) { ... }` },
  // ...
}
```

### Module Page Pattern

```typescript
export default function ArrayWorld({ onNavigate, isDark, onToggleDark }) {
  const [rawInput, setRawInput] = useState('10, 5, 7, 2, 9')
  const [validationError, setValidationError] = useState<string | null>(null)
  const [activeOp, setActiveOp] = useState('traverse')
  const [steps, setSteps] = useState<AlgorithmStep<ArrayCell[]>[]>([])

  const player = useStepPlayer({ steps })
  const visualState = player.currentStep?.state ?? buildDefault(rawInput)

  const handleRun = () => {
    const parsed = parseNumericArray(rawInput, { max: 30 })
    if (parsed.error) { setValidationError(parsed.error); return }
    setValidationError(null)
    setSteps(RUNNERS[activeOp](parsed.data))
    player.reset()
  }

  return (
    <DSALayout
      inputPanel={
        <>
          <InputPanel value={rawInput} onChange={setRawInput}
            validationError={validationError ?? undefined} onRandomize={...} />
          <OperationPanel operations={ARRAY_OPS} activeOpId={activeOp}
            onSelectOp={setActiveOp} />
          <button onClick={handleRun}>Run</button>
          <StepPlayer steps={steps} accentColor="#6366f1"
            onStepChange={() => {}} />
        </>
      }
      visualization={<ArrayVisualizer cells={visualState} />}
      codeContent={LANGUAGE_CODE[language][activeOp]}
    />
  )
}
```

## Data Models

### Per-Module State Types

| Module | State Type S | Key Fields |
|---|---|---|
| Arrays | `ArrayCell[]` | `{ value, index, address, state }` |
| Sorting | `SortBar[]` | `{ value, index, state }` |
| Strings | `CharCell[]` | `{ char, index, state }` |
| Stack | `StackFrame[]` | `{ id, value, state }` |
| Queue | `QueueCell[]` | `{ id, value, position, state }` |
| Linked List | `LLNode[]` | `{ id, value, nextId, state }` |
| Trees | `TreeNodeFlat[]` | `{ id, value, parentId, isLeft, x, y, state }` |
| Graphs | `GraphState` | `{ nodes: GNode[], edges: GEdge[] }` |
| DP 1D | `(number\|null)[]` | index = subproblem size |
| DP 2D | `(number\|null)[][]` | row/col = subproblem dimensions |
| Heap | `HeapNode[]` | `{ index, value, state }` â€” rendered as tree via `parent=(i-1)>>1` |
| Hash Table | `HashBucket[]` | `{ index, entries: HashEntry[], state }` |
| Trie | `TrieNode[]` | `{ id, char, parentId, isEnd, depth, state }` |

### Tree Layout Algorithm

In-order traversal assigns monotonically increasing integer x-positions. Y-position = depth Ã— row-height. Ensures no overlap for up to 31 nodes across 5 levels. `TreeNodeFlat[]` stores pre-computed `(x, y)` so the visualizer is a pure render function.

### Graph State

```typescript
interface GraphState {
  nodes: { id: string; label: string; x: number; y: number; state: GNodeState }[]
  edges: { from: string; to: string; weight: number; directed: boolean; state: GEdgeState }[]
}
type GNodeState = 'default' | 'visited' | 'current' | 'queued' | 'path'
type GEdgeState = 'default' | 'traversed' | 'path' | 'rejected'
```

### Code-Line Sync

`CANONICAL_CODE` in each runner file is Python-only and the line-number source of truth. `step.codeLine` is 1-indexed against it. Other languages in `LANGUAGE_CODE` are for display only â€” their line counts are approximately aligned but not guaranteed. `CodePanel` receives `activeLine = currentStep?.codeLine ?? 0`.

## Correctness Properties

### Property 1: AlgorithmRunner Determinism
**Validates: Requirements 1.2, 22.4**
Every `AlgorithmRunner` is a pure function. Given the same input it always returns an identical `steps[]` array â€” no random values, no time-based variance, no shared mutable state between calls.

### Property 2: Final State Correctness
**Validates: Requirements 22.2, 22.3**
`steps[steps.length - 1].state` must represent the correctly-completed algorithm result. For sorting, this means ascending order with every element in `'sorted'` state. For search, this means the target index or all-eliminated. Verified by unit tests asserting against known-correct expected values.

### Property 3: Previous Step Correctness
**Validates: Requirements 2.2**
Stepping back to index `i` renders exactly `steps[i].state` â€” the same state that was rendered when the player first advanced to step `i` during forward playback. No re-computation, no approximation.

### Property 4: No Overlap in Tree Layout
**Validates: Requirements 9.2**
For any valid BST with â‰¤ 31 nodes, the in-order x-position algorithm assigns distinct integer x-positions. No two nodes share the same `(x, y)` coordinate.

### Property 5: Cycle Representation Safety
**Validates: Requirements 6.3**
Linked List cycle detection never assigns `nextId` to an ancestor node ID in any `LLNode[]` state snapshot. Cycles are represented only via a boolean flag in `step.variables` â€” the state array is always a valid DAG (directed acyclic graph) for rendering purposes.

## Error Handling

- `parseInput` returns `{ error: string }` â€” never throws
- Runner functions: if input is empty after parsing, return `[{ id: 0, description: 'Empty input â€” add elements to visualize', codeLine: 1, state: [], highlight: {}, complexity: { time: 'â€”', space: 'â€”' } }]`
- Stack/Queue underflow: dedicated error step with description, not a thrown exception
- BST duplicate: dedicated rejection step, not a thrown exception
- Backtracking step cap: when `steps.length >= 500`, push a final step "Step limit reached â€” showing first solution path" and return
- All runners are wrapped in a try/catch at the call site in the page component â€” if a runner throws unexpectedly, the error step is shown and the app does not crash

## Testing Strategy

Test files at `src/engine/runners/__tests__/<module>Runners.test.ts` using Vitest. Tests are pure â€” no React, no DOM, no async. Each runner has â‰¥ 3 tests:

1. Empty/minimal input â€” verifies no crash, steps.length > 0, error step description correct
2. Typical input â€” verifies `steps[steps.length-1].state` matches known-correct final state
3. Adversarial edge case â€” verifies the hardest case for that algorithm

Example for Bubble Sort:
- Typical: `[5,3,8,1,6]` â†’ final state is `[1,3,5,6,8]` all in `'sorted'` state
- Already sorted: `[1,2,3,4,5]` â†’ early-exit optimization reduces step count vs full nÂ² steps
- Adversarial: reverse-sorted `[5,4,3,2,1]` â†’ final state is `[1,2,3,4,5]`, step count is maximum for n=5

`npm test` runs all tests. CI must pass before any runner is marked complete.



