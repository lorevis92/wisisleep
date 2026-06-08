import { useState } from 'react'
import { T } from '../utils/constants'

const tabs = [
  { id: 'discover', label: 'DISCOVER' },
  { id: 'player', label: 'PLAYER' },
  { id: 'library', label: 'LIBRARY' },
]

export default function Navbar({ activeTab, onTabChange }) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: T.bg, borderBottom: `1px solid ${T.border}`,
    }}>
      {/* Main row */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '0 20px', height: 56,
      }}>
        {/* Hamburger */}
        <button
          onClick={() => setMenuOpen(o => !o)}
          style={{
            border: `1px solid ${T.border}`, borderRadius: 3,
            padding: '7px 10px', background: T.bg,
            display: 'flex', flexDirection: 'column', gap: 4,
          }}
        >
          {[0,1,2].map(i => (
            <span key={i} style={{ display: 'block', width: 16, height: 1.5, background: T.text }} />
          ))}
        </button>

        {/* Logo + Name */}
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
                transition: 'all 0.15s',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile tabs row */}
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
