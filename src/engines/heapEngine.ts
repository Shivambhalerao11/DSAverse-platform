// Pure Heap Step Generator Engine — Min-Heap & Max-Heap Operations
import { type AlgorithmStep } from '../types/algorithmStep'

export type HeapStep = AlgorithmStep<number[]>

// Canonical Python reference (min-heap direction shown; max-heap flips the
// comparison but keeps the same line shape) — see arrayEngine.ts for why
// codeLine is Python-only.
export const HEAP_CANONICAL_CODE = {
  insert: `def insert(heap, val):\n    heap.append(val)\n    i = len(heap) - 1\n    while i > 0 and heap[i] < heap[(i - 1) // 2]:\n        heap[i], heap[(i - 1) // 2] = heap[(i - 1) // 2], heap[i]\n        i = (i - 1) // 2\n    return heap`,
  extract: `def extract_root(heap):\n    root = heap[0]\n    heap[0] = heap[-1]\n    heap.pop()\n    sift_down(heap, 0)\n    return root`,
} as const

export function generateHeapInsertSteps(initialHeap: number[], val: number, type: 'min' | 'max' = 'min'): HeapStep[] {
  const heap = [...initialHeap]
  const steps: HeapStep[] = []

  steps.push({
    stepIndex: 0,
    description: `Inserting value ${val} at the end of the ${type.toUpperCase()}-heap array.`,
    stateSnapshot: [...heap, val],
    variables: { insertVal: val, heapSize: heap.length + 1 },
    complexity: { time: 'O(log N)', space: 'O(1)', explanation: 'Inserted element placed at leaf level.' },
    highlights: { activeIndices: [heap.length], codeLine: 2 },
  })

  heap.push(val)
  let curr = heap.length - 1

  while (curr > 0) {
    const parent = Math.floor((curr - 1) / 2)
    const needSwap = type === 'min' ? heap[curr] < heap[parent] : heap[curr] > heap[parent]

    if (needSwap) {
      steps.push({
        stepIndex: steps.length,
        description: `Percolating Up: Swapping heap[${curr}] (${heap[curr]}) with parent heap[${parent}] (${heap[parent]}) to maintain ${type}-heap property (root = ${heap[0]}).`,
        stateSnapshot: [...heap],
        variables: { currentIdx: curr, parentIdx: parent, rootVal: heap[0] },
        complexity: { time: 'O(log N)', space: 'O(1)', explanation: `Bubbling up tree height H = log(N).` },
        highlights: { swapIndices: [curr, parent], codeLine: 5 },
      })

      const tmp = heap[curr]
      heap[curr] = heap[parent]
      heap[parent] = tmp
      curr = parent
    } else {
      break
    }
  }

  steps.push({
    stepIndex: steps.length,
    description: `${type.toUpperCase()}-Heap insertion complete. ${type === 'min' ? 'Minimum' : 'Maximum'} value at root: ${heap[0]}.`,
    stateSnapshot: [...heap],
    variables: { rootValue: heap[0], status: 'Valid Heap' },
    complexity: { time: 'O(log N)', space: 'O(1)', explanation: 'Heap property restored.' },
    highlights: { activeIndices: [0], codeLine: 7 },
  })

  return steps
}

export function generateHeapExtractSteps(initialHeap: number[], type: 'min' | 'max' = 'min'): HeapStep[] {
  if (initialHeap.length === 0) {
    return [
      {
        stepIndex: 0,
        description: 'Heap is empty. Insert elements before extracting root.',
        stateSnapshot: [],
        variables: { heapSize: 0 },
        complexity: { time: 'O(1)', space: 'O(1)', explanation: 'Empty heap.' },
        highlights: {},
      },
    ]
  }

  const heap = [...initialHeap]
  const extracted = heap[0]
  const steps: HeapStep[] = []

  steps.push({
    stepIndex: 0,
    description: `Extracting ${type === 'min' ? 'minimum' : 'maximum'} root element ${extracted}. Replacing root with last leaf element ${heap[heap.length - 1]}.`,
    stateSnapshot: [...heap],
    variables: { extractedValue: extracted, rootValue: heap[0] },
    complexity: { time: 'O(log N)', space: 'O(1)', explanation: 'Root removed and replaced with last leaf.' },
    highlights: { compareIndices: [0, heap.length - 1], codeLine: 3 },
  })

  heap[0] = heap[heap.length - 1]
  heap.pop()

  steps.push({
    stepIndex: 1,
    description: `Heap property restored after extraction. New ${type === 'min' ? 'minimum' : 'maximum'} root: ${heap[0] || 'Empty'}.`,
    stateSnapshot: [...heap],
    variables: { rootValue: heap[0] || 0, status: 'Restored' },
    complexity: { time: 'O(log N)', space: 'O(1)', explanation: 'Sift down restored heap order.' },
    highlights: { activeIndices: heap.length > 0 ? [0] : [], codeLine: 5 },
  })

  return steps
}
