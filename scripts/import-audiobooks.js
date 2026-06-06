import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://eqxuzkchjpbadxvgbqpf.supabase.co'
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVxeHV6a2NoanBiYWR4dmdicXBmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTMwNjk0NSwiZXhwIjoyMDk0ODgyOTQ1fQ.HmIh6osJu6_jQIwgvZ6S2vEiWC-EHR8NOTvhs0suBVc'

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

function parseDuration(playtime) {
  if (!playtime) return 0
  const parts = playtime.split(':').map(Number)
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2]
  if (parts.length === 2) return parts[0] * 60 + parts[1]
  return 0
}

async function importBooks() {
  let offset = 0
  let total = 0
  while (true) {
    console.log(`Fetching offset ${offset}...`)
    const res = await fetch(`https://librivox.org/api/feed/audiobooks/?format=json&extended=1&limit=50&offset=${offset}`)
    const data = await res.json()
    const books = data.books || []
    if (books.length === 0) break
    const rows = books.map(b => ({
      id: 'lv-' + b.id,
      title: b.title || '',
      author: b.authors?.[0] ? (b.authors[0].first_name + ' ' + b.authors[0].last_name).trim() : 'Unknown',
      language: b.language || '',
      description: (b.description || '').replace(/<[^>]*>/g, '').slice(0, 300),
      genre: b.genres?.[0]?.name || '',
      sections: (b.sections || []).map(s => ({
        id: 'lv-sec-' + s.id,
        title: s.title,
        audioUrl: s.listen_url,
        duration: parseDuration(s.playtime)
      }))
    }))
    const { error } = await supabase.from('audiobooks').upsert(rows)
    if (error) console.error('Supabase error:', error.message)
    total += books.length
    console.log(`Imported offset ${offset}, total: ${total}`)
    offset += 50
    await new Promise(r => setTimeout(r, 1000))
  }
  console.log('Done! Total imported:', total)
}

importBooks()
