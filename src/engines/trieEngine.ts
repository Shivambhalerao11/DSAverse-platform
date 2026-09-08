// Pure Trie Step Generator Engine — Overlapping Word List Operations
import { type AlgorithmStep } from '../types/algorithmStep'

export interface TrieStepSnapshot {
  words: string[]
  currentWord?: string
  matchingPrefix?: string
  found?: boolean
}

export type TrieStep = AlgorithmStep<TrieStepSnapshot>

// Canonical Python reference per operation — see arrayEngine.ts for why
// codeLine is Python-only.
export const TRIE_CANONICAL_CODE = {
  insert: `def insert(root, word):\n    node = root\n    for ch in word:\n        if ch not in node.children:\n            node.children[ch] = TrieNode()\n        node = node.children[ch]\n    node.is_end = True`,
  search: `def search(root, word, prefix_only=False):\n    node = root\n    for ch in word:\n        if ch not in node.children:\n            return False\n        node = node.children[ch]\n    return prefix_only or node.is_end`,
} as const

export function generateTrieInsertSteps(existingWords: string[], word: string): TrieStep[] {
  const words = Array.from(new Set([...existingWords, word]))
  const steps: TrieStep[] = []

  for (let i = 1; i <= word.length; i++) {
    const prefix = word.slice(0, i)
    steps.push({
      stepIndex: i - 1,
      description: `Inserting char '${word[i - 1]}' -> Traversed prefix path "${prefix}" in Trie.`,
      stateSnapshot: { words, currentWord: word, matchingPrefix: prefix },
      variables: { currentChar: word[i - 1], prefixLength: i },
      complexity: { time: `O(L)`, space: 'O(L * Sigma)', explanation: `Trie insertion takes L = ${word.length} operations for word length.` },
      highlights: { activeNodes: [prefix], codeLine: 6 },
    })
  }

  steps.push({
    stepIndex: word.length,
    description: `Word "${word}" successfully inserted! Marked node "${word}" as terminal end-of-word node.`,
    stateSnapshot: { words, currentWord: word, matchingPrefix: word, found: true },
    variables: { status: 'Inserted', word },
    complexity: { time: 'O(L)', space: 'O(L)', explanation: 'Terminal node flag set to true.' },
    highlights: { activeNodes: [word], codeLine: 7 },
  })

  return steps
}

export function generateTrieSearchSteps(words: string[], target: string, isPrefixSearch = false): TrieStep[] {
  const steps: TrieStep[] = []
  let current = ''

  for (let i = 0; i < target.length; i++) {
    current += target[i]
    steps.push({
      stepIndex: i,
      description: `Traversing Trie edge for char '${target[i]}' -> Current path: "${current}"`,
      stateSnapshot: { words, currentWord: target, matchingPrefix: current },
      variables: { char: target[i], depth: i + 1 },
      complexity: { time: 'O(L)', space: 'O(1)', explanation: `Navigating Trie child pointers for prefix "${current}".` },
      highlights: { activeNodes: [current], codeLine: 6 },
    })
  }

  const isExactMatch = words.includes(target)
  const isPrefixMatch = words.some((w) => w.startsWith(target))
  const success = isPrefixSearch ? isPrefixMatch : isExactMatch

  steps.push({
    stepIndex: target.length,
    description: success
      ? (isPrefixSearch ? `Prefix "${target}" matched in Trie!` : `Exact word "${target}" found in Trie!`)
      : `Query "${target}" not found in Trie.`,
    stateSnapshot: { words, currentWord: target, matchingPrefix: target, found: success },
    variables: { query: target, status: success ? 'Found' : 'Not Found' },
    complexity: { time: 'O(L)', space: 'O(1)', explanation: success ? 'Search completed successfully.' : 'Path terminated early.' },
    highlights: { activeNodes: success ? [target] : [], codeLine: 7 },
  })

  return steps
}
