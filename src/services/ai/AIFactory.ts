/**
 * AI Provider Factory
 *
 * Selects the AI provider based on VITE_AI_PROVIDER env variable.
 * Falls back gracefully when keys are missing — never crashes the app.
 *
 * Usage:
 *   VITE_AI_PROVIDER=openai   →  Uses OpenAI GPT-4o-mini
 *   VITE_AI_PROVIDER=gemini   →  Uses Google Gemini 1.5 Flash
 *   VITE_AI_PROVIDER=mock     →  Uses offline mock (default)
 *   (unset)                   →  Uses offline mock
 */

import { type AIProvider } from './AIProvider'
import { MockProvider }    from './MockProvider'

// Lazily loaded to avoid bundling unused SDKs
async function loadOpenAI(): Promise<AIProvider> {
  const { OpenAIProvider } = await import('./OpenAIProvider')
  const key = import.meta.env.VITE_OPENAI_API_KEY
  if (!key) {
    console.warn(
      '[DSAverse AI] VITE_OPENAI_API_KEY is not set. ' +
      'Falling back to mock provider. Set the key in .env to enable OpenAI.'
    )
    return new MockProvider()
  }
  return new OpenAIProvider(key)
}

async function loadGemini(): Promise<AIProvider> {
  const { GeminiProvider } = await import('./GeminiProvider')
  const key = import.meta.env.VITE_GEMINI_API_KEY
  if (!key) {
    console.warn(
      '[DSAverse AI] VITE_GEMINI_API_KEY is not set. ' +
      'Falling back to mock provider. Set the key in .env to enable Gemini.'
    )
    return new MockProvider()
  }
  return new GeminiProvider(key)
}

let _cachedProvider: AIProvider | null = null

/** Returns the configured AI provider (cached after first call). */
export async function getAIProvider(): Promise<AIProvider> {
  if (_cachedProvider) return _cachedProvider

  const providerType = (import.meta.env.VITE_AI_PROVIDER || 'mock').toLowerCase().trim()

  switch (providerType) {
    case 'openai':
      _cachedProvider = await loadOpenAI()
      break
    case 'gemini':
      _cachedProvider = await loadGemini()
      break
    case 'mock':
    default:
      if (providerType !== 'mock') {
        console.warn(
          `[DSAverse AI] Unknown VITE_AI_PROVIDER="${providerType}". ` +
          'Valid values: openai | gemini | mock. Falling back to mock.'
        )
      }
      _cachedProvider = new MockProvider()
  }

  return _cachedProvider
}

/** Returns the configured provider name without instantiating it. */
export function getAIProviderName(): string {
  return (import.meta.env.VITE_AI_PROVIDER || 'mock').toLowerCase()
}

/** Resets the cached provider — useful for testing / hot reload. */
export function resetAIProvider(): void {
  _cachedProvider = null
}
