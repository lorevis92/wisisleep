import { useState } from 'react'
import { T } from '../utils/constants'

const tabs = [
  { id: 'discover', label: 'DISCOVER' },
  { id: 'player', label: 'PLAYER' },
  { id: 'library', label: 'LIBRARY' },
]

const MENU_ITEMS = [
  { id: 'goodnight', label: 'Goodnight Mode', icon: '🌙' },
  { id: 'nature-sounds', label: 'Nature Sounds', icon: '🌿' },
  { id: 'sleep-music', label: 'Sleep Music', icon: '🎵' },
  { id: 'audiobooks', label: 'Audiobooks', icon: '📚' },
  { id: 'podcasts', label: 'Podcasts', icon: '🎙️' },
]

export default function Navbar({ activeTab, onTabChange, onGoodnightMode }) {
  const [menuOpen, setMenuOpen] = useState(false)

  const handleMenuItemClick = (item) => {
    setMenuOpen(false)
    if (item.id === 'goodnight') {
      onGoodnightMode?.()
      return
    }
    onTabChange('discover')
    setTimeout(() => {
      document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 120)
  }

  return (
    <>
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: T.bg, borderBottom: `1px solid ${T.border}`,
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12,
          padding: '0 20px', height: 56,
        }}>
          {/* Hamburger */}
          <button
            onClick={() => setMenuOpen(true)}
            style={{
              border: `1px solid ${T.border}`, borderRadius: 3,
              padding: '7px 10px', background: T.bg,
              display: 'flex', flexDirection: 'column', gap: 4, cursor: 'pointer',
            }}
          >
            {[0, 1, 2].map(i => (
              <span key={i} style={{ display: 'block', width: 16, height: 1.5, background: T.text }} />
            ))}
          </button>

          {/* Logo */}
          <div
            onClick={() => onTabChange('discover')}
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

      {/* Overlay */}
      <div
        onClick={() => setMenuOpen(false)}
        style={{
          position: 'fixed', inset: 0, zIndex: 200,
          background: 'rgba(0,0,0,0.4)',
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? 'all' : 'none',
          transition: 'opacity 0.25s ease',
        }}
      />

      {/* Sidebar */}
      <div style={{
        position: 'fixed', top: 0, left: 0, bottom: 0,
        width: 280, zIndex: 201,
        background: '#fff',
        transform: menuOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.25s ease',
        padding: 24,
        boxShadow: '4px 0 24px rgba(0,0,0,0.10)',
        display: 'flex', flexDirection: 'column',
      }}>
        {/* Close */}
        <button
          onClick={() => setMenuOpen(false)}
          style={{
            alignSelf: 'flex-end', marginBottom: 8,
            fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 18,
            color: T.textSecondary, background: 'none', border: 'none',
            cursor: 'pointer', lineHeight: 1,
          }}
        >
          ✕
        </button>

        {/* Menu items */}
        {MENU_ITEMS.map((item, i) => (
          <button
            key={item.id}
            onClick={() => handleMenuItemClick(item)}
            style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '16px 0',
              borderTop: 'none', borderLeft: 'none', borderRight: 'none',
              borderBottom: i < MENU_ITEMS.length - 1 ? `1px solid ${T.border}` : 'none',
              fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 14,
              color: item.id === 'goodnight' ? T.primary : T.text,
              background: 'none',
              cursor: 'pointer', width: '100%', textAlign: 'left',
            }}
          >
            <span style={{ fontSize: 20 }}>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </div>
    </>
  )
}
