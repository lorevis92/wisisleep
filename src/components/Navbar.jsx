import { useState, useRef, useEffect } from 'react'
import { T } from '../utils/constants'

const tabs = [
  { id: 'discover', label: 'DISCOVER' },
  { id: 'player', label: 'PLAYER' },
  { id: 'library', label: 'LIBRARY' },
]

const MENU_ITEMS = [
  { id: 'nature', label: 'Nature Sounds', icon: '🌿' },
  { id: 'sleep-music', label: 'Sleep Music', icon: '🎵' },
  { id: 'audiobooks', label: 'Audiobooks', icon: '📚' },
  { id: 'podcasts', label: 'Podcasts', icon: '🎙️' },
  { type: 'divider' },
  { id: 'goodnight', label: 'Goodnight Mode', icon: '🌙' },
]

export default function Navbar({ activeTab, onTabChange, onGoodnightMode, onNavigate, onHome }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    if (!menuOpen) return
    const handler = (e) => {
      if (!dropdownRef.current?.contains(e.target)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [menuOpen])

  const handleItem = (item) => {
    setMenuOpen(false)
    if (item.id === 'goodnight') {
      onGoodnightMode?.()
    } else {
      onNavigate?.(item.id)
    }
  }

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: T.bg, borderBottom: `1px solid ${T.border}`,
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '0 20px', height: 56,
      }}>
        {/* Hamburger + dropdown */}
        <div ref={dropdownRef} style={{ position: 'relative' }}>
          <button
            onClick={() => setMenuOpen(o => !o)}
            style={{
              border: `1px solid ${menuOpen ? T.primary : T.border}`, borderRadius: 3,
              padding: '7px 10px', background: T.bg,
              display: 'flex', flexDirection: 'column', gap: 4, cursor: 'pointer',
              transition: 'border-color 0.15s',
            }}
          >
            {[0, 1, 2].map(i => (
              <span key={i} style={{ display: 'block', width: 16, height: 1.5, background: T.text }} />
            ))}
          </button>

          {menuOpen && (
            <div style={{
              position: 'absolute', top: 'calc(100% + 6px)', left: 0, zIndex: 200,
              background: '#fff',
              border: `1px solid ${T.border}`,
              borderRadius: 6,
              boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
              width: 220,
              padding: '8px 0',
            }}>
              {MENU_ITEMS.map((item, i) =>
                item.type === 'divider'
                  ? <div key={i} style={{ height: 1, background: T.border, margin: '4px 0' }} />
                  : (
                    <button
                      key={item.id}
                      onClick={() => handleItem(item)}
                      onMouseEnter={e => { e.currentTarget.style.background = '#F8F8F8' }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'none' }}
                      style={{
                        width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                        padding: '12px 16px', fontSize: 13,
                        fontFamily: 'Syne, sans-serif', fontWeight: 700,
                        color: item.id === 'goodnight' ? T.primary : T.text,
                        background: 'none', border: 'none', cursor: 'pointer',
                        textAlign: 'left',
                      }}
                    >
                      <span style={{ fontSize: 16 }}>{item.icon}</span>
                      {item.label}
                    </button>
                  )
              )}
            </div>
          )}
        </div>

        {/* Logo */}
        <div
          onClick={() => onHome?.()}
          style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, cursor: 'pointer' }}
        >
          <img
            src="/logo-wisi.png"
            alt="WisiSleep"
            style={{ height: 28, width: 'auto' }}
            onError={e => { e.currentTarget.style.display = 'none' }}
          />
          <span style={{
            fontFamily: 'Syne, sans-serif', fontWeight: 800,
            fontSize: 15, color: T.primary, textTransform: 'uppercase', letterSpacing: '0.05em',
          }}>
            SLEEP
          </span>
        </div>

        {/* Tabs — desktop */}
        <div style={{ display: 'flex', gap: 4 }} className="desktop-tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              style={{
                fontFamily: 'Syne, sans-serif', fontWeight: 700,
                fontSize: 11, letterSpacing: '0.06em',
                padding: '6px 14px', borderRadius: 3,
                border: `1px solid ${activeTab === tab.id ? T.primary : T.border}`,
                background: activeTab === tab.id ? T.primary : T.surface,
                color: activeTab === tab.id ? '#fff' : T.textSecondary,
                transition: 'all 0.15s', cursor: 'pointer',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile tabs */}
      <div style={{
        display: 'none',
        borderTop: `1px solid ${T.border}`,
        padding: '8px 12px',
        gap: 4,
      }} className="mobile-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            style={{
              flex: 1, fontFamily: 'Syne, sans-serif', fontWeight: 700,
              fontSize: 11, letterSpacing: '0.06em',
              padding: '8px 4px', borderRadius: 3,
              border: `1px solid ${activeTab === tab.id ? T.primary : T.border}`,
              background: activeTab === tab.id ? T.primary : T.surface,
              color: activeTab === tab.id ? '#fff' : T.textSecondary,
              cursor: 'pointer',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <style>{`
        @media (max-width: 640px) {
          .desktop-tabs { display: none !important; }
          .mobile-tabs { display: flex !important; }
        }
      `}</style>
    </nav>
  )
}
