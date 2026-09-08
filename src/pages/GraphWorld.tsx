import { useState, useMemo } from 'react'
import DSAWorkspace from '../components/dsa/DSAWorkspace'
import { OperationPanel, type OperationItem } from '../components/dsa/OperationPanel'
import { GraphVisualizer, type GraphNode, type GraphEdge } from '../components/dsa/visualizers/GraphVisualizer'
import {
  generateBFSSteps,
  generateDFSSteps,
  generateDijkstraSteps,
  GRAPH_CANONICAL_CODE,
} from '../engines/graphEngine'

interface GraphWorldProps {
  onNavigate: (view: string) => void
  isDark?: boolean
  onToggleDark?: () => void
}

type GraphAlgo = 'bfs' | 'dfs' | 'dijkstra'

export default function GraphWorld({ onNavigate, isDark = true, onToggleDark }: GraphWorldProps) {
  const [nodes, setNodes] = useState<GraphNode[]>([
    { id: 'A', label: 'A', x: 80, y: 80 },
    { id: 'B', label: 'B', x: 220, y: 60 },
    { id: 'C', label: 'C', x: 140, y: 180 },
    { id: 'D', label: 'D', x: 300, y: 160 },
  ])
  const [edges, setEdges] = useState<GraphEdge[]>([
    { from: 'A', to: 'B', weight: 4 },
    { from: 'A', to: 'C', weight: 2 },
    { from: 'B', to: 'C', weight: 1 },
    { from: 'B', to: 'D', weight: 5 },
    { from: 'C', to: 'D', weight: 8 },
  ])
  const [algo, setAlgo] = useState<GraphAlgo>('bfs')
  const [stepIndex, setStepIndex] = useState(0)

  const handleAddNode = () => {
    const nextChar = String.fromCharCode(65 + nodes.length)
    const newNode: GraphNode = {
      id: nextChar,
      label: nextChar,
      x: 100 + (nodes.length * 50) % 250,
      y: 100 + (nodes.length * 40) % 150,
    }
    setNodes([...nodes, newNode])
    if (nodes.length > 0) {
      setEdges([...edges, { from: nodes[nodes.length - 1].id, to: nextChar, weight: 3 }])
    }
    setStepIndex(0)
  }

  const steps = useMemo(() => {
    switch (algo) {
      case 'dfs':      return generateDFSSteps(nodes, edges, 'A')
      case 'dijkstra': return generateDijkstraSteps(nodes, edges, 'A')
      default:         return generateBFSSteps(nodes, edges, 'A')
    }
  }, [nodes, edges, algo])

  const currentStep = steps[stepIndex] || steps[0]

  const operationsList: OperationItem[] = [
    { id: 'bfs', label: 'BFS (Breadth-First)', icon: '🌊', color: '#8b5cf6' },
    { id: 'dfs', label: 'DFS (Depth-First)', icon: '🔍', color: '#10b981' },
    { id: 'dijkstra', label: "Dijkstra's Shortest Path", icon: '🚀', color: '#22d3ee' },
  ]

  return (
    <DSAWorkspace
      onNavigate={onNavigate}
      isDark={isDark}
      onToggleDark={onToggleDark}
      topicId="graphs"
      topicName="Graph Algorithms"
      topicCategory="Advanced"
      topicColor="#8b5cf6"
      language="Python"
      stepIndex={stepIndex}
      totalSteps={steps.length}
      onStepChange={setStepIndex}
      timeComplexity={currentStep?.complexity.time || 'O(V + E)'}
      spaceComplexity={currentStep?.complexity.space || 'O(V)'}
      complexityDesc={currentStep?.complexity.explanation || 'Graph algorithms traverse vertices V and edges E.'}
      currentStepTitle={`Step ${stepIndex + 1}: ${currentStep?.description || ''}`}
      currentStepDesc={currentStep?.description}
      variables={currentStep?.variables}
      activeLine={currentStep?.highlights.codeLine}
      inputPanel={
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={handleAddNode}
            style={{
              padding: '8px 16px', borderRadius: '8px', background: '#8b5cf6',
              color: '#fff', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '12.5px',
            }}
          >
            ➕ Add Vertex ({String.fromCharCode(65 + nodes.length)})
          </button>
        </div>
      }
      operationToolbar={
        <OperationPanel
          operations={operationsList}
          activeId={algo}
          onSelect={(id) => {
            setAlgo(id as GraphAlgo)
            setStepIndex(0)
          }}
          accentColor="#8b5cf6"
        />
      }
      visualization={
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: '24px' }}>
          <GraphVisualizer
            nodes={nodes}
            edges={edges}
            activeNodeId={currentStep?.stateSnapshot.activeNodeId || 'A'}
            visitedNodeIds={currentStep?.stateSnapshot.visitedNodeIds || ['A']}
            accentColor="#8b5cf6"
          />
        </div>
      }
      codeContent={GRAPH_CANONICAL_CODE[algo]}
    />
  )
}
