import { T } from '../utils/constants'

export default function Footer() {
  return (
    <footer style={{
      borderTop: `1px solid ${T.border}`,
      background: T.surface,
      padding: '20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: 12,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <img src="/logo-wisiverse.png" alt="WiSiVERSE" style={{ height: 32, width: 'auto' }} />
        <span style={{
          fontFamily: 'Syne, sans-serif', fontSize: 11,
          color: T.textSecondary, fontWeight: 400,
        }}>
          Part of the WiSiVERSE ecosystem
        </span>
      </div>
      <a
        href="https://wisiverse.com"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          fontFamily: 'Syne, sans-serif', fontSize: 11,
          fontWeight: 700, color: T.primary,
          textTransform: 'uppercase', letterSpacing: '0.05em',
        }}
      >
        wisiverse.com →
      </a>
    </footer>
  )
}
