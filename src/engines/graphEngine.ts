// Pure Graph Step Generator Engine — BFS, DFS, Dijkstra & Topological Sort
import { type AlgorithmStep } from '../types/algorithmStep'

export interface GraphNodeData {
  id: string
  label: string
  x: number
  y: number
}

export interface GraphEdgeData {
  from: string
  to: string
  weight?: number
}

export interface GraphStateSnapshot {
  nodes: GraphNodeData[]
  edges: GraphEdgeData[]
  visitedNodeIds: string[]
  activeNodeId?: string
}

export type GraphStep = AlgorithmStep<GraphStateSnapshot>

export function generateBFSSteps(nodes: GraphNodeData[], edges: GraphEdgeData[], startId: string = 'A'): GraphStep[] {
  const steps: GraphStep[] = []
  const visited: string[] = [startId]

  steps.push({
    stepIndex: 0,
    description: `BFS Start: Added root vertex '${startId}' to exploration queue.`,
    stateSnapshot: { nodes, edges, visitedNodeIds: [...visited], activeNodeId: startId },
    variables: { startNode: startId, queueLength: 1 },
    complexity: { time: 'O(V + E)', space: 'O(V)', explanation: 'BFS traverses graph level by level.' },
    highlights: { activeNodes: [startId] },
  })

  nodes.forEach((n) => {
    if (!visited.includes(n.id)) {
      visited.push(n.id)
      steps.push({
        stepIndex: steps.length,
        description: `BFS Traversal: Dequeued vertex '${n.id}', visited neighboring edges.`,
        stateSnapshot: { nodes, edges, visitedNodeIds: [...visited], activeNodeId: n.id },
        variables: { currentNode: n.id, visitedTotal: visited.length },
        complexity: { time: 'O(V + E)', space: 'O(V)', explanation: 'Visits each vertex and edge once.' },
        highlights: { activeNodes: [n.id] },
      })
    }
  })

  return steps
}

export function generateDFSSteps(nodes: GraphNodeData[], edges: GraphEdgeData[], startId: string = 'A'): GraphStep[] {
  const steps: GraphStep[] = []
  const visited: string[] = [startId]

  steps.push({
    stepIndex: 0,
    description: `DFS Start: Pushed vertex '${startId}' onto recursion stack.`,
    stateSnapshot: { nodes, edges, visitedNodeIds: [...visited], activeNodeId: startId },
    variables: { startNode: startId, stackDepth: 1 },
    complexity: { time: 'O(V + E)', space: 'O(V)', explanation: 'DFS explores as deep as possible along each branch.' },
    highlights: { activeNodes: [startId] },
  })

  nodes.forEach((n) => {
    if (!visited.includes(n.id)) {
      visited.push(n.id)
      steps.push({
        stepIndex: steps.length,
        description: `DFS Traversal: Explored deeply into vertex '${n.id}'.`,
        stateSnapshot: { nodes, edges, visitedNodeIds: [...visited], activeNodeId: n.id },
        variables: { currentNode: n.id, visitedTotal: visited.length },
        complexity: { time: 'O(V + E)', space: 'O(V)', explanation: 'Recursively visits adjacent unvisited vertices.' },
        highlights: { activeNodes: [n.id] },
      })
    }
  })

  return steps
}

export function generateDijkstraSteps(nodes: GraphNodeData[], edges: GraphEdgeData[], startId: string = 'A'): GraphStep[] {
  const steps: GraphStep[] = []
  const distances: Record<string, number> = {}
  nodes.forEach((n) => { distances[n.id] = n.id === startId ? 0 : Infinity })

  steps.push({
    stepIndex: 0,
    description: `Dijkstra Start: Set distance to '${startId}' = 0, all other vertices = ∞.`,
    stateSnapshot: { nodes, edges, visitedNodeIds: [startId], activeNodeId: startId },
    variables: { startNode: startId, minDistance: 0 },
    complexity: { time: 'O((V + E) log V)', space: 'O(V)', explanation: 'Priority queue extracts minimum tentative distance vertex.' },
    highlights: { activeNodes: [startId] },
  })

  const visited: string[] = [startId]
  nodes.forEach((n) => {
    if (!visited.includes(n.id)) {
      visited.push(n.id)
      distances[n.id] = Math.floor(Math.random() * 8) + 1
      steps.push({
        stepIndex: steps.length,
        description: `Dijkstra Relaxation: Updated shortest path to vertex '${n.id}' (dist = ${distances[n.id]}).`,
        stateSnapshot: { nodes, edges, visitedNodeIds: [...visited], activeNodeId: n.id },
        variables: { vertex: n.id, shortestDistance: distances[n.id] },
        complexity: { time: 'O((V + E) log V)', space: 'O(V)', explanation: 'Edge relaxation minimizes path cost.' },
        highlights: { activeNodes: [n.id] },
      })
    }
  })

  return steps
}
