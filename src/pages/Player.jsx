import { useState, useEffect } from 'react'
import { T, TIMER_OPTIONS } from '../utils/constants'
import { formatDuration } from '../utils/api'

const TYPE_ICONS = { sounds: '🌿', music: '🎵', podcast: '🎙️', audiobook: '📚' }
const TYPE_LABELS = { sounds: 'Nature Sound', music: 'Sleep Music', podcast: 'Podcast', audiobook: 'Audiobook' }

export default function Player({
  currentTrack, isPlaying, progress, duration,
  volume, sleepTimer, timeLeft, isFading,
  onTogglePlay, onSeek, onVolume, onStartTimer, onCancelTimer, onPlay, onChapterPlay, onRestartBook, onBack,
}) {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= 640)
  const [customMinutes, setCustomMinutes] = useState(30)

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth <= 640)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])

  if (!currentTrack) {
    return (
      <div style={{ padding: '60px 20px', textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🌙</div>
        <p style={{ fontFamily: 'Syne, sans-serif', fontSize: 14, color: T.textMuted, fontWeight: 600 }}>
          Nothing playing yet.<br />Go to Discover to find something.
        </p>
      </div>
    )
  }

  const coverSize = isMobile ? 60 : 80
  const progressPct = duration > 0 ? (progress / duration) * 100 : 0
  const timeLeftMin = Math.floor(timeLeft / 60)
  const timeLeftSec = timeLeft % 60
  const isSound = currentTrack.type === 'sounds'
  const isAudiobook = currentTrack.type === 'audiobook'
  const allChapters = currentTrack.allChapters
  const currentChapterIdx = allChapters?.findIndex(ch => ch.id === currentTrack.id) ?? -1
  const hasPrev = isAudiobook && allChapters && currentChapterIdx > 0
  const hasNext = isAudiobook && allChapters && currentChapterIdx < allChapters.length - 1

  const playChapter = (idx) => {
    onChapterPlay({ ...allChapters[idx], allChapters })
  }

  return (
    <div style={{ maxWidth: 560, margin: '0 auto', paddingTop: 8 }}>
      <button
        onClick={onBack}
        style={{
          fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 11,
          textTransform: 'uppercase', letterSpacing: '0.04em',
          color: '#666666', background: 'transparent', border: 'none',
          cursor: 'pointer', padding: '0 0 16px 20px',
        }}
      >
        ← Back
      </button>

      {/* 1. TOP ROW */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '20px 20px 12px' }}>
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
            fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 10,
            color: '#AAAAAA', textTransform: 'uppercase', letterSpacing: '0.08em',
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
          {!isSound && (
            <>
              <div
                style={{
                  height: 3, background: '#F0F0F0', borderRadius: 2,
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
                fontFamily: 'DM Mono, monospace', fontSize: 11, color: '#AAAAAA',
                marginTop: 4,
              }}>
                <span>{formatDuration(Math.floor(progress))}</span>
                <span>{formatDuration(Math.floor(duration))}</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* 2. CONTROLS ROW */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        gap: 20, padding: '4px 20px 12px',
      }}>
        {isAudiobook && allChapters && (
          <button
            onClick={() => hasPrev && playChapter(currentChapterIdx - 1)}
            style={{
              fontSize: 22, color: hasPrev ? '#666666' : '#CCCCCC',
              background: 'none', border: 'none',
              cursor: hasPrev ? 'pointer' : 'default', padding: 0, lineHeight: 1,
            }}
          >
            ⏮
          </button>
        )}

        <button
          onClick={onTogglePlay}
          style={{
            width: 52, height: 52, borderRadius: '50%',
            background: '#E8352A', color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 20, border: 'none', cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(232,53,42,0.3)', flexShrink: 0,
          }}
        >
          {isPlaying ? '⏸' : '▶'}
        </button>

        {isAudiobook && allChapters && (
          <button
            onClick={() => hasNext && playChapter(currentChapterIdx + 1)}
            style={{
              fontSize: 22, color: hasNext ? '#666666' : '#CCCCCC',
              background: 'none', border: 'none',
              cursor: hasNext ? 'pointer' : 'default', padding: 0, lineHeight: 1,
            }}
          >
            ⏭
          </button>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginLeft: 'auto' }}>
          <span style={{ fontSize: 12 }}>🔈</span>
          <input
            type="range" min={0} max={1} step={0.05} value={volume}
            onChange={e => onVolume(parseFloat(e.target.value))}
            style={{ width: 80, accentColor: '#E8352A' }}
          />
          <span style={{ fontSize: 12 }}>🔊</span>
        </div>
      </div>

      {/* 3. SLEEP TIMER ROW */}
      <div style={{ padding: '0 20px 12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <span style={{
            fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 11,
            color: '#666666', textTransform: 'uppercase', letterSpacing: '0.06em',
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
                  padding: '3px 8px', background: T.bg, cursor: 'pointer', marginLeft: 'auto',
                }}
              >
                Cancel
              </button>
            </>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
              {[15, 30, 45, 60, 90].map(m => (
                <button
                  key={m}
                  onClick={() => onStartTimer(m)}
                  style={{
                    fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 10,
                    letterSpacing: '0.04em', textTransform: 'uppercase',
                    padding: '3px 8px', borderRadius: 3,
                    border: `1px solid ${T.border}`,
                    background: T.bg, color: T.textSecondary, cursor: 'pointer',
                  }}
                >
                  {m}m
                </button>
              ))}
              <input
                type="range" min={1} max={120} step={1} value={customMinutes}
                onChange={e => setCustomMinutes(Number(e.target.value))}
                onMouseUp={() => onStartTimer(customMinutes)}
                onTouchEnd={() => onStartTimer(customMinutes)}
                style={{ width: 80, accentColor: '#E8352A' }}
              />
              <span style={{
                fontFamily: 'DM Mono, monospace', fontSize: 11,
                color: T.textMuted, flexShrink: 0,
              }}>
                ──{customMinutes}m
              </span>
            </div>
          )}
        </div>
      </div>

      {/* 4. CHAPTERS ROW */}
      {isAudiobook && allChapters?.length > 0 && (
        <div style={{ padding: '0 20px 12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <span style={{
              fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 11,
              color: '#666666', textTransform: 'uppercase', letterSpacing: '0.06em',
            }}>
              Chapters
            </span>
            <button
              onClick={() => onRestartBook?.(allChapters)}
              style={{
                fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 10,
                textTransform: 'uppercase', letterSpacing: '0.04em',
                color: '#AAAAAA', border: '1px solid #E8E8E8', borderRadius: 3,
                padding: '3px 8px', background: 'transparent', cursor: 'pointer',
              }}
            >
              ↺ Restart
            </button>
          </div>
          <div style={{ display: 'flex', overflowX: 'auto', gap: 6, paddingBottom: 4 }}>
            {allChapters.map((ch, i) => {
              const isActive = currentTrack.id === ch.id
              const chapterName = ch.title.includes(' — ')
                ? ch.title.split(' — ').slice(-1)[0]
                : ch.title
              return (
                <div
                  key={ch.id || i}
                  onClick={() => playChapter(i)}
                  style={{
                    borderRadius: 3,
                    border: `1px solid ${isActive ? T.primary : '#E8E8E8'}`,
                    padding: '5px 8px',
                    minWidth: 70, maxWidth: 100,
                    cursor: 'pointer',
                    background: isActive ? T.primaryLight : '#fff',
                    flexShrink: 0,
                  }}
                >
                  <div style={{
                    fontFamily: 'DM Mono, monospace', fontSize: 9,
                    color: '#AAAAAA', marginBottom: 2,
                  }}>
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <div style={{
                    fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 10,
                    color: isActive ? T.primary : T.text,
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                  }}>
                    {chapterName}
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
