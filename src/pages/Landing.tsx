import { useEffect, useRef, useState } from 'react'

interface LandingProps {
  onNavigate: (view: string) => void
  isDark?: boolean
}

// ─── Animated Canvas Background ───────────────────────────────────────────────
function AnimatedCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    let w = (canvas.width = window.innerWidth)
    let h = (canvas.height = window.innerHeight)

    // Nodes (graph nodes + array blocks + tree nodes)
    const NODE_COUNT = 38
    type NodeType = 'circle' | 'square' | 'diamond'
    interface Node {
      x: number; y: number; vx: number; vy: number
      r: number; type: NodeType; color: string; alpha: number; pulse: number; pulseDir: number
    }
    const COLORS = ['#6366f1', '#22d3ee', '#10b981', '#a855f7', '#f59e0b', '#f43f5e', '#818cf8', '#34d399']
    const nodes: Node[] = Array.from({ length: NODE_COUNT }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.45, vy: (Math.random() - 0.5) * 0.45,
      r: 4 + Math.random() * 7,
      type: (['circle', 'square', 'diamond'] as NodeType[])[Math.floor(Math.random() * 3)],
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      alpha: 0.15 + Math.random() * 0.35,
      pulse: Math.random() * Math.PI * 2,
      pulseDir: Math.random() > 0.5 ? 1 : -1,
    }))

    // Floating array blocks
    interface Block { x: number; y: number; vy: number; val: number; color: string; alpha: number; size: number }
    const blocks: Block[] = Array.from({ length: 14 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vy: -0.18 - Math.random() * 0.22,
      val: Math.floor(Math.random() * 99) + 1,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      alpha: 0.08 + Math.random() * 0.14,
      size: 28 + Math.random() * 24,
    }))

    const onResize = () => {
      w = canvas.width = window.innerWidth
      h = canvas.height = window.innerHeight
    }
    window.addEventListener('resize', onResize)

    const draw = () => {
      ctx.clearRect(0, 0, w, h)

      // Draw edges between nearby nodes
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x
          const dy = nodes[i].y - nodes[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 160) {
            const opacity = (1 - dist / 160) * 0.12
            ctx.beginPath()
            ctx.strokeStyle = `rgba(99,102,241,${opacity})`
            ctx.lineWidth = 1
            ctx.moveTo(nodes[i].x, nodes[i].y)
            ctx.lineTo(nodes[j].x, nodes[j].y)
            ctx.stroke()
          }
        }
      }

      // Draw nodes
      nodes.forEach((n) => {
        n.pulse += 0.025 * n.pulseDir
        const pr = n.r + Math.sin(n.pulse) * 2
        ctx.save()
        ctx.globalAlpha = n.alpha
        ctx.fillStyle = n.color
        ctx.shadowBlur = 12
        ctx.shadowColor = n.color

        if (n.type === 'circle') {
          ctx.beginPath()
          ctx.arc(n.x, n.y, pr, 0, Math.PI * 2)
          ctx.fill()
        } else if (n.type === 'square') {
          ctx.beginPath()
          if (typeof ctx.roundRect === 'function') {
            ctx.roundRect(n.x - pr, n.y - pr, pr * 2, pr * 2, 3)
          } else {
            ctx.rect(n.x - pr, n.y - pr, pr * 2, pr * 2)
          }
          ctx.fill()
        } else {
          ctx.beginPath()
          ctx.moveTo(n.x, n.y - pr)
          ctx.lineTo(n.x + pr, n.y)
          ctx.lineTo(n.x, n.y + pr)
          ctx.lineTo(n.x - pr, n.y)
          ctx.closePath()
          ctx.fill()
        }
        ctx.restore()

        // Move
        n.x += n.vx; n.y += n.vy
        if (n.x < -20) n.x = w + 20
        if (n.x > w + 20) n.x = -20
        if (n.y < -20) n.y = h + 20
        if (n.y > h + 20) n.y = -20
      })

      // Draw floating array blocks
      blocks.forEach((b) => {
        ctx.save()
        ctx.globalAlpha = b.alpha
        ctx.strokeStyle = b.color
        ctx.lineWidth = 1.5
        ctx.strokeRect(b.x, b.y, b.size, b.size)
        ctx.font = `bold ${b.size * 0.4}px JetBrains Mono, monospace`
        ctx.fillStyle = b.color
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(String(b.val), b.x + b.size / 2, b.y + b.size / 2)
        ctx.restore()
        b.y += b.vy
        if (b.y < -60) { b.y = h + 60; b.x = Math.random() * w }
      })

      animId = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        opacity: 0.65, width: '100vw', height: '100vh',
      }}
    />
  )
}

// ─── Counter Hook ──────────────────────────────────────────────────────────────
function useCounter(target: number, started: boolean, duration = 1800) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!started) return
    let start: number | null = null
    const step = (ts: number) => {
      if (!start) start = ts
      const p = Math.min((ts - start) / duration, 1)
      const eased = 1 - Math.pow(1 - p, 4)
      setCount(Math.round(eased * target))
      if (p < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [target, started, duration])
  return count
}

// ─── Scroll Reveal Hook ────────────────────────────────────────────────────────
function useReveal(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVisible(true); obs.disconnect() }
    }, { threshold, rootMargin: '0px 0px -40px 0px' })
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, visible }
}

// ─── Magnetic Button ──────────────────────────────────────────────────────────
function MagneticButton({
  children, onClick, className, style,
}: {
  children: React.ReactNode; onClick?: () => void
  className?: string; style?: React.CSSProperties
}) {
  const btnRef = useRef<HTMLButtonElement>(null)
  const handleMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const btn = btnRef.current
    if (!btn) return
    const rect = btn.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const dx = (e.clientX - cx) * 0.25
    const dy = (e.clientY - cy) * 0.25
    btn.style.transform = `translate(${dx}px, ${dy}px) scale(1.04)`
  }
  const handleLeave = () => {
    if (btnRef.current) btnRef.current.style.transform = 'translate(0,0) scale(1)'
  }
  return (
    <button
      ref={btnRef}
      onClick={onClick}
      className={className}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ transition: 'transform 0.3s cubic-bezier(0.34,1.56,0.64,1)', ...style }}
    >
      {children}
    </button>
  )
}

