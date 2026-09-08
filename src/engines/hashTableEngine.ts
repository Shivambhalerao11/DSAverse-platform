// Pure Hash Table Step Generator Engine — Collision Resolution (Chaining & Open Addressing)
import { type AlgorithmStep } from '../types/algorithmStep'

export interface HashBucket {
  index: number
  chain: Array<{ key: string; value: number }>
}

export type HashTableStep = AlgorithmStep<{ buckets: HashBucket[]; activeIndex?: number; foundVal?: number }>

// Canonical Python reference per operation — see arrayEngine.ts for why
// codeLine is Python-only.
export const HASH_TABLE_CANONICAL_CODE = {
  insert: `def insert(table, key, value):\n    idx = hash(key) % len(table)\n    table[idx].append((key, value))\n    return table`,
  search: `def search(table, key):\n    idx = hash(key) % len(table)\n    for k, v in table[idx]:\n        if k == key:\n            return v\n    return None`,
} as const

export function generateHashTableInsertSteps(existing: Array<{ key: string; value: number }>, key: string, value: number, tableSize: number = 7): HashTableStep[] {
  const buckets: HashBucket[] = Array.from({ length: tableSize }, (_, i) => ({ index: i, chain: [] }))

  // Re-populate existing
  existing.forEach((item) => {
    let hash = 0
    for (let c = 0; c < item.key.length; c++) hash = (hash + item.key.charCodeAt(c)) % tableSize
    buckets[hash].chain.push(item)
  })

  let hash = 0
  for (let c = 0; c < key.length; c++) hash = (hash + key.charCodeAt(c)) % tableSize

  const steps: HashTableStep[] = []

  steps.push({
    stepIndex: 0,
    description: `Hash Function: hash("${key}") = (${key.split('').map((c) => c.charCodeAt(0)).join('+')}) % ${tableSize} = index ${hash}`,
    stateSnapshot: { buckets: buckets.map((b) => ({ ...b, chain: [...b.chain] })), activeIndex: hash },
    variables: { key, value, computedHashIndex: hash, tableSize },
    complexity: { time: 'O(1) Avg', space: 'O(N)', explanation: 'Hash function maps string key to array bucket index.' },
    highlights: { activeIndices: [hash], codeLine: 2 },
  })

  const newBuckets = buckets.map((b) => ({ ...b, chain: [...b.chain] }))
  newBuckets[hash].chain.push({ key, value })

  const collisionOccurred = buckets[hash].chain.length > 0

  steps.push({
    stepIndex: 1,
    description: collisionOccurred
      ? `Collision detected at index ${hash}! Resolved using Separate Chaining (appended key "${key}" to bucket ${hash} linked list).`
      : `Inserted pair ("${key}": ${value}) at bucket index ${hash} with 0 collisions.`,
    stateSnapshot: { buckets: newBuckets, activeIndex: hash },
    variables: { key, value, bucketIndex: hash, collision: collisionOccurred },
    complexity: { time: collisionOccurred ? 'O(K) Chain' : 'O(1)', space: 'O(N)', explanation: 'Separate chaining appends colliding key-value pairs.' },
    highlights: { activeIndices: [hash], codeLine: 3 },
  })

  return steps
}

export function generateHashTableSearchSteps(existing: Array<{ key: string; value: number }>, targetKey: string, tableSize: number = 7): HashTableStep[] {
  const buckets: HashBucket[] = Array.from({ length: tableSize }, (_, i) => ({ index: i, chain: [] }))

  existing.forEach((item) => {
    let hash = 0
    for (let c = 0; c < item.key.length; c++) hash = (hash + item.key.charCodeAt(c)) % tableSize
    buckets[hash].chain.push(item)
  })

  let hash = 0
  for (let c = 0; c < targetKey.length; c++) hash = (hash + targetKey.charCodeAt(c)) % tableSize

  const steps: HashTableStep[] = []
  const foundItem = buckets[hash].chain.find((i) => i.key === targetKey)

  steps.push({
    stepIndex: 0,
    description: `Searching key "${targetKey}": Hash index = ${hash}. Inspecting bucket ${hash}...`,
    stateSnapshot: { buckets: buckets.map((b) => ({ ...b, chain: [...b.chain] })), activeIndex: hash },
    variables: { targetKey, hashIndex: hash },
    complexity: { time: 'O(1) Avg', space: 'O(1)', explanation: 'Direct O(1) hash table lookup.' },
    highlights: { activeIndices: [hash], codeLine: 2 },
  })

  steps.push({
    stepIndex: 1,
    description: foundItem
      ? `Key "${targetKey}" found in bucket ${hash} with value = ${foundItem.value}!`
      : `Key "${targetKey}" not found in bucket ${hash}.`,
    stateSnapshot: { buckets: buckets.map((b) => ({ ...b, chain: [...b.chain] })), activeIndex: hash, foundVal: foundItem?.value },
    variables: { targetKey, found: !!foundItem, value: foundItem?.value ?? 'N/A' },
    complexity: { time: 'O(1) Avg', space: 'O(1)', explanation: 'Lookup completes.' },
    highlights: { activeIndices: [hash], codeLine: foundItem ? 4 : 6 },
  })

  return steps
}
