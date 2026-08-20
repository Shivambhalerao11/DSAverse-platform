import { useState, useEffect, useRef } from 'react'

interface DashboardProps {
  onNavigate: (view: string) => void
  isDark?: boolean
}

type Section = 'dashboard' | 'learning' | 'roadmap' | 'leaderboard' | 'achievements' | 'certificates' | 'bookmarks' | 'profile' | 'settings'

const worlds = [
  { id: 'array',      icon: '▦',  name: 'Array World',    progress: 17, color: '#6366f1', unlocked: true,  topics: 6 },
  { id: 'strings',    icon: '🔤', name: 'String World',   progress: 0,  color: '#22d3ee', unlocked: true,  topics: 5 },
  { id: 'stack',      icon: '📦', name: 'Stack World',    progress: 0,  color: '#f43f5e', unlocked: true,  topics: 4 },
  { id: 'queue',      icon: '🚶', name: 'Queue World',    progress: 0,  color: '#a855f7', unlocked: true,  topics: 4 },
  { id: 'linkedlist', icon: '🚂', name: 'Linked List',    progress: 0,  color: '#06b6d4', unlocked: true,  topics: 7 },
  { id: 'trees',      icon: '🌳', name: 'Tree Kingdom',   progress: 0,  color: '#10b981', unlocked: true,  topics: 9 },
  { id: 'graphs',     icon: '🕸', name: 'Graph Galaxy',   progress: 0,  color: '#8b5cf6', unlocked: true,  topics: 8 },
  { id: 'sorting',    icon: '⚡', name: 'Sorting Arena',  progress: 0,  color: '#f59e0b', unlocked: true,  topics: 6 },
  { id: 'searching',  icon: '🔎', name: 'Search World',   progress: 0,  color: '#f59e0b', unlocked: true,  topics: 4 },
  { id: 'dp',         icon: '🧩', name: 'DP World',       progress: 0,  color: '#06b6d4', unlocked: true,  topics: 5 },
]

const leaderboard = [
  { rank: 1, name: 'Sofia Cruz',    xp: 4100, streak: 30, avatar: '👩‍🎓', badge: '🏆' },
  { rank: 2, name: 'Priya Sharma',  xp: 3210, streak: 21, avatar: '👩‍💻', badge: '🥈' },
  { rank: 3, name: 'Marcus Lee',    xp: 2840, streak: 14, avatar: '🧑‍💻', badge: '🥉' },
  { rank: 4, name: 'Alex Johnson',  xp: 1960, streak: 7,  avatar: '👨‍💻', badge: null, isMe: true },
  { rank: 5, name: 'Dev Patel',     xp: 720,  streak: 2,  avatar: '👨‍🎓', badge: null },
]

const achievements = [
  { icon: '🚀', label: 'First Steps',     desc: 'Complete first lesson',  earned: true,  xp: 50   },
  { icon: '🔥', label: 'On Fire',         desc: '3-day streak',           earned: false, xp: 100  },
  { icon: '⚡', label: 'Speed Learner',   desc: '5 topics in a day',      earned: false, xp: 200  },
  { icon: '🏆', label: 'World Conqueror', desc: 'Complete a World',       earned: false, xp: 500  },
  { icon: '💎', label: 'Diamond',         desc: '30-day streak',          earned: false, xp: 1000 },
  { icon: '🎓', label: 'Certified',       desc: 'Earn first certificate', earned: false, xp: 300  },
]

const recommended = [
  { icon: '▦',  title: 'Binary Search',         world: 'Array World',  worldId: 'array',      difficulty: 'Medium', xp: 75,  color: '#6366f1' },
  { icon: '🔤', title: 'Two Pointers',           world: 'String World', worldId: 'strings',    difficulty: 'Medium', xp: 80,  color: '#22d3ee' },
  { icon: '📦', title: 'Balanced Parentheses',   world: 'Stack World',  worldId: 'stack',      difficulty: 'Easy',   xp: 50,  color: '#f43f5e' },
]

const roadmapSteps = [
  { id: 1, label: 'Arrays',        done: true,  color: '#6366f1', worldId: 'array'      },
  { id: 2, label: 'Strings',       done: false, color: '#22d3ee', worldId: 'strings'    },
  { id: 3, label: 'Stack & Queue', done: false, color: '#f43f5e', worldId: 'stack'      },
  { id: 4, label: 'Linked Lists',  done: false, color: '#06b6d4', worldId: 'linkedlist' },
  { id: 5, label: 'Trees',         done: false, color: '#10b981', worldId: 'trees'      },
  { id: 6, label: 'Graphs',        done: false, color: '#8b5cf6', worldId: 'graphs'     },
  { id: 7, label: 'Sorting',       done: false, color: '#f59e0b', worldId: 'sorting'    },
  { id: 8, label: 'Searching',     done: false, color: '#f59e0b', worldId: 'searching'  },
  { id: 9, label: 'DP',            done: false, color: '#06b6d4', worldId: 'dp'         },
]

const sideNavItems: { id: Section; icon: string; label: string }[] = [
  { id: 'dashboard',    icon: '◻',  label: 'Dashboard'    },
  { id: 'learning',     icon: '📚', label: 'My Learning'  },
  { id: 'roadmap',      icon: '🗺', label: 'Roadmap'      },
  { id: 'leaderboard',  icon: '🏆', label: 'Leaderboard'  },
  { id: 'achievements', icon: '🎖', label: 'Achievements' },
  { id: 'certificates', icon: '📜', label: 'Certificates' },
  { id: 'bookmarks',    icon: '🔖', label: 'Bookmarks'    },
  { id: 'profile',      icon: '👤', label: 'Profile'      },
  { id: 'settings',     icon: '⚙',  label: 'Settings'     },
]

