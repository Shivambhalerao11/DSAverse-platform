import { useState, useMemo } from 'react'
import DSAWorkspace from '../components/dsa/DSAWorkspace'
import { OperationPanel, type OperationItem } from '../components/dsa/OperationPanel'
import {
  generateActivitySelectionSteps,
  generateFractionalKnapsackSteps,
  type Activity,
} from '../engines/greedyEngine'

interface GreedyWorldProps {
  onNavigate: (view: string) => void
  isDark?: boolean
  onToggleDark?: () => void
}

type GreedyProblem = 'activity' | 'knapsack'

const DEFAULT_ACTIVITIES: Activity[] = [
  { id: '1', name: 'Task A', start: 1, finish: 4 },
  { id: '2', name: 'Task B', start: 3, finish: 5 },
  { id: '3', name: 'Task C', start: 0, finish: 6 },
  { id: '4', name: 'Task D', start: 5, finish: 7 },
  { id: '5', name: 'Task E', start: 8, finish: 9 },
]

export default function GreedyWorld({ onNavigate, isDark = true, onToggleDark }: GreedyWorldProps) {
  const [problem, setProblem] = useState<GreedyProblem>('activity')
  const [stepIndex, setStepIndex] = useState(0)

  const steps = useMemo(() => {
    return problem === 'knapsack'
      ? generateFractionalKnapsackSteps()
      : generateActivitySelectionSteps(DEFAULT_ACTIVITIES)
  }, [problem])

  const currentStep = steps[stepIndex] || steps[0]

  const operationsList: OperationItem[] = [
    { id: 'activity', label: 'Activity Selection (Greedy)', icon: '💰', color: '#f59e0b' },
    { id: 'knapsack', label: 'Fractional Knapsack (Greedy)', icon: '🎒', color: '#6366f1' },
  ]

  return (
    <DSAWorkspace
      onNavigate={onNavigate}
      isDark={isDark}
      onToggleDark={onToggleDark}
      topicId="greedy"
      topicName="Greedy Algorithms"
      topicCategory="Advanced"
      topicColor="#f59e0b"
      language="Python"
      stepIndex={stepIndex}
      totalSteps={steps.length}
      onStepChange={setStepIndex}
      timeComplexity={currentStep?.complexity.time || 'O(N log N)'}
      spaceComplexity={currentStep?.complexity.space || 'O(N)'}
      complexityDesc={currentStep?.complexity.explanation || 'Greedy choice selects local optimum at each step.'}
      currentStepTitle={`Step ${stepIndex + 1}: ${currentStep?.description || ''}`}
      currentStepDesc={currentStep?.description}
      variables={currentStep?.variables}
      operationToolbar={
        <OperationPanel
          operations={operationsList}
          activeId={problem}
          onSelect={(id) => {
            setProblem(id as GreedyProblem)
            setStepIndex(0)
          }}
          accentColor="#f59e0b"
        />
      }
      visualization={
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
          <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--c-text-1)' }}>
            GREEDY CHOICE EXPLANATION PLAYBACK:
          </div>
          <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(245,158,11,0.15)', border: '1px solid #f59e0b', color: 'var(--c-text-1)', fontSize: '13.5px', fontWeight: '600', maxWidth: '600px', textAlign: 'center' }}>
            {currentStep?.description}
          </div>
        </div>
      }
      codeContent={`def activity_selection(activities):
    activities.sort(key=lambda x: x['finish'])
    selected = [activities[0]]
    last_finish = activities[0]['finish']
    for act in activities[1:]:
        if act['start'] >= last_finish:
            selected.append(act)
            last_finish = act['finish']
    return selected`}
    />
  )
}
