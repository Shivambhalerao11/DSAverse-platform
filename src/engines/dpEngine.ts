// Pure Dynamic Programming Tabulation Step Generator Engine
import { type AlgorithmStep } from '../types/algorithmStep'

export interface DPGridSnapshot {
  grid: (number | string)[][]
  currentCell: [number, number]
  problemName: string
}

export type DPStep = AlgorithmStep<DPGridSnapshot>

// Canonical Python reference per problem — see arrayEngine.ts for why
// codeLine is Python-only.
export const DP_CANONICAL_CODE = {
  fibonacci: `def fib(n):\n    dp = [0] * (n + 1)\n    dp[1] = 1\n    for i in range(2, n + 1):\n        dp[i] = dp[i - 1] + dp[i - 2]\n    return dp[n]`,
  knapsack: `def knapsack(weights, values, capacity):\n    n = len(weights)\n    dp = [[0] * (capacity + 1) for _ in range(n + 1)]\n    for i in range(1, n + 1):\n        for w in range(1, capacity + 1):\n            if weights[i - 1] <= w:\n                dp[i][w] = max(dp[i - 1][w], values[i - 1] + dp[i - 1][w - weights[i - 1]])\n            else:\n                dp[i][w] = dp[i - 1][w]\n    return dp[n][capacity]`,
  lcs: `def lcs(a, b):\n    m, n = len(a), len(b)\n    dp = [[0] * (n + 1) for _ in range(m + 1)]\n    for i in range(1, m + 1):\n        for j in range(1, n + 1):\n            if a[i - 1] == b[j - 1]:\n                dp[i][j] = 1 + dp[i - 1][j - 1]\n            else:\n                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])\n    return dp[m][n]`,
  coinChange: `def coin_change(coins, amount):\n    dp = [0] + [float('inf')] * amount\n    for i in range(1, amount + 1):\n        for c in coins:\n            if c <= i:\n                dp[i] = min(dp[i], dp[i - c] + 1)\n    return dp[amount]`,
} as const

export function generateFibonacciDPSteps(n: number): DPStep[] {
  const table = new Array(n + 1).fill(0)
  const steps: DPStep[] = []

  table[0] = 0
  if (n >= 1) table[1] = 1

  steps.push({
    stepIndex: 0,
    description: `Initializing Base Cases: dp[0] = 0, dp[1] = 1 for N = ${n}.`,
    stateSnapshot: { grid: [table], currentCell: [0, 1], problemName: 'Fibonacci' },
    variables: { dp0: 0, dp1: 1, n },
    complexity: { time: 'O(N)', space: 'O(N)', explanation: 'Tabulation table allocated for N elements.' },
    highlights: { activeIndices: [0, 1], codeLine: 3 },
  })

  for (let i = 2; i <= n; i++) {
    table[i] = table[i - 1] + table[i - 2]
    steps.push({
      stepIndex: i - 1,
      description: `Tabulation Step ${i}: dp[${i}] = dp[${i - 1}] (${table[i - 1]}) + dp[${i - 2}] (${table[i - 2]}) = ${table[i]}`,
      stateSnapshot: { grid: [[...table]], currentCell: [0, i], problemName: 'Fibonacci' },
      variables: { i, value: table[i], prev1: table[i - 1], prev2: table[i - 2] },
      complexity: { time: 'O(N)', space: 'O(N)', explanation: 'Subproblem solved in O(1) time using previously memoized values.' },
      highlights: { compareIndices: [i - 1, i - 2], activeIndices: [i], codeLine: 5 },
    })
  }

  return steps
}

