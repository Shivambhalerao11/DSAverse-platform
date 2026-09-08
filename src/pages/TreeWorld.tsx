import { useState, useMemo } from 'react'
import DSAWorkspace from '../components/dsa/DSAWorkspace'
import { InputPanel } from '../components/dsa/InputPanel'
import { OperationPanel, type OperationItem } from '../components/dsa/OperationPanel'
import { TreeVisualizer } from '../components/dsa/visualizers/TreeVisualizer'
import { generateTreeTraverseSteps, generateBSTInsertSteps, TREE_CANONICAL_CODE } from '../engines/treeEngine'

interface TreeWorldProps {
  onNavigate: (view: string) => void
  isDark?: boolean
  onToggleDark?: () => void
}

type TreeOp = 'inorder' | 'preorder' | 'postorder' | 'insert'

export default function TreeWorld({ onNavigate, isDark = true, onToggleDark }: TreeWorldProps) {
  const [nodes, setNodes] = useState<number[]>([50, 30, 70, 20, 40])
  const [inputStr, setInputStr] = useState('50, 30, 70, 20, 40')
  const [op, setOp] = useState<TreeOp>('inorder')
  const [stepIndex, setStepIndex] = useState(0)

  const handleParseInput = (raw: string) => {
    setInputStr(raw)
    const parsed = raw.split(/[\s,]+/).map((n) => parseInt(n.trim(), 10)).filter((n) => !isNaN(n))
    if (parsed.length > 0) {
      setNodes(parsed)
      setStepIndex(0)
    }
  }

  const steps = useMemo(() => {
    if (op === 'insert') return generateBSTInsertSteps(nodes, 25)
    return generateTreeTraverseSteps(nodes, op)
  }, [nodes, op])

  const currentStep = steps[stepIndex] || steps[0]

  const operationsList: OperationItem[] = [
    { id: 'inorder', label: 'Inorder Traversal', icon: '📥', color: '#10b981' },
    { id: 'preorder', label: 'Preorder Traversal', icon: '📤', color: '#22d3ee' },
    { id: 'postorder', label: 'Postorder Traversal', icon: '🔄', color: '#f59e0b' },
    { id: 'insert', label: 'BST Insert (25)', icon: '➕', color: '#6366f1' },
  ]

  return (
    <DSAWorkspace
      onNavigate={onNavigate}
      isDark={isDark}
      onToggleDark={onToggleDark}
      topicId="trees"
      topicName="Trees & BST"
      topicCategory="Intermediate"
      topicColor="#10b981"
      language="Python"
      stepIndex={stepIndex}
      totalSteps={steps.length}
      onStepChange={setStepIndex}
      timeComplexity={currentStep?.complexity.time || 'O(N)'}
      spaceComplexity={currentStep?.complexity.space || 'O(H)'}
      complexityDesc={currentStep?.complexity.explanation || 'Tree operations visit nodes down height H.'}
      currentStepTitle={`Step ${stepIndex + 1}: ${currentStep?.description || ''}`}
      currentStepDesc={currentStep?.description}
      variables={currentStep?.variables}
      activeLine={currentStep?.highlights.codeLine}
      inputPanel={
        <InputPanel
          label="Tree Node Values"
          placeholder="e.g. 50, 30, 70, 20, 40"
          value={inputStr}
          onChange={handleParseInput}
          onRandomize={() => handleParseInput('40, 20, 60, 10, 30')}
          onClear={() => handleParseInput('')}
        />
      }
      operationToolbar={
        <OperationPanel
          operations={operationsList}
          activeId={op}
          onSelect={(id) => {
            setOp(id as TreeOp)
            setStepIndex(0)
          }}
          accentColor="#10b981"
        />
      }
      visualization={
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: '24px' }}>
          <TreeVisualizer
            nodes={currentStep?.stateSnapshot.nodes.map((n) => n.val) || nodes}
            activeValue={currentStep?.variables?.currentVal ? Number(currentStep.variables.currentVal) : undefined}
            accentColor="#10b981"
          />
        </div>
      }
      codeContent={op === 'insert' ? TREE_CANONICAL_CODE.bstInsert : TREE_CANONICAL_CODE[op]}
    />
  )
}
