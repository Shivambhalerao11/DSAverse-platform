import { useState, useRef, useEffect, type ReactNode } from 'react'

export type WorkspaceTab = 'code' | 'explanation' | 'notes' | 'quiz' | 'ai' | 'output'

interface BottomWorkspaceProps {
  activeTab: WorkspaceTab | null
  onTabChange: (tab: WorkspaceTab | null) => void
  accentColor?: string
  codeContent: ReactNode
  explanationContent: ReactNode
  notesContent: ReactNode
  quizContent: ReactNode
  aiContent: ReactNode
  outputContent: ReactNode
}

export default function BottomWorkspace({
  activeTab,
  onTabChange,
  accentColor = '#6366f1',
  codeContent,
  explanationContent,
  notesContent,
  quizContent,
  aiContent,
  outputContent,
}: BottomWorkspaceProps) {
  const [panelHeight, setPanelHeight] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('dsaverse-workspace-height')
      return saved ? parseInt(saved, 10) : 280
    } catch {
      return 280
    }
  })
  const [isFullscreen, setIsFullscreen] = useState(false)
  const isDragging = useRef(false)
  const startY = useRef(0)
  const startHeight = useRef(280)

  const isExpanded = activeTab !== null

  useEffect(() => {
    try {
      localStorage.setItem('dsaverse-workspace-height', panelHeight.toString())
    } catch {}
  }, [panelHeight])

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true
    startY.current = e.clientY
    startHeight.current = panelHeight
    document.body.style.cursor = 'ns-resize'
    document.body.style.userSelect = 'none'

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!isDragging.current) return
      const deltaY = startY.current - moveEvent.clientY
      const newHeight = Math.min(Math.max(startHeight.current + deltaY, 140), window.innerHeight * 0.8)
      setPanelHeight(newHeight)
    }

    const handleMouseUp = () => {
      isDragging.current = false
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
  }

  const tabs: { id: WorkspaceTab; icon: string; label: string }[] = [
    { id: 'code', icon: '</>', label: 'Code' },
    { id: 'explanation', icon: '📖', label: 'Explanation' },
    { id: 'notes', icon: '✏️', label: 'Notes' },
    { id: 'quiz', icon: '🧠', label: 'Quiz' },
    { id: 'ai', icon: '🤖', label: 'AI Tutor' },
    { id: 'output', icon: '📟', label: 'Output' },
  ]

  return (
    <div
      style={{
        borderTop: '1px solid var(--c-border)',
        background: 'var(--c-surface)',
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        position: isFullscreen ? 'fixed' : 'relative',
        inset: isFullscreen ? 0 : 'auto',
        zIndex: isFullscreen ? 9999 : 40,
        transition: isDragging.current ? 'none' : 'height 0.28s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      {/* Drag Resize Handle */}
      {isExpanded && !isFullscreen && (
        <div
          onMouseDown={handleMouseDown}
          title="Drag to resize"
          style={{
            height: '6px',
            width: '100%',
            cursor: 'ns-resize',
            background: 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'absolute',
            top: '-3px',
            left: 0,
            zIndex: 50,
          }}
        >
          <div
            style={{
              width: '36px',
              height: '3px',
              borderRadius: '2px',
              background: 'var(--c-border-med)',
              opacity: 0.6,
            }}
          />
        </div>
      )}

      {/* Tab Strip */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '0 12px',
          gap: '4px',
          height: '38px',
          flexShrink: 0,
          background: 'var(--c-surface)',
          borderBottom: isExpanded ? '1px solid var(--c-border)' : 'none',
        }}
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(isActive ? null : tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '5px 12px',
                background: isActive ? `${accentColor}18` : 'none',
                border: isActive ? `1px solid ${accentColor}35` : '1px solid transparent',
                borderRadius: '7px',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: isActive ? '600' : '500',
                color: isActive ? accentColor : 'var(--c-text-4)',
                fontFamily: 'Inter, sans-serif',
                transition: 'all 0.18s ease',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.color = 'var(--c-text-2)'
                  e.currentTarget.style.background = 'var(--c-card)'
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.color = 'var(--c-text-4)'
                  e.currentTarget.style.background = 'none'
                }
              }}
            >
              <span style={{ fontSize: '13px' }}>{tab.icon}</span>
              {tab.label}
            </button>
          )
        })}

        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '6px' }}>
          {isExpanded && (
            <>
              <button
                onClick={() => setIsFullscreen((f) => !f)}
                title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--c-text-4)',
                  fontSize: '12px',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  fontFamily: 'Inter, sans-serif',
                  transition: 'all 0.15s',
                }}
              >
                {isFullscreen ? '⤢ Exit' : '⤢ Fullscreen'}
              </button>

              <button
                onClick={() => onTabChange(null)}
                title="Collapse Panel"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--c-text-4)',
                  fontSize: '12px',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  fontFamily: 'Inter, sans-serif',
                  transition: 'all 0.15s',
                }}
              >
                ⌄ Collapse
              </button>
            </>
          )}
        </div>
      </div>

      {/* Expandable Workspace Body */}
      <div
        style={{
          height: isExpanded ? (isFullscreen ? 'calc(100vh - 38px)' : `${panelHeight}px`) : '0px',
          overflow: 'hidden',
          transition: isDragging.current ? 'none' : 'height 0.28s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <div
          style={{
            height: '100%',
            overflow: 'auto',
            opacity: isExpanded ? 1 : 0,
            transform: isExpanded ? 'translateY(0)' : 'translateY(6px)',
            transition: 'opacity 0.2s ease, transform 0.2s ease',
          }}
        >
          {activeTab === 'code' && codeContent}
          {activeTab === 'explanation' && explanationContent}
          {activeTab === 'notes' && notesContent}
          {activeTab === 'quiz' && quizContent}
          {activeTab === 'ai' && aiContent}
          {activeTab === 'output' && outputContent}
        </div>
      </div>
    </div>
  )
}
