import { useState } from 'react'
import DSAWorkspace from '../components/dsa/DSAWorkspace'
import { OperationPanel, type OperationItem } from '../components/dsa/OperationPanel'
import { StackQueueVisualizer } from '../components/dsa/visualizers/StackQueueVisualizer'

interface StackWorldProps {
  onNavigate: (view: string) => void
  isDark?: boolean
  onToggleDark?: () => void
}

export default function StackWorld({ onNavigate, isDark = true, onToggleDark }: StackWorldProps) {
  const [items, setItems] = useState<number[]>([10, 20, 30])
  const [valInput, setValInput] = useState<number>(40)
  const [opMsg, setOpMsg] = useState('Stack initialized with [10, 20, 30]')

  const handlePush = () => {
    setItems([...items, valInput])
    setOpMsg(`Pushed ${valInput} onto Stack TOP`)
    setValInput((v) => v + 10)
  }

  const handlePop = () => {
    if (items.length === 0) return
    const popped = items[items.length - 1]
    setItems(items.slice(0, -1))
    setOpMsg(`Popped ${popped} from Stack TOP`)
  }

  const handlePeek = () => {
    if (items.length === 0) {
      setOpMsg('Stack is Empty')
    } else {
      setOpMsg(`Peeked TOP value: ${items[items.length - 1]}`)
    }
  }

  const handleClear = () => {
    setItems([])
    setOpMsg('Cleared all items from Stack')
  }

  const operationsList: OperationItem[] = [
    { id: 'push', label: `Push (${valInput})`, icon: '📥', color: '#f43f5e' },
    { id: 'pop', label: 'Pop TOP', icon: '📤', color: '#f59e0b' },
    { id: 'peek', label: 'Peek TOP', icon: '👁', color: '#6366f1' },
    { id: 'clear', label: 'Clear Stack', icon: '🗑', color: '#64748b' },
  ]

  return (
    <DSAWorkspace
      onNavigate={onNavigate}
      isDark={isDark}
      onToggleDark={onToggleDark}
      topicId="stack"
      topicName="Stack (LIFO)"
      topicCategory="Foundations"
      topicColor="#f43f5e"
      language="Python"
      timeComplexity="O(1)"
      spaceComplexity="O(N)"
      complexityDesc="Push and Pop operate in O(1) constant time at the TOP."
      currentStepTitle={opMsg}
      currentStepDesc={opMsg}
      variables={{ stackSize: items.length, topValue: items[items.length - 1] ?? 'Empty' }}
      inputPanel={
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--c-text-3)' }}>Push Value:</span>
          <input
            type="number"
            value={valInput}
            onChange={(e) => setValInput(parseInt(e.target.value, 10) || 0)}
            style={{
              width: '90px', padding: '6px 12px', borderRadius: '8px',
              background: 'var(--c-card-2)', border: '1px solid var(--c-border-med)',
              color: 'var(--c-text-1)', fontSize: '13px', outline: 'none',
            }}
          />
        </div>
      }
      operationToolbar={
        <OperationPanel
          operations={operationsList}
          onSelect={(id) => {
            if (id === 'push') handlePush()
            else if (id === 'pop') handlePop()
            else if (id === 'peek') handlePeek()
            else if (id === 'clear') handleClear()
          }}
          accentColor="#f43f5e"
        />
      }
      visualization={
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: '24px' }}>
          <StackQueueVisualizer
            items={items.map((val, id) => ({ id, val }))}
            mode="stack"
            accentColor="#f43f5e"
          />
        </div>
      }
      codeContent={`stack = [10, 20, 30]

# Push onto stack
stack.append(40)

# Pop from stack
popped = stack.pop()`}
    />
  )
}
