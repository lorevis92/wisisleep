export const config = { maxDuration: 30 }

export default async function handler(req, res) {
  const q = req.query.q || 'nature'
  try {
    const response = await fetch(`https://librivox.org/api/feed/audiobooks/?genre=${encodeURIComponent(q)}&format=json&extended=1&limit=24`)
    const data = await response.json()
    const books = (data.books || []).map(book => ({
      id: 'lv-' + book.id,
      title: book.title,
      author: book.authors?.[0] ? (book.authors[0].first_name + ' ' + book.authors[0].last_name).trim() : 'Unknown',
      type: 'audiobook',
      description: (book.description || '').replace(/<[^>]*>/g, '').slice(0, 120),
      language: book.language,
      sections: (book.sections || []).map(s => ({
        id: 'lv-sec-' + s.id,
        title: s.title,
        audioUrl: s.listen_url,
        duration: parseDuration(s.playtime)
      }))
    }))
    res.status(200).json(books)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
}

function parseDuration(playtime) {
  if (!playtime) return 0
  const parts = playtime.split(':').map(Number)
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2]
  if (parts.length === 2) return parts[0] * 60 + parts[1]
  return 0
}
