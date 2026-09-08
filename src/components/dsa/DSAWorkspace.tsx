import { useState, useEffect, type ReactNode } from 'react'
import LanguageSelector from './LanguageSelector'
import BottomWorkspace, { type WorkspaceTab } from './BottomWorkspace'
import { CodePanel } from './CodePanel'
import { InfoSidebar } from './InfoSidebar'
import { AITutor } from './AITutor'
import { QuizPanel } from './QuizPanel'
import { OutputPanel } from './OutputPanel'
import { ALL_LANGUAGES, type SupportedLanguage } from '../../data/dsaCodeSnippets'
import { DSA_SECTIONS, DSA_TOPICS } from '../DSALayout'

interface DSAWorkspaceProps {
  onNavigate: (view: string) => void
  isDark?: boolean
  onToggleDark?: () => void
  topicId: string
  topicName: string
  topicCategory?: string
  topicColor: string
  topicIcon?: string
  xp?: number
  language?: string
  onLanguageChange?: (lang: string) => void
  timeComplexity: string
  spaceComplexity: string
  complexityDesc: string
  complexityTips?: string[]
  currentStepTitle?: string
  currentStepDesc?: string
  variables?: Record<string, string | number | boolean>
  realWorldApps?: string[]
  commonMistakes?: string[]
  infoItems?: Array<{ label: string; value: string }>
  inputPanel?: ReactNode
  operationToolbar?: ReactNode
  visualization: ReactNode
  codeContent: string
  outputLogs?: string[]
  quizContent?: ReactNode
  onReset?: () => void
  stepIndex?: number
  totalSteps?: number
  onStepChange?: (newIndex: number | ((prev: number) => number)) => void
  activeLine?: number
}

