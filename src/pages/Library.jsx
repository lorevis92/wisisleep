import { T } from '../utils/constants'
import TrackCard from '../components/TrackCard'

export default function Library({ library, onPlay, currentTrack, onSave, isInLibrary, onClear }) {
  if (library.length === 0) {
    return (
      <div style={{ padding: '60px 20px', textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>📚</div>
        <p style={{
          fontFamily: 'Syne, sans-serif', fontSize: 14,
          color: T.textMuted, fontWeight: 600,
        }}>
          Your library is empty.<br />Save tracks from Discover to find them here.
        </p>
      </div>
    )
  }

  const grouped = library.reduce((acc, track) => {
    const key = track.type
    if (!acc[key]) acc[key] = []
    acc[key].push(track)
    return acc
  }, {})

  const TYPE_LABELS = { sounds: '🌿 Nature Sounds', music: '🎵 Sleep Music', podcast: '🎙️ Podcasts', audiobook: '📚 Audiobooks' }

  return (
    <div style={{ padding: '24px 20px', maxWidth: 800, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 22, color: T.text, marginBottom: 4 }}>
            Library
          </h1>
          <p style={{ fontSize: 13, color: T.textSecondary }}>
            {library.length} saved item{library.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={onClear}
          style={{
            fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 10,
            textTransform: 'uppercase', letterSpacing: '0.05em',
            color: T.textMuted, border: `1px solid ${T.border}`,
            borderRadius: 3, padding: '6px 12px', background: T.surface,
          }}
        >
          Clear all
        </button>
      </div>

      {Object.entries(grouped).map(([type, tracks]) => (
        <div key={type} style={{ marginBottom: 28 }}>
          <div style={{
            borderTop: `1px solid ${T.border}`,
            paddingTop: 12, marginBottom: 12,
            fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 11,
            color: T.textSecondary, textTransform: 'uppercase', letterSpacing: '0.06em',
          }}>
            {TYPE_LABELS[type] || type}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {tracks.map(track => (
              <TrackCard
                key={track.id}
                track={track}
                onPlay={onPlay}
                onSave={onSave}
                isSaved={isInLibrary(track.id)}
                isActive={currentTrack?.id === track.id}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
