import { T, TIMER_OPTIONS } from '../utils/constants'
import { formatDuration } from '../utils/api'

const TYPE_ICONS = { sounds: '🌿', music: '🎵', podcast: '🎙️', audiobook: '📚' }
const TYPE_LABELS = { sounds: 'Nature Sound', music: 'Sleep Music', podcast: 'Podcast', audiobook: 'Audiobook' }

export default function Player({
  currentTrack, isPlaying, progress, duration,
  volume, sleepTimer, timeLeft, isFading,
  onTogglePlay, onSeek, onVolume, onStartTimer, onCancelTimer, onPlay, onChapterPlay,
}) {
  const progressPct = duration > 0 ? (progress / duration) * 100 : 0
  const timerPct = sleepTimer > 0 ? (timeLeft / (sleepTimer * 60)) * 100 : 0

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

  const timeLeftMin = Math.floor(timeLeft / 60)
  const timeLeftSec = timeLeft % 60

  return (
    <div style={{ padding: '32px 20px', maxWidth: 560, margin: '0 auto' }}>
      {/* Cover */}
      <div style={{
        width: '100%', aspectRatio: '1',
        maxWidth: 280, margin: '0 auto 32px',
        borderRadius: 6, overflow: 'hidden',
        background: T.primaryLight, border: `1px solid ${T.primaryBorder}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 80,
      }}>
        {currentTrack.coverUrl
          ? <img src={currentTrack.coverUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : TYPE_ICONS[currentTrack.type]
        }
      </div>

      {/* Track info */}
      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <div style={{
          fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 10,
          color: T.textMuted, textTransform: 'uppercase', letterSpacing: '0.08em',
          marginBottom: 8,
        }}>
          {TYPE_LABELS[currentTrack.type]}
        </div>
        <h2 style={{
          fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 20,
          color: T.text, marginBottom: 6, lineHeight: 1.3,
        }}>
          {currentTrack.title}
        </h2>
        {currentTrack.author && (
          <p style={{ fontSize: 13, color: T.textSecondary }}>{currentTrack.author}</p>
        )}
      </div>

      {/* Progress bar */}
      <div
        style={{
          height: 4, background: T.surfaceAlt, borderRadius: 2,
          marginBottom: 8, cursor: 'pointer', position: 'relative',
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
        marginBottom: 28,
      }}>
        <span>{formatDuration(Math.floor(progress))}</span>
        <span>{formatDuration(Math.floor(duration))}</span>
      </div>

      {/* Play/Pause */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 28 }}>
        <button
          onClick={onTogglePlay}
          style={{
            width: 64, height: 64, borderRadius: '50%',
            background: T.primary, color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 24, border: 'none',
            boxShadow: `0 4px 16px ${T.primaryBorder}`,
          }}
        >
          {isPlaying ? '⏸' : '▶'}
        </button>
      </div>

      {/* Volume */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        marginBottom: 32,
      }}>
        <span style={{ fontSize: 14 }}>🔈</span>
        <input
          type="range" min={0} max={1} step={0.05} value={volume}
          onChange={e => onVolume(parseFloat(e.target.value))}
          style={{ flex: 1, accentColor: T.primary }}
        />
        <span style={{ fontSize: 14 }}>🔊</span>
      </div>

      {/* Sleep Timer section */}
      <div style={{
        border: `1px solid ${T.border}`, borderRadius: 6,
        padding: 20, background: T.surface,
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: sleepTimer > 0 ? 16 : 0,
        }}>
          <span style={{
            fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 11,
            color: T.textSecondary, textTransform: 'uppercase', letterSpacing: '0.06em',
          }}>
            🌙 Sleep Timer
          </span>
          {sleepTimer > 0 && (
            <button
              onClick={onCancelTimer}
              style={{
                fontFamily: 'Syne, sans-serif', fontSize: 10, fontWeight: 700,
                color: T.textMuted, textTransform: 'uppercase',
                border: `1px solid ${T.border}`, borderRadius: 3,
                padding: '3px 8px', background: T.bg,
              }}
            >
              Cancel
            </button>
          )}
        </div>

        {sleepTimer > 0 ? (
          <div>
            {/* Timer display */}
            <div style={{ textAlign: 'center', marginBottom: 12 }}>
              <span style={{
                fontFamily: 'DM Mono, monospace', fontSize: 36, fontWeight: 500,
                color: isFading ? T.yellow : T.primary,
              }}>
                {String(timeLeftMin).padStart(2, '0')}:{String(timeLeftSec).padStart(2, '0')}
              </span>
              {isFading && (
                <div style={{
                  fontFamily: 'Syne, sans-serif', fontSize: 11, fontWeight: 700,
                  color: T.yellow, marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.06em',
                }}>
                  Fading out...
                </div>
              )}
            </div>
            {/* Timer progress */}
            <div style={{ height: 4, background: T.surfaceAlt, borderRadius: 2 }}>
              <div style={{
                height: '100%', borderRadius: 2,
                width: `${timerPct}%`,
                background: isFading ? T.yellow : T.primary,
                transition: 'width 1s linear',
              }} />
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 12 }}>
            {TIMER_OPTIONS.filter(t => t.value > 0).map(t => (
              <button
                key={t.value}
                onClick={() => onStartTimer(t.value)}
                style={{
                  fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 11,
                  letterSpacing: '0.04em', textTransform: 'uppercase',
                  padding: '7px 12px', borderRadius: 3,
                  border: `1px solid ${T.border}`,
                  background: T.bg, color: T.textSecondary,
                  transition: 'all 0.12s',
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Chapters */}
      {currentTrack.type === 'audiobook' && currentTrack.allChapters?.length > 0 && (
        <div style={{ marginTop: 24 }}>
          <div style={{
            fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 11,
            color: T.textSecondary, textTransform: 'uppercase', letterSpacing: '0.06em',
            marginBottom: 12,
          }}>
            Chapters
          </div>
          <div style={{ display: 'flex', overflowX: 'auto', gap: 8, paddingBottom: 8 }}>
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
                    coverUrl: null,
                    tags: [],
                    description: currentTrack.description || '',
                    allChapters: currentTrack.allChapters,
                  })}
                  style={{
                    borderRadius: 4,
                    border: `1px solid ${isActive ? T.primary : T.border}`,
                    padding: '10px 12px',
                    minWidth: 120,
                    cursor: 'pointer',
                    background: isActive ? T.primaryLight : '#fff',
                    flexShrink: 0,
                  }}
                >
                  <div style={{
                    fontFamily: 'DM Mono, monospace', fontSize: 10,
                    color: T.textMuted, marginBottom: 4,
                  }}>
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <div style={{
                    fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 11,
                    color: T.text,
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                    maxWidth: 100,
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