const searchData = [
  { label: 'Array Traversal',     world: 'Array World',   worldId: 'array',      icon: '▦'  },
  { label: 'Binary Search',       world: 'Array World',   worldId: 'array',      icon: '▦'  },
  { label: 'Bubble Sort',         world: 'Sorting Arena', worldId: 'sorting',    icon: '⚡' },
  { label: 'Tree BFS',            world: 'Tree Kingdom',  worldId: 'trees',      icon: '🌳' },
  { label: 'Graph DFS',           world: 'Graph Galaxy',  worldId: 'graphs',     icon: '🕸' },
  { label: 'Linked List Reverse', world: 'Linked List',   worldId: 'linkedlist', icon: '🚂' },
  { label: 'Stack Push/Pop',      world: 'Stack World',   worldId: 'stack',      icon: '📦' },
  { label: 'Queue Enqueue',       world: 'Queue World',   worldId: 'queue',      icon: '🚶' },
  { label: 'LCS',                 world: 'DP World',      worldId: 'dp',         icon: '🧩' },
  { label: 'Palindrome Check',    world: 'String World',  worldId: 'strings',    icon: '🔤' },
]

export default function Dashboard({ onNavigate, isDark = true }: DashboardProps) {
  const [activeSection, setActiveSection] = useState<Section>('dashboard')
  const [notifOpen, setNotifOpen]     = useState(false)
  const [searchOpen, setSearchOpen]   = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [settingsToggles, setSettingsToggles] = useState({ emailNotif: true, soundFx: true, autoplay: false, hints: true })
  const notifRef   = useRef<HTMLDivElement>(null)
  const profileRef = useRef<HTMLDivElement>(null)

  const notifications = [
    { icon: '⚡', msg: 'You earned +50 XP for completing Traversal!', time: '2h ago', color: '#f59e0b' },
    { icon: '🔥', msg: 'Day 1 streak! Keep going tomorrow.',           time: '3h ago', color: '#f43f5e' },
    { icon: '🎉', msg: "Welcome to DSAverse! You're all set.",          time: '1d ago', color: '#10b981' },
  ]

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false)
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  // Close search on Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') { setSearchOpen(false); setSearchQuery('') }
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setSearchOpen(true) }
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [])

  const filteredSearch = searchData.filter((d) =>
    d.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.world.toLowerCase().includes(searchQuery.toLowerCase())
  )

  function navigateToSection(id: Section) {
    setActiveSection(id)
    setSidebarOpen(false)
  }

  return (
    <div
      style={{
        background: 'var(--c-bg)', minHeight: '100vh', fontFamily: 'Inter, sans-serif',
        color: 'var(--c-text-1)', display: 'flex', flexDirection: 'column',
        transition: 'background 0.35s ease',
      }}
    >
      {/* Mobile overlay for sidebar */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
            zIndex: 49,
          }}
          aria-hidden="true"
        />
      )}

      <div style={{ display: 'flex', flex: 1 }}>
        {/* ── Sidebar ── */}
        <aside
          className={`dash-sidebar${sidebarOpen ? ' open' : ''}`}
          style={{
            width: '240px', flexShrink: 0, borderRight: '1px solid var(--c-border)',
            padding: '20px 14px', background: 'var(--c-surface)',
            position: 'sticky', top: 0, height: '100vh', overflowY: 'auto',
            display: 'flex', flexDirection: 'column', gap: '4px', zIndex: 50,
          }}
        >
          {/* Logo */}
          <button
            onClick={() => onNavigate('landing')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px 10px', marginBottom: '12px', textAlign: 'left' }}
          >
            <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: '700', fontSize: '18px', color: 'var(--c-text-1)', letterSpacing: '-0.04em' }}>
              DSA<span style={{ color: '#818cf8' }}>verse</span>
            </span>
          </button>

          {/* Search trigger */}
          <button
            onClick={() => setSearchOpen(true)}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px', padding: '9px 12px',
              borderRadius: '10px', background: 'var(--c-card-2)', border: '1px solid var(--c-border-med)',
              color: 'var(--c-text-4)', cursor: 'pointer', fontSize: '13px',
              fontFamily: 'Inter, sans-serif', marginBottom: '8px', width: '100%', transition: 'all 0.2s',
            }}
            aria-label="Search topics"
          >
            <span>🔍</span>
            <span style={{ flex: 1, textAlign: 'left' }}>Search topics...</span>
            <span style={{ fontSize: '10px', background: 'var(--c-input)', padding: '2px 5px', borderRadius: '4px', fontFamily: 'JetBrains Mono, monospace' }}>⌘K</span>
          </button>

          {sideNavItems.map((item) => (
            <button
              key={item.id}
              onClick={() => navigateToSection(item.id)}
              aria-current={activeSection === item.id ? 'page' : undefined}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 12px',
                borderRadius: '10px',
                background: activeSection === item.id ? 'rgba(99,102,241,0.15)' : 'transparent',
                border: activeSection === item.id ? '1px solid rgba(99,102,241,0.3)' : '1px solid transparent',
                color: activeSection === item.id ? '#818cf8' : 'var(--c-text-3)',
                cursor: 'pointer', fontSize: '14px',
                fontWeight: activeSection === item.id ? '600' : '400',
                fontFamily: 'Inter, sans-serif', textAlign: 'left', width: '100%', transition: 'all 0.15s',
              }}
              onMouseEnter={(e) => { if (activeSection !== item.id) { e.currentTarget.style.background = 'var(--c-card-2)'; e.currentTarget.style.color = 'var(--c-text-1)' } }}
              onMouseLeave={(e) => { if (activeSection !== item.id) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--c-text-3)' } }}
            >
              <span style={{ fontSize: '15px' }}>{item.icon}</span>
              {item.label}
              {item.id === 'leaderboard' && (
                <span style={{ marginLeft: 'auto', fontSize: '10px', background: 'rgba(245,158,11,0.15)', color: '#f59e0b', padding: '1px 5px', borderRadius: '4px' }}>#4</span>
              )}
            </button>
          ))}

          {/* Teacher mode */}
          <button
            onClick={() => onNavigate('teacher')}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px', padding: '9px 12px',
              borderRadius: '10px', background: 'transparent',
              border: '1px solid rgba(16,185,129,0.2)', color: '#10b981',
              cursor: 'pointer', fontSize: '13px', fontFamily: 'Inter, sans-serif',
              marginTop: '8px', width: '100%', transition: 'all 0.15s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(16,185,129,0.08)' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
          >
            <span>👩‍🏫</span>
            <span>Teacher Mode</span>
          </button>

          {/* XP + streak widget */}
          <div style={{ marginTop: 'auto', padding: '14px', background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <span style={{ fontSize: '12px', color: '#818cf8', fontWeight: '700' }}>Level 1 · Novice</span>
              <span style={{ fontSize: '11px', color: 'var(--c-text-4)', fontFamily: 'JetBrains Mono, monospace' }}>160 / 500</span>
            </div>
            <div className="progress-track" style={{ marginBottom: '10px' }}>
              <div style={{ width: '32%', height: '100%', background: 'linear-gradient(90deg, #6366f1, #a855f7)', borderRadius: '2px' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', color: '#f43f5e' }}>🔥 1 day streak</span>
              <span style={{ fontSize: '11px', color: 'var(--c-text-4)' }}>160 XP</span>
            </div>
          </div>
        </aside>

        {/* ── Main ── */}
        <main style={{ flex: 1, overflowY: 'auto', minWidth: 0 }}>

          {/* Top bar */}
          <div style={{ position: 'sticky', top: 0, zIndex: 20, padding: '0 24px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--c-nav)', borderBottom: '1px solid var(--c-border)', backdropFilter: 'blur(16px)' }}>
            {/* Mobile hamburger + Breadcrumb */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button
                className="dash-hamburger"
                onClick={() => setSidebarOpen((o) => !o)}
                style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', color: 'var(--c-text-2)', padding: '4px' }}
                aria-label="Toggle sidebar"
              >
                ☰
              </button>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--c-text-4)' }}>
                <span>Dashboard</span>
                <span>/</span>
                <span style={{ color: 'var(--c-text-1)', fontWeight: '600', textTransform: 'capitalize' }}>{activeSection}</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              {/* Search */}
              <button
                onClick={() => setSearchOpen(true)}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--c-card-2)', border: '1px solid var(--c-border-med)', borderRadius: '10px', padding: '7px 14px', color: 'var(--c-text-3)', cursor: 'pointer', fontSize: '13px', fontFamily: 'Inter, sans-serif', width: '200px', transition: 'all 0.2s' }}
                aria-label="Search"
              >
                <span>🔍</span>
                <span style={{ flex: 1, textAlign: 'left' }}>Search...</span>
                <span style={{ fontSize: '10px', background: 'var(--c-input)', padding: '1px 5px', borderRadius: '3px', fontFamily: 'JetBrains Mono, monospace' }}>⌘K</span>
              </button>

              {/* Notifications */}
              <div ref={notifRef} style={{ position: 'relative' }}>
                <button
                  onClick={() => { setNotifOpen((o) => !o); setProfileOpen(false) }}
                  style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'var(--c-card-2)', border: '1px solid var(--c-border-med)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '16px', position: 'relative' }}
                  aria-label="Notifications"
                >
                  🔔
                  <span style={{ position: 'absolute', top: '6px', right: '6px', width: '7px', height: '7px', borderRadius: '50%', background: '#f43f5e', border: '1.5px solid var(--c-bg)' }} />
                </button>
                {notifOpen && (
                  <div style={{ position: 'absolute', right: 0, top: '44px', width: '320px', background: 'var(--c-dropdown)', border: '1px solid var(--c-border-med)', borderRadius: '14px', boxShadow: '0 24px 60px rgba(0,0,0,0.5)', zIndex: 50, overflow: 'hidden' }}>
                    <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--c-border)', fontSize: '14px', fontWeight: '700', color: 'var(--c-text-1)', display: 'flex', justifyContent: 'space-between' }}>
                      <span>Notifications</span>
                      <button onClick={() => setNotifOpen(false)} style={{ fontSize: '11px', color: '#6366f1', cursor: 'pointer', background: 'none', border: 'none', fontFamily: 'Inter, sans-serif' }}>Mark all read</button>
                    </div>
                    {notifications.map((n, i) => (
                      <div key={i} style={{ padding: '12px 16px', borderBottom: '1px solid var(--c-border-sub)', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                        <span style={{ fontSize: '18px' }}>{n.icon}</span>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '13px', color: 'var(--c-text-2)', lineHeight: '1.5', marginBottom: '2px' }}>{n.msg}</div>
                          <div style={{ fontSize: '11px', color: 'var(--c-text-5)' }}>{n.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Profile */}
              <div ref={profileRef} style={{ position: 'relative' }}>
                <button
                  onClick={() => { setProfileOpen((o) => !o); setNotifOpen(false) }}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--c-card-2)', border: '1px solid var(--c-border-med)', borderRadius: '10px', padding: '6px 10px', cursor: 'pointer', fontFamily: 'Inter, sans-serif', transition: 'all 0.2s' }}
                  aria-label="Profile menu"
                >
                  <div style={{ width: '26px', height: '26px', borderRadius: '8px', background: 'linear-gradient(135deg, #6366f1, #a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>👨‍💻</div>
                  <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--c-text-1)' }}>Alex</span>
                  <span style={{ fontSize: '10px', color: 'var(--c-text-4)' }}>▾</span>
                </button>
                {profileOpen && (
                  <div style={{ position: 'absolute', right: 0, top: '44px', width: '200px', background: 'var(--c-dropdown)', border: '1px solid var(--c-border-med)', borderRadius: '12px', boxShadow: '0 24px 60px rgba(0,0,0,0.5)', zIndex: 50, overflow: 'hidden', padding: '8px' }}>
                    {[
                      { icon: '👤', label: 'View Profile',    section: 'profile'      as Section },
                      { icon: '🎖', label: 'Achievements',    section: 'achievements' as Section },
                      { icon: '📜', label: 'Certificates',    section: 'certificates' as Section },
                      { icon: '⚙',  label: 'Settings',        section: 'settings'     as Section },
                    ].map((item) => (
                      <button
                        key={item.label}
                        onClick={() => { navigateToSection(item.section); setProfileOpen(false) }}
                        style={{ display: 'flex', gap: '10px', alignItems: 'center', width: '100%', padding: '9px 10px', borderRadius: '8px', background: 'none', border: 'none', color: 'var(--c-text-3)', cursor: 'pointer', fontSize: '13px', fontFamily: 'Inter, sans-serif', transition: 'all 0.15s' }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--c-card-2)'; e.currentTarget.style.color = 'var(--c-text-1)' }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--c-text-3)' }}
                      >
                        <span>{item.icon}</span>{item.label}
                      </button>
                    ))}
                    <div style={{ height: '1px', background: 'var(--c-border)', margin: '4px 0' }} />
                    <button
                      onClick={() => onNavigate('auth')}
                      style={{ display: 'flex', gap: '10px', alignItems: 'center', width: '100%', padding: '9px 10px', borderRadius: '8px', background: 'none', border: 'none', color: '#f43f5e', cursor: 'pointer', fontSize: '13px', fontFamily: 'Inter, sans-serif', transition: 'all 0.15s' }}
                    >
                      <span>🚪</span> Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── Section Content ── */}
          <div style={{ padding: '28px' }}>

            {/* ── DASHBOARD OVERVIEW ── */}
            {activeSection === 'dashboard' && (
              <>
                <div style={{ marginBottom: '28px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <h1 className="font-display" style={{ fontSize: '26px', fontWeight: '800', color: 'var(--c-text-1)', letterSpacing: '-0.035em', lineHeight: '1.1', marginBottom: '4px' }}>
                      Welcome back, Alex 👋
                    </h1>
                    <p style={{ fontSize: '14px', color: 'var(--c-text-3)' }}>
                      {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} · 1 day streak 🔥
                    </p>
                  </div>
                  <button onClick={() => onNavigate('array')} className="btn-primary" style={{ padding: '9px 20px', fontSize: '14px', flexShrink: 0 }}>
                    Continue Learning →
                  </button>
                </div>

                {/* Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '24px' }} className="grid-responsive-4">
                  {[
                    { label: 'XP Earned',   value: '160', icon: '⚡', color: '#f59e0b', sub: '340 to Level 2' },
                    { label: 'Topics Done', value: '1',   icon: '✓',  color: '#10b981', sub: 'of 58 total'   },
                    { label: 'Day Streak',  value: '1',   icon: '🔥', color: '#f43f5e', sub: 'Best: 1'        },
                    { label: 'Global Rank', value: '#4',  icon: '🏆', color: '#a855f7', sub: 'Top 10%'        },
                  ].map((s) => (
                    <div key={s.label} className="stat-card" style={{ '--stat-accent': `linear-gradient(90deg,${s.color},${s.color}88)` } as React.CSSProperties}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                        <span style={{ fontSize: '20px' }}>{s.icon}</span>
                        <span style={{ fontSize: '11px', color: 'var(--c-text-5)' }}>{s.sub}</span>
                      </div>
                      <div className="font-display" style={{ fontSize: '27px', fontWeight: '800', color: 'var(--c-text-1)', letterSpacing: '-0.04em', lineHeight: '1' }}>{s.value}</div>
                      <div style={{ fontSize: '12px', color: 'var(--c-text-4)', marginTop: '4px' }}>{s.label}</div>
                    </div>
                  ))}
                </div>

                {/* Continue learning + streak */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '16px', marginBottom: '24px' }} className="grid-responsive-2">
                  <div style={{ background: 'linear-gradient(135deg,rgba(99,102,241,0.12),rgba(99,102,241,0.03))', border: '1px solid rgba(99,102,241,0.25)', borderRadius: '16px', padding: '24px', cursor: 'pointer' }} onClick={() => onNavigate('array')}>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                      <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px', flexShrink: 0 }}>▦</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                          <span style={{ fontSize: '16px', fontWeight: '700', color: 'var(--c-text-1)' }}>Array World</span>
                          <span style={{ fontSize: '10px', background: 'rgba(16,185,129,0.15)', color: '#10b981', border: '1px solid rgba(16,185,129,0.3)', padding: '2px 7px', borderRadius: '100px' }}>In Progress</span>
                        </div>
                        <div style={{ fontSize: '13px', color: 'var(--c-text-3)', marginBottom: '10px' }}>Next: Linear Search → 50 XP awaiting</div>
                        <div className="progress-track" style={{ maxWidth: '300px' }}>
                          <div style={{ width: '17%', height: '100%', background: 'linear-gradient(90deg,#6366f1,#8b5cf6)', borderRadius: '2px' }} />
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--c-text-4)', marginTop: '4px' }}>1 of 6 topics · 17%</div>
                      </div>
                      <span style={{ fontSize: '14px', color: '#818cf8', fontWeight: '600', flexShrink: 0 }}>Continue →</span>
                    </div>
                  </div>

                  <div style={{ background: 'var(--c-card)', border: '1px solid var(--c-border)', borderRadius: '16px', padding: '20px' }}>
                    <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--c-text-1)', marginBottom: '4px' }}>Daily Streak</div>
                    <div style={{ fontSize: '12px', color: 'var(--c-text-4)', marginBottom: '16px' }}>Keep learning every day!</div>
                    <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', marginBottom: '14px' }}>
                      {['M','T','W','T','F','S','S'].map((day, i) => (
                        <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                          <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: i===3?'rgba(244,63,94,0.25)':i<3?'var(--c-card-2)':'var(--c-card)', border:`1px solid ${i===3?'rgba(244,63,94,0.5)':'var(--c-border)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px' }}>
                            {i===3?'🔥':i<3?'✓':'·'}
                          </div>
                          <span style={{ fontSize: '9px', color: 'var(--c-text-5)' }}>{day}</span>
                        </div>
                      ))}
                    </div>
                    <div style={{ textAlign: 'center', fontSize: '20px', fontWeight: '800', color: '#f43f5e' }}>1 🔥</div>
                    <div style={{ textAlign: 'center', fontSize: '11px', color: 'var(--c-text-4)', marginTop: '2px' }}>day streak</div>
                  </div>
                </div>

                {/* Worlds + Leaderboard */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '16px', marginBottom: '24px' }} className="grid-responsive-2">
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                      <h2 style={{ fontSize: '17px', fontWeight: '700', color: 'var(--c-text-1)' }}>All Worlds</h2>
                      <span style={{ fontSize: '12px', color: 'var(--c-text-4)' }}>10 of 10 unlocked</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                      {worlds.map((world) => (
                        <button
                          key={world.id}
                          onClick={() => onNavigate(world.id)}
                          style={{ background: 'var(--c-card-2)', border: '1px solid var(--c-border-med)', borderRadius: '12px', padding: '14px 12px', cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s ease', fontFamily: 'Inter, sans-serif' }}
                          onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.borderColor = world.color + '60'; e.currentTarget.style.boxShadow = `0 8px 24px ${world.color}20` }}
                          onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'var(--c-border-med)'; e.currentTarget.style.boxShadow = 'none' }}
                        >
                          <div style={{ fontSize: '22px', marginBottom: '6px' }}>{world.icon}</div>
                          <div style={{ fontSize: '11px', fontWeight: '600', color: 'var(--c-text-2)', marginBottom: '6px', lineHeight: '1.3' }}>{world.name}</div>
                          <div style={{ height: '2px', background: 'var(--c-input)', borderRadius: '1px' }}>
                            <div style={{ width: `${world.progress}%`, height: '100%', background: world.color, borderRadius: '1px', opacity: 0.8 }} />
                          </div>
                          <div style={{ fontSize: '10px', color: 'var(--c-text-5)', marginTop: '3px' }}>{world.progress}%</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div style={{ background: 'var(--c-card)', border: '1px solid var(--c-border)', borderRadius: '16px', padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <h3 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--c-text-1)' }}>Leaderboard</h3>
                      <button onClick={() => navigateToSection('leaderboard')} style={{ fontSize: '11px', color: '#818cf8', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>See all →</button>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {leaderboard.map((p) => (
                        <div key={p.rank} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 10px', borderRadius: '10px', background: p.isMe ? 'rgba(99,102,241,0.1)' : p.rank===1 ? 'rgba(245,158,11,0.06)' : 'transparent', border: p.isMe ? '1px solid rgba(99,102,241,0.25)' : '1px solid transparent' }}>
                          <span style={{ fontSize: '16px', width: '20px', textAlign: 'center' }}>{p.badge || `#${p.rank}`}</span>
                          <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: 'rgba(99,102,241,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 }}>{p.avatar}</div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: '12px', fontWeight: p.isMe?'700':'500', color: p.isMe?'#818cf8':'var(--c-text-2)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}{p.isMe && ' (You)'}</div>
                            <div style={{ fontSize: '10px', color: 'var(--c-text-5)' }}>🔥 {p.streak}d streak</div>
                          </div>
                          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', color: '#f59e0b', fontWeight: '700', flexShrink: 0 }}>{p.xp.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Recommended + Achievements */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }} className="grid-responsive-2">
                  <div style={{ background: 'var(--c-card)', border: '1px solid var(--c-border)', borderRadius: '16px', padding: '20px' }}>
                    <h3 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--c-text-1)', marginBottom: '16px' }}>Recommended for You</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {recommended.map((r) => (
                        <button key={r.title} onClick={() => onNavigate(r.worldId)} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '12px', background: 'var(--c-card-2)', border: '1px solid var(--c-border)', cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'Inter, sans-serif', textAlign: 'left', width: '100%' }}
                          onMouseEnter={(e) => { e.currentTarget.style.borderColor = r.color+'50'; e.currentTarget.style.background = `${r.color}08` }}
                          onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--c-border)'; e.currentTarget.style.background = 'var(--c-card-2)' }}
                        >
                          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: `${r.color}18`, border: `1px solid ${r.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>{r.icon}</div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--c-text-1)', marginBottom: '2px' }}>{r.title}</div>
                            <div style={{ fontSize: '11px', color: 'var(--c-text-4)' }}>{r.world}</div>
                          </div>
                          <div style={{ textAlign: 'right', flexShrink: 0 }}>
                            <span style={{ fontSize: '11px', background: r.difficulty==='Easy'?'rgba(16,185,129,0.12)':'rgba(245,158,11,0.12)', color: r.difficulty==='Easy'?'#10b981':'#f59e0b', padding: '2px 7px', borderRadius: '100px', display: 'block', marginBottom: '2px' }}>{r.difficulty}</span>
                            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: '#f59e0b' }}>+{r.xp} XP</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div style={{ background: 'var(--c-card)', border: '1px solid var(--c-border)', borderRadius: '16px', padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <h3 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--c-text-1)' }}>Achievements</h3>
                      <button onClick={() => navigateToSection('achievements')} style={{ fontSize: '11px', color: '#818cf8', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>1 of 6 →</button>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                      {achievements.map((a) => (
                        <div key={a.label} style={{ padding: '12px 10px', borderRadius: '10px', background: a.earned?'rgba(245,158,11,0.08)':'var(--c-card-2)', border:`1px solid ${a.earned?'rgba(245,158,11,0.3)':'var(--c-border-sub)'}`, opacity: a.earned?1:0.45, textAlign: 'center' }} title={a.desc}>
                          <div style={{ fontSize: '22px', marginBottom: '5px' }}>{a.icon}</div>
                          <div style={{ fontSize: '10px', fontWeight: '700', color: a.earned?'#fbbf24':'var(--c-text-5)', lineHeight: '1.3', marginBottom: '2px' }}>{a.label}</div>
                          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: 'var(--c-text-5)' }}>+{a.xp} XP</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* ── MY LEARNING ── */}
            {activeSection === 'learning' && (
              <>
                <h1 className="font-display" style={{ fontSize: '24px', fontWeight: '800', color: 'var(--c-text-1)', letterSpacing: '-0.03em', marginBottom: '24px' }}>My Learning</h1>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {worlds.map((world) => (
                    <button
                      key={world.id}
                      onClick={() => onNavigate(world.id)}
                      style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '18px 20px', borderRadius: '14px', background: 'var(--c-card)', border: '1px solid var(--c-border)', cursor: 'pointer', textAlign: 'left', fontFamily: 'Inter, sans-serif', width: '100%', transition: 'all 0.2s' }}
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = world.color+'50'; e.currentTarget.style.transform = 'translateX(4px)' }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--c-border)'; e.currentTarget.style.transform = 'translateX(0)' }}
                    >
                      <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: `${world.color}18`, border: `1px solid ${world.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0 }}>{world.icon}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '15px', fontWeight: '700', color: 'var(--c-text-1)', marginBottom: '4px' }}>{world.name}</div>
                        <div style={{ fontSize: '12px', color: 'var(--c-text-4)', marginBottom: '8px' }}>{world.topics} topics</div>
                        <div className="progress-track">
                          <div style={{ width: `${world.progress}%`, height: '100%', background: world.color, borderRadius: '2px', minWidth: world.progress>0?'4px':'0' }} />
                        </div>
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <div style={{ fontSize: '18px', fontWeight: '800', color: world.color, fontFamily: 'JetBrains Mono, monospace' }}>{world.progress}%</div>
                        <div style={{ fontSize: '11px', color: 'var(--c-text-5)', marginTop: '2px' }}>{world.progress===0?'Not started':world.progress===100?'Complete':'In progress'}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </>
            )}

            {/* ── ROADMAP ── */}
            {activeSection === 'roadmap' && (
              <>
                <h1 className="font-display" style={{ fontSize: '24px', fontWeight: '800', color: 'var(--c-text-1)', letterSpacing: '-0.03em', marginBottom: '8px' }}>Learning Roadmap</h1>
                <p style={{ fontSize: '14px', color: 'var(--c-text-3)', marginBottom: '32px' }}>Follow this sequence for the most effective DSA learning path.</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                  {roadmapSteps.map((step, i) => (
                    <div key={step.id} style={{ display: 'flex', gap: '20px', paddingBottom: i < roadmapSteps.length-1 ? '0' : '0' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                        <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: step.done?`${step.color}25`:'var(--c-card-2)', border: `2px solid ${step.done?step.color:'var(--c-border-med)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '700', color: step.done?step.color:'var(--c-text-4)', fontFamily: 'JetBrains Mono, monospace', flexShrink: 0 }}>
                          {step.done ? '✓' : step.id}
                        </div>
                        {i < roadmapSteps.length-1 && <div style={{ width: '2px', flex: 1, minHeight: '32px', background: step.done?`${step.color}40`:'var(--c-border)', margin: '4px 0' }} />}
                      </div>
                      <div style={{ flex: 1, padding: '10px 0 32px' }}>
                        <div style={{ fontSize: '17px', fontWeight: '700', color: step.done?'var(--c-text-1)':'var(--c-text-3)', marginBottom: '4px' }}>{step.label}</div>
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                          {step.done && <span style={{ fontSize: '12px', color: '#10b981', fontWeight: '600' }}>✓ Completed</span>}
                          {!step.done && <span style={{ fontSize: '12px', color: 'var(--c-text-5)' }}>Not started</span>}
                          <button onClick={() => onNavigate(step.worldId)} style={{ fontSize: '12px', color: step.color, background: `${step.color}10`, border: `1px solid ${step.color}30`, borderRadius: '6px', padding: '3px 10px', cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontWeight: '600' }}>
                            {step.done ? 'Review →' : 'Start →'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* ── LEADERBOARD ── */}
            {activeSection === 'leaderboard' && (
              <>
                <h1 className="font-display" style={{ fontSize: '24px', fontWeight: '800', color: 'var(--c-text-1)', letterSpacing: '-0.03em', marginBottom: '24px' }}>Leaderboard</h1>
                <div style={{ background: 'var(--c-card)', border: '1px solid var(--c-border)', borderRadius: '16px', overflow: 'hidden' }}>
                  <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--c-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--c-text-1)' }}>Global Rankings</span>
                    <span style={{ fontSize: '12px', color: 'var(--c-text-4)' }}>This week</span>
                  </div>
                  {leaderboard.map((p, i) => (
                    <div key={p.rank} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '16px 20px', borderBottom: i<leaderboard.length-1?'1px solid var(--c-border-sub)':'none', background: p.isMe?'rgba(99,102,241,0.06)':'transparent' }}>
                      <span style={{ fontSize: '20px', width: '28px', textAlign: 'center', flexShrink: 0, display: 'inline-block' }}>
                        {p.badge ? p.badge : <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', color: 'var(--c-text-4)' }}>#{p.rank}</span>}
                      </span>                      <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(99,102,241,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>{p.avatar}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '15px', fontWeight: p.isMe?'700':'500', color: p.isMe?'#818cf8':'var(--c-text-1)' }}>{p.name}{p.isMe && ' (You)'}</div>
                        <div style={{ fontSize: '12px', color: 'var(--c-text-4)' }}>🔥 {p.streak} day streak</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '16px', fontWeight: '700', color: '#f59e0b' }}>{p.xp.toLocaleString()} XP</div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* ── ACHIEVEMENTS ── */}
            {activeSection === 'achievements' && (
              <>
                <h1 className="font-display" style={{ fontSize: '24px', fontWeight: '800', color: 'var(--c-text-1)', letterSpacing: '-0.03em', marginBottom: '8px' }}>Achievements</h1>
                <p style={{ fontSize: '14px', color: 'var(--c-text-3)', marginBottom: '28px' }}>1 of {achievements.length} earned · Keep learning to unlock more!</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }} className="grid-responsive-3">
                  {achievements.map((a) => (
                    <div key={a.label} style={{ padding: '24px 20px', borderRadius: '16px', background: a.earned?'rgba(245,158,11,0.08)':'var(--c-card)', border:`1px solid ${a.earned?'rgba(245,158,11,0.3)':'var(--c-border)'}`, opacity: a.earned?1:0.5, textAlign: 'center', transition: 'all 0.2s' }}>
                      <div style={{ fontSize: '40px', marginBottom: '12px' }}>{a.icon}</div>
                      <div style={{ fontSize: '15px', fontWeight: '700', color: a.earned?'#fbbf24':'var(--c-text-2)', marginBottom: '6px' }}>{a.label}</div>
                      <div style={{ fontSize: '13px', color: 'var(--c-text-4)', marginBottom: '10px', lineHeight: '1.5' }}>{a.desc}</div>
                      <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', color: a.earned?'#f59e0b':'var(--c-text-5)', fontWeight: '700' }}>+{a.xp} XP</div>
                      {a.earned && <div style={{ marginTop: '8px', fontSize: '12px', color: '#10b981', fontWeight: '600' }}>✓ Earned</div>}
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* ── CERTIFICATES ── */}
            {activeSection === 'certificates' && (
              <>
                <h1 className="font-display" style={{ fontSize: '24px', fontWeight: '800', color: 'var(--c-text-1)', letterSpacing: '-0.03em', marginBottom: '24px' }}>Certificates</h1>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '80px 24px', background: 'var(--c-card)', borderRadius: '20px', border: '1px solid var(--c-border)', gap: '16px' }}>
                  <div style={{ fontSize: '64px', opacity: 0.3 }}>📜</div>
                  <div style={{ fontSize: '20px', fontWeight: '700', color: 'var(--c-text-2)' }}>No certificates yet</div>
                  <div style={{ fontSize: '15px', color: 'var(--c-text-4)', textAlign: 'center', maxWidth: '380px', lineHeight: '1.7' }}>
                    Complete a full DSA World to earn your first verified certificate. Share it on LinkedIn or add it to your portfolio!
                  </div>
                  <button onClick={() => onNavigate('array')} className="btn-primary" style={{ padding: '11px 28px', fontSize: '15px', marginTop: '8px' }}>
                    Start Array World →
                  </button>
                </div>
              </>
            )}

            {/* ── BOOKMARKS ── */}
            {activeSection === 'bookmarks' && (
              <>
                <h1 className="font-display" style={{ fontSize: '24px', fontWeight: '800', color: 'var(--c-text-1)', letterSpacing: '-0.03em', marginBottom: '24px' }}>Bookmarks</h1>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '80px 24px', background: 'var(--c-card)', borderRadius: '20px', border: '1px solid var(--c-border)', gap: '16px' }}>
                  <div style={{ fontSize: '64px', opacity: 0.3 }}>🔖</div>
                  <div style={{ fontSize: '20px', fontWeight: '700', color: 'var(--c-text-2)' }}>No bookmarks yet</div>
                  <div style={{ fontSize: '15px', color: 'var(--c-text-4)', textAlign: 'center', maxWidth: '380px', lineHeight: '1.7' }}>
                    Bookmark topics inside any DSA World to save them for later review.
                  </div>
                  <button onClick={() => navigateToSection('learning')} className="btn-secondary" style={{ padding: '11px 28px', fontSize: '15px', marginTop: '8px' }}>
                    Explore Worlds
                  </button>
                </div>
              </>
            )}

            {/* ── PROFILE ── */}
            {activeSection === 'profile' && (
              <>
                <h1 className="font-display" style={{ fontSize: '24px', fontWeight: '800', color: 'var(--c-text-1)', letterSpacing: '-0.03em', marginBottom: '28px' }}>Profile</h1>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }} className="grid-responsive-2">
                  <div style={{ background: 'var(--c-card)', border: '1px solid var(--c-border)', borderRadius: '16px', padding: '28px' }}>
                    <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '24px' }}>
                      <div style={{ width: '72px', height: '72px', borderRadius: '20px', background: 'linear-gradient(135deg,#6366f1,#a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', flexShrink: 0 }}>👨‍💻</div>
                      <div>
                        <div style={{ fontSize: '20px', fontWeight: '800', color: 'var(--c-text-1)', marginBottom: '4px' }}>Alex Johnson</div>
                        <div style={{ fontSize: '13px', color: 'var(--c-text-4)' }}>alex@example.com</div>
                        <div style={{ fontSize: '12px', color: '#818cf8', marginTop: '4px', fontWeight: '600' }}>Level 1 · Novice</div>
                      </div>
                    </div>
                    {[
                      { label: 'Full Name', value: 'Alex Johnson' },
                      { label: 'Email',     value: 'alex@example.com' },
                      { label: 'Role',      value: 'Student' },
                      { label: 'Joined',    value: 'August 2026' },
                    ].map((field) => (
                      <div key={field.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--c-border)' }}>
                        <span style={{ fontSize: '13px', color: 'var(--c-text-4)' }}>{field.label}</span>
                        <span style={{ fontSize: '13px', color: 'var(--c-text-1)', fontWeight: '500' }}>{field.value}</span>
                      </div>
                    ))}
                    <button className="btn-primary" style={{ marginTop: '20px', width: '100%', padding: '10px', fontSize: '14px' }}>
                      Edit Profile
                    </button>
                  </div>
                  <div style={{ background: 'var(--c-card)', border: '1px solid var(--c-border)', borderRadius: '16px', padding: '28px' }}>
                    <div style={{ fontSize: '15px', fontWeight: '700', color: 'var(--c-text-1)', marginBottom: '20px' }}>Stats</div>
                    {[
                      { label: 'XP Earned',      value: '160 XP',  icon: '⚡', color: '#f59e0b' },
                      { label: 'Topics Completed',value: '1',       icon: '✓',  color: '#10b981' },
                      { label: 'Day Streak',      value: '1 day',   icon: '🔥', color: '#f43f5e' },
                      { label: 'Global Rank',     value: '#4',      icon: '🏆', color: '#a855f7' },
                      { label: 'Achievements',    value: '1 / 6',   icon: '🎖', color: '#f59e0b' },
                      { label: 'Certificates',    value: '0',       icon: '📜', color: '#22d3ee' },
                    ].map((s) => (
                      <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 0', borderBottom: '1px solid var(--c-border-sub)' }}>
                        <span style={{ fontSize: '18px' }}>{s.icon}</span>
                        <span style={{ flex: 1, fontSize: '14px', color: 'var(--c-text-2)' }}>{s.label}</span>
                        <span style={{ fontSize: '14px', fontWeight: '700', color: s.color, fontFamily: 'JetBrains Mono, monospace' }}>{s.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* ── SETTINGS ── */}
            {activeSection === 'settings' && (
              <>
                <h1 className="font-display" style={{ fontSize: '24px', fontWeight: '800', color: 'var(--c-text-1)', letterSpacing: '-0.03em', marginBottom: '28px' }}>Settings</h1>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '560px' }}>
                  {[
                    { key: 'emailNotif' as const, label: 'Email Notifications', desc: 'Receive streak reminders and progress updates' },
                    { key: 'soundFx'   as const, label: 'Sound Effects',        desc: 'Play sounds on XP earned and achievements'   },
                    { key: 'autoplay'  as const, label: 'Autoplay Animations',  desc: 'Automatically start visualizations on load'  },
                    { key: 'hints'     as const, label: 'Show Hints',           desc: 'Display helpful hints during operations'     },
                  ].map((setting) => {
                    const isOn = settingsToggles[setting.key]
                    return (
                      <div key={setting.label} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '18px 20px', background: 'var(--c-card)', border: '1px solid var(--c-border)', borderRadius: '14px' }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '15px', fontWeight: '600', color: 'var(--c-text-1)', marginBottom: '3px' }}>{setting.label}</div>
                          <div style={{ fontSize: '13px', color: 'var(--c-text-4)' }}>{setting.desc}</div>
                        </div>
                        <button
                          onClick={() => setSettingsToggles((prev) => ({ ...prev, [setting.key]: !prev[setting.key] }))}
                          aria-label={`Toggle ${setting.label}`}
                          style={{ width: '44px', height: '24px', borderRadius: '12px', background: isOn ? '#6366f1' : 'var(--c-input)', border: `1px solid ${isOn ? '#6366f1' : 'var(--c-border)'}`, position: 'relative', cursor: 'pointer', flexShrink: 0, transition: 'all 0.2s' }}
                        >
                          <div style={{ position: 'absolute', top: '2px', left: isOn ? '20px' : '2px', width: '18px', height: '18px', borderRadius: '50%', background: 'white', transition: 'left 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }} />
                        </button>
                      </div>
                    )
                  })}
                  <button onClick={() => onNavigate('auth')} style={{ padding: '12px 20px', borderRadius: '12px', background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.3)', color: '#f43f5e', cursor: 'pointer', fontSize: '14px', fontFamily: 'Inter, sans-serif', fontWeight: '600', textAlign: 'left', marginTop: '8px' }}>
                    🚪 Sign Out of DSAverse
                  </button>
                </div>
              </>
            )}

          </div>{/* end section content */}
        </main>
      </div>{/* end flex row */}

      {/* ── Search overlay ── */}
      {searchOpen && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'var(--c-overlay)', backdropFilter: 'blur(8px)', zIndex: 300, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '10vh' }}
          onClick={() => setSearchOpen(false)}
        >
          <div
            style={{ width: '100%', maxWidth: '560px', background: 'var(--c-dropdown)', border: '1px solid var(--c-border-med)', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 32px 80px rgba(0,0,0,0.5)', margin: '0 16px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--c-border)', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '16px' }}>🔍</span>
              <input
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search topics, algorithms, worlds..."
                style={{ flex: 1, background: 'none', border: 'none', color: 'var(--c-text-1)', fontSize: '15px', fontFamily: 'Inter, sans-serif', outline: 'none' }}
                aria-label="Search"
              />
              <button onClick={() => setSearchOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--c-text-4)', cursor: 'pointer', fontSize: '13px', fontFamily: 'Inter, sans-serif', padding: '4px 8px' }}>ESC</button>
            </div>
            <div style={{ padding: '8px', maxHeight: '360px', overflowY: 'auto' }}>
              {(searchQuery ? filteredSearch : searchData).map((item) => (
                <button
                  key={item.label}
                  onClick={() => { setSearchOpen(false); setSearchQuery(''); onNavigate(item.worldId) }}
                  style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '10px 12px', borderRadius: '8px', background: 'none', border: 'none', color: 'var(--c-text-2)', cursor: 'pointer', fontSize: '14px', fontFamily: 'Inter, sans-serif', transition: 'all 0.15s', textAlign: 'left' }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--c-card-2)'; e.currentTarget.style.color = 'var(--c-text-1)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--c-text-2)' }}
                >
                  <span style={{ fontSize: '18px', width: '28px', textAlign: 'center' }}>{item.icon}</span>
                  <span style={{ flex: 1 }}>{item.label}</span>
                  <span style={{ fontSize: '11px', color: 'var(--c-text-5)', background: 'var(--c-input)', padding: '2px 8px', borderRadius: '4px' }}>{item.world}</span>
                </button>
              ))}
              {searchQuery && filteredSearch.length === 0 && (
                <div style={{ padding: '24px', textAlign: 'center', color: 'var(--c-text-5)', fontSize: '14px' }}>No results for "{searchQuery}"</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
