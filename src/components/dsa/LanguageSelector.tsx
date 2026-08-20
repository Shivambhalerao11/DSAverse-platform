import { useState, useRef, useEffect } from 'react'
import { ALL_LANGUAGES, LANGUAGE_METADATA, type SupportedLanguage } from '../../data/dsaCodeSnippets'

interface LanguageSelectorProps {
  language: SupportedLanguage
  onLanguageChange: (lang: SupportedLanguage) => void
  accentColor?: string
}

export default function LanguageSelector({
  language,
  onLanguageChange,
  accentColor = '#6366f1',
}: LanguageSelectorProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [favorites, setFavorites] = useState<SupportedLanguage[]>(() => {
    try {
      const saved = localStorage.getItem('dsaverse-fav-langs')
      return saved ? JSON.parse(saved) : ['Python', 'JavaScript', 'C++']
    } catch {
      return ['Python', 'JavaScript', 'C++']
    }
  })
  const [recents, setRecents] = useState<SupportedLanguage[]>(() => {
    try {
      const saved = localStorage.getItem('dsaverse-recent-langs')
      return saved ? JSON.parse(saved) : ['Python', 'JavaScript']
    } catch {
      return ['Python', 'JavaScript']
    }
  })
  const [focusedIndex, setFocusedIndex] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  const meta = LANGUAGE_METADATA[language] || { icon: '💻', ext: 'txt', color: accentColor }

  // Toggle favorite
  const toggleFavorite = (lang: SupportedLanguage, e: React.MouseEvent) => {
    e.stopPropagation()
    const updated = favorites.includes(lang)
      ? favorites.filter((l) => l !== lang)
      : [...favorites, lang]
    setFavorites(updated)
    try {
      localStorage.setItem('dsaverse-fav-langs', JSON.stringify(updated))
    } catch {}
  }

  // Handle select language
  const selectLanguage = (lang: SupportedLanguage) => {
    onLanguageChange(lang)
    const updatedRecents = [lang, ...recents.filter((l) => l !== lang)].slice(0, 4)
    setRecents(updatedRecents)
    try {
      localStorage.setItem('dsaverse-recent-langs', JSON.stringify(updatedRecents))
    } catch {}
    setOpen(false)
    setSearch('')
  }

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
        setSearch('')
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Filtered languages
  const filtered = ALL_LANGUAGES.filter((l) =>
    l.toLowerCase().includes(search.trim().toLowerCase())
  )

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        setOpen(true)
        e.preventDefault()
      }
      return
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setFocusedIndex((prev) => (prev + 1) % filtered.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setFocusedIndex((prev) => (prev - 1 + filtered.length) % filtered.length)
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (filtered[focusedIndex]) {
        selectLanguage(filtered[focusedIndex])
      }
    } else if (e.key === 'Escape') {
      setOpen(false)
      setSearch('')
    }
  }

  return (
    <div ref={containerRef} style={{ position: 'relative' }} onKeyDown={handleKeyDown}>
      {/* Trigger Button */}
      <button
        onClick={() => {
          setOpen((o) => !o)
          setTimeout(() => searchInputRef.current?.focus(), 50)
        }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 12px',
          background: 'var(--c-card-2)',
          border: `1px solid ${open ? accentColor : 'var(--c-border-med)'}`,
          borderRadius: '10px',
          color: 'var(--c-text-1)',
          fontSize: '13px',
          fontWeight: '600',
          cursor: 'pointer',
          fontFamily: 'Inter, sans-serif',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: open ? `0 0 16px ${accentColor}30` : 'none',
        }}
        onMouseEnter={(e) => {
          if (!open) e.currentTarget.style.borderColor = accentColor
        }}
        onMouseLeave={(e) => {
          if (!open) e.currentTarget.style.borderColor = 'var(--c-border-med)'
        }}
      >
        <span style={{ fontSize: '15px' }}>{meta.icon}</span>
        <span>{language}</span>
        <span
          style={{
            fontSize: '10px',
            color: 'var(--c-text-4)',
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease',
          }}
        >
          ▼
        </span>
      </button>

      {/* Dropdown Modal */}
      {open && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            right: 0,
            width: '260px',
            background: 'var(--c-surface)',
            border: `1px solid var(--c-border-med)`,
            borderRadius: '14px',
            boxShadow: '0 20px 48px rgba(0,0,0,0.5)',
            zIndex: 1000,
            overflow: 'hidden',
            animation: 'slide-in 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
        >
          {/* Search Bar */}
          <div style={{ padding: '10px', borderBottom: '1px solid var(--c-border)' }}>
            <div style={{ position: 'relative' }}>
              <span
                style={{
                  position: 'absolute',
                  left: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  fontSize: '12px',
                  color: 'var(--c-text-5)',
                }}
              >
                🔍
              </span>
              <input
                ref={searchInputRef}
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setFocusedIndex(0)
                }}
                placeholder="Search language..."
                style={{
                  width: '100%',
                  padding: '7px 10px 7px 30px',
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
          </div>

          {/* Languages List with Wheel & Trackpad scroll support */}
          <div
            style={{
              maxHeight: '260px',
              overflowY: 'auto',
              padding: '6px',
            }}
          >
            {/* Favorites Section if no search query */}
            {!search && favorites.length > 0 && (
              <div style={{ marginBottom: '8px' }}>
                <div
                  style={{
                    fontSize: '9px',
                    fontWeight: '700',
                    color: 'var(--c-text-5)',
                    letterSpacing: '1px',
                    textTransform: 'uppercase',
                    padding: '4px 8px',
                  }}
                >
                  Favorites
                </div>
                {favorites.map((fav) => {
                  const favMeta = LANGUAGE_METADATA[fav]
                  return (
                    <button
                      key={`fav-${fav}`}
                      onClick={() => selectLanguage(fav)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        width: '100%',
                        padding: '6px 8px',
                        background: fav === language ? `${accentColor}18` : 'none',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        color: fav === language ? accentColor : 'var(--c-text-2)',
                        fontSize: '12.5px',
                        fontWeight: fav === language ? '600' : '400',
                        fontFamily: 'Inter, sans-serif',
                        textAlign: 'left',
                        transition: 'background 0.15s',
                      }}
                      onMouseEnter={(e) => {
                        if (fav !== language) e.currentTarget.style.background = 'var(--c-card-2)'
                      }}
                      onMouseLeave={(e) => {
                        if (fav !== language) e.currentTarget.style.background = 'none'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span>{favMeta?.icon || '💻'}</span>
                        <span>{fav}</span>
                      </div>
                      <span
                        onClick={(e) => toggleFavorite(fav, e)}
                        style={{ fontSize: '11px', color: '#f59e0b', padding: '2px' }}
                      >
                        ★
                      </span>
                    </button>
                  )
                })}
                <div style={{ height: '1px', background: 'var(--c-border)', margin: '6px 0' }} />
              </div>
            )}

            {/* All / Filtered Languages */}
            {filtered.map((lang, i) => {
              const langMeta = LANGUAGE_METADATA[lang]
              const isFav = favorites.includes(lang)
              const isSelected = lang === language
              const isFocused = i === focusedIndex

              return (
                <button
                  key={lang}
                  onClick={() => selectLanguage(lang)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    padding: '7px 10px',
                    background: isSelected
                      ? `${accentColor}20`
                      : isFocused
                      ? 'var(--c-card-2)'
                      : 'none',
                    border: isSelected ? `1px solid ${accentColor}40` : '1px solid transparent',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    color: isSelected ? accentColor : 'var(--c-text-2)',
                    fontSize: '13px',
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: isSelected ? '600' : '400',
                    textAlign: 'left',
                    transition: 'all 0.15s',
                    marginBottom: '2px',
                  }}
                  onMouseEnter={(e) => {
                    setFocusedIndex(i)
                    if (!isSelected) e.currentTarget.style.background = 'var(--c-card-2)'
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) e.currentTarget.style.background = 'none'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>{langMeta?.icon || '💻'}</span>
                    <span>{lang}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span
                      onClick={(e) => toggleFavorite(lang, e)}
                      title={isFav ? 'Remove Favorite' : 'Add Favorite'}
                      style={{
                        fontSize: '11px',
                        color: isFav ? '#f59e0b' : 'var(--c-text-5)',
                        cursor: 'pointer',
                        padding: '2px',
                        transition: 'color 0.15s',
                      }}
                    >
                      {isFav ? '★' : '☆'}
                    </span>
                    {isSelected && <span style={{ fontSize: '11px', color: accentColor }}>✓</span>}
                  </div>
                </button>
              )
            })}

            {filtered.length === 0 && (
              <div
                style={{
                  padding: '16px',
                  textAlign: 'center',
                  color: 'var(--c-text-5)',
                  fontSize: '12px',
                }}
              >
                No languages found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
