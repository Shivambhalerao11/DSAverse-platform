import { ComplexityCard } from './ComplexityCard'

interface InfoSidebarProps {
  timeComplexity: string
  spaceComplexity: string
  description: string
  tips?: string[]
  currentStepTitle?: string
  currentStepDesc?: string
  variables?: Record<string, string | number | boolean>
  realWorldApps?: string[]
  commonMistakes?: string[]
  infoItems?: Array<{ label: string; value: string }>
  accentColor?: string
  onReset?: () => void
}

export function InfoSidebar({
  timeComplexity,
  spaceComplexity,
  description,
  tips = [],
  currentStepTitle,
  currentStepDesc,
  variables,
  realWorldApps,
  commonMistakes,
  infoItems = [],
  accentColor = '#6366f1',
  onReset,
}: InfoSidebarProps) {
  return (
    <div
      style={{
        width: '240px',
        flexShrink: 0,
        borderLeft: '1px solid var(--c-border)',
        background: 'var(--c-surface)',
        overflowY: 'auto',
        padding: '14px 12px',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
      }}
    >
      {/* Current Step Section */}
      {currentStepTitle && (
        <div
          style={{
            background: `${accentColor}10`,
            border: `1px solid ${accentColor}30`,
            borderRadius: '10px',
            padding: '10px 12px',
          }}
        >
          <div
            style={{
              fontSize: '10px',
              fontWeight: '700',
              color: accentColor,
              textTransform: 'uppercase',
              letterSpacing: '0.8px',
              marginBottom: '4px',
            }}
          >
            {currentStepTitle}
          </div>
          <div style={{ fontSize: '12.5px', color: 'var(--c-text-1)', lineHeight: '1.5' }}>
            {currentStepDesc || 'Algorithm step executing...'}
          </div>
        </div>
      )}

      {/* Live Variables Inspector */}
      {variables && Object.keys(variables).length > 0 && (
        <div>
          <div
            style={{
              fontSize: '9px',
              color: 'var(--c-text-4)',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '0.8px',
              marginBottom: '6px',
            }}
          >
            Live Variables
          </div>
          <div
            style={{
              background: 'var(--c-card)',
              border: '1px solid var(--c-border)',
              borderRadius: '8px',
              overflow: 'hidden',
            }}
          >
            {Object.entries(variables).map(([k, v], idx, arr) => (
              <div
                key={k}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '6px 10px',
                  borderBottom: idx < arr.length - 1 ? '1px solid var(--c-border)' : 'none',
                }}
              >
                <span style={{ fontSize: '11px', color: 'var(--c-text-4)', fontFamily: 'JetBrains Mono, monospace' }}>
                  {k}
                </span>
                <span style={{ fontSize: '11px', color: accentColor, fontWeight: '600', fontFamily: 'JetBrains Mono, monospace' }}>
                  {String(v)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Complexity Card */}
      <ComplexityCard
        time={timeComplexity}
        space={spaceComplexity}
        description={description}
        tips={tips}
        accentColor={accentColor}
      />

      {/* Real-World Applications */}
      {realWorldApps && realWorldApps.length > 0 && (
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
              fontSize: '9.5px',
              fontWeight: '700',
              color: 'var(--c-text-3)',
              textTransform: 'uppercase',
              letterSpacing: '0.8px',
              marginBottom: '6px',
            }}
          >
            🌍 Real-World Applications
          </div>
          <ul style={{ margin: 0, paddingLeft: '14px', fontSize: '11.5px', color: 'var(--c-text-3)', lineHeight: '1.5' }}>
            {realWorldApps.map((app, idx) => (
              <li key={idx}>{app}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Common Mistakes */}
      {commonMistakes && commonMistakes.length > 0 && (
        <div
          style={{
            background: 'rgba(244,63,94,0.08)',
            border: '1px solid rgba(244,63,94,0.25)',
            borderRadius: '10px',
            padding: '10px 12px',
          }}
        >
          <div
            style={{
              fontSize: '9.5px',
              fontWeight: '700',
              color: '#f43f5e',
              textTransform: 'uppercase',
              letterSpacing: '0.8px',
              marginBottom: '6px',
            }}
          >
            ⚠️ Common Mistakes
          </div>
          <ul style={{ margin: 0, paddingLeft: '14px', fontSize: '11.5px', color: 'var(--c-text-3)', lineHeight: '1.5' }}>
            {commonMistakes.map((m, idx) => (
              <li key={idx}>{m}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Metadata */}
      {infoItems.length > 0 && (
        <div>
          <div
            style={{
              fontSize: '9px',
              color: 'var(--c-text-4)',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '0.8px',
              marginBottom: '6px',
            }}
          >
            Topic Metadata
          </div>
          <div
            style={{
              background: 'var(--c-card)',
              border: '1px solid var(--c-border)',
              borderRadius: '8px',
              overflow: 'hidden',
            }}
          >
            {infoItems.map((item, i) => (
              <div
                key={item.label}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '6px 10px',
                  borderBottom: i < infoItems.length - 1 ? '1px solid var(--c-border)' : 'none',
                }}
              >
                <span style={{ fontSize: '11px', color: 'var(--c-text-4)' }}>{item.label}</span>
                <span
                  style={{
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: '11px',
                    color: 'var(--c-text-2)',
                    fontWeight: '600',
                  }}
                >
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {onReset && (
        <button
          onClick={onReset}
          style={{
            marginTop: 'auto',
            padding: '8px',
            borderRadius: '8px',
            background: 'var(--c-card)',
            border: '1px solid var(--c-border)',
            color: 'var(--c-text-3)',
            cursor: 'pointer',
            fontSize: '12px',
            fontFamily: 'Inter, sans-serif',
            transition: 'all 0.15s',
          }}
        >
          ↺ Reset Visualizer
        </button>
      )}
    </div>
  )
}
