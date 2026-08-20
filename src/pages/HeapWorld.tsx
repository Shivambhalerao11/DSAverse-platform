import { useState, useMemo } from 'react'
import DSAWorkspace from '../components/dsa/DSAWorkspace'
import { InputPanel } from '../components/dsa/InputPanel'
import { OperationPanel, type OperationItem } from '../components/dsa/OperationPanel'
import { generateHeapInsertSteps, generateHeapExtractSteps } from '../engines/heapEngine'

interface HeapWorldProps {
  onNavigate: (view: string) => void
  isDark?: boolean
  onToggleDark?: () => void
}

type HeapOp = 'insert' | 'extract'

export default function HeapWorld({ onNavigate, isDark = true, onToggleDark }: HeapWorldProps) {
  const [heap, setHeap] = useState<number[]>([10, 20, 15, 30, 40, 50])
  const [inputStr, setInputStr] = useState('10, 20, 15, 30, 40, 50')
  const [op, setOp] = useState<HeapOp>('insert')
  const [heapType, setHeapType] = useState<'min' | 'max'>('min')
  const [stepIndex, setStepIndex] = useState(0)

  const handleParseInput = (raw: string) => {
    setInputStr(raw)
    const parsed = raw.split(/[\s,]+/).map((n) => parseInt(n.trim(), 10)).filter((n) => !isNaN(n))
    if (parsed.length > 0) {
      setHeap(parsed)
      setStepIndex(0)
    }
  }

  const steps = useMemo(() => {
    return op === 'extract'
      ? generateHeapExtractSteps(heap, heapType)
      : generateHeapInsertSteps(heap, 5, heapType)
  }, [heap, op, heapType])

  const currentStep = steps[stepIndex] || steps[0]

  const operationsList: OperationItem[] = [
    { id: 'insert', label: 'Insert (5)', icon: '➕', color: '#6366f1' },
    { id: 'extract', label: `Extract ${heapType === 'min' ? 'Min' : 'Max'} Root`, icon: '➖', color: '#f43f5e' },
  ]

  return (
    <DSAWorkspace
      onNavigate={onNavigate}
      isDark={isDark}
      onToggleDark={onToggleDark}
      topicId="heap"
      topicName="Heap"
      topicCategory="Intermediate"
      topicColor="#f43f5e"
      language="Python"
      stepIndex={stepIndex}
      totalSteps={steps.length}
      onStepChange={setStepIndex}
      timeComplexity={currentStep?.complexity.time || 'O(log N)'}
      spaceComplexity={currentStep?.complexity.space || 'O(1)'}
      complexityDesc={currentStep?.complexity.explanation || 'Heap maintains root property in O(log N) time.'}
      currentStepTitle={`Step ${stepIndex + 1}: ${currentStep?.description || ''}`}
      currentStepDesc={currentStep?.description}
      variables={currentStep?.variables}
      inputPanel={
        <InputPanel
          label="Heap Array Input"
          placeholder="e.g. 10, 20, 15, 30, 40, 50"
          value={inputStr}
          onChange={handleParseInput}
          onRandomize={() => handleParseInput('5, 15, 10, 25, 40')}
          onClear={() => handleParseInput('')}
        />
      }
      operationToolbar={
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setHeapType('min')}
              style={{
                padding: '6px 12px', borderRadius: '6px',
                background: heapType === 'min' ? '#6366f1' : 'var(--c-card)',
                color: '#fff', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: '600',
              }}
            >
              Min-Heap (Root = Minimum)
            </button>
            <button
              onClick={() => setHeapType('max')}
              style={{
                padding: '6px 12px', borderRadius: '6px',
                background: heapType === 'max' ? '#f43f5e' : 'var(--c-card)',
                color: '#fff', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: '600',
              }}
            >
              Max-Heap (Root = Maximum)
            </button>
          </div>
          <OperationPanel
            operations={operationsList}
            activeId={op}
            onSelect={(id) => {
              setOp(id as HeapOp)
              setStepIndex(0)
            }}
            accentColor="#f43f5e"
          />
        </div>
      }
      visualization={
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
          <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--c-text-1)' }}>
            {heapType.toUpperCase()}-HEAP ROOT = <span style={{ color: '#10b981', fontSize: '18px' }}>{currentStep?.stateSnapshot[0] ?? 'Empty'}</span>
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
            {(currentStep?.stateSnapshot || []).map((val, idx) => {
              const isRoot = idx === 0
              const isSwapping = currentStep?.highlights.swapIndices?.includes(idx)
              return (
                <div
                  key={idx}
                  style={{
                    width: '54px', height: '54px', borderRadius: '12px',
                    background: isRoot ? 'rgba(16,185,129,0.2)' : isSwapping ? 'rgba(244,63,94,0.25)' : 'var(--c-card-2)',
                    border: isRoot ? '2px solid #10b981' : isSwapping ? '2px solid #f43f5e' : '1px solid var(--c-border-med)',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'JetBrains Mono, monospace', fontWeight: '700', color: 'var(--c-text-1)',
                  }}
                >
                  <span style={{ fontSize: '15px' }}>{val}</span>
                  <span style={{ fontSize: '10px', color: 'var(--c-text-4)' }}>[{idx}]</span>
                </div>
              )
            })}
          </div>
        </div>
      }
      codeContent={`# Python Min/Max Heap Implementation
import heapq

heap = [10, 20, 15, 30, 40, 50]
heapq.heapify(heap)

# Insert element
heapq.heappush(heap, 5)

# Extract root element
root = heapq.heappop(heap)`}
    />
  )
}
