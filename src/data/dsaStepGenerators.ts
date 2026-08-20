/**
 * DSA Step Generators
 * Pure functions — take input, return an array of VisualizationStep<T>
 * Used by every DSA world for Auto Visualize.
 */

import { type VisualizationStep } from '../components/dsa/useVisualization'

// ─── Common Types ─────────────────────────────────────────────────────────────

export type BarState = { value: number; state: 'default'|'comparing'|'sorted'|'pivot'|'active'|'found' }
export type ArrayBlockState = { value: number; id: number; state: 'default'|'active'|'comparing'|'sorted'|'found'|'deleted'|'inserted'; address: string }
export type StackState = { items: number[]; highlight: number; action: string }
export type QueueState = { items: number[]; front: number; rear: number; action: string }

// ─── Arrays ───────────────────────────────────────────────────────────────────

export function generateTraversalSteps(arr: number[]): VisualizationStep<ArrayBlockState[]>[] {
  const steps: VisualizationStep<ArrayBlockState[]>[] = []
  const base = arr.map((v, i) => ({ value: v, id: i, state: 'default' as const, address: `0x${(1000+i*4).toString(16).toUpperCase()}` }))

  for (let i = 0; i < arr.length; i++) {
    const state = base.map((b, idx) => ({
      ...b,
      state: idx === i ? 'active' as const : idx < i ? 'sorted' as const : 'default' as const
    }))
    steps.push({
      state,
      description: `Visiting arr[${i}] = ${arr[i]} at address ${base[i].address}`,
      codeLine: 3, highlight: [i],
      variables: { i, 'arr[i]': arr[i], n: arr.length },
    })
  }
  steps.push({ state: base.map(b => ({ ...b, state: 'sorted' })), description: '✓ Traversal complete — all elements visited', codeLine: 5, variables: { result: arr.join(', ') } })
  return steps
}

export function generateSearchSteps(arr: number[], target: number): VisualizationStep<ArrayBlockState[]>[] {
  const steps: VisualizationStep<ArrayBlockState[]>[] = []
  const base = arr.map((v, i) => ({ value: v, id: i, state: 'default' as const, address: `0x${(1000+i*4).toString(16).toUpperCase()}` }))

  for (let i = 0; i < arr.length; i++) {
    const found = arr[i] === target
    steps.push({
      state: base.map((b, idx) => {
        let s: ArrayBlockState['state'] = 'default'
        if (idx === i) s = found ? 'found' : 'comparing'
        else if (idx < i) s = 'deleted'
        return { ...b, state: s }
      }),
      description: found
        ? `✓ Found ${target} at index [${i}]!`
        : `arr[${i}] = ${arr[i]} ≠ ${target} — move right`,
      codeLine: found ? 4 : 3,
      highlight: [i],
      foundIndex: found ? i : undefined,
      variables: { i, 'arr[i]': arr[i], target, match: found },
    })
    if (found) return steps
  }
  steps.push({ state: base.map(b => ({ ...b, state: 'deleted' })), description: `✗ ${target} not found in array`, codeLine: 7 })
  return steps
}

export function generateBubbleSortSteps(arr: number[]): VisualizationStep<BarState[]>[] {
  const steps: VisualizationStep<BarState[]>[] = []
  const a = [...arr]
  const n = a.length

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      const swap = a[j] > a[j+1]
      steps.push({
        state: a.map((v, idx) => ({ value: v, state: idx === j || idx === j+1 ? 'comparing' : idx >= n-i ? 'sorted' : 'default' })),
        description: `Comparing [${j}]=${a[j]} and [${j+1}]=${a[j+1]}${swap ? ' → Swap!' : ' → OK'}`,
        codeLine: swap ? 5 : 6,
        swapIndices: swap ? [j, j+1] : undefined,
        variables: { i, j, swapped: swap },
      })
      if (swap) [a[j], a[j+1]] = [a[j+1], a[j]]
    }
  }
  steps.push({ state: a.map(v => ({ value: v, state: 'sorted' })), description: '✓ Array sorted with Bubble Sort!', codeLine: 9 })
  return steps
}

