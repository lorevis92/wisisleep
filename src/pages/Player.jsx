import { useState, useEffect } from 'react'
import { T, TIMER_OPTIONS } from '../utils/constants'
import { formatDuration } from '../utils/api'

const TYPE_ICONS = { sounds: '🌿', music: '🎵', podcast: '🎙️', audiobook: '📚' }
const TYPE_LABELS = { sounds: 'Nature Sound', music: 'Sleep Music', podcast: 'Podcast', audiobook: 'Audiobook' }

export default function Player({
  currentTrack, isPlaying, progress, duration,
  volume, sleepTimer, timeLeft, isFading,
  onTogglePlay, onSeek, onVolume, onStartTimer, onCancelTimer, onPlay, onChapterPlay,
}) {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= 640)

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth <= 640)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])

  const progressPct = duration > 0 ? (progress / duration) * 100 : 0
  const timeLeftMin = Math.floor(timeLeft / 60)
  const timeLeftSec = timeLeft % 60

  if (!currentTrack) {
    return (
      <div style={{ padding: '60px 20px', textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🌙</div>
        <p style={{
          fontFamily: 'Syne, sans-serif', fontSize: 14,
          color: T.textMuted, fontWeight: 600,
        }}>
          Nothing playing yet.<br />Go to Discover to find something.
        </p>
      </div>
    )
  }

  const coverSize = isMobile ? 60 : 80

  return (
    <div style={{ maxWidth: 560, margin: '0 auto', paddingTop: 8 }}>

      {/* TOP: Cover + Track Info */}
      <div style={{ display: 'flex', gap: 16, alignItems: 'center', padding: 20 }}>
        <div style={{
          width: coverSize, height: coverSize, borderRadius: 6, flexShrink: 0,
          overflow: 'hidden', background: T.primaryLight, border: `1px solid ${T.primaryBorder}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: isMobile ? 28 : 36,
        }}>
          {currentTrack.coverUrl
            ? <img src={currentTrack.coverUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : TYPE_ICONS[currentTrack.type]
          }
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 9,
            color: T.textMuted, textTransform: 'uppercase', letterSpacing: '0.08em',
            marginBottom: 3,
          }}>
            {TYPE_LABELS[currentTrack.type]}
          </div>
          <div style={{
            fontFamily: 'Syne, sans-serif', fontWeight: 800,
            fontSize: isMobile ? 13 : 15,
            lineHeight: 1.2, color: T.text,
            overflow: 'hidden', display: '-webkit-box',
            WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
            marginBottom: 2,
          }}>
            {currentTrack.title}
          </div>
          {currentTrack.author && (
            <div style={{ fontSize: 12, color: '#666666' }}>
              {currentTrack.author}
            </div>
          )}
          <div
            style={{
              height: 3, background: T.surfaceAlt, borderRadius: 2,
              marginTop: 8, cursor: 'pointer', position: 'relative',
            }}
            onClick={e => {
              if (!duration) return
              const rect = e.currentTarget.getBoundingClientRect()
              onSeek(((e.clientX - rect.left) / rect.width) * duration)
            }}
          >
            <div style={{
              position: 'absolute', left: 0, top: 0, bottom: 0,
              width: `${progressPct}%`,
              background: T.primary, borderRadius: 2,
              transition: 'width 0.5s linear',
            }} />
          </div>
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            fontFamily: 'DM Mono, monospace', fontSize: 11, color: T.textMuted,
            marginTop: 4,
          }}>
            <span>{formatDuration(Math.floor(progress))}</span>
            <span>{formatDuration(Math.floor(duration))}</span>
          </div>
        </div>
      </div>

      {/* CONTROLS */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        gap: 16, padding: '8px 20px',
      }}>
        <button
          onClick={onTogglePlay}
          style={{
            width: 48, height: 48, borderRadius: '50%',
            background: '#E8352A', color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 20, border: 'none', cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(232,53,42,0.3)',
          }}
        >
          {isPlaying ? '⏸' : '▶'}
        </button>
      </div>

      {/* VOLUME */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 20px 12px' }}>
        <span style={{ fontSize: 13 }}>🔈</span>
        <input
          type="range" min={0} max={1} step={0.05} value={volume}
          onChange={e => onVolume(parseFloat(e.target.value))}
          style={{ flex: 1, accentColor: T.primary }}
        />
        <span style={{ fontSize: 13 }}>🔊</span>
      </div>

      {/* SLEEP TIMER */}
      <div style={{ padding: '0 20px 12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <span style={{
            fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 11,
            color: T.textSecondary, textTransform: 'uppercase', letterSpacing: '0.06em',
            flexShrink: 0,
          }}>
            🌙 Sleep Timer
          </span>
          {sleepTimer > 0 ? (
            <>
              <span style={{
                fontFamily: 'DM Mono, monospace', fontSize: 13,
                color: isFading ? T.yellow : T.primary,
              }}>
                {String(timeLeftMin).padStart(2, '0')}:{String(timeLeftSec).padStart(2, '0')}
              </span>
              {isFading && (
                <span style={{
                  fontFamily: 'Syne, sans-serif', fontSize: 9, fontWeight: 700,
                  color: T.yellow, textTransform: 'uppercase', letterSpacing: '0.06em',
                }}>
                  Fading
                </span>
              )}
              <button
                onClick={onCancelTimer}
                style={{
                  fontFamily: 'Syne, sans-serif', fontSize: 10, fontWeight: 700,
                  color: T.textMuted, textTransform: 'uppercase',
                  border: `1px solid ${T.border}`, borderRadius: 3,
                  padding: '4px 8px', background: T.bg, cursor: 'pointer', marginLeft: 'auto',
                }}
              >
                Cancel
              </button>
            </>
          ) : (
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
              {TIMER_OPTIONS.filter(t => t.value > 0).map(t => (
                <button
                  key={t.value}
                  onClick={() => onStartTimer(t.value)}
                  style={{
                    fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 10,
                    letterSpacing: '0.04em', textTransform: 'uppercase',
                    padding: '4px 8px', borderRadius: 3,
                    border: `1px solid ${T.border}`,
                    background: T.bg, color: T.textSecondary, cursor: 'pointer',
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* CHAPTERS */}
      {currentTrack.type === 'audiobook' && currentTrack.allChapters?.length > 0 && (
        <div style={{ padding: '0 20px' }}>
          <div style={{
            fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 11,
            color: '#666666', textTransform: 'uppercase', letterSpacing: '0.06em',
            marginBottom: 8,
          }}>
            Chapters
          </div>
          <div style={{ display: 'flex', overflowX: 'auto', gap: 6, paddingBottom: 12 }}>
            {currentTrack.allChapters.map((ch, i) => {
              const baseId = currentTrack.id.replace(/-ch\d+$/, '')
              const chId = baseId + '-ch' + i
              const isActive = currentTrack.id === chId
              const bookTitle = currentTrack.title.includes(' — ')
                ? currentTrack.title.split(' — ').slice(0, -1).join(' — ')
                : currentTrack.title
              return (
                <div
                  key={ch.id || i}
                  onClick={() => onChapterPlay({
                    id: chId,
                    title: bookTitle + ' — ' + ch.title,
                    author: currentTrack.author,
                    audioUrl: ch.audioUrl,
                    duration: ch.duration,
                    type: 'audiobook',
                    coverUrl: currentTrack.coverUrl,
                    tags: [],
                    description: currentTrack.description || '',
                    allChapters: currentTrack.allChapters,
                  })}
                  style={{
                    borderRadius: 3,
                    border: `1px solid ${isActive ? T.primary : '#E8E8E8'}`,
                    padding: '6px 10px',
                    minWidth: 80, maxWidth: 120,
                    cursor: 'pointer',
                    background: isActive ? T.primaryLight : '#fff',
                    flexShrink: 0,
                  }}
                >
                  <div style={{
                    fontFamily: 'DM Mono, monospace', fontSize: 9,
                    color: T.textMuted, marginBottom: 2,
                  }}>
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <div style={{
                    fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 10,
                    color: isActive ? T.primary : T.text,
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                  }}>
                    {ch.title}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
