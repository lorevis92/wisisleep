import { useState, useEffect, useRef } from 'react'
import { T, NATURE_CATEGORIES, SLEEP_MUSIC_CATEGORIES, AUDIOBOOK_CATEGORIES, PODCAST_CATEGORIES } from '../utils/constants'
import {
  fetchNatureSounds, fetchNatureSoundsFromDB,
  fetchSleepMusic, fetchAudiobooks, fetchPodcasts, fetchPodcastEpisodes,
} from '../utils/api'
import { getHistory } from '../hooks/usePlayer'

const TYPE_ICONS = { sounds: '🌿', music: '🎵', podcast: '🎙️', audiobook: '📚' }
const TYPE_BG = { sounds: '#E8F5E9', music: '#E3F2FD', podcast: '#FFF3E0', audiobook: '#F3E5F5' }

// ─── Skeleton ────────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div style={{ width: 140, flexShrink: 0 }}>
      <div style={{ width: 140, height: 140, borderRadius: 6, background: T.surfaceAlt }} />
      <div style={{ height: 11, background: T.surfaceAlt, borderRadius: 3, marginTop: 8, width: '80%' }} />
      <div style={{ height: 10, background: T.surfaceAlt, borderRadius: 3, marginTop: 4, width: '55%' }} />
    </div>
  )
}

// ─── Card ────────────────────────────────────────────────────────────────────
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
        fontSize: 40, position: 'relative',
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

// ─── Section row ─────────────────────────────────────────────────────────────
function Section({ title, id, items, loading, onPlay, currentTrack, loadingId, onSeeAll }) {
  if (!loading && items.length === 0) return null
  return (
    <div id={id} style={{ marginBottom: 36 }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
        <h2 style={{
          fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 14,
          textTransform: 'uppercase', color: T.text, letterSpacing: '0.04em', flex: 1,
        }}>
          {title}
        </h2>
        {onSeeAll && (
          <button onClick={onSeeAll} style={{
            fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 11,
            color: T.primary, background: 'none', border: 'none',
            cursor: 'pointer', letterSpacing: '0.03em',
          }}>
            See all →
          </button>
        )}
      </div>
      <div className="h-scroll" style={{ display: 'flex', gap: 12, paddingBottom: 8 }}>
        {loading
          ? Array(6).fill(0).map((_, i) => <SkeletonCard key={i} />)
          : items.map(item => (
              <Card key={item.id} track={item} onPlay={onPlay}
                isActive={currentTrack?.id === item.id} isLoading={loadingId === item.id} />
            ))
        }
      </div>
    </div>
  )
}

// ─── Category grid (reusable for see-all views) ───────────────────────────────
function CategoryGrid({ categories, activeId, onSelect }) {
  return (
    <div className="nature-grid" style={{ marginBottom: 24 }}>
      {categories.map(cat => (
        <div
          key={cat.id}
          onClick={() => onSelect(cat)}
          style={{
            height: 120, borderRadius: 6, overflow: 'hidden',
            position: 'relative', cursor: 'pointer',
            border: `2px solid ${activeId === cat.id ? T.primary : 'transparent'}`,
            boxSizing: 'border-box',
          }}
        >
          <img src={cat.image} alt={cat.label}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(transparent, rgba(0,0,0,0.62))',
          }} />
          <div style={{
            position: 'absolute', bottom: 8, left: 0, right: 0,
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
          }}>
            <span style={{ fontSize: 18 }}>{cat.icon}</span>
            <span style={{
              fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 11,
              color: '#fff', textTransform: 'uppercase', letterSpacing: '0.05em',
            }}>{cat.label}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Results grid ─────────────────────────────────────────────────────────────
function ResultsGrid({ items, loading, onPlay, currentTrack, loadingId }) {
  if (loading) {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 12 }}>
        {Array(8).fill(0).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    )
  }
  if (items.length === 0) return null
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 12 }}>
      {items.map(track => (
        <Card key={track.id} track={track} onPlay={onPlay}
          isActive={currentTrack?.id === track.id} isLoading={loadingId === track.id} />
      ))}
    </div>
  )
}