export function generateSelectionSortSteps(arr: number[]): VisualizationStep<BarState[]>[] {
  const steps: VisualizationStep<BarState[]>[] = []
  const a = [...arr]
  for (let i = 0; i < a.length; i++) {
    let minIdx = i
    for (let j = i+1; j < a.length; j++) {
      steps.push({
        state: a.map((v, idx) => ({ value: v, state: idx === j ? 'comparing' : idx === minIdx ? 'pivot' : idx < i ? 'sorted' : 'default' })),
        description: `a[${j}]=${a[j]} vs current min a[${minIdx}]=${a[minIdx]}${a[j]<a[minIdx]?' → New min!':''}`,
        codeLine: 4,
        variables: { i, j, minIdx, 'a[j]': a[j], 'min': a[minIdx] },
      })
      if (a[j] < a[minIdx]) minIdx = j
    }
    if (minIdx !== i) [a[i], a[minIdx]] = [a[minIdx], a[i]]
    steps.push({
      state: a.map((v, idx) => ({ value: v, state: idx <= i ? 'sorted' : 'default' })),
      description: `Placed min=${a[i]} at position [${i}]`,
      codeLine: 6,
      swapIndices: [i, minIdx],
    })
  }
  steps.push({ state: a.map(v => ({ value: v, state: 'sorted' })), description: '✓ Selection Sort complete!', codeLine: 8 })
  return steps
}

export function generateInsertionSortSteps(arr: number[]): VisualizationStep<BarState[]>[] {
  const steps: VisualizationStep<BarState[]>[] = []
  const a = [...arr]
  for (let i = 1; i < a.length; i++) {
    const key = a[i]
    let j = i - 1
    while (j >= 0 && a[j] > key) {
      a[j+1] = a[j]
      steps.push({
        state: a.map((v, idx) => ({ value: v, state: idx === j+1 ? 'comparing' : idx <= i ? 'active' : 'default' })),
        description: `Shifting a[${j}]=${a[j]} right to make room for key=${key}`,
        codeLine: 5,
        variables: { key, j, 'a[j]': a[j] },
      })
      j--
    }
    a[j+1] = key
    steps.push({
      state: a.map((v, idx) => ({ value: v, state: idx <= i ? 'sorted' : 'default' })),
      description: `Placed key=${key} at index [${j+1}]`,
      codeLine: 6,
    })
  }
  steps.push({ state: a.map(v => ({ value: v, state: 'sorted' })), description: '✓ Insertion Sort complete!', codeLine: 8 })
  return steps
}

export function generateMergeSortSteps(arr: number[]): VisualizationStep<BarState[]>[] {
  const steps: VisualizationStep<BarState[]>[] = []
  const a = [...arr]

  function merge(arr: number[], l: number, m: number, r: number) {
    const L = arr.slice(l, m+1), R = arr.slice(m+1, r+1)
    let i = 0, j = 0, k = l
    while (i < L.length && j < R.length) {
      steps.push({
        state: arr.map((v, idx) => ({ value: v, state: idx === k ? 'comparing' : idx <= r && idx >= l ? 'active' : 'default' })),
        description: `Merging: comparing L[${i}]=${L[i]} and R[${j}]=${R[j]}`,
        codeLine: 8,
        variables: { 'L[i]': L[i], 'R[j]': R[j] },
      })
      if (L[i] <= R[j]) arr[k++] = L[i++]
      else arr[k++] = R[j++]
    }
    while (i < L.length) arr[k++] = L[i++]
    while (j < R.length) arr[k++] = R[j++]
  }

  function mergeSort(arr: number[], l: number, r: number) {
    if (l >= r) return
    const m = Math.floor((l + r) / 2)
    mergeSort(arr, l, m)
    mergeSort(arr, m+1, r)
    merge(arr, l, m, r)
  }

  mergeSort(a, 0, a.length - 1)
  steps.push({ state: a.map(v => ({ value: v, state: 'sorted' })), description: '✓ Merge Sort complete!', codeLine: 12 })
  return steps
}

export function generateQuickSortSteps(arr: number[]): VisualizationStep<BarState[]>[] {
  const steps: VisualizationStep<BarState[]>[] = []
  const a = [...arr]

  function partition(arr: number[], lo: number, hi: number): number {
    const pivot = arr[hi]
    let i = lo - 1
    for (let j = lo; j < hi; j++) {
      steps.push({
        state: arr.map((v, idx) => ({ value: v, state: idx === hi ? 'pivot' : idx === j ? 'comparing' : idx < lo ? 'sorted' : 'default' })),
        description: `Pivot=${pivot}: comparing a[${j}]=${arr[j]}${arr[j]<=pivot?' ≤ pivot → swap':'> pivot → skip'}`,
        codeLine: 5,
        variables: { pivot, i, j, 'arr[j]': arr[j] },
      })
      if (arr[j] <= pivot) { i++; [arr[i], arr[j]] = [arr[j], arr[i]] }
    }
    [arr[i+1], arr[hi]] = [arr[hi], arr[i+1]]
    return i + 1
  }

  function quickSort(arr: number[], lo: number, hi: number) {
    if (lo < hi) {
      const p = partition(arr, lo, hi)
      quickSort(arr, lo, p-1)
      quickSort(arr, p+1, hi)
    }
  }

  quickSort(a, 0, a.length - 1)
  steps.push({ state: a.map(v => ({ value: v, state: 'sorted' })), description: '✓ Quick Sort complete!', codeLine: 12 })
  return steps
}

