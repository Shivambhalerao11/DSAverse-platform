import React, { useState, useEffect, lazy, Suspense, Component, type ReactNode, type CSSProperties } from 'react'

const Landing          = lazy(() => import('./pages/Landing'))
const ArrayWorld       = lazy(() => import('./pages/ArrayWorld'))
const StringWorld      = lazy(() => import('./pages/StringWorld'))
const StackWorld       = lazy(() => import('./pages/StackWorld'))
const QueueWorld       = lazy(() => import('./pages/QueueWorld'))
const LinkedListWorld  = lazy(() => import('./pages/LinkedListWorld'))
const TreeWorld        = lazy(() => import('./pages/TreeWorld'))
const GraphWorld       = lazy(() => import('./pages/GraphWorld'))
const SortWorld        = lazy(() => import('./pages/SortWorld'))
const DPWorld          = lazy(() => import('./pages/DPWorld'))
const SearchWorld      = lazy(() => import('./pages/SearchWorld'))
const HeapWorld        = lazy(() => import('./pages/HeapWorld'))
const TrieWorld        = lazy(() => import('./pages/TrieWorld'))
const GreedyWorld      = lazy(() => import('./pages/GreedyWorld'))
const HashTableWorld   = lazy(() => import('./pages/HashTableWorld'))
const BacktrackWorld   = lazy(() => import('./pages/BacktrackWorld'))
const Dashboard        = lazy(() => import('./pages/Dashboard'))
const Auth             = lazy(() => import('./pages/Auth'))
const TeacherDashboard = lazy(() => import('./pages/TeacherDashboard'))

export type View =
  | 'landing' | 'array' | 'strings' | 'stack' | 'queue' | 'linkedlist'
  | 'trees' | 'bst' | 'graphs' | 'sorting' | 'dp' | 'searching' | 'heap' | 'trie' | 'greedy'
  | 'hashtables' | 'backtrack'
  | 'dashboard' | 'auth' | 'teacher'

export const ROUTE_MAP: Record<View, string> = {
  landing: '/',
  auth: '/login',
  dashboard: '/dashboard',
  teacher: '/dashboard/teacher',
  array: '/learn/arrays',
  strings: '/learn/strings',
  linkedlist: '/learn/linked-list',
  stack: '/learn/stack',
  queue: '/learn/queue',
  trees: '/learn/trees',
  bst: '/learn/bst',
  heap: '/learn/heap',
  hashtables: '/learn/hashtables',
  graphs: '/learn/graphs',
  sorting: '/learn/sorting',
  searching: '/learn/searching',
  dp: '/learn/dynamic-programming',
  trie: '/learn/trie',
  greedy: '/learn/greedy',
  backtrack: '/learn/backtracking',
}

export const PROTECTED_VIEWS: View[] = [
  'dashboard',
  'teacher',
  'array',
  'strings',
  'linkedlist',
  'stack',
  'queue',
  'trees',
  'bst',
  'heap',
  'hashtables',
  'graphs',
  'sorting',
  'searching',
  'dp',
  'trie',
  'greedy',
  'backtrack',
]

interface Achievement { icon: string; label: string; xp: number }

function ConfettiParticle({ x, y, color, round, rotation, duration, delay }: { x: number; y: number; color: string; round: boolean; rotation: number; duration: number; delay: number }) {
  return (
    <div
      style={{
        position: 'fixed', left: x, top: y, width: '8px', height: '8px',
        borderRadius: round ? '50%' : '2px',
        background: color, pointerEvents: 'none', zIndex: 10000,
        animation: `confetti-burst ${duration}s ease forwards`,
        animationDelay: `${delay}s`,
        transform: `rotate(${rotation}deg)`,
      }}
    />
  )
}

