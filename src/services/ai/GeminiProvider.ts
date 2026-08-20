import { type AIProvider, type AIContext } from './AIProvider'

export class GeminiProvider implements AIProvider {
  name = 'Gemini'
  private apiKey: string

  constructor(apiKey?: string) {
    this.apiKey = apiKey || import.meta.env.VITE_GEMINI_API_KEY || ''
  }

  async sendMessage(prompt: string, context: AIContext): Promise<string> {
    if (!this.apiKey) {
      throw new Error('Gemini API Key not configured in VITE_GEMINI_API_KEY')
    }

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `You are a Senior CS Professor tutoring on ${context.topicName}.\nUser Question: ${prompt}`,
              },
            ],
          },
        ],
      }),
    })

    if (!res.ok) {
      throw new Error(`Gemini API HTTP Error: ${res.statusText}`)
    }

    const data = await res.json()
    return data.candidates[0]?.content?.parts[0]?.text || 'No response received from Gemini.'
  }
}
