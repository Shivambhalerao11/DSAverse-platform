import React, { useState, useRef, useEffect } from 'react'
import { loginUser, registerUser, verifyOtp, forgotPassword } from '../services/api'
import { initiateGoogleLogin, isGoogleConfigured } from '../services/auth/googleAuth'
import { initiateGithubLogin, isGithubConfigured } from '../services/auth/githubAuth'
import { handleOAuthCallback, saveSession } from '../services/auth/authService'

interface AuthProps {
  onNavigate: (view: string) => void
  isDark?: boolean
}

type AuthScreen = 'welcome' | 'login' | 'register' | 'forgot' | 'otp' | 'reset' | 'success'

// ─── SVG Vector Icons for Clean Rendering (No Mojibake) ──────────────────────
function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.25 21.3 7.31 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.17 0 9.99 0 12s.46 3.83 1.26 5.42l4.02-3.15z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.25 2.7 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
      />
    </svg>
  )
}

function GithubIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  )
}

function MailIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  )
}

function LockIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  )
}

function UserIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}

function EyeIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

function EyeOffIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  )
}

function FloatingOrbs() {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
      <div style={{ position: 'absolute', top: '10%', left: '15%', width: '380px', height: '380px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, rgba(99,102,241,0) 70%)', filter: 'blur(40px)' }} />
      <div style={{ position: 'absolute', bottom: '15%', right: '10%', width: '420px', height: '420px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(168,85,247,0.1) 0%, rgba(168,85,247,0) 70%)', filter: 'blur(50px)' }} />
    </div>
  )
}

function SocialBtn({
  icon,
  label,
  onClick,
  loading = false,
}: {
  icon: React.ReactNode
  label: string
  onClick?: () => void
  loading?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
        padding: '12px 16px',
        borderRadius: '12px',
        background: 'var(--c-card)',
        border: '1px solid var(--c-input-border)',
        color: 'var(--c-text-1)',
        fontSize: '13.5px',
        fontWeight: '600',
        cursor: loading ? 'not-allowed' : 'pointer',
        transition: 'all 0.2s cubic-bezier(0.34,1.56,0.64,1)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        fontFamily: 'Inter, sans-serif',
        opacity: loading ? 0.7 : 1,
      }}
      onMouseEnter={(e) => {
        if (!loading) {
          e.currentTarget.style.borderColor = 'rgba(99,102,241,0.5)'
          e.currentTarget.style.background = 'var(--c-card-2)'
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--c-input-border)'
        e.currentTarget.style.background = 'var(--c-card)'
      }}
    >
      {loading ? <span style={{ fontSize: '14px' }}>⏳</span> : icon}
      {loading ? 'Connecting...' : label}
    </button>
  )
}

function InputField({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  icon,
  error,
  capsLock,
  onKeyDown,
}: {
  label: string
  type?: string
  placeholder: string
  value: string
  onChange: (v: string) => void
  icon?: React.ReactNode
  error?: string
  capsLock?: boolean
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
}) {
  const [showPw, setShowPw] = useState(false)
  const isPassword = type === 'password'
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <div style={{ marginBottom: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--c-text-3)', letterSpacing: '0.3px' }}>
          {label}
        </label>
        {capsLock && (
          <span style={{ fontSize: '11px', color: '#f59e0b', fontWeight: '600' }}>
            ⇪ Caps Lock is ON
          </span>
        )}
      </div>

      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        {icon && (
          <span style={{ position: 'absolute', left: '14px', color: 'var(--c-text-4)', display: 'flex', alignItems: 'center' }}>
            {icon}
          </span>
        )}
        <input
          ref={inputRef}
          type={isPassword && showPw ? 'text' : type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          style={{
            width: '100%',
            padding: icon ? '12px 40px 12px 40px' : '12px 14px',
            borderRadius: '12px',
            background: 'var(--c-card)',
            border: error ? '1px solid #f43f5e' : '1px solid var(--c-input-border)',
            color: 'var(--c-text-1)',
            fontSize: '14.5px',
            fontFamily: 'Inter, sans-serif',
            outline: 'none',
            transition: 'all 0.2s',
          }}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPw((s) => !s)}
            style={{
              position: 'absolute', right: '12px', background: 'none', border: 'none',
              cursor: 'pointer', color: 'var(--c-text-4)', display: 'flex', alignItems: 'center',
            }}
          >
            {showPw ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        )}
      </div>

      {error && (
        <div style={{ fontSize: '11.5px', color: '#f43f5e', marginTop: '6px', fontWeight: '500' }}>
          ⚠️ {error}
        </div>
      )}
    </div>
  )
}

