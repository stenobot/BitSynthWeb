import type { VolumeLevel } from '../../types'
import './SoundBankControl.css'

const BASE_URL = import.meta.env.BASE_URL

interface SoundBankControlProps {
  label: string
  volume: VolumeLevel
  loop: boolean
  pitch: number
  onVolumeChange: (volume: VolumeLevel) => void
  onLoopChange: (loop: boolean) => void
  onPitchChange: (pitch: number) => void
}

const VOLUME_CYCLE: VolumeLevel[] = ['off', 'high', 'low']
const PITCH_VALUES = [0.5, 1.0, 1.5, 2.0]

export function SoundBankControl({
  label,
  volume,
  loop,
  pitch,
  onVolumeChange,
  onLoopChange,
  onPitchChange
}: SoundBankControlProps) {
  const cycleVolume = () => {
    const currentIndex = VOLUME_CYCLE.indexOf(volume)
    const nextIndex = (currentIndex + 1) % VOLUME_CYCLE.length
    onVolumeChange(VOLUME_CYCLE[nextIndex])
  }

  const volumeSrc = volume === 'off' ? `${BASE_URL}images/speaker-off.svg` : volume === 'low' ? `${BASE_URL}images/speaker-low.svg` : `${BASE_URL}images/speaker-high.svg`

  return (
    <div className={`sound-bank ${volume !== 'off' ? 'sound-bank--active' : ''}`}>
      <div className="sound-bank__label">{label}</div>

      <button
        className={`sound-bank__volume volume--${volume}`}
        onClick={cycleVolume}
        title={`Volume: ${volume}`}
      >
        <img src={volumeSrc} alt={`Volume: ${volume}`} className="volume-icon" />
      </button>

      <button
        className={`sound-bank__loop ${loop ? 'loop--active' : ''}`}
        onClick={() => onLoopChange(!loop)}
        title={loop ? 'Loop: On' : 'Loop: Off'}
        disabled={volume === 'off'}
      >
        <img src={`${BASE_URL}images/loop.svg`} alt="Loop" className="loop-icon" />
      </button>

      <div className="sound-bank__pitch">
        <input
          type="range"
          min="0"
          max="3"
          value={PITCH_VALUES.indexOf(pitch)}
          onChange={(e) => onPitchChange(PITCH_VALUES[Number(e.target.value)])}
          className="pitch-slider"
          disabled={volume === 'off'}
        />
        <span className="pitch-value">{pitch}x</span>
      </div>
    </div>
  )
}
