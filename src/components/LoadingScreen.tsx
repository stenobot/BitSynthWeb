import { useSynthStore } from '../store/synthStore'
import './LoadingScreen.css'

export function LoadingScreen() {
  const loadProgress = useSynthStore((state) => state.loadProgress)

  return (
    <div className="loading-screen">
      <div className="loading-content">
        <h1 className="loading-title">BitSynth</h1>
        <div className="loading-bar-container">
          <div
            className="loading-bar"
            style={{ width: `${loadProgress}%` }}
          />
        </div>
        <p className="loading-text">Loading samples... {loadProgress}%</p>
      </div>
    </div>
  )
}