// ─── Mini Array Demo ───────────────────────────────────────────────────────────
function MiniArrayDemo() {
  const [active, setActive] = useState(0)
  const values = [4, 8, 2, 10, 5, 7, 3, 9]
  useEffect(() => {
    const id = setInterval(() => setActive((p) => (p + 1) % values.length), 700)
    return () => clearInterval(id)
  }, [])
  return (
    <div style={{ display: 'flex', gap: '6px', alignItems: 'flex-end', flexWrap: 'wrap', justifyContent: 'center' }}>
      {values.map((v, i) => (
        <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', transition: 'all 0.4s cubic-bezier(0.34,1.56,0.64,1)', transform: i === active ? 'translateY(-10px) scale(1.1)' : 'translateY(0) scale(1)' }}>
          <div style={{ width: '44px', height: `${v * 7 + 32}px`, background: i === active ? 'linear-gradient(180deg,#818cf8,#6366f1)' : i < active ? 'rgba(16,185,129,0.5)' : 'var(--c-card-2)', border: `1.5px solid ${i === active ? '#6366f1' : 'var(--c-border-med)'}`, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'JetBrains Mono,monospace', fontWeight: '700', fontSize: '14px', color: i === active ? 'white' : 'var(--c-text-3)', boxShadow: i === active ? '0 0 20px rgba(99,102,241,0.5)' : 'none', transition: 'all 0.35s ease' }}>
            {v}
          </div>
          <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '10px', color: i === active ? '#818cf8' : 'var(--c-text-5)' }}>[{i}]</span>
        </div>
      ))}
    </div>
  )
}

