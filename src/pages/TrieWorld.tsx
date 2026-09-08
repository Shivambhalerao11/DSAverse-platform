import { useState, useMemo } from 'react'
import DSAWorkspace from '../components/dsa/DSAWorkspace'
import { InputPanel } from '../components/dsa/InputPanel'
import { OperationPanel, type OperationItem } from '../components/dsa/OperationPanel'
import { generateTrieInsertSteps, generateTrieSearchSteps, TRIE_CANONICAL_CODE } from '../engines/trieEngine'

interface TrieWorldProps {
  onNavigate: (view: string) => void
  isDark?: boolean
  onToggleDark?: () => void
}

type TrieOp = 'insert' | 'search' | 'startswith'

export default function TrieWorld({ onNavigate, isDark = true, onToggleDark }: TrieWorldProps) {
  const [words, setWords] = useState<string[]>(['cat', 'car', 'card', 'dog'])
  const [inputStr, setInputStr] = useState('cat, car, card, dog')
  const [targetWord, setTargetWord] = useState('card')
  const [op, setOp] = useState<TrieOp>('insert')
  const [stepIndex, setStepIndex] = useState(0)

  const handleParseInput = (raw: string) => {
    setInputStr(raw)
    const parsed = raw.split(/[\s,]+/).map((w) => w.trim().toLowerCase()).filter(Boolean)
    if (parsed.length > 0) {
      setWords(parsed)
      setStepIndex(0)
    }
  }

  const steps = useMemo(() => {
    return op === 'insert'
      ? generateTrieInsertSteps(words, targetWord)
      : generateTrieSearchSteps(words, targetWord, op === 'startswith')
  }, [words, targetWord, op])

  const currentStep = steps[stepIndex] || steps[0]

  const operationsList: OperationItem[] = [
    { id: 'insert', label: `Insert ("${targetWord}")`, icon: '➕', color: '#10b981' },
    { id: 'search', label: `Search Exact ("${targetWord}")`, icon: '🔍', color: '#6366f1' },
    { id: 'startswith', label: `StartsWith Prefix ("${targetWord.slice(0, 2)}")`, icon: '🔤', color: '#22d3ee' },
  ]

  return (
    <DSAWorkspace
      onNavigate={onNavigate}
      isDark={isDark}
      onToggleDark={onToggleDark}
      topicId="trie"
      topicName="Trie (Prefix Tree)"
      topicCategory="Advanced"
      topicColor="#10b981"
      language="Python"
      stepIndex={stepIndex}
      totalSteps={steps.length}
      onStepChange={setStepIndex}
      timeComplexity={currentStep?.complexity.time || 'O(L)'}
      spaceComplexity={currentStep?.complexity.space || 'O(L * Sigma)'}
      complexityDesc={currentStep?.complexity.explanation || 'Trie operations depend on length L of target word.'}
      currentStepTitle={`Step ${stepIndex + 1}: ${currentStep?.description || ''}`}
      currentStepDesc={currentStep?.description}
      variables={currentStep?.variables}
      activeLine={currentStep?.highlights.codeLine}
      inputPanel={
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <InputPanel
            label="Word List Input"
            placeholder="e.g. cat, car, card, dog"
            value={inputStr}
            onChange={handleParseInput}
            onRandomize={() => handleParseInput('apple, app, code, coder')}
            onClear={() => handleParseInput('')}
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '12.5px', color: 'var(--c-text-3)', fontWeight: '600' }}>Target Word:</span>
            <input
              type="text"
              value={targetWord}
              onChange={(e) => setTargetWord(e.target.value.toLowerCase())}
              placeholder="e.g. card"
              style={{
                padding: '6px 12px', borderRadius: '8px', background: 'var(--c-card-2)',
                border: '1px solid var(--c-border-med)', color: 'var(--c-text-1)', fontSize: '13px', outline: 'none',
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
            setOp(id as TrieOp)
            setStepIndex(0)
          }}
          accentColor="#10b981"
        />
      }
      visualization={
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
          <div style={{ fontSize: '13.5px', fontWeight: '700', color: 'var(--c-text-1)' }}>
            TRIE WORDS IN STORE: <span style={{ color: '#10b981' }}>{words.join(', ')}</span>
          </div>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
            {words.map((w, idx) => {
              const isMatch = currentStep?.stateSnapshot.matchingPrefix && w.startsWith(currentStep.stateSnapshot.matchingPrefix)
              return (
                <div
                  key={idx}
                  style={{
                    padding: '10px 16px', borderRadius: '10px',
                    background: isMatch ? 'rgba(16,185,129,0.2)' : 'var(--c-card-2)',
                    border: isMatch ? '2px solid #10b981' : '1px solid var(--c-border-med)',
                    color: 'var(--c-text-1)', fontFamily: 'JetBrains Mono, monospace', fontSize: '14px', fontWeight: '700',
                  }}
                >
                  {w}
                </div>
              )
            })}
          </div>
        </div>
      }
      codeContent={op === 'insert' ? TRIE_CANONICAL_CODE.insert : TRIE_CANONICAL_CODE.search}
    />
  )
}
