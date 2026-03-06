import { useState, useEffect, useRef } from 'react'
import { useSynthStore } from '../../store/synthStore'
import { Visualizer } from './Visualizer'
import { APP_VERSION } from '../../version'
import './DisplayScreen.css'

export function DisplayScreen() {
  const displayMessage = useSynthStore((state) => state.displayMessage)
  const [showIntro, setShowIntro] = useState(true)
  const introRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = introRef.current
    if (!el) return

    const handleAnimationEnd = () => {
      setShowIntro(false)
    }

    el.addEventListener('animationend', handleAnimationEnd)
    return () => el.removeEventListener('animationend', handleAnimationEnd)
  }, [])

  return (
    <div className="display-screen">
      {showIntro ? (
        <span ref={introRef} className="display-screen__text display-screen__text--intro">
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
