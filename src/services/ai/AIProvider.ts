export interface AIContext {
  topicName: string
  currentOperation?: string
  codeSnippet?: string
  executionState?: Record<string, string | number | boolean>
}

export interface AIProvider {
  name: string
  sendMessage(prompt: string, context: AIContext): Promise<string>
}
