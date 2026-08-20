import { type ReactNode } from 'react'

export interface OperationItem {
  id: string
  label: string
  icon: string
  color?: string
  shortcut?: string
  disabled?: boolean
  loading?: boolean
}

interface OperationPanelProps {
  title?: string
  operations?: OperationItem[]
  activeOpId?: string
  activeId?: string
  onSelectOp?: (id: string) => void
  onSelect?: (id: string) => void
  accentColor?: string
  children?: ReactNode
}

export function OperationPanel({
  title = 'Operations Toolbar',
  operations = [],
  activeOpId,
  activeId,
  onSelectOp,
  onSelect,
  accentColor,
  children,
}: OperationPanelProps) {
  const currentActiveId = activeOpId || activeId
  const handleSelect = onSelectOp || onSelect

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
      {title && (
        <div
          style={{
            fontSize: '9px',
            fontWeight: '700',
            color: 'var(--c-text-4)',
            letterSpacing: '1.2px',
            textTransform: 'uppercase',
            padding: '2px 0',
          }}
        >
          {title}
        </div>
      )}

      {operations.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {operations.map((op) => {
            const isActive = currentActiveId === op.id
            const color = op.color || accentColor || '#6366f1'
            return (
              <button
                key={op.id}
                onClick={() => handleSelect && !op.disabled && handleSelect(op.id)}
                disabled={op.disabled}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 14px',
                  borderRadius: '8px',
                  background: isActive
                    ? `rgba(${hexToRgb(color)}, 0.18)`
                    : 'var(--c-card-2)',
                  border: isActive
                    ? `1.5px solid ${color}`
                    : '1px solid var(--c-border-med)',
                  color: isActive ? color : 'var(--c-text-2)',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '12.5px',
                  fontWeight: isActive ? '700' : '500',
                  cursor: op.disabled ? 'not-allowed' : 'pointer',
                  opacity: op.disabled ? 0.5 : 1,
                  transition: 'all 0.15s ease',
                  boxShadow: isActive ? `0 0 12px rgba(${hexToRgb(color)}, 0.2)` : 'none',
                }}
              >
                <span>{op.icon}</span>
                <span>{op.label}</span>
                {op.shortcut && (
                  <span
                    style={{
                      fontSize: '10px',
                      padding: '1px 4px',
                      borderRadius: '4px',
                      background: 'var(--c-card)',
                      color: 'var(--c-text-4)',
                    }}
                  >
                    {op.shortcut}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      )}

      {children}
    </div>
  )
}

function hexToRgb(hex: string): string {
  const clean = hex.replace('#', '')
  if (clean.length === 3) {
    const r = parseInt(clean[0] + clean[0], 16)
    const g = parseInt(clean[1] + clean[1], 16)
    const b = parseInt(clean[2] + clean[2], 16)
    return `${r}, ${g}, ${b}`
  }
  if (clean.length === 6) {
    const r = parseInt(clean.substring(0, 2), 16)
    const g = parseInt(clean.substring(2, 4), 16)
    const b = parseInt(clean.substring(4, 6), 16)
    return `${r}, ${g}, ${b}`
  }
  return '99, 102, 241'
}
