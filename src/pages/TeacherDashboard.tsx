import { useState } from 'react'

interface TeacherDashboardProps {
  onNavigate: (view: string) => void
  isDark?: boolean
}

type TeacherView = 'overview' | 'courses' | 'analytics' | 'assignments' | 'live' | 'reports' | 'resources' | 'announcements' | 'settings'

const sideNavItems = [
  { id: 'overview',      icon: '◻', label: 'Dashboard'     },
  { id: 'courses',       icon: '📚', label: 'Course Builder' },
  { id: 'assignments',   icon: '📝', label: 'Assignments'    },
  { id: 'analytics',     icon: '📊', label: 'Analytics'      },
  { id: 'live',          icon: '🎥', label: 'Live Classes'   },
  { id: 'reports',       icon: '📋', label: 'Reports'        },
  { id: 'resources',     icon: '🗂', label: 'Resources'      },
  { id: 'announcements', icon: '📢', label: 'Announcements'  },
  { id: 'settings',      icon: '⚙', label: 'Settings'       },
]

const courses = [
  { title: 'DSA Fundamentals',    students: 124, progress: 72, status: 'Published', color: '#6366f1', topics: 18 },
  { title: 'Trees & Graphs',      students: 87,  progress: 45, status: 'Published', color: '#10b981', topics: 12 },
  { title: 'Dynamic Programming', students: 0,   progress: 20, status: 'Draft',     color: '#f59e0b', topics: 8  },
  { title: 'Interview Prep',      students: 0,   progress: 5,  status: 'Draft',     color: '#a855f7', topics: 5  },
]

const students = [
  { name: 'Alex Johnson', xp: 2840, streak: 14, progress: 78, avatar: '👨‍💻' },
  { name: 'Priya Sharma', xp: 3210, streak: 21, progress: 89, avatar: '👩‍💻' },
  { name: 'Marcus Lee',   xp: 1950, streak: 7,  progress: 54, avatar: '🧑‍💻' },
  { name: 'Sofia Cruz',   xp: 4100, streak: 30, progress: 96, avatar: '👩‍🎓' },
  { name: 'Dev Patel',    xp: 720,  streak: 2,  progress: 23, avatar: '👨‍🎓' },
]

