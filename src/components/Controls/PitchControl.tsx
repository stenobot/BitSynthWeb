import { useSynthStore } from '../../store/synthStore'
import { getAudioEngine } from '../../App'
import { useEffect, useRef } from 'react'
import './PitchControl.css'

export function PitchControl() {
  const { masterPitch, setMasterPitch, pitchSnapEnabled } = useSynthStore()
  const sliderRef = useRef<HTMLInputElement>(null)
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

  const handlePointerUp = () => {
    const { pitchSnapEnabled: snapEnabled } = useSynthStore.getState()
    if (snapEnabled) {
      // Defer to the next animation frame so the browser fully releases its
      // internal touch-tracking state on the range input before we update the
      // value. Without this, mobile browsers ignore the programmatic value
      // change and the thumb doesn't visually snap back until the next
      // unrelated re-render.
      requestAnimationFrame(() => {
        justResetRef.current = true
        setMasterPitch(1.0)
        // Also set the DOM value directly as a belt-and-suspenders guarantee
        // in case React's batched re-render is still delayed.
        if (sliderRef.current) {
          sliderRef.current.value = '0'
        }
      })
    }
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
        onPointerUp={handlePointerUp}
        className="pitch-control__slider"
      />
      <span className="pitch-control__value">Pitch: {displayPitch}</span>
    </div>
  )
}
