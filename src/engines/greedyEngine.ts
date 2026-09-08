// Pure Greedy Choice Step Generator Engine — Activity Selection & Fractional Knapsack
import { type AlgorithmStep } from '../types/algorithmStep'

export interface Activity {
  id: string
  name: string
  start: number
  finish: number
}

export interface KnapsackItem {
  id: string
  name: string
  weight: number
  value: number
  ratio: number
}

export type GreedyStep = AlgorithmStep<{ selectedActivities?: Activity[]; selectedItems?: KnapsackItem[]; currentActivity?: Activity; currentItem?: KnapsackItem }>

// Canonical Python reference per problem — see arrayEngine.ts for why
// codeLine is Python-only.
export const GREEDY_CANONICAL_CODE = {
  activitySelection: `def activity_selection(activities):\n    activities.sort(key=lambda a: a.finish)\n    selected = []\n    last_finish = -1\n    for act in activities:\n        if act.start >= last_finish:\n            selected.append(act)\n            last_finish = act.finish\n    return selected`,
  fractionalKnapsack: `def fractional_knapsack(items, capacity):\n    items.sort(key=lambda i: i.value / i.weight, reverse=True)\n    total = 0\n    for item in items:\n        take = min(item.weight, capacity)\n        total += take * (item.value / item.weight)\n        capacity -= take\n    return total`,
} as const

export function generateActivitySelectionSteps(activities: Activity[]): GreedyStep[] {
  if (activities.length === 0) {
    return [
      {
        stepIndex: 0,
        description: 'No activities provided.',
        stateSnapshot: { selectedActivities: [] },
        variables: { count: 0 },
        complexity: { time: 'O(1)', space: 'O(1)', explanation: 'Empty activity list.' },
        highlights: {},
      },
    ]
  }

  const sorted = [...activities].sort((a, b) => a.finish - b.finish)
  const steps: GreedyStep[] = []
  const selected: Activity[] = []

  steps.push({
    stepIndex: 0,
    description: `Greedy Choice Rule: Sorting ${activities.length} activities by earliest finish time.`,
    stateSnapshot: { selectedActivities: [] },
    variables: { totalActivities: sorted.length, status: 'Sorted by Finish Time' },
    complexity: { time: 'O(N log N)', space: 'O(N)', explanation: 'Sorting by finish time allows greedy activity selection.' },
    highlights: { codeLine: 2 },
  })

  let lastFinish = -1
  sorted.forEach((act, idx) => {
    const isOptimal = act.start >= lastFinish
    if (isOptimal) {
      selected.push(act)
      lastFinish = act.finish
    }

    steps.push({
      stepIndex: idx + 1,
      description: isOptimal
        ? `Greedy Choice Accepted: Activity "${act.name}" [${act.start}..${act.finish}] starts after finish time. Maximizes available room for future activities.`
        : `Greedy Choice Rejected: Activity "${act.name}" [${act.start}..${act.finish}] conflicts with selected finish time ${lastFinish}.`,
      stateSnapshot: { selectedActivities: [...selected], currentActivity: act },
      variables: { activityName: act.name, start: act.start, finish: act.finish, accepted: isOptimal },
      complexity: { time: 'O(N log N)', space: 'O(N)', explanation: 'Local optimal choice ensures global maximum non-overlapping activities.' },
      highlights: { activeIndices: [idx], codeLine: isOptimal ? 7 : 6 },
    })
  })

  return steps
}

export function generateFractionalKnapsackSteps(items: { name: string; weight: number; value: number }[] = [
  { name: 'Gold', weight: 10, value: 60 },
  { name: 'Silver', weight: 20, value: 100 },
  { name: 'Bronze', weight: 30, value: 120 },
], capacity: number = 50): GreedyStep[] {
  const formatted: KnapsackItem[] = items.map((it, idx) => ({
    id: `item-${idx}`,
    name: it.name,
    weight: it.weight,
    value: it.value,
    ratio: it.value / it.weight,
  })).sort((a, b) => b.ratio - a.ratio)

  const steps: GreedyStep[] = []
  const selected: KnapsackItem[] = []
  let remainingCap = capacity
  let totalVal = 0

  steps.push({
    stepIndex: 0,
    description: `Greedy Choice Rule: Sorting items by maximum value-to-weight ratio (v/w).`,
    stateSnapshot: { selectedItems: [] },
    variables: { capacity, totalItems: formatted.length },
    complexity: { time: 'O(N log N)', space: 'O(N)', explanation: 'Greedy choice picks items with highest value density first.' },
    highlights: { codeLine: 2 },
  })

  formatted.forEach((item, idx) => {
    if (remainingCap <= 0) return

    const takeWeight = Math.min(item.weight, remainingCap)
    const takenValue = takeWeight * item.ratio
    remainingCap -= takeWeight
    totalVal += takenValue
    selected.push({ ...item, weight: takeWeight, value: takenValue })

    steps.push({
      stepIndex: idx + 1,
      description: `Greedy Choice: Taking ${takeWeight}/${item.weight} kg of "${item.name}" (ratio ${item.ratio.toFixed(1)} $/kg). Total Value: $${totalVal.toFixed(1)}, Remaining Cap: ${remainingCap} kg.`,
      stateSnapshot: { selectedItems: [...selected], currentItem: item },
      variables: { item: item.name, takenWeight: takeWeight, totalValue: totalVal, remainingCapacity: remainingCap },
      complexity: { time: 'O(N log N)', space: 'O(N)', explanation: 'Highest value density item yields optimal total value.' },
      highlights: { activeIndices: [idx], codeLine: 6 },
    })
  })

  return steps
}
