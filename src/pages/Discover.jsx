import { useState, useEffect, useRef } from 'react'
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
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const debounceRef = useRef(null)

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
      else if (cat === 'audiobook') {
        data = await fetchAudiobooks(term)
        if (data.length > 0) console.log('First book sections:', data[0].sections)
      }
      setResults(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    doSearch(activeCategory, '')
    setQuery('')
    setActiveTag('')
    setSuggestions([])
    setShowSuggestions(false)
  }, [activeCategory])

  const handleSearch = (e) => {
    e.preventDefault()
    setSuggestions([])
    setShowSuggestions(false)
    if (query.trim()) doSearch(activeCategory, query.trim())
  }

  const handleQueryChange = (e) => {
    const val = e.target.value
    setQuery(val)
    if (activeCategory !== 'audiobook' || val.length < 2) {
      clearTimeout(debounceRef.current)
      setSuggestions([])
      setShowSuggestions(false)
      return
    }
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/audiobooks?q=${encodeURIComponent(val)}`)
        const data = await res.json()
        setSuggestions(data.slice(0, 6))
        setShowSuggestions(true)
      } catch {
        setSuggestions([])
      }
    }, 400)
  }

  const handleSuggestionClick = (book) => {
    setQuery(book.title)
    setSuggestions([])
    setShowSuggestions(false)
    doSearch(activeCategory, book.title)
  }

  const handlePlay = async (track) => {
    if (track.type === 'audiobook') {
      console.log('Audiobook clicked:', track)
      setLoadingEpisode(track.id)
      try {
        // Try sections already in book data first
        let sections = track.sections
        if (typeof sections === 'string') {
          try { sections = JSON.parse(sections) } catch { sections = [] }
        }
        if (!Array.isArray(sections) || sections.length === 0 || !sections[0]?.audioUrl) {
          // Fallback: fetch from chapters API
          const res = await fetch('/api/audiobook-chapters?id=' + track.librivoxId)
          sections = await res.json()
        }
        if (!Array.isArray(sections) || sections.length === 0 || !sections[0]?.audioUrl) {
          alert('No audio available for this book')
          return
        }
        onPlay({
          id: track.id + '-ch0',
          title: track.title + ' — ' + sections[0].title,
          author: track.author,
          audioUrl: sections[0].audioUrl,
          duration: sections[0].duration,
          type: 'audiobook',
          coverUrl: null,
          tags: [],
          description: track.description,
        })
      } catch (e) {
        console.error('Failed to load chapters:', e)
        alert('Failed to load chapters')
      } finally {
        setLoadingEpisode(null)
      }
      return
    }
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
        <div style={{ position: 'relative', flex: 1 }}>
          <input
            value={query}
            onChange={handleQueryChange}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
            onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
            placeholder={`Search ${CATEGORIES.find(c => c.id === activeCategory)?.label}...`}
            style={{
              width: '100%', fontFamily: 'Syne, sans-serif', fontSize: 13,
              border: `1px solid ${T.border}`, borderRadius: 4,
              padding: '8px 12px', background: T.bg, color: T.text,
              outline: 'none', boxSizing: 'border-box',
            }}
          />
          {showSuggestions && suggestions.length > 0 && (
            <div style={{
              position: 'absolute', top: '100%', left: 0, right: 0, marginTop: 2,
              background: '#fff', border: '1px solid #E8E8E8', borderRadius: 4, zIndex: 50,
            }}>
              {suggestions.map((book, i) => (
                <div
                  key={book.id || i}
                  onMouseDown={() => handleSuggestionClick(book)}
                  onMouseEnter={e => e.currentTarget.style.background = '#F8F8F8'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  style={{ padding: '10px 14px', fontSize: 13, fontFamily: 'Syne, sans-serif', cursor: 'pointer' }}
                >
                  <span style={{ fontWeight: 700, color: T.text }}>{book.title}</span>
                  {book.author && <span style={{ color: T.textSecondary }}> — {book.author}</span>}
                </div>
              ))}
            </div>
          )}
        </div>
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
