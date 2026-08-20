import { useState } from 'react'
import DSAWorkspace from '../components/dsa/DSAWorkspace'
import { OperationPanel, type OperationItem } from '../components/dsa/OperationPanel'
import { StackQueueVisualizer } from '../components/dsa/visualizers/StackQueueVisualizer'

interface QueueWorldProps {
  onNavigate: (view: string) => void
  isDark?: boolean
  onToggleDark?: () => void
}

export default function QueueWorld({ onNavigate, isDark = true, onToggleDark }: QueueWorldProps) {
  const [items, setItems] = useState<number[]>([10, 20, 30])
  const [valInput, setValInput] = useState<number>(40)
  const [opMsg, setOpMsg] = useState('Queue initialized with [10, 20, 30]')

  const handleEnqueue = () => {
    setItems([...items, valInput])
    setOpMsg(`Enqueued ${valInput} at REAR of Queue`)
    setValInput((v) => v + 10)
  }

  const handleDequeue = () => {
    if (items.length === 0) return
    const dequeued = items[0]
    setItems(items.slice(1))
    setOpMsg(`Dequeued ${dequeued} from FRONT of Queue`)
  }

  const handleFront = () => {
    if (items.length === 0) {
      setOpMsg('Queue is Empty')
    } else {
      setOpMsg(`Front Value: ${items[0]}`)
    }
  }

  const handleClear = () => {
    setItems([])
    setOpMsg('Cleared all items from Queue')
  }

  const operationsList: OperationItem[] = [
    { id: 'enqueue', label: `Enqueue (${valInput})`, icon: '📥', color: '#a855f7' },
    { id: 'dequeue', label: 'Dequeue FRONT', icon: '📤', color: '#f59e0b' },
    { id: 'front', label: 'Peek FRONT', icon: '👁', color: '#6366f1' },
    { id: 'clear', label: 'Clear Queue', icon: '🗑', color: '#64748b' },
  ]

  return (
    <DSAWorkspace
      onNavigate={onNavigate}
      isDark={isDark}
      onToggleDark={onToggleDark}
      topicId="queue"
      topicName="Queue (FIFO)"
      topicCategory="Foundations"
      topicColor="#a855f7"
      language="Python"
      timeComplexity="O(1)"
      spaceComplexity="O(N)"
      complexityDesc="Enqueue at REAR and Dequeue at FRONT operate in O(1) time."
      currentStepTitle={opMsg}
      currentStepDesc={opMsg}
      variables={{ queueSize: items.length, frontValue: items[0] ?? 'Empty', rearValue: items[items.length - 1] ?? 'Empty' }}
      inputPanel={
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--c-text-3)' }}>Enqueue Value:</span>
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
            if (id === 'enqueue') handleEnqueue()
            else if (id === 'dequeue') handleDequeue()
            else if (id === 'front') handleFront()
            else if (id === 'clear') handleClear()
          }}
          accentColor="#a855f7"
        />
      }
      visualization={
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: '24px' }}>
          <StackQueueVisualizer
            items={items.map((val, id) => ({ id, val }))}
            mode="queue"
            accentColor="#a855f7"
          />
        </div>
      }
      codeContent={`from collections import deque

queue = deque([10, 20, 30])

# Enqueue
queue.append(40)

# Dequeue
dequeued = queue.popleft()`}
    />
  )
}
