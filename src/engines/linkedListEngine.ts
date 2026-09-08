// Pure Linked List Step Generator Engine
import { type AlgorithmStep } from '../types/algorithmStep'

export interface LLNodeData {
  id: number
  value: number
}

export type LLStep = AlgorithmStep<{ nodes: LLNodeData[]; activeNodeId?: number }>

// Canonical Python reference per operation — see arrayEngine.ts for why
// codeLine is Python-only.
export const LINKED_LIST_CANONICAL_CODE = {
  traverse: `def traverse(head):\n    node = head\n    while node:\n        visit(node)\n        node = node.next`,
  insertHead: `def insert_head(head, val):\n    node = Node(val)\n    node.next = head\n    return node`,
  insertTail: `def insert_tail(head, val):\n    node = Node(val)\n    if head is None:\n        return node\n    curr = head\n    while curr.next:\n        curr = curr.next\n    curr.next = node\n    return head`,
} as const

export function generateLLTraverseSteps(nodes: LLNodeData[]): LLStep[] {
  if (nodes.length === 0) {
    return [{ stepIndex: 0, description: 'Linked List is empty.', stateSnapshot: { nodes: [] }, variables: { count: 0 }, complexity: { time: 'O(1)', space: 'O(1)', explanation: 'Empty list.' }, highlights: {} }]
  }

  const steps: LLStep[] = []
  nodes.forEach((n, idx) => {
    steps.push({
      stepIndex: idx,
      description: idx === 0 ? `HEAD Pointer: Node with value ${n.value}` : idx === nodes.length - 1 ? `TAIL Pointer: Node with value ${n.value} ➔ NULL` : `Traversing pointer to Node ${idx} (${n.value})`,
      stateSnapshot: { nodes: [...nodes], activeNodeId: n.id },
      variables: { currentVal: n.value, nodeIndex: idx, isHead: idx === 0, isTail: idx === nodes.length - 1 },
      complexity: { time: 'O(N)', space: 'O(1)', explanation: 'Traversing linked list nodes sequentially.' },
      highlights: { activeIndices: [idx], codeLine: 4 },
    })
  })

  return steps
}

export function generateLLInsertSteps(nodes: LLNodeData[], newVal: number, atHead: boolean = false): LLStep[] {
  const newNode: LLNodeData = { id: Date.now(), value: newVal }
  const nextNodes = atHead ? [newNode, ...nodes] : [...nodes, newNode]
  const steps: LLStep[] = []

  steps.push({
    stepIndex: 0,
    description: atHead
      ? `Allocated new node with value ${newVal}. Pointing next to current HEAD (${nodes[0]?.value ?? 'NULL'}).`
      : `Allocated new node with value ${newVal}. Traversing to TAIL (${nodes[nodes.length - 1]?.value ?? 'NULL'}).`,
    stateSnapshot: { nodes: [...nodes] },
    variables: { insertVal: newVal, position: atHead ? 'HEAD' : 'TAIL' },
    complexity: { time: atHead ? 'O(1)' : 'O(N)', space: 'O(1)', explanation: atHead ? 'O(1) Head pointer update.' : 'O(N) Tail traversal.' },
    highlights: { codeLine: atHead ? 2 : 6 },
  })

  steps.push({
    stepIndex: 1,
    description: `Inserted node (${newVal}) successfully at ${atHead ? 'HEAD' : 'TAIL'}. List size: ${nextNodes.length}`,
    stateSnapshot: { nodes: nextNodes, activeNodeId: newNode.id },
    variables: { status: 'Inserted', newHead: nextNodes[0]?.value, newTail: nextNodes[nextNodes.length - 1]?.value },
    complexity: { time: atHead ? 'O(1)' : 'O(N)', space: 'O(1)', explanation: 'Updated next pointer.' },
    highlights: { activeNodes: [`${newNode.id}`], codeLine: atHead ? 3 : 8 },
  })

  return steps
}
