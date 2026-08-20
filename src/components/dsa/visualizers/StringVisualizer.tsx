interface StringVisualizerProps {
  text: string
  pattern?: string
  activeIndices?: number[]
  matchIndices?: number[]
  windowRange?: [number, number]
  accentColor?: string
}

export function StringVisualizer({
  text,
  pattern,
  activeIndices = [],
  matchIndices = [],
  windowRange,
  accentColor = '#22d3ee',
}: StringVisualizerProps) {
  const chars = text.split('')

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '24px',
        width: '100%',
        padding: '24px',
      }}
    >
      {/* String Character Blocks */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center', position: 'relative' }}>
        {chars.map((char, idx) => {
          const isActive = activeIndices.includes(idx)
          const isMatch = matchIndices.includes(idx)
          const inWindow = windowRange && idx >= windowRange[0] && idx <= windowRange[1]

          let bg = 'var(--c-surface)'
          let border = 'var(--c-border-med)'
          let color = 'var(--c-text-1)'

          if (isMatch) {
            bg = 'rgba(16,185,129,0.18)'
            border = '#10b981'
            color = '#10b981'
          } else if (isActive) {
            bg = `${accentColor}20`
            border = accentColor
            color = accentColor
          } else if (inWindow) {
            bg = 'rgba(245,158,11,0.18)'
            border = '#f59e0b'
            color = '#f59e0b'
          }

          return (
            <div
              key={idx}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <div
                style={{
                  width: '46px',
                  height: '52px',
                  borderRadius: '10px',
                  background: bg,
                  border: `2px solid ${border}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '18px',
                  fontWeight: '700',
                  color: color,
                  transition: 'all 0.25s ease',
                }}
              >
                {char === ' ' ? '␣' : char}
              </div>
              <span
                style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '11px',
                  color: 'var(--c-text-4)',
                }}
              >
                {idx}
              </span>
            </div>
          )
        })}
      </div>

      {pattern && (
        <div style={{ fontSize: '13px', color: 'var(--c-text-3)', fontFamily: 'JetBrains Mono, monospace' }}>
          Searching Pattern: <span style={{ color: accentColor, fontWeight: '700' }}>"{pattern}"</span>
        </div>
      )}
    </div>
  )
}