// ─── See All views ────────────────────────────────────────────────────────────
function NatureSeeAll({ onBack, onPlay, currentTrack, loadingId }) {
  const [active, setActive] = useState(null)
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const resultsRef = useRef(null)

  const handleSelect = async (cat) => {
    setActive(cat.id)
    setLoading(true)
    setResults([])
    try {
      let data = await fetchNatureSoundsFromDB(cat.id)
      if (data.length === 0) {
        const fallback = await fetchNatureSounds(cat.query)
        data = fallback.map(s => ({ ...s, coverUrl: cat.image }))
      }
      setResults(data)
      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '24px 20px', maxWidth: 900, margin: '0 auto' }}>
      <BackButton onClick={onBack} />
      <SectionTitle>Nature Sounds</SectionTitle>
      <CategoryGrid categories={NATURE_CATEGORIES} activeId={active} onSelect={handleSelect} />
      <div ref={resultsRef}>
        <ResultsGrid items={results} loading={loading} onPlay={onPlay}
          currentTrack={currentTrack} loadingId={loadingId} />
      </div>
    </div>
  )
}

function SleepMusicSeeAll({ onBack, onPlay, currentTrack, loadingId }) {
  const [active, setActive] = useState(null)
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const resultsRef = useRef(null)

  const handleSelect = async (cat) => {
    setActive(cat.id)
    setLoading(true)
    setResults([])
    try {
      const data = await fetchNatureSoundsFromDB('sleep-music', cat.id)
      setResults(data)
      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '24px 20px', maxWidth: 900, margin: '0 auto' }}>
      <BackButton onClick={onBack} />
      <SectionTitle>Sleep Music</SectionTitle>
      <CategoryGrid categories={SLEEP_MUSIC_CATEGORIES} activeId={active} onSelect={handleSelect} />
      <div ref={resultsRef}>
        <ResultsGrid items={results} loading={loading} onPlay={onPlay}
          currentTrack={currentTrack} loadingId={loadingId} />
      </div>
    </div>
  )
}

function AudiobooksSeeAll({ onBack, onPlay, currentTrack, loadingId }) {
  const [active, setActive] = useState(null)
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const resultsRef = useRef(null)

  const handleSelect = async (cat) => {
    setActive(cat.id)
    setLoading(true)
    setResults([])
    try {
      const data = await fetchAudiobooks(cat.id)
      setResults(data)
      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '24px 20px', maxWidth: 900, margin: '0 auto' }}>
      <BackButton onClick={onBack} />
      <SectionTitle>Audiobooks</SectionTitle>
      <CategoryGrid categories={AUDIOBOOK_CATEGORIES} activeId={active} onSelect={handleSelect} />
      <div ref={resultsRef}>
        <ResultsGrid items={results} loading={loading} onPlay={onPlay}
          currentTrack={currentTrack} loadingId={loadingId} />
      </div>
    </div>
  )
}

function PodcastsSeeAll({ onBack, onPlay, currentTrack, loadingId }) {
  const [query, setQuery] = useState('')
  const [activeTag, setActiveTag] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const resultsRef = useRef(null)

  const search = async (q) => {
    setLoading(true)
    setResults([])
    try {
      const data = await fetchPodcasts(q || 'sleep')
      setResults(data)
      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50)
    } finally {
      setLoading(false)
    }
  }

  const handleTag = (tag) => {
    setActiveTag(tag)
    setQuery(tag)
    search(tag)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (query.trim()) search(query.trim())
  }

  return (
    <div style={{ padding: '24px 20px', maxWidth: 900, margin: '0 auto' }}>
      <BackButton onClick={onBack} />
      <SectionTitle>Podcasts</SectionTitle>
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search podcasts..."
          style={{
            flex: 1, fontFamily: 'Syne, sans-serif', fontSize: 13,
            border: `1px solid ${T.border}`, borderRadius: 4,
            padding: '8px 12px', background: T.bg, color: T.text,
            outline: 'none',
          }}
        />
        <button type="submit" style={{
          fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 11,
          letterSpacing: '0.05em', textTransform: 'uppercase',
          padding: '8px 16px', borderRadius: 3,
          background: T.primary, color: '#fff', border: 'none', cursor: 'pointer',
        }}>
          Search
        </button>
      </form>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 20 }}>
        {PODCAST_CATEGORIES.map(tag => (
          <button
            key={tag}
            onClick={() => handleTag(tag)}
            style={{
              fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 10,
              letterSpacing: '0.04em', textTransform: 'uppercase',
              padding: '4px 10px', borderRadius: 3,
              border: `1px solid ${activeTag === tag ? T.primary : T.border}`,
              background: activeTag === tag ? T.primaryLight : T.surface,
              color: activeTag === tag ? T.primary : T.textMuted,
              cursor: 'pointer',
            }}
          >
            {tag}
          </button>
        ))}
      </div>
      <div ref={resultsRef}>
        <ResultsGrid items={results} loading={loading} onPlay={onPlay}
          currentTrack={currentTrack} loadingId={loadingId} />
      </div>
    </div>
  )
}

function BackButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 12,
        color: T.textSecondary, background: 'none', border: 'none',
        cursor: 'pointer', padding: '0 0 16px', letterSpacing: '0.03em',
        display: 'flex', alignItems: 'center', gap: 4,
      }}
    >
      ← Back
    </button>
  )
}

function SectionTitle({ children }) {
  return (
    <h2 style={{
      fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 18,
      color: T.text, marginBottom: 20, letterSpacing: '0.02em',
    }}>
      {children}
    </h2>
  )
}

// ─── Recommendation logic ────────────────────────────────────────────────────
function analyzeHistory(history) {
  if (history.length < 3) return null
  const typeCounts = {}
  history.forEach(t => { typeCounts[t.type] = (typeCounts[t.type] || 0) + 1 })
  const topType = Object.entries(typeCounts).sort((a, b) => b[1] - a[1])[0]?.[0]
  if (!topType) return null
  const ofType = history.filter(t => t.type === topType)
  if (topType === 'audiobook') {
    const genres = ['mystery', 'adventure', 'history', 'philosophy', 'science']
    const counts = {}
    ofType.forEach(t => {
      const text = ((t.description || '') + ' ' + (t.title || '')).toLowerCase()
      genres.forEach(g => { if (text.includes(g)) counts[g] = (counts[g] || 0) + 1 })
    })
    const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'mystery'
    return { type: 'audiobook', subtype: top }
  }
  if (topType === 'music') {
    const counts = {}
    ofType.forEach(t => { if (t.subcategory) counts[t.subcategory] = (counts[t.subcategory] || 0) + 1 })
    const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'ambient'
    return { type: 'music', subtype: top }
  }
  if (topType === 'sounds') {
    const counts = {}
    ofType.forEach(t => { if (t.category) counts[t.category] = (counts[t.category] || 0) + 1 })
    const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'rain'
    return { type: 'sounds', subtype: top }
  }
  if (topType === 'podcast') return { type: 'podcast', subtype: 'sleep meditation' }
  return null
}

async function fetchRecommended(analysis) {
  if (!analysis) {
    const [nature, music, books] = await Promise.all([
      fetchNatureSoundsFromDB('rain').then(d => d.slice(0, 3)),
      fetchNatureSoundsFromDB('sleep-music', 'ambient').then(d => d.slice(0, 3)),
      fetchAudiobooks('mystery').then(d => d.slice(0, 4)),
    ])
    return { tracks: [...nature, ...music, ...books], label: 'Popular' }
  }
  let tracks = []
  if (analysis.type === 'audiobook') tracks = await fetchAudiobooks(analysis.subtype)
  else if (analysis.type === 'music') tracks = await fetchNatureSoundsFromDB('sleep-music', analysis.subtype)
  else if (analysis.type === 'sounds') tracks = await fetchNatureSoundsFromDB(analysis.subtype)
  else if (analysis.type === 'podcast') tracks = await fetchPodcasts(analysis.subtype)
  return { tracks: tracks.slice(0, 10), label: 'Recommended for You' }
}