export function generateKnapsackDPSteps(weights: number[] = [2, 3, 4], values: number[] = [3, 4, 5], capacity: number = 5): DPStep[] {
  const n = weights.length
  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array(capacity + 1).fill(0))
  const steps: DPStep[] = []

  steps.push({
    stepIndex: 0,
    description: `0/1 Knapsack Base Case: 0 items or 0 capacity gives max value 0.`,
    stateSnapshot: { grid: dp.map((r) => [...r]), currentCell: [0, 0], problemName: '0/1 Knapsack' },
    variables: { items: n, capacity },
    complexity: { time: 'O(N * W)', space: 'O(N * W)', explanation: 'Tabulation grid size is N * W.' },
    highlights: { activeIndices: [0], codeLine: 3 },
  })

  for (let i = 1; i <= n; i++) {
    for (let w = 1; w <= capacity; w++) {
      const wt = weights[i - 1]
      const val = values[i - 1]
      const fits = wt <= w
      if (fits) {
        dp[i][w] = Math.max(dp[i - 1][w], val + dp[i - 1][w - wt])
      } else {
        dp[i][w] = dp[i - 1][w]
      }
      steps.push({
        stepIndex: steps.length,
        description: `Item ${i} (wt=${wt}, val=${val}), cap=${w}: max value = ${dp[i][w]}`,
        stateSnapshot: { grid: dp.map((r) => [...r]), currentCell: [i, w], problemName: '0/1 Knapsack' },
        variables: { item: i, weight: wt, val, capacity: w, maxValue: dp[i][w] },
        complexity: { time: 'O(N * W)', space: 'O(N * W)', explanation: 'Filled cell using subproblem recurrence.' },
        highlights: { activeIndices: [w], codeLine: fits ? 7 : 9 },
      })
    }
  }

  return steps
}

export function generateLCSDPSteps(str1: string = 'ABC', str2: string = 'AC'): DPStep[] {
  const m = str1.length
  const n = str2.length
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0))
  const steps: DPStep[] = []

  steps.push({
    stepIndex: 0,
    description: `LCS Initialized for "${str1}" vs "${str2}".`,
    stateSnapshot: { grid: dp.map((r) => [...r]), currentCell: [0, 0], problemName: 'Longest Common Subsequence' },
    variables: { str1, str2 },
    complexity: { time: 'O(M * N)', space: 'O(M * N)', explanation: 'LCS table dimension M * N.' },
    highlights: { codeLine: 3 },
  })

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const matches = str1[i - 1] === str2[j - 1]
      if (matches) {
        dp[i][j] = 1 + dp[i - 1][j - 1]
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1])
      }
      steps.push({
        stepIndex: steps.length,
        description: `Comparing str1[${i - 1}] ('${str1[i - 1]}') and str2[${j - 1}] ('${str2[j - 1]}'): LCS = ${dp[i][j]}`,
        stateSnapshot: { grid: dp.map((r) => [...r]), currentCell: [i, j], problemName: 'LCS' },
        variables: { i, j, char1: str1[i - 1], char2: str2[j - 1], lcsLen: dp[i][j] },
        complexity: { time: 'O(M * N)', space: 'O(M * N)', explanation: 'Matching characters increment subproblem value.' },
        highlights: { activeIndices: [j], codeLine: matches ? 7 : 9 },
      })
    }
  }

  return steps
}

export function generateCoinChangeDPSteps(coins: number[] = [1, 2, 5], amount: number = 6): DPStep[] {
  const dp = new Array(amount + 1).fill(Infinity)
  dp[0] = 0
  const steps: DPStep[] = []

  steps.push({
    stepIndex: 0,
    description: `Coin Change Base Case: dp[0] = 0 coins for amount 0.`,
    stateSnapshot: { grid: [dp.map((v) => (v === Infinity ? '∞' : v))], currentCell: [0, 0], problemName: 'Coin Change' },
    variables: { amount, coins: coins.join(',') },
    complexity: { time: 'O(Amount * Coins)', space: 'O(Amount)', explanation: 'Tabulation array of size Amount.' },
    highlights: { activeIndices: [0], codeLine: 2 },
  })

  for (let i = 1; i <= amount; i++) {
    for (const c of coins) {
      if (i - c >= 0) {
        dp[i] = Math.min(dp[i], dp[i - c] + 1)
      }
    }
    steps.push({
      stepIndex: steps.length,
      description: `Min coins for amount ${i}: ${dp[i] === Infinity ? '∞' : dp[i]}`,
      stateSnapshot: { grid: [dp.map((v) => (v === Infinity ? '∞' : v))], currentCell: [0, i], problemName: 'Coin Change' },
      variables: { amount: i, minCoins: dp[i] === Infinity ? 'Impossible' : dp[i] },
      complexity: { time: 'O(Amount * Coins)', space: 'O(Amount)', explanation: 'Optimal subproblem choice.' },
      highlights: { activeIndices: [i], codeLine: 6 },
    })
  }

  return steps
}
