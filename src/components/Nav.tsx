import { useState, useEffect } from 'react'

interface NavProps {
  onNavigate: (view: string) => void
  currentView: string
  isDark?: boolean
}

export default function Nav({ onNavigate, currentView, isDark = true }: NavProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const onResize = () => { if (window.innerWidth > 768) setMobileOpen(false) }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const links = [
    { label: 'Features',  action: 'landing', hash: 'features'  },
    { label: 'Worlds',    action: 'dashboard' },
    { label: 'Pricing',   action: 'landing', hash: 'pricing'   },
    { label: 'Blog',      action: 'landing', hash: 'blog'      },
  ]

  function handleLinkClick(action: string, hash?: string) {
    onNavigate(action)
    if (hash) {
      setTimeout(() => {
        const el = document.getElementById(hash)
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 80)
    }
    setMobileOpen(false)
  }

  return (
    <>
      <nav
        style={{
          position: 'fixed',
          top: 0, left: 0, right: 0,
          zIndex: 100,
          padding: '0 clamp(16px, 4vw, 32px)',
          height: scrolled ? '58px' : '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: scrolled ? (isDark ? 'rgba(5,7,15,0.96)' : 'rgba(240,244,255,0.97)') : 'var(--c-nav)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderBottom: `1px solid ${scrolled ? 'var(--c-border-med)' : 'var(--c-border)'}`,
          transition: 'height 0.25s ease, background 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease',
          boxShadow: scrolled ? 'var(--shadow-sm)' : 'none',
        }}
      >
        {/* Logo */}
        <button
          onClick={() => onNavigate('landing')}
          style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 0', flexShrink: 0 }}
        >
          <div
            style={{
              width: '34px', height: '34px', borderRadius: '10px',
              background: 'linear-gradient(135deg, #6366f1, #22d3ee)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'JetBrains Mono, monospace', fontWeight: '700', fontSize: '13px', color: 'white',
              boxShadow: '0 4px 12px rgba(99,102,241,0.35)',
              flexShrink: 0,
            }}
          >
            {'{}'}
          </div>
          <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: '700', fontSize: '19px', color: 'var(--c-text-1)', letterSpacing: '-0.04em' }}>
            DSA<span style={{ color: '#818cf8' }}>verse</span>
          </span>
        </button>

        {/* Desktop links */}
        <div className="nav-desktop-links" style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          {links.map((item) => (
            <span
              key={item.label}
              className="nav-link"
              role="button"
              tabIndex={0}
              onClick={() => handleLinkClick(item.action, item.hash)}
              onKeyDown={(e) => e.key === 'Enter' && handleLinkClick(item.action, item.hash)}
              aria-label={`Navigate to ${item.label}`}
            >
              {item.label}
            </span>
          ))}
        </div>

        {/* CTA + hamburger */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div className="nav-desktop-cta" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              className="btn-ghost"
              onClick={() => onNavigate('auth')}
              style={{ fontSize: '14px', padding: '8px 16px' }}
              aria-label="Sign in"
            >
              Sign In
            </button>
            <button
              className="btn-primary"
              onClick={() => onNavigate('auth')}
              style={{ padding: '8px 20px', fontSize: '14px' }}
              aria-label="Start free"
            >
              Start Free →
            </button>
          </div>
          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen((o) => !o)}
            className="nav-hamburger"
            style={{
              display: 'none',
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--c-text-2)', fontSize: '22px', padding: '4px',
              lineHeight: 1,
            }}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? '✕' : '☰'}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div
          role="dialog"
          aria-label="Mobile navigation"
          style={{
            position: 'fixed',
            top: '64px', left: 0, right: 0,
            background: isDark ? 'rgba(5,7,15,0.98)' : 'rgba(240,244,255,0.98)',
            backdropFilter: 'blur(24px)',
            borderBottom: '1px solid var(--c-border-med)',
            padding: '16px 24px 24px',
            zIndex: 99,
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            animation: 'slide-in 0.2s ease',
          }}
        >
          {links.map((item) => (
            <button
              key={item.label}
              onClick={() => handleLinkClick(item.action, item.hash)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'var(--c-text-2)', fontSize: '16px', fontWeight: '500',
                fontFamily: 'Inter, sans-serif', textAlign: 'left',
                padding: '12px 8px',
                borderBottom: '1px solid var(--c-border)',
                transition: 'color 0.15s',
              }}
            >
              {item.label}
            </button>
          ))}
          <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
            <button
              className="btn-secondary"
              onClick={() => { onNavigate('auth'); setMobileOpen(false) }}
              style={{ flex: 1, fontSize: '14px' }}
            >
              Sign In
            </button>
            <button
              className="btn-primary"
              onClick={() => { onNavigate('auth'); setMobileOpen(false) }}
              style={{ flex: 1, fontSize: '14px' }}
            >
              Start Free →
            </button>
          </div>
        </div>
      )}
    </>
  )
}
