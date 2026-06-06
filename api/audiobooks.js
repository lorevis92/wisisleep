export const config = { maxDuration: 30 }

const SUPABASE_URL = 'https://eqxuzkchjpbadxvgbqpf.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVxeHV6a2NoanBiYWR4dmdicXBmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkzMDY5NDUsImV4cCI6MjA5NDg4Mjk0NX0.gc-Iy1nkz68mGAaorqjzDYkOxlLijUJDGzK_XoNa7i8'

export default async function handler(req, res) {
  const q = (req.query.q || 'nature').toLowerCase()
  try {
    const url = `${SUPABASE_URL}/rest/v1/audiobooks?or=(title.ilike.*${encodeURIComponent(q)}*,author.ilike.*${encodeURIComponent(q)}*)&limit=24&select=id,title,author,description,language,genre,sections`
    const response = await fetch(url, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': 'Bearer ' + SUPABASE_ANON_KEY,
      }
    })
    const text = await response.text()
    if (!response.ok) return res.status(500).json({ error: text })
    const rows = JSON.parse(text)
    const books = (Array.isArray(rows) ? rows : []).map(book => ({
      id: book.id,
      title: book.title,
      author: book.author,
      description: book.description,
      language: book.language,
      genre: book.genre,
      type: 'audiobook',
      coverUrl: null,
      tags: [],
      librivoxId: book.id?.replace('lv-', '') || '',
    }))
    res.status(200).json(books)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
}