export default function DSAWorkspace({
  onNavigate,
  isDark = true,
  onToggleDark,
  topicId,
  topicName,
  topicColor,
  topicIcon,
  xp = 160,
  language,
  onLanguageChange,
  timeComplexity,
  spaceComplexity,
  complexityDesc,
  complexityTips = [],
  currentStepTitle,
  currentStepDesc,
  variables,
  realWorldApps,
  commonMistakes,
  infoItems = [],
  inputPanel,
  operationToolbar,
  visualization,
  codeContent,
  outputLogs = [],
  quizContent,
  onReset,
  stepIndex = 0,
  totalSteps = 1,
  onStepChange,
  activeLine,
}: DSAWorkspaceProps) {
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState<WorkspaceTab | null>('code')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set())
  const [notes, setNotes] = useState(() => {
    try {
      return localStorage.getItem(`dsaverse-notes-${topicId}`) || ''
    } catch {
      return ''
    }
  })

  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState<number>(1)

  useEffect(() => {
    setIsPlaying(false)
  }, [topicId, inputPanel, operationToolbar])

  useEffect(() => {
    if (!isPlaying || !onStepChange || totalSteps <= 1) {
      return
    }

    const intervalMs = Math.max(150, Math.round(800 / speed))
    const timer = setInterval(() => {
      onStepChange((prevIndex) => {
        if (prevIndex >= totalSteps - 1) {
          setIsPlaying(false)
          return prevIndex
        }
        return prevIndex + 1
      })
    }, intervalMs)

    return () => clearInterval(timer)
  }, [isPlaying, speed, totalSteps, onStepChange])

  const toggleSection = (sectionId: string) => {
    setCollapsedSections((prev) => {
      const next = new Set(prev)
      if (next.has(sectionId)) next.delete(sectionId)
      else next.add(sectionId)
      return next
    })
  }

  const handleNotesChange = (val: string) => {
    setNotes(val)
    try {
      localStorage.setItem(`dsaverse-notes-${topicId}`, val)
    } catch {}
  }

  const validLang = ALL_LANGUAGES.includes(language as SupportedLanguage)
    ? (language as SupportedLanguage)
    : 'Python'

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        width: '100vw',
        overflow: 'hidden',
        background: 'var(--c-bg)',
        color: 'var(--c-text-1)',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      {/* Screen reader live region — announces step changes */}
      <div
        aria-live="polite"
        aria-atomic="true"
        style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', overflow: 'hidden' }}
      >
        {currentStepDesc || currentStepTitle || ''}
      </div>

      {/* TOP HEADER */}
      <div
        style={{
          height: '52px',
          borderBottom: '1px solid var(--c-border)',
          background: 'var(--c-surface)',
          display: 'flex',
          alignItems: 'center',
          padding: '0 16px',
          gap: '12px',
          flexShrink: 0,
          zIndex: 10,
        }}
      >
        <button
          onClick={() => onNavigate('landing')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
          }}
        >
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #6366f1, #22d3ee)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'JetBrains Mono, monospace',
              fontWeight: '700',
              fontSize: '13px',
              color: '#ffffff',
            }}
          >
            {'{}'}
          </div>
          <span
            style={{
              fontWeight: '800',
              fontSize: '15px',
              background: 'linear-gradient(135deg, #6366f1, #22d3ee)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.3px',
            }}
          >
            DSAVerse
          </span>
        </button>

        <div
          style={{
            width: '1px',
            height: '20px',
            background: 'var(--c-border)',
            margin: '0 4px',
          }}
        />

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '18px' }}>{topicIcon}</span>
          <span style={{ fontWeight: '700', fontSize: '14px', color: 'var(--c-text-1)' }}>
            {topicName}
          </span>
          <span
            style={{
              fontSize: '10px',
              fontWeight: '700',
              padding: '2px 8px',
              borderRadius: '12px',
              background: `${topicColor}20`,
              color: topicColor,
              border: `1px solid ${topicColor}40`,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            Interactive Lab
          </span>
        </div>

        {/* Right Controls */}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <LanguageSelector
            language={validLang}
            onLanguageChange={(l) => onLanguageChange?.(l)}
            accentColor={topicColor}
          />

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              background: 'rgba(245,158,11,0.10)',
              border: '1px solid rgba(245,158,11,0.25)',
              borderRadius: '8px',
              padding: '4px 10px',
            }}
          >
            <span style={{ fontSize: '12px' }}>⚡</span>
            <span
              style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontWeight: '700',
                fontSize: '13px',
                color: '#f59e0b',
              }}
            >
              {xp} XP
            </span>
          </div>

          {onToggleDark && (
            <button
              onClick={onToggleDark}
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'var(--c-card-2)',
                border: '1px solid var(--c-border-med)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '15px',
                cursor: 'pointer',
                flexShrink: 0,
              }}
            >
              {isDark ? '🌙' : '☀️'}
            </button>
          )}
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* NAVIGATION SIDEBAR */}
        <div
          style={{
            width: sidebarCollapsed ? '52px' : '232px',
            flexShrink: 0,
            borderRight: '1px solid var(--c-border)',
            background: 'var(--c-surface)',
            display: 'flex',
            flexDirection: 'column',
            transition: 'width 0.25s ease',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              padding: '10px 12px',
              display: 'flex',
              justifyContent: sidebarCollapsed ? 'center' : 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid var(--c-border)',
            }}
          >
            {!sidebarCollapsed && (
              <span
                style={{
                  fontSize: '10px',
                  fontWeight: '700',
                  color: 'var(--c-text-4)',
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                }}
              >
                DSA Curriculum
              </span>
            )}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              title={sidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--c-text-3)',
                cursor: 'pointer',
                fontSize: '14px',
                padding: '2px 4px',
              }}
            >
              {sidebarCollapsed ? '➔' : '⬅'}
            </button>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
            {DSA_SECTIONS.map((section) => (
              <div key={section.id} style={{ marginBottom: '12px' }}>
                {!sidebarCollapsed && (
                  <button
                    onClick={() => toggleSection(section.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                      padding: '4px 8px',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      textAlign: 'left',
                      marginBottom: '4px',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '9px',
                        fontWeight: '700',
                        color: 'var(--c-text-4)',
                        letterSpacing: '1px',
                        textTransform: 'uppercase',
                      }}
                    >
                      {section.label}
                    </span>
                    <span style={{ fontSize: '10px', color: 'var(--c-text-5)' }}>
                      {collapsedSections.has(section.id) ? '▸' : '▾'}
                    </span>
                  </button>
                )}

                {!collapsedSections.has(section.id) &&
                  section.topics.map((t) => {
                    const isActive = t.id === topicId
                    const isAvailable = t.status === 'available'
                    return (
                      <button
                        key={t.id}
                        onClick={() => isAvailable && onNavigate(t.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: sidebarCollapsed ? '0' : '8px',
                          width: '100%',
                          padding: sidebarCollapsed ? '8px 0' : '6px 8px 6px 12px',
                          justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                          borderRadius: '8px',
                          background: isActive ? `${t.color}15` : 'none',
                          border: isActive ? `1px solid ${t.color}30` : '1px solid transparent',
                          color: isActive
                            ? t.color
                            : t.status === 'coming-soon'
                            ? 'var(--c-text-5)'
                            : 'var(--c-text-3)',
                          cursor: isAvailable ? 'pointer' : 'default',
                          fontFamily: 'Inter, sans-serif',
                          textAlign: 'left',
                          marginBottom: '2px',
                        }}
                      >
                        <span style={{ fontSize: sidebarCollapsed ? '16px' : '14px' }}>{t.icon}</span>
                        {!sidebarCollapsed && (
                          <span style={{ fontSize: '12.5px', fontWeight: isActive ? '600' : '400' }}>
                            {t.label}
                          </span>
                        )}
                      </button>
                    )
                  })}
              </div>
            ))}
          </div>
        </div>

        {/* WORKSPACE CANVAS AREA */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            minWidth: 0,
          }}
        >
          {/* FULL-WIDTH INPUT & OPERATIONS PANEL HEADER */}
          <div
            style={{
              padding: '12px 16px',
              borderBottom: '1px solid var(--c-border)',
              background: 'var(--c-surface)',
              flexShrink: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
            }}
          >
            {inputPanel}
            {operationToolbar}
          </div>

          {/* AUTO VISUALIZE CONTROL BAR */}
          {onStepChange && totalSteps > 0 && (
            <div
              style={{
                padding: '8px 16px',
                background: 'var(--c-surface-2)',
                borderBottom: '1px solid var(--c-border)',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                flexShrink: 0,
                flexWrap: 'wrap',
              }}
            >
              <button
                onClick={() => setIsPlaying((p) => !p)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 14px',
                  borderRadius: '8px',
                  background: isPlaying ? '#f43f5e' : (topicColor || '#6366f1'),
                  color: '#ffffff',
                  border: 'none',
                  fontWeight: '700',
                  fontSize: '12.5px',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                }}
              >
                <span>{isPlaying ? '⏸ Pause' : '▶ Auto Visualize'}</span>
              </button>

              <button
                onClick={() => {
                  setIsPlaying(false)
                  onStepChange(0)
                }}
                style={{
                  padding: '6px 10px',
                  borderRadius: '6px',
                  background: 'var(--c-card)',
                  border: '1px solid var(--c-border-med)',
                  color: 'var(--c-text-2)',
                  fontSize: '12px',
                  cursor: 'pointer',
                }}
              >
                ⏮ Reset
              </button>

              <button
                disabled={stepIndex === 0}
                onClick={() => {
                  setIsPlaying(false)
                  onStepChange((prev) => Math.max(0, prev - 1))
                }}
                style={{
                  padding: '6px 10px',
                  borderRadius: '6px',
                  background: 'var(--c-card)',
                  border: '1px solid var(--c-border-med)',
                  color: 'var(--c-text-2)',
                  fontSize: '12px',
                  cursor: stepIndex === 0 ? 'not-allowed' : 'pointer',
                  opacity: stepIndex === 0 ? 0.5 : 1,
                }}
              >
                ◀ Prev
              </button>

              <button
                disabled={stepIndex >= totalSteps - 1}
                onClick={() => {
                  setIsPlaying(false)
                  onStepChange((prev) => Math.min(totalSteps - 1, prev + 1))
                }}
                style={{
                  padding: '6px 10px',
                  borderRadius: '6px',
                  background: 'var(--c-card)',
                  border: '1px solid var(--c-border-med)',
                  color: 'var(--c-text-2)',
                  fontSize: '12px',
                  cursor: stepIndex >= totalSteps - 1 ? 'not-allowed' : 'pointer',
                  opacity: stepIndex >= totalSteps - 1 ? 0.5 : 1,
                }}
              >
                Next ▶
              </button>

              <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '12px', color: 'var(--c-text-3)', fontWeight: '600' }}>
                  Step {stepIndex + 1} of {totalSteps}
                </span>
                <select
                  value={speed}
                  onChange={(e) => setSpeed(parseFloat(e.target.value))}
                  style={{
                    padding: '4px 8px',
                    borderRadius: '6px',
                    background: 'var(--c-card)',
                    border: '1px solid var(--c-border-med)',
                    color: 'var(--c-text-1)',
                    fontSize: '12px',
                    outline: 'none',
                    cursor: 'pointer',
                  }}
                >
                  <option value={0.25}>0.25x</option>
                  <option value={0.5}>0.5x</option>
                  <option value={1}>1.0x</option>
                  <option value={2}>2.0x</option>
                  <option value={4}>4.0x</option>
                </select>
              </div>
            </div>
          )}

          {/* MAIN VISUALIZATION CANVAS */}
          <div style={{ flex: 1, overflow: 'auto', minHeight: 0 }}>{visualization}</div>

          {/* BOTTOM WORKSPACE DRAWER */}
          <BottomWorkspace
            activeTab={activeWorkspaceTab}
            onTabChange={(tab) => setActiveWorkspaceTab(tab)}
            accentColor={topicColor}
            codeContent={
              <CodePanel
                language={validLang}
                code={codeContent}
                activeLine={activeLine}
                variables={variables}
              />
            }
            explanationContent={
              <div style={{ padding: '16px 20px', height: '100%', overflowY: 'auto' }}>
                <InfoSidebar
                  timeComplexity={timeComplexity}
                  spaceComplexity={spaceComplexity}
                  description={complexityDesc}
                  tips={complexityTips}
                  accentColor={topicColor}
                />
              </div>
            }
            notesContent={
              <div style={{ padding: '16px 20px', height: '100%', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '11px', color: 'var(--c-text-4)', fontWeight: '600' }}>
                    Personal Notes — {topicName}
                  </span>
                  <span style={{ fontSize: '10px', color: 'var(--c-text-5)' }}>
                    {notes.length} chars · Auto-saved
                  </span>
                </div>
                <textarea
                  value={notes}
                  onChange={(e) => handleNotesChange(e.target.value)}
                  placeholder={`Type your personal insights for ${topicName}...`}
                  style={{
                    width: '100%',
                    flex: 1,
                    background: 'var(--c-card)',
                    border: '1px solid var(--c-border)',
                    borderRadius: '8px',
                    padding: '12px 14px',
                    color: 'var(--c-text-1)',
                    fontSize: '13px',
                    fontFamily: 'Inter, sans-serif',
                    lineHeight: '1.7',
                    outline: 'none',
                    resize: 'none',
                  }}
                />
              </div>
            }
            quizContent={
              quizContent || <QuizPanel topicName={topicName} accentColor={topicColor} />
            }
            aiContent={
              <AITutor
                topicName={topicName}
                accentColor={topicColor}
                currentStepTitle={currentStepTitle}
                currentStepDesc={currentStepDesc}
                codeSnippet={codeContent}
                variables={variables}
              />
            }
            outputContent={<OutputPanel logs={outputLogs} accentColor={topicColor} />}
          />
        </div>

        {/* RIGHT COMPLEXITY & METADATA PANEL */}
        <InfoSidebar
          timeComplexity={timeComplexity}
          spaceComplexity={spaceComplexity}
          description={complexityDesc}
          tips={complexityTips}
          currentStepTitle={currentStepTitle}
          currentStepDesc={currentStepDesc}
          variables={variables}
          realWorldApps={realWorldApps}
          commonMistakes={commonMistakes}
          infoItems={infoItems}
          accentColor={topicColor}
          onReset={onReset}
        />
      </div>
    </div>
  )
}
