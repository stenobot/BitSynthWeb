import type { EchoState, ReverbState } from '../../types'
import {
  ECHO_DELAY_MIN, ECHO_DELAY_MAX,
  ECHO_FEEDBACK_MIN, ECHO_FEEDBACK_MAX,
  REVERB_DECAY_MIN, REVERB_DECAY_MAX,
  REVERB_DENSITY_MIN, REVERB_DENSITY_MAX,
  REVERB_GAIN_MIN, REVERB_GAIN_MAX
} from '../../types'
import './EffectsPanel.css'

interface EffectsPanelProps {
  echo: EchoState
  reverb: ReverbState
  onEchoEnabledChange: (enabled: boolean) => void
  onEchoDelayChange: (delay: number) => void
  onEchoFeedbackChange: (feedback: number) => void
  onReverbEnabledChange: (enabled: boolean) => void
  onReverbDecayChange: (decay: number) => void
  onReverbDensityChange: (density: number) => void
  onReverbGainChange: (gain: number) => void
}

export function EffectsPanel({
  echo,
  reverb,
  onEchoEnabledChange,
  onEchoDelayChange,
  onEchoFeedbackChange,
  onReverbEnabledChange,
  onReverbDecayChange,
  onReverbDensityChange,
  onReverbGainChange
}: EffectsPanelProps) {
  return (
    <div className="effects-panel">
      {/* Echo Effect */}
      <div className={`effect ${echo.enabled ? 'effect--active' : ''}`}>
        <button
          className={`effect__toggle ${echo.enabled ? 'effect__toggle--active' : ''}`}
          onClick={() => onEchoEnabledChange(!echo.enabled)}
        >
          Delay
        </button>

        <div className="effect__params">
          <div className="effect__param">
            <label>Time</label>
            <input
              type="range"
              min={ECHO_DELAY_MIN}
              max={ECHO_DELAY_MAX}
              value={echo.delay}
              onChange={(e) => onEchoDelayChange(Number(e.target.value))}
              disabled={!echo.enabled}
            />
          </div>
          <div className="effect__param">
            <label>Feedback</label>
            <input
              type="range"
              min={ECHO_FEEDBACK_MIN * 100}
              max={ECHO_FEEDBACK_MAX * 100}
              value={echo.feedback * 100}
              onChange={(e) => onEchoFeedbackChange(Number(e.target.value) / 100)}
              disabled={!echo.enabled}
            />
          </div>
        </div>
      </div>

      {/* Reverb Effect */}
      <div className={`effect ${reverb.enabled ? 'effect--active' : ''}`}>
        <button
          className={`effect__toggle ${reverb.enabled ? 'effect__toggle--active' : ''}`}
          onClick={() => onReverbEnabledChange(!reverb.enabled)}
        >
          Reverb
        </button>

        <div className="effect__params">
          <div className="effect__param">
            <label>Decay</label>
            <input
              type="range"
              min={REVERB_DECAY_MIN}
              max={REVERB_DECAY_MAX}
              value={reverb.decayTime}
              onChange={(e) => onReverbDecayChange(Number(e.target.value))}
              disabled={!reverb.enabled}
            />
          </div>
          <div className="effect__param">
            <label>Density</label>
            <input
              type="range"
              min={REVERB_DENSITY_MIN}
              max={REVERB_DENSITY_MAX}
              value={reverb.density}
              onChange={(e) => onReverbDensityChange(Number(e.target.value))}
              disabled={!reverb.enabled}
            />
          </div>
          <div className="effect__param">
            <label>Gain</label>
            <input
              type="range"
              min={REVERB_GAIN_MIN}
              max={REVERB_GAIN_MAX}
              value={reverb.gain}
              onChange={(e) => onReverbGainChange(Number(e.target.value))}
              disabled={!reverb.enabled}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
