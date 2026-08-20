import { useState, useMemo } from 'react'
import DSAWorkspace from '../components/dsa/DSAWorkspace'
import { InputPanel } from '../components/dsa/InputPanel'
import { OperationPanel, type OperationItem } from '../components/dsa/OperationPanel'
import { generateLLTraverseSteps, generateLLInsertSteps, type LLNodeData } from '../engines/linkedListEngine'

interface LinkedListWorldProps {
  onNavigate: (view: string) => void
  isDark?: boolean
  onToggleDark?: () => void
}

type LLOp = 'traverse' | 'insertHead' | 'insertTail'

export default function LinkedListWorld({ onNavigate, isDark = true, onToggleDark }: LinkedListWorldProps) {
  const [nodes, setNodes] = useState<LLNodeData[]>([
    { id: 1, value: 10 },
    { id: 2, value: 20 },
    { id: 3, value: 30 },
  ])
  const [inputVal, setInputVal] = useState<number>(40)
  const [op, setOp] = useState<LLOp>('traverse')
  const [stepIndex, setStepIndex] = useState(0)

  const steps = useMemo(() => {
    if (op === 'insertHead') return generateLLInsertSteps(nodes, inputVal, true)
    if (op === 'insertTail') return generateLLInsertSteps(nodes, inputVal, false)
    return generateLLTraverseSteps(nodes)
  }, [nodes, inputVal, op])

  const currentStep = steps[stepIndex] || steps[0]
  const currentNodes = currentStep?.stateSnapshot.nodes || nodes

  const operationsList: OperationItem[] = [
    { id: 'traverse', label: 'Traverse List', icon: '👁', color: '#6366f1' },
    { id: 'insertHead', label: `Insert Head (${inputVal})`, icon: '⬅', color: '#06b6d4' },
    { id: 'insertTail', label: `Insert Tail (${inputVal})`, icon: '➡', color: '#10b981' },
  ]

  return (
    <DSAWorkspace
      onNavigate={onNavigate}
      isDark={isDark}
      onToggleDark={onToggleDark}
      topicId="linkedlist"
      topicName="Linked List"
      topicCategory="Foundations"
      topicColor="#06b6d4"
      language="Python"
      stepIndex={stepIndex}
      totalSteps={steps.length}
      onStepChange={setStepIndex}
      timeComplexity={currentStep?.complexity.time || 'O(1) Head / O(N) Tail'}
      spaceComplexity={currentStep?.complexity.space || 'O(N)'}
      complexityDesc={currentStep?.complexity.explanation || 'Pointers link nodes in dynamic non-contiguous memory.'}
      currentStepTitle={`Step ${stepIndex + 1}: ${currentStep?.description || ''}`}
      currentStepDesc={currentStep?.description}
      variables={currentStep?.variables}
      inputPanel={
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--c-text-3)' }}>Node Input Value:</span>
          <input
            type="number"
            value={inputVal}
            onChange={(e) => setInputVal(parseInt(e.target.value, 10) || 0)}
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
          activeId={op}
          onSelect={(id) => {
            setOp(id as LLOp)
            setStepIndex(0)
          }}
          accentColor="#06b6d4"
        />
      }
      visualization={
        <div style={{ padding: '32px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '20px' }}>
          {currentNodes.length === 0 ? (
            <div style={{ fontSize: '14px', color: 'var(--c-text-4)', fontWeight: '600' }}>Linked List is empty. Insert nodes to visualize pointers.</div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
              {currentNodes.map((node, idx) => {
                const isActive = currentStep?.stateSnapshot.activeNodeId === node.id
                return (
                  <div key={node.id} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div
                      style={{
                        padding: '12px 18px', borderRadius: '12px',
                        background: isActive ? 'rgba(6,182,212,0.35)' : idx === 0 ? 'rgba(6,182,212,0.15)' : 'var(--c-card-2)',
                        border: isActive ? '2px solid #06b6d4' : idx === 0 ? '2px solid #06b6d4' : '1px solid var(--c-border-med)',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                      }}
                    >
                      <span style={{ fontSize: '16px', fontWeight: '700', color: 'var(--c-text-1)', fontFamily: 'JetBrains Mono, monospace' }}>{node.value}</span>
                      <span style={{ fontSize: '9.5px', color: 'var(--c-text-4)', marginTop: '2px' }}>{idx === 0 ? 'HEAD' : idx === currentNodes.length - 1 ? 'TAIL' : `Node ${idx}`}</span>
                    </div>
                    {idx < currentNodes.length - 1 && (
                      <span style={{ fontSize: '18px', color: '#06b6d4', fontWeight: '700' }}>➔</span>
                    )}
                  </div>
                )
              })}
              <span style={{ fontSize: '14px', color: 'var(--c-text-5)', fontWeight: '600' }}>➔ NULL</span>
            </div>
          )}
        </div>
      }
      codeContent={`class Node:
    def __init__(self, data):
        self.data = data
        self.next = None

# Insert at Head
new_node = Node(val)
new_node.next = head
head = new_node`}
    />
  )
}
