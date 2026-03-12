import { useLoopStore } from '../../store/loopStore'
import './LoopControls.css'

export function LoopControls() {
  const { recording, isRecording, isPlaying, countdown, startCountdown, stopRecording, togglePlayback } = useLoopStore()

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
    </div>
  )
}
