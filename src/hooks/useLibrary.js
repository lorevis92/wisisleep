import { useState, useEffect } from 'react'

const STORAGE_KEY = 'wisisleep_library'

export function useLibrary() {
  const [library, setLibrary] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(library))
  }, [library])

  const addToLibrary = (track) => {
    setLibrary(prev => {
      if (prev.find(t => t.id === track.id)) return prev
      return [track, ...prev]
    })
  }

  const removeFromLibrary = (id) => {
    setLibrary(prev => prev.filter(t => t.id !== id))
  }

  const isInLibrary = (id) => library.some(t => t.id === id)

  const clearLibrary = () => setLibrary([])

  return { library, addToLibrary, removeFromLibrary, isInLibrary, clearLibrary }
}
