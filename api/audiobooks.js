export const config = { maxDuration: 30 }

const SUPABASE_URL = 'https://eqxuzkchjpbadxvgbqpf.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVxeHV6a2NoanBiYWR4dmdicXBmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkzMDY5NDUsImV4cCI6MjA5NDg4Mjk0NX0.eiw2BjSMHDyVuCOIYBhMTD1qZiOdLuumBt7ouPtKBaA'

export default async function handler(req, res) {
  const q = (req.query.q || 'nature').toLowerCase()
  try {
    const url = `${SUPABASE_URL}/rest/v1/audiobooks?or=(title.ilike.*${q}*,author.ilike.*${q}*)&limit=24&select=id,title,author,description,language,genre,sections`
    const response = await fetch(url, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      }
    })
    const text = await response.text()
    console.log('Status:', response.status, 'Body:', text.slice(0, 200))
    if (!response.ok) {
      res.status(500).json({ error: text })
      return
    }
    const books = JSON.parse(text)
    res.status(200).json(Array.isArray(books) ? books : [])
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
}
