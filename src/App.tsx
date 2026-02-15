import { useEffect, useState } from 'react'
import { useSynthStore } from './store/synthStore'
import { AudioEngine } from './audio/AudioEngine'
import { Keyboard } from './components/Keyboard/Keyboard'
import { ControlPanel } from './components/Controls/ControlPanel'
import { LoadingScreen } from './components/LoadingScreen'
import './styles/App.css'

// Global audio engine instance
let audioEngine: AudioEngine | null = null

export function getAudioEngine(): AudioEngine | null {
  return audioEngine
}

function App() {
  const [isReady, setIsReady] = useState(false)
  const { isLoading, setLoading, setLoadProgress } = useSynthStore()

  // Disable right-click context menu for the entire app
  useEffect(() => {
    const preventContextMenu = (e: MouseEvent) => {
      e.preventDefault()
    }
    document.addEventListener('contextmenu', preventContextMenu)
    return () => {
      document.removeEventListener('contextmenu', preventContextMenu)
    }
  }, [])

  useEffect(() => {
    const initAudio = async () => {
      try {
        audioEngine = new AudioEngine()
        await audioEngine.initialize((loaded, total) => {
          setLoadProgress(Math.round((loaded / total) * 100))
        })
        setLoading(false)
        setIsReady(true)
      } catch (error) {
        console.error('Failed to initialize audio:', error)
      }
    }

    initAudio()

    return () => {
      if (audioEngine) {
        audioEngine.dispose()
        audioEngine = null
      }
    }
  }, [setLoading, setLoadProgress])

  if (isLoading || !isReady) {
    return <LoadingScreen />
  }

  return (
    <div className="app">
      <ControlPanel />
      <Keyboard />
    </div>
  )
}

export default App
