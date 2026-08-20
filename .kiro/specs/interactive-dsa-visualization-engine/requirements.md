# Requirements Document

## Introduction

DSAverse needs a production-grade interactive simulation engine that transforms every DSA module from a static demo into a real learning lab. The core architectural constraint is the **step-generator pattern**: every algorithm is a pure function returning `AlgorithmStep[]` before any animation plays. Play/Pause/Rewind/Speed controls are all index operations over that precomputed array â€” not live-animated side effects.

This means correct rewind (previous step = index decrement, no re-run), instant speed changes, deterministic unit-testable runners, and a single shared player component across all 16 modules.

## Glossary

- **AlgorithmStep**: A discrete snapshot of the data structure state at one point during algorithm execution, with description, code line, highlighted indices, and variable values
- **AlgorithmRunner**: A pure function `(input) => AlgorithmStep[]` â€” no side effects, no React, no async
- **StepPlayer**: The shared playback UI component and hook that walks a `steps[]` array by index
- **Canonical Code**: The Python reference implementation stored alongside each runner â€” the source of truth for `step.codeLine` line numbers
- **Auto Visualize**: Auto-play mode that advances the player at a timed interval
- **Module**: One DSA topic (e.g. Arrays, Trees, Graphs) â€” each has its own page, runner file, and visualizer

## Requirements

### Requirement 1: AlgorithmStep Contract

**User Story:** As a developer extending the platform, I want a single shared `AlgorithmStep<S>` TypeScript interface so that every module's runner, player, and visualizer share one contract with no duplication.

#### Acceptance Criteria

- [ ] 1.1: `AlgorithmStep<S>` has fields: `id: number`, `description: string`, `codeLine: number`, `state: S`, `highlight: { compared?: number[]; swapped?: number[]; inserted?: number[]; deleted?: number[]; visited?: number[]; active?: number[] }`, `complexity: { time: string; space: string }`, `variables?: Record<string, string | number | boolean>`, `output?: string`
- [ ] 1.2: `AlgorithmRunner<I, S>` is typed as `(input: I) => AlgorithmStep<S>[]`
- [ ] 1.3: The contract lives in `src/engine/types.ts` â€” no module imports from another module's types
- [ ] 1.4: TypeScript strict mode passes with zero `any` in engine files

### Requirement 2: Universal Step Player

**User Story:** As a student using any DSA module, I want reliable Play / Pause / Next / Previous / Reset / Speed controls so that I can explore any algorithm at my own pace without re-running it.

#### Acceptance Criteria

- [ ] 2.1: `useStepPlayer(steps, options)` returns `{ currentIndex, currentStep, isPlaying, speed, progress, isComplete, play, pause, toggle, reset, stepForward, stepBack, goToStep, setSpeed }`
- [ ] 2.2: Previous Step works without re-running the algorithm â€” it is a pure index decrement
- [ ] 2.3: Speed change takes effect within the current interval, not after the next step
- [ ] 2.4: `reset()` returns to index -1 (before first step), not index 0
- [ ] 2.5: Speed options: 0.25Ã—, 0.5Ã—, 1Ã—, 2Ã—, 4Ã—
- [ ] 2.6: When `prefers-reduced-motion` is active, minimum auto-play interval is 800 ms regardless of speed
- [ ] 2.7: Keyboard shortcuts: Space = play/pause, ArrowRight = next step, ArrowLeft = previous step, R = reset

### Requirement 3: Universal Input Panel with Validation

**User Story:** As a student, I want a consistent, validated input panel on every module so that I can enter my own data without crashing the visualizer.

#### Acceptance Criteria

- [ ] 3.1: Accepts comma-separated or space-separated numeric input
- [ ] 3.2: Non-numeric token produces error: `"x is not a valid number"` (names the token)
- [ ] 3.3: Size exceeded produces error: `"Maximum N elements allowed for this module"`
- [ ] 3.4: Empty submission produces error: `"Input cannot be empty"`
- [ ] 3.5: Random button generates valid random input within the module's limits
- [ ] 3.6: Paste reads clipboard and auto-parses comma/space delimited values
- [ ] 3.7: Each module has â‰¥ 3 preset examples covering typical, sorted, and adversarial cases
- [ ] 3.8: Input field has `aria-label`; error region has `role="alert"`
- [ ] 3.9: Module size limits enforced â€” Arrays/Sort/Search: 30; Stack/Queue: 20; Trees: 31; Graphs: 12 vertices; Strings: 100 chars; Heap: 20; Hash Table: 15; DP Fibonacci nâ‰¤25; DP LCS 8 chars each; Coin Change amountâ‰¤200; Trie: 10 words Ã— 10 chars

