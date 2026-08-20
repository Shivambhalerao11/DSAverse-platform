// Shared Algorithm Step & Complexity Contract for DSAVerse

export interface ComplexityInfo {
  time: string // e.g. "O(1)", "O(N)", "O(N^2)", "O(log N)"
  space: string // e.g. "O(1)", "O(N)"
  explanation: string // Dynamic reason for current step/input state
}

export interface HighlightMetadata {
  activeIndices?: number[]
  compareIndices?: number[]
  swapIndices?: number[]
  foundIndex?: number
  activeNodes?: (string | number)[]
  activeEdges?: [string | number, string | number][]
  codeLine?: number // Line number in code editor to highlight
}

export interface AlgorithmStep<TState = any> {
  stepIndex: number
  description: string
  stateSnapshot: TState
  variables: Record<string, string | number | boolean>
  complexity: ComplexityInfo
  highlights: HighlightMetadata
}

export type StepGenerator<TInput, TOptions = any> = (
  input: TInput,
  options?: TOptions
) => AlgorithmStep[]
