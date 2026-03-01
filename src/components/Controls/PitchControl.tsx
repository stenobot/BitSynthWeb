import { useSynthStore } from '../../store/synthStore'
import { getAudioEngine } from '../../App'
import { useEffect, useRef } from 'react'
import './PitchControl.css'

export function PitchControl() {
  const { masterPitch, setMasterPitch, pitchSnapEnabled, setPitchSnapEnabled } = useSynthStore()
  const isDraggingRef = useRef(false)
  const justResetRef = useRef(false)
  const prevSnapEnabledRef = useRef(pitchSnapEnabled)

  useEffect(() => {
    const engine = getAudioEngine()
    if (!engine) return
    engine.setMasterPitch(masterPitch)
  }, [masterPitch])

  // When snap is turned ON and pitch is not normal, snap to normal
  useEffect(() => {
    if (!prevSnapEnabledRef.current && pitchSnapEnabled && masterPitch !== 1.0) {
      justResetRef.current = true
      setMasterPitch(1.0)
    }
    prevSnapEnabledRef.current = pitchSnapEnabled
  }, [pitchSnapEnabled, masterPitch, setMasterPitch])

  const handlePitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Ignore onChange if we just reset the pitch
    if (justResetRef.current) {
      justResetRef.current = false
      return
    }
    // Convert octave value to pitch multiplier (2^octaves)
    const octaves = Number(e.target.value)
    const pitch = Math.pow(2, octaves)
    setMasterPitch(pitch)
  }

  const handlePointerDown = () => {
    console.log('Pointer down - start dragging')
    isDraggingRef.current = true
  }

  const handlePointerUp = () => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false
      // Only snap if snapping is enabled
      if (pitchSnapEnabled) {
        justResetRef.current = true
        setMasterPitch(1.0)
        console.log('Pointer up - reset pitch to normal')
      }
    }
  }

  const handleToggleSnap = () => {
    setPitchSnapEnabled(!pitchSnapEnabled)
  }

  const semitones = Math.log2(masterPitch) * 12
  const displayPitch = semitones === 0 ? 'Normal' : `${semitones > 0 ? '+' : ''}${semitones.toFixed(1)}`

  return (
    <div className="pitch-control">
      <div className="pitch-control__button-row">
        <button 
          className={`pitch-control__snap-btn ${pitchSnapEnabled ? 'pitch-control__snap-btn--active' : ''}`}
          onClick={handleToggleSnap}
          title={pitchSnapEnabled ? 'Locking enabled' : 'Locking disabled'}
        >
          <img 
            src={pitchSnapEnabled ? '/images/lock.svg' : '/images/unlock.svg'}
            alt={pitchSnapEnabled ? 'Lock' : 'Unlock'}
            className="pitch-control__snap-icon"
          />
        </button>
        <span className="pitch-control__value">{displayPitch}</span>
      </div>
      <input
        type="range"
        min="-1"
        max="1"
        step="0.01"
        value={Math.log2(masterPitch)}
        onChange={handlePitchChange}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        className="pitch-control__slider"
      />
    </div>
  )
}
