// Requirement 20 regression check (docs/dsaverse-2-migration-plan.md Phase 3):
// every step's highlights.codeLine, when present, must be a real 1-indexed
// line number within that operation's canonical Python reference — never a
// fabricated/out-of-range value. This is breadth-first (every engine, every
// operation, at least one typical input) rather than exhaustive per-op
// correctness coverage — see the plan doc for what's intentionally deferred.
import { describe, it, expect } from 'vitest'
import { type AlgorithmStep } from '../../types/algorithmStep'

import { generateTraverseSteps, generateSearchSteps, generateReverseSteps, ARRAY_CANONICAL_CODE } from '../arrayEngine'
import {
  generateBubbleSortSteps,
  generateSelectionSortSteps,
  generateInsertionSortSteps,
  generateMergeSortSteps,
  generateQuickSortSteps,
  generateHeapSortSteps,
  generateLinearSearchSteps,
  generateBinarySearchSteps,
  SORT_SEARCH_CANONICAL_CODE,
} from '../sortSearchEngine'
import { generateTreeTraverseSteps, generateBSTInsertSteps, TREE_CANONICAL_CODE } from '../treeEngine'
import { generateLLTraverseSteps, generateLLInsertSteps, LINKED_LIST_CANONICAL_CODE } from '../linkedListEngine'
import { generateFibonacciDPSteps, generateKnapsackDPSteps, generateLCSDPSteps, generateCoinChangeDPSteps, DP_CANONICAL_CODE } from '../dpEngine'
import { generateBFSSteps, generateDFSSteps, generateDijkstraSteps, GRAPH_CANONICAL_CODE, type GraphNodeData } from '../graphEngine'
import { generateHeapInsertSteps, generateHeapExtractSteps, HEAP_CANONICAL_CODE } from '../heapEngine'
import { generateHashTableInsertSteps, generateHashTableSearchSteps, HASH_TABLE_CANONICAL_CODE } from '../hashTableEngine'
import { generateTrieInsertSteps, generateTrieSearchSteps, TRIE_CANONICAL_CODE } from '../trieEngine'
import { generateActivitySelectionSteps, generateFractionalKnapsackSteps, GREEDY_CANONICAL_CODE } from '../greedyEngine'
import { generateNQueensSteps, BACKTRACK_CANONICAL_CODE } from '../backtrackEngine'
import { generateReverseStringSteps, generatePalindromeCheckSteps, generateCaseSteps, STRING_CANONICAL_CODE } from '../stringEngine'
import { generateStackPushSteps, generateStackPopSteps, generateStackPeekSteps, STACK_CANONICAL_CODE } from '../stackEngine'
import { generateQueueEnqueueSteps, generateQueueDequeueSteps, generateQueueFrontSteps, QUEUE_CANONICAL_CODE } from '../queueEngine'

function lineCount(code: string): number {
  return code.split('\n').length
}

function assertValidCodeLines(steps: AlgorithmStep<unknown>[], code: string, label: string) {
  const max = lineCount(code)
  for (const step of steps) {
    const line = step.highlights.codeLine
    if (line === undefined) continue
    expect(line, `${label} step ${step.stepIndex}: codeLine ${line} should be >= 1`).toBeGreaterThanOrEqual(1)
    expect(line, `${label} step ${step.stepIndex}: codeLine ${line} should be <= ${max} (canonical code has ${max} lines)`).toBeLessThanOrEqual(max)
  }
}

const NODES: GraphNodeData[] = [
  { id: 'A', label: 'A', x: 0, y: 0 },
  { id: 'B', label: 'B', x: 1, y: 0 },
  { id: 'C', label: 'C', x: 2, y: 0 },
]
const EDGES = [
  { from: 'A', to: 'B' },
  { from: 'B', to: 'C' },
]

