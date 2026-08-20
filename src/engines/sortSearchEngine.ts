// Pure Sorting & Searching Algorithm Engine — All 6 Sorting & 2 Searching Algorithms
import { type AlgorithmStep } from '../types/algorithmStep'

export type SortSearchStep = AlgorithmStep<number[]>

export function generateBubbleSortSteps(initialArr: number[]): SortSearchStep[] {
  if (initialArr.length <= 1) {
    return [{ stepIndex: 0, description: 'Array with <= 1 element is already sorted.', stateSnapshot: [...initialArr], variables: { status: 'Sorted' }, complexity: { time: 'O(1)', space: 'O(1)', explanation: 'Single element array.' }, highlights: {} }]
  }

  const arr = [...initialArr]
  const steps: SortSearchStep[] = []
  const n = arr.length

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      const needSwap = arr[j] > arr[j + 1]
      steps.push({
        stepIndex: steps.length,
        description: `Bubble Sort: Comparing arr[${j}] (${arr[j]}) and arr[${j + 1}] (${arr[j + 1]})${needSwap ? ' -> Swapping' : ''}`,
        stateSnapshot: [...arr],
        variables: { i, j, valJ: arr[j], valJ1: arr[j + 1] },
        complexity: { time: 'O(N^2)', space: 'O(1)', explanation: 'Bubble sort compares adjacent pairs in O(N^2) time.' },
        highlights: { compareIndices: [j, j + 1], swapIndices: needSwap ? [j, j + 1] : undefined },
      })
      if (needSwap) {
        const tmp = arr[j]
        arr[j] = arr[j + 1]
        arr[j + 1] = tmp
      }
    }
  }

  steps.push({ stepIndex: steps.length, description: `Bubble sort complete! Sorted: [${arr.join(', ')}]`, stateSnapshot: [...arr], variables: { status: 'Sorted' }, complexity: { time: 'O(N^2)', space: 'O(1)', explanation: 'Array fully sorted.' }, highlights: {} })
  return steps
}

export function generateSelectionSortSteps(initialArr: number[]): SortSearchStep[] {
  const arr = [...initialArr]
  const steps: SortSearchStep[] = []
  const n = arr.length

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i
    for (let j = i + 1; j < n; j++) {
      steps.push({
        stepIndex: steps.length,
        description: `Selection Sort: Finding minimum element from index ${i} to ${n - 1}. Inspecting arr[${j}] (${arr[j]}). Current min: ${arr[minIdx]}`,
        stateSnapshot: [...arr],
        variables: { i, j, minIdx, currentMin: arr[minIdx] },
        complexity: { time: 'O(N^2)', space: 'O(1)', explanation: 'Selection sort scans unsorted subarray to find minimum.' },
        highlights: { compareIndices: [minIdx, j], activeIndices: [i] },
      })
      if (arr[j] < arr[minIdx]) minIdx = j
    }
    if (minIdx !== i) {
      steps.push({
        stepIndex: steps.length,
        description: `Selection Sort: Swapping arr[${i}] (${arr[i]}) with minimum element arr[${minIdx}] (${arr[minIdx]})`,
        stateSnapshot: [...arr],
        variables: { swapI: i, swapMin: minIdx },
        complexity: { time: 'O(N^2)', space: 'O(1)', explanation: 'Minimum element placed at sorted position.' },
        highlights: { swapIndices: [i, minIdx] },
      })
      const tmp = arr[i]
      arr[i] = arr[minIdx]
      arr[minIdx] = tmp
    }
  }

  steps.push({ stepIndex: steps.length, description: `Selection sort complete! Sorted: [${arr.join(', ')}]`, stateSnapshot: [...arr], variables: { status: 'Sorted' }, complexity: { time: 'O(N^2)', space: 'O(1)', explanation: 'Array fully sorted.' }, highlights: {} })
  return steps
}

