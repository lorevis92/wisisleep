import { useState } from 'react'
import { T } from '../utils/constants'
import { getLog } from '../hooks/useSleepTracker'

function formatTime(isoStr) {
  if (!isoStr) return '--:--'
  return new Date(isoStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function formatHours(minutes) {
  if (!minutes) return '0h'
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (m === 0) return `${h}h`
  return `${h}h ${m}m`
}

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export default function SleepStats({ onBack }) {
  const [howOpen, setHowOpen] = useState(false)
  const log = getLog().filter(s => s.valid)

  const today = new Date()
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today)
    d.setDate(d.getDate() - (6 - i))
    return d.toISOString().slice(0, 10)
  })

  const weekData = last7.map(dateStr => {
    const session = log.find(s => s.date === dateStr)
    const d = new Date(dateStr + 'T12:00:00')
    return {
      date: dateStr,
      day: DAY_LABELS[d.getDay()],
      minutes: session?.duration_minutes || 0,
    }
  })

  const maxMinutes = Math.max(...weekData.map(d => d.minutes), 600)
  const weekWithData = weekData.filter(d => d.minutes > 0)
  const avgMinutes = weekWithData.length > 0
    ? Math.round(weekWithData.reduce((s, d) => s + d.minutes, 0) / weekWithData.length)
    : 0

  const lastSession = [...log].sort((a, b) => new Date(b.date) - new Date(a.date))[0]

  return (
    <div style={{ maxWidth: 560, margin: '0 auto', padding: '24px 20px' }}>
      <button
        onClick={onBack}
        style={{
          fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 11,
          textTransform: 'uppercase', letterSpacing: '0.04em',
          color: '#666666', background: 'transparent', border: 'none',
          cursor: 'pointer', padding: '0 0 16px 0', display: 'block',
        }}
      >
        ← Back
      </button>

      <h1 style={{
        fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 22,
        color: T.text, marginBottom: 24,
      }}>
        🌙 Sleep Stats
      </h1>

      {log.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: '48px 20px',
          fontFamily: 'Syne, sans-serif', fontSize: 14,
          fontWeight: 600, color: T.textMuted,
        }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>😴</div>
          Start listening to track your sleep patterns
        </div>
      ) : (
        <>
          {lastSession && (
            <div style={{
              border: `1px solid ${T.border}`, borderRadius: 6,
              padding: 20, background: T.surface, marginBottom: 24,
            }}>
              <div style={{
                fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 11,
                textTransform: 'uppercase', letterSpacing: '0.06em',
                color: T.textSecondary, marginBottom: 12,
              }}>
                Last Night
              </div>
              <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
                {[
                  { label: 'Fell asleep', value: formatTime(lastSession.estimated_sleep) },
                  { label: 'Woke up', value: formatTime(lastSession.estimated_wake) },
                  { label: 'Duration', value: formatHours(lastSession.duration_minutes), highlight: true },
                ].map(({ label, value, highlight }) => (
                  <div key={label}>
                    <div style={{
                      fontFamily: 'Syne, sans-serif', fontSize: 10, color: T.textMuted,
                      textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4,
                    }}>
                      {label}
                    </div>
                    <div style={{
                      fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 20,
                      color: highlight ? T.primary : T.text,
                    }}>
                      {value}
                    </div>
                  </div>
                ))}
              </div>
              {lastSession.track_title && (
                <div style={{
                  marginTop: 12, fontSize: 11, color: T.textMuted,
                  fontFamily: 'Syne, sans-serif',
                }}>
                  🎵 {lastSession.track_title}
                </div>
              )}
            </div>
          )}

          <div style={{ marginBottom: 24 }}>
            <div style={{
              fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 14,
              textTransform: 'uppercase', letterSpacing: '0.04em',
              color: T.text, marginBottom: 16,
            }}>
              This Week
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 120, marginBottom: 8 }}>
              {weekData.map(d => {
                const pct = d.minutes > 0 ? (d.minutes / maxMinutes) * 100 : 0
                return (
                  <div key={d.date} style={{
                    flex: 1, display: 'flex', flexDirection: 'column',
                    alignItems: 'center', gap: 4,
                    height: '100%', justifyContent: 'flex-end',
                  }}>
                    {d.minutes > 0 && (
                      <div style={{
                        fontFamily: 'DM Mono, monospace', fontSize: 9,
                        color: T.textSecondary, marginBottom: 2,
                      }}>
                        {formatHours(d.minutes)}
                      </div>
                    )}
                    <div style={{
                      width: '100%', maxWidth: 32,
                      height: `${Math.max(pct, d.minutes > 0 ? 4 : 0.5)}%`,
                      background: d.minutes > 0 ? T.primary : T.surfaceAlt,
                      borderRadius: '3px 3px 0 0',
                    }} />
                  </div>
                )
              })}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {weekData.map(d => (
                <div key={d.date} style={{
                  flex: 1, textAlign: 'center',
                  fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 10,
                  color: T.textMuted, textTransform: 'uppercase',
                }}>
                  {d.day}
                </div>
              ))}
            </div>
          </div>

          {avgMinutes > 0 && (
            <div style={{
              fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 13,
              color: T.text, marginBottom: 24,
            }}>
              Average this week:{' '}
              <span style={{ color: T.primary }}>{formatHours(avgMinutes)}</span>
            </div>
          )}
        </>
      )}

      <div style={{ borderTop: `1px solid ${T.border}`, paddingTop: 16 }}>
        <button
          onClick={() => setHowOpen(o => !o)}
          style={{
            fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 12,
            color: T.textSecondary, background: 'none', border: 'none',
            cursor: 'pointer', padding: 0,
            display: 'flex', alignItems: 'center', gap: 6,
          }}
        >
          {howOpen ? '▾' : '▸'} How does this work?
        </button>
        {howOpen && (
          <div style={{
            marginTop: 12, fontSize: 12, color: T.textSecondary,
            fontFamily: 'Syne, sans-serif', lineHeight: 1.6,
          }}>
            WisiSleep uses the Page Visibility API to estimate your sleep. When you start playing audio and turn off your screen (or switch apps), the app notes the time. When you turn your screen back on, it calculates how long it was off. If that's more than 1 hour, it counts as a sleep session. It's not perfect — it measures screen-off time, not actual sleep — but it's a reliable estimate when you use WisiSleep as a sleep aid.
          </div>
        )}
      </div>
    </div>
  )
}
