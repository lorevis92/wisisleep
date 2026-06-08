export const config = { maxDuration: 30 }

const SUPABASE_URL = 'https://eqxuzkchjpbadxvgbqpf.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVxeHV6a2NoanBiYWR4dmdicXBmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkzMDY5NDUsImV4cCI6MjA5NDg4Mjk0NX0.gc-Iy1nkz68mGAaorqjzDYkOxlLijUJDGzK_XoNa7i8'

export default async function handler(req, res) {
  const { category, subcategory } = req.query
  if (!category) return res.status(200).json([])
  try {
    let url = `${SUPABASE_URL}/rest/v1/nature_sounds?category=eq.${encodeURIComponent(category)}&active=eq.true&limit=20&select=id,title,audio_url,image_url,category,subcategory`
    if (subcategory) url += `&subcategory=eq.${encodeURIComponent(subcategory)}`
    const response = await fetch(url, {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: 'Bearer ' + SUPABASE_ANON_KEY,
      }
    })
    const text = await response.text()
    if (!response.ok) return res.status(500).json({ error: text })
    const rows = JSON.parse(text)
    const sounds = (Array.isArray(rows) ? rows : []).map(s => ({
      id: s.id,
      title: s.title,
      audioUrl: s.audio_url,
      coverUrl: s.image_url,
      category: s.category,
      type: s.category === 'sleep-music' ? 'music' : 'sounds',
    }))
    res.status(200).json(sounds)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
}
