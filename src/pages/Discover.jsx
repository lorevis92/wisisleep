import { useState, useEffect } from 'react'
import { T, CATEGORIES, NATURE_TAGS, PODCAST_CATEGORIES } from '../utils/constants'
import { fetchNatureSounds, fetchSleepMusic, fetchPodcasts, fetchAudiobooks, fetchPodcastEpisodes } from '../utils/api'
import TrackCard from '../components/TrackCard'

export default function Discover({ onPlay, currentTrack, onSave, isInLibrary }) {
  const [activeCategory, setActiveCategory] = useState('nature')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [query, setQuery] = useState('')
  const [activeTag, setActiveTag] = useState('')
  const [loadingEpisode, setLoadingEpisode] = useState(null)

  const TAGS_BY_CATEGORY = {
    nature: NATURE_TAGS,
    'sleep-music': ['ambient', 'piano', 'meditation', 'lofi', 'binaural', 'calm', 'zen'],
    podcast: PODCAST_CATEGORIES,
    audiobook: ['nature', 'philosophy', 'history', 'science', 'adventure', 'mystery'],
  }

  const doSearch = async (cat, q) => {
    setLoading(true)
    setResults([])
    try {
      const term = q || (cat === 'nature' ? 'rain' : cat === 'sleep-music' ? 'relaxing' : cat === 'podcast' ? 'science' : 'nature')
      let data = []
      if (cat === 'nature') data = await fetchNatureSounds(term)
      else if (cat === 'sleep-music') data = await fetchSleepMusic(term)
      else if (cat === 'podcast') data = await fetchPodcasts(term)
      else if (cat === 'audiobook') data = await fetchAudiobooks(term)
      setResults(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    doSearch(activeCategory, '')
    setQuery('')
    setActiveTag('')
  }, [activeCategory])

  const handleSearch = (e) => {
    e.preventDefault()
    if (query.trim()) doSearch(activeCategory, query.trim())
  }

  const handlePlay = async (track) => {
    if (track.type !== 'podcast') {
      onPlay(track)
      return
    }
    setLoadingEpisode(track.id)
    try {
      const episodes = await fetchPodcastEpisodes(track.feedUrl)
      const first = episodes.find(ep => ep.audioUrl)
      if (first) onPlay(first)
    } catch (e) {
      console.error('Failed to load episodes:', e)
    } finally {
      setLoadingEpisode(null)
    }
  }

  const handleTag = (tag) => {
    setActiveTag(tag)
    setQuery(tag)
    doSearch(activeCategory, tag)
  }

  return (
    <div style={{ padding: '24px 20px', maxWidth: 800, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{
          fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 22,
          color: T.text, marginBottom: 4,
        }}>
          Discover
        </h1>
        <p style={{ fontSize: 13, color: T.textSecondary }}>
          Find sounds, music, podcasts, and audiobooks to help you sleep.
        </p>
      </div>

      {/* Category tabs */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 20 }}>
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            style={{
              fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 11,
              letterSpacing: '0.05em', textTransform: 'uppercase',
              padding: '7px 14px', borderRadius: 3,
              border: `1px solid ${activeCategory === cat.id ? T.primary : T.border}`,
              background: activeCategory === cat.id ? T.primary : T.surface,
              color: activeCategory === cat.id ? '#fff' : T.textSecondary,
              transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: 6,
            }}
          >
            <span>{cat.icon}</span> {cat.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder={`Search ${CATEGORIES.find(c => c.id === activeCategory)?.label}...`}
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
          background: T.primary, color: '#fff', border: 'none',
        }}>
          Search
        </button>
      </form>

      {/* Quick tags */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 20 }}>
        {(TAGS_BY_CATEGORY[activeCategory] || []).map(tag => (
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
              cursor: 'pointer', transition: 'all 0.12s',
            }}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Results */}
      {loading && (
        <div style={{
          textAlign: 'center', padding: '48px 0',
          fontFamily: 'Syne, sans-serif', fontSize: 13, color: T.textMuted,
        }}>
          Loading...
        </div>
      )}

      {!loading && results.length === 0 && (
        <div style={{
          textAlign: 'center', padding: '48px 0',
          fontFamily: 'Syne, sans-serif', fontSize: 13, color: T.textMuted,
        }}>
          No results found. Try a different search.
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {results.map(track => (
          <TrackCard
            key={track.id}
            track={track}
            onPlay={handlePlay}
            onSave={onSave}
            isSaved={isInLibrary(track.id)}
            isActive={currentTrack?.id === track.id}
            isLoading={loadingEpisode === track.id}
          />
        ))}
      </div>
    </div>
  )
}
