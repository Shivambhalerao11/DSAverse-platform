interface DPVisualizerProps {
  grid: number[][]
  activeCell?: [number, number]
  accentColor?: string
}

export function DPVisualizer({
  grid,
  activeCell,
  accentColor = '#06b6d4',
}: DPVisualizerProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px',
        padding: '24px',
        width: '100%',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          background: 'var(--c-surface)',
          border: '1px solid var(--c-border-med)',
          borderRadius: '12px',
          padding: '12px',
        }}
      >
        {grid.map((row, rIdx) => (
          <div key={rIdx} style={{ display: 'flex', gap: '6px' }}>
            {row.map((val, cIdx) => {
              const isActive = activeCell && activeCell[0] === rIdx && activeCell[1] === cIdx

              return (
                <div
                  key={cIdx}
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '8px',
                    background: isActive ? `${accentColor}30` : 'var(--c-card)',
                    border: `1px solid ${isActive ? accentColor : 'var(--c-border)'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: '14px',
                    fontWeight: '700',
                    color: isActive ? accentColor : 'var(--c-text-1)',
                    boxShadow: isActive ? `0 0 16px ${accentColor}60` : 'none',
                    transition: 'all 0.25s ease',
                  }}
                >
                  {val}
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}
