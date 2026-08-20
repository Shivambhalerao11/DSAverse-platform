// Pure Dynamic Programming Tabulation Step Generator Engine
import { type AlgorithmStep } from '../types/algorithmStep'

export interface DPGridSnapshot {
  grid: (number | string)[][]
  currentCell: [number, number]
  problemName: string
}

export type DPStep = AlgorithmStep<DPGridSnapshot>

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
    highlights: { activeIndices: [0, 1] },
  })

  for (let i = 2; i <= n; i++) {
    table[i] = table[i - 1] + table[i - 2]
    steps.push({
      stepIndex: i - 1,
      description: `Tabulation Step ${i}: dp[${i}] = dp[${i - 1}] (${table[i - 1]}) + dp[${i - 2}] (${table[i - 2]}) = ${table[i]}`,
      stateSnapshot: { grid: [[...table]], currentCell: [0, i], problemName: 'Fibonacci' },
      variables: { i, value: table[i], prev1: table[i - 1], prev2: table[i - 2] },
      complexity: { time: 'O(N)', space: 'O(N)', explanation: 'Subproblem solved in O(1) time using previously memoized values.' },
      highlights: { compareIndices: [i - 1, i - 2], activeIndices: [i] },
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
    highlights: { activeIndices: [0] },
  })

  for (let i = 1; i <= n; i++) {
    for (let w = 1; w <= capacity; w++) {
      const wt = weights[i - 1]
      const val = values[i - 1]
      if (wt <= w) {
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
        highlights: { activeIndices: [w] },
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
    highlights: {},
  })

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (str1[i - 1] === str2[j - 1]) {
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
        highlights: { activeIndices: [j] },
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
    highlights: { activeIndices: [0] },
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
      highlights: { activeIndices: [i] },
    })
  }

  return steps
}
