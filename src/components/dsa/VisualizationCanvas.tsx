import { useState, type ReactNode } from 'react'

interface VisualizationCanvasProps {
  children: ReactNode
  title?: string
  statusText?: string
  accentColor?: string
  currentStep?: number
  totalSteps?: number
  isPlaying?: boolean
  speed?: number
  onPlayPause?: () => void
  onStepForward?: () => void
  onStepBack?: () => void
  onSpeedChange?: (speed: number) => void
  onReset?: () => void
}

export default function VisualizationCanvas({
  children,
  title,
  statusText,
  accentColor = '#6366f1',
  currentStep = 0,
  totalSteps = 0,
  isPlaying = false,
  speed = 1,
  onPlayPause,
  onStepForward,
  onStepBack,
  onSpeedChange,
  onReset,
}: VisualizationCanvasProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)

  return (
    <div
      style={{
        position: isFullscreen ? 'fixed' : 'relative',
        inset: isFullscreen ? 0 : 'auto',
        zIndex: isFullscreen ? 9998 : 1,
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--c-bg)',
        overflow: 'hidden',
      }}
    >
      {/* Canvas Header / Status Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 16px',
          background: 'var(--c-surface)',
          borderBottom: '1px solid var(--c-border)',
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {title && (
            <span
              style={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: '700',
                fontSize: '13px',
                color: 'var(--c-text-1)',
              }}
            >
              {title}
            </span>
          )}
          {statusText && (
            <span
              style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '12px',
                color: accentColor,
                background: `${accentColor}15`,
                padding: '2px 8px',
                borderRadius: '6px',
                border: `1px solid ${accentColor}30`,
              }}
            >
              {statusText}
            </span>
          )}
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {totalSteps > 0 && (
            <span
              style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '11px',
                color: 'var(--c-text-4)',
              }}
            >
              Step {currentStep} / {totalSteps}
            </span>
          )}

          {/* Fullscreen canvas toggle */}
          <button
            onClick={() => setIsFullscreen((f) => !f)}
            title="Maximize Canvas"
            style={{
              background: 'var(--c-card)',
              border: '1px solid var(--c-border)',
              borderRadius: '6px',
              color: 'var(--c-text-3)',
              cursor: 'pointer',
              padding: '4px 8px',
              fontSize: '11px',
              fontFamily: 'Inter, sans-serif',
              transition: 'all 0.15s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--c-card-2)'
              e.currentTarget.style.color = 'var(--c-text-1)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--c-card)'
              e.currentTarget.style.color = 'var(--c-text-3)'
            }}
          >
            {isFullscreen ? '⤢ Exit' : '⤢ Maximize'}
          </button>
        </div>
      </div>

      {/* Main Interactive Canvas Area */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          padding: '24px',
          overflow: 'auto',
          minHeight: 0,
        }}
      >
        {children}
      </div>

      {/* Step Playback Toolbar */}
      {(onPlayPause || onStepForward || onStepBack || onReset) && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            padding: '8px 16px',
            background: 'var(--c-surface)',
            borderTop: '1px solid var(--c-border)',
            flexShrink: 0,
          }}
        >
          {onReset && (
            <button
              onClick={onReset}
              title="Reset"
              style={{
                background: 'var(--c-card)',
                border: '1px solid var(--c-border)',
                borderRadius: '8px',
                color: 'var(--c-text-3)',
                cursor: 'pointer',
                padding: '5px 10px',
                fontSize: '12px',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              ↺ Reset
            </button>
          )}

          {onStepBack && (
            <button
              onClick={onStepBack}
              title="Step Back"
              disabled={currentStep <= 0}
              style={{
                background: 'var(--c-card)',
                border: '1px solid var(--c-border)',
                borderRadius: '8px',
                color: 'var(--c-text-2)',
                cursor: currentStep <= 0 ? 'not-allowed' : 'pointer',
                opacity: currentStep <= 0 ? 0.4 : 1,
                padding: '5px 10px',
                fontSize: '13px',
              }}
            >
              ⏮
            </button>
          )}

          {onPlayPause && (
            <button
              onClick={onPlayPause}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: `${accentColor}20`,
                border: `1px solid ${accentColor}50`,
                borderRadius: '8px',
                color: accentColor,
                cursor: 'pointer',
                padding: '6px 14px',
                fontSize: '13px',
                fontWeight: '600',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              <span>{isPlaying ? '⏸ Pause' : '▶ Play'}</span>
            </button>
          )}

          {onStepForward && (
            <button
              onClick={onStepForward}
              title="Step Forward"
              disabled={totalSteps > 0 && currentStep >= totalSteps}
              style={{
                background: 'var(--c-card)',
                border: '1px solid var(--c-border)',
                borderRadius: '8px',
                color: 'var(--c-text-2)',
                cursor: totalSteps > 0 && currentStep >= totalSteps ? 'not-allowed' : 'pointer',
                opacity: totalSteps > 0 && currentStep >= totalSteps ? 0.4 : 1,
                padding: '5px 10px',
                fontSize: '13px',
              }}
            >
              ⏭
            </button>
          )}

          {onSpeedChange && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginLeft: '12px' }}>
              <span style={{ fontSize: '11px', color: 'var(--c-text-4)' }}>Speed:</span>
              {[0.5, 1, 2].map((s) => (
                <button
                  key={s}
                  onClick={() => onSpeedChange(s)}
                  style={{
                    background: speed === s ? `${accentColor}20` : 'none',
                    border: `1px solid ${speed === s ? `${accentColor}40` : 'transparent'}`,
                    borderRadius: '5px',
                    color: speed === s ? accentColor : 'var(--c-text-4)',
                    cursor: 'pointer',
                    fontSize: '11px',
                    padding: '2px 6px',
                    fontFamily: 'JetBrains Mono, monospace',
                  }}
                >
                  {s}x
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
