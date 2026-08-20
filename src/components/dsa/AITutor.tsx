import { useState, useEffect, useRef } from 'react'
import { getAIProvider, getAIProviderName } from '../../services/ai/AIFactory'
import { type AIContext } from '../../services/ai/AIProvider'

interface Message { role: 'user' | 'ai'; text: string; error?: boolean }

interface AITutorProps {
  topicName: string
  accentColor?: string
  currentOperation?: string
  codeSnippet?: string
  currentStepTitle?: string
  currentStepDesc?: string
  variables?: Record<string, string | number | boolean>
}

const SUGGESTED_PROMPTS = (topic: string) => [
  `Explain ${topic} in simple terms`,
  `Common interview questions for ${topic}`,
  `Why did we take this step?`,
  `What's the time complexity of this step?`,
]

const PROVIDER_LABELS: Record<string, { label: string; color: string; icon: string }> = {
  openai:  { label: 'GPT-4o-mini', color: '#10b981', icon: '🤖' },
  gemini:  { label: 'Gemini Flash', color: '#4285F4', icon: '✨' },
  mock:    { label: 'Offline AI Mode', color: '#94a3b8', icon: '💡' },
}

export function AITutor({
  topicName,
  accentColor = '#6366f1',
  currentOperation,
  codeSnippet,
  currentStepTitle,
  currentStepDesc,
  variables,
}: AITutorProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'ai',
      text: `Hello! I'm your AI Tutor for **${topicName}**. I am synced live with your current step snapshot (**${currentStepTitle || 'Step 1'}**). Ask me anything!`,
    },
  ])
  const [input, setInput]     = useState('')
  const [loading, setLoading] = useState(false)
  const [providerKey] = useState(getAIProviderName())
  const scrollRef = useRef<HTMLDivElement>(null)

  const providerMeta = PROVIDER_LABELS[providerKey] || PROVIDER_LABELS.mock

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, loading])

  const handleSend = async (textOverride?: string) => {
    const query = (textOverride || input).trim()
    if (!query || loading) return

    const userMsg: Message = { role: 'user', text: query }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setLoading(true)

    const context: AIContext = {
      topicName,
      currentOperation: currentStepTitle || currentOperation,
      codeSnippet,
      executionState: variables,
    }

    try {
      const provider = await getAIProvider()
      const reply = await provider.sendMessage(query, context)
      setMessages((prev) => [...prev, { role: 'ai', text: reply }])
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An error occurred'
      setMessages((prev) => [
        ...prev,
        {
          role: 'ai',
          text: `⚠️ ${message}. Operating in fallback mode.`,
          error: true,
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const renderText = (text: string) => {
    const parts = text.split(/(\*\*[^*]+\*\*)/)
    return parts.map((part, i) =>
      part.startsWith('**') && part.endsWith('**')
        ? <strong key={i} style={{ color: 'var(--c-text-1)', fontWeight: '700' }}>{part.slice(2, -2)}</strong>
        : <span key={i}>{part}</span>
    )
  }

  return (
    <div style={{ padding: '16px 20px', height: '100%', display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '16px' }}>🤖</span>
          <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--c-text-1)' }}>
            AI Learning Assistant
          </span>
        </div>
        <div
          style={{
            display: 'flex', alignItems: 'center', gap: '5px',
            padding: '3px 8px', borderRadius: '100px',
            background: 'var(--c-card)', border: '1px solid var(--c-border)',
            fontSize: '11px', fontWeight: '600', color: providerMeta.color,
          }}
        >
          <span>{providerMeta.icon}</span>
          <span>{providerMeta.label}</span>
        </div>
      </div>

      <div
        ref={scrollRef}
        style={{
          flex: 1, overflowY: 'auto', display: 'flex',
          flexDirection: 'column', gap: '10px', paddingRight: '4px', minHeight: 0,
        }}
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
            }}
          >
            <div
              style={{
                maxWidth: '85%',
                padding: '10px 14px',
                borderRadius: msg.role === 'user' ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                background: msg.role === 'user' ? accentColor : msg.error ? 'rgba(244,63,94,0.12)' : 'var(--c-card-2)',
                border: msg.error ? '1px solid rgba(244,63,94,0.3)' : '1px solid var(--c-border-med)',
                color: msg.role === 'user' ? '#fff' : 'var(--c-text-2)',
                fontSize: '13px', lineHeight: '1.5', fontFamily: 'Inter, sans-serif',
              }}
            >
              {renderText(msg.text)}
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ display: 'flex', gap: '4px', padding: '10px 14px', borderRadius: '14px', background: 'var(--c-card-2)', width: 'fit-content' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: accentColor, animation: 'pulse 1s infinite 0s' }} />
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: accentColor, animation: 'pulse 1s infinite 0.2s' }} />
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: accentColor, animation: 'pulse 1s infinite 0.4s' }} />
          </div>
        )}
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', flexShrink: 0 }}>
        {SUGGESTED_PROMPTS(topicName).map((p, i) => (
          <button
            key={i}
            onClick={() => handleSend(p)}
            disabled={loading}
            style={{
              padding: '4px 10px', borderRadius: '100px',
              background: 'var(--c-card)', border: '1px solid var(--c-border)',
              color: 'var(--c-text-3)', fontSize: '11.5px', cursor: 'pointer',
              transition: 'all 0.15s', opacity: loading ? 0.6 : 1,
            }}
          >
            {p}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={`Ask about ${topicName}...`}
          disabled={loading}
          style={{
            flex: 1, padding: '10px 14px', borderRadius: '10px',
            background: 'var(--c-card)', border: '1px solid var(--c-border-med)',
            color: 'var(--c-text-1)', fontSize: '13px', outline: 'none',
            fontFamily: 'Inter, sans-serif',
          }}
        />
        <button
          onClick={() => handleSend()}
          disabled={loading || !input.trim()}
          style={{
            padding: '10px 16px', borderRadius: '10px', background: accentColor,
            border: 'none', color: '#fff', fontWeight: '600', fontSize: '13px',
            cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
            opacity: loading || !input.trim() ? 0.6 : 1,
          }}
        >
          Send
        </button>
      </div>
    </div>
  )
}
