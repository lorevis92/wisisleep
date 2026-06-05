// ─── Freesound API (Nature Sounds) ───────────────────────────────────────────
const FREESOUND_KEY = import.meta.env.VITE_FREESOUND_API_KEY

export async function fetchNatureSounds(query = 'rain') {
  try {
    const url = `https://freesound.org/apiv2/search/text/?query=${encodeURIComponent(query)}&filter=duration:[600 TO 7200]&fields=id,name,duration,previews,username,description,tags&page_size=12&token=${FREESOUND_KEY}`
    const res = await fetch(url)
    const data = await res.json()
    return (data.results || []).map(s => ({
      id: `fs-${s.id}`,
      title: s.name,
      author: s.username,
      duration: Math.round(s.duration),
      audioUrl: s.previews?.['preview-hq-mp3'] || s.previews?.['preview-lq-mp3'],
      type: 'sounds',
      tags: s.tags?.slice(0, 4) || [],
      description: s.description?.slice(0, 120) || '',
      coverUrl: null,
    }))
  } catch (e) {
    console.error('Freesound error:', e)
    return []
  }
}

// ─── Sleep Music (hardcoded) ──────────────────────────────────────────────────
const SLEEP_MUSIC = [
  { id: 'fm-1', title: 'Relaxing Piano', author: 'Kevin MacLeod', duration: 1800, audioUrl: 'https://incompetech.com/music/royalty-free/mp3-royaltyfree/Relaxing%20Piano%20Music.mp3', coverUrl: null, type: 'music', tags: ['piano', 'calm'], description: 'Gentle piano for sleep.' },
  { id: 'fm-2', title: 'Meditation Aquatic', author: 'Kevin MacLeod', duration: 2100, audioUrl: 'https://incompetech.com/music/royalty-free/mp3-royaltyfree/Meditation%20Aquatic.mp3', coverUrl: null, type: 'music', tags: ['meditation', 'ambient'], description: 'Ambient meditation music.' },
  { id: 'fm-3', title: 'Slow Burn', author: 'Kevin MacLeod', duration: 1920, audioUrl: 'https://incompetech.com/music/royalty-free/mp3-royaltyfree/Slow%20Burn.mp3', coverUrl: null, type: 'music', tags: ['ambient', 'calm'], description: 'Slow ambient music.' },
  { id: 'fm-4', title: 'Dreaming', author: 'Kevin MacLeod', duration: 2400, audioUrl: 'https://incompetech.com/music/royalty-free/mp3-royaltyfree/Dreaming.mp3', coverUrl: null, type: 'music', tags: ['dream', 'soft'], description: 'Soft dreamy music for sleep.' }
]

export async function fetchSleepMusic() {
  return SLEEP_MUSIC
}

// ─── iTunes Search API (Podcasts) ────────────────────────────────────────────
export async function fetchPodcasts(query = 'science') {
  try {
    const res = await fetch(
      `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&media=podcast&limit=12`
    )
    const data = await res.json()
    return (data.results || []).map(p => ({
      id: p.collectionId,
      title: p.collectionName,
      author: p.artistName,
      coverUrl: p.artworkUrl600,
      feedUrl: p.feedUrl,
      type: 'podcast',
      description: '',
    }))
  } catch (e) {
    console.error('iTunes error:', e)
    return []
  }
}

export async function fetchPodcastEpisodes(feedUrl) {
  try {
    const res = await fetch(
      `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feedUrl)}`
    )
    const data = await res.json()
    return (data.items || []).map((ep, i) => ({
      id: ep.guid || `ep-${i}`,
      title: ep.title,
      author: ep.author || data.feed?.title || '',
      duration: parseDuration(ep.itunes_duration) || 0,
      audioUrl: ep.enclosure?.link || ep.link,
      coverUrl: ep.thumbnail || data.feed?.image || null,
      type: 'podcast',
      description: ep.description?.replace(/<[^>]*>/g, '').slice(0, 120) || '',
      publishedAt: ep.pubDate ? Math.floor(new Date(ep.pubDate).getTime() / 1000) : null,
    }))
  } catch (e) {
    console.error('Episodes error:', e)
    return []
  }
}

// ─── Audiobooks (hardcoded) ───────────────────────────────────────────────────
const AUDIOBOOK_LIST = [
  { id: 'lv-1', title: 'Meditations — Book 1', author: 'Marcus Aurelius', duration: 2700, audioUrl: 'https://archive.org/download/meditations_librivox/meditations_01_aurelius_64kb.mp3', coverUrl: null, type: 'audiobook', tags: ['philosophy', 'stoic'], description: 'Stoic philosophy for a calm mind.' },
  { id: 'lv-2', title: 'The Secret Garden — Ch. 1', author: 'F.H. Burnett', duration: 1800, audioUrl: 'https://archive.org/download/secret_garden_0709_librivox/secretgarden_01_burnett_64kb.mp3', coverUrl: null, type: 'audiobook', tags: ['classic', 'nature'], description: 'A classic story of healing.' },
  { id: 'lv-3', title: 'Pride and Prejudice — Ch. 1', author: 'Jane Austen', duration: 2400, audioUrl: 'https://archive.org/download/pride_and_prejudice_0711_librivox/prideandprejudice_01_austen_64kb.mp3', coverUrl: null, type: 'audiobook', tags: ['classic', 'romance'], description: 'Timeless Jane Austen romance.' },
  { id: 'lv-4', title: 'War of the Worlds — Ch. 1', author: 'H.G. Wells', duration: 1500, audioUrl: 'https://archive.org/download/war_of_the_worlds_0611_librivox/waroftheworlds_01_wells_64kb.mp3', coverUrl: null, type: 'audiobook', tags: ['scifi', 'classic'], description: 'Classic sci-fi adventure.' }
]

export async function fetchAudiobooks() {
  return AUDIOBOOK_LIST
}

function parseDuration(playtime) {
  if (!playtime) return 0
  const parts = playtime.split(':').map(Number)
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2]
  if (parts.length === 2) return parts[0] * 60 + parts[1]
  return 0
}

export function formatDuration(seconds) {
  if (!seconds) return '--:--'
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  if (h > 0) return `${h}h ${m}m`
  return `${m}:${String(s).padStart(2, '0')}`
}
