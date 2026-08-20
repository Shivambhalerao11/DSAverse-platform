# Implementation Plan: Interactive DSA Visualization Engine

## Overview

Build the engine in 5 phases: shared foundation → Arrays reference module → 9 existing modules wired → 6 new modules → integration pass. Every implementation task is paired with a unit test task. No module work begins until Phase 1 is complete and verified.

## Tasks

- [ ] 1. Create engine types contract in `src/engine/types.ts` — `AlgorithmStep<S>`, `AlgorithmRunner<I,S>`, `ParsedInput<T>` interfaces with strict TypeScript, zero `any`; export all from `src/engine/index.ts`
- [ ] 2. Create `src/engine/useStepPlayer.ts` — play/pause/toggle/reset/stepForward/stepBack/goToStep/setSpeed; speed-change clears+restarts timer; reset returns to index -1; Space/ArrowLeft/ArrowRight/R keyboard shortcuts on mount; prefers-reduced-motion clamps minimum interval to 800ms; add re-export from `src/components/dsa/useVisualization.ts` for backward compat
- [ ] 3. Create `src/components/dsa/StepPlayer.tsx` — "Auto Visualize" button before first step; ⏮/▶⏸/⏭/Reset + progress bar + step counter + speed picker (0.25×/0.5×/1×/2×/4×) after; aria-live="polite" div receives currentStep.description; aria-pressed on play/pause; aria-label="Step N of M" on counter
- [ ] 4. Create `src/engine/parseInput.ts` — `parseNumericArray` (comma/space/semicolon split, per-token validation, max enforcement), `parseBSTInput` (rejects duplicates), `parseGraphInput`, `parseStringInput`; all return `{ data, error }` never throw
- [ ] 5. Write `src/engine/__tests__/parseInput.test.ts` — test `parseNumericArray('5,8,x,10')` → error "x is not a valid number"; test size exceeded → correct error message; test empty string; test space-separated input; test `parseBSTInput('50,30,30')` → error about duplicate
- [ ] 6. Create `src/engine/runners/arrayRunners.ts` — export `CANONICAL_CODE` (Python reference, 1-indexed lines for traverse/linearSearch/binarySearch/insertAt/deleteAt/updateAt/reverse/rotateLeft/rotateRight/bubbleSort/selectionSort/insertionSort/mergeSort/quickSort); implement all runners as pure `AlgorithmRunner<number[], ArrayCell[]>` functions; every comparison and swap is a step; memory addresses as hex
- [ ] 7. Write `src/engine/runners/__tests__/arrayRunners.test.ts` — test traverse step count; linear search found/not-found; bubble sort typical→sorted, already-sorted early exit, single element, empty, reverse-sorted; merge sort correctness; quick sort correctness
- [ ] 8. Wire `src/pages/ArrayWorld.tsx` to engine — replace setTimeout/async animation with `steps[]` + `useStepPlayer`; InputPanel wired to `parseNumericArray` with inline errors; OperationPanel maps to runners; StepPlayer in inputPanel area; ArrayVisualizer receives `player.currentStep?.state`; CodePanel receives `activeLine={player.currentStep?.codeLine ?? 0}`; 3 preset examples (typical, sorted, worst-case pivot)
- [ ] 9. Create `src/engine/runners/stringRunners.ts` — Reverse, Palindrome, CharFrequency, PatternSearch (Naive), PatternSearch (KMP with failure function steps), AnagramCheck, LongestCommonPrefix, CaesarCipher; export CANONICAL_CODE per operation
- [ ] 10. Write `src/engine/runners/__tests__/stringRunners.test.ts` — 5 test cases per requirement 5 acceptance criteria
- [ ] 11. Wire `src/pages/StringWorld.tsx` to engine — StringVisualizer receives CharCell[] from current step; caesar cipher shift input added; KMP shows failure function steps before search
- [ ] 12. Create `src/engine/runners/linkedListRunners.ts` — InsertHead, InsertTail, InsertAtIndex, DeleteHead, DeleteTail, DeleteByValue, Reverse (prev/curr/next labeled), Search, FindMiddle (Floyd's with both pointers per step), DetectCycle (virtual cycle only)
- [ ] 13. Write `src/engine/runners/__tests__/linkedListRunners.test.ts` — single-node reverse, delete only node, search not found, middle of even-length list
- [ ] 14. Wire `src/pages/LinkedListWorld.tsx` to engine — replace manual state mutations with steps[]
- [ ] 15. Create `src/engine/runners/stackRunners.ts` — Push, Pop, Peek, Clear, CheckEmpty, EvaluateExpression; underflow produces dedicated error step; expression evaluator char-by-char with stack state
- [ ] 16. Write `src/engine/runners/__tests__/stackRunners.test.ts` — push/pop sequence, pop on empty, balanced expression, unbalanced expression
- [ ] 17. Wire `src/pages/StackWorld.tsx` to engine
- [ ] 18. Create `src/engine/runners/queueRunners.ts` — Enqueue, Dequeue, Front, Rear, Clear, CheckEmpty; underflow produces dedicated error step; FRONT/REAR labels in step state
- [ ] 19. Write `src/engine/runners/__tests__/queueRunners.test.ts` — enqueue sequence, dequeue until empty, front/rear on single element
- [ ] 20. Wire `src/pages/QueueWorld.tsx` to engine
- [ ] 21. Create `src/engine/runners/treeRunners.ts` — Insert, Delete (3 cases with inorder successor highlighted), Search, Inorder, Preorder, Postorder, LevelOrder (queue in variables), Height, CountLeaves, FindMin, FindMax, IsBST; in-order layout algorithm for no-overlap at ≤31 nodes; duplicate rejection step; CANONICAL_CODE per operation
- [ ] 22. Write `src/engine/runners/__tests__/treeRunners.test.ts` — insert into empty tree, delete root with two children, search not found, inorder on 7-node tree matches sorted output
- [ ] 23. Wire `src/pages/TreeWorld.tsx` to engine — replace mock activeValue with real step state; TreeVisualizer receives TreeNodeFlat[] with pre-computed x/y
- [ ] 24. Create `src/engine/runners/sortRunners.ts` — Bubble (early exit), Selection, Insertion, Merge (split+merge as distinct steps), Quick (pivot in pivot state throughout partition), Heap; CANONICAL_CODE per algorithm
- [ ] 25. Write `src/engine/runners/__tests__/sortRunners.test.ts` — 5 test cases per requirement 10.5
- [ ] 26. Wire `src/pages/SortWorld.tsx` to engine — algorithm comparison table always visible; SortSearchVisualizer receives SortBar[] from current step
- [ ] 27. Create `src/engine/runners/searchRunners.ts` — Linear, Binary (lo/mid/hi in variables), Jump, Interpolation; auto-sort for non-linear algorithms with note in first step description; target not found ends in all-eliminated state
- [ ] 28. Write `src/engine/runners/__tests__/searchRunners.test.ts` — 4 test cases per requirement 11.5
- [ ] 29. Wire `src/pages/SearchWorld.tsx` to engine
- [ ] 30. Create `src/engine/runners/graphRunners.ts` — BFS, DFS, Dijkstra (distance table in variables), CycleDetection, TopologicalSort, ConnectedComponents; GraphState with nodes and edges both having state fields
- [ ] 31. Write `src/engine/runners/__tests__/graphRunners.test.ts` — BFS/DFS on disconnected graph, Dijkstra with unreachable node, cycle vs acyclic
- [ ] 32. Wire `src/pages/GraphWorld.tsx` to engine — add graph edit mode (add/remove vertex/edge) before running; directed/undirected toggle; GraphVisualizer receives GraphState from current step
- [ ] 33. Create `src/engine/runners/dpRunners.ts` — Fibonacci, Knapsack (weight:value input), LCS (with traceback highlighting), CoinChange, LIS; 1D and 2D state types; CANONICAL_CODE per problem
- [ ] 34. Write `src/engine/runners/__tests__/dpRunners.test.ts` — Fibonacci base cases, Coin Change no solution, LCS empty string, Knapsack zero capacity
- [ ] 35. Wire `src/pages/DPWorld.tsx` to engine — DPVisualizer receives 1D or 2D state array from current step with active cell highlighted
- [ ] 36. Create `src/engine/runners/heapRunners.ts` — Insert, ExtractMin, ExtractMax, HeapifyUp, HeapifyDown, BuildHeap (O(n) bottom-up), Peek; min/max mode parameter; HeapNode[] state with index math for tree rendering
- [ ] 37. Write `src/engine/runners/__tests__/heapRunners.test.ts` — insert into empty heap, extract from single-element heap, build heap on already-valid heap
- [ ] 38. Create `src/pages/HeapWorld.tsx` — binary tree rendering via `parent=(i-1)>>1`; min/max toggle; StepPlayer wired; add `'heap'` to View type in App.tsx and DSA_SECTIONS in DSALayout.tsx
- [ ] 39. Create `src/engine/runners/hashRunners.ts` — Insert (linear probe + chaining), Search, Delete, Rehash (double+re-insert steps); hash function step shows formula; collision strategy parameter
- [ ] 40. Write `src/engine/runners/__tests__/hashRunners.test.ts` — insert causing collision, search not found, delete and re-insert at same slot
- [ ] 41. Create `src/pages/HashWorld.tsx` — linear probe vs chaining toggle; HashBucket[] visualization; add `'hash'` to View + DSA_SECTIONS
- [ ] 42. Create `src/engine/runners/trieRunners.ts` — InsertWord, SearchWord, PrefixSearch, DeleteWord, Autocomplete (top-3 lex); shared prefixes as shared nodes; TrieNode[] flat representation
- [ ] 43. Write `src/engine/runners/__tests__/trieRunners.test.ts` — insert duplicate word, search prefix only, delete word that is prefix of another
- [ ] 44. Create `src/pages/TrieWorld.tsx` — shared prefix path rendering; autocomplete results displayed after complete; add `'trie'` to View + DSA_SECTIONS
- [ ] 45. Create `src/engine/runners/greedyRunners.ts` — ActivitySelection, FractionalKnapsack (sorted by ratio, fraction per step), HuffmanCoding (priority queue state each merge), MinimumCoins
- [ ] 46. Write `src/engine/runners/__tests__/greedyRunners.test.ts` — single activity, all compatible, Huffman 2 chars, minimum coins edge case
- [ ] 47. Create `src/pages/GreedyWorld.tsx` — add `'greedy'` to View + DSA_SECTIONS
- [ ] 48. Create `src/engine/runners/backtrackRunners.ts` — NQueens (4–8, capped at 500 steps showing first solution), SudokuSolver, Permutations, RatInMaze; each recursive call and backtrack is one step; backtrack step shows visual undo via state change
- [ ] 49. Write `src/engine/runners/__tests__/backtrackRunners.test.ts` — 4-Queens 2 solutions, Sudoku unique solution, permutations of [1,2,3]
- [ ] 50. Create `src/pages/BacktrackWorld.tsx` — N-Queens board from `number[]` state; add `'backtrack'` to View + DSA_SECTIONS
- [ ] 51. Create `src/engine/runners/patternRunners.ts` — TwoPointersPairSum, TwoPointersRemoveDuplicates, SlidingWindowMaxSum, SlidingWindowLongestUnique, FastSlowCycleDetection, FastSlowFindMiddle; pointer labels in step highlight/variables
- [ ] 52. Write `src/engine/runners/__tests__/patternRunners.test.ts` — pair sum no solution, window = array size, non-cyclic list
- [ ] 53. Create `src/pages/InterviewArena.tsx` — two pointers / sliding window / fast-slow sections; add `'arena'` to View + DSA_SECTIONS
- [ ] 54. Add `aria-live="polite"` region to `src/components/DSALayout.tsx` receiving `currentStep?.description`; add `aria-label` to all operation buttons across all modules; add `aria-pressed` to StepPlayer play/pause; add `aria-hidden="true"` to all SVG canvas elements; test with prefers-reduced-motion active
- [ ] 55. Performance verification — time step generation for max-size inputs in browser console; confirm steps[] generated once per run; confirm 22+ separate chunks in build output; confirm app entry chunk < 15KB gzipped
- [ ] 56. Final build verification — `npx tsc --noEmit` zero errors; `npm test` all pass; `npm run build` zero errors; manual smoke test every module: load, Auto Visualize to completion, Previous Step rewinds, Speed change takes effect immediately

## Task Dependency Graph

```json
{
  "waves": [
    {
      "wave": 1,
      "tasks": [1, 2, 3, 4],
      "description": "Shared engine foundation — types, hook, player UI, input parser"
    },
    {
      "wave": 2,
      "tasks": [5, 6, 7, 8],
      "description": "Parse input tests + Arrays reference module — the pattern all other modules copy"
    },
    {
      "wave": 3,
      "tasks": [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35],
      "description": "Wire all 9 remaining existing modules (Strings, LinkedList, Stack, Queue, Trees, Sorting, Searching, Graphs, DP) — all parallel after wave 2"
    },
    {
      "wave": 4,
      "tasks": [36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53],
      "description": "Build 6 new module pages (Heap, Hash, Trie, Greedy, Backtrack, InterviewArena) — all parallel"
    },
    {
      "wave": 5,
      "tasks": [54, 55, 56],
      "description": "Accessibility pass, performance verification, final build verification"
    }
  ]
}
```

## Notes

- Tasks 9–35 (Phase 3) are independent of each other and can be worked in parallel
- Tasks 36–53 (Phase 4) are independent of each other and can be worked in parallel  
- Phase 2 (task 8) must be complete and reviewed before Phase 3 begins — it is the reference implementation all other modules copy the pattern from
- The keyboard handler in `useStepPlayer` is attached to `document` — only one instance should be active at a time; the hook deregisters on unmount
- `CANONICAL_CODE` and the runner functions must live in the same file — if you move the code, update the line numbers immediately
- Runner files must not import React, DOM APIs, or other runner files — pure TypeScript only