// ─── Mini Stack Demo ──────────────────────────────────────────────────────────
function MiniStackDemo() {
  const [stack, setStack] = useState([30, 20, 10])
  const [action, setAction] = useState('')
  useEffect(() => {
    const ops = [
      () => { setStack((s) => [...s, Math.floor(Math.random() * 90) + 10]); setAction('PUSH') },
      () => { setStack((s) => s.length > 1 ? s.slice(0, -1) : s); setAction('POP') },
    ]
    const id = setInterval(() => ops[Math.floor(Math.random() * ops.length)](), 1200)
    return () => clearInterval(id)
  }, [])
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
      <span style={{ fontSize: '10px', color: '#f43f5e', fontWeight: '700', letterSpacing: '1px', marginBottom: '4px' }}>{action || 'STACK'}</span>
      <div style={{ display: 'flex', flexDirection: 'column-reverse', gap: '4px', width: '120px' }}>
        {stack.map((v, i) => (
          <div key={`${v}-${i}`} style={{ height: '36px', borderRadius: '6px', background: i === stack.length - 1 ? 'rgba(244,63,94,0.25)' : 'var(--c-card-2)', border: `1px solid ${i === stack.length - 1 ? 'rgba(244,63,94,0.6)' : 'var(--c-border-med)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'JetBrains Mono,monospace', fontWeight: '700', fontSize: '14px', color: i === stack.length - 1 ? '#f43f5e' : 'var(--c-text-2)', transition: 'all 0.3s ease' }}>
            {v}
          </div>
        ))}
      </div>
      {stack.length > 0 && <span style={{ fontSize: '10px', color: '#f43f5e', fontWeight: '600' }}>← TOP</span>}
    </div>
  )
}

// ─── Mini Sort Demo ───────────────────────────────────────────────────────────
function MiniSortDemo() {
  const init = [6, 2, 8, 1, 5, 3, 7, 4]
  const [bars, setBars] = useState(init.map((v) => ({ v, state: 'default' as 'default' | 'comparing' | 'sorted' })))
  useEffect(() => {
    const arr = [...init]
    const n = arr.length
    let i = 0, j = 0
    const id = setInterval(() => {
      if (i >= n - 1) {
        setBars(arr.map((v) => ({ v, state: 'sorted' })))
        clearInterval(id)
        setTimeout(() => { setBars(init.map((v) => ({ v, state: 'default' }))) }, 1400)
        return
      }
      if (j >= n - i - 1) { i++; j = 0; return }
      if (arr[j] > arr[j + 1]) [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
      setBars(arr.map((v, idx) => ({ v, state: idx === j || idx === j + 1 ? 'comparing' : idx >= n - i ? 'sorted' : 'default' })))
      j++
    }, 200)
    return () => clearInterval(id)
  }, [])
  const max = Math.max(...bars.map((b) => b.v))
  return (
    <div style={{ display: 'flex', gap: '4px', alignItems: 'flex-end', height: '64px' }}>
      {bars.map((b, i) => (
        <div key={i} style={{ flex: 1, borderRadius: '3px 3px 0 0', background: b.state === 'comparing' ? '#f59e0b' : b.state === 'sorted' ? '#10b981' : '#6366f1', height: `${(b.v / max) * 58}px`, transition: 'height 0.2s ease, background 0.2s ease', opacity: 0.85 }} />
      ))}
    </div>
  )
}

// ─── Mini Tree Demo ────────────────────────────────────────────────────────────
function MiniTreeDemo() {
  const [active, setActive] = useState<number | null>(null)
  const nodes = [
    { val: 15, x: 90, y: 16 },
    { val: 9,  x: 44, y: 52 },
    { val: 22, x: 136, y: 52 },
    { val: 5,  x: 22, y: 88 },
    { val: 12, x: 66, y: 88 },
    { val: 27, x: 158, y: 88 },
  ]
  const edges = [[0,1],[0,2],[1,3],[1,4],[2,5]]
  useEffect(() => {
    let idx = 0
    const id = setInterval(() => {
      setActive(idx % nodes.length)
      idx++
    }, 600)
    return () => clearInterval(id)
  }, [])
  return (
    <svg width="180" height="106" style={{ overflow: 'visible' }}>
      {edges.map(([a, b], i) => (
        <line key={i} x1={nodes[a].x} y1={nodes[a].y} x2={nodes[b].x} y2={nodes[b].y} stroke="var(--c-border-med)" strokeWidth="1.5" />
      ))}
      {nodes.map((n, i) => (
        <g key={i}>
          <circle cx={n.x} cy={n.y} r={14} fill={active === i ? '#10b981' : 'var(--c-surface-2)'} stroke={active === i ? '#10b981' : 'var(--c-border-med)'} strokeWidth="1.5" style={{ transition: 'fill 0.3s, stroke 0.3s' }} />
          <text x={n.x} y={n.y + 4} textAnchor="middle" fontSize="10" fontFamily="JetBrains Mono,monospace" fontWeight="700" fill={active === i ? 'white' : 'var(--c-text-3)'}>{n.val}</text>
        </g>
      ))}
    </svg>
  )
}

// ─── Mini Graph Demo ──────────────────────────────────────────────────────────
function MiniGraphDemo() {
  const nodes = [
    { l: 'A', x: 80,  y: 20  },
    { l: 'B', x: 24,  y: 66  },
    { l: 'C', x: 136, y: 66  },
    { l: 'D', x: 50,  y: 112 },
    { l: 'E', x: 110, y: 112 },
  ]
  const edges = [[0,1],[0,2],[1,3],[2,4],[3,4]]
  const [visited, setVisited] = useState<number[]>([])
  useEffect(() => {
    const order = [0,1,2,3,4]
    let i = 0
    const id = setInterval(() => {
      setVisited(order.slice(0, i + 1))
      i = (i + 1) % (order.length + 1)
      if (i === 0) setVisited([])
    }, 500)
    return () => clearInterval(id)
  }, [])
  return (
    <svg width="160" height="132" style={{ overflow: 'visible' }}>
      {edges.map(([a, b], i) => (
        <line key={i} x1={nodes[a].x} y1={nodes[a].y} x2={nodes[b].x} y2={nodes[b].y}
          stroke={visited.includes(a) && visited.includes(b) ? '#8b5cf6' : 'var(--c-border-med)'}
          strokeWidth={visited.includes(a) && visited.includes(b) ? 2 : 1.5}
          style={{ transition: 'stroke 0.3s' }}
        />
      ))}
      {nodes.map((n, i) => (
        <g key={i}>
          <circle cx={n.x} cy={n.y} r={16} fill={visited.includes(i) ? '#8b5cf6' : 'var(--c-surface-2)'} stroke={visited.includes(i) ? '#8b5cf6' : 'var(--c-border-med)'} strokeWidth="1.5" style={{ transition: 'fill 0.3s' }} />
          <text x={n.x} y={n.y + 5} textAnchor="middle" fontSize="12" fontFamily="Plus Jakarta Sans,sans-serif" fontWeight="700" fill={visited.includes(i) ? 'white' : 'var(--c-text-3)'}>{n.l}</text>
        </g>
      ))}
    </svg>
  )
}

// ─── Stat Item ────────────────────────────────────────────────────────────────
function StatItem({ value, label, suffix, format }: { value: number; label: string; suffix: string; format?: (n: number) => string }) {
  const { ref, visible } = useReveal(0.3)
  const raw = useCounter(value, visible)
  const display = format ? format(raw) : String(raw)
  return (
    <div ref={ref} style={{ textAlign: 'center', opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.7s cubic-bezier(0.4,0,0.2,1)' }}>
      <div className="font-display" style={{ fontSize: 'clamp(36px,4vw,52px)', fontWeight: '800', color: 'var(--c-text-1)', letterSpacing: '-0.04em', lineHeight: '1' }}>
        {display}<span style={{ color: '#818cf8' }}>{suffix}</span>
      </div>
      <div style={{ fontSize: '13px', color: 'var(--c-text-3)', marginTop: '6px', fontWeight: '500' }}>{label}</div>
    </div>
  )
}

// ─── FAQ Accordion ────────────────────────────────────────────────────────────
function FAQItem({ q, a, accent = '#6366f1' }: { q: string; a: string; accent?: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ borderBottom: '1px solid var(--c-border)', overflow: 'hidden' }}>
      <button
        onClick={() => setOpen((o) => !o)}
        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 0', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Inter,sans-serif', textAlign: 'left', gap: '16px' }}
      >
        <span style={{ fontSize: '16px', fontWeight: '600', color: 'var(--c-text-1)', lineHeight: '1.4' }}>{q}</span>
        <span style={{ fontSize: '20px', color: open ? accent : 'var(--c-text-4)', transition: 'transform 0.3s ease, color 0.3s', transform: open ? 'rotate(45deg)' : 'rotate(0deg)', flexShrink: 0 }}>+</span>
      </button>
      <div style={{ maxHeight: open ? '300px' : '0', overflow: 'hidden', transition: 'max-height 0.4s cubic-bezier(0.4,0,0.2,1)' }}>
        <p style={{ fontSize: '15px', color: 'var(--c-text-3)', lineHeight: '1.75', paddingBottom: '20px', margin: 0 }}>{a}</p>
      </div>
    </div>
  )
}

// ─── Main Landing Export ──────────────────────────────────────────────────────
export default function Landing({ onNavigate, isDark = true }: LandingProps) {
  const heroRef = useRef<HTMLDivElement>(null)
  const [scrollY, setScrollY] = useState(0)
  const demoRef = useReveal()
  const featRef = useReveal()
  const roadRef = useReveal()
  const statsRef = useReveal(0.2)
  const testimonRef = useReveal()
  const faqRef = useReveal()
  const ctaRef = useReveal()
  const [activeDemo, setActiveDemo] = useState(0)
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null)
  const [hoveredWorld, setHoveredWorld] = useState<number | null>(null)

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const demos = [
    { label: 'Arrays', icon: '▦',  color: '#6366f1', component: <MiniArrayDemo /> },
    { label: 'Sorting', icon: '⚡', color: '#f59e0b', component: <MiniSortDemo />  },
    { label: 'Trees',   icon: '🌳', color: '#10b981', component: <MiniTreeDemo />  },
    { label: 'Graphs',  icon: '🕸', color: '#8b5cf6', component: <MiniGraphDemo /> },
    { label: 'Stack',   icon: '📦', color: '#f43f5e', component: <MiniStackDemo /> },
  ]

  const features = [
    { icon: '🎯', title: 'Interactive Visualizations', desc: 'Watch every algorithm execute step-by-step with live animations. Not theory — pure hands-on understanding.', color: '#6366f1' },
    { icon: '🤖', title: 'AI Tutor Built-in', desc: 'Stuck? Ask your personal AI tutor anything. Edge cases, interview patterns, complexity analysis — instant answers.', color: '#a855f7' },
    { icon: '🌐', title: '13 Programming Languages', desc: 'Switch between Python, C++, Java, Go, Rust, TypeScript and more — any language, same visual clarity.', color: '#22d3ee' },
    { icon: '📊', title: 'Live Complexity Analysis', desc: 'Time and space complexity displayed in real-time as you run operations. Never memorize Big-O again.', color: '#f59e0b' },
    { icon: '🧠', title: 'Smart Quiz System', desc: 'Topic-aware quizzes with instant feedback, explanations, and XP rewards. Learn by testing yourself.', color: '#10b981' },
    { icon: '👩‍🏫', title: 'Teacher Dashboard', desc: 'Create courses, assign challenges, track student progress. All the visual tools — now for educators.', color: '#f43f5e' },
    { icon: '🔍', title: 'Code Debugger', desc: 'Line-by-line execution with variable inspector. See exactly what happens inside every algorithm.', color: '#06b6d4' },
    { icon: '🏆', title: 'XP & Achievements', desc: 'Earn XP, unlock badges, build streaks, and climb leaderboards. DSA should feel like a great game.', color: '#f59e0b' },
  ]

  const worlds = [
    { id: 'array',      icon: '▦',  name: 'Arrays',       color: '#6366f1', tag: 'Memory Lab',       desc: 'Access, search, insert, delete' },
    { id: 'strings',    icon: '🔤', name: 'Strings',      color: '#22d3ee', tag: 'Character Lab',    desc: 'Reverse, search, palindrome' },
    { id: 'stack',      icon: '📦', name: 'Stack',        color: '#f43f5e', tag: 'LIFO',             desc: 'Push, Pop, Peek operations' },
    { id: 'queue',      icon: '🚶', name: 'Queue',        color: '#a855f7', tag: 'FIFO',             desc: 'Enqueue, Dequeue, BFS' },
    { id: 'linkedlist', icon: '🚂', name: 'Linked List',  color: '#06b6d4', tag: 'Nodes & Pointers', desc: 'Insert, Delete, Reverse' },
    { id: 'trees',      icon: '🌳', name: 'Trees',        color: '#10b981', tag: 'BST Forest',       desc: 'Traversals, Search, Insert' },
    { id: 'graphs',     icon: '🕸', name: 'Graphs',       color: '#8b5cf6', tag: 'Network',          desc: 'BFS, DFS, Dijkstra' },
    { id: 'sorting',    icon: '⚡', name: 'Sorting',      color: '#f59e0b', tag: 'Speed Arena',      desc: 'Bubble, Merge, Quick, Heap' },
    { id: 'searching',  icon: '🔎', name: 'Searching',    color: '#f59e0b', tag: 'Search Lab',       desc: 'Linear, Binary, Jump' },
    { id: 'dp',         icon: '🧩', name: 'Dynamic Prog.',color: '#06b6d4', tag: 'Puzzle Factory',   desc: 'Memo, Tabulation, LCS' },
  ]

  const roadmapSteps = [
    { level: '01', title: 'Foundations', topics: 'Arrays · Strings · Stack · Queue · Linked List', color: '#6366f1', icon: '🧱' },
    { level: '02', title: 'Intermediate', topics: 'Trees · Sorting · Searching · Hash Tables', color: '#10b981', icon: '🌿' },
    { level: '03', title: 'Advanced', topics: 'Graphs · Dynamic Programming · Trie · Greedy', color: '#a855f7', icon: '🚀' },
    { level: '04', title: 'Interview Prep', topics: 'Two Pointers · Sliding Window · Backtracking', color: '#f59e0b', icon: '🏆' },
  ]

  const testimonials = [
    { name: 'Sofia Cruz', role: 'Software Engineer @ Google', avatar: '👩‍🎓', text: 'DSAverse is the first platform where I actually understood recursion. The visualizations make complex concepts click instantly.', color: '#6366f1', stars: 5 },
    { name: 'Marcus Lee', role: 'CS Student @ MIT', avatar: '🧑‍💻', text: 'I cleared my Amazon interview after 3 weeks on DSAverse. The AI Tutor explained edge cases that my professor never covered.', color: '#10b981', stars: 5 },
    { name: 'Priya Sharma', role: 'Backend Dev @ Stripe', avatar: '👩‍💻', text: 'As someone who learns visually, this platform changed everything. I went from struggling with BST to acing graph problems.', color: '#a855f7', stars: 5 },
    { name: 'Alex Johnson', role: 'Bootcamp Graduate', avatar: '👨‍💻', text: "The quiz system and XP rewards kept me coming back every day. Felt more like gaming than studying. Got my first dev job!", color: '#f59e0b', stars: 5 },
    { name: 'Dr. Chen Li', role: 'CS Professor @ Stanford', avatar: '👩‍🏫', text: 'I use DSAverse in my classroom now. The Teacher Dashboard gives me real-time insight into where every student struggles.', color: '#f43f5e', stars: 5 },
    { name: 'Dev Patel', role: 'SDE @ Microsoft', avatar: '👨‍🎓', text: 'The 13-language support is incredible. I could learn algorithms in Go and Python simultaneously. This platform is years ahead.', color: '#22d3ee', stars: 5 },
  ]

  const faqs = [
    { q: 'Is DSAverse completely free?', a: 'Yes — all 10 learning worlds, the AI tutor, quizzes, and code debugger are free forever. We plan a Pro tier for advanced interview prep content, but the core platform stays free.' },
    { q: 'Which programming languages are supported?', a: 'DSAverse supports 13 languages: Python, C, C++, Java, JavaScript, TypeScript, Go, Rust, Kotlin, Swift, PHP, Ruby, and C#. You can switch languages at any time while learning.' },
    { q: 'How does the AI Tutor work?', a: 'The AI Tutor understands the exact DSA topic you\'re studying and answers questions about complexity, edge cases, interview patterns, and implementation tips. No generic responses — always context-aware.' },
    { q: 'Can teachers use this platform?', a: 'Absolutely. The Teacher Dashboard lets you create courses, assign challenges, track individual student progress, schedule live classes, and send announcements — all built into the same platform.' },
    { q: 'Is there a mobile app?', a: 'DSAverse is fully responsive and works on all devices. A dedicated iOS and Android app is on our roadmap for 2026.' },
    { q: 'How is this different from LeetCode or HackerRank?', a: 'DSAverse focuses on understanding first, then practice. Instead of throwing problems at you, we visualize every data structure, explain every operation with animations, and let you experiment before you ever write code.' },
  ]

  return (
    <div style={{ background: 'var(--c-bg)', color: 'var(--c-text-1)', fontFamily: 'Inter, sans-serif', overflowX: 'hidden', position: 'relative' }}>
      <AnimatedCanvas />

      {/* ── NAVBAR ───────────────────────────────────────────────────── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        height: scrollY > 32 ? '60px' : '68px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 clamp(20px,4vw,48px)',
        background: scrollY > 32 ? (isDark ? 'rgba(5,7,15,0.96)' : 'rgba(240,244,255,0.97)') : 'transparent',
        backdropFilter: scrollY > 32 ? 'blur(24px)' : 'none',
        borderBottom: scrollY > 32 ? '1px solid var(--c-border-med)' : '1px solid transparent',
        transition: 'all 0.3s ease',
      }}>
        {/* Logo */}
        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 0' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg,#6366f1,#22d3ee)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'JetBrains Mono,monospace', fontWeight: '700', fontSize: '14px', color: 'white', boxShadow: '0 4px 16px rgba(99,102,241,0.4)' }}>
            {'{}'}
          </div>
          <span className="font-display" style={{ fontWeight: '700', fontSize: '20px', color: 'var(--c-text-1)', letterSpacing: '-0.04em' }}>
            DSA<span style={{ color: '#818cf8' }}>verse</span>
          </span>
        </button>

        {/* Desktop Links */}
        <div className="nav-desktop-links" style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
          {[
            { label: 'Features', href: 'features' },
            { label: 'Demo', href: 'demo' },
            { label: 'Worlds', href: 'worlds' },
            { label: 'Testimonials', href: 'testimonials' },
            { label: 'FAQ', href: 'faq' },
          ].map((l) => (
            <button key={l.label} onClick={() => { document.getElementById(l.href)?.scrollIntoView({ behavior: 'smooth', block: 'start' }) }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--c-text-3)', fontSize: '14px', fontWeight: '500', fontFamily: 'Inter,sans-serif', transition: 'color 0.15s', padding: '4px 0', position: 'relative' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--c-text-1)' }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--c-text-3)' }}
            >
              {l.label}
            </button>
          ))}
        </div>

        {/* CTAs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div className="nav-desktop-cta" style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => onNavigate('auth')} className="btn-ghost" style={{ fontSize: '14px', padding: '8px 18px' }}>Sign In</button>
            <MagneticButton onClick={() => onNavigate('auth')} className="btn-primary" style={{ padding: '8px 22px', fontSize: '14px' }}>
              Start Free →
            </MagneticButton>
          </div>
          <button className="nav-hamburger" style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--c-text-2)', fontSize: '22px', padding: '4px' }} aria-label="Menu">☰</button>
        </div>
      </nav>

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section ref={heroRef} style={{ position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '120px 24px 80px', zIndex: 1, textAlign: 'center' }}>

        {/* Radial glow */}
        <div style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)', width: '800px', height: '600px', background: 'radial-gradient(ellipse at center, rgba(99,102,241,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 2, maxWidth: '960px', animation: 'slide-in 0.8s ease both' }}>
          {/* Badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '100px', padding: '6px 18px', marginBottom: '40px', fontSize: '13px', color: '#818cf8', fontWeight: '600' }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#6366f1', animation: 'pulse-ring 2s ease infinite', display: 'inline-block' }} />
            10 Interactive DSA Worlds · Free Forever
          </div>

          {/* Headline */}
          <h1 className="font-display" style={{ fontSize: 'clamp(44px,6.5vw,88px)', fontWeight: '800', lineHeight: '1.0', letterSpacing: '-0.04em', marginBottom: '28px', color: 'var(--c-text-1)' }}>
            Visualize.{' '}
            <span className="gradient-text">Experiment.</span>
            <br />
            Master Data Structures.
          </h1>

          <p style={{ fontSize: 'clamp(17px,2vw,21px)', color: 'var(--c-text-2)', lineHeight: '1.7', maxWidth: '640px', margin: '0 auto 56px', fontWeight: '400' }}>
            Stop memorizing. Start understanding. DSAverse turns every algorithm into an interactive, animated experience you can see, touch, and explore.
          </p>

          {/* CTAs */}
          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '72px' }}>
            <MagneticButton onClick={() => onNavigate('auth')} className="btn-primary" style={{ fontSize: '16px', padding: '14px 40px', borderRadius: '14px' }}>
              Start Learning Free →
            </MagneticButton>
            <MagneticButton onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })} className="btn-secondary" style={{ fontSize: '16px', padding: '14px 40px', borderRadius: '14px' }}>
              Watch Demo ↓
            </MagneticButton>
          </div>

          {/* Social proof strip */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '24px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--c-text-4)' }}>
              <span>🌟</span>
              <span>Rated <strong style={{ color: 'var(--c-text-2)' }}>4.9/5</strong> by 50,000+ students</span>
            </div>
            <div style={{ width: '1px', height: '16px', background: 'var(--c-border)' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--c-text-4)' }}>
              <span>🏆</span>
              <span><strong style={{ color: 'var(--c-text-2)' }}>50K+</strong> students worldwide</span>
            </div>
            <div style={{ width: '1px', height: '16px', background: 'var(--c-border)' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--c-text-4)' }}>
              <span>⚡</span>
              <span><strong style={{ color: 'var(--c-text-2)' }}>200+</strong> algorithms visualized</span>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{ position: 'absolute', bottom: '32px', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', opacity: 0.4, animation: 'float 2s ease-in-out infinite' }}>
          <div style={{ width: '1px', height: '40px', background: 'linear-gradient(180deg, var(--c-text-4), transparent)' }} />
          <span style={{ fontSize: '11px', color: 'var(--c-text-4)', fontWeight: '600', letterSpacing: '1.5px', textTransform: 'uppercase' }}>Scroll</span>
        </div>
      </section>

      {/* ── STATS ────────────────────────────────────────────────────── */}
      <section style={{ padding: '64px 24px', borderTop: '1px solid var(--c-border-sub)', borderBottom: '1px solid var(--c-border-sub)', background: 'var(--c-card)', position: 'relative', zIndex: 1 }}>
        <div ref={statsRef.ref} style={{ maxWidth: '900px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '32px' }} className="grid-responsive-4">
          <StatItem value={50000} label="Students" suffix="+" format={(n) => n >= 1000 ? `${(n/1000).toFixed(0)}K` : String(n)} />
          <StatItem value={10} label="DSA Worlds" suffix="+" />
          <StatItem value={200} label="Algorithms" suffix="+" />
          <StatItem value={13} label="Languages" suffix="" />
          <StatItem value={4.9} label="Rating" suffix="★" format={(n) => n.toFixed(1)} />
        </div>
      </section>

      {/* ── INTERACTIVE DEMO ─────────────────────────────────────────── */}
      <section id="demo" style={{ padding: '100px 24px', maxWidth: '1100px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div ref={demoRef.ref} style={{ opacity: demoRef.visible ? 1 : 0, transform: demoRef.visible ? 'translateY(0)' : 'translateY(40px)', transition: 'all 0.7s cubic-bezier(0.4,0,0.2,1)' }}>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <div style={{ display: 'inline-block', background: 'rgba(34,211,238,0.1)', border: '1px solid rgba(34,211,238,0.3)', borderRadius: '100px', padding: '6px 18px', fontSize: '13px', color: '#22d3ee', fontWeight: '600', marginBottom: '20px' }}>
              Interactive Preview
            </div>
            <h2 className="type-display-lg" style={{ color: 'var(--c-text-1)' }}>
              See it{' '}<span className="gradient-text">before you sign up.</span>
            </h2>
            <p style={{ fontSize: '18px', color: 'var(--c-text-3)', marginTop: '14px', maxWidth: '520px', margin: '14px auto 0' }}>
              Every visualization is live. Click around — no account needed.
            </p>
          </div>
          {/* Tab selector */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '32px', flexWrap: 'wrap' }}>
            {demos.map((d, i) => (
              <button key={d.label} onClick={() => setActiveDemo(i)}
                style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 18px', borderRadius: '100px', border: `1.5px solid ${activeDemo === i ? d.color : 'var(--c-border-med)'}`, background: activeDemo === i ? `${d.color}18` : 'var(--c-card-2)', color: activeDemo === i ? d.color : 'var(--c-text-3)', fontSize: '13px', fontWeight: activeDemo === i ? '700' : '500', cursor: 'pointer', fontFamily: 'Inter,sans-serif', transition: 'all 0.2s ease' }}>
                <span>{d.icon}</span>{d.label}
              </button>
            ))}
          </div>
          {/* Demo card */}
          <div className="glass-card glass-sheen" style={{ padding: '40px', minHeight: '260px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '24px', boxShadow: 'var(--shadow-xl)', border: `1px solid ${demos[activeDemo].color}30`, transition: 'border-color 0.3s' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '11px', color: demos[activeDemo].color, textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '4px' }}>
                  {demos[activeDemo].label} · Live Preview
                </div>
                <div className="font-display" style={{ fontSize: '18px', fontWeight: '700', color: 'var(--c-text-1)' }}>Interactive Visualization</div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <span className="badge badge-green">Real-time</span>
                <span className="badge badge-indigo">Animated</span>
              </div>
            </div>
            <div style={{ width: '100%', display: 'flex', justifyContent: 'center', padding: '16px 0' }}>
              {demos[activeDemo].component}
            </div>
            <button onClick={() => onNavigate('auth')} style={{ padding: '10px 28px', borderRadius: '10px', background: `${demos[activeDemo].color}15`, border: `1px solid ${demos[activeDemo].color}40`, color: demos[activeDemo].color, fontSize: '14px', fontWeight: '600', cursor: 'pointer', fontFamily: 'Inter,sans-serif', transition: 'all 0.2s' }}>
              Try Full {demos[activeDemo].label} World →
            </button>
          </div>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────────────── */}
      <section id="features" style={{ padding: '100px 24px', background: 'var(--c-card)', borderTop: '1px solid var(--c-border-sub)', borderBottom: '1px solid var(--c-border-sub)', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div ref={featRef.ref} style={{ opacity: featRef.visible ? 1 : 0, transform: featRef.visible ? 'translateY(0)' : 'translateY(40px)', transition: 'all 0.7s ease' }}>
            <div style={{ textAlign: 'center', marginBottom: '64px' }}>
              <div style={{ display: 'inline-block', background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.3)', borderRadius: '100px', padding: '6px 18px', fontSize: '13px', color: '#a855f7', fontWeight: '600', marginBottom: '20px' }}>Platform Features</div>
              <h2 className="type-display-lg" style={{ color: 'var(--c-text-1)' }}>
                Everything you need to<br /><span className="gradient-text">master any algorithm.</span>
              </h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px,1fr))', gap: '16px' }}>
              {features.map((f, i) => (
                <div key={f.title} onMouseEnter={() => setHoveredFeature(i)} onMouseLeave={() => setHoveredFeature(null)}
                  style={{ padding: '28px', borderRadius: '16px', background: hoveredFeature === i ? `${f.color}08` : 'var(--c-surface)', border: `1px solid ${hoveredFeature === i ? f.color + '35' : 'var(--c-border)'}`, transition: 'all 0.3s ease', transform: hoveredFeature === i ? 'translateY(-4px)' : 'translateY(0)', boxShadow: hoveredFeature === i ? `0 16px 40px ${f.color}15` : 'none', cursor: 'default' }}>
                  <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: `${f.color}18`, border: `1px solid ${f.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', marginBottom: '18px' }}>{f.icon}</div>
                  <div className="font-display" style={{ fontSize: '17px', fontWeight: '700', color: 'var(--c-text-1)', marginBottom: '10px', letterSpacing: '-0.02em' }}>{f.title}</div>
                  <div style={{ fontSize: '14px', color: 'var(--c-text-3)', lineHeight: '1.7' }}>{f.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── WORLDS GRID ──────────────────────────────────────────────── */}
      <section id="worlds" style={{ padding: '100px 24px', maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <div style={{ display: 'inline-block', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '100px', padding: '6px 18px', fontSize: '13px', color: '#818cf8', fontWeight: '600', marginBottom: '20px' }}>10 Learning Worlds</div>
          <h2 className="type-display-lg" style={{ color: 'var(--c-text-1)' }}>
            Every data structure has<br /><span className="gradient-text">its own universe.</span>
          </h2>
          <p style={{ fontSize: '18px', color: 'var(--c-text-3)', marginTop: '16px', maxWidth: '560px', margin: '16px auto 0' }}>
            Each world has a unique visual identity and real-world analogies. Sign in to unlock all of them.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px,1fr))', gap: '14px' }}>
          {worlds.map((w, i) => (
            <button key={w.id} onClick={() => onNavigate('auth')} onMouseEnter={() => setHoveredWorld(i)} onMouseLeave={() => setHoveredWorld(null)}
              style={{ padding: '24px', borderRadius: '16px', background: hoveredWorld === i ? `linear-gradient(135deg, ${w.color}14, ${w.color}04)` : 'var(--c-card)', border: `1px solid ${hoveredWorld === i ? w.color + '45' : 'var(--c-border)'}`, cursor: 'pointer', textAlign: 'left', fontFamily: 'Inter,sans-serif', transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)', transform: hoveredWorld === i ? 'translateY(-6px)' : 'translateY(0)', boxShadow: hoveredWorld === i ? `0 16px 40px ${w.color}20` : 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: `${w.color}18`, border: `1px solid ${w.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', transition: 'transform 0.3s', transform: hoveredWorld === i ? 'scale(1.1) rotate(-5deg)' : 'scale(1)' }}>{w.icon}</div>
                <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '10px', color: w.color, background: `${w.color}12`, border: `1px solid ${w.color}25`, padding: '3px 8px', borderRadius: '6px', fontWeight: '600', textTransform: 'uppercase' }}>{w.tag}</span>
              </div>
              <div className="font-display" style={{ fontSize: '15px', fontWeight: '700', color: 'var(--c-text-1)', marginBottom: '6px', letterSpacing: '-0.02em' }}>{w.name}</div>
              <div style={{ fontSize: '13px', color: 'var(--c-text-3)', lineHeight: '1.5', marginBottom: '12px' }}>{w.desc}</div>
              <div style={{ fontSize: '12px', color: w.color, fontWeight: '600', opacity: hoveredWorld === i ? 1 : 0.6, transition: 'opacity 0.2s' }}>Explore World →</div>
            </button>
          ))}
        </div>
      </section>

      {/* ── LEARNING ROADMAP ─────────────────────────────────────────── */}
      <section style={{ padding: '100px 24px', background: 'var(--c-card)', borderTop: '1px solid var(--c-border-sub)', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: '860px', margin: '0 auto' }}>
          <div ref={roadRef.ref} style={{ opacity: roadRef.visible ? 1 : 0, transform: roadRef.visible ? 'translateY(0)' : 'translateY(40px)', transition: 'all 0.7s ease' }}>
            <div style={{ textAlign: 'center', marginBottom: '64px' }}>
              <div style={{ display: 'inline-block', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '100px', padding: '6px 18px', fontSize: '13px', color: '#10b981', fontWeight: '600', marginBottom: '20px' }}>Learning Path</div>
              <h2 className="type-display-lg" style={{ color: 'var(--c-text-1)' }}>
                A clear path from<br /><span className="gradient-text">beginner to interview-ready.</span>
              </h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
              {roadmapSteps.map((step, i) => (
                <div key={step.level} style={{ display: 'flex', gap: '28px', paddingBottom: '0', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                    <div style={{ width: '52px', height: '52px', borderRadius: '16px', background: `${step.color}20`, border: `2px solid ${step.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', boxShadow: `0 0 20px ${step.color}25` }}>{step.icon}</div>
                    {i < roadmapSteps.length - 1 && <div style={{ width: '2px', height: '60px', background: `linear-gradient(180deg, ${step.color}60, ${roadmapSteps[i+1].color}40)`, margin: '6px 0' }} />}
                  </div>
                  <div style={{ flex: 1, padding: '10px 0 52px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                      <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '11px', color: step.color, fontWeight: '700', letterSpacing: '1.5px' }}>{step.level}</span>
                      <div className="font-display" style={{ fontSize: '20px', fontWeight: '700', color: 'var(--c-text-1)', letterSpacing: '-0.02em' }}>{step.title}</div>
                    </div>
                    <div style={{ fontSize: '14px', color: 'var(--c-text-3)', lineHeight: '1.7' }}>{step.topics}</div>
                    <button onClick={() => onNavigate('auth')} style={{ marginTop: '12px', padding: '6px 16px', borderRadius: '8px', background: `${step.color}12`, border: `1px solid ${step.color}30`, color: step.color, fontSize: '12px', fontWeight: '600', cursor: 'pointer', fontFamily: 'Inter,sans-serif', transition: 'all 0.2s' }}>
                      Start {step.title} →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────────────── */}
      <section id="testimonials" style={{ padding: '100px 24px', maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div ref={testimonRef.ref} style={{ opacity: testimonRef.visible ? 1 : 0, transform: testimonRef.visible ? 'translateY(0)' : 'translateY(40px)', transition: 'all 0.7s ease' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <h2 className="type-display-lg" style={{ color: 'var(--c-text-1)' }}>
              Students who got<br /><span className="gradient-text">the job they wanted.</span>
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px,1fr))', gap: '16px' }}>
            {testimonials.map((t, i) => (
              <div key={t.name} className="glass-card glass-sheen" style={{ padding: '28px', transition: 'all 0.3s ease', animation: testimonRef.visible ? `slide-in 0.6s ease ${i * 0.1}s both` : 'none' }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = t.color + '35' }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'var(--c-border)' }}>
                <div style={{ display: 'flex', gap: '4px', marginBottom: '16px' }}>
                  {Array(t.stars).fill(0).map((_, j) => (
                    <span key={j} style={{ color: '#f59e0b', fontSize: '14px' }}>★</span>
                  ))}
                </div>
                <p style={{ fontSize: '14px', color: 'var(--c-text-2)', lineHeight: '1.75', marginBottom: '20px', fontStyle: 'italic' }}>"{t.text}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: `${t.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', border: `1px solid ${t.color}30` }}>{t.avatar}</div>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--c-text-1)' }}>{t.name}</div>
                    <div style={{ fontSize: '12px', color: t.color, fontWeight: '500' }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────── */}
      <section id="faq" style={{ padding: '100px 24px', background: 'var(--c-card)', borderTop: '1px solid var(--c-border-sub)', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: '760px', margin: '0 auto' }}>
          <div ref={faqRef.ref} style={{ opacity: faqRef.visible ? 1 : 0, transform: faqRef.visible ? 'translateY(0)' : 'translateY(40px)', transition: 'all 0.7s ease' }}>
            <div style={{ textAlign: 'center', marginBottom: '56px' }}>
              <h2 className="type-display-lg" style={{ color: 'var(--c-text-1)' }}>
                Frequently asked<br /><span className="gradient-text">questions.</span>
              </h2>
            </div>
            <div>
              {faqs.map((f, i) => (
                <FAQItem key={i} q={f.q} a={f.a} accent="#6366f1" />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────────────────── */}
      <section style={{ padding: '120px 24px', textAlign: 'center', position: 'relative', zIndex: 1, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 70% 70% at 50% 50%, rgba(99,102,241,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div ref={ctaRef.ref} style={{ position: 'relative', maxWidth: '800px', margin: '0 auto', opacity: ctaRef.visible ? 1 : 0, transform: ctaRef.visible ? 'translateY(0)' : 'translateY(40px)', transition: 'all 0.8s cubic-bezier(0.4,0,0.2,1)' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: '100px', padding: '6px 18px', fontSize: '13px', color: '#f59e0b', fontWeight: '600', marginBottom: '32px' }}>
            🚀 Join 50,000+ students today — completely free
          </div>
          <h2 className="type-display-xl" style={{ color: 'var(--c-text-1)', marginBottom: '20px', lineHeight: '1.02' }}>
            Ready to master DSA<br /><span className="gradient-text">the right way?</span>
          </h2>
          <p style={{ fontSize: '18px', color: 'var(--c-text-3)', marginBottom: '52px', lineHeight: '1.7', maxWidth: '560px', margin: '0 auto 52px' }}>
            Join students who stopped memorizing and started understanding. No credit card. No limits. Free forever.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center', maxWidth: '400px', margin: '0 auto' }}>
            <MagneticButton onClick={() => onNavigate('auth')} className="btn-primary" style={{ width: '100%', fontSize: '17px', padding: '16px 32px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              🔵 Continue with Google
            </MagneticButton>
            <MagneticButton onClick={() => onNavigate('auth')} className="btn-secondary" style={{ width: '100%', fontSize: '17px', padding: '16px 32px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              ⚫ Continue with GitHub
            </MagneticButton>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', margin: '4px 0' }}>
              <div style={{ flex: 1, height: '1px', background: 'var(--c-border)' }} />
              <span style={{ fontSize: '12px', color: 'var(--c-text-5)' }}>or</span>
              <div style={{ flex: 1, height: '1px', background: 'var(--c-border)' }} />
            </div>
            <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
              <MagneticButton onClick={() => onNavigate('auth')} className="btn-primary" style={{ flex: 1, fontSize: '15px', padding: '13px', borderRadius: '12px' }}>
                Sign Up Free
              </MagneticButton>
              <MagneticButton onClick={() => onNavigate('auth')} className="btn-secondary" style={{ flex: 1, fontSize: '15px', padding: '13px', borderRadius: '12px' }}>
                Sign In
              </MagneticButton>
            </div>
          </div>
          <p style={{ marginTop: '24px', fontSize: '13px', color: 'var(--c-text-5)' }}>
            No credit card required · Free forever · 50,000+ students
          </p>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────── */}
      <footer style={{ borderTop: '1px solid var(--c-border)', padding: '64px 24px 40px', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '48px', marginBottom: '56px' }}>
            {/* Brand */}
            <div style={{ maxWidth: '280px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: 'linear-gradient(135deg,#6366f1,#22d3ee)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'JetBrains Mono,monospace', fontWeight: '700', fontSize: '13px', color: 'white' }}>
                  {'{}'}
                </div>
                <span className="font-display" style={{ fontWeight: '700', fontSize: '19px', color: 'var(--c-text-1)', letterSpacing: '-0.04em' }}>
                  DSA<span style={{ color: '#818cf8' }}>verse</span>
                </span>
              </div>
              <p style={{ fontSize: '14px', color: 'var(--c-text-4)', lineHeight: '1.75' }}>
                The world's most interactive platform for learning Data Structures & Algorithms through visualization.
              </p>
              <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                {['Twitter', 'GitHub', 'Discord'].map((s) => (
                  <button key={s} style={{ padding: '6px 12px', borderRadius: '8px', background: 'var(--c-card-2)', border: '1px solid var(--c-border)', color: 'var(--c-text-4)', fontSize: '12px', cursor: 'pointer', fontFamily: 'Inter,sans-serif', transition: 'all 0.2s' }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--c-text-1)'; e.currentTarget.style.borderColor = 'var(--c-border-med)' }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--c-text-4)'; e.currentTarget.style.borderColor = 'var(--c-border)' }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
            {/* Links */}
            {[
              { title: 'Product', links: ['Features', 'Worlds', 'Demo', 'Pricing', 'Changelog'] },
              { title: 'Learn', links: ['Arrays', 'Trees', 'Graphs', 'Sorting', 'Dynamic Prog.'] },
              { title: 'Company', links: ['About', 'Blog', 'Careers', 'Contact', 'Privacy'] },
            ].map((col) => (
              <div key={col.title}>
                <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--c-text-2)', textTransform: 'uppercase', letterSpacing: '1.2px', marginBottom: '16px' }}>{col.title}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {col.links.map((l) => (
                    <span key={l} style={{ fontSize: '14px', color: 'var(--c-text-4)', cursor: 'pointer', transition: 'color 0.15s' }}
                      onMouseEnter={(e) => { (e.target as HTMLElement).style.color = 'var(--c-text-1)' }}
                      onMouseLeave={(e) => { (e.target as HTMLElement).style.color = 'var(--c-text-4)' }}>
                      {l}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div style={{ borderTop: '1px solid var(--c-border)', paddingTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <span style={{ fontSize: '13px', color: 'var(--c-text-5)' }}>© 2026 DSAverse. All rights reserved.</span>
            <span style={{ fontSize: '13px', color: 'var(--c-text-5)' }}>Built with ❤️ for every student who deserves to understand algorithms.</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
