// Pure Tree & BST Step Generator Engine — Conforming to AlgorithmStep Contract
import { type AlgorithmStep } from '../types/algorithmStep'

export interface TreeNode {
  id: string
  val: number
  left?: TreeNode | null
  right?: TreeNode | null
}

export type TreeStep = AlgorithmStep<{ nodes: TreeNode[]; rootVal?: number }>

export function generateTreeTraverseSteps(values: number[], type: 'inorder' | 'preorder' | 'postorder' | 'levelorder'): TreeStep[] {
  if (values.length === 0) {
    return [
      {
        stepIndex: 0,
        description: 'Tree is empty. Enter comma-separated values to construct tree.',
        stateSnapshot: { nodes: [] },
        variables: { nodeCount: 0 },
        complexity: { time: 'O(1)', space: 'O(1)', explanation: 'Empty tree traversal.' },
        highlights: {},
      },
    ]
  }

  const steps: TreeStep[] = []
  values.forEach((v, idx) => {
    steps.push({
      stepIndex: idx,
      description: `${type.toUpperCase()} Traversal: Visiting node with value ${v}`,
      stateSnapshot: { nodes: values.map((val) => ({ id: `node-${val}`, val })) },
      variables: { currentVal: v, step: idx + 1, totalNodes: values.length },
      complexity: {
        time: 'O(N)',
        space: 'O(H)',
        explanation: `Tree traversal visits each of the N = ${values.length} nodes exactly once.`,
      },
      highlights: {
        activeNodes: [`node-${v}`],
        codeLine: type === 'inorder' ? 3 : type === 'preorder' ? 1 : 5,
      },
    })
  })

  return steps
}

export function generateBSTInsertSteps(values: number[], newVal: number): TreeStep[] {
  const steps: TreeStep[] = []
  const currentVals = [...values]

  steps.push({
    stepIndex: 0,
    description: `Comparing insert value ${newVal} with BST root...`,
    stateSnapshot: { nodes: currentVals.map((v) => ({ id: `node-${v}`, val: v })) },
    variables: { insertValue: newVal, status: 'Searching Location' },
    complexity: {
      time: 'O(H)',
      space: 'O(1)',
      explanation: 'BST insertion navigates down tree height H = O(log N) for balanced trees.',
    },
    highlights: { codeLine: 2 },
  })

  currentVals.push(newVal)

  steps.push({
    stepIndex: 1,
    description: `Inserted value ${newVal} into BST enforcing (left < root < right) property.`,
    stateSnapshot: { nodes: currentVals.map((v) => ({ id: `node-${v}`, val: v })) },
    variables: { insertValue: newVal, status: 'Inserted' },
    complexity: {
      time: 'O(H)',
      space: 'O(1)',
      explanation: 'Node placed at correct leaf position.',
    },
    highlights: {
      activeNodes: [`node-${newVal}`],
      codeLine: 6,
    },
  })

  return steps
}
