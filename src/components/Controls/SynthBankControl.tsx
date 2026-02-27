import type { VolumeLevel, WaveformType, SynthBankState } from '../../types'
import {
  WAVEFORMS,
  SYNTH_FILTER_MIN, SYNTH_FILTER_MAX,
  SYNTH_FILTER_Q_MIN, SYNTH_FILTER_Q_MAX,
  SYNTH_ATTACK_MIN, SYNTH_ATTACK_MAX,
  SYNTH_RELEASE_MIN, SYNTH_RELEASE_MAX
} from '../../types'
import './SynthBankControl.css'

const BASE_URL = import.meta.env.BASE_URL

interface SynthBankControlProps {
  synthBank: SynthBankState
  onVolumeChange: (volume: VolumeLevel) => void
  onWaveformChange: (waveform: WaveformType) => void
  onFilterCutoffChange: (cutoff: number) => void
  onFilterQChange: (q: number) => void
  onAttackChange: (attack: number) => void
  onReleaseChange: (release: number) => void
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
  onWaveformChange,
  onFilterCutoffChange,
  onFilterQChange,
  onAttackChange,
  onReleaseChange
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

  const volumeSrc = synthBank.volume === 'off' ? `${BASE_URL}images/speaker-off.svg` : synthBank.volume === 'low' ? `${BASE_URL}images/speaker-low.svg` : `${BASE_URL}images/speaker-high.svg`

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
          <span className="synth-bank__control-label">Filter</span>
          <input
            type="range"
            min={SYNTH_FILTER_MIN}
            max={SYNTH_FILTER_MAX}
            value={synthBank.filterCutoff}
            onChange={(e) => onFilterCutoffChange(Number(e.target.value))}
            className="synth-bank__slider"
            disabled={synthBank.volume === 'off'}
          />
        </div>

        <div className="synth-bank__control">
          <span className="synth-bank__control-label">Res</span>
          <input
            type="range"
            min={SYNTH_FILTER_Q_MIN * 10}
            max={SYNTH_FILTER_Q_MAX * 10}
            value={synthBank.filterQ * 10}
            onChange={(e) => onFilterQChange(Number(e.target.value) / 10)}
            className="synth-bank__slider"
            disabled={synthBank.volume === 'off'}
          />
        </div>

        <div className="synth-bank__control">
          <span className="synth-bank__control-label">Attack</span>
          <input
            type="range"
            min={SYNTH_ATTACK_MIN * 100}
            max={SYNTH_ATTACK_MAX * 100}
            value={synthBank.attack * 100}
            onChange={(e) => onAttackChange(Number(e.target.value) / 100)}
            className="synth-bank__slider"
            disabled={synthBank.volume === 'off'}
          />
        </div>

        <div className="synth-bank__control">
          <span className="synth-bank__control-label">Release</span>
          <input
            type="range"
            min={SYNTH_RELEASE_MIN * 100}
            max={SYNTH_RELEASE_MAX * 100}
            value={synthBank.release * 100}
            onChange={(e) => onReleaseChange(Number(e.target.value) / 100)}
            className="synth-bank__slider"
            disabled={synthBank.volume === 'off'}
          />
        </div>
      </div>
    </div>
  )
}
