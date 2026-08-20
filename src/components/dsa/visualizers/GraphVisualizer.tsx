export interface GraphNode {
  id: string
  label: string
  x: number
  y: number
}

export interface GraphEdge {
  from: string
  to: string
  weight?: number
}

interface GraphVisualizerProps {
  nodes: GraphNode[]
  edges: GraphEdge[]
  activeNodeId?: string
  visitedNodeIds?: string[]
  activeEdge?: { from: string; to: string }
  accentColor?: string
}

export function GraphVisualizer({
  nodes,
  edges,
  activeNodeId,
  visitedNodeIds = [],
  activeEdge,
  accentColor = '#8b5cf6',
}: GraphVisualizerProps) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        minHeight: '340px',
        position: 'relative',
        background: 'var(--c-surface)',
        borderRadius: '16px',
        border: '1px solid var(--c-border)',
        overflow: 'hidden',
      }}
    >
      <svg style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}>
        {edges.map((e, idx) => {
          const fromNode = nodes.find((n) => n.id === e.from)
          const toNode = nodes.find((n) => n.id === e.to)
          if (!fromNode || !toNode) return null

          const isActive =
            activeEdge &&
            ((activeEdge.from === e.from && activeEdge.to === e.to) ||
              (activeEdge.from === e.to && activeEdge.to === e.from))

          return (
            <g key={idx}>
              <line
                x1={fromNode.x}
                y1={fromNode.y}
                x2={toNode.x}
                y2={toNode.y}
                stroke={isActive ? accentColor : 'var(--c-border-med)'}
                strokeWidth={isActive ? '3' : '2'}
                strokeDasharray={isActive ? '4 4' : 'none'}
              />
              {e.weight !== undefined && (
                <text
                  x={(fromNode.x + toNode.x) / 2}
                  y={(fromNode.y + toNode.y) / 2 - 6}
                  fill="var(--c-text-4)"
                  fontSize="11"
                  fontFamily="JetBrains Mono, monospace"
                  textAnchor="middle"
                >
                  {e.weight}
                </text>
              )}
            </g>
          )
        })}
      </svg>

      {/* Render Graph Nodes */}
      {nodes.map((n) => {
        const isActive = n.id === activeNodeId
        const isVisited = visitedNodeIds.includes(n.id)

        let bg = 'var(--c-card)'
        let border = 'var(--c-border-med)'
        let color = 'var(--c-text-1)'

        if (isActive) {
          bg = `${accentColor}30`
          border = accentColor
          color = accentColor
        } else if (isVisited) {
          bg = 'rgba(16,185,129,0.2)'
          border = '#10b981'
          color = '#10b981'
        }

        return (
          <div
            key={n.id}
            style={{
              position: 'absolute',
              left: n.x - 24,
              top: n.y - 24,
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: bg,
              border: `2px solid ${border}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'JetBrains Mono, monospace',
              fontWeight: '700',
              fontSize: '14px',
              color: color,
              boxShadow: isActive ? `0 0 24px ${accentColor}80` : 'none',
              transition: 'all 0.25s ease',
              zIndex: 10,
            }}
          >
            {n.label}
          </div>
        )
      })}
    </div>
  )
}
