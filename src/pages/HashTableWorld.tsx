import { useState, useMemo } from 'react'
import DSAWorkspace from '../components/dsa/DSAWorkspace'
import { InputPanel } from '../components/dsa/InputPanel'
import { OperationPanel, type OperationItem } from '../components/dsa/OperationPanel'
import { generateHashTableInsertSteps, generateHashTableSearchSteps } from '../engines/hashTableEngine'

interface HashTableWorldProps {
  onNavigate: (view: string) => void
  isDark?: boolean
  onToggleDark?: () => void
}

type HashOp = 'insert' | 'search'

export default function HashTableWorld({ onNavigate, isDark = true, onToggleDark }: HashTableWorldProps) {
  const [items, setItems] = useState<Array<{ key: string; value: number }>>([
    { key: 'apple', value: 50 },
    { key: 'banana', value: 30 },
    { key: 'cat', value: 90 },
  ])
  const [keyInput, setKeyInput] = useState('cherry')
  const [valInput, setValInput] = useState(75)
  const [op, setOp] = useState<HashOp>('insert')
  const [stepIndex, setStepIndex] = useState(0)

  const steps = useMemo(() => {
    return op === 'search'
      ? generateHashTableSearchSteps(items, keyInput)
      : generateHashTableInsertSteps(items, keyInput, valInput)
  }, [items, keyInput, valInput, op])

  const currentStep = steps[stepIndex] || steps[0]
  const buckets = currentStep?.stateSnapshot.buckets || []

  const operationsList: OperationItem[] = [
    { id: 'insert', label: `Insert ("${keyInput}": ${valInput})`, icon: '➕', color: '#f59e0b' },
    { id: 'search', label: `Search ("${keyInput}")`, icon: '🔍', color: '#6366f1' },
  ]

  return (
    <DSAWorkspace
      onNavigate={onNavigate}
      isDark={isDark}
      onToggleDark={onToggleDark}
      topicId="hashtables"
      topicName="Hash Tables"
      topicCategory="Intermediate"
      topicColor="#f59e0b"
      language="Python"
      stepIndex={stepIndex}
      totalSteps={steps.length}
      onStepChange={setStepIndex}
      timeComplexity={currentStep?.complexity.time || 'O(1) Avg'}
      spaceComplexity={currentStep?.complexity.space || 'O(N)'}
      complexityDesc={currentStep?.complexity.explanation || 'Hash Tables provide average O(1) key lookups.'}
      currentStepTitle={`Step ${stepIndex + 1}: ${currentStep?.description || ''}`}
      currentStepDesc={currentStep?.description}
      variables={currentStep?.variables}
      inputPanel={
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <InputPanel
            label="Key To Insert/Search"
            placeholder="e.g. cherry"
            value={keyInput}
            onChange={(val) => setKeyInput(val)}
            onRandomize={() => setKeyInput('dragonfruit')}
            onClear={() => setKeyInput('')}
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '12.5px', color: 'var(--c-text-3)', fontWeight: '600' }}>Value:</span>
            <input
              type="number"
              value={valInput}
              onChange={(e) => setValInput(parseInt(e.target.value, 10) || 0)}
              style={{
                width: '70px', padding: '6px 10px', borderRadius: '8px',
                background: 'var(--c-card-2)', border: '1px solid var(--c-border-med)',
                color: 'var(--c-text-1)', fontSize: '13px', outline: 'none',
              }}
            />
          </div>
        </div>
      }
      operationToolbar={
        <OperationPanel
          operations={operationsList}
          activeId={op}
          onSelect={(id) => {
            setOp(id as HashOp)
            setStepIndex(0)
          }}
          accentColor="#f59e0b"
        />
      }
      visualization={
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--c-text-1)' }}>
            HASH BUCKET ARRAY (SEPARATE CHAINING COLLISION RESOLUTION)
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', maxWidth: '640px' }}>
            {buckets.map((b) => {
              const isActive = currentStep?.highlights.activeIndices?.includes(b.index)
              return (
                <div
                  key={b.index}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px',
                    borderRadius: '10px',
                    background: isActive ? 'rgba(245,158,11,0.18)' : 'var(--c-card-2)',
                    border: isActive ? '2px solid #f59e0b' : '1px solid var(--c-border-med)',
                  }}
                >
                  <div
                    style={{
                      width: '32px', height: '32px', borderRadius: '8px', background: 'var(--c-card)',
                      border: '1px solid var(--c-border)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: 'JetBrains Mono, monospace', fontWeight: '700', fontSize: '13px', color: '#f59e0b',
                    }}
                  >
                    [{b.index}]
                  </div>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', flex: 1 }}>
                    {b.chain.length === 0 ? (
                      <span style={{ fontSize: '12px', color: 'var(--c-text-5)', fontStyle: 'italic' }}>Empty Bucket</span>
                    ) : (
                      b.chain.map((item, idx) => (
                        <div
                          key={idx}
                          style={{
                            padding: '4px 10px', borderRadius: '6px', background: 'rgba(99,102,241,0.2)',
                            border: '1px solid #6366f1', color: 'var(--c-text-1)', fontFamily: 'JetBrains Mono, monospace',
                            fontSize: '12.5px', fontWeight: '600',
                          }}
                        >
                          "{item.key}": {item.value}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      }
      codeContent={`class HashTable:
    def __init__(self, size=7):
        self.size = size
        self.buckets = [[] for _ in range(size)]

    def _hash(self, key: str) -> int:
        return sum(ord(c) for c in key) % self.size

    def insert(self, key: str, val: int):
        idx = self._hash(key)
        self.buckets[idx].append((key, val))`}
    />
  )
}