// ─── Binary Search ────────────────────────────────────────────────────────────

export function generateBinarySearchSteps(arr: number[], target: number): VisualizationStep<BarState[]>[] {
  const steps: VisualizationStep<BarState[]>[] = []
  const sorted = [...arr].sort((a,b) => a-b)
  let lo = 0, hi = sorted.length - 1

  while (lo <= hi) {
    const mid = (lo + hi) >> 1
    steps.push({
      state: sorted.map((v, idx) => ({
        value: v,
        state: (idx < lo || idx > hi ? 'comparing' : idx === mid ? (v === target ? 'found' : 'comparing') : 'default') as BarState['state']
      })),
      description: `lo=${lo} mid=${mid} hi=${hi} | a[${mid}]=${sorted[mid]} ${sorted[mid]===target?'== target ✓':sorted[mid]<target?'< target → search right':'> target → search left'}`,
      codeLine: 4,
      foundIndex: sorted[mid] === target ? mid : undefined,
      variables: { lo, mid, hi, 'a[mid]': sorted[mid], target },
    })
    if (sorted[mid] === target) return steps
    if (sorted[mid] < target) lo = mid + 1
    else hi = mid - 1
  }

  steps.push({ state: sorted.map(v => ({ value: v, state: 'comparing' as BarState['state'] })), description: `✗ ${target} not found`, codeLine: 9 })
  return steps
}

// ─── Stack ────────────────────────────────────────────────────────────────────

export function generateStackPushSteps(initial: number[], values: number[]): VisualizationStep<StackState>[] {
  const steps: VisualizationStep<StackState>[] = []
  const stack = [...initial]
  for (const v of values) {
    stack.push(v)
    steps.push({
      state: { items: [...stack], highlight: stack.length - 1, action: `PUSH ${v}` },
      description: `Push ${v} → top of stack. Stack size: ${stack.length}`,
      codeLine: 2,
      variables: { pushed: v, stackSize: stack.length, top: v },
    })
  }
  return steps
}

export function generateStackPopSteps(initial: number[]): VisualizationStep<StackState>[] {
  const steps: VisualizationStep<StackState>[] = []
  const stack = [...initial]
  while (stack.length > 0) {
    const popped = stack.pop()!
    steps.push({
      state: { items: [...stack], highlight: -1, action: `POP → ${popped}` },
      description: `Pop ${popped} from top. Stack size: ${stack.length}`,
      codeLine: 3,
      variables: { popped, stackSize: stack.length },
    })
  }
  steps.push({ state: { items: [], highlight: -1, action: 'EMPTY' }, description: 'Stack is now empty', codeLine: 5 })
  return steps
}

// ─── Queue ────────────────────────────────────────────────────────────────────

export function generateQueueEnqueueSteps(initial: number[], values: number[]): VisualizationStep<QueueState>[] {
  const steps: VisualizationStep<QueueState>[] = []
  const q = [...initial]
  for (const v of values) {
    q.push(v)
    steps.push({
      state: { items: [...q], front: 0, rear: q.length - 1, action: `ENQUEUE ${v}` },
      description: `Enqueue ${v} at rear. Queue size: ${q.length}`,
      codeLine: 2,
      variables: { enqueued: v, size: q.length, front: q[0], rear: v },
    })
  }
  return steps
}

export function generateQueueDequeueSteps(initial: number[]): VisualizationStep<QueueState>[] {
  const steps: VisualizationStep<QueueState>[] = []
  const q = [...initial]
  while (q.length > 0) {
    const dequeued = q.shift()!
    steps.push({
      state: { items: [...q], front: 0, rear: q.length - 1, action: `DEQUEUE → ${dequeued}` },
      description: `Dequeue ${dequeued} from front. Remaining: ${q.length}`,
      codeLine: 3,
      variables: { dequeued, remaining: q.length },
    })
  }
  return steps
}

// ─── Fibonacci DP ─────────────────────────────────────────────────────────────

export function generateFibSteps(n: number): VisualizationStep<number[]>[] {
  const steps: VisualizationStep<number[]>[] = []
  const dp = new Array(n + 1).fill(0)
  dp[0] = 0
  if (n >= 1) dp[1] = 1

  steps.push({ state: [...dp], description: 'Initialize dp[0]=0, dp[1]=1 — base cases', codeLine: 2, variables: { n } })

  for (let i = 2; i <= n; i++) {
    dp[i] = dp[i-1] + dp[i-2]
    steps.push({
      state: [...dp],
      description: `dp[${i}] = dp[${i-1}] + dp[${i-2}] = ${dp[i-1]} + ${dp[i-2]} = ${dp[i]}`,
      codeLine: 5,
      highlight: [i],
      variables: { i, [`dp[${i}]`]: dp[i], [`dp[${i-1}]`]: dp[i-1], [`dp[${i-2}]`]: dp[i-2] },
    })
  }
  steps.push({ state: [...dp], description: `✓ fib(${n}) = ${dp[n]}`, codeLine: 7 })
  return steps
}