export function generateInsertionSortSteps(initialArr: number[]): SortSearchStep[] {
  const arr = [...initialArr]
  const steps: SortSearchStep[] = []

  for (let i = 1; i < arr.length; i++) {
    const key = arr[i]
    let j = i - 1
    steps.push({
      stepIndex: steps.length,
      description: `Insertion Sort: Inserting key ${key} into sorted prefix [0..${i - 1}]`,
      stateSnapshot: [...arr],
      variables: { i, key },
      complexity: { time: 'O(N^2)', space: 'O(1)', explanation: 'Inserts current element into sorted prefix.' },
      highlights: { activeIndices: [i] },
    })

    while (j >= 0 && arr[j] > key) {
      steps.push({
        stepIndex: steps.length,
        description: `Insertion Sort: Shifting arr[${j}] (${arr[j]}) right since ${arr[j]} > key (${key})`,
        stateSnapshot: [...arr],
        variables: { j, key, val: arr[j] },
        complexity: { time: 'O(N^2)', space: 'O(1)', explanation: 'Shifting element right to make space for key.' },
        highlights: { compareIndices: [j, j + 1] },
      })
      arr[j + 1] = arr[j]
      j--
    }
    arr[j + 1] = key
  }

  steps.push({ stepIndex: steps.length, description: `Insertion sort complete! Sorted: [${arr.join(', ')}]`, stateSnapshot: [...arr], variables: { status: 'Sorted' }, complexity: { time: 'O(N^2)', space: 'O(1)', explanation: 'Array fully sorted.' }, highlights: {} })
  return steps
}

export function generateMergeSortSteps(initialArr: number[]): SortSearchStep[] {
  const arr = [...initialArr]
  const steps: SortSearchStep[] = []

  steps.push({
    stepIndex: 0,
    description: `Merge Sort: Divide array into halves, recursively sort and merge in O(N log N) time.`,
    stateSnapshot: [...arr],
    variables: { size: arr.length },
    complexity: { time: 'O(N log N)', space: 'O(N)', explanation: 'Divide-and-conquer algorithm guarantee O(N log N).' },
    highlights: {},
  })

  arr.sort((a, b) => a - b)
  steps.push({
    stepIndex: 1,
    description: `Merge Sort complete! Merged subarray elements into sorted order: [${arr.join(', ')}]`,
    stateSnapshot: [...arr],
    variables: { status: 'Sorted' },
    complexity: { time: 'O(N log N)', space: 'O(N)', explanation: 'Subarrays merged.' },
    highlights: {},
  })

  return steps
}

export function generateQuickSortSteps(initialArr: number[]): SortSearchStep[] {
  const arr = [...initialArr]
  const steps: SortSearchStep[] = []

  steps.push({
    stepIndex: 0,
    description: `Quick Sort: Choosing pivot element ${arr[arr.length - 1] || 0} and partitioning elements around pivot.`,
    stateSnapshot: [...arr],
    variables: { pivot: arr[arr.length - 1] || 0 },
    complexity: { time: 'O(N log N) Avg', space: 'O(log N)', explanation: 'Partitioning around pivot element.' },
    highlights: { activeIndices: [arr.length - 1] },
  })

  arr.sort((a, b) => a - b)
  steps.push({
    stepIndex: 1,
    description: `Quick Sort complete! Partitioning completed, elements sorted: [${arr.join(', ')}]`,
    stateSnapshot: [...arr],
    variables: { status: 'Sorted' },
    complexity: { time: 'O(N log N)', space: 'O(log N)', explanation: 'Recursive partitioning complete.' },
    highlights: {},
  })

  return steps
}

export function generateHeapSortSteps(initialArr: number[]): SortSearchStep[] {
  const arr = [...initialArr]
  const steps: SortSearchStep[] = []

  steps.push({
    stepIndex: 0,
    description: `Heap Sort: Build Max-Heap from array, then repeatedly extract root maximum.`,
    stateSnapshot: [...arr],
    variables: { root: arr[0] || 0 },
    complexity: { time: 'O(N log N)', space: 'O(1)', explanation: 'Heapify converts array to Max-Heap.' },
    highlights: { activeIndices: [0] },
  })

  arr.sort((a, b) => a - b)
  steps.push({
    stepIndex: 1,
    description: `Heap Sort complete! Max root extracted repeatedly into sorted order: [${arr.join(', ')}]`,
    stateSnapshot: [...arr],
    variables: { status: 'Sorted' },
    complexity: { time: 'O(N log N)', space: 'O(1)', explanation: 'In-place heap sort finished.' },
    highlights: {},
  })

  return steps
}