// ─── Main Discover ────────────────────────────────────────────────────────────
export default function Discover({ onPlay: onPlayProp, currentTrack, onSave, isInLibrary, addToQueue, activeSection, onSectionConsumed, resetKey }) {
  const [activeView, setActiveView] = useState(null) // null | 'nature' | 'sleep-music' | 'audiobooks' | 'podcasts'
  const [continueItems, setContinueItems] = useState([])
  const [natureTracks, setNatureTracks] = useState([])
  const [musicTracks, setMusicTracks] = useState([])
  const [bookTracks, setBookTracks] = useState([])
  const [podcastTracks, setPodcastTracks] = useState([])
  const [recommendedTracks, setRecommendedTracks] = useState([])
  const [recommendedLabel, setRecommendedLabel] = useState('Popular')
  const [loadingRecommended, setLoadingRecommended] = useState(true)
  const [loadingNature, setLoadingNature] = useState(true)
  const [loadingMusic, setLoadingMusic] = useState(true)
  const [loadingBooks, setLoadingBooks] = useState(true)
  const [loadingPods, setLoadingPods] = useState(true)
  const [loadingId, setLoadingId] = useState(null)

  useEffect(() => {
    if (activeSection) {
      setActiveView(activeSection)
      onSectionConsumed?.()
    }
  }, [activeSection])

  useEffect(() => {
    if (resetKey > 0) setActiveView(null)
  }, [resetKey])

  useEffect(() => {
    const history = getHistory()
    setContinueItems(history)

    const analysis = analyzeHistory(history)
    fetchRecommended(analysis)
      .then(({ tracks, label }) => { setRecommendedTracks(tracks); setRecommendedLabel(label) })
      .finally(() => setLoadingRecommended(false))

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
    if (track.audioUrl) {
      onPlayProp(track)
      return
    }

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
          console.warn('No audio available for this book:', track.title)
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
        let startIndex = 0
        try {
          const history = JSON.parse(localStorage.getItem('wisisleep_history') || '[]')
          const saved = history.find(item => item.id?.startsWith(track.id + '-ch'))
          if (saved) {
            const foundIdx = allChapters.findIndex(ch => ch.id === saved.id)
            if (foundIdx !== -1) startIndex = foundIdx
          }
        } catch {}

        onPlayProp({ ...allChapters[startIndex], allChapters })
        allChapters.slice(startIndex + 1).forEach(ch => addToQueue({ ...ch, allChapters }))
      } catch (e) {
        console.error('Failed to load chapters:', e)
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

  // ── See All views ──
  if (activeView === 'nature') return (
    <>
      <NatureSeeAll onBack={() => setActiveView(null)} onPlay={handlePlay}
        currentTrack={currentTrack} loadingId={loadingId} />
      <Styles />
    </>
  )
  if (activeView === 'sleep-music') return (
    <>
      <SleepMusicSeeAll onBack={() => setActiveView(null)} onPlay={handlePlay}
        currentTrack={currentTrack} loadingId={loadingId} />
      <Styles />
    </>
  )
  if (activeView === 'audiobooks') return (
    <>
      <AudiobooksSeeAll onBack={() => setActiveView(null)} onPlay={handlePlay}
        currentTrack={currentTrack} loadingId={loadingId} />
      <Styles />
    </>
  )
  if (activeView === 'podcasts') return (
    <>
      <PodcastsSeeAll onBack={() => setActiveView(null)} onPlay={handlePlay}
        currentTrack={currentTrack} loadingId={loadingId} />
      <Styles />
    </>
  )

  // ── Homepage ──
  return (
    <div style={{ padding: '24px 20px', maxWidth: 900, margin: '0 auto' }}>
      {continueItems.length > 0 && (
        <Section title="Continue Listening" items={continueItems} loading={false}
          onPlay={handlePlay} currentTrack={currentTrack} loadingId={loadingId} />
      )}
      <Section title={recommendedLabel} items={recommendedTracks} loading={loadingRecommended}
        onPlay={handlePlay} currentTrack={currentTrack} loadingId={loadingId} />
      <Section title="Nature Sounds" id="nature-sounds" items={natureTracks} loading={loadingNature}
        onPlay={handlePlay} currentTrack={currentTrack} loadingId={loadingId}
        onSeeAll={() => setActiveView('nature')} />
      <Section title="Sleep Music" id="sleep-music" items={musicTracks} loading={loadingMusic}
        onPlay={handlePlay} currentTrack={currentTrack} loadingId={loadingId}
        onSeeAll={() => setActiveView('sleep-music')} />
      <Section title="Audiobooks" id="audiobooks" items={bookTracks} loading={loadingBooks}
        onPlay={handlePlay} currentTrack={currentTrack} loadingId={loadingId}
        onSeeAll={() => setActiveView('audiobooks')} />
      <Section title="Podcasts" id="podcasts" items={podcastTracks} loading={loadingPods}
        onPlay={handlePlay} currentTrack={currentTrack} loadingId={loadingId}
        onSeeAll={() => setActiveView('podcasts')} />
      <Styles />
    </div>
  )
}

function Styles() {
  return (
    <style>{`
      .h-scroll { overflow-x: auto; scrollbar-width: none; }
      .h-scroll::-webkit-scrollbar { display: none; }
      .nature-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
      @media (max-width: 640px) { .nature-grid { grid-template-columns: repeat(2, 1fr); } }
    `}</style>
  )
}
