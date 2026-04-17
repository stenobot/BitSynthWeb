import { useSynthStore } from '../../store/synthStore'
import { getAudioEngine } from '../../App'
import { useEffect, useRef } from 'react'
import './PitchControl.css'

export function PitchControl() {
  const { masterPitch, setMasterPitch, pitchSnapEnabled } = useSynthStore()
  const sliderRef = useRef<HTMLInputElement>(null)
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
    justResetRef.current = false
    isDraggingRef.current = true
    const onPointerUp = () => {
      if (!isDraggingRef.current) return
      isDraggingRef.current = false
      const { pitchSnapEnabled: snapEnabled } = useSynthStore.getState()
      if (snapEnabled) {
        justResetRef.current = true
        setMasterPitch(1.0)
        // On mobile, the browser retains internal touch-tracking state on the
        // range input even after pointerup fires. This causes it to ignore both
        // React's controlled value update and direct DOM writes until the touch
        // cycle fully completes. Deferring to the next animation frame ensures
        // the browser has released control before we force the visual snap.
        requestAnimationFrame(() => {
          if (sliderRef.current) {
            sliderRef.current.value = '0'
          }
        })
      }
    }
    window.addEventListener('pointerup', onPointerUp, { once: true })
  }

  const semitones = Math.log2(masterPitch) * 12
  const displayPitch = semitones === 0 ? 'Normal' : `${semitones > 0 ? '+' : ''}${semitones.toFixed(1)}`

  return (
    <div className="pitch-control">
      <input
        ref={sliderRef}
        type="range"
        min="-1"
        max="1"
        step="0.01"
        value={Math.log2(masterPitch)}
        onChange={handlePitchChange}
        onPointerDown={handlePointerDown}
        className="pitch-control__slider"
      />
      <span className="pitch-control__value">Pitch: {displayPitch}</span>
    </div>
  )
}