### Requirement 4: Arrays Module

**User Story:** As a student, I want to visualize array operations with real step-by-step animation so that I can see every comparison, swap, and pointer movement.

#### Acceptance Criteria

- [ ] 4.1: Operations supported: Traverse, Linear Search, Binary Search, Insert at Index, Delete at Index, Update at Index, Reverse, Rotate Left, Rotate Right, Bubble Sort, Selection Sort, Insertion Sort, Merge Sort, Quick Sort
- [ ] 4.2: Every sort operation generates a step for every comparison and swap â€” not just final state
- [ ] 4.3: Memory addresses display as hex: `0x03E8`, `0x03EC`, etc. (base + index Ã— 4)
- [ ] 4.4: Duplicate values handled without crash
- [ ] 4.5: Single-element array handled without crash
- [ ] 4.6: Unit tests cover: empty array, single element, all-duplicate, already-sorted, worst-case quicksort

### Requirement 5: Strings Module

**User Story:** As a student, I want to see character-level animation for string algorithms so that I understand each transformation step.

#### Acceptance Criteria

- [ ] 5.1: Operations: Reverse, Palindrome Check, Character Frequency, Pattern Search (Naive), Pattern Search (KMP), Anagram Check, Longest Common Prefix, Caesar Cipher
- [ ] 5.2: KMP shows failure-function construction steps before the search phase
- [ ] 5.3: Caesar cipher has a separate shift input (1â€“25)
- [ ] 5.4: Unit tests: empty string, single char, palindrome, non-palindrome, pattern not found

### Requirement 6: Linked List Module

**User Story:** As a student, I want to see pointer arrows animate during linked list operations so that I understand how nodes connect and disconnect.

#### Acceptance Criteria