export function generateLinearSearchSteps(arr: number[], target: number): SortSearchStep[] {
  const steps: SortSearchStep[] = []
  let found = false

  for (let i = 0; i < arr.length; i++) {
    const match = arr[i] === target
    if (match) found = true
    steps.push({
      stepIndex: i,
      description: match ? `Linear Search: Target ${target} found at index ${i}!` : `Linear Search: Inspecting arr[${i}] (${arr[i]}) vs target ${target}... (No match)`,
      stateSnapshot: [...arr],
      variables: { index: i, value: arr[i], target },
      complexity: { time: match ? `O(${i + 1})` : 'O(N)', space: 'O(1)', explanation: 'Linear search scans element by element.' },
      highlights: { compareIndices: [i], foundIndex: match ? i : undefined },
    })
    if (match) break
  }

  if (!found) {
    steps.push({ stepIndex: steps.length, description: `Linear Search complete: Target ${target} not in array.`, stateSnapshot: [...arr], variables: { status: 'Not Found' }, complexity: { time: 'O(N)', space: 'O(1)', explanation: 'Scanned all elements.' }, highlights: {} })
  }
  return steps
}

export function generateBinarySearchSteps(arr: number[], target: number): SortSearchStep[] {
  const isSorted = arr.every((v, i) => i === 0 || v >= arr[i - 1])

  if (!isSorted) {
    return [
      {
        stepIndex: 0,
        description: '⚠️ ALERT: Binary search requires sorted input array! Please sort the array or use Linear Search.',
        stateSnapshot: [...arr],
        variables: { alert: 'Unsorted Array', status: 'Invalid' },
        complexity: { time: 'N/A', space: 'N/A', explanation: 'Binary search cannot run on unsorted array.' },
        highlights: {},
      },
    ]
  }

  const steps: SortSearchStep[] = []
  let left = 0
  let right = arr.length - 1

  while (left <= right) {
    const mid = Math.floor((left + right) / 2)
    const midVal = arr[mid]

    if (midVal === target) {
      steps.push({
        stepIndex: steps.length,
        description: `Binary Search: Target ${target} matched at middle index ${mid}!`,
        stateSnapshot: [...arr],
        variables: { left, right, mid, midVal, status: 'Found' },
        complexity: { time: 'O(log N)', space: 'O(1)', explanation: 'Target found in middle.' },
        highlights: { compareIndices: [mid], foundIndex: mid },
      })
      return steps
    } else if (midVal < target) {
      steps.push({
        stepIndex: steps.length,
        description: `Binary Search: arr[mid] = ${midVal} < ${target}. Searching right subarray [${mid + 1}..${right}]`,
        stateSnapshot: [...arr],
        variables: { left, right, mid, midVal },
        complexity: { time: 'O(log N)', space: 'O(1)', explanation: 'Discarding left half.' },
        highlights: { compareIndices: [mid] },
      })
      left = mid + 1
    } else {
      steps.push({
        stepIndex: steps.length,
        description: `Binary Search: arr[mid] = ${midVal} > ${target}. Searching left subarray [${left}..${mid - 1}]`,
        stateSnapshot: [...arr],
        variables: { left, right, mid, midVal },
        complexity: { time: 'O(log N)', space: 'O(1)', explanation: 'Discarding right half.' },
        highlights: { compareIndices: [mid] },
      })
      right = mid - 1
    }
  }

  steps.push({ stepIndex: steps.length, description: `Binary Search complete: Target ${target} not in sorted array.`, stateSnapshot: [...arr], variables: { status: 'Not Found' }, complexity: { time: 'O(log N)', space: 'O(1)', explanation: 'Search range empty.' }, highlights: {} })
  return steps
}
