interface SortSearchVisualizerProps {
  values: number[]
  compareIndices?: number[]
  swapIndices?: number[]
  pivotIndex?: number
  sortedIndices?: number[]
  foundIndex?: number
  accentColor?: string
}

export function SortSearchVisualizer({
  values,
  compareIndices = [],
  swapIndices = [],
  pivotIndex,
  sortedIndices = [],
  foundIndex,
  accentColor = '#f59e0b',
}: SortSearchVisualizerProps) {
  const maxVal = Math.max(...values, 1)

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        gap: '10px',
        width: '100%',
        height: '260px',
        padding: '24px',
      }}
    >
      {values.map((val, idx) => {
        const heightPct = Math.max((val / maxVal) * 100, 15)
        const isComparing = compareIndices.includes(idx)
        const isSwapping = swapIndices.includes(idx)
        const isPivot = idx === pivotIndex
        const isSorted = sortedIndices.includes(idx)
        const isFound = idx === foundIndex

        let bg = `${accentColor}40`
        let border = accentColor
        let color = 'var(--c-text-1)'

        if (isFound) {
          bg = '#22d3ee'
          border = '#06b6d4'
          color = '#000'
        } else if (isSwapping) {
          bg = '#f43f5e'
          border = '#e11d48'
        } else if (isComparing) {
          bg = '#f59e0b'
          border = '#d97706'
        } else if (isPivot) {
          bg = '#a855f7'
          border = '#9333ea'
        } else if (isSorted) {
          bg = '#10b981'
          border = '#059669'
        }

        return (
          <div
            key={idx}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '6px',
              flex: 1,
              maxWidth: '48px',
              height: '100%',
              justifyContent: 'flex-end',
            }}
          >
            <span
              style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '11px',
                fontWeight: '700',
                color: color,
              }}
            >
              {val}
            </span>
            <div
              style={{
                width: '100%',
                height: `${heightPct}%`,
                background: bg,
                border: `1px solid ${border}`,
                borderRadius: '6px 6px 0 0',
                transition: 'all 0.25s ease',
              }}
            />
            <span
              style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '10px',
                color: 'var(--c-text-5)',
              }}
            >
              {idx}
            </span>
          </div>
        )
      })}
    </div>
  )
}
