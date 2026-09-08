import { useState, useMemo } from 'react'
import DSAWorkspace from '../components/dsa/DSAWorkspace'
import { InputPanel } from '../components/dsa/InputPanel'
import { OperationPanel, type OperationItem } from '../components/dsa/OperationPanel'
import { StringVisualizer } from '../components/dsa/visualizers/StringVisualizer'
import { generateReverseStringSteps, generatePalindromeCheckSteps, generateCaseSteps, STRING_CANONICAL_CODE } from '../engines/stringEngine'

interface StringWorldProps {
  onNavigate: (view: string) => void
  isDark?: boolean
  onToggleDark?: () => void
}

type StringOp = 'reverse' | 'palindrome' | 'uppercase' | 'lowercase'

export default function StringWorld({ onNavigate, isDark = true, onToggleDark }: StringWorldProps) {
  const [text, setText] = useState('hello world')
  const [op, setOp] = useState<StringOp>('reverse')
  const [stepIndex, setStepIndex] = useState(0)

  const handleTextChange = (val: string) => {
    setText(val)
    setStepIndex(0)
  }

  const steps = useMemo(() => {
    switch (op) {
      case 'palindrome':
        return generatePalindromeCheckSteps(text)
      case 'uppercase':
        return generateCaseSteps(text, 'upper')
      case 'lowercase':
        return generateCaseSteps(text, 'lower')
      default:
        return generateReverseStringSteps(text)
    }
  }, [text, op])

  const currentStep = steps[stepIndex] || steps[0]
  const chars = currentStep?.stateSnapshot ?? []

  const operationsList: OperationItem[] = [
    { id: 'reverse', label: 'Reverse String', icon: '🔄', color: '#22d3ee' },
    { id: 'palindrome', label: 'Check Palindrome', icon: '🔍', color: '#10b981' },
    { id: 'uppercase', label: 'UPPERCASE', icon: '🔠', color: '#f59e0b' },
    { id: 'lowercase', label: 'lowercase', icon: '🔡', color: '#6366f1' },
  ]

  const codeContent =
    op === 'palindrome'
      ? STRING_CANONICAL_CODE.palindrome
      : op === 'uppercase'
      ? STRING_CANONICAL_CODE.uppercase
      : op === 'lowercase'
      ? STRING_CANONICAL_CODE.lowercase
      : STRING_CANONICAL_CODE.reverse

  return (
    <DSAWorkspace
      onNavigate={onNavigate}
      isDark={isDark}
      onToggleDark={onToggleDark}
      topicId="strings"
      topicName="String Processing"
      topicCategory="Foundations"
      topicColor="#22d3ee"
      language="Python"
      stepIndex={stepIndex}
      totalSteps={steps.length}
      onStepChange={setStepIndex}
      timeComplexity={currentStep?.complexity.time || 'O(N)'}
      spaceComplexity={currentStep?.complexity.space || 'O(N)'}
      complexityDesc={currentStep?.complexity.explanation || 'String operations process characters of length N.'}
      currentStepTitle={`Step ${stepIndex + 1}: ${currentStep?.description || ''}`}
      currentStepDesc={currentStep?.description}
      variables={currentStep?.variables}
      activeLine={currentStep?.highlights.codeLine}
      inputPanel={
        <InputPanel
          label="String Input"
          placeholder="e.g. hello world"
          value={text}
          onChange={handleTextChange}
          onRandomize={() => handleTextChange('racecar')}
          onClear={() => handleTextChange('')}
        />
      }
      operationToolbar={
        <OperationPanel
          operations={operationsList}
          activeId={op}
          onSelect={(id) => {
            setOp(id as StringOp)
            setStepIndex(0)
          }}
          accentColor="#22d3ee"
        />
      }
      visualization={
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: '24px', gap: '20px' }}>
          <StringVisualizer
            text={chars.map((c) => c.char).join('')}
            activeIndices={chars.reduce<number[]>((acc, c, i) => (c.state === 'active' || c.state === 'compare' ? [...acc, i] : acc), [])}
            matchIndices={chars.reduce<number[]>((acc, c, i) => (c.state === 'match' || c.state === 'done' ? [...acc, i] : acc), [])}
            accentColor="#22d3ee"
          />
        </div>
      }
      codeContent={codeContent}
    />
  )
}
