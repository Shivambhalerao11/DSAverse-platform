interface ArrayVisualizerProps {
  elements: number[]
  activeIndices?: number[]
  compareIndices?: number[]
  swapIndices?: number[]
  foundIndex?: number
  accentColor?: string
}

export function ArrayVisualizer({
  elements,
  activeIndices = [],
  compareIndices = [],
  swapIndices = [],
  foundIndex,
  accentColor = '#6366f1',
}: ArrayVisualizerProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '24px',
        width: '100%',
        padding: '20px',
      }}
    >
      {/* Array Blocks */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
        {elements.map((val, idx) => {
          const isActive = activeIndices.includes(idx)
          const isComparing = compareIndices.includes(idx)
          const isSwapping = swapIndices.includes(idx)
          const isFound = foundIndex === idx

          let bg = 'var(--c-surface)'
          let borderColor = 'var(--c-border-med)'
          let textColor = 'var(--c-text-1)'
          let glow = 'none'

          if (isFound) {
            bg = 'rgba(34,211,238,0.18)'
            borderColor = '#22d3ee'
            textColor = '#22d3ee'
            glow = '0 0 20px rgba(34,211,238,0.4)'
          } else if (isSwapping) {
            bg = 'rgba(244,63,94,0.18)'
            borderColor = '#f43f5e'
            textColor = '#f43f5e'
            glow = '0 0 20px rgba(244,63,94,0.4)'
          } else if (isComparing) {
            bg = 'rgba(245,158,11,0.18)'
            borderColor = '#f59e0b'
            textColor = '#f59e0b'
            glow = '0 0 20px rgba(245,158,11,0.4)'
          } else if (isActive) {
            bg = `${accentColor}20`
            borderColor = accentColor
            textColor = accentColor
            glow = `0 0 20px ${accentColor}40`
          }

          const memoryAddress = `0x${(1000 + idx * 4).toString(16).toUpperCase()}`

          return (
            <div
              key={idx}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                transform: isSwapping ? 'translateY(-8px) scale(1.08)' : 'translateY(0) scale(1)',
              }}
            >
              {/* Memory Address Tag */}
              <span
                style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '9px',
                  color: 'var(--c-text-5)',
                  letterSpacing: '0.5px',
                }}
              >
                {memoryAddress}
              </span>

              {/* Element Card */}
              <div
                style={{
                  width: '58px',
                  height: '64px',
                  borderRadius: '12px',
                  background: bg,
                  border: `2px solid ${borderColor}`,
                  boxShadow: glow,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '18px',
                  fontWeight: '700',
                  color: textColor,
                  transition: 'all 0.25s ease',
                }}
              >
                {val}
              </div>

              {/* Index Tag */}
              <span
                style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '11px',
                  fontWeight: '600',
                  color: isActive || isFound ? accentColor : 'var(--c-text-4)',
                }}
              >
                [{idx}]
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
