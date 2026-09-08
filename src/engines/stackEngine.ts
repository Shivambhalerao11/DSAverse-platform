// Pure Stack Step Generator Engine — Conforming to Shared AlgorithmStep Contract
//
// Previously StackWorld.tsx mutated state directly with no step generator
// at all (instant push/pop, no playback, no codeLine, no undo) — see
// docs/dsaverse-2-migration-plan.md Phase 3.
import { type AlgorithmStep } from '../types/algorithmStep'

export interface StackSnapshot {
  items: number[]
  action: string
}

export type StackStep = AlgorithmStep<StackSnapshot>

// Canonical Python reference per operation — see arrayEngine.ts for why
// codeLine is Python-only.
export const STACK_CANONICAL_CODE = {
  push: `def push(stack, val):\n    stack.append(val)\n    return stack`,
  pop: `def pop(stack):\n    if not stack:\n        raise IndexError("pop from empty stack")\n    return stack.pop()`,
  peek: `def peek(stack):\n    if not stack:\n        return None\n    return stack[-1]`,
} as const

export function generateStackPushSteps(initial: number[], val: number): StackStep[] {
  const stack = [...initial, val]
  return [
    {
      stepIndex: 0,
      description: `Push ${val} onto the top of the stack. Stack size: ${stack.length}`,
      stateSnapshot: { items: stack, action: `PUSH ${val}` },
      variables: { pushed: val, stackSize: stack.length, top: val },
      complexity: { time: 'O(1)', space: 'O(1)', explanation: 'Push is a constant-time append at the top.' },
      highlights: { activeIndices: [stack.length - 1], codeLine: 2 },
    },
  ]
}

export function generateStackPopSteps(initial: number[]): StackStep[] {
  if (initial.length === 0) {
    return [
      {
        stepIndex: 0,
        description: 'Stack underflow — cannot pop from an empty stack.',
        stateSnapshot: { items: [], action: 'UNDERFLOW' },
        variables: { status: 'Underflow' },
        complexity: { time: 'O(1)', space: 'O(1)', explanation: 'Empty stack guard check.' },
        highlights: { codeLine: 3 },
      },
    ]
  }

  const stack = [...initial]
  const popped = stack.pop()!
  return [
    {
      stepIndex: 0,
      description: `Pop ${popped} from the top. Stack size: ${stack.length}`,
      stateSnapshot: { items: stack, action: `POP -> ${popped}` },
      variables: { popped, stackSize: stack.length },
      complexity: { time: 'O(1)', space: 'O(1)', explanation: 'Pop is a constant-time removal from the top.' },
      highlights: { codeLine: 4 },
    },
  ]
}

export function generateStackPeekSteps(initial: number[]): StackStep[] {
  if (initial.length === 0) {
    return [
      {
        stepIndex: 0,
        description: 'Stack is empty — nothing to peek.',
        stateSnapshot: { items: [], action: 'EMPTY' },
        variables: { status: 'Empty' },
        complexity: { time: 'O(1)', space: 'O(1)', explanation: 'Empty stack guard check.' },
        highlights: { codeLine: 3 },
      },
    ]
  }

  const top = initial[initial.length - 1]
  return [
    {
      stepIndex: 0,
      description: `Peek TOP value: ${top}`,
      stateSnapshot: { items: [...initial], action: `PEEK -> ${top}` },
      variables: { top },
      complexity: { time: 'O(1)', space: 'O(1)', explanation: 'Peek reads the top without removing it.' },
      highlights: { activeIndices: [initial.length - 1], codeLine: 4 },
    },
  ]
}
