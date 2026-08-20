import { type ReactNode } from 'react'

interface InputPanelProps {
  title?: string
  label?: string      // alias for title, for backwards compat
  value: string
  onChange: (val: string) => void
  placeholder?: string
  onRandomize?: () => void
  onClear?: () => void
  onPaste?: () => void
  quickExamples?: Array<{ label: string; value: string }>
  onSelectExample?: (val: string) => void
  validationError?: string
  children?: ReactNode
}

export function InputPanel({
  title,
  label,
  value,
  onChange,
  placeholder = 'e.g. 5, 8, 2, 10, 7, 3',
  onRandomize,
  onClear,
  onPaste,
  quickExamples = [
    { label: 'Example 1', value: '5, 8, 2, 10, 7, 3' },
    { label: 'Example 2', value: '12, 45, 89, 34, 67' },
    { label: 'Example 3', value: '1, 2, 3, 4, 5, 6, 7' },
  ],
  onSelectExample,
  validationError,
  children,
}: InputPanelProps) {
  const displayTitle = label || title || 'Input Panel'
  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText()
      if (text) onChange(text)
    } catch {}
    if (onPaste) onPaste()
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        width: '100%',
        background: 'var(--c-card)',
        border: '1px solid var(--c-border)',
        borderRadius: '10px',
        padding: '10px 14px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span
          style={{
            fontSize: '11px',
            fontWeight: '700',
            color: 'var(--c-text-2)',
            textTransform: 'uppercase',
            letterSpacing: '0.8px',
          }}
        >
          {displayTitle}
        </span>
        {validationError && (
          <span style={{ fontSize: '11px', color: '#f43f5e', fontWeight: '600' }}>
            ⚠️ {validationError}
          </span>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          style={{
            flex: 1,
            minWidth: '220px',
            padding: '7px 12px',
            background: 'var(--c-input)',
            border: validationError ? '1px solid #f43f5e' : '1px solid var(--c-input-border)',
            borderRadius: '8px',
            color: 'var(--c-text-1)',
            fontSize: '13px',
            fontFamily: 'JetBrains Mono, monospace',
            outline: 'none',
          }}
        />

        {onRandomize && (
          <button
            onClick={onRandomize}
            style={{
              padding: '7px 12px',
              background: 'var(--c-card-2)',
              border: '1px solid var(--c-border-med)',
              borderRadius: '8px',
              color: 'var(--c-text-1)',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            🎲 Random
          </button>
        )}

        <button
          onClick={handlePaste}
          style={{
            padding: '7px 10px',
            background: 'var(--c-card)',
            border: '1px solid var(--c-border)',
            borderRadius: '8px',
            color: 'var(--c-text-3)',
            fontSize: '12px',
            cursor: 'pointer',
            fontFamily: 'Inter, sans-serif',
          }}
        >
          📋 Paste
        </button>

        {onClear && (
          <button
            onClick={onClear}
            style={{
              padding: '7px 10px',
              background: 'var(--c-card)',
              border: '1px solid var(--c-border)',
              borderRadius: '8px',
              color: 'var(--c-text-3)',
              fontSize: '12px',
              cursor: 'pointer',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            🧹 Clear
          </button>
        )}
      </div>

      {/* Quick Example Chips */}
      {quickExamples.length > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', marginTop: '2px' }}>
          <span style={{ fontSize: '10px', color: 'var(--c-text-4)', fontWeight: '600' }}>Presets:</span>
          {quickExamples.map((ex) => (
            <button
              key={ex.label}
              onClick={() => {
                onChange(ex.value)
                if (onSelectExample) onSelectExample(ex.value)
              }}
              style={{
                padding: '3px 8px',
                background: 'var(--c-card-2)',
                border: '1px solid var(--c-border)',
                borderRadius: '100px',
                color: 'var(--c-text-3)',
                fontSize: '11px',
                cursor: 'pointer',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              {ex.label}
            </button>
          ))}
        </div>
      )}

      {children}
    </div>
  )
}
