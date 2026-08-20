import { type ReactNode } from 'react'

interface EmptyStateProps {
  icon?: string
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
  children?: ReactNode
}

export function EmptyState({
  icon = '📂',
  title,
  description,
  actionLabel,
  onAction,
  children,
}: EmptyStateProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px 24px',
        textAlign: 'center',
        background: 'var(--c-card)',
        border: '1px border-dashed var(--c-border)',
        borderRadius: '16px',
        margin: '12px 0',
      }}
    >
      <div style={{ fontSize: '32px', marginBottom: '10px' }}>{icon}</div>
      <div style={{ fontSize: '15px', fontWeight: '700', color: 'var(--c-text-1)', marginBottom: '4px' }}>
        {title}
      </div>
      <div style={{ fontSize: '13px', color: 'var(--c-text-3)', maxWidth: '320px', lineHeight: '1.5', marginBottom: actionLabel ? '16px' : '0' }}>
        {description}
      </div>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            background: 'var(--c-card-2)',
            border: '1px solid var(--c-border-med)',
            color: 'var(--c-text-1)',
            fontSize: '12.5px',
            fontWeight: '600',
            cursor: 'pointer',
            fontFamily: 'Inter, sans-serif',
          }}
        >
          {actionLabel}
        </button>
      )}
      {children}
    </div>
  )
}
