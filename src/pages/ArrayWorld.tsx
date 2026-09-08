import { useState } from 'react'
import DSAWorkspace from '../components/dsa/DSAWorkspace'
import { InputPanel } from '../components/dsa/InputPanel'
import { OperationPanel, type OperationItem } from '../components/dsa/OperationPanel'
import { ArrayVisualizer } from '../components/dsa/visualizers/ArrayVisualizer'
import { generateTraverseSteps, generateSearchSteps, generateReverseSteps, ARRAY_CANONICAL_CODE } from '../engines/arrayEngine'
import { getDebuggerData } from '../data/dsaDebuggerData'
import { type SupportedLanguage } from '../data/dsaCodeSnippets'

interface ArrayWorldProps {
  onNavigate: (view: string) => void
  isDark?: boolean
  onToggleDark?: () => void
}

type ArrayOp = 'traverse' | 'search' | 'reverse'

export default function ArrayWorld({ onNavigate, isDark, onToggleDark }: ArrayWorldProps) {
  const [inputStr, setInputStr] = useState('5, 8, 2, 10, 7, 3')
  const [array, setArray] = useState<number[]>([5, 8, 2, 10, 7, 3])
  const [language, setLanguage] = useState<SupportedLanguage>('Python')
  const [op, setOp] = useState<ArrayOp>('traverse')
  const [stepIndex, setStepIndex] = useState(0)

  const handleParseInput = (raw: string) => {
    setInputStr(raw)
    const parsed = raw
      .split(/[\s,]+/)
      .map((n) => parseInt(n.trim(), 10))
      .filter((n) => !isNaN(n))
    if (parsed.length > 0) {
      setArray(parsed)
      setStepIndex(0)
    }
  }

  const handleRandomize = () => {
    const count = 6
    const randoms = Array.from({ length: count }, () => Math.floor(Math.random() * 90) + 10)
    handleParseInput(randoms.join(', '))
  }

  // Pure Algorithm Engine Step Calculations
  const steps =
    op === 'search'
      ? generateSearchSteps(array, 8)
      : op === 'reverse'
      ? generateReverseSteps(array)
      : generateTraverseSteps(array)

  const currentEngineStep = steps[stepIndex] || steps[0]

  const debuggerData = getDebuggerData('array', op, language, {
    array,
    target: 8,
    index: 2,
    value: 9,
  })

  const operationsList: OperationItem[] = [
    { id: 'traverse', label: 'Traverse', icon: '👁', color: '#6366f1' },
    { id: 'search', label: 'Search (8)', icon: '🔍', color: '#22d3ee' },
    { id: 'reverse', label: 'Reverse', icon: '🔄', color: '#f59e0b' },
  ]

  const complexityMap: Record<ArrayOp, { time: string; space: string; desc: string; tips: string[] }> = {
    traverse: {
      time: 'O(n)',
      space: 'O(1)',
      desc: 'Sequentially access each element from index 0 to n-1 in contiguous memory.',
      tips: ['Arrays store elements in contiguous RAM locations.'],
    },
    search: {
      time: 'O(n)',
      space: 'O(1)',
      desc: 'Inspect each element sequentially until target is found or end of array is reached.',
      tips: ['Returns the element index if found, or -1 if target is absent.'],
    },
    reverse: {
      time: 'O(n)',
      space: 'O(1)',
      desc: 'Two-pointer swap from start and end moving inward.',
      tips: ['In-place reverse requiring no auxiliary memory.'],
    },
  }

  return (
    <DSAWorkspace
      onNavigate={onNavigate}
      isDark={isDark}
      onToggleDark={onToggleDark}
      topicId="array"
      topicName="Arrays"
      topicColor="#6366f1"
      topicIcon="▦"
      language={language}
      onLanguageChange={(l) => setLanguage(l as SupportedLanguage)}
      stepIndex={stepIndex}
      totalSteps={steps.length}
      onStepChange={setStepIndex}
      timeComplexity={complexityMap[op].time}
      spaceComplexity={complexityMap[op].space}
      complexityDesc={complexityMap[op].desc}
      complexityTips={complexityMap[op].tips}
      currentStepTitle={`Step ${stepIndex + 1} of ${steps.length}`}
      currentStepDesc={currentEngineStep?.description}
      variables={currentEngineStep?.variables}
      // codeLine is only meaningful against the Python canonical reference
      // (see arrayEngine.ts) — only highlight when Python is the selected
      // display language, otherwise the line number would point at the
      // wrong line in a different language's code.
      activeLine={language === 'Python' ? currentEngineStep?.highlights?.codeLine : undefined}
      realWorldApps={[
        'Buffer storage in audio/video streaming',
        'Image pixel grid processing',
        'Cache line aligned memory storage',
      ]}
      commonMistakes={[
        'Off-by-one errors accessing length vs n-1 index',
        'IndexOutOfBoundsException when looping past array size',
      ]}
      infoItems={[
        { label: 'Array Length', value: array.length.toString() },
        { label: 'Memory Address', value: '0x1000' },
        { label: 'Element Size', value: '4 Bytes' },
      ]}
      inputPanel={
        <InputPanel
          title="Array Input & Presets"
          value={inputStr}
          onChange={handleParseInput}
          onRandomize={handleRandomize}
          onClear={() => handleParseInput('')}
        />
      }
      operationToolbar={
        <OperationPanel
          operations={operationsList}
          activeOpId={op}
          onSelectOp={(id) => {
            setOp(id as ArrayOp)
            setStepIndex(0)
          }}
        />
      }
      visualization={
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '16px' }}>
          <ArrayVisualizer
            elements={array}
            activeIndices={currentEngineStep?.highlights?.activeIndices}
            compareIndices={currentEngineStep?.highlights?.compareIndices}
            swapIndices={currentEngineStep?.highlights?.swapIndices}
            foundIndex={currentEngineStep?.highlights?.foundIndex}
            accentColor="#6366f1"
          />
        </div>
      }
      // Python is the only language whose displayed text is guaranteed to
      // match the engine's codeLine numbering (see ARRAY_CANONICAL_CODE in
      // arrayEngine.ts) — other languages fall back to dsaDebuggerData's
      // per-language text, shown without a line highlight (activeLine is
      // gated to Python above).
      codeContent={language === 'Python' ? ARRAY_CANONICAL_CODE[op] : debuggerData.code}
    />
  )
}