export default function TeacherDashboard({ onNavigate, isDark = true }: TeacherDashboardProps) {
  const [activeView, setActiveView] = useState<TeacherView>('overview')
  const [notifOpen, setNotifOpen] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [newCourseTitle, setNewCourseTitle] = useState('')
  const [coursesList, setCoursesList] = useState(courses)

  return (
    <div
      style={{
        background: 'var(--c-bg)',
        minHeight: '100vh',
        fontFamily: 'Inter, sans-serif',
        color: 'var(--c-text-1)',
        display: 'flex',
        transition: 'background 0.35s ease',
      }}
    >
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 49 }}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        style={{
          width: '240px',
          flexShrink: 0,
          borderRight: '1px solid var(--c-border)',
          padding: '24px 16px',
          background: 'var(--c-surface)',
          position: 'sticky',
          top: 0,
          height: '100vh',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          zIndex: 50,
          transition: 'left 0.28s cubic-bezier(0.4,0,0.2,1)',
        }}
        className={`dash-sidebar${sidebarOpen ? ' open' : ''}`}
      >
        <button
          onClick={() => onNavigate('landing')}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px 12px', marginBottom: '8px', textAlign: 'left' }}
        >
          <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: '700', fontSize: '18px', color: 'var(--c-text-1)', letterSpacing: '-0.04em' }}>
            DSA<span style={{ color: '#818cf8' }}>verse</span>
          </span>
          <span style={{ fontSize: '10px', background: 'rgba(16,185,129,0.15)', color: '#10b981', border: '1px solid rgba(16,185,129,0.3)', padding: '2px 6px', borderRadius: '6px', marginLeft: '8px', fontWeight: '600' }}>
            TEACHER
          </span>
        </button>

        {sideNavItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id as TeacherView)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 12px',
              borderRadius: '10px',
              background: activeView === item.id ? 'rgba(16,185,129,0.12)' : 'transparent',
              border: activeView === item.id ? '1px solid rgba(16,185,129,0.3)' : '1px solid transparent',
              color: activeView === item.id ? '#10b981' : '#64748b',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: activeView === item.id ? '600' : '400',
              fontFamily: 'Inter, sans-serif',
              textAlign: 'left',
              width: '100%',
              transition: 'all 0.2s',
            }}
          >
            <span style={{ fontSize: '16px' }}>{item.icon}</span>
            {item.label}
          </button>
        ))}

        <div style={{ marginTop: 'auto', padding: '16px', background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)', borderRadius: '12px' }}>
          <div style={{ fontSize: '13px', fontWeight: '600', color: '#10b981', marginBottom: '4px' }}>Dr. Sarah Chen</div>
          <div style={{ fontSize: '12px', color: 'var(--c-text-4)' }}>Computer Science · 3 courses</div>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, padding: '32px', overflowY: 'auto', minWidth: 0 }}>
        {/* Top bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Mobile hamburger */}
            <button
              className="dash-hamburger"
              onClick={() => setSidebarOpen((o) => !o)}
              style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', color: 'var(--c-text-2)', padding: '4px' }}
              aria-label="Toggle sidebar"
            >
              ☰
            </button>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--c-text-4)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>
                Teacher Dashboard
              </div>
              <h1 className="font-display" style={{ fontSize: '26px', fontWeight: '800', color: 'var(--c-text-1)', letterSpacing: '-0.035em' }}>
                {activeView === 'overview'      && 'Overview'}
                {activeView === 'courses'       && 'Course Builder'}
                {activeView === 'analytics'     && 'Student Analytics'}
                {activeView === 'assignments'   && 'Assignments & Quizzes'}
                {activeView === 'live'          && 'Live Classes'}
                {activeView === 'reports'       && 'Reports'}
                {activeView === 'resources'     && 'Resources'}
                {activeView === 'announcements' && 'Announcements'}
                {activeView === 'settings'      && 'Settings'}
              </h1>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button
              onClick={() => onNavigate('dashboard')}
              style={{ background: 'var(--c-card-2)', border: '1px solid var(--c-border-med)', borderRadius: '10px', color: 'var(--c-text-3)', padding: '8px 16px', cursor: 'pointer', fontSize: '13px', fontFamily: 'Inter, sans-serif' }}
            >
              Student View
            </button>
            <button
              className="btn-primary"
              onClick={() => setActiveView('courses')}
              style={{ padding: '8px 20px', fontSize: '14px' }}
            >
              + New Course
            </button>
          </div>
        </div>

        {/* ── OVERVIEW ── */}
        {activeView === 'overview' && (
          <>
        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }} className="grid-responsive-4">
          {[
            { label: 'Total Students', value: '211', icon: '👥', color: '#6366f1', change: '+12 this week' },
            { label: 'Active Courses', value: '2', icon: '📚', color: '#10b981', change: '2 in draft' },
            { label: 'Avg. Progress', value: '68%', icon: '📈', color: '#f59e0b', change: '+5% vs last week' },
            { label: 'Completions', value: '47', icon: '🏆', color: '#a855f7', change: 'This month' },
          ].map((s) => (
            <div
              key={s.label}
              className="stat-card"
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ fontSize: '22px' }}>{s.icon}</span>
                <span style={{ fontSize: '10px', color: 'var(--c-text-4)', background: 'var(--c-card-2)', padding: '3px 8px', borderRadius: '100px' }}>{s.change}</span>
              </div>
              <div className="font-display" style={{ fontSize: '28px', fontWeight: '800', color: 'var(--c-text-1)', letterSpacing: '-0.04em', lineHeight: '1' }}>{s.value}</div>
              <div style={{ fontSize: '13px', color: 'var(--c-text-4)', marginTop: '4px' }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }} className="grid-responsive-2">
          {/* Courses */}
          <div className="glass-card glass-sheen" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--c-text-1)' }}>Your Courses</h3>
              <button onClick={() => setActiveView('courses')} style={{ fontSize: '13px', color: '#818cf8', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
                View all →
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {coursesList.map((c) => (
                <div
                  key={c.title}
                  style={{
                    padding: '14px',
                    borderRadius: '12px',
                    background: 'var(--c-card)',
                    border: '1px solid var(--c-border)',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--c-text-1)' }}>{c.title}</div>
                    <span
                      style={{
                        fontSize: '11px',
                        padding: '2px 8px',
                        borderRadius: '100px',
                        background: c.status === 'Published' ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)',
                        color: c.status === 'Published' ? '#10b981' : '#f59e0b',
                        border: `1px solid ${c.status === 'Published' ? 'rgba(16,185,129,0.3)' : 'rgba(245,158,11,0.3)'}`,
                      }}
                    >
                      {c.status}
                    </span>
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--c-text-4)', marginBottom: '8px' }}>
                    {c.students > 0 ? `${c.students} students enrolled` : 'Not published yet'}
                  </div>
                  <div className="progress-track">
                    <div style={{ width: `${c.progress}%`, height: '100%', background: c.color, borderRadius: '2px', opacity: 0.7 }} />
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--c-text-5)', marginTop: '4px' }}>{c.progress}% content complete</div>
                </div>
              ))}
            </div>
          </div>

          {/* Student Performance */}
          <div className="glass-card glass-sheen" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--c-text-1)' }}>Top Students</h3>
              <button onClick={() => setActiveView('analytics')} style={{ fontSize: '13px', color: '#818cf8', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
                Full report →
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {students.map((s, i) => (
                <div
                  key={s.name}
                  style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px', borderRadius: '10px', background: i === 0 ? 'rgba(245,158,11,0.06)' : 'transparent' }}
                >
                  <div style={{ fontSize: '11px', color: 'var(--c-text-5)', fontFamily: 'JetBrains Mono, monospace', width: '16px' }}>#{i + 1}</div>
                  <div
                    style={{
                      width: '34px',
                      height: '34px',
                      borderRadius: '10px',
                      background: 'rgba(99,102,241,0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '18px',
                      flexShrink: 0,
                    }}
                  >
                    {s.avatar}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--c-text-1)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.name}</div>
                    <div className="progress-track" style={{ marginTop: '4px' }}>
                      <div style={{ width: `${s.progress}%`, height: '100%', background: '#6366f1', borderRadius: '2px', opacity: 0.7 }} />
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontSize: '12px', fontFamily: 'JetBrains Mono, monospace', color: '#f59e0b', fontWeight: '700' }}>{s.xp.toLocaleString()} XP</div>
                    <div style={{ fontSize: '11px', color: 'var(--c-text-4)' }}>🔥 {s.streak}d</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

          {/* Quick Actions */}
        <div className="glass-card glass-sheen" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--c-text-1)' }}>Quick Actions</h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }} className="grid-responsive-4">
            {[
              { icon: '📝', label: 'New Assignment', color: '#6366f1', view: 'assignments' as TeacherView },
              { icon: '🧪', label: 'Create Quiz',    color: '#10b981', view: 'assignments' as TeacherView },
              { icon: '📢', label: 'Announcement',   color: '#f59e0b', view: 'announcements' as TeacherView },
              { icon: '🎥', label: 'Schedule Class', color: '#f43f5e', view: 'live' as TeacherView },
            ].map((a) => (
              <button
                key={a.label}
                onClick={() => setActiveView(a.view)}
                style={{ padding: '20px 16px', borderRadius: '14px', background: `${a.color}10`, border: `1px solid ${a.color}25`, cursor: 'pointer', textAlign: 'center', fontFamily: 'Inter, sans-serif', transition: 'all 0.2s' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = `${a.color}20`; e.currentTarget.style.transform = 'translateY(-3px)' }}
                onMouseLeave={(e) => { e.currentTarget.style.background = `${a.color}10`; e.currentTarget.style.transform = 'translateY(0)' }}
              >
                <div style={{ fontSize: '28px', marginBottom: '8px' }}>{a.icon}</div>
                <div style={{ fontSize: '13px', fontWeight: '600', color: a.color }}>{a.label}</div>
              </button>
            ))}
          </div>
        </div>
          </>
        )}{/* end overview */}

        {/* Courses Builder view */}
        {activeView === 'courses' && (
          <div style={{ marginTop: '0' }}>
            {/* Create new course */}
            <div className="glass-card" style={{ padding: '24px', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--c-text-1)', marginBottom: '16px' }}>Create New Course</h3>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <input
                  value={newCourseTitle}
                  onChange={(e) => setNewCourseTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && newCourseTitle.trim()) {
                      setCoursesList((prev) => [...prev, { title: newCourseTitle.trim(), students: 0, progress: 0, status: 'Draft', color: '#6366f1', topics: 0 }])
                      setNewCourseTitle('')
                    }
                  }}
                  placeholder="Course title..."
                  style={{ flex: 1, minWidth: '200px', padding: '10px 14px', background: 'var(--c-input)', border: '1px solid var(--c-input-border)', borderRadius: '10px', color: 'var(--c-text-1)', fontSize: '14px', fontFamily: 'Inter, sans-serif', outline: 'none' }}
                />
                <button
                  className="btn-primary"
                  onClick={() => {
                    if (!newCourseTitle.trim()) return
                    setCoursesList((prev) => [...prev, { title: newCourseTitle.trim(), students: 0, progress: 0, status: 'Draft', color: '#6366f1', topics: 0 }])
                    setNewCourseTitle('')
                  }}
                  style={{ padding: '10px 24px', fontSize: '14px', flexShrink: 0 }}
                >
                  + Create Course
                </button>
              </div>
            </div>

            {/* Courses list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {coursesList.map((c, idx) => (
                <div
                  key={c.title + idx}
                  className="glass-card"
                  style={{ padding: '22px', display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}
                >
                  <div
                    style={{ width: '48px', height: '48px', borderRadius: '12px', background: `${c.color}18`, border: `1px solid ${c.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0 }}
                  >
                    📚
                  </div>
                  <div style={{ flex: 1, minWidth: '180px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '15px', fontWeight: '700', color: 'var(--c-text-1)' }}>{c.title}</span>
                      <span style={{ fontSize: '11px', padding: '2px 9px', borderRadius: '100px', background: c.status === 'Published' ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)', color: c.status === 'Published' ? '#10b981' : '#f59e0b', border: `1px solid ${c.status === 'Published' ? 'rgba(16,185,129,0.3)' : 'rgba(245,158,11,0.3)'}`, fontWeight: '600' }}>
                        {c.status}
                      </span>
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--c-text-4)', marginBottom: '8px' }}>
                      {c.students > 0 ? `${c.students} students enrolled` : 'No students yet'} · {c.topics} topics
                    </div>
                    <div className="progress-track" style={{ maxWidth: '300px' }}>
                      <div style={{ width: `${c.progress}%`, height: '100%', background: c.color, borderRadius: '2px', minWidth: c.progress > 0 ? '4px' : '0', opacity: 0.8 }} />
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--c-text-5)', marginTop: '3px' }}>{c.progress}% complete</div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', flexShrink: 0, flexWrap: 'wrap' }}>
                    <button
                      onClick={() => setCoursesList((prev) => prev.map((x, i) => i === idx ? { ...x, status: x.status === 'Published' ? 'Draft' : 'Published' } : x))}
                      style={{ padding: '7px 16px', borderRadius: '8px', border: `1px solid ${c.status === 'Published' ? 'rgba(245,158,11,0.4)' : 'rgba(16,185,129,0.4)'}`, background: c.status === 'Published' ? 'rgba(245,158,11,0.08)' : 'rgba(16,185,129,0.08)', color: c.status === 'Published' ? '#f59e0b' : '#10b981', cursor: 'pointer', fontSize: '12px', fontFamily: 'Inter, sans-serif', fontWeight: '600' }}
                    >
                      {c.status === 'Published' ? 'Unpublish' : 'Publish'}
                    </button>
                    <button
                      onClick={() => setCoursesList((prev) => prev.filter((_, i) => i !== idx))}
                      style={{ padding: '7px 16px', borderRadius: '8px', border: '1px solid rgba(244,63,94,0.3)', background: 'rgba(244,63,94,0.06)', color: '#f43f5e', cursor: 'pointer', fontSize: '12px', fontFamily: 'Inter, sans-serif', fontWeight: '600' }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Analytics view */}
        {activeView === 'analytics' && (
          <div className="glass-card glass-sheen" style={{ padding: '24px', marginTop: '20px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--c-text-1)', marginBottom: '20px' }}>Student Analytics</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
              {students.map((s) => (
                <div key={s.name} style={{ padding: '16px', background: 'var(--c-card)', border: '1px solid var(--c-border)', borderRadius: '12px' }}>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '12px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(99,102,241,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>{s.avatar}</div>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--c-text-1)' }}>{s.name}</div>
                      <div style={{ fontSize: '11px', color: 'var(--c-text-4)' }}>🔥 {s.streak}d streak</div>
                    </div>
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--c-text-4)', marginBottom: '4px' }}>Progress: {s.progress}%</div>
                  <div className="progress-track"><div style={{ width: `${s.progress}%`, height: '100%', background: '#6366f1', borderRadius: '2px' }} /></div>
                  <div style={{ fontSize: '12px', color: '#f59e0b', fontWeight: '700', marginTop: '8px', fontFamily: 'JetBrains Mono, monospace' }}>{s.xp.toLocaleString()} XP</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Assignments view */}
        {(activeView === 'assignments') && (
          <div className="glass-card glass-sheen" style={{ padding: '24px', marginTop: '20px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--c-text-1)', marginBottom: '20px' }}>Assignments & Quizzes</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {['Array Traversal Quiz', 'Sorting Algorithm Challenge', 'BST Implementation Task', 'Graph BFS Problem Set'].map((title, i) => (
                <div key={title} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '16px', background: 'var(--c-card)', border: '1px solid var(--c-border)', borderRadius: '12px' }}>
                  <span style={{ fontSize: '20px' }}>{['🧪','📝','💻','🕸'][i]}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--c-text-1)' }}>{title}</div>
                    <div style={{ fontSize: '12px', color: 'var(--c-text-4)' }}>Due: Aug 15, 2026 · 48 students</div>
                  </div>
                  <span style={{ fontSize: '12px', background: i<2?'rgba(16,185,129,0.15)':'rgba(245,158,11,0.15)', color: i<2?'#10b981':'#f59e0b', padding: '3px 10px', borderRadius: '100px', fontWeight: '600' }}>{i<2?'Published':'Draft'}</span>
                </div>
              ))}
              <button className="btn-primary" style={{ padding: '10px', fontSize: '14px', marginTop: '4px' }}>+ Create New Assignment</button>
            </div>
          </div>
        )}

        {/* Live Classes view */}
        {activeView === 'live' && (
          <div className="glass-card glass-sheen" style={{ padding: '24px', marginTop: '20px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--c-text-1)', marginBottom: '20px' }}>Live Classes</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { title: 'Arrays & Sorting Deep Dive', date: 'Aug 10, 2026 · 3:00 PM', students: 42, status: 'Scheduled' },
                { title: 'Graph Algorithms Workshop',   date: 'Aug 14, 2026 · 2:00 PM', students: 38, status: 'Scheduled' },
              ].map((cls) => (
                <div key={cls.title} style={{ padding: '20px', background: 'var(--c-card)', border: '1px solid var(--c-border)', borderRadius: '12px' }}>
                  <div style={{ fontSize: '16px', fontWeight: '700', color: 'var(--c-text-1)', marginBottom: '6px' }}>{cls.title}</div>
                  <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: 'var(--c-text-4)' }}>
                    <span>📅 {cls.date}</span>
                    <span>👥 {cls.students} enrolled</span>
                  </div>
                  <div style={{ marginTop: '12px', display: 'flex', gap: '10px' }}>
                    <button className="btn-primary" style={{ padding: '7px 16px', fontSize: '13px' }}>Start Class</button>
                    <button className="btn-secondary" style={{ padding: '7px 16px', fontSize: '13px' }}>Edit</button>
                  </div>
                </div>
              ))}
              <button className="btn-secondary" style={{ padding: '10px', fontSize: '14px' }}>+ Schedule New Class</button>
            </div>
          </div>
        )}

        {/* Announcements view */}
        {activeView === 'announcements' && (
          <div className="glass-card glass-sheen" style={{ padding: '24px', marginTop: '20px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--c-text-1)', marginBottom: '20px' }}>Announcements</h3>
            <textarea
              placeholder="Write an announcement to your students..."
              rows={5}
              style={{ width: '100%', background: 'var(--c-input)', border: '1px solid var(--c-input-border)', borderRadius: '12px', padding: '14px', color: 'var(--c-text-1)', fontSize: '14px', fontFamily: 'Inter, sans-serif', resize: 'vertical', outline: 'none', marginBottom: '12px', boxSizing: 'border-box' }}
            />
            <button className="btn-primary" style={{ padding: '10px 24px', fontSize: '14px' }}>📢 Send Announcement</button>
          </div>
        )}

        {/* Reports / Resources / Settings — functional panels */}
        {activeView === 'reports' && (
          <div className="glass-card glass-sheen" style={{ padding: '24px', marginTop: '20px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--c-text-1)', marginBottom: '20px' }}>Reports</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px' }} className="grid-responsive-2">
              {[
                { label: 'Weekly Engagement Report',  date: 'Aug 1 – Aug 7, 2026',  icon: '📈', color: '#6366f1' },
                { label: 'Topic Completion Summary',   date: 'Last 30 days',         icon: '✅', color: '#10b981' },
                { label: 'Student Progress Report',    date: 'All time',             icon: '👥', color: '#f59e0b' },
                { label: 'Quiz Performance Analysis',  date: 'August 2026',          icon: '🧪', color: '#a855f7' },
              ].map((r) => (
                <div key={r.label} style={{ padding: '18px', background: 'var(--c-card)', border: '1px solid var(--c-border)', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer', transition: 'all 0.2s' }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = r.color + '50'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--c-border)'; e.currentTarget.style.transform = 'translateY(0)' }}
                >
                  <span style={{ fontSize: '28px' }}>{r.icon}</span>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--c-text-1)', marginBottom: '3px' }}>{r.label}</div>
                    <div style={{ fontSize: '12px', color: 'var(--c-text-4)' }}>{r.date}</div>
                  </div>
                  <span style={{ marginLeft: 'auto', fontSize: '12px', color: r.color, fontWeight: '600' }}>Download ↓</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeView === 'resources' && (
          <div className="glass-card glass-sheen" style={{ padding: '24px', marginTop: '20px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--c-text-1)', marginBottom: '20px' }}>Resources</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { name: 'DSA Curriculum Guide.pdf',         size: '2.4 MB', icon: '📄', color: '#f43f5e' },
                { name: 'Teaching DSA Visually.pdf',        size: '1.8 MB', icon: '📄', color: '#f43f5e' },
                { name: 'Quiz Templates Pack.zip',          size: '512 KB', icon: '🗜',  color: '#f59e0b' },
                { name: 'Student Progress Sheet.xlsx',      size: '340 KB', icon: '📊', color: '#10b981' },
                { name: 'DSAverse Teacher Handbook.pdf',    size: '3.1 MB', icon: '📄', color: '#f43f5e' },
              ].map((f) => (
                <div key={f.name} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 18px', background: 'var(--c-card)', border: '1px solid var(--c-border)', borderRadius: '10px' }}>
                  <span style={{ fontSize: '24px' }}>{f.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '14px', fontWeight: '500', color: 'var(--c-text-1)' }}>{f.name}</div>
                    <div style={{ fontSize: '12px', color: 'var(--c-text-4)' }}>{f.size}</div>
                  </div>
                  <button style={{ padding: '6px 14px', borderRadius: '8px', background: 'var(--c-card-2)', border: '1px solid var(--c-border-med)', color: 'var(--c-text-2)', cursor: 'pointer', fontSize: '12px', fontFamily: 'Inter, sans-serif' }}>
                    Download
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeView === 'settings' && (
          <div className="glass-card glass-sheen" style={{ padding: '24px', marginTop: '20px', maxWidth: '560px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--c-text-1)', marginBottom: '20px' }}>Account Settings</h3>
            {[
              { label: 'Name',  value: 'Dr. Sarah Chen',          type: 'text' },
              { label: 'Email', value: 'sarah.chen@university.edu', type: 'email' },
              { label: 'Department', value: 'Computer Science',    type: 'text' },
            ].map((field) => (
              <div key={field.label} style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--c-text-3)', marginBottom: '6px', letterSpacing: '0.3px' }}>{field.label}</label>
                <input
                  type={field.type}
                  defaultValue={field.value}
                  style={{ width: '100%', padding: '10px 14px', background: 'var(--c-input)', border: '1px solid var(--c-input-border)', borderRadius: '10px', color: 'var(--c-text-1)', fontSize: '14px', fontFamily: 'Inter, sans-serif', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
            ))}
            <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
              <button className="btn-primary" style={{ padding: '10px 24px', fontSize: '14px' }}>Save Changes</button>
              <button onClick={() => onNavigate('auth')} style={{ padding: '10px 20px', borderRadius: '10px', background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.3)', color: '#f43f5e', cursor: 'pointer', fontSize: '14px', fontFamily: 'Inter, sans-serif', fontWeight: '600' }}>
                Sign Out
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
