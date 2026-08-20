/**
 * AutoVisualizeControls
 * Universal playback toolbar — used by every DSA world.
 * Provides: Auto Visualize, Pause, Resume, Step Forward/Back, Speed, Reset, Progress bar.
 */
import { type ReactNode } from 'react'

interface AutoVisualizeControlsProps {
  isPlaying: boolean
  currentStep: number
  totalSteps: number
  speed: number
  progress: number
  isComplete: boolean
  accentColor?: string
  statusText?: string
  onAutoVisualize: () => void
  onToggle: () => void
  onStepForward: () => void
  onStepBack: () => void
  onSpeedChange: (s: number) => void
  onReset: () => void
  children?: ReactNode
}

const SPEEDS = [
  { label: '0.5×', value: 0.5 },
  { label: '1×',   value: 1   },
  { label: '2×',   value: 2   },
  { label: '4×',   value: 4   },
]

export function AutoVisualizeControls({
  isPlaying,
  currentStep,
  totalSteps,
  speed,
  progress,
  isComplete,
  accentColor = '#6366f1',
  statusText,
  onAutoVisualize,
  onToggle,
  onStepForward,
  onStepBack,
  onSpeedChange,
  onReset,
  children,
}: AutoVisualizeControlsProps) {
  const hasStarted = currentStep >= 0
  const atStart    = currentStep <= 0
  const atEnd      = totalSteps > 0 && currentStep >= totalSteps - 1

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>

      {/* Status + Progress bar */}
      {hasStarted && totalSteps > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '11px', color: accentColor }}>
              {isComplete ? '✓ Complete' : statusText || `Step ${currentStep + 1} / ${totalSteps}`}
            </span>
            <span style={{ fontSize: '11px', color: 'var(--c-text-5)', fontFamily: 'JetBrains Mono,monospace' }}>
              {Math.round(progress)}%
            </span>
          </div>
          <div style={{ height: '3px', borderRadius: '2px', background: 'var(--c-border)', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${progress}%`, background: `linear-gradient(90deg, ${accentColor}, ${accentColor}aa)`, borderRadius: '2px', transition: 'width 0.3s ease' }} />
          </div>
        </div>
      )}

      {/* Primary controls row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>

        {/* Auto Visualize — primary action */}
        {!hasStarted && (
          <button
            onClick={onAutoVisualize}
            style={{
              display: 'flex', alignItems: 'center', gap: '7px',
              padding: '9px 18px', borderRadius: '10px',
              background: `linear-gradient(135deg, ${accentColor}, ${accentColor}cc)`,
              border: 'none', color: '#fff',
              fontSize: '13px', fontWeight: '700',
              cursor: 'pointer', fontFamily: 'Inter,sans-serif',
              boxShadow: `0 4px 16px ${accentColor}40`,
              transition: 'all 0.2s',
              flex: 1,
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = `0 6px 20px ${accentColor}50` }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = `0 4px 16px ${accentColor}40` }}
          >
            ▶ Auto Visualize
          </button>
        )}

        {/* Step controls — shown after start */}
        {hasStarted && (
          <>
            <button
              onClick={onStepBack}
              disabled={atStart}
              title="Step Back"
              style={{ padding: '7px 10px', borderRadius: '8px', background: 'var(--c-card', border: '1px solid var(--c-border)', color: 'var(--c-text-2)', cursor: atStart ? 'not-allowed' : 'pointer', opacity: atStart ? 0.35 : 1, fontSize: '14px' }}
            >
              ⏮
            </button>

            <button
              onClick={onToggle}
              style={{
                display: 'flex', alignItems: 'center', gap: '5px',
                padding: '7px 14px', borderRadius: '8px',
                background: isPlaying ? `${accentColor}20` : accentColor,
                border: `1px solid ${accentColor}50`,
                color: isPlaying ? accentColor : '#fff',
                cursor: 'pointer', fontSize: '12px',
                fontWeight: '600', fontFamily: 'Inter,sans-serif',
                transition: 'all 0.2s',
              }}
            >
              {isPlaying ? '⏸ Pause' : isComplete ? '↺ Replay' : '▶ Resume'}
            </button>

            <button
              onClick={onStepForward}
              disabled={atEnd}
              title="Step Forward"
              style={{ padding: '7px 10px', borderRadius: '8px', background: 'var(--c-card)', border: '1px solid var(--c-border)', color: 'var(--c-text-2)', cursor: atEnd ? 'not-allowed' : 'pointer', opacity: atEnd ? 0.35 : 1, fontSize: '14px' }}
            >
              ⏭
            </button>

            <button
              onClick={onReset}
              title="Reset"
              style={{ padding: '7px 10px', borderRadius: '8px', background: 'var(--c-card)', border: '1px solid var(--c-border)', color: 'var(--c-text-3)', cursor: 'pointer', fontSize: '12px', fontFamily: 'Inter,sans-serif', marginLeft: 'auto' }}
            >
              ↺ Reset
            </button>
          </>
        )}
      </div>

      {/* Speed selector */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        <span style={{ fontSize: '10px', color: 'var(--c-text-4)', fontWeight: '600', letterSpacing: '0.5px', textTransform: 'uppercase', marginRight: '2px' }}>Speed</span>
        {SPEEDS.map((s) => (
          <button
            key={s.value}
            onClick={() => onSpeedChange(s.value)}
            style={{
              padding: '3px 8px', borderRadius: '6px',
              background: speed === s.value ? `${accentColor}20` : 'none',
              border: `1px solid ${speed === s.value ? `${accentColor}45` : 'transparent'}`,
              color: speed === s.value ? accentColor : 'var(--c-text-4)',
              cursor: 'pointer', fontSize: '11px', fontWeight: '600',
              fontFamily: 'JetBrains Mono,monospace', transition: 'all 0.15s',
            }}
          >
            {s.label}
          </button>
        ))}
      </div>

      {children}
    </div>
  )
}
