interface StackQueueVisualizerProps {
  type?: 'stack' | 'queue'
  mode?: 'stack' | 'queue'   // alias for type, accepted by both StackWorld and QueueWorld
  items: Array<{ id: string | number; val: string | number; state?: 'default' | 'top' | 'front' | 'rear' | 'active' }>
  accentColor?: string
}

export function StackQueueVisualizer({
  type,
  mode,
  items,
  accentColor = '#f43f5e',
}: StackQueueVisualizerProps) {
  const resolvedType: 'stack' | 'queue' = type || mode || 'stack'
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '20px',
        width: '100%',
        padding: '24px',
      }}
    >
      {resolvedType === 'stack' ? (
        /* Vertical Stack Container */
        <div
          style={{
            width: '180px',
            minHeight: '260px',
            border: '2px solid var(--c-border-med)',
            borderTop: 'none',
            borderRadius: '0 0 16px 16px',
            background: 'var(--c-surface)',
            padding: '12px',
            display: 'flex',
            flexDirection: 'column-reverse',
            gap: '8px',
            alignItems: 'center',
            boxShadow: 'inset 0 -12px 24px rgba(0,0,0,0.3)',
          }}
        >
          {items.map((item, idx) => {
            const isTop = idx === items.length - 1
            return (
              <div
                key={item.id || idx}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '8px',
                  background: isTop ? `${accentColor}25` : 'var(--c-card)',
                  border: `1px solid ${isTop ? accentColor : 'var(--c-border)'}`,
                  color: isTop ? accentColor : 'var(--c-text-1)',
                  fontWeight: '700',
                  fontFamily: 'JetBrains Mono, monospace',
                  textAlign: 'center',
                  fontSize: '15px',
                  transition: 'all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  position: 'relative',
                }}
              >
                {item.val}
                {isTop && (
                  <span
                    style={{
                      position: 'absolute',
                      right: '-45px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      fontSize: '10px',
                      color: accentColor,
                      fontWeight: '800',
                    }}
                  >
                    ← TOP
                  </span>
                )}
              </div>
            )
          })}

          {items.length === 0 && (
            <div style={{ color: 'var(--c-text-5)', fontSize: '12px', textAlign: 'center', margin: 'auto' }}>
              Stack is Empty
            </div>
          )}
        </div>
      ) : (
        /* Horizontal Queue Container */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', color: '#a855f7', fontWeight: '700' }}>FRONT ➔</span>
            <div
              style={{
                display: 'flex',
                gap: '8px',
                padding: '12px',
                background: 'var(--c-surface)',
                border: '2px dashed var(--c-border-med)',
                borderRadius: '14px',
                minWidth: '280px',
                minHeight: '70px',
                alignItems: 'center',
              }}
            >
              {items.map((item, idx) => {
                const isFront = idx === 0
                const isRear = idx === items.length - 1

                return (
                  <div
                    key={item.id || idx}
                    style={{
                      width: '52px',
                      height: '52px',
                      borderRadius: '10px',
                      background: isFront || isRear ? `${accentColor}25` : 'var(--c-card)',
                      border: `1px solid ${isFront || isRear ? accentColor : 'var(--c-border)'}`,
                      color: isFront || isRear ? accentColor : 'var(--c-text-1)',
                      fontWeight: '700',
                      fontFamily: 'JetBrains Mono, monospace',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '15px',
                      transition: 'all 0.25s ease',
                    }}
                  >
                    {item.val}
                  </div>
                )
              })}

              {items.length === 0 && (
                <div style={{ color: 'var(--c-text-5)', fontSize: '12px', margin: 'auto' }}>
                  Queue is Empty
                </div>
              )}
            </div>
            <span style={{ fontSize: '11px', color: '#a855f7', fontWeight: '700' }}>➔ REAR</span>
          </div>
        </div>
      )}
    </div>
  )
}
