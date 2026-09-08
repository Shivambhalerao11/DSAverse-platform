// Pure Tree & BST Step Generator Engine — Conforming to AlgorithmStep Contract
import { type AlgorithmStep } from '../types/algorithmStep'

export interface TreeNode {
  id: string
  val: number
  left?: TreeNode | null
  right?: TreeNode | null
}

export type TreeStep = AlgorithmStep<{ nodes: TreeNode[]; rootVal?: number }>

// Canonical Python reference per traversal — see arrayEngine.ts for why
// codeLine is Python-only.
export const TREE_CANONICAL_CODE = {
  inorder: `def inorder(node):\n    if node:\n        inorder(node.left)\n        visit(node)\n        inorder(node.right)`,
  preorder: `def preorder(node):\n    if node:\n        visit(node)\n        preorder(node.left)\n        preorder(node.right)`,
  postorder: `def postorder(node):\n    if node:\n        postorder(node.left)\n        postorder(node.right)\n        visit(node)`,
  levelorder: `def level_order(root):\n    queue = [root]\n    while queue:\n        node = queue.pop(0)\n        visit(node)\n        queue += [c for c in (node.left, node.right) if c]`,
  bstInsert: `def insert(root, val):\n    if root is None:\n        return TreeNode(val)\n    if val < root.val:\n        root.left = insert(root.left, val)\n    else:\n        root.right = insert(root.right, val)\n    return root`,
} as const

const TRAVERSE_VISIT_LINE: Record<'inorder' | 'preorder' | 'postorder' | 'levelorder', number> = {
  inorder: 4,
  preorder: 3,
  postorder: 5,
  levelorder: 4,
}

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
        codeLine: TRAVERSE_VISIT_LINE[type],
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
    highlights: { codeLine: 4 },
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
      codeLine: 3,
    },
  })

  return steps
}
