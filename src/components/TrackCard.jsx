import { T } from '../utils/constants'
import { formatDuration } from '../utils/api'

const TYPE_ICONS = {
  sounds: '🌿',
  music: '🎵',
  podcast: '🎙️',
  audiobook: '📚',
}

const TYPE_LABELS = {
  sounds: 'Nature',
  music: 'Music',
  podcast: 'Podcast',
  audiobook: 'Audiobook',
}

export default function TrackCard({ track, onPlay, onSave, isSaved, isActive, isLoading }) {
  console.log('TrackCard coverUrl:', track.id, track.coverUrl)
  return (
    <div style={{
      background: T.bg,
      border: `1px solid ${isActive ? T.primary : T.border}`,
      borderRadius: 6,
      padding: 16,
      display: 'flex',
      gap: 12,
      alignItems: 'flex-start',
      transition: 'border-color 0.15s',
      cursor: isLoading ? 'wait' : 'pointer',
      opacity: isLoading ? 0.7 : 1,
    }}
      onClick={() => !isLoading && onPlay(track)}
    >
      {/* Cover / Icon */}
      <div style={{
        width: 52, height: 52, flexShrink: 0,
        borderRadius: 4, overflow: 'hidden',
        background: isActive ? T.primaryLight : T.surfaceAlt,
        border: `1px solid ${isActive ? T.primaryBorder : T.border}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 22,
      }}>
        {track.coverUrl
          ? <img src={track.coverUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : TYPE_ICONS[track.type]
        }
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: 'Syne, sans-serif', fontWeight: 700,
          fontSize: 13, color: T.text,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>
          {track.title}
        </div>
        {track.author && (
          <div style={{ fontSize: 11, color: T.textSecondary, marginTop: 2 }}>
            {track.author}
          </div>
        )}
        {track.description && (
          <div style={{
            fontSize: 11, color: T.textMuted, marginTop: 4,
            display: '-webkit-box', WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}>
            {track.description}
          </div>
        )}

        {/* Tags */}
        {track.tags?.length > 0 && (
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 6 }}>
            {track.tags.slice(0, 3).map(tag => (
              <span key={tag} style={{
                fontSize: 10, fontFamily: 'Syne, sans-serif', fontWeight: 700,
                color: T.textMuted, background: T.surfaceAlt,
                border: `1px solid ${T.border}`, borderRadius: 3,
                padding: '2px 6px', textTransform: 'uppercase', letterSpacing: '0.04em',
              }}>
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Right: type badge + duration + save */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8, flexShrink: 0 }}>
        <span style={{
          fontSize: 10, fontFamily: 'Syne, sans-serif', fontWeight: 700,
          color: isActive ? T.primary : T.textMuted,
          background: isActive ? T.primaryLight : T.surfaceAlt,
          border: `1px solid ${isActive ? T.primaryBorder : T.border}`,
          borderRadius: 3, padding: '2px 6px',
          textTransform: 'uppercase', letterSpacing: '0.04em',
        }}>
          {isLoading ? '...' : TYPE_LABELS[track.type]}
        </span>

        {(track.totalDuration > 0 || track.duration > 0) && (
          <span style={{
            fontFamily: 'DM Mono, monospace', fontSize: 11, color: T.textMuted,
          }}>
            {formatDuration(track.totalDuration > 0 ? track.totalDuration : track.duration)}
          </span>
        )}

        <button
          onClick={e => { e.stopPropagation(); onSave(track) }}
          title={isSaved ? 'Remove from library' : 'Save to library'}
          style={{
            fontSize: 16, padding: 2,
            color: isSaved ? T.primary : T.textMuted,
            transition: 'color 0.15s',
          }}
        >
          {isSaved ? '♥' : '♡'}
        </button>
      </div>
    </div>
  )
}
