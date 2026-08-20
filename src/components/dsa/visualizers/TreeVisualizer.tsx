interface TreeVisualizerProps {
  nodes: number[]
  activeValue?: number
  accentColor?: string
}

interface RenderNode {
  val: number
  x: number
  y: number
  left?: RenderNode
  right?: RenderNode
}

export function TreeVisualizer({
  nodes,
  activeValue,
  accentColor = '#10b981',
}: TreeVisualizerProps) {
  if (nodes.length === 0) {
    return (
      <div style={{ padding: '24px', color: 'var(--c-text-4)', fontSize: '13px', fontWeight: '600' }}>
        Tree is empty. Insert nodes to construct binary tree.
      </div>
    )
  }

  // Calculate binary tree level positions
  const renderNodes: Array<{ val: number; x: number; y: number; px?: number; py?: number }> = []
  const levels = Math.ceil(Math.log2(nodes.length + 1))
  const width = 600
  const height = Math.max(220, levels * 70)

  nodes.forEach((val, idx) => {
    const level = Math.floor(Math.log2(idx + 1))
    const levelCount = Math.pow(2, level)
    const posInLevel = idx - (levelCount - 1)
    const x = ((posInLevel + 0.5) / levelCount) * width
    const y = level * 65 + 40

    let px: number | undefined
    let py: number | undefined
    if (idx > 0) {
      const parentIdx = Math.floor((idx - 1) / 2)
      const parentLevel = Math.floor(Math.log2(parentIdx + 1))
      const parentLevelCount = Math.pow(2, parentLevel)
      const parentPos = parentIdx - (parentLevelCount - 1)
      px = ((parentPos + 0.5) / parentLevelCount) * width
      py = parentLevel * 65 + 40
    }

    renderNodes.push({ val, x, y, px, py })
  })

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        padding: '16px',
        overflow: 'auto',
      }}
    >
      <svg width={width} height={height} style={{ overflow: 'visible' }}>
        {/* Render Tree Branch Lines */}
        {renderNodes.map((n, i) => {
          if (n.px !== undefined && n.py !== undefined) {
            return (
              <line
                key={`line-${i}`}
                x1={n.px}
                y1={n.py}
                x2={n.x}
                y2={n.y}
                stroke="var(--c-border-med)"
                strokeWidth="2"
              />
            )
          }
          return null
        })}

        {/* Render Tree Nodes */}
        {renderNodes.map((n, i) => {
          const isActive = n.val === activeValue
          return (
            <g key={`node-${i}`} transform={`translate(${n.x}, ${n.y})`}>
              <circle
                r="22"
                fill={isActive ? `${accentColor}30` : 'var(--c-surface)'}
                stroke={isActive ? accentColor : 'var(--c-border-med)'}
                strokeWidth={isActive ? '3' : '2'}
                style={{ transition: 'all 0.25s ease' }}
              />
              <text
                textAnchor="middle"
                dy="5"
                fontFamily="JetBrains Mono, monospace"
                fontSize="14px"
                fontWeight="700"
                fill={isActive ? accentColor : 'var(--c-text-1)'}
              >
                {n.val}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}
