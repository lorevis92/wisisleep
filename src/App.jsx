import { useState } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import AudioPlayer from './components/AudioPlayer'
import Discover from './pages/Discover'
import Player from './pages/Player'
import Library from './pages/Library'
import { usePlayer } from './hooks/usePlayer'
import { useLibrary } from './hooks/useLibrary'

export default function App() {
  const [activeTab, setActiveTab] = useState(
    () => localStorage.getItem('wisisleep_tab') || 'discover'
  )

  const {
    currentTrack, isPlaying, progress, duration,
    volume, sleepTimer, timeLeft, isFading,
    playTrack, togglePlay, seek, setVolume,
    startTimer, cancelTimer, addToQueue,
  } = usePlayer()

  const { library, addToLibrary, removeFromLibrary, isInLibrary, clearLibrary } = useLibrary()

  const handleSave = (track) => {
    if (isInLibrary(track.id)) removeFromLibrary(track.id)
    else addToLibrary(track)
  }

  const handleTabChange = (tab) => {
    setActiveTab(tab)
    localStorage.setItem('wisisleep_tab', tab)
  }

  const handlePlay = (track) => {
    playTrack(track)
    handleTabChange('player')
  }

  const handleGoodnightMode = async () => {
    try {
      const res = await fetch('/api/nature-sounds?category=rain')
      const data = await res.json()
      const sounds = Array.isArray(data) ? data : []
      if (sounds.length > 0) {
        const random = sounds[Math.floor(Math.random() * sounds.length)]
        playTrack(random)
        startTimer(30)
      }
    } catch (e) {
      console.error('Goodnight mode error:', e)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar activeTab={activeTab} onTabChange={handleTabChange} onGoodnightMode={handleGoodnightMode} />

      <main style={{ flex: 1, paddingBottom: currentTrack ? 100 : 0 }}>
        {activeTab === 'discover' && (
          <Discover
            onPlay={handlePlay}
            currentTrack={currentTrack}
            onSave={handleSave}
            isInLibrary={isInLibrary}
            addToQueue={addToQueue}
          />
        )}
        {activeTab === 'player' && (
          <Player
            currentTrack={currentTrack}
            isPlaying={isPlaying}
            progress={progress}
            duration={duration}
            volume={volume}
            sleepTimer={sleepTimer}
            timeLeft={timeLeft}
            isFading={isFading}
            onTogglePlay={togglePlay}
            onSeek={seek}
            onVolume={setVolume}
            onStartTimer={startTimer}
            onCancelTimer={cancelTimer}
            onPlay={handlePlay}
            onChapterPlay={handlePlay}
          />
        )}
        {activeTab === 'library' && (
          <Library
            library={library}
            onPlay={handlePlay}
            currentTrack={currentTrack}
            onSave={handleSave}
            isInLibrary={isInLibrary}
            onClear={clearLibrary}
          />
        )}
      </main>

      <Footer />

      <AudioPlayer
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        progress={progress}
        duration={duration}
        volume={volume}
        sleepTimer={sleepTimer}
        timeLeft={timeLeft}
        isFading={isFading}
        onTogglePlay={togglePlay}
        onSeek={seek}
        onVolume={setVolume}
        onStartTimer={startTimer}
        onCancelTimer={cancelTimer}
        onTabChange={handleTabChange}
      />
    </div>
  )
}
