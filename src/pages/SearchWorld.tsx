import { useState, useMemo } from 'react'
import DSAWorkspace from '../components/dsa/DSAWorkspace'
import { InputPanel } from '../components/dsa/InputPanel'
import { OperationPanel, type OperationItem } from '../components/dsa/OperationPanel'
import { SortSearchVisualizer } from '../components/dsa/visualizers/SortSearchVisualizer'
import { generateLinearSearchSteps, generateBinarySearchSteps } from '../engines/sortSearchEngine'

interface SearchWorldProps {
  onNavigate: (view: string) => void
  isDark?: boolean
  onToggleDark?: () => void
}

type SearchMode = 'linear' | 'binary'

export default function SearchWorld({ onNavigate, isDark = true, onToggleDark }: SearchWorldProps) {
  const [array, setArray] = useState<number[]>([10, 20, 30, 40, 50, 60])
  const [inputStr, setInputStr] = useState('10, 20, 30, 40, 50, 60')
  const [target, setTarget] = useState<number>(40)
  const [mode, setMode] = useState<SearchMode>('binary')
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
    return mode === 'binary'
      ? generateBinarySearchSteps(array, target)
      : generateLinearSearchSteps(array, target)
  }, [array, target, mode])

  const currentStep = steps[stepIndex] || steps[0]
  const isUnsortedAlert = currentStep?.variables?.alert === 'Unsorted Array'

  const operationsList: OperationItem[] = [
    { id: 'linear', label: `Linear Search (${target})`, icon: '🔎', color: '#6366f1' },
    { id: 'binary', label: `Binary Search (${target})`, icon: '🎯', color: '#10b981' },
  ]

  return (
    <DSAWorkspace
      onNavigate={onNavigate}
      isDark={isDark}
      onToggleDark={onToggleDark}
      topicId="searching"
      topicName="Search Algorithms"
      topicCategory="Intermediate"
      topicColor="#10b981"
      language="Python"
      stepIndex={stepIndex}
      totalSteps={steps.length}
      onStepChange={setStepIndex}
      timeComplexity={currentStep?.complexity.time || 'O(log N)'}
      spaceComplexity={currentStep?.complexity.space || 'O(1)'}
      complexityDesc={currentStep?.complexity.explanation || 'Searching finds element position in array.'}
      currentStepTitle={`Step ${stepIndex + 1}: ${currentStep?.description || ''}`}
      currentStepDesc={currentStep?.description}
      variables={currentStep?.variables}
      inputPanel={
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <InputPanel
            label="Search Array Input"
            placeholder="e.g. 10, 20, 30, 40, 50, 60"
            value={inputStr}
            onChange={handleParseInput}
            onRandomize={() => handleParseInput('12, 24, 36, 48, 60')}
            onClear={() => handleParseInput('')}
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '12.5px', color: 'var(--c-text-3)', fontWeight: '600' }}>Search Target:</span>
            <input
              type="number"
              value={target}
              onChange={(e) => setTarget(parseInt(e.target.value, 10) || 0)}
              style={{
                width: '100px', padding: '6px 12px', borderRadius: '8px',
                background: 'var(--c-card-2)', border: '1px solid var(--c-border-med)',
                color: 'var(--c-text-1)', fontSize: '13px', outline: 'none',
              }}
            />
            <button
              onClick={() => handleParseInput([...array].sort((a, b) => a - b).join(', '))}
              style={{
                padding: '6px 12px', borderRadius: '6px', background: 'var(--c-card)',
                border: '1px solid var(--c-border)', color: '#6366f1', fontSize: '11.5px',
                fontWeight: '600', cursor: 'pointer',
              }}
            >
              Sort Array First
            </button>
          </div>
        </div>
      }
      operationToolbar={
        <OperationPanel
          operations={operationsList}
          activeId={mode}
          onSelect={(id) => {
            setMode(id as SearchMode)
            setStepIndex(0)
          }}
          accentColor="#10b981"
        />
      }
      visualization={
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: '24px' }}>
          {isUnsortedAlert && (
            <div style={{ padding: '14px 20px', borderRadius: '12px', background: 'rgba(244,63,94,0.15)', border: '1px solid #f43f5e', color: '#f43f5e', fontSize: '14px', fontWeight: '700', marginBottom: '20px' }}>
              {currentStep.description}
            </div>
          )}
          <SortSearchVisualizer
            values={currentStep?.stateSnapshot || array}
            compareIndices={currentStep?.highlights.compareIndices || []}
            foundIndex={currentStep?.highlights.foundIndex}
            accentColor="#10b981"
          />
        </div>
      }
      codeContent={`def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1`}
    />
  )
}
