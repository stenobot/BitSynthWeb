import { useLoopStore } from '../../store/loopStore'
import { useSynthStore } from '../../store/synthStore'
import './LoopControls.css'

export function LoopControls() {
  const { recording, isRecording, isPlaying, countdown, startCountdown, stopRecording, togglePlayback } = useLoopStore()
  const setShowSettingsPanel = useSynthStore((s) => s.setShowSettingsPanel)

  const handleRecordClick = () => {
    if (isRecording) {
      stopRecording()
    } else if (countdown === null) {
      startCountdown()
    }
  }

  const canPlay = recording !== null && !isRecording && countdown === null

  return (
    <div className="loop-controls">
      <button
        className={`loop-controls__btn ${isRecording ? 'loop-controls__btn--recording' : ''} ${countdown !== null ? 'loop-controls__btn--countdown' : ''}`}
        onClick={handleRecordClick}
        title={isRecording ? 'Stop recording' : 'Record loop'}
        disabled={countdown !== null}
      >
        <svg width="14" height="14" viewBox="0 0 14 14">
          <circle cx="7" cy="7" r="6" fill="currentColor" />
        </svg>
      </button>
      <button
        className={`loop-controls__btn ${isPlaying ? 'loop-controls__btn--playing' : ''}`}
        onClick={togglePlayback}
        title={isPlaying ? 'Pause loop' : 'Play loop'}
        disabled={!canPlay}
      >
        {isPlaying ? (
          <svg width="14" height="14" viewBox="0 0 14 14">
            <rect x="2" y="1" width="3.5" height="12" rx="1" fill="currentColor" />
            <rect x="8.5" y="1" width="3.5" height="12" rx="1" fill="currentColor" />
          </svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 14 14">
            <polygon points="2,1 2,13 13,7" fill="currentColor" />
          </svg>
        )}
      </button>
      <button
        className="loop-controls__btn"
        onClick={() => setShowSettingsPanel(true)}
        title="Settings"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="18" height="18" fill="white" aria-label="Settings">
          <path fillRule="evenodd" d="M60.1,88.7c-0.1,0-0.3,0-0.4,0c-2.1-0.4-4-1.8-5-3.7c-0.1-0.1-0.1-0.2-0.2-0.3c-0.1-0.2-0.9-1.7-3.2-1.8c0,0-0.1,0-0.1,0  c-0.8,0-1.5,0-2.3,0c0,0-0.1,0-0.1,0c-2.4,0-3.2,1.7-3.2,1.8c-0.1,0.1-0.1,0.2-0.2,0.3c-1,1.9-2.9,3.3-5,3.7c-0.3,0.1-0.6,0.1-0.9,0  c-1.9-0.5-3.9-1.2-5.7-2.1c-0.3-0.1-0.5-0.3-0.7-0.5c-1.3-1.7-1.9-4-1.4-6.1c0-0.1,0-0.2,0.1-0.4c0-0.2,0.4-1.9-1.3-3.4  c0,0-0.1-0.1-0.1-0.1c-0.6-0.5-1.2-1-1.8-1.5c0,0,0,0,0,0c-0.8-0.6-1.6-0.9-2.5-0.9c-0.7,0-1.2,0.2-1.2,0.2  c-0.1,0.1-0.2,0.1-0.4,0.1c-2,0.8-4.4,0.7-6.3-0.4c-0.3-0.1-0.5-0.3-0.6-0.6c-1.1-1.6-2.1-3.3-3-5.1c-0.1-0.3-0.2-0.5-0.2-0.8  c0-2.2,1.1-4.4,2.8-5.7c0.1-0.1,0.2-0.2,0.3-0.2c0.1-0.1,1.5-1.2,1.2-3.5c0,0,0,0,0-0.1c-0.2-0.7-0.3-1.5-0.4-2.3c0-0.1,0-0.1,0-0.1  c-0.4-2.3-2.3-2.8-2.3-2.8c-0.1,0-0.2-0.1-0.4-0.1c-2.1-0.7-3.9-2.4-4.6-4.5c-0.1-0.3-0.1-0.5-0.1-0.8c0.2-1.8,0.5-3.7,1-5.6  c0.1-0.3,0.2-0.5,0.4-0.7c1.5-1.8,3.7-2.8,5.9-2.7c0.1,0,0.2,0,0.4,0c0.5,0,2.1-0.1,3.1-1.9c0,0,0-0.1,0.1-0.1  c0.3-0.6,0.7-1.3,1.2-2c0,0,0-0.1,0.1-0.1c1.1-2,0.2-3.5,0.1-3.7c-0.1-0.1-0.1-0.2-0.2-0.3c-1.2-2-1.5-4.4-0.6-6.6  c0.1-0.2,0.2-0.5,0.4-0.7c1.3-1.3,2.7-2.5,4.2-3.5c0.2-0.2,0.5-0.3,0.7-0.3c2.3-0.5,4.7,0.2,6.4,1.7c0.1,0.1,0.2,0.1,0.3,0.2  c0,0,0.9,0.8,2.2,0.8c0.4,0,0.9-0.1,1.4-0.2c0,0,0,0,0,0c0.8-0.3,1.6-0.6,2.3-0.8c2.1-0.8,2.4-2.6,2.4-2.8c0-0.1,0-0.2,0.1-0.3  c0.3-2.3,1.7-4.4,3.8-5.5c0.2-0.1,0.5-0.2,0.7-0.2c2-0.1,3.4-0.1,5.4,0c0.3,0,0.5,0.1,0.7,0.2c2.1,1.1,3.5,3.1,3.8,5.4  c0,0.1,0.1,0.2,0.1,0.4c0,0.2,0.3,1.9,2.4,2.8c0,0,0,0,0,0c0.8,0.2,1.6,0.5,2.3,0.8c0,0,0,0,0,0c0.5,0.2,1,0.3,1.4,0.3  c1.4,0,2.2-0.8,2.2-0.8c0.1-0.1,0.2-0.2,0.3-0.2c1.7-1.5,4.1-2.2,6.4-1.7c0.3,0.1,0.5,0.2,0.7,0.3c1.5,1.1,2.9,2.3,4.2,3.5  c0.2,0.2,0.3,0.4,0.4,0.7c0.8,2.2,0.6,4.6-0.6,6.6c0,0.1-0.1,0.2-0.2,0.3c-0.1,0.1-1,1.7,0.1,3.7c0,0,0,0.1,0.1,0.1  c0.4,0.7,0.8,1.3,1.2,2c0,0,0,0.1,0.1,0.1c1,1.7,2.6,1.9,3.1,1.9c0.1,0,0.3,0,0.4,0c2.2-0.1,4.5,0.9,5.9,2.7  c0.2,0.2,0.3,0.5,0.4,0.7c0.5,1.8,0.8,3.7,1,5.6c0,0.3,0,0.5-0.1,0.8c-0.8,2.2-2.5,3.8-4.6,4.5c-0.1,0.1-0.2,0.1-0.4,0.1  c-0.2,0-1.9,0.6-2.3,2.9c0,0,0,0.1,0,0.1c-0.1,0.8-0.2,1.6-0.4,2.3c0,0,0,0.1,0,0.1C81,59.9,82.5,61,82.5,61  c0.1,0.1,0.2,0.2,0.3,0.3c1.7,1.4,2.8,3.5,2.8,5.7c0,0.3-0.1,0.6-0.2,0.8c-0.8,1.7-1.8,3.5-3,5.1c-0.2,0.2-0.4,0.4-0.6,0.6  c-1.1,0.6-2.3,0.9-3.6,0.9l0,0c-0.9,0-1.9-0.2-2.7-0.5c-0.1,0-0.2-0.1-0.4-0.1c0,0,0,0,0,0c0,0-0.5-0.2-1.2-0.2  c-0.9,0-1.7,0.3-2.4,0.9c0,0,0,0-0.1,0c-0.5,0.5-1.1,1-1.8,1.5c0,0-0.1,0-0.1,0.1c-1.5,1.3-1.5,2.7-1.4,3.3c0.1,0.2,0.1,0.4,0.1,0.6  c0,0,0,0,0,0c0.4,2.1-0.1,4.3-1.5,5.9c-0.2,0.2-0.4,0.4-0.7,0.5c-1.8,0.8-3.8,1.5-5.7,2.1C60.4,88.7,60.2,88.7,60.1,88.7z M50,41 A9,9 0 1 0 50,59 A9,9 0 1 0 50,41 Z" />
        </svg>
      </button>
    </div>
  )
}