// ─── Coin Change DP ───────────────────────────────────────────────────────────

export function generateCoinChangeSteps(coins: number[], amount: number): VisualizationStep<(number|null)[]>[] {
  const steps: VisualizationStep<(number|null)[]>[] = []
  const dp: (number|null)[] = new Array(amount + 1).fill(null)
  dp[0] = 0

  steps.push({ state: [...dp], description: 'Initialize dp[0]=0 (0 coins for amount 0)', codeLine: 2 })

  for (let i = 1; i <= amount; i++) {
    for (const c of coins) {
      if (c <= i && dp[i-c] !== null) {
        const candidate = dp[i-c]! + 1
        if (dp[i] === null || candidate < dp[i]!) {
          dp[i] = candidate
          steps.push({
            state: [...dp],
            description: `dp[${i}] updated using coin=${c}: dp[${i-c}]+1 = ${candidate}`,
            codeLine: 6,
            highlight: [i],
            variables: { amount: i, coin: c, 'dp[i]': candidate },
          })
        }
      }
    }
  }

  const result = dp[amount]
  steps.push({ state: [...dp], description: result !== null ? `✓ Min coins for ${amount}: ${result}` : `✗ No solution for amount ${amount}`, codeLine: 9 })
  return steps
}

// ─── Graph BFS ────────────────────────────────────────────────────────────────

export interface GraphStepState {
  visited: Set<number>
  queue: number[]
  current: number | null
  order: number[]
}

export function generateBFSSteps(
  adj: Map<number, number[]>,
  start: number,
  nodeCount: number
): VisualizationStep<GraphStepState>[] {
  const steps: VisualizationStep<GraphStepState>[] = []
  const visited = new Set<number>([start])
  const queue = [start]
  const order: number[] = []

  steps.push({
    state: { visited: new Set(visited), queue: [...queue], current: null, order: [...order] },
    description: `Initialize BFS from node ${start}. Queue: [${queue}]`,
    codeLine: 2,
    variables: { start, queueSize: queue.length },
  })

  while (queue.length > 0) {
    const curr = queue.shift()!
    order.push(curr)
    const neighbors = adj.get(curr) || []

    steps.push({
      state: { visited: new Set(visited), queue: [...queue], current: curr, order: [...order] },
      description: `Visit node ${curr}. Explore neighbors: [${neighbors}]`,
      codeLine: 5,
      variables: { current: curr, visited: order.join('→'), remaining: queue.length },
    })

    for (const n of neighbors) {
      if (!visited.has(n)) {
        visited.add(n)
        queue.push(n)
        steps.push({
          state: { visited: new Set(visited), queue: [...queue], current: curr, order: [...order] },
          description: `Enqueue unvisited neighbor ${n}. Queue: [${queue}]`,
          codeLine: 7,
          variables: { neighbor: n, queueSize: queue.length },
        })
      }
    }
  }

  steps.push({
    state: { visited: new Set(visited), queue: [], current: null, order: [...order] },
    description: `✓ BFS complete. Visit order: ${order.join(' → ')}`,
    codeLine: 10,
  })
  return steps
}

export function generateDFSSteps(
  adj: Map<number, number[]>,
  start: number
): VisualizationStep<GraphStepState>[] {
  const steps: VisualizationStep<GraphStepState>[] = []
  const visited = new Set<number>()
  const order: number[] = []

  function dfs(node: number) {
    visited.add(node)
    order.push(node)
    steps.push({
      state: { visited: new Set(visited), queue: [], current: node, order: [...order] },
      description: `Visit node ${node} (depth-first). Path so far: ${order.join('→')}`,
      codeLine: 3,
      variables: { current: node, visitedCount: visited.size },
    })
    for (const neighbor of (adj.get(node) || [])) {
      if (!visited.has(neighbor)) {
        steps.push({
          state: { visited: new Set(visited), queue: [], current: node, order: [...order] },
          description: `Recurse into unvisited neighbor ${neighbor} from ${node}`,
          codeLine: 5,
          variables: { current: node, next: neighbor },
        })
        dfs(neighbor)
        steps.push({
          state: { visited: new Set(visited), queue: [], current: node, order: [...order] },
          description: `Backtrack to node ${node} from ${neighbor}`,
          codeLine: 7,
        })
      }
    }
  }

  dfs(start)
  steps.push({
    state: { visited: new Set(visited), queue: [], current: null, order: [...order] },
    description: `✓ DFS complete. Visit order: ${order.join(' → ')}`,
    codeLine: 9,
  })
  return steps
}