describe('Requirement 20 — codeLine is always within the canonical code bounds', () => {
  it('arrayEngine', () => {
    assertValidCodeLines(generateTraverseSteps([5, 3, 8]), ARRAY_CANONICAL_CODE.traverse, 'array.traverse')
    assertValidCodeLines(generateSearchSteps([5, 3, 8], 3), ARRAY_CANONICAL_CODE.search, 'array.search (found)')
    assertValidCodeLines(generateSearchSteps([5, 3, 8], 99), ARRAY_CANONICAL_CODE.search, 'array.search (not found)')
    assertValidCodeLines(generateReverseSteps([5, 3, 8, 1]), ARRAY_CANONICAL_CODE.reverse, 'array.reverse')
  })

  it('sortSearchEngine', () => {
    const arr = [5, 3, 8, 1, 9, 2]
    assertValidCodeLines(generateBubbleSortSteps(arr), SORT_SEARCH_CANONICAL_CODE.bubbleSort, 'sort.bubble')
    assertValidCodeLines(generateSelectionSortSteps(arr), SORT_SEARCH_CANONICAL_CODE.selectionSort, 'sort.selection')
    assertValidCodeLines(generateInsertionSortSteps(arr), SORT_SEARCH_CANONICAL_CODE.insertionSort, 'sort.insertion')
    assertValidCodeLines(generateMergeSortSteps(arr), SORT_SEARCH_CANONICAL_CODE.mergeSort, 'sort.merge')
    assertValidCodeLines(generateQuickSortSteps(arr), SORT_SEARCH_CANONICAL_CODE.quickSort, 'sort.quick')
    assertValidCodeLines(generateHeapSortSteps(arr), SORT_SEARCH_CANONICAL_CODE.heapSort, 'sort.heap')
    assertValidCodeLines(generateLinearSearchSteps(arr, 8), SORT_SEARCH_CANONICAL_CODE.linearSearch, 'search.linear')
    const sorted = [1, 2, 3, 5, 8, 9]
    assertValidCodeLines(generateBinarySearchSteps(sorted, 8), SORT_SEARCH_CANONICAL_CODE.binarySearch, 'search.binary (found)')
    assertValidCodeLines(generateBinarySearchSteps(sorted, 99), SORT_SEARCH_CANONICAL_CODE.binarySearch, 'search.binary (not found)')
  })

  it('treeEngine', () => {
    for (const type of ['inorder', 'preorder', 'postorder', 'levelorder'] as const) {
      assertValidCodeLines(generateTreeTraverseSteps([5, 3, 8], type), TREE_CANONICAL_CODE[type], `tree.${type}`)
    }
    assertValidCodeLines(generateBSTInsertSteps([5, 3, 8], 4), TREE_CANONICAL_CODE.bstInsert, 'tree.bstInsert')
  })

  it('linkedListEngine', () => {
    const nodes = [1, 2, 3].map((value, id) => ({ id, value }))
    assertValidCodeLines(generateLLTraverseSteps(nodes), LINKED_LIST_CANONICAL_CODE.traverse, 'll.traverse')
    assertValidCodeLines(generateLLInsertSteps(nodes, 9, true), LINKED_LIST_CANONICAL_CODE.insertHead, 'll.insertHead')
    assertValidCodeLines(generateLLInsertSteps(nodes, 9, false), LINKED_LIST_CANONICAL_CODE.insertTail, 'll.insertTail')
  })

  it('dpEngine', () => {
    assertValidCodeLines(generateFibonacciDPSteps(6), DP_CANONICAL_CODE.fibonacci, 'dp.fibonacci')
    assertValidCodeLines(generateKnapsackDPSteps([2, 3, 4], [3, 4, 5], 5), DP_CANONICAL_CODE.knapsack, 'dp.knapsack')
    assertValidCodeLines(generateLCSDPSteps('ABC', 'AC'), DP_CANONICAL_CODE.lcs, 'dp.lcs')
    assertValidCodeLines(generateCoinChangeDPSteps([1, 2, 5], 6), DP_CANONICAL_CODE.coinChange, 'dp.coinChange')
  })

  it('graphEngine', () => {
    assertValidCodeLines(generateBFSSteps(NODES, EDGES, 'A'), GRAPH_CANONICAL_CODE.bfs, 'graph.bfs')
    assertValidCodeLines(generateDFSSteps(NODES, EDGES, 'A'), GRAPH_CANONICAL_CODE.dfs, 'graph.dfs')
    assertValidCodeLines(generateDijkstraSteps(NODES, EDGES, 'A'), GRAPH_CANONICAL_CODE.dijkstra, 'graph.dijkstra')
  })

  it('heapEngine', () => {
    assertValidCodeLines(generateHeapInsertSteps([5, 3, 8], 1, 'min'), HEAP_CANONICAL_CODE.insert, 'heap.insert')
    assertValidCodeLines(generateHeapExtractSteps([1, 3, 8, 5], 'min'), HEAP_CANONICAL_CODE.extract, 'heap.extract')
    assertValidCodeLines(generateHeapExtractSteps([], 'min'), HEAP_CANONICAL_CODE.extract, 'heap.extract (empty)')
  })

  it('hashTableEngine', () => {
    assertValidCodeLines(generateHashTableInsertSteps([], 'foo', 1), HASH_TABLE_CANONICAL_CODE.insert, 'hash.insert')
    assertValidCodeLines(generateHashTableSearchSteps([{ key: 'foo', value: 1 }], 'foo'), HASH_TABLE_CANONICAL_CODE.search, 'hash.search (found)')
    assertValidCodeLines(generateHashTableSearchSteps([], 'missing'), HASH_TABLE_CANONICAL_CODE.search, 'hash.search (not found)')
  })

  it('trieEngine', () => {
    assertValidCodeLines(generateTrieInsertSteps([], 'cat'), TRIE_CANONICAL_CODE.insert, 'trie.insert')
    assertValidCodeLines(generateTrieSearchSteps(['cat', 'car'], 'cat'), TRIE_CANONICAL_CODE.search, 'trie.search')
  })

  it('greedyEngine', () => {
    const activities = [
      { id: 'a1', name: 'A1', start: 1, finish: 3 },
      { id: 'a2', name: 'A2', start: 2, finish: 5 },
      { id: 'a3', name: 'A3', start: 4, finish: 6 },
    ]
    assertValidCodeLines(generateActivitySelectionSteps(activities), GREEDY_CANONICAL_CODE.activitySelection, 'greedy.activitySelection')
    assertValidCodeLines(generateFractionalKnapsackSteps(), GREEDY_CANONICAL_CODE.fractionalKnapsack, 'greedy.fractionalKnapsack')
  })

  it('backtrackEngine', () => {
    assertValidCodeLines(generateNQueensSteps(4), BACKTRACK_CANONICAL_CODE.nQueens, 'backtrack.nQueens(4)')
    assertValidCodeLines(generateNQueensSteps(6), BACKTRACK_CANONICAL_CODE.nQueens, 'backtrack.nQueens(6)')
  })

  it('stringEngine', () => {
    assertValidCodeLines(generateReverseStringSteps('hello'), STRING_CANONICAL_CODE.reverse, 'string.reverse')
    assertValidCodeLines(generatePalindromeCheckSteps('racecar'), STRING_CANONICAL_CODE.palindrome, 'string.palindrome (true)')
    assertValidCodeLines(generatePalindromeCheckSteps('hello'), STRING_CANONICAL_CODE.palindrome, 'string.palindrome (false)')
    assertValidCodeLines(generateCaseSteps('hello', 'upper'), STRING_CANONICAL_CODE.uppercase, 'string.upper')
    assertValidCodeLines(generateCaseSteps('HELLO', 'lower'), STRING_CANONICAL_CODE.lowercase, 'string.lower')
  })

  it('stackEngine', () => {
    assertValidCodeLines(generateStackPushSteps([10, 20], 30), STACK_CANONICAL_CODE.push, 'stack.push')
    assertValidCodeLines(generateStackPopSteps([10, 20, 30]), STACK_CANONICAL_CODE.pop, 'stack.pop')
    assertValidCodeLines(generateStackPopSteps([]), STACK_CANONICAL_CODE.pop, 'stack.pop (underflow)')
    assertValidCodeLines(generateStackPeekSteps([10, 20]), STACK_CANONICAL_CODE.peek, 'stack.peek')
  })

  it('queueEngine', () => {
    assertValidCodeLines(generateQueueEnqueueSteps([10, 20], 30), QUEUE_CANONICAL_CODE.enqueue, 'queue.enqueue')
    assertValidCodeLines(generateQueueDequeueSteps([10, 20, 30]), QUEUE_CANONICAL_CODE.dequeue, 'queue.dequeue')
    assertValidCodeLines(generateQueueDequeueSteps([]), QUEUE_CANONICAL_CODE.dequeue, 'queue.dequeue (underflow)')
    assertValidCodeLines(generateQueueFrontSteps([10, 20]), QUEUE_CANONICAL_CODE.front, 'queue.front')
  })
})
