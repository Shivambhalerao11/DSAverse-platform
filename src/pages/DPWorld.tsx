import { useState, useMemo } from 'react'
import DSAWorkspace from '../components/dsa/DSAWorkspace'
import { OperationPanel, type OperationItem } from '../components/dsa/OperationPanel'
import {
  generateFibonacciDPSteps,
  generateKnapsackDPSteps,
  generateLCSDPSteps,
  generateCoinChangeDPSteps,
  DP_CANONICAL_CODE,
} from '../engines/dpEngine'

interface DPWorldProps {
  onNavigate: (view: string) => void
  isDark?: boolean
  onToggleDark?: () => void
}

type DPProblem = 'fibonacci' | 'knapsack' | 'lcs' | 'coin'

const DP_CODE: Record<DPProblem, string> = {
  fibonacci: DP_CANONICAL_CODE.fibonacci,
  knapsack: DP_CANONICAL_CODE.knapsack,
  lcs: DP_CANONICAL_CODE.lcs,
  coin: DP_CANONICAL_CODE.coinChange,
}

export default function DPWorld({ onNavigate, isDark = true, onToggleDark }: DPWorldProps) {
  const [problem, setProblem] = useState<DPProblem>('fibonacci')
  const [nVal, setNVal] = useState<number>(6)
  const [stepIndex, setStepIndex] = useState(0)

  const steps = useMemo(() => {
    switch (problem) {
      case 'knapsack': return generateKnapsackDPSteps([2, 3, 4], [3, 4, 5], 5)
      case 'lcs':      return generateLCSDPSteps('ABC', 'AC')
      case 'coin':     return generateCoinChangeDPSteps([1, 2, 5], 6)
      default:         return generateFibonacciDPSteps(nVal)
    }
  }, [problem, nVal])

  const currentStep = steps[stepIndex] || steps[0]
  const grid = currentStep?.stateSnapshot.grid || [[]]

  const operationsList: OperationItem[] = [
    { id: 'fibonacci', label: `Fibonacci (N=${nVal})`, icon: '🔢', color: '#06b6d4' },
    { id: 'knapsack', label: '0/1 Knapsack', icon: '🎒', color: '#6366f1' },
    { id: 'lcs', label: 'LCS (Subsequence)', icon: '🔤', color: '#10b981' },
    { id: 'coin', label: 'Coin Change', icon: '🪙', color: '#f59e0b' },
  ]

  return (
    <DSAWorkspace
      onNavigate={onNavigate}
      isDark={isDark}
      onToggleDark={onToggleDark}
      topicId="dp"
      topicName="Dynamic Programming"
      topicCategory="Advanced"
      topicColor="#06b6d4"
      language="Python"
      stepIndex={stepIndex}
      totalSteps={steps.length}
      onStepChange={setStepIndex}
      timeComplexity={currentStep?.complexity.time || 'O(N)'}
      spaceComplexity={currentStep?.complexity.space || 'O(N)'}
      complexityDesc={currentStep?.complexity.explanation || 'DP tabulation fills memory table cell by cell.'}
      currentStepTitle={`Step ${stepIndex + 1}: ${currentStep?.description || ''}`}
      currentStepDesc={currentStep?.description}
      variables={currentStep?.variables}
      activeLine={currentStep?.highlights.codeLine}
      inputPanel={
        problem === 'fibonacci' ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--c-text-3)' }}>Input N:</span>
            <input
              type="number"
              min={2}
              max={15}
              value={nVal}
              onChange={(e) => {
                setNVal(Math.max(2, Math.min(15, parseInt(e.target.value, 10) || 6)))
                setStepIndex(0)
              }}
              style={{
                width: '80px', padding: '6px 12px', borderRadius: '8px',
                background: 'var(--c-card-2)', border: '1px solid var(--c-border-med)',
                color: 'var(--c-text-1)', fontSize: '13px', outline: 'none',
              }}
            />
          </div>
        ) : undefined
      }
      operationToolbar={
        <OperationPanel
          operations={operationsList}
          activeId={problem}
          onSelect={(id) => {
            setProblem(id as DPProblem)
            setStepIndex(0)
          }}
          accentColor="#06b6d4"
        />
      }
      visualization={
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
          <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--c-text-1)' }}>
            TABULATION GRID CELL-BY-CELL PLAYBACK ({currentStep?.stateSnapshot.problemName})
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {grid.map((row, rIdx) => (
              <div key={rIdx} style={{ display: 'flex', gap: '6px' }}>
                {row.map((cellVal, cIdx) => {
                  const [activeR, activeC] = currentStep?.stateSnapshot.currentCell || [-1, -1]
                  const isCurrentCell = activeR === rIdx && activeC === cIdx
                  return (
                    <div
                      key={cIdx}
                      style={{
                        width: '54px', height: '54px', borderRadius: '10px',
                        background: isCurrentCell ? 'rgba(6,182,212,0.35)' : 'var(--c-card-2)',
                        border: isCurrentCell ? '2px solid #06b6d4' : '1px solid var(--c-border-med)',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                        fontFamily: 'JetBrains Mono, monospace', fontWeight: '700', color: 'var(--c-text-1)',
                      }}
                    >
                      <span style={{ fontSize: '15px' }}>{cellVal}</span>
                      <span style={{ fontSize: '9px', color: 'var(--c-text-4)' }}>[{rIdx},{cIdx}]</span>
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      }
      codeContent={DP_CODE[problem]}
    />
  )
}
