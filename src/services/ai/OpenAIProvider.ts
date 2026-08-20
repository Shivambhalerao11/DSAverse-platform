import { type AIProvider, type AIContext } from './AIProvider'

export class OpenAIProvider implements AIProvider {
  name = 'OpenAI'
  private apiKey: string

  constructor(apiKey?: string) {
    this.apiKey = apiKey || import.meta.env.VITE_OPENAI_API_KEY || ''
  }

  async sendMessage(prompt: string, context: AIContext): Promise<string> {
    if (!this.apiKey) {
      throw new Error('OpenAI API Key not configured in VITE_OPENAI_API_KEY')
    }

    const systemPrompt = `You are a Senior Computer Science Professor tutoring a student on ${context.topicName}. Provide clear, intuitive explanations, point out potential edge cases, and answer directly.`

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt },
        ],
        temperature: 0.7,
      }),
    })

    if (!res.ok) {
      throw new Error(`OpenAI API HTTP Error: ${res.statusText}`)
    }

    const data = await res.json()
    return data.choices[0]?.message?.content || 'No response received from OpenAI.'
  }
}
