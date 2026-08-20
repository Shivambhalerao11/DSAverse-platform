// Pure Array Algorithm Engine — Conforming to Shared AlgorithmStep Contract
import { type AlgorithmStep } from '../types/algorithmStep'

export type ArrayStep = AlgorithmStep<number[]>

export function generateTraverseSteps(arr: number[]): ArrayStep[] {
  if (arr.length === 0) {
    return [
      {
        stepIndex: 0,
        description: 'Array is empty (0 elements). Insert elements to begin visualization.',
        stateSnapshot: [],
        variables: { arrayLength: 0 },
        complexity: {
          time: 'O(1)',
          space: 'O(1)',
          explanation: 'Empty array requires 0 traversal operations.',
        },
        highlights: {},
      },
    ]
  }

  return arr.map((val, idx) => ({
    stepIndex: idx,
    description: `Inspecting element at index ${idx}: value ${val}`,
    stateSnapshot: [...arr],
    variables: { index: idx, value: val, arrayLength: arr.length },
    complexity: {
      time: 'O(N)',
      space: 'O(1)',
      explanation: `Linear traversal visits N = ${arr.length} elements sequentially.`,
    },
    highlights: {
      activeIndices: [idx],
      codeLine: 3,
    },
  }))
}

export function generateSearchSteps(arr: number[], target: number): ArrayStep[] {
  if (arr.length === 0) {
    return [
      {
        stepIndex: 0,
        description: `Cannot search target ${target} in an empty array.`,
        stateSnapshot: [],
        variables: { target, arrayLength: 0, status: 'Empty' },
        complexity: {
          time: 'O(1)',
          space: 'O(1)',
          explanation: 'Search terminates immediately on empty input.',
        },
        highlights: {},
      },
    ]
  }

  const steps: ArrayStep[] = []
  let found = false

  for (let i = 0; i < arr.length; i++) {
    const matched = arr[i] === target
    if (matched) found = true

    steps.push({
      stepIndex: i,
      description: matched
        ? `Target ${target} found at index ${i}! Best/Average case match.`
        : `Comparing arr[${i}] = ${arr[i]} with target ${target}... (No match)`,
      stateSnapshot: [...arr],
      variables: { index: i, currentValue: arr[i], target },
      complexity: {
        time: matched ? `O(${i + 1}) Best/Avg` : 'O(N) Worst Case',
        space: 'O(1)',
        explanation: matched
          ? `Target found early at position ${i + 1} of ${arr.length}.`
          : `Examining position ${i + 1} of ${arr.length}.`,
      },
      highlights: {
        activeIndices: matched ? [] : [i],
        compareIndices: [i],
        foundIndex: matched ? i : undefined,
        codeLine: matched ? 6 : 4,
      },
    })
    if (matched) break
  }

  if (!found) {
    steps.push({
      stepIndex: steps.length,
      description: `Target ${target} not found in array. Search completed (Worst Case O(N)).`,
      stateSnapshot: [...arr],
      variables: { target, status: 'Not Found' },
      complexity: {
        time: 'O(N) Worst Case',
        space: 'O(1)',
        explanation: `Searched all N = ${arr.length} elements without finding target.`,
      },
      highlights: { codeLine: 8 },
    })
  }

  return steps
}

export function generateReverseSteps(arr: number[]): ArrayStep[] {
  if (arr.length <= 1) {
    return [
      {
        stepIndex: 0,
        description: arr.length === 0 ? 'Array is empty.' : `Array with 1 element [${arr[0]}] is already reversed.`,
        stateSnapshot: [...arr],
        variables: { arrayLength: arr.length },
        complexity: {
          time: 'O(1)',
          space: 'O(1)',
          explanation: 'No swaps needed for single/empty element array.',
        },
        highlights: {},
      },
    ]
  }

  const steps: ArrayStep[] = []
  const currentArr = [...arr]
  let l = 0
  let r = currentArr.length - 1
  let step = 0

  while (l < r) {
    steps.push({
      stepIndex: step++,
      description: `Swapping arr[${l}] (${currentArr[l]}) with arr[${r}] (${currentArr[r]})`,
      stateSnapshot: [...currentArr],
      variables: { left: l, right: r, valLeft: currentArr[l], valRight: currentArr[r] },
      complexity: {
        time: 'O(N)',
        space: 'O(1)',
        explanation: `In-place reversal performs N/2 = ${Math.floor(arr.length / 2)} swaps.`,
      },
      highlights: {
        swapIndices: [l, r],
        codeLine: 5,
      },
    })

    const tmp = currentArr[l]
    currentArr[l] = currentArr[r]
    currentArr[r] = tmp

    l++
    r--
  }

  steps.push({
    stepIndex: step,
    description: `Array reversal complete: [${currentArr.join(', ')}]`,
    stateSnapshot: [...currentArr],
    variables: { status: 'Reversed' },
    complexity: {
      time: 'O(N)',
      space: 'O(1)',
      explanation: 'All elements reversed in-place.',
    },
    highlights: { codeLine: 8 },
  })

  return steps
}
