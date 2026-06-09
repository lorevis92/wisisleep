import { useRef, useEffect } from 'react'

const STORAGE_KEY = 'wisisleep_sleep_log'
const MAX_DAYS = 30

export function getLog() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch {
    return []
  }
}

function saveLog(log) {
  const cutoff = Date.now() - MAX_DAYS * 24 * 60 * 60 * 1000
  const trimmed = log.filter(s => (s.session_start || 0) >= cutoff)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed))
}

function toDateStr(ts) {
  return new Date(ts).toISOString().slice(0, 10)
}

export function useSleepTracker() {
  const sessionRef = useRef(null)
  const lastInteractionRef = useRef(Date.now())

  useEffect(() => {
    const handleInteraction = () => {
      const now = Date.now()
      if (now - lastInteractionRef.current >= 60000) {
        lastInteractionRef.current = now
        if (sessionRef.current) {
          sessionRef.current.last_interaction = now
        }
      }
    }

    const handleVisibility = () => {
      const now = Date.now()
      if (document.hidden) {
        if (sessionRef.current) {
          sessionRef.current.screen_off = now
        }
      } else {
        if (sessionRef.current?.screen_off) {
          const durationMinutes = Math.round((now - sessionRef.current.screen_off) / 60000)
          sessionRef.current.screen_on = now
          sessionRef.current.duration_minutes = durationMinutes
          sessionRef.current.estimated_sleep = new Date(sessionRef.current.screen_off).toISOString()
          sessionRef.current.estimated_wake = new Date(now).toISOString()

          if (durationMinutes >= 60) {
            const session = {
              ...sessionRef.current,
              date: toDateStr(sessionRef.current.screen_off),
              valid: true,
            }
            const log = getLog()
            const idx = log.findIndex(s => s.date === session.date)
            if (idx !== -1) {
              log[idx] = session
            } else {
              log.push(session)
            }
            saveLog(log)
          }

          sessionRef.current.screen_off = null
        }
      }
    }

    document.addEventListener('click', handleInteraction)
    document.addEventListener('touchstart', handleInteraction)
    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      document.removeEventListener('click', handleInteraction)
      document.removeEventListener('touchstart', handleInteraction)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [])

  const startSession = (trackTitle) => {
    const now = Date.now()
    sessionRef.current = {
      date: toDateStr(now),
      session_start: now,
      last_interaction: now,
      screen_off: null,
      screen_on: null,
      estimated_sleep: null,
      estimated_wake: null,
      duration_minutes: 0,
      track_title: trackTitle || '',
      valid: false,
    }
  }

  const endSession = () => {
    sessionRef.current = null
  }

  return { startSession, endSession, getLog }
}
