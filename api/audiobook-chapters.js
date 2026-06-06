const handler = async (req, res) => {
  const { id } = req.query
  if (!id) return res.status(400).json({ error: 'Missing id param' })
  try {
    const response = await fetch(`https://librivox.org/api/feed/audiobooks/?id=${encodeURIComponent(id)}&format=json&extended=1`)
    const data = await response.json()
    const book = (data.books || [])[0]
    if (!book) return res.status(404).json({ error: 'Book not found' })
    const sections = (book.sections || []).map(s => ({
      id: 'lv-sec-' + s.id,
      title: s.title,
      audioUrl: s.listen_url,
      duration: parseDuration(s.playtime),
    }))
    res.status(200).json(sections)
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

module.exports = handler
