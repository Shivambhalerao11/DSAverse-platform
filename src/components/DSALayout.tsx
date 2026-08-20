import { useState, type ReactNode } from 'react'
import LanguageSelector from './dsa/LanguageSelector'
import BottomWorkspace, { type WorkspaceTab } from './dsa/BottomWorkspace'
import { CodePanel } from './dsa/CodePanel'
import { ComplexityCard } from './dsa/ComplexityCard'
import { AITutor } from './dsa/AITutor'
import { QuizPanel } from './dsa/QuizPanel'
import { OutputPanel } from './dsa/OutputPanel'
import { ALL_LANGUAGES, type SupportedLanguage } from '../data/dsaCodeSnippets'

export type TopicStatus = 'available' | 'coming-soon' | 'completed'

export interface TopicItem {
  id: string
  icon: string
  label: string
  color: string
  status: TopicStatus
  progress?: number
  isNew?: boolean
}

export interface TopicSection {
  id: string
  label: string
  topics: TopicItem[]
}

export const DSA_SECTIONS: TopicSection[] = [
  {
    id: 'foundations',
    label: 'Foundations',
    topics: [
      { id: 'array', icon: '▦', label: 'Arrays', color: '#6366f1', status: 'available', progress: 25 },
      { id: 'strings', icon: '🔤', label: 'Strings', color: '#22d3ee', status: 'available', progress: 10 },
      { id: 'linkedlist', icon: '🚂', label: 'Linked List', color: '#06b6d4', status: 'available', progress: 0 },
      { id: 'stack', icon: '📦', label: 'Stack', color: '#f43f5e', status: 'available', progress: 0 },
      { id: 'queue', icon: '🚶', label: 'Queue', color: '#a855f7', status: 'available', progress: 0 },
    ],
  },
  {
    id: 'intermediate',
    label: 'Intermediate',
    topics: [
      { id: 'trees', icon: '🌳', label: 'Trees', color: '#10b981', status: 'available', progress: 0 },
      { id: 'sorting', icon: '⚡', label: 'Sorting', color: '#f59e0b', status: 'available', progress: 0 },
      { id: 'searching', icon: '🔎', label: 'Searching', color: '#f59e0b', status: 'available', progress: 0 },
      { id: 'bst', icon: '🔍', label: 'BST', color: '#10b981', status: 'available', progress: 0 },
      { id: 'heap', icon: '⛰', label: 'Heap', color: '#f43f5e', status: 'available', progress: 0 },
      { id: 'hashtables', icon: '#', label: 'Hash Tables', color: '#f59e0b', status: 'available', progress: 0 },
    ],
  },
  {
    id: 'advanced',
    label: 'Advanced',
    topics: [
      { id: 'graphs', icon: '🕸', label: 'Graphs', color: '#8b5cf6', status: 'available', progress: 0 },
      { id: 'dp', icon: '🧩', label: 'Dynamic Prog.', color: '#06b6d4', status: 'available', progress: 0 },
      { id: 'trie', icon: '🌿', label: 'Trie', color: '#22d3ee', status: 'available', progress: 0 },
      { id: 'greedy', icon: '💰', label: 'Greedy', color: '#10b981', status: 'available', progress: 0 },
      { id: 'backtrack', icon: '↩', label: 'Backtracking', color: '#a855f7', status: 'available', progress: 0 },
    ],
  },
]

export const DSA_TOPICS = DSA_SECTIONS.flatMap((s) => s.topics)

interface DSALayoutProps {
  onNavigate: (view: string) => void
  isDark?: boolean
  onToggleDark?: () => void
  topicId: string
  topicName: string
  topicColor: string
  topicIcon: string
  xp?: number
  language: string
  onLanguageChange: (lang: string) => void
  complexity: { time: string; space: string; desc: string; tips: string[] }
  infoItems?: Array<{ label: string; value: string }>
  inputPanel: ReactNode
  visualization: ReactNode
  codeContent: string
  operationDesc?: string
  outputLogs?: string[]
  quizContent?: ReactNode
  onReset?: () => void
}