function PasswordStrengthMeter({ password }: { password: string }) {
  if (!password) return null

  let score = 0
  if (password.length >= 8) score++
  if (/[A-Z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++

  const labels = [
    { label: 'Weak', color: '#f43f5e' },
    { label: 'Fair', color: '#f59e0b' },
    { label: 'Good', color: '#3b82f6' },
    { label: 'Strong', color: '#10b981' },
  ]
  const current = labels[Math.min(score, 3)]

  return (
    <div style={{ marginBottom: '16px', marginTop: '-8px' }}>
      <div style={{ display: 'flex', gap: '4px', marginBottom: '6px' }}>
        {[1, 2, 3, 4].map((step) => (
          <div
            key={step}
            style={{
              flex: 1, height: '4px', borderRadius: '2px',
              background: step <= score ? current.color : 'var(--c-border)',
              transition: 'all 0.2s',
            }}
          />
        ))}
      </div>
      <div style={{ fontSize: '11px', color: current.color, fontWeight: '600', textAlign: 'right' }}>
        Strength: {current.label}
      </div>
    </div>
  )
}

export default function Auth({ onNavigate }: AuthProps) {
  const [screen, setScreen] = useState<AuthScreen>('welcome')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [role, setRole] = useState<'student' | 'teacher'>('student')
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [capsLock, setCapsLock] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  // Handle OAuth Redirect Callbacks on Mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const provider = params.get('provider') as 'google' | 'github' | null
    const code = params.get('code')

    if (provider && (code || provider)) {
      setLoading(true)
      handleOAuthCallback(provider, code || 'mock_code')
        .then(() => {
          onNavigate('dashboard')
        })
        .catch((err: unknown) => {
          setErrorMessage(`OAuth Login Failed: ${err instanceof Error ? err.message : String(err)}`)
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }, [onNavigate])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    setCapsLock(e.getModifierState('CapsLock'))
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      setErrorMessage('Please fill in all required fields.')
      return
    }
    setLoading(true)
    setErrorMessage('')
    try {
      const res = await loginUser(email, password)
      if (res.token && res.user) {
        saveSession(res.token, res.user, rememberMe)
      }
      onNavigate('dashboard')
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password || !fullName) {
      setErrorMessage('Please complete all registration fields.')
      return
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.')
      return
    }
    if (!acceptTerms) {
      setErrorMessage('You must accept the Terms of Service to continue.')
      return
    }
    setLoading(true)
    setErrorMessage('')
    try {
      await registerUser(email, password, fullName, role)
      setScreen('otp')
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    const code = otp.join('')
    if (code.length < 6) {
      setErrorMessage('Please enter complete 6-digit OTP.')
      return
    }
    setLoading(true)
    setErrorMessage('')
    try {
      const res = await verifyOtp(email, code)
      if (res.token && res.user) {
        saveSession(res.token, res.user, true)
      }
      setScreen('success')
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Invalid OTP code')
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) {
      setErrorMessage('Please enter your registered email.')
      return
    }
    setLoading(true)
    setErrorMessage('')
    try {
      await forgotPassword(email)
      setScreen('otp')
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Failed to dispatch reset link')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        background: 'var(--c-bg)',
        position: 'relative',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      <FloatingOrbs />

      <div
        style={{
          width: '100%',
          maxWidth: '440px',
          padding: '36px',
          borderRadius: '24px',
          background: 'var(--c-card)',
          border: '1px solid var(--c-border)',
          boxShadow: '0 24px 64px rgba(0,0,0,0.3)',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Header Title */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #6366f1, #22d3ee)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '22px',
              fontWeight: '800',
              color: '#fff',
              marginBottom: '12px',
              boxShadow: '0 8px 24px rgba(99,102,241,0.3)',
            }}
          >
            {"{}"}
          </div>
          <h1
            className="font-display"
            style={{ fontSize: '24px', fontWeight: '800', letterSpacing: '-0.03em', color: 'var(--c-text-1)', margin: '0 0 6px' }}
          >
            DSAVerse
          </h1>
          <p style={{ fontSize: '13.5px', color: 'var(--c-text-3)', margin: 0 }}>
            {screen === 'welcome' && 'Master Data Structures & Algorithms visually'}
            {screen === 'login' && 'Sign in to access your learning dashboard'}
            {screen === 'register' && 'Create your interactive student workspace'}
            {screen === 'forgot' && 'Reset your account security credentials'}
            {screen === 'otp' && 'Enter 6-digit verification code'}
            {screen === 'success' && 'Authentication Verified!'}
          </p>
        </div>

        {errorMessage && (
          <div
            role="alert" aria-live="assertive" style={{
              padding: '10px 14px',
              borderRadius: '12px',
              background: 'rgba(244,63,94,0.12)',
              border: '1px solid rgba(244,63,94,0.3)',
              color: '#f43f5e',
              fontSize: '13px',
              marginBottom: '20px',
              fontWeight: '500',
            }}
          >
            ⚠️ {errorMessage}
          </div>
        )}

        {/* WELCOME SCREEN */}
        {screen === 'welcome' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <SocialBtn icon={<GoogleIcon />} label="Continue with Google" onClick={initiateGoogleLogin} />
            <SocialBtn icon={<GithubIcon />} label="Continue with GitHub" onClick={initiateGithubLogin} />

            <div style={{ display: 'flex', alignItems: 'center', margin: '8px 0' }}>
              <div style={{ flex: 1, height: '1px', background: 'var(--c-border)' }} />
              <span style={{ fontSize: '11px', color: 'var(--c-text-4)', padding: '0 12px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                or
              </span>
              <div style={{ flex: 1, height: '1px', background: 'var(--c-border)' }} />
            </div>

            <button
              onClick={() => { setScreen('login'); setErrorMessage('') }}
              style={{
                width: '100%',
                padding: '13px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                border: 'none',
                color: '#fff',
                fontWeight: '600',
                fontSize: '14.5px',
                cursor: 'pointer',
                fontFamily: 'Inter, sans-serif',
                boxShadow: '0 8px 20px rgba(99,102,241,0.3)',
              }}
            >
              Sign In with Email
            </button>

            <button
              onClick={() => { setScreen('register'); setErrorMessage('') }}
              style={{
                width: '100%',
                padding: '13px',
                borderRadius: '12px',
                background: 'var(--c-card-2)',
                border: '1px solid var(--c-border-med)',
                color: 'var(--c-text-1)',
                fontWeight: '600',
                fontSize: '14.5px',
                cursor: 'pointer',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              Create New Account
            </button>
          </div>
        )}

        {/* LOGIN SCREEN */}
        {screen === 'login' && (
          <form onSubmit={handleLogin}>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
              <SocialBtn icon={<GoogleIcon />} label="Google" onClick={initiateGoogleLogin} />
              <SocialBtn icon={<GithubIcon />} label="GitHub" onClick={initiateGithubLogin} />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ flex: 1, height: '1px', background: 'var(--c-border)' }} />
              <span style={{ fontSize: '11px', color: 'var(--c-text-4)', padding: '0 12px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                or email
              </span>
              <div style={{ flex: 1, height: '1px', background: 'var(--c-border)' }} />
            </div>

            <InputField
              label="Email Address"
              type="email"
              placeholder="name@company.com"
              value={email}
              onChange={setEmail}
              icon={<MailIcon />}
            />

            <InputField
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={setPassword}
              icon={<LockIcon />}
              capsLock={capsLock}
              onKeyDown={handleKeyDown}
            />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', color: 'var(--c-text-3)' }}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={{ accentColor: '#6366f1' }}
                />
                Remember Me
              </label>

              <button
                type="button"
                onClick={() => { setScreen('forgot'); setErrorMessage('') }}
                style={{ background: 'none', border: 'none', color: '#6366f1', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}
              >
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '13px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                border: 'none',
                color: '#fff',
                fontWeight: '600',
                fontSize: '14.5px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: 'Inter, sans-serif',
                boxShadow: '0 8px 20px rgba(99,102,241,0.3)',
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>

            <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '13.5px', color: 'var(--c-text-3)' }}>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => { setScreen('register'); setErrorMessage('') }}
                style={{ background: 'none', border: 'none', color: '#6366f1', fontWeight: '600', cursor: 'pointer' }}
              >
                Sign Up
              </button>
            </div>
          </form>
        )}

        {/* REGISTER SCREEN */}
        {screen === 'register' && (
          <form onSubmit={handleRegister}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--c-text-3)', marginBottom: '8px' }}>
                Account Role
              </label>
              <div style={{ display: 'flex', gap: '10px' }}>
                {(['student', 'teacher'] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    style={{
                      flex: 1,
                      padding: '10px',
                      borderRadius: '10px',
                      background: role === r ? 'rgba(99,102,241,0.15)' : 'var(--c-card-2)',
                      border: role === r ? '1px solid #6366f1' : '1px solid var(--c-border)',
                      color: role === r ? '#6366f1' : 'var(--c-text-3)',
                      fontSize: '13px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      textTransform: 'capitalize',
                    }}
                  >
                    {r === 'student' ? '🎓 Student' : '👨‍🏫 Teacher'}
                  </button>
                ))}
              </div>
            </div>

            <InputField
              label="Full Name"
              placeholder="Alex Johnson"
              value={fullName}
              onChange={setFullName}
              icon={<UserIcon />}
            />

            <InputField
              label="Email Address"
              type="email"
              placeholder="name@company.com"
              value={email}
              onChange={setEmail}
              icon={<MailIcon />}
            />

            <InputField
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={setPassword}
              icon={<LockIcon />}
              capsLock={capsLock}
              onKeyDown={handleKeyDown}
            />

            <PasswordStrengthMeter password={password} />

            <InputField
              label="Confirm Password"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={setConfirmPassword}
              icon={<LockIcon />}
            />

            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '12.5px', color: 'var(--c-text-3)', marginBottom: '20px' }}>
              <input
                type="checkbox"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                style={{ accentColor: '#6366f1' }}
              />
              I agree to the Terms of Service & Privacy Policy
            </label>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '13px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                border: 'none',
                color: '#fff',
                fontWeight: '600',
                fontSize: '14.5px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: 'Inter, sans-serif',
                boxShadow: '0 8px 20px rgba(99,102,241,0.3)',
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>

            <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '13.5px', color: 'var(--c-text-3)' }}>
              Already registered?{' '}
              <button
                type="button"
                onClick={() => { setScreen('login'); setErrorMessage('') }}
                style={{ background: 'none', border: 'none', color: '#6366f1', fontWeight: '600', cursor: 'pointer' }}
              >
                Sign In
              </button>
            </div>
          </form>
        )}

        {/* FORGOT PASSWORD */}
        {screen === 'forgot' && (
          <form onSubmit={handleForgotPassword}>
            <p style={{ fontSize: '13.5px', color: 'var(--c-text-3)', lineHeight: '1.6', marginBottom: '20px' }}>
              Enter your registered email address and we will send a 6-digit security OTP code to reset your password.
            </p>

            <InputField
              label="Email Address"
              type="email"
              placeholder="name@company.com"
              value={email}
              onChange={setEmail}
              icon={<MailIcon />}
            />

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '13px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                border: 'none',
                color: '#fff',
                fontWeight: '600',
                fontSize: '14.5px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: 'Inter, sans-serif',
                boxShadow: '0 8px 20px rgba(99,102,241,0.3)',
                marginTop: '10px',
              }}
            >
              {loading ? 'Sending OTP...' : 'Send Verification OTP'}
            </button>

            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <button
                type="button"
                onClick={() => { setScreen('login'); setErrorMessage('') }}
                style={{ background: 'none', border: 'none', color: '#6366f1', fontSize: '13.5px', fontWeight: '600', cursor: 'pointer' }}
              >
                Back to Sign In
              </button>
            </div>
          </form>
        )}

        {/* OTP VERIFICATION */}
        {screen === 'otp' && (
          <form onSubmit={handleVerifyOtp}>
            <p style={{ fontSize: '13.5px', color: 'var(--c-text-3)', lineHeight: '1.6', marginBottom: '20px' }}>
              Enter the 6-digit verification code dispatched to <strong>{email || 'your email'}</strong>.
            </p>

            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '24px' }}>
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  id={`otp-input-${idx}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => {
                    const val = e.target.value
                    const newOtp = [...otp]
                    newOtp[idx] = val
                    setOtp(newOtp)
                    if (val && idx < 5) {
                      const next = document.getElementById(`otp-input-${idx + 1}`)
                      next?.focus()
                    }
                  }}
                  style={{
                    width: '44px',
                    height: '52px',
                    textAlign: 'center',
                    fontSize: '20px',
                    fontWeight: '700',
                    borderRadius: '12px',
                    background: 'var(--c-card-2)',
                    border: '1px solid var(--c-border-med)',
                    color: 'var(--c-text-1)',
                    outline: 'none',
                  }}
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '13px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                border: 'none',
                color: '#fff',
                fontWeight: '600',
                fontSize: '14.5px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: 'Inter, sans-serif',
                boxShadow: '0 8px 20px rgba(99,102,241,0.3)',
              }}
            >
              {loading ? 'Verifying Code...' : 'Verify & Continue'}
            </button>
          </form>
        )}

        {/* SUCCESS SCREEN */}
        {screen === 'success' && (
          <div style={{ textAlign: 'center', padding: '12px 0' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎉</div>
            <h2 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--c-text-1)', marginBottom: '8px' }}>
              Authentication Successful
            </h2>
            <p style={{ fontSize: '13.5px', color: 'var(--c-text-3)', marginBottom: '24px' }}>
              Your credentials have been verified. Welcome to your DSAVerse learning workspace.
            </p>
            <button
              onClick={() => onNavigate('dashboard')}
              style={{
                width: '100%',
                padding: '13px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                border: 'none',
                color: '#fff',
                fontWeight: '600',
                fontSize: '14.5px',
                cursor: 'pointer',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              Enter Dashboard ➡
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
