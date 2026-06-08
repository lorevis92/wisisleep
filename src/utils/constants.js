export const T = {
  bg: '#FFFFFF',
  surface: '#F8F8F8',
  surfaceAlt: '#F0F0F0',
  border: '#E8E8E8',
  text: '#111111',
  textSecondary: '#666666',
  textMuted: '#AAAAAA',
  primary: '#E8352A',
  primaryLight: 'rgba(232,53,42,0.06)',
  primaryBorder: 'rgba(232,53,42,0.18)',
  green: '#00996A',
  yellow: '#B87000',
}

export const CATEGORIES = [
  { id: 'nature', label: 'Nature Sounds', icon: '🌿', type: 'sounds' },
  { id: 'sleep-music', label: 'Sleep Music', icon: '🎵', type: 'music' },
  { id: 'podcast', label: 'Podcasts', icon: '🎙️', type: 'podcast' },
  { id: 'audiobook', label: 'Audiobooks', icon: '📚', type: 'audiobook' },
]

export const TIMER_OPTIONS = [
  { label: '15 min', value: 15 },
  { label: '30 min', value: 30 },
  { label: '45 min', value: 45 },
  { label: '60 min', value: 60 },
  { label: '90 min', value: 90 },
  { label: 'No timer', value: 0 },
]

export const NATURE_CATEGORIES = [
  { id: 'rain', label: 'Rain', icon: '🌧', query: 'rain ambience relaxing loop', image: 'https://images.unsplash.com/photo-1519692933481-e162a57d6721?w=400&q=80' },
  { id: 'ocean', label: 'Ocean', icon: '🌊', query: 'ocean waves beach relaxing', image: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=400&q=80' },
  { id: 'forest', label: 'Forest', icon: '🌲', query: 'forest night birds nature ambience', image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=400&q=80' },
  { id: 'fireplace', label: 'Fireplace', icon: '🔥', query: 'fireplace crackling fire indoor', image: 'https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?w=400&q=80' },
  { id: 'thunder', label: 'Thunder', icon: '⛈', query: 'thunderstorm rain thunder relaxing', image: 'https://images.unsplash.com/photo-1605727216801-e27ce1d0cc28?w=400&q=80' },
  { id: 'cafe', label: 'Cafe', icon: '☕', query: 'coffee shop cafe ambience background noise', image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400&q=80' },
  { id: 'whitenoise', label: 'White Noise', icon: '〰️', query: 'white noise sleep fan static', image: 'https://images.unsplash.com/photo-1531306728370-e2ebd9d7bb99?w=400&q=80' },
  { id: 'night', label: 'Night', icon: '🌙', query: 'night crickets frogs summer nature', image: 'https://images.unsplash.com/photo-1475274047050-1d0c0975c63e?w=400&q=80' },
  { id: 'river', label: 'River', icon: '💧', query: 'river stream water flowing relaxing', image: 'https://images.unsplash.com/photo-1504192010706-dd7f569ee2be?w=400&q=80' },
  { id: 'wind', label: 'Wind', icon: '💨', query: 'wind nature outdoor relaxing ambience', image: 'https://images.unsplash.com/photo-1527482797697-8795b05a13fe?w=400&q=80' },
]

export const AUDIOBOOK_CATEGORIES = [
  { id: 'mystery', label: 'Mystery', icon: '🔍', image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&q=80' },
  { id: 'philosophy', label: 'Philosophy', icon: '🧠', image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&q=80' },
  { id: 'history', label: 'History', icon: '🏛', image: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=400&q=80' },
  { id: 'science', label: 'Science', icon: '🔬', image: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=400&q=80' },
  { id: 'adventure', label: 'Adventure', icon: '⚔️', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&q=80' },
  { id: 'nature', label: 'Nature', icon: '🌿', image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&q=80' },
  { id: 'classic', label: 'Classic', icon: '📖', image: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=400&q=80' },
  { id: 'romance', label: 'Romance', icon: '❤️', image: 'https://images.unsplash.com/photo-1474552226712-ac0f0961a954?w=400&q=80' },
  { id: 'scifi', label: 'Sci-Fi', icon: '🚀', image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&q=80' },
  { id: 'biography', label: 'Biography', icon: '👤', image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400&q=80' },
]

export const SLEEP_MUSIC_CATEGORIES = [
  { id: 'ambient', label: 'Ambient', icon: '🌫️', image: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=400&q=80' },
  { id: 'piano', label: 'Piano', icon: '🎹', image: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=400&q=80' },
  { id: 'meditation', label: 'Meditation', icon: '🧘', image: 'https://images.unsplash.com/photo-1508672019048-805c876b67e2?w=400&q=80' },
  { id: 'lofi', label: 'Lo-Fi', icon: '🎧', image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&q=80' },
  { id: 'binaural', label: 'Binaural', icon: '〰️', image: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=400&q=80' },
  { id: 'calm', label: 'Calm', icon: '✨', image: 'https://images.unsplash.com/photo-1459233313842-cd392ee2c388?w=400&q=80' },
  { id: 'zen', label: 'Zen', icon: '☯️', image: 'https://images.unsplash.com/photo-1481671703460-040cb8a2d909?w=400&q=80' },
]

export const PODCAST_CATEGORIES = [
  'science', 'history', 'philosophy', 'technology', 'nature', 'space', 'psychology', 'culture'
]
