import { useState, useMemo } from 'react'
import DSAWorkspace from '../components/dsa/DSAWorkspace'
import { OperationPanel, type OperationItem } from '../components/dsa/OperationPanel'
import { generateNQueensSteps, BACKTRACK_CANONICAL_CODE } from '../engines/backtrackEngine'

interface BacktrackWorldProps {
  onNavigate: (view: string) => void
  isDark?: boolean
  onToggleDark?: () => void
}

export default function BacktrackWorld({ onNavigate, isDark = true, onToggleDark }: BacktrackWorldProps) {
  const [boardSize] = useState<number>(4)
  const [stepIndex, setStepIndex] = useState(0)

  const steps = useMemo(() => {
    return generateNQueensSteps(boardSize)
  }, [boardSize])

  const currentStep = steps[stepIndex] || steps[0]
  const board = currentStep?.stateSnapshot.board || []

  const operationsList: OperationItem[] = [
    { id: 'nqueens', label: 'N-Queens (4x4)', icon: '👑', color: '#a855f7' },
  ]

  return (
    <DSAWorkspace
      onNavigate={onNavigate}
      isDark={isDark}
      onToggleDark={onToggleDark}
      topicId="backtrack"
      topicName="Backtracking"
      topicCategory="Advanced"
      topicColor="#a855f7"
      language="Python"
      stepIndex={stepIndex}
      totalSteps={steps.length}
      onStepChange={setStepIndex}
      timeComplexity={currentStep?.complexity.time || 'O(N!)'}
      spaceComplexity={currentStep?.complexity.space || 'O(N)'}
      complexityDesc={currentStep?.complexity.explanation || 'Backtracking explores decisions and undoes invalid paths.'}
      currentStepTitle={`Step ${stepIndex + 1}: ${currentStep?.description || ''}`}
      currentStepDesc={currentStep?.description}
      variables={currentStep?.variables}
      activeLine={currentStep?.highlights.codeLine}
      inputPanel={
        <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--c-text-2)' }}>
          Problem: N-Queens Chessboard Placement ({boardSize}x{boardSize})
        </div>
      }
      operationToolbar={
        <OperationPanel
          operations={operationsList}
          activeId="nqueens"
          onSelect={() => setStepIndex(0)}
          accentColor="#a855f7"
        />
      }
      visualization={
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
          <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--c-text-1)' }}>
            N-QUEENS CHESSBOARD STATE ({boardSize}x{boardSize})
          </div>
          <div
            style={{
              display: 'grid', gridTemplateColumns: `repeat(${boardSize}, 60px)`,
              gap: '4px', background: 'var(--c-card-2)', padding: '8px', borderRadius: '12px',
              border: '2px solid #a855f7',
            }}
          >
            {board.map((row, rIdx) =>
              row.map((cellVal, cIdx) => {
                const isDarkSquare = (rIdx + cIdx) % 2 === 1
                const hasQueen = cellVal === 1
                return (
                  <div
                    key={`${rIdx}-${cIdx}`}
                    style={{
                      width: '60px', height: '60px', borderRadius: '6px',
                      background: hasQueen
                        ? 'rgba(168,85,247,0.35)'
                        : isDarkSquare
                        ? 'var(--c-surface-2)'
                        : 'var(--c-surface)',
                      border: hasQueen ? '2px solid #a855f7' : '1px solid var(--c-border-med)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '28px',
                    }}
                  >
                    {hasQueen ? '👑' : ''}
                  </div>
                )
              })
            )}
          </div>
        </div>
      }
      codeContent={BACKTRACK_CANONICAL_CODE.nQueens}
    />
  )
}
