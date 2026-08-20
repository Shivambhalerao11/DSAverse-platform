/**
 * Mock AI Provider
 * Used when no API key is configured (VITE_AI_PROVIDER=mock or unset).
 * Provides intelligent, topic-aware responses without any API call.
 * This keeps the AI Tutor UI fully functional in offline/dev mode.
 */

import { type AIProvider, type AIContext } from './AIProvider'

interface MockResponse {
  keywords: string[]
  response: (topic: string, op?: string) => string
}

const RESPONSE_PATTERNS: MockResponse[] = [
  {
    keywords: ['interview', 'question', 'leetcode', 'problem', 'common'],
    response: (topic) =>
      `Common interview questions for **${topic}** focus on: (1) edge cases — empty input, single element, overflow; (2) in-place vs extra space tradeoffs; (3) improving brute-force O(n²) solutions to O(n log n) or O(n). Classic problems include reversing, two-pointer patterns, and sliding window variants.`,
  },
  {
    keywords: ['time', 'complexity', 'big o', 'o(n)', 'performance', 'fast', 'slow'],
    response: (topic, op) =>
      `For **${topic}** — ${op ? `the ${op} operation is` : 'basic operations are'} typically O(1) for access (if index-based), O(n) for linear search/traversal, and O(n²) for naive nested algorithms. Optimal implementations often achieve O(n log n) or O(log n) using divide-and-conquer or balanced tree properties.`,
  },
  {
    keywords: ['space', 'memory', 'auxiliary', 'in-place'],
    response: (topic) =>
      `**${topic}** space complexity depends on the approach. In-place algorithms use O(1) auxiliary space by modifying the input directly. Recursive implementations typically use O(h) stack space where h is recursion depth. Memoization and tabulation for DP use O(n) to O(n²) depending on state dimensions.`,
  },
  {
    keywords: ['simple', 'explain', 'what is', 'how does', 'basic', 'beginner', 'understand'],
    response: (topic) =>
      `**${topic}** is a fundamental data structure or algorithm technique. Think of it intuitively: it organizes data in a way that makes specific operations faster or more natural. The key insight is that by constraining *how* data is added/removed, you gain predictability and efficiency that general-purpose structures can't offer.`,
  },
  {
    keywords: ['avoid', 'when not', 'disadvantage', 'weakness', 'limitation', 'downside'],
    response: (topic) =>
      `Avoid **${topic}** when: (1) your access pattern doesn't match its strengths — e.g., avoid arrays for frequent insertions at arbitrary positions; (2) memory is constrained and overhead matters; (3) you need a different traversal order. Always choose the data structure that matches your most frequent operation.`,
  },
  {
    keywords: ['real world', 'use case', 'application', 'where', 'used', 'example'],
    response: (topic) =>
      `**${topic}** is used everywhere in production systems: stacks power undo/redo in editors and call stacks in runtimes; queues handle task scheduling, BFS, and message brokers; trees organize file systems and database indexes; graphs model networks, routing, and social connections. Every major system you use relies on these structures.`,
  },
  {
    keywords: ['code', 'implement', 'write', 'python', 'javascript', 'java', 'c++', 'how to'],
    response: (topic) =>
      `To implement **${topic}**: start with the simplest correct version, then optimize. Identify the invariant your structure must maintain, then write operations that preserve it. For interviews, always clarify assumptions first, handle empty/null inputs, then walk through your logic before coding.`,
  },
]

export class MockProvider implements AIProvider {
  readonly name = 'Mock (Offline)'

  async sendMessage(prompt: string, context: AIContext): Promise<string> {
    // Simulate network latency
    await new Promise<void>((r) => setTimeout(r, 400 + Math.random() * 300))

    const q = prompt.toLowerCase()
    const { topicName, currentOperation } = context

    // Match against known patterns
    for (const pattern of RESPONSE_PATTERNS) {
      if (pattern.keywords.some((kw) => q.includes(kw))) {
        return pattern.response(topicName, currentOperation)
      }
    }

    // Generic fallback
    return (
      `Great question about **${topicName}**! ` +
      `This is a core computer science concept that appears in almost every technical interview and system design discussion. ` +
      `To get a real AI answer, set \`VITE_AI_PROVIDER=openai\` or \`VITE_AI_PROVIDER=gemini\` ` +
      `with the matching API key in your \`.env\` file.`
    )
  }
}
