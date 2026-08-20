import { useState } from 'react'

interface OutputPanelProps {
  logs: string[]
  accentColor?: string
}

export function OutputPanel({ logs, accentColor = '#6366f1' }: OutputPanelProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard?.writeText(logs.join('\n'))
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  const defaultLogs = logs.length > 0 ? logs : [
    '[SYSTEM] Algorithm Visualizer Initialized',
    '[EXEC] Ready for interactive execution',
    '[STATS] Memory Allocated: 1024 Bytes | Status: OK',
  ]

  return (
    <div
      style={{
        height: '100%',
        background: 'var(--c-surface)',
        color: 'var(--c-text-1)',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'JetBrains Mono, monospace',
        position: 'relative',
        transition: 'background 0.3s ease, color 0.3s ease',
      }}
    >
      {/* Terminal Header */}
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '13px' }}>📟</span>
          <span style={{ fontSize: '12px', color: 'var(--c-text-2)', fontWeight: '600' }}>
            Execution Console Output
          </span>
          <span
            style={{
              fontSize: '10px',
              color: '#10b981',
              background: 'rgba(16,185,129,0.12)',
              border: '1px solid rgba(16,185,129,0.3)',
              padding: '1px 6px',
              borderRadius: '4px',
              textTransform: 'uppercase',
              fontWeight: '700',
            }}
          >
            ACTIVE STDOUT
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
          {copied ? '✓ Copied Logs' : '⎘ Copy Logs'}
        </button>
      </div>

      {/* Terminal Output Log List */}
      <div style={{ flex: 1, overflow: 'auto', padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {defaultLogs.map((log, idx) => {
          const isError = log.includes('ERR') || log.includes('FAIL')
          const isSuccess = log.includes('SUCCESS') || log.includes('OK') || log.includes('Found')

          return (
            <div
              key={idx}
              style={{
                fontSize: '12px',
                lineHeight: '1.6',
                color: isError ? '#f43f5e' : isSuccess ? '#10b981' : 'var(--c-text-2)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span style={{ color: 'var(--c-text-4)', fontSize: '11px', userSelect: 'none' }}>
                {`[${(idx + 1).toString().padStart(2, '0')}]`}
              </span>
              <span>{log}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