- [ ] 6.1: Operations: Insert Head, Insert Tail, Insert at Index, Delete Head, Delete Tail, Delete by Value, Reverse, Search, Find Middle (Floyd's), Detect Cycle
- [ ] 6.2: Reverse shows prev/curr/next pointer labels at each step
- [ ] 6.3: Cycle Detection uses a virtual cycle â€” no actual circular reference in state
- [ ] 6.4: Find Middle shows both fast and slow pointer positions per step
- [ ] 6.5: Unit tests: single-node reverse, delete only node, search not found, middle of even-length list

### Requirement 7: Stack Module

**User Story:** As a student, I want to see elements visually stacking and unstacking so that I understand LIFO order.

#### Acceptance Criteria

- [ ] 7.1: Operations: Push, Pop, Peek, Clear, Check Empty, Evaluate Expression (balanced parentheses)
- [ ] 7.2: Underflow produces a dedicated error step: "Stack underflow â€” cannot pop from empty stack"
- [ ] 7.3: Expression evaluator shows character-by-character processing with stack state per step
- [ ] 7.4: Unit tests: push/pop sequence, pop on empty, balanced expression, unbalanced expression

### Requirement 8: Queue Module

**User Story:** As a student, I want to see elements entering at the rear and leaving at the front so that I understand FIFO order.

#### Acceptance Criteria

- [ ] 8.1: Operations: Enqueue, Dequeue, Front, Rear, Clear, Check Empty
- [ ] 8.2: Queue renders horizontally with Front labeled left and Rear labeled right
- [ ] 8.3: Dequeue on empty produces error step: "Queue underflow â€” cannot dequeue from empty queue"
- [ ] 8.4: Unit tests: enqueue sequence, dequeue until empty, front/rear on single element

### Requirement 9: Trees / BST Module

**User Story:** As a student, I want to see every node comparison and pointer update during tree operations so that I understand how BST properties are maintained.

#### Acceptance Criteria

- [ ] 9.1: Operations: Insert, Delete (3 cases), Search, Inorder, Preorder, Postorder, Level Order, Height, Count Leaves, Find Min, Find Max, Is BST validation
- [ ] 9.2: Tree layout computed via in-order x-position algorithm â€” no node overlap at â‰¤ 31 nodes
- [ ] 9.3: Duplicate key insertion rejected: "Duplicate key X â€” BST does not allow duplicates"
- [ ] 9.4: Delete with two children highlights inorder successor before replacement
- [ ] 9.5: Level Order shows queue contents in variables panel each step
- [ ] 9.6: Unit tests: insert into empty tree, delete root with two children, search not found, inorder on 7-node tree matches sorted output

### Requirement 10: Sorting Module

**User Story:** As a student, I want to compare all sorting algorithms on the same input so that I understand their performance differences.

#### Acceptance Criteria

- [ ] 10.1: Algorithms: Bubble, Selection, Insertion, Merge, Quick, Heap Sort
- [ ] 10.2: Merge Sort steps show split and merge sub-arrays, not just swaps
- [ ] 10.3: Quick Sort pivot remains in `pivot` state throughout its partition phase
- [ ] 10.4: Algorithm comparison table (time/space/stable) visible below the visualization
- [ ] 10.5: Unit tests: already-sorted (bubble early exit), reverse-sorted, single element, two elements, all-equal

### Requirement 11: Searching Module

**User Story:** As a student, I want to see how different search algorithms eliminate candidates so that I understand their efficiency differences.

#### Acceptance Criteria

- [ ] 11.1: Algorithms: Linear Search, Binary Search, Jump Search, Interpolation Search
- [ ] 11.2: Array automatically sorted before Binary / Jump / Interpolation Search with a note
- [ ] 11.3: Binary Search shows lo/mid/hi in variables panel every step
- [ ] 11.4: Target not found ends with all cells in eliminated state
- [ ] 11.5: Unit tests: target at index 0, target at last index, target not present, single-element array

### Requirement 12: Graphs Module

**User Story:** As a student, I want to run graph algorithms on a graph I build myself so that I understand how traversal and shortest-path algorithms work on real structure.

#### Acceptance Criteria

- [ ] 12.1: Operations: BFS, DFS, Dijkstra's Shortest Path, Cycle Detection, Topological Sort, Connected Components
- [ ] 12.2: Dijkstra shows distance table updated in variables panel each step
- [ ] 12.3: User can add/remove vertices and edges before running an algorithm
- [ ] 12.4: Directed/undirected toggle affects edge rendering (arrows vs lines)
- [ ] 12.5: Unit tests: BFS/DFS on disconnected graph, Dijkstra with unreachable node, cycle detection on acyclic vs cyclic

### Requirement 13: Dynamic Programming Module

**User Story:** As a student, I want to see the DP table fill cell by cell so that I understand how subproblems build into the final solution.

#### Acceptance Criteria

- [ ] 13.1: Problems: Fibonacci, 0/1 Knapsack, LCS, Coin Change, Longest Increasing Subsequence
- [ ] 13.2: Each step highlights the cell being computed
- [ ] 13.3: LCS traceback path highlighted after table is complete
- [ ] 13.4: Knapsack input accepts `weight:value` pairs (e.g. `2:6, 3:10`)
- [ ] 13.5: Unit tests: Fibonacci base cases, Coin Change no solution, LCS empty string, Knapsack zero capacity

### Requirement 14: Heap Module (new)

**User Story:** As a student, I want to see heapify operations animate so that I understand how the heap property is maintained after insertions and extractions.

#### Acceptance Criteria

- [ ] 14.1: Operations: Insert, Extract Min/Max, Heapify Up, Heapify Down, Build Heap from Array, Peek
- [ ] 14.2: Toggle between Min-Heap and Max-Heap mode
- [ ] 14.3: Heapify shows every swap step, not just final position
- [ ] 14.4: Build Heap shows O(n) bottom-up heapify sequence
- [ ] 14.5: Unit tests: insert into empty heap, extract from single-element heap, build heap on already-valid heap

### Requirement 15: Hash Table Module (new)

**User Story:** As a student, I want to see hash collisions and resolution animate so that I understand how hash tables handle collisions in practice.

#### Acceptance Criteria

- [ ] 15.1: Operations: Insert, Search, Delete, Show Load Factor, Rehash
- [ ] 15.2: Two collision strategies: Linear Probing and Separate Chaining â€” toggle between them
- [ ] 15.3: Hash function step shown: `hash(key) = key % tableSize = X`
- [ ] 15.4: Rehash doubles table size and shows re-insertion step by step
- [ ] 15.5: Unit tests: insert causing collision, search not found, delete and re-insert at same slot

### Requirement 16: Trie Module (new)

**User Story:** As a student, I want to see how words are inserted into a Trie with shared prefixes so that I understand prefix-tree compression.

#### Acceptance Criteria

- [ ] 16.1: Operations: Insert Word, Search Word, Prefix Search, Delete Word, Autocomplete (top-3)
- [ ] 16.2: Shared prefixes rendered as shared path nodes
- [ ] 16.3: Autocomplete returns up to 3 suggestions sorted lexicographically
- [ ] 16.4: Unit tests: insert duplicate word (no-op), search prefix only (not a word), delete word that is prefix of another

### Requirement 17: Greedy Module (new)

**User Story:** As a student, I want to see why each greedy choice is made at every step so that I understand the greedy strategy.

#### Acceptance Criteria

- [ ] 17.1: Problems: Activity Selection, Fractional Knapsack, Huffman Coding, Minimum Coins
- [ ] 17.2: Huffman shows priority queue state at each merge step
- [ ] 17.3: Fractional Knapsack shows items sorted by value/weight ratio with fraction taken per step
- [ ] 17.4: Unit tests: single activity, all activities compatible, Huffman on 2 chars, minimum coins non-canonical system note

### Requirement 18: Backtracking Module (new)

**User Story:** As a student, I want to see each recursive call and backtrack step animate so that I understand how backtracking explores and abandons branches.

#### Acceptance Criteria

- [ ] 18.1: Problems: N-Queens (N = 4â€“8), Sudoku Solver, Permutations, Rat in a Maze
- [ ] 18.2: Backtrack steps visually show "undo" â€” cell returns to empty state
- [ ] 18.3: N-Queens step cap: 500 steps maximum â€” shows first complete solution path
- [ ] 18.4: Unit tests: 4-Queens (2 solutions found), Sudoku unique solution, permutations of [1,2,3]

### Requirement 19: Interview Patterns Module (new)

**User Story:** As a student preparing for interviews, I want to see common pattern templates animate on my own input so that I can recognize them in problems.

#### Acceptance Criteria

- [ ] 19.1: Patterns: Two Pointers (pair sum, remove duplicates), Sliding Window (max sum subarray, longest unique substring), Fast & Slow Pointers (cycle detection, find middle)
- [ ] 19.2: Two Pointers visualization shows both pointer labels (left/right) each step
- [ ] 19.3: Sliding Window highlights window bounds as a range
- [ ] 19.4: Unit tests: pair sum no solution, window = array size, non-cyclic list

### Requirement 20: Code Line Synchronization

**User Story:** As a student watching an algorithm animate, I want the code panel to highlight the exact executing line at each step so that I can map visual changes to code logic.

#### Acceptance Criteria

- [ ] 20.1: Each `AlgorithmStep.codeLine` maps to a 1-indexed line in the canonical Python reference stored as `CANONICAL_CODE` in the runner file
- [ ] 20.2: `CodePanel` `activeLine` prop receives `currentStep.codeLine`
- [ ] 20.3: Variable inspector shows `currentStep.variables` â€” updates every step
- [ ] 20.4: Language selector switches displayed code but does not change `codeLine` (Python is canonical)

### Requirement 21: Accessibility

**User Story:** As a student with motor or visual disabilities, I want the visualizer to be fully operable by keyboard and screen reader so that the platform is usable regardless of ability.

#### Acceptance Criteria

- [ ] 21.1: `aria-live="polite"` region in `DSALayout` receives `currentStep.description` on each step change
- [ ] 21.2: `prefers-reduced-motion` detected on mount â€” auto-play minimum interval 800 ms when active
- [ ] 21.3: Every operation button has `aria-label`
- [ ] 21.4: Play/Pause has `aria-pressed` reflecting current state
- [ ] 21.5: Step counter has `aria-label="Step N of M"`
- [ ] 21.6: All SVG canvas elements have `aria-hidden="true"`

### Requirement 22: Testing

**User Story:** As a developer maintaining the engine, I want unit tests on every AlgorithmRunner so that an incorrect algorithm is caught before it teaches students wrong concepts.

#### Acceptance Criteria

- [ ] 22.1: Test files at `src/engine/runners/__tests__/<module>Runners.test.ts`
- [ ] 22.2: Every runner has â‰¥ 3 test cases: empty/minimal input, typical input with known-correct final state, one adversarial edge case
- [ ] 22.3: Tests assert `steps[steps.length - 1].state` matches expected final state
- [ ] 22.4: Tests are pure â€” no React, no DOM, no async side effects
- [ ] 22.5: `npm test` runs all tests and exits 0

### Requirement 23: Performance

**User Story:** As a student using any DSA module, I want the platform to remain fast and responsive so that animations never stutter and the app loads quickly.

#### Acceptance Criteria

- [ ] 23.1: Step generation completes in < 100 ms for any input within module size limits
- [ ] 23.2: `steps[]` is computed exactly once per "Run" click â€” never recomputed during playback
- [ ] 23.3: Each DSA world page remains its own lazy-loaded chunk (existing code-splitting preserved)

