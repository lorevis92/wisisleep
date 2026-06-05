export const config = { maxDuration: 30 }

export default async function handler(req, res) {
  const q = req.query.q || 'nature'
  try {
    const [r1, r2] = await Promise.all([
      fetch(`https://librivox.org/api/feed/audiobooks/?genre=${encodeURIComponent(q)}&format=json&extended=1&limit=12`),
      fetch(`https://librivox.org/api/feed/audiobooks/?author=${encodeURIComponent(q)}&format=json&extended=1&limit=12`)
    ])
    const [d1, d2] = await Promise.all([r1.json(), r2.json()])
    const seen = new Set()
    const books = [...(d1.books || []), ...(d2.books || [])]
      .filter(book => {
        if (seen.has(book.id)) return false
        seen.add(book.id)
        return true
      })
      .slice(0, 24)
      .map(book => ({
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
