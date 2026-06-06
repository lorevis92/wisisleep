export const config = { maxDuration: 30 }

const SUPABASE_URL = 'https://eqxuzkchjpbadxvgbqpf.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVxeHV6a2NoanBiYWR4dmdicXBmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkzMDY5NDUsImV4cCI6MjA5NDg4Mjk0NX0.gc-Iy1nkz68mGAaorqjzDYkOxlLijUJDGzK_XoNa7i8'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  const q = (req.query.q || 'nature').toLowerCase()
  try {
    const url = `${SUPABASE_URL}/rest/v1/audiobooks?or=(title.ilike.*${encodeURIComponent(q)}*,author.ilike.*${encodeURIComponent(q)}*)&limit=24&select=id,title,author,description,language,genre,sections`
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': 'Bearer ' + SUPABASE_ANON_KEY,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      }
    })
    const text = await response.text()
    if (!response.ok) {
      return res.status(200).json({ debug: true, status: response.status, body: text })
    }
    const books = JSON.parse(text)
    return res.status(200).json(Array.isArray(books) ? books : [])
  } catch (e) {
    return res.status(200).json({ debug: true, error: e.message })
  }
}
