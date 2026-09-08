// Pure Queue Step Generator Engine — Conforming to Shared AlgorithmStep Contract
//
// Previously QueueWorld.tsx mutated state directly with no step generator
// at all (instant enqueue/dequeue, no playback, no codeLine, no undo) — see
// docs/dsaverse-2-migration-plan.md Phase 3.
import { type AlgorithmStep } from '../types/algorithmStep'

export interface QueueSnapshot {
  items: number[]
  action: string
}

export type QueueStep = AlgorithmStep<QueueSnapshot>

// Canonical Python reference per operation — see arrayEngine.ts for why
// codeLine is Python-only.
export const QUEUE_CANONICAL_CODE = {
  enqueue: `def enqueue(queue, val):\n    queue.append(val)\n    return queue`,
  dequeue: `def dequeue(queue):\n    if not queue:\n        raise IndexError("dequeue from empty queue")\n    return queue.pop(0)`,
  front: `def front(queue):\n    if not queue:\n        return None\n    return queue[0]`,
} as const

export function generateQueueEnqueueSteps(initial: number[], val: number): QueueStep[] {
  const q = [...initial, val]
  return [
    {
      stepIndex: 0,
      description: `Enqueue ${val} at the rear. Queue size: ${q.length}`,
      stateSnapshot: { items: q, action: `ENQUEUE ${val}` },
      variables: { enqueued: val, size: q.length, front: q[0], rear: val },
      complexity: { time: 'O(1)', space: 'O(1)', explanation: 'Enqueue is a constant-time append at the rear.' },
      highlights: { activeIndices: [q.length - 1], codeLine: 2 },
    },
  ]
}

export function generateQueueDequeueSteps(initial: number[]): QueueStep[] {
  if (initial.length === 0) {
    return [
      {
        stepIndex: 0,
        description: 'Queue underflow — cannot dequeue from an empty queue.',
        stateSnapshot: { items: [], action: 'UNDERFLOW' },
        variables: { status: 'Underflow' },
        complexity: { time: 'O(1)', space: 'O(1)', explanation: 'Empty queue guard check.' },
        highlights: { codeLine: 3 },
      },
    ]
  }

  const q = [...initial]
  const dequeued = q.shift()!
  return [
    {
      stepIndex: 0,
      description: `Dequeue ${dequeued} from the front. Remaining: ${q.length}`,
      stateSnapshot: { items: q, action: `DEQUEUE -> ${dequeued}` },
      variables: { dequeued, remaining: q.length },
      complexity: { time: 'O(N)', space: 'O(1)', explanation: 'Array-backed dequeue shifts remaining elements.' },
      highlights: { codeLine: 4 },
    },
  ]
}

export function generateQueueFrontSteps(initial: number[]): QueueStep[] {
  if (initial.length === 0) {
    return [
      {
        stepIndex: 0,
        description: 'Queue is empty — nothing at the front.',
        stateSnapshot: { items: [], action: 'EMPTY' },
        variables: { status: 'Empty' },
        complexity: { time: 'O(1)', space: 'O(1)', explanation: 'Empty queue guard check.' },
        highlights: { codeLine: 3 },
      },
    ]
  }

  const frontVal = initial[0]
  return [
    {
      stepIndex: 0,
      description: `Front value: ${frontVal}`,
      stateSnapshot: { items: [...initial], action: `FRONT -> ${frontVal}` },
      variables: { front: frontVal },
      complexity: { time: 'O(1)', space: 'O(1)', explanation: 'Front reads the head without removing it.' },
      highlights: { activeIndices: [0], codeLine: 4 },
    },
  ]
}
