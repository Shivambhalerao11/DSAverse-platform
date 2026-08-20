import { useState, useMemo } from 'react'
import DSAWorkspace from '../components/dsa/DSAWorkspace'
import { InputPanel } from '../components/dsa/InputPanel'
import { OperationPanel, type OperationItem } from '../components/dsa/OperationPanel'
import { SortSearchVisualizer } from '../components/dsa/visualizers/SortSearchVisualizer'
import {
  generateBubbleSortSteps,
  generateSelectionSortSteps,
  generateInsertionSortSteps,
  generateMergeSortSteps,
  generateQuickSortSteps,
  generateHeapSortSteps,
} from '../engines/sortSearchEngine'

interface SortWorldProps {
  onNavigate: (view: string) => void
  isDark?: boolean
  onToggleDark?: () => void
}

type SortAlgo = 'bubble' | 'selection' | 'insertion' | 'merge' | 'quick' | 'heap'

export default function SortWorld({ onNavigate, isDark = true, onToggleDark }: SortWorldProps) {
  const [array, setArray] = useState<number[]>([8, 3, 9, 1, 6])
  const [inputStr, setInputStr] = useState('8, 3, 9, 1, 6')
  const [algo, setAlgo] = useState<SortAlgo>('bubble')
  const [stepIndex, setStepIndex] = useState(0)

  const handleParseInput = (raw: string) => {
    setInputStr(raw)
    const parsed = raw.split(/[\s,]+/).map((n) => parseInt(n.trim(), 10)).filter((n) => !isNaN(n))
    if (parsed.length > 0) {
      setArray(parsed)
      setStepIndex(0)
    }
  }

  const steps = useMemo(() => {
    switch (algo) {
      case 'selection': return generateSelectionSortSteps(array)
      case 'insertion': return generateInsertionSortSteps(array)
      case 'merge':     return generateMergeSortSteps(array)
      case 'quick':     return generateQuickSortSteps(array)
      case 'heap':      return generateHeapSortSteps(array)
      default:          return generateBubbleSortSteps(array)
    }
  }, [array, algo])

  const currentStep = steps[stepIndex] || steps[0]

  const operationsList: OperationItem[] = [
    { id: 'bubble', label: 'Bubble Sort', icon: '⚡', color: '#f59e0b' },
    { id: 'selection', label: 'Selection Sort', icon: '🎯', color: '#22d3ee' },
    { id: 'insertion', label: 'Insertion Sort', icon: '📌', color: '#10b981' },
    { id: 'merge', label: 'Merge Sort', icon: '🔀', color: '#a855f7' },
    { id: 'quick', label: 'Quick Sort', icon: '🚀', color: '#f43f5e' },
    { id: 'heap', label: 'Heap Sort', icon: '⛰', color: '#6366f1' },
  ]

  return (
    <DSAWorkspace
      onNavigate={onNavigate}
      isDark={isDark}
      onToggleDark={onToggleDark}
      topicId="sorting"
      topicName="Sorting Arena"
      topicCategory="Intermediate"
      topicColor="#f59e0b"
      language="Python"
      stepIndex={stepIndex}
      totalSteps={steps.length}
      onStepChange={setStepIndex}
      timeComplexity={currentStep?.complexity.time || 'O(N^2)'}
      spaceComplexity={currentStep?.complexity.space || 'O(1)'}
      complexityDesc={currentStep?.complexity.explanation || 'Sorting rearranges elements into ascending order.'}
      currentStepTitle={`Step ${stepIndex + 1}: ${currentStep?.description || ''}`}
      currentStepDesc={currentStep?.description}
      variables={currentStep?.variables}
      inputPanel={
        <InputPanel
          label="Sorting Array Input"
          placeholder="e.g. 8, 3, 9, 1, 6"
          value={inputStr}
          onChange={handleParseInput}
          onRandomize={() => handleParseInput('45, 12, 89, 34, 67')}
          onClear={() => handleParseInput('')}
        />
      }
      operationToolbar={
        <OperationPanel
          operations={operationsList}
          activeId={algo}
          onSelect={(id) => {
            setAlgo(id as SortAlgo)
            setStepIndex(0)
          }}
          accentColor="#f59e0b"
        />
      }
      visualization={
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: '24px' }}>
          <SortSearchVisualizer
            values={currentStep?.stateSnapshot || array}
            compareIndices={currentStep?.highlights.compareIndices || []}
            accentColor="#f59e0b"
          />
        </div>
      }
      codeContent={`def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(0, n-i-1):
            if arr[j] > arr[j+1]:
                arr[j], arr[j+1] = arr[j+1], arr[j]`}
    />
  )
}
