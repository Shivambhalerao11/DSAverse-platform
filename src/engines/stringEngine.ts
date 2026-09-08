// Pure String Algorithm Engine — Conforming to Shared AlgorithmStep Contract
//
// Previously StringWorld.tsx had no step generator at all (instant
// transform, no playback, no codeLine) — see docs/dsaverse-2-migration-plan.md
// Phase 3. This engine brings Strings in line with the other 15 topics.
import { type AlgorithmStep } from '../types/algorithmStep'

export interface CharState {
  char: string
  state: 'default' | 'active' | 'compare' | 'match' | 'mismatch' | 'done'
}

export type StringStep = AlgorithmStep<CharState[]>

// Canonical Python reference per operation — see arrayEngine.ts for why
// codeLine is Python-only.
export const STRING_CANONICAL_CODE = {
  reverse: `def reverse(s):\n    chars = list(s)\n    l, r = 0, len(chars) - 1\n    while l < r:\n        chars[l], chars[r] = chars[r], chars[l]\n        l, r = l + 1, r - 1\n    return ''.join(chars)`,
  palindrome: `def is_palindrome(s):\n    l, r = 0, len(s) - 1\n    while l < r:\n        if s[l] != s[r]:\n            return False\n        l, r = l + 1, r - 1\n    return True`,
  uppercase: `def to_upper(s):\n    result = ''\n    for ch in s:\n        result += ch.upper()\n    return result`,
  lowercase: `def to_lower(s):\n    result = ''\n    for ch in s:\n        result += ch.lower()\n    return result`,
} as const

function baseChars(text: string): CharState[] {
  return text.split('').map((char) => ({ char, state: 'default' as const }))
}

export function generateReverseStringSteps(text: string): StringStep[] {
  if (text.length <= 1) {
    return [
      {
        stepIndex: 0,
        description: text.length === 0 ? 'String is empty.' : `Single character "${text}" is already reversed.`,
        stateSnapshot: baseChars(text),
        variables: { length: text.length },
        complexity: { time: 'O(1)', space: 'O(1)', explanation: 'No swaps needed.' },
        highlights: {},
      },
    ]
  }

  const chars = text.split('')
  const steps: StringStep[] = []
  let l = 0
  let r = chars.length - 1
  let idx = 0

  while (l < r) {
    const tmp = chars[l]
    chars[l] = chars[r]
    chars[r] = tmp

    steps.push({
      stepIndex: idx++,
      description: `Swapping chars[${l}] ('${chars[r]}') with chars[${r}] ('${chars[l]}')`,
      stateSnapshot: chars.map((char, i) => ({ char, state: i === l || i === r ? 'active' : 'default' })),
      variables: { left: l, right: r },
      complexity: { time: 'O(N)', space: 'O(N)', explanation: `In-place two-pointer reversal performs N/2 = ${Math.floor(text.length / 2)} swaps.` },
      highlights: { swapIndices: [l, r], codeLine: 5 },
    })
    l++
    r--
  }

  steps.push({
    stepIndex: idx,
    description: `Reversal complete: "${chars.join('')}"`,
    stateSnapshot: chars.map((char) => ({ char, state: 'done' })),
    variables: { result: chars.join('') },
    complexity: { time: 'O(N)', space: 'O(N)', explanation: 'All characters reversed in place.' },
    highlights: { codeLine: 7 },
  })

  return steps
}

export function generatePalindromeCheckSteps(text: string): StringStep[] {
  const normalized = text.toLowerCase().replace(/[^a-z0-9]/g, '')

  if (normalized.length <= 1) {
    return [
      {
        stepIndex: 0,
        description: normalized.length === 0 ? 'String is empty.' : `Single character "${normalized}" is trivially a palindrome.`,
        stateSnapshot: baseChars(text),
        variables: { length: normalized.length, isPalindrome: true },
        complexity: { time: 'O(1)', space: 'O(1)', explanation: 'No comparisons needed.' },
        highlights: {},
      },
    ]
  }

  const steps: StringStep[] = []
  let l = 0
  let r = normalized.length - 1
  let idx = 0
  let isPalindrome = true

  while (l < r) {
    const match = normalized[l] === normalized[r]
    if (!match) isPalindrome = false

    steps.push({
      stepIndex: idx++,
      description: match
        ? `Comparing '${normalized[l]}' (index ${l}) and '${normalized[r]}' (index ${r}) — match.`
        : `Comparing '${normalized[l]}' (index ${l}) and '${normalized[r]}' (index ${r}) — mismatch! Not a palindrome.`,
      stateSnapshot: normalized.split('').map((char, i) => ({
        char,
        state: i === l || i === r ? (match ? 'match' : 'mismatch') : i < l || i > r ? 'done' : 'default',
      })),
      variables: { left: l, right: r, match },
      complexity: { time: 'O(N)', space: 'O(1)', explanation: 'Two-pointer comparison from both ends inward.' },
      highlights: { compareIndices: [l, r], codeLine: match ? 3 : 4 },
    })

    if (!match) break
    l++
    r--
  }

  steps.push({
    stepIndex: idx,
    description: isPalindrome ? `"${text}" is a palindrome!` : `"${text}" is NOT a palindrome.`,
    stateSnapshot: normalized.split('').map((char) => ({ char, state: isPalindrome ? 'done' : 'default' })),
    variables: { isPalindrome },
    complexity: { time: 'O(N)', space: 'O(1)', explanation: 'Comparison complete.' },
    highlights: { codeLine: isPalindrome ? 7 : 4 },
  })

  return steps
}

export function generateCaseSteps(text: string, mode: 'upper' | 'lower'): StringStep[] {
  if (text.length === 0) {
    return [
      {
        stepIndex: 0,
        description: 'String is empty.',
        stateSnapshot: [],
        variables: { length: 0 },
        complexity: { time: 'O(1)', space: 'O(1)', explanation: 'No characters to transform.' },
        highlights: {},
      },
    ]
  }

  const steps: StringStep[] = []
  const result: string[] = []

  text.split('').forEach((ch, idx) => {
    const transformed = mode === 'upper' ? ch.toUpperCase() : ch.toLowerCase()
    result.push(transformed)
    steps.push({
      stepIndex: idx,
      description: `Transforming '${ch}' -> '${transformed}'`,
      stateSnapshot: [
        ...result.map((c) => ({ char: c, state: 'done' as const })),
        ...text.slice(idx + 1).split('').map((c) => ({ char: c, state: 'default' as const })),
      ],
      variables: { index: idx, original: ch, transformed },
      complexity: { time: 'O(N)', space: 'O(N)', explanation: `Transforms N = ${text.length} characters one at a time.` },
      highlights: { activeIndices: [idx], codeLine: 4 },
    })
  })

  steps.push({
    stepIndex: text.length,
    description: `Complete: "${result.join('')}"`,
    stateSnapshot: result.map((c) => ({ char: c, state: 'done' })),
    variables: { result: result.join('') },
    complexity: { time: 'O(N)', space: 'O(N)', explanation: 'All characters transformed.' },
    highlights: { codeLine: 5 },
  })

  return steps
}
