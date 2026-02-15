import type { VolumeLevel, WaveformType, SynthBankState } from '../../types'
import {
  WAVEFORMS,
  SYNTH_FILTER_MIN, SYNTH_FILTER_MAX,
  SYNTH_ATTACK_MIN, SYNTH_ATTACK_MAX,
  SYNTH_RELEASE_MIN, SYNTH_RELEASE_MAX,
  SYNTH_LENGTH_MIN, SYNTH_LENGTH_MAX
} from '../../types'
import './SynthBankControl.css'

interface SynthBankControlProps {
  synthBank: SynthBankState
  onVolumeChange: (volume: VolumeLevel) => void
  onLoopChange: (loop: boolean) => void
  onWaveformChange: (waveform: WaveformType) => void
  onFilterCutoffChange: (cutoff: number) => void
  onAttackChange: (attack: number) => void
  onReleaseChange: (release: number) => void
  onLengthChange: (length: number) => void
}

const VOLUME_CYCLE: VolumeLevel[] = ['off', 'high', 'low']

const WAVEFORM_LABELS: Record<WaveformType, string> = {
  sine: 'SIN',
  square: 'SQR',
  sawtooth: 'SAW',
  triangle: 'TRI'
}

export function SynthBankControl({
  synthBank,
  onVolumeChange,
  onLoopChange,
  onWaveformChange,
  onFilterCutoffChange,
  onAttackChange,
  onReleaseChange,
  onLengthChange
}: SynthBankControlProps) {
  const cycleVolume = () => {
    const currentIndex = VOLUME_CYCLE.indexOf(synthBank.volume)
    const nextIndex = (currentIndex + 1) % VOLUME_CYCLE.length
    onVolumeChange(VOLUME_CYCLE[nextIndex])
  }

  const cycleWaveform = () => {
    const currentIndex = WAVEFORMS.indexOf(synthBank.waveform)
    const nextIndex = (currentIndex + 1) % WAVEFORMS.length
    onWaveformChange(WAVEFORMS[nextIndex])
  }

  const volumeSrc = synthBank.volume === 'off' ? '/images/speaker-off.svg' : synthBank.volume === 'low' ? '/images/speaker-low.svg' : '/images/speaker-high.svg'

  return (
    <div className={`synth-bank ${synthBank.volume !== 'off' ? 'synth-bank--active' : ''}`}>
      <div className="synth-bank__buttons">
        <button
          className={`synth-bank__volume volume--${synthBank.volume}`}
          onClick={cycleVolume}
          title={`Volume: ${synthBank.volume}`}
        >
          <img src={volumeSrc} alt={`Volume: ${synthBank.volume}`} className="volume-icon" />
        </button>
        <button
          className={`synth-bank__loop ${synthBank.loop ? 'loop--active' : ''}`}
          onClick={() => onLoopChange(!synthBank.loop)}
          title={synthBank.loop ? 'Loop: On' : 'Loop: Off'}
          disabled={synthBank.volume === 'off'}
        >
          <img src="/images/loop.svg" alt="Loop" className="loop-icon" />
        </button>
        <button
          className="synth-bank__waveform"
          onClick={cycleWaveform}
          title={`Waveform: ${synthBank.waveform}`}
          disabled={synthBank.volume === 'off'}
        >
          {WAVEFORM_LABELS[synthBank.waveform]}
        </button>
      </div>

      <div className="synth-bank__controls">
        <div className="synth-bank__control">
          <input
            type="range"
            min={SYNTH_FILTER_MIN}
            max={SYNTH_FILTER_MAX}
            value={synthBank.filterCutoff}
            onChange={(e) => onFilterCutoffChange(Number(e.target.value))}
            className="synth-bank__slider"
            disabled={synthBank.volume === 'off'}
          />
          <span className="synth-bank__control-label">Filter</span>
        </div>

        <div className="synth-bank__control">
          <input
            type="range"
            min={SYNTH_ATTACK_MIN * 100}
            max={SYNTH_ATTACK_MAX * 100}
            value={synthBank.attack * 100}
            onChange={(e) => onAttackChange(Number(e.target.value) / 100)}
            className="synth-bank__slider"
            disabled={synthBank.volume === 'off'}
          />
          <span className="synth-bank__control-label">Attack</span>
        </div>

        <div className="synth-bank__control">
          <input
            type="range"
            min={SYNTH_RELEASE_MIN * 100}
            max={SYNTH_RELEASE_MAX * 100}
            value={synthBank.release * 100}
            onChange={(e) => onReleaseChange(Number(e.target.value) / 100)}
            className="synth-bank__slider"
            disabled={synthBank.volume === 'off'}
          />
          <span className="synth-bank__control-label">Release</span>
        </div>

        <div className="synth-bank__control">
          <input
            type="range"
            min={SYNTH_LENGTH_MIN * 100}
            max={SYNTH_LENGTH_MAX * 100}
            value={synthBank.length * 100}
            onChange={(e) => onLengthChange(Number(e.target.value) / 100)}
            className="synth-bank__slider"
            disabled={synthBank.volume === 'off' || synthBank.loop}
          />
          <span className="synth-bank__control-label">Length</span>
        </div>
      </div>
    </div>
  )
}
