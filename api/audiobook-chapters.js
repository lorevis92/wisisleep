export const config = { maxDuration: 30 }

export default async function handler(req, res) {
  const { id } = req.query
  if (!id) return res.status(200).json({ sections: [], coverUrl: null })
  try {
    const [lvResponse, olResponse] = await Promise.all([
      fetch(`https://librivox.org/api/feed/audiobooks/?id=${encodeURIComponent(id)}&format=json&extended=1`),
      fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(id)}&limit=1`),
    ])
    const data = await lvResponse.json()
    const book = (data.books || [])[0]
    if (!book) return res.status(200).json({ sections: [], coverUrl: null })

    let coverUrl = null
    try {
      const olData = await olResponse.json()
      const coverId = olData.docs?.[0]?.cover_i
      if (coverId) coverUrl = `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`
    } catch {}

    // Re-fetch Open Library with book title for better results
    try {
      const titleRes = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(book.title)}&limit=1`)
      const titleData = await titleRes.json()
      const coverId = titleData.docs?.[0]?.cover_i
      if (coverId) coverUrl = `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`
    } catch {}

    const sections = (book.sections || []).map(s => ({
      id: 'lv-sec-' + s.id,
      title: s.title,
      audioUrl: s.listen_url,
      duration: parseDuration(s.playtime),
    }))
    res.status(200).json({ sections, coverUrl })
  } catch (e) {
    res.status(200).json({ sections: [], coverUrl: null })
  }
}

function parseDuration(playtime) {
  if (!playtime) return 0
  const parts = playtime.split(':').map(Number)
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2]
  if (parts.length === 2) return parts[0] * 60 + parts[1]
  return 0
}
