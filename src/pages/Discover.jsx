import { useState, useEffect } from 'react'
import { T } from '../utils/constants'
import { fetchNatureSoundsFromDB, fetchSleepMusic, fetchAudiobooks, fetchPodcasts, fetchPodcastEpisodes } from '../utils/api'

const TYPE_ICONS = { sounds: '🌿', music: '🎵', podcast: '🎙️', audiobook: '📚' }
const TYPE_BG = { sounds: '#E8F5E9', music: '#E3F2FD', podcast: '#FFF3E0', audiobook: '#F3E5F5' }

function SkeletonCard() {
  return (
    <div style={{ width: 140, flexShrink: 0 }}>
      <div style={{ width: 140, height: 140, borderRadius: 6, background: T.surfaceAlt }} />
      <div style={{ height: 11, background: T.surfaceAlt, borderRadius: 3, marginTop: 8, width: '80%' }} />
      <div style={{ height: 10, background: T.surfaceAlt, borderRadius: 3, marginTop: 4, width: '55%' }} />
    </div>
  )
}

function Card({ track, onPlay, isActive, isLoading }) {
  return (
    <div
      onClick={() => !isLoading && onPlay(track)}
      style={{ width: 140, flexShrink: 0, cursor: isLoading ? 'wait' : 'pointer' }}
    >
      <div style={{
        width: 140, height: 140, borderRadius: 6, overflow: 'hidden',
        background: TYPE_BG[track.type] || T.surfaceAlt,
        border: `2px solid ${isActive ? T.primary : 'transparent'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 40, position: 'relative', flexShrink: 0,
      }}>
        {track.coverUrl
          ? <img src={track.coverUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          : <span>{TYPE_ICONS[track.type]}</span>
        }
        {isLoading && (
          <div style={{
            position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
          }}>⏳</div>
        )}
      </div>
      <div style={{
        fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 12, color: T.text,
        marginTop: 6, lineHeight: 1.35,
        display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
      }}>
        {track.title}
      </div>
      {track.author && (
        <div style={{
          fontSize: 11, color: T.textSecondary, marginTop: 2,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>
          {track.author}
        </div>
      )}
    </div>
  )
}

function Section({ title, id, items, loading, onPlay, currentTrack, loadingId }) {
  if (!loading && items.length === 0) return null
  return (
    <div id={id} style={{ marginBottom: 36 }}>
      <h2 style={{
        fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 14,
        textTransform: 'uppercase', color: T.text, marginBottom: 12, letterSpacing: '0.04em',
      }}>
        {title}
      </h2>
      <div className="h-scroll" style={{ display: 'flex', gap: 12, paddingBottom: 8 }}>
        {loading
          ? Array(6).fill(0).map((_, i) => <SkeletonCard key={i} />)
          : items.map(item => (
              <Card
                key={item.id}
                track={item}
                onPlay={onPlay}
                isActive={currentTrack?.id === item.id}
                isLoading={loadingId === item.id}
              />
            ))
        }
      </div>
    </div>
  )
}

export default function Discover({ onPlay: onPlayProp, currentTrack, onSave, isInLibrary, addToQueue }) {
  const [continueItems, setContinueItems] = useState([])
  const [natureTracks, setNatureTracks] = useState([])
  const [musicTracks, setMusicTracks] = useState([])
  const [bookTracks, setBookTracks] = useState([])
  const [podcastTracks, setPodcastTracks] = useState([])
  const [loadingNature, setLoadingNature] = useState(true)
  const [loadingMusic, setLoadingMusic] = useState(true)
  const [loadingBooks, setLoadingBooks] = useState(true)
  const [loadingPods, setLoadingPods] = useState(true)
  const [loadingId, setLoadingId] = useState(null)

  useEffect(() => {
    // Continue listening: last played + library
    const items = []
    try {
      const saved = JSON.parse(localStorage.getItem('wisisleep_player'))
      if (saved?.trackData?.audioUrl) items.push(saved.trackData)
    } catch {}
    try {
      const lib = JSON.parse(localStorage.getItem('wisisleep_library') || '[]')
      lib.forEach(t => { if (!items.find(i => i.id === t.id)) items.push(t) })
    } catch {}
    setContinueItems(items.slice(0, 10))

    fetchNatureSoundsFromDB('rain')
      .then(d => setNatureTracks(d.slice(0, 10)))
      .finally(() => setLoadingNature(false))

    fetchSleepMusic()
      .then(d => setMusicTracks(d.slice(0, 10)))
      .finally(() => setLoadingMusic(false))

    fetchAudiobooks('mystery')
      .then(d => setBookTracks(d.slice(0, 10)))
      .finally(() => setLoadingBooks(false))

    fetchPodcasts('sleep meditation')
      .then(d => setPodcastTracks(d.slice(0, 10)))
      .finally(() => setLoadingPods(false))
  }, [])

  const handlePlay = async (track) => {
    if (track.type === 'audiobook') {
      setLoadingId(track.id)
      try {
        let sections = track.sections
        if (typeof sections === 'string') {
          try { sections = JSON.parse(sections) } catch { sections = [] }
        }
        let coverUrl = track.coverUrl || null
        if (!Array.isArray(sections) || sections.length === 0 || !sections[0]?.audioUrl) {
          const res = await fetch('/api/audiobook-chapters?id=' + track.librivoxId)
          const data = await res.json()
          sections = data.sections || []
          coverUrl = data.coverUrl || coverUrl
        }
        if (!Array.isArray(sections) || sections.length === 0 || !sections[0]?.audioUrl) {
          alert('No audio available for this book')
          return
        }
        const allChapters = sections.map((s, i) => ({
          id: track.id + '-ch' + i,
          title: track.title + ' — ' + s.title,
          author: track.author,
          audioUrl: s.audioUrl,
          duration: s.duration,
          type: 'audiobook',
          coverUrl,
          tags: [],
          description: track.description,
        }))
        onPlayProp({ ...allChapters[0], allChapters })
        sections.slice(1).forEach((_, i) => addToQueue(allChapters[i + 1]))
      } catch (e) {
        console.error('Failed to load chapters:', e)
        alert('Failed to load chapters')
      } finally {
        setLoadingId(null)
      }
      return
    }

    if (track.type === 'podcast') {
      setLoadingId(track.id)
      try {
        const episodes = await fetchPodcastEpisodes(track.feedUrl)
        const first = episodes.find(ep => ep.audioUrl)
        if (first) onPlayProp(first)
      } catch (e) {
        console.error('Failed to load episodes:', e)
      } finally {
        setLoadingId(null)
      }
      return
    }

    if (track.type === 'music') {
      onPlayProp(track)
      const others = musicTracks.filter(t => t.subcategory === track.subcategory && t.id !== track.id)
      others.sort(() => Math.random() - 0.5).forEach(t => addToQueue(t))
      return
    }

    onPlayProp(track)
  }

  return (
    <div style={{ padding: '24px 20px', maxWidth: 900, margin: '0 auto' }}>
      {continueItems.length > 0 && (
        <Section
          title="Continue Listening"
          items={continueItems}
          loading={false}
          onPlay={handlePlay}
          currentTrack={currentTrack}
          loadingId={loadingId}
        />
      )}
      <Section
        title="Nature Sounds"
        id="nature-sounds"
        items={natureTracks}
        loading={loadingNature}
        onPlay={handlePlay}
        currentTrack={currentTrack}
        loadingId={loadingId}
      />
      <Section
        title="Sleep Music"
        id="sleep-music"
        items={musicTracks}
        loading={loadingMusic}
        onPlay={handlePlay}
        currentTrack={currentTrack}
        loadingId={loadingId}
      />
      <Section
        title="Audiobooks"
        id="audiobooks"
        items={bookTracks}
        loading={loadingBooks}
        onPlay={handlePlay}
        currentTrack={currentTrack}
        loadingId={loadingId}
      />
      <Section
        title="Podcasts"
        id="podcasts"
        items={podcastTracks}
        loading={loadingPods}
        onPlay={handlePlay}
        currentTrack={currentTrack}
        loadingId={loadingId}
      />
      <style>{`
        .h-scroll { overflow-x: auto; scrollbar-width: none; }
        .h-scroll::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  )
}
