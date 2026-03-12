import { useState, useEffect, useRef } from 'react'
import { useSynthStore } from '../../store/synthStore'
import { Visualizer } from './Visualizer'
import { APP_VERSION } from '../../version'
import './DisplayScreen.css'

export function DisplayScreen() {
  const displayMessage = useSynthStore((state) => state.displayMessage)
  const [showIntro, setShowIntro] = useState(true)
  const initialMessage = useRef(displayMessage)

  // Auto-dismiss intro after 4 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowIntro(false), 4000)
    return () => clearTimeout(timer)
  }, [])

  // Dismiss intro immediately when displayMessage changes
  useEffect(() => {
    if (displayMessage !== initialMessage.current) {
      setShowIntro(false)
    }
  }, [displayMessage])

  return (
    <div className="display-screen">
      {showIntro ? (
        <span className="display-screen__text display-screen__text--intro">
          BitSynth v{APP_VERSION}
        </span>
      ) : (
        <span className="display-screen__text">
          {displayMessage}
        </span>
      )}
      <div className="display-screen__visualizer-container">
        <Visualizer />
      </div>
    </div>
  )
}
