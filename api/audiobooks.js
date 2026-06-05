import fetch from 'node-fetch'

export const config = { maxDuration: 30 }

export default async function handler(req, res) {
  const q = req.query.q || 'nature'
  const base = 'https://librivox.org/api/feed/audiobooks'
  const qs = `&format=json&extended=1&limit=12`
  try {
    const [byTitle, byAuthor] = await Promise.all([
      fetch(`${base}/?title=${encodeURIComponent(q)}${qs}`).then(r => r.json()),
      fetch(`${base}/?author=${encodeURIComponent(q)}${qs}`).then(r => r.json()),
    ])
    console.log('byTitle raw:', JSON.stringify(byTitle))
    console.log('byAuthor raw:', JSON.stringify(byAuthor))
    const seen = new Set()
    const books = [...(byTitle.books || []), ...(byAuthor.books || [])]
      .filter(book => {
        if (seen.has(book.id)) return false
        seen.add(book.id)
        return true
      })
      .slice(0, 24)
      .map(book => {
        const sections = (book.sections || []).map(s => ({
          id: 'lv-sec-' + s.id,
          title: s.title,
          audioUrl: s.listen_url,
          duration: parseDuration(s.playtime)
        }))
        return {
          id: 'lv-' + book.id,
          title: book.title,
          author: book.authors?.[0] ? (book.authors[0].first_name + ' ' + book.authors[0].last_name).trim() : 'Unknown',
          type: 'audiobook',
          description: (book.description || '').replace(/<[^>]*>/g, '').slice(0, 120),
          language: book.language,
          coverUrl: null,
          totalDuration: sections.reduce((sum, s) => sum + s.duration, 0),
          sections,
        }
      }))
    res.status(200).json(books)
  } catch (e) {
    res.status(500).json({ error: e.message, stack: e.stack })
  }
}

function parseDuration(playtime) {
  if (!playtime) return 0
  const parts = playtime.split(':').map(Number)
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2]
  if (parts.length === 2) return parts[0] * 60 + parts[1]
  return 0
}
