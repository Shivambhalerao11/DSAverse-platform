interface ComplexityCardProps {
  time: string
  space: string
  description?: string
  tips?: string[]
  accentColor?: string
}

export function ComplexityCard({
  time,
  space,
  description,
  tips = [],
  accentColor = '#22d3ee',
}: ComplexityCardProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {/* Big-O Badges */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
        <div
          style={{
            background: 'var(--c-card)',
            border: '1px solid var(--c-border)',
            borderRadius: '10px',
            padding: '10px',
          }}
        >
          <div
            style={{
              fontSize: '9px',
              color: 'var(--c-text-4)',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '0.8px',
              marginBottom: '4px',
            }}
          >
            Time Complexity
          </div>
          <div
            style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '13px',
              fontWeight: '700',
              color: accentColor,
            }}
          >
            {time}
          </div>
        </div>

        <div
          style={{
            background: 'var(--c-card)',
            border: '1px solid var(--c-border)',
            borderRadius: '10px',
            padding: '10px',
          }}
        >
          <div
            style={{
              fontSize: '9px',
              color: 'var(--c-text-4)',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '0.8px',
              marginBottom: '4px',
            }}
          >
            Space Complexity
          </div>
          <div
            style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '13px',
              fontWeight: '700',
              color: '#10b981',
            }}
          >
            {space}
          </div>
        </div>
      </div>

      {/* Description */}
      {description && (
        <div
          style={{
            background: 'var(--c-card)',
            border: '1px solid var(--c-border)',
            borderRadius: '10px',
            padding: '10px 12px',
          }}
        >
          <div
            style={{
              fontSize: '9px',
              color: 'var(--c-text-4)',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '0.8px',
              marginBottom: '4px',
            }}
          >
            Algorithm Overview
          </div>
          <p style={{ fontSize: '12px', color: 'var(--c-text-2)', lineHeight: '1.65', margin: 0 }}>
            {description}
          </p>
        </div>
      )}

      {/* Pro Tips */}
      {tips.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {tips.map((tip, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                gap: '8px',
                padding: '8px 10px',
                background: 'rgba(245,158,11,0.06)',
                border: '1px solid rgba(245,158,11,0.18)',
                borderRadius: '8px',
                fontSize: '11.5px',
                color: 'var(--c-text-3)',
                lineHeight: '1.55',
              }}
            >
              <span style={{ flexShrink: 0 }}>💡</span>
              <span>{tip}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
