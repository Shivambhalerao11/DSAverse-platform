// Cross-Role Teacher & Student Sync Service for DSAVerse

export interface Assignment {
  id: string
  title: string
  module: string
  dueDate: string
  totalPoints: number
  description: string
  completed?: boolean
  submittedAt?: string
}

const ASSIGNMENTS_KEY = 'dsaverse-assignments-db'

const DEFAULT_ASSIGNMENTS: Assignment[] = [
  {
    id: 'asg-1',
    title: 'Array In-Place Reversal Challenge',
    module: 'array',
    dueDate: '2026-08-15',
    totalPoints: 100,
    description: 'Implement two-pointer in-place array reversal in under O(N) time.',
    completed: false,
  },
  {
    id: 'asg-2',
    title: 'Binary Search Tree Balancing',
    module: 'trees',
    dueDate: '2026-08-20',
    totalPoints: 150,
    description: 'Balance an unbalanced BST using AVL tree rotations.',
    completed: false,
  },
]

export function getAssignments(): Assignment[] {
  try {
    const raw = localStorage.getItem(ASSIGNMENTS_KEY)
    return raw ? JSON.parse(raw) : DEFAULT_ASSIGNMENTS
  } catch {
    return DEFAULT_ASSIGNMENTS
  }
}

export function createAssignment(assignment: Omit<Assignment, 'id'>): Assignment {
  const current = getAssignments()
  const newAsg: Assignment = {
    ...assignment,
    id: `asg-${Date.now()}`,
    completed: false,
  }
  const updated = [newAsg, ...current]
  localStorage.setItem(ASSIGNMENTS_KEY, JSON.stringify(updated))
  window.dispatchEvent(new Event('dsaverse-assignments-updated'))
  return newAsg
}

export function submitAssignment(assignmentId: string): Assignment | undefined {
  const current = getAssignments()
  const target = current.find((a) => a.id === assignmentId)
  if (target) {
    target.completed = true
    target.submittedAt = new Date().toISOString()
    localStorage.setItem(ASSIGNMENTS_KEY, JSON.stringify(current))
    window.dispatchEvent(new Event('dsaverse-assignments-updated'))
  }
  return target
}
