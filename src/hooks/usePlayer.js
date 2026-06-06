import { useState, useRef, useEffect, useCallback } from 'react'

export function usePlayer() {
  const audioRef = useRef(null)
  const timerRef = useRef(null)
  const fadeRef = useRef(null)
  const queueRef = useRef([])

  const [currentTrack, setCurrentTrack] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolumeState] = useState(0.8)
  const [sleepTimer, setSleepTimer] = useState(0) // minutes
  const [timeLeft, setTimeLeft] = useState(0) // seconds
  const [isFading, setIsFading] = useState(false)
  const [queue, setQueue] = useState([])

  // Init audio element
  useEffect(() => {
    const audio = new Audio()
    audio.volume = 0.8
    audioRef.current = audio

    audio.addEventListener('timeupdate', () => {
      setProgress(audio.currentTime)
    })
    audio.addEventListener('loadedmetadata', () => {
      setDuration(audio.duration)
    })
    audio.addEventListener('ended', () => {
      if (queueRef.current.length > 0) {
        const [next, ...rest] = queueRef.current
        queueRef.current = rest
        setQueue(rest)
        audio.src = next.audioUrl
        audio.play().catch(e => console.warn('Play error:', e))
        setCurrentTrack(next)
        setProgress(0)
      } else {
        setIsPlaying(false)
      }
    })
    audio.addEventListener('play', () => setIsPlaying(true))
    audio.addEventListener('pause', () => setIsPlaying(false))

    return () => {
      audio.pause()
      audio.src = ''
      clearInterval(timerRef.current)
      clearInterval(fadeRef.current)
    }
  }, [])

  const playTrack = useCallback((track) => {
    const audio = audioRef.current
    if (!audio || !track?.audioUrl) return

    audio.src = track.audioUrl
    audio.volume = volume
    audio.play().catch(e => console.warn('Play error:', e))
    setCurrentTrack(track)
    setProgress(0)
  }, [volume])

  const togglePlay = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    if (audio.paused) audio.play().catch(console.warn)
    else audio.pause()
  }, [])

  const seek = useCallback((seconds) => {
    const audio = audioRef.current
    if (!audio) return
    audio.currentTime = seconds
    setProgress(seconds)
  }, [])

  const setVolume = useCallback((val) => {
    const audio = audioRef.current
    if (!audio) return
    audio.volume = val
    setVolumeState(val)
  }, [])

  useEffect(() => { queueRef.current = queue }, [queue])

  // Sleep timer
  const startTimer = useCallback((minutes) => {
    clearInterval(timerRef.current)
    clearInterval(fadeRef.current)
    setIsFading(false)

    if (!minutes) {
      setSleepTimer(0)
      setTimeLeft(0)
      return
    }

    setSleepTimer(minutes)
    const totalSeconds = minutes * 60
    setTimeLeft(totalSeconds)

    const FADE_START = 120 // start fading 2 min before end
    const originalVolume = audioRef.current?.volume || volume

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        const next = prev - 1
        if (next <= 0) {
          clearInterval(timerRef.current)
          audioRef.current?.pause()
          setIsPlaying(false)
          setSleepTimer(0)
          setIsFading(false)
          if (audioRef.current) audioRef.current.volume = originalVolume
          return 0
        }

        // Start fade
        if (next <= FADE_START && !isFading) {
          setIsFading(true)
        }
        if (next <= FADE_START && audioRef.current) {
          const fadeProgress = (FADE_START - next) / FADE_START
          audioRef.current.volume = Math.max(0, originalVolume * (1 - fadeProgress))
        }

        return next
      })
    }, 1000)
  }, [volume, isFading])

  const cancelTimer = useCallback(() => {
    clearInterval(timerRef.current)
    setSleepTimer(0)
    setTimeLeft(0)
    setIsFading(false)
    if (audioRef.current) audioRef.current.volume = volume
  }, [volume])

  const addToQueue = useCallback((track) => {
    setQueue(prev => {
      const updated = [...prev, track]
      queueRef.current = updated
      return updated
    })
  }, [])

  return {
    currentTrack,
    isPlaying,
    progress,
    duration,
    volume,
    sleepTimer,
    timeLeft,
    isFading,
    queue,
    playTrack,
    togglePlay,
    seek,
    setVolume,
    startTimer,
    cancelTimer,
    addToQueue,
  }
}
