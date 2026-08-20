import { useState } from 'react'
import { LANGUAGE_METADATA, type SupportedLanguage } from '../../data/dsaCodeSnippets'

interface CodePanelProps {
  language: SupportedLanguage
  code: string
  activeLine?: number
  variables?: Record<string, string | number | boolean>
}

export function CodePanel({ language, code, activeLine = 1, variables = {} }: CodePanelProps) {
  const [copied, setCopied] = useState(false)
  const meta = LANGUAGE_METADATA[language] || { ext: 'txt', icon: '💻', color: '#6366f1' }

  const handleCopy = () => {
    navigator.clipboard?.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  const lines = code.split('\n')
  const hasVariables = Object.keys(variables).length > 0

  return (
    <div
      style={{
        height: '100%',
        background: 'var(--c-surface)',
        color: 'var(--c-text-1)',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        fontFamily: 'JetBrains Mono, monospace',
        transition: 'background 0.3s ease, color 0.3s ease',
      }}
    >
      {/* Debugger Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 16px',
          background: 'var(--c-surface-2)',
          borderBottom: '1px solid var(--c-border-med)',
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ display: 'flex', gap: '5px' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f43f5e', opacity: 0.8 }} />
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b', opacity: 0.8 }} />
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981', opacity: 0.8 }} />
          </div>
          <span style={{ fontSize: '12px', color: 'var(--c-text-2)', fontWeight: '600' }}>
            {meta.icon} solution.{meta.ext}
          </span>
          <span
            style={{
              fontSize: '10px',
              color: '#0284c7',
              background: 'rgba(2,132,199,0.12)',
              border: '1px solid rgba(2,132,199,0.3)',
              padding: '1px 6px',
              borderRadius: '4px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              fontWeight: '700',
            }}
          >
            Line Debugger Active
          </span>
        </div>

        <button
          onClick={handleCopy}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            background: copied ? 'rgba(16,185,129,0.15)' : 'var(--c-input)',
            border: `1px solid ${copied ? 'rgba(16,185,129,0.3)' : 'var(--c-input-border)'}`,
            borderRadius: '6px',
            color: copied ? '#10b981' : 'var(--c-text-2)',
            cursor: 'pointer',
            fontSize: '11px',
            padding: '4px 10px',
            fontFamily: 'Inter, sans-serif',
            fontWeight: '600',
            transition: 'all 0.2s',
          }}
        >
          {copied ? '✓ Copied' : '⎘ Copy Code'}
        </button>
      </div>

      {/* Main Code View + Live Variable Inspector Panel */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Code Lines Container */}
        <div style={{ flex: 1, overflow: 'auto', padding: '12px 0' }}>
          {lines.map((lineText, idx) => {
            const lineNo = idx + 1
            const isCurrent = lineNo === activeLine

            return (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '2px 16px',
                  background: isCurrent ? 'rgba(99,102,241,0.15)' : 'transparent',
                  borderLeft: isCurrent ? '3px solid #6366f1' : '3px solid transparent',
                  transition: 'all 0.15s ease',
                }}
              >
                {/* Line Number */}
                <span
                  style={{
                    width: '28px',
                    fontSize: '11px',
                    color: isCurrent ? '#6366f1' : 'var(--c-text-4)',
                    textAlign: 'right',
                    marginRight: '16px',
                    userSelect: 'none',
                    fontWeight: isCurrent ? '700' : '500',
                  }}
                >
                  {lineNo}
                </span>

                {/* Line Text */}
                <span
                  style={{
                    fontSize: '12.5px',
                    lineHeight: '1.65',
                    color: isCurrent ? 'var(--c-text-1)' : 'var(--c-text-2)',
                    whiteSpace: 'pre',
                    fontWeight: isCurrent ? '600' : '400',
                  }}
                >
                  {lineText || ' '}
                </span>
              </div>
            )
          })}
        </div>

        {/* Live Variable Inspector Panel */}
        {hasVariables && (
          <div
            style={{
              width: '200px',
              borderLeft: '1px solid var(--c-border-med)',
              background: 'var(--c-surface-2)',
              padding: '12px',
              overflowY: 'auto',
              flexShrink: 0,
            }}
          >
            <div
              style={{
                fontSize: '10px',
                fontWeight: '700',
                color: '#0284c7',
                letterSpacing: '1px',
                textTransform: 'uppercase',
                marginBottom: '8px',
              }}
            >
              Variables
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {Object.entries(variables).map(([k, v]) => (
                <div
                  key={k}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: 'var(--c-card-2)',
                    border: '1px solid var(--c-border)',
                    borderRadius: '6px',
                    padding: '4px 8px',
                    fontSize: '11px',
                  }}
                >
                  <span style={{ color: 'var(--c-text-2)', fontWeight: '500' }}>{k}</span>
                  <span style={{ color: '#d97706', fontWeight: '700', fontFamily: 'JetBrains Mono, monospace' }}>{String(v)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