export default function DSALayout({
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
  complexity,
  infoItems = [],
  inputPanel,
  visualization,
  codeContent,
  operationDesc,
  outputLogs = [],
  quizContent,
  onReset,
}: DSALayoutProps) {
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState<WorkspaceTab | null>(null)
  const [sidebarSearch, setSidebarSearch] = useState('')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set())
  const [notes, setNotes] = useState<string>(() => {
    try {
      return localStorage.getItem(`dsaverse-notes-${topicId}`) || ''
    } catch {
      return ''
    }
  })

  const handleNotesChange = (val: string) => {
    setNotes(val)
    try {
      localStorage.setItem(`dsaverse-notes-${topicId}`, val)
    } catch {}
  }

  const validLang = ALL_LANGUAGES.includes(language as SupportedLanguage)
    ? (language as SupportedLanguage)
    : 'Python'

  function toggleSection(id: string) {
    setCollapsedSections((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const filteredSections = sidebarSearch.trim()
    ? [
        {
          id: 'search-results',
          label: 'Results',
          topics: DSA_TOPICS.filter((t) =>
            t.label.toLowerCase().includes(sidebarSearch.toLowerCase())
          ),
        },
      ]
    : DSA_SECTIONS

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        overflow: 'hidden',
        background: 'var(--c-bg)',
        color: 'var(--c-text-1)',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      {/* TOP HEADER BAR */}
      <div
        style={{
          height: '52px',
          display: 'flex',
          alignItems: 'center',
          padding: '0 16px',
          borderBottom: '1px solid var(--c-border)',
          background: 'var(--c-surface)',
          gap: '12px',
          flexShrink: 0,
          zIndex: 50,
        }}
      >
        <button
          onClick={() => onNavigate('dashboard')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--c-text-3)',
            fontSize: '13px',
            padding: '4px 8px',
            borderRadius: '8px',
            transition: 'all 0.15s',
            fontFamily: 'Inter, sans-serif',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--c-card-2)'
            e.currentTarget.style.color = 'var(--c-text-1)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'none'
            e.currentTarget.style.color = 'var(--c-text-3)'
          }}
        >
          ← Dashboard
        </button>

        <div style={{ width: '1px', height: '20px', background: 'var(--c-border)' }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '8px',
              background: `${topicColor}20`,
              border: `1px solid ${topicColor}40`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
            }}
          >
            {topicIcon}
          </div>
          <span
            className="font-display"
            style={{ fontWeight: '700', fontSize: '15px', letterSpacing: '-0.03em' }}
          >
            {topicName}
          </span>
          <span
            style={{
              fontSize: '9px',
              fontWeight: '700',
              letterSpacing: '1px',
              background: `${topicColor}18`,
              color: topicColor,
              border: `1px solid ${topicColor}35`,
              padding: '2px 7px',
              borderRadius: '100px',
              textTransform: 'uppercase',
            }}
          >
            Interactive Lab
          </span>
        </div>

        {/* Right Section Controls */}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <LanguageSelector
            language={validLang}
            onLanguageChange={(l) => onLanguageChange(l)}
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
                transition: 'all 0.2s',
              }}
            >
              {isDark ? '🌙' : '☀️'}
            </button>
          )}

          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #6366f1, #22d3ee)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
              cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            👤
          </div>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* PURE NAVIGATION SIDEBAR — ONLY TOPIC LINKS */}
        <div
          style={{
            width: sidebarCollapsed ? '52px' : '232px',
            flexShrink: 0,
            borderRight: '1px solid var(--c-border)',
            display: 'flex',
            flexDirection: 'column',
            background: 'var(--c-surface)',
            transition: 'width 0.24s cubic-bezier(0.4,0,0.2,1)',
            overflow: 'hidden',
          }}
        >
          {/* Search Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: sidebarCollapsed ? '10px 0' : '10px 8px',
              justifyContent: sidebarCollapsed ? 'center' : 'space-between',
              borderBottom: '1px solid var(--c-border)',
              flexShrink: 0,
              gap: '6px',
            }}
          >
            {!sidebarCollapsed && (
              <div style={{ position: 'relative', flex: 1 }}>
                <span
                  style={{
                    position: 'absolute',
                    left: '8px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    fontSize: '11px',
                    color: 'var(--c-text-5)',
                    pointerEvents: 'none',
                  }}
                >
                  🔍
                </span>
                <input
                  value={sidebarSearch}
                  onChange={(e) => setSidebarSearch(e.target.value)}
                  placeholder="Search topics..."
                  style={{
                    width: '100%',
                    padding: '6px 8px 6px 26px',
                    background: 'var(--c-input)',
                    border: '1px solid var(--c-input-border)',
                    borderRadius: '8px',
                    color: 'var(--c-text-1)',
                    fontSize: '12px',
                    fontFamily: 'Inter, sans-serif',
                    outline: 'none',
                  }}
                />
              </div>
            )}
            <button
              onClick={() => setSidebarCollapsed((c) => !c)}
              title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--c-text-4)',
                fontSize: '14px',
                padding: '4px',
                borderRadius: '6px',
              }}
            >
              {sidebarCollapsed ? '›' : '‹'}
            </button>
          </div>

          {/* Navigation Links — FOUNDATIONS / INTERMEDIATE / ADVANCED */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: sidebarCollapsed ? '8px 4px' : '8px 6px',
            }}
          >
            {filteredSections.map((section) => (
              <div key={section.id} style={{ marginBottom: '6px' }}>
                {!sidebarCollapsed && (
                  <button
                    onClick={() => toggleSection(section.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                      padding: '5px 6px',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '9px',
                        fontWeight: '700',
                        color: 'var(--c-text-5)',
                        letterSpacing: '1.1px',
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

        {/* CENTER MAIN WORKSPACE CANVAS AREA */}
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
            }}
          >
            {inputPanel}
          </div>

          {/* MAIN HERO VISUALIZATION (~70% space) */}
          <div style={{ flex: 1, overflow: 'auto', minHeight: 0 }}>{visualization}</div>

          {/* BOTTOM WORKSPACE DRAWER */}
          <BottomWorkspace
            activeTab={activeWorkspaceTab}
            onTabChange={(tab) => setActiveWorkspaceTab(tab)}
            accentColor={topicColor}
            codeContent={<CodePanel language={validLang} code={codeContent} />}
            explanationContent={
              <div style={{ padding: '16px 20px', height: '100%', overflowY: 'auto' }}>
                <ComplexityCard
                  time={complexity.time}
                  space={complexity.space}
                  description={operationDesc || complexity.desc}
                  tips={complexity.tips}
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
                  placeholder={`Type your personal insights or key concepts for ${topicName}...`}
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
            aiContent={<AITutor topicName={topicName} accentColor={topicColor} />}
            outputContent={<OutputPanel logs={outputLogs} accentColor={topicColor} />}
          />
        </div>

        {/* RIGHT COMPLEXITY & METADATA PANEL */}
        <div
          style={{
            width: '220px',
            flexShrink: 0,
            borderLeft: '1px solid var(--c-border)',
            background: 'var(--c-surface)',
            overflowY: 'auto',
            padding: '14px 12px',
          }}
        >
          <ComplexityCard
            time={complexity.time}
            space={complexity.space}
            description={complexity.desc}
            tips={complexity.tips}
            accentColor={topicColor}
          />

          {infoItems.length > 0 && (
            <div style={{ marginTop: '16px' }}>
              <div
                style={{
                  fontSize: '9px',
                  color: 'var(--c-text-4)',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  letterSpacing: '0.8px',
                  marginBottom: '8px',
                }}
              >
                Topic Metadata
              </div>
              <div
                style={{
                  background: 'var(--c-card)',
                  border: '1px solid var(--c-border)',
                  borderRadius: '10px',
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
                      padding: '8px 10px',
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
                width: '100%',
                marginTop: '16px',
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
      </div>
    </div>
  )
}

export function OpButton({
  icon,
  label,
  color = '#6366f1',
  onClick,
  disabled = false,
}: {
  icon: string
  label: string
  color?: string
  onClick: () => void
  disabled?: boolean
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        padding: '7px 12px',
        borderRadius: '8px',
        background: `${color}10`,
        border: `1px solid ${color}30`,
        color: disabled ? 'var(--c-text-5)' : color,
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontSize: '12.5px',
        fontWeight: '600',
        fontFamily: 'Inter, sans-serif',
        transition: 'all 0.15s',
        whiteSpace: 'nowrap',
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <span style={{ fontSize: '13px' }}>{icon}</span>
      {label}
    </button>
  )
}

export function PanelLabel({ children }: { children: string }) {
  return (
    <div
      style={{
        fontSize: '9px',
        fontWeight: '700',
        color: 'var(--c-text-4)',
        letterSpacing: '1.2px',
        textTransform: 'uppercase',
        padding: '4px 2px 6px',
      }}
    >
      {children}
    </div>
  )
}