function AchievementPopup({ achievement, onDone }: { achievement: Achievement; onDone: () => void }) {
  const [particles] = useState(() =>
    Array.from({ length: 18 }, (_, i) => ({
      id: i,
      x: window.innerWidth - 180 + (Math.random() - 0.5) * 200,
      y: window.innerHeight - 120 + (Math.random() - 0.5) * 80,
      color: ['#6366f1', '#f59e0b', '#10b981', '#a855f7', '#22d3ee', '#f43f5e'][i % 6],
      round: Math.random() > 0.5,
      rotation: Math.floor(Math.random() * 360),
      duration: 0.8 + Math.random() * 0.6,
      delay: Math.random() * 0.3,
    }))
  )
  useEffect(() => {
    const id = setTimeout(onDone, 4000)
    return () => clearTimeout(id)
  }, [onDone])
  return (
    <>
      {particles.map((p) => <ConfettiParticle key={p.id} x={p.x} y={p.y} color={p.color} round={p.round} rotation={p.rotation} duration={p.duration} delay={p.delay} />)}
      <div
        style={{
          position: 'fixed', bottom: '32px', right: '32px', zIndex: 9999,
          display: 'flex', alignItems: 'center', gap: '14px', padding: '16px 20px',
          background: 'rgba(13,17,23,0.97)', border: '1px solid rgba(245,158,11,0.45)',
          borderRadius: '18px', boxShadow: '0 0 48px rgba(245,158,11,0.25), 0 24px 64px rgba(0,0,0,0.6)',
          backdropFilter: 'blur(24px)', animation: 'slide-in 0.45s cubic-bezier(0.34,1.56,0.64,1)',
          fontFamily: 'Inter,sans-serif', minWidth: '290px',
        }}
      >
        <div style={{ width: '50px', height: '50px', borderRadius: '13px', background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px', flexShrink: 0, animation: 'bounce-in 0.5s cubic-bezier(0.34,1.56,0.64,1)' }}>
          {achievement.icon}
        </div>
        <div>
          <div style={{ fontSize: '10px', color: '#f59e0b', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.2px', marginBottom: '3px' }}>Achievement Unlocked!</div>
          <div style={{ fontSize: '15px', fontWeight: '700', color: '#f1f5f9', marginBottom: '3px' }}>{achievement.label}</div>
          <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '12px', color: '#f59e0b', fontWeight: '600' }}>+{achievement.xp} XP</div>
        </div>
        <button
          onClick={onDone}
          style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer', fontSize: '18px', marginLeft: 'auto', flexShrink: 0, padding: '4px', lineHeight: 1, transition: 'color 0.15s' }}
          onMouseEnter={(e) => { e.currentTarget.style.color = '#94a3b8' }}
          onMouseLeave={(e) => { e.currentTarget.style.color = '#475569' }}
        >
          ×
        </button>
      </div>
    </>
  )
}

function PageTransition({ show }: { show: boolean }) {
  if (!show) return null
  return (
    <div
      style={{
        position: 'fixed', inset: 0,
        background: 'linear-gradient(135deg,rgba(99,102,241,0.08),rgba(168,85,247,0.06))',
        zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center',
        pointerEvents: 'none',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
        <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg,#6366f1,#22d3ee)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'JetBrains Mono,monospace', fontWeight: '700', fontSize: '15px', color: 'white', animation: 'glow 1s ease infinite' }}>
          {'{}'}
        </div>
        <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '11px', color: '#475569', letterSpacing: '2px' }}>loading...</div>
      </div>
    </div>
  )
}

class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean; error: Error | null }> {
  constructor(props: { children: ReactNode }) {
    super(props)
    this.state = { hasError: false, error: null }
  }
  static getDerivedStateFromError(error: Error) { return { hasError: true, error } }
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) { console.error('[DSAverse] Uncaught error:', error, errorInfo) }
  render() {
    if (this.state.hasError) {
      const msg = this.state.error instanceof Error ? this.state.error.message : 'An unexpected error occurred.'
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '24px', background: '#05070f', color: '#f8fafc', fontFamily: 'Inter, sans-serif', textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
          <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px' }}>Something went wrong</h2>
          <p style={{ fontSize: '14px', color: '#94a3b8', maxWidth: '400px', marginBottom: '20px' }}>{msg}</p>
          <button onClick={() => window.location.reload()} style={{ padding: '10px 20px', borderRadius: '10px', background: '#6366f1', border: 'none', color: '#ffffff', fontWeight: '600', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
            Reload Application
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

export default function App() {
  const [view, setView] = useState<View>('landing')
  const [transitioning, setTransitioning] = useState(false)
  const [achievement, setAchievement] = useState<Achievement | null>(null)
  const [isDark, setIsDark] = useState(() => {
    try {
      const saved = localStorage.getItem('dsaverse-theme')
      return saved !== null ? saved === 'dark' : true
    } catch { return true }
  })

  useEffect(() => {
    document.body.classList.toggle('light-mode', !isDark)
    try { localStorage.setItem('dsaverse-theme', isDark ? 'dark' : 'light') } catch {}
  }, [isDark])

  useEffect(() => {
    const titles: Record<View, string> = {
      landing: 'DSAVerse — Master Data Structures & Algorithms Visually',
      auth: 'Authentication — DSAVerse Platform',
      dashboard: 'Interactive Dashboard — DSAVerse',
      teacher: 'Teacher Dashboard — DSAVerse Educator Hub',
      array: 'Arrays Interactive Lab — DSAVerse',
      strings: 'Strings Interactive Lab — DSAVerse',
      linkedlist: 'Linked List Interactive Lab — DSAVerse',
      stack: 'Stack Interactive Lab — DSAVerse',
      queue: 'Queue Interactive Lab — DSAVerse',
      trees: 'Trees & BST Interactive Lab — DSAVerse',
      bst: 'BST Interactive Lab — DSAVerse',
      heap: 'Heap Interactive Lab — DSAVerse',
      hashtables: 'Hash Tables Interactive Lab — DSAVerse',
      graphs: 'Graph Algorithms Lab — DSAVerse',
      sorting: 'Sorting Speed Arena — DSAVerse',
      searching: 'Search Algorithms Lab — DSAVerse',
      dp: 'Dynamic Programming Lab — DSAVerse',
      trie: 'Trie Interactive Lab — DSAVerse',
      greedy: 'Greedy Algorithms Lab — DSAVerse',
      backtrack: 'Backtracking Algorithms Lab — DSAVerse',
    }

    document.title = titles[view] || 'DSAVerse'
  }, [view])

  function navigate(v: string) {
    let target = v as View

    // Protected Route Guard
    if (PROTECTED_VIEWS.includes(target)) {
      const token = localStorage.getItem('dsaverse-auth-token') || sessionStorage.getItem('dsaverse-auth-token')
      if (!token) {
        target = 'auth'
      }
    }

    if (target === view) return
    setTransitioning(true)

    setTimeout(() => {
      setView(target)
      setTransitioning(false)
      window.scrollTo({ top: 0, behavior: 'instant' })

      if (ROUTE_MAP[target]) {
        try {
          window.history.pushState(null, '', ROUTE_MAP[target])
        } catch {}
      }

      if (target === 'dashboard' && (view === 'auth' || view === 'landing')) {
        setTimeout(() => setAchievement({ icon: '🚀', label: 'First Steps', xp: 100 }), 600)
      }
    }, 250)
  }

  const toggleDark = () => setIsDark((d) => !d)

  const container: CSSProperties = {
    position: 'relative',
    width: '100%',
    minHeight: '100vh',
    backgroundColor: isDark ? '#05070f' : '#f0f4ff',
    transition: 'background-color 0.35s ease, color 0.35s ease',
  }

  const isDSAWorld = !['landing', 'auth', 'dashboard', 'teacher'].includes(view)

  const suspenseFallback = (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'var(--c-bg)' }}>
      <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg,#6366f1,#22d3ee)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'JetBrains Mono,monospace', fontWeight: '700', fontSize: '15px', color: 'white' }}>
        {'{}'}
      </div>
    </div>
  )

  return (
    <div style={container} className={isDark ? '' : 'light-mode'}>
      <div style={{ position: 'relative', zIndex: 1, opacity: transitioning ? 0 : 1, transform: transitioning ? 'translateY(8px)' : 'translateY(0)', transition: 'opacity 0.25s ease, transform 0.25s ease' }}>
        <ErrorBoundary>
          <Suspense fallback={suspenseFallback}>
            {view === 'landing'    && <Landing onNavigate={navigate} isDark={isDark} />}
            {view === 'auth'       && <Auth onNavigate={navigate} isDark={isDark} />}
            {view === 'dashboard'  && <Dashboard onNavigate={navigate} isDark={isDark} />}
            {view === 'teacher'    && <TeacherDashboard onNavigate={navigate} isDark={isDark} />}
            {view === 'array'      && <ArrayWorld onNavigate={navigate} isDark={isDark} onToggleDark={toggleDark} />}
            {view === 'strings'    && <StringWorld onNavigate={navigate} isDark={isDark} onToggleDark={toggleDark} />}
            {view === 'stack'      && <StackWorld onNavigate={navigate} isDark={isDark} onToggleDark={toggleDark} />}
            {view === 'queue'      && <QueueWorld onNavigate={navigate} isDark={isDark} onToggleDark={toggleDark} />}
            {view === 'linkedlist' && <LinkedListWorld onNavigate={navigate} isDark={isDark} onToggleDark={toggleDark} />}
            {view === 'trees'      && <TreeWorld onNavigate={navigate} isDark={isDark} onToggleDark={toggleDark} />}
            {view === 'bst'        && <TreeWorld onNavigate={navigate} isDark={isDark} onToggleDark={toggleDark} />}
            {view === 'graphs'     && <GraphWorld onNavigate={navigate} isDark={isDark} onToggleDark={toggleDark} />}
            {view === 'sorting'    && <SortWorld onNavigate={navigate} isDark={isDark} onToggleDark={toggleDark} />}
            {view === 'dp'         && <DPWorld onNavigate={navigate} isDark={isDark} onToggleDark={toggleDark} />}
            {view === 'searching'  && <SearchWorld onNavigate={navigate} isDark={isDark} onToggleDark={toggleDark} />}
            {view === 'heap'       && <HeapWorld onNavigate={navigate} isDark={isDark} onToggleDark={toggleDark} />}
            {view === 'trie'       && <TrieWorld onNavigate={navigate} isDark={isDark} onToggleDark={toggleDark} />}
            {view === 'greedy'     && <GreedyWorld onNavigate={navigate} isDark={isDark} onToggleDark={toggleDark} />}
            {view === 'hashtables' && <HashTableWorld onNavigate={navigate} isDark={isDark} onToggleDark={toggleDark} />}
            {view === 'backtrack'  && <BacktrackWorld onNavigate={navigate} isDark={isDark} onToggleDark={toggleDark} />}
          </Suspense>
        </ErrorBoundary>
      </div>

      <PageTransition show={transitioning} />

      {achievement && <AchievementPopup achievement={achievement} onDone={() => setAchievement(null)} />}

      {!isDSAWorld && (
        <button
          onClick={toggleDark}
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          style={{
            position: 'fixed', bottom: '28px', left: '28px', zIndex: 9998,
            width: '48px', height: '48px', borderRadius: '50%',
            background: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(99,102,241,0.12)',
            border: isDark ? '1px solid rgba(255,255,255,0.14)' : '1px solid rgba(99,102,241,0.3)',
            boxShadow: isDark ? '0 4px 24px rgba(0,0,0,0.4)' : '0 4px 24px rgba(99,102,241,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '22px', cursor: 'pointer', backdropFilter: 'blur(16px)',
            transition: 'all 0.3s cubic-bezier(0.34,1.56,0.64,1)',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.12)' }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)' }}
        >
          <span style={{ display: 'inline-block', transition: 'transform 0.5s ease', transform: isDark ? 'rotate(0deg)' : 'rotate(360deg)' }}>
            {isDark ? '🌙' : '☀️'}
          </span>
        </button>
      )}
    </div>
  )
}
