import { useState } from 'react'
import DSAWorkspace from '../components/dsa/DSAWorkspace'
import { InputPanel } from '../components/dsa/InputPanel'
import { OperationPanel, type OperationItem } from '../components/dsa/OperationPanel'
import { StringVisualizer } from '../components/dsa/visualizers/StringVisualizer'

interface StringWorldProps {
  onNavigate: (view: string) => void
  isDark?: boolean
  onToggleDark?: () => void
}

type StringOp = 'reverse' | 'palindrome' | 'uppercase' | 'lowercase'

export default function StringWorld({ onNavigate, isDark = true, onToggleDark }: StringWorldProps) {
  const [text, setText] = useState('hello world')
  const [op, setOp] = useState<StringOp>('reverse')

  const isPal = text.toLowerCase().replace(/[^a-z0-9]/g, '') === text.toLowerCase().replace(/[^a-z0-9]/g, '').split('').reverse().join('')

  const getTransformedText = () => {
    switch (op) {
      case 'reverse':   return text.split('').reverse().join('')
      case 'uppercase': return text.toUpperCase()
      case 'lowercase': return text.toLowerCase()
      case 'palindrome':return isPal ? `"${text}" is a valid Palindrome!` : `"${text}" is NOT a Palindrome.`
      default:          return text
    }
  }

  const operationsList: OperationItem[] = [
    { id: 'reverse', label: 'Reverse String', icon: '🔄', color: '#22d3ee' },
    { id: 'palindrome', label: 'Check Palindrome', icon: '🔍', color: '#10b981' },
    { id: 'uppercase', label: 'UPPERCASE', icon: '🔠', color: '#f59e0b' },
    { id: 'lowercase', label: 'lowercase', icon: '🔡', color: '#6366f1' },
  ]

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
      timeComplexity="O(N)"
      spaceComplexity="O(N)"
      complexityDesc="String operations process characters of length N."
      currentStepTitle={`Operation: ${op.toUpperCase()}`}
      currentStepDesc={`Transformed Output: ${getTransformedText()}`}
      variables={{ textLength: text.length, result: getTransformedText() }}
      inputPanel={
        <InputPanel
          label="String Input"
          placeholder="e.g. hello world"
          value={text}
          onChange={(val) => setText(val)}
          onRandomize={() => setText('racecar')}
          onClear={() => setText('')}
        />
      }
      operationToolbar={
        <OperationPanel
          operations={operationsList}
          activeId={op}
          onSelect={(id) => setOp(id as StringOp)}
          accentColor="#22d3ee"
        />
      }
      visualization={
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: '24px', gap: '20px' }}>
          <StringVisualizer text={getTransformedText()} accentColor="#22d3ee" />
        </div>
      }
      codeContent={`def process_string(s: str) -> str:
    return s[::-1]`}
    />
  )
}
