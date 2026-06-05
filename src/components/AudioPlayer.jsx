import { T, TIMER_OPTIONS } from '../utils/constants'
import { formatDuration } from '../utils/api'

export default function AudioPlayer({
  currentTrack, isPlaying, progress, duration,
  volume, sleepTimer, timeLeft, isFading,
  onTogglePlay, onSeek, onVolume, onStartTimer, onCancelTimer,
  onTabChange,
}) {
  if (!currentTrack) return null

  const progressPct = duration > 0 ? (progress / duration) * 100 : 0
  const timeLeftMin = Math.ceil(timeLeft / 60)

  const TYPE_ICONS = { sounds: '🌿', music: '🎵', podcast: '🎙️', audiobook: '📚' }

  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 200,
      background: T.bg, borderTop: `1px solid ${T.border}`,
      padding: '10px 20px 14px',
      boxShadow: '0 -4px 24px rgba(0,0,0,0.06)',
    }}>
      {/* Progress bar */}
      <div
        style={{
          height: 3, background: T.surfaceAlt, borderRadius: 2,
          marginBottom: 12, cursor: 'pointer', position: 'relative',
        }}
        onClick={e => {
          if (!duration) return
          const rect = e.currentTarget.getBoundingClientRect()
          const pct = (e.clientX - rect.left) / rect.width
          onSeek(pct * duration)
        }}
      >
        <div style={{
          position: 'absolute', left: 0, top: 0, bottom: 0,
          width: `${progressPct}%`,
          background: isFading ? T.yellow : T.primary,
          borderRadius: 2, transition: 'width 0.5s linear',
        }} />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {/* Track info */}
        <div
          style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0, cursor: 'pointer' }}
          onClick={() => onTabChange('player')}
        >
          <div style={{
            width: 36, height: 36, borderRadius: 4, flexShrink: 0,
            background: T.primaryLight, border: `1px solid ${T.primaryBorder}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 16, overflow: 'hidden',
          }}>
            {currentTrack.coverUrl
              ? <img src={currentTrack.coverUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : TYPE_ICONS[currentTrack.type]
            }
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{
              fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 12,
              color: T.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}>
              {currentTrack.title}
            </div>
            {currentTrack.author && (
              <div style={{ fontSize: 11, color: T.textSecondary }}>{currentTrack.author}</div>
            )}
          </div>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* Time */}
          <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, color: T.textMuted }}>
            {formatDuration(Math.floor(progress))}
          </span>

          {/* Play/pause */}
          <button
            onClick={onTogglePlay}
            style={{
              width: 36, height: 36, borderRadius: '50%',
              background: T.primary, color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 14, flexShrink: 0,
            }}
          >
            {isPlaying ? '⏸' : '▶'}
          </button>

          {/* Volume */}
          <input
            type="range" min={0} max={1} step={0.05} value={volume}
            onChange={e => onVolume(parseFloat(e.target.value))}
            style={{ width: 64, accentColor: T.primary }}
            title="Volume"
          />

          {/* Sleep timer */}
          {sleepTimer > 0 ? (
            <button
              onClick={onCancelTimer}
              style={{
                fontFamily: 'DM Mono, monospace', fontSize: 11,
                color: isFading ? T.yellow : T.primary,
                background: isFading ? 'rgba(184,112,0,0.08)' : T.primaryLight,
                border: `1px solid ${isFading ? 'rgba(184,112,0,0.2)' : T.primaryBorder}`,
                borderRadius: 3, padding: '4px 8px',
                whiteSpace: 'nowrap',
              }}
              title="Cancel timer"
            >
              {isFading ? '🌙 fading...' : `🌙 ${timeLeftMin}m`}
            </button>
          ) : (
            <select
              value=""
              onChange={e => { if (e.target.value) onStartTimer(Number(e.target.value)) }}
              style={{
                fontFamily: 'Syne, sans-serif', fontSize: 11, fontWeight: 700,
                border: `1px solid ${T.border}`, borderRadius: 3,
                padding: '4px 6px', background: T.surface, color: T.textSecondary,
                cursor: 'pointer',
              }}
              title="Sleep timer"
            >
              <option value="">🌙 Timer</option>
              {TIMER_OPTIONS.filter(t => t.value > 0).map(t => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          )}
        </div>
      </div>
    </div>
  )
}
