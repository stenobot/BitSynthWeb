import { useEffect } from 'react'
import { useSynthStore } from '../../store/synthStore'
import { getAudioEngine } from '../../App'
import { DisplayScreen } from './DisplayScreen'
import { Visualizer } from './Visualizer'
import { PresetSelector } from './PresetSelector'
import { SoundBankControl } from './SoundBankControl'
import { SynthBankControl } from './SynthBankControl'
import { EffectsPanel } from './EffectsPanel'
import { SOUND_BANKS } from '../../types'
import type { SoundBankId } from '../../types'
import './ControlPanel.css'

const BANK_LABELS: Record<SoundBankId, string> = {
  p1: 'P1',
  p2: 'P2',
  w1: 'W1',
  w2: 'W2'
}

export function ControlPanel() {
  const {
    masterVolume,
    setMasterVolume,
    soundBanks,
    setSoundBankVolume,
    setSoundBankPitch,
    synthBank,
    setSynthBankVolume,
    setSynthBankWaveform,
    setSynthBankFilterCutoff,
    setSynthBankFilterQ,
    setSynthBankAttack,
    setSynthBankRelease,
    effects,
    setEchoEnabled,
    setEchoDelay,
    setEchoFeedback,
    setReverbEnabled,
    setReverbDecay,
    setReverbDensity,
    setReverbGain
  } = useSynthStore()

  // Sync state changes to audio engine
  useEffect(() => {
    const engine = getAudioEngine()
    if (!engine) return
    engine.setMasterVolume(masterVolume)
  }, [masterVolume])

  useEffect(() => {
    const engine = getAudioEngine()
    if (!engine) return
    for (const bankId of SOUND_BANKS) {
      const bank = soundBanks[bankId]
      engine.setSoundBankVolume(bankId, bank.volume)
      engine.setSoundBankPitch(bankId, bank.pitch)
    }
  }, [soundBanks])

  useEffect(() => {
    const engine = getAudioEngine()
    if (!engine) return
    engine.setSynthBankVolume(synthBank.volume)
    engine.setSynthBankWaveform(synthBank.waveform)
    engine.setSynthBankFilterCutoff(synthBank.filterCutoff)
    engine.setSynthBankFilterQ(synthBank.filterQ)
    engine.setSynthBankAttack(synthBank.attack)
    engine.setSynthBankRelease(synthBank.release)
  }, [synthBank])

  useEffect(() => {
    const engine = getAudioEngine()
    if (!engine) return
    engine.setEchoEnabled(effects.echo.enabled)
    engine.setEchoDelay(effects.echo.delay)
    engine.setEchoFeedback(effects.echo.feedback)
  }, [effects.echo])

  useEffect(() => {
    const engine = getAudioEngine()
    if (!engine) return
    engine.setReverbEnabled(effects.reverb.enabled)
    engine.setReverbParams(effects.reverb.decayTime, effects.reverb.density, effects.reverb.gain)
  }, [effects.reverb])

  return (
    <div className="control-panel">
      <div className="control-panel__section control-panel__header">
        <h1 className="logo">BitSynth</h1>
        <div className="master-volume">
          <label>Vol</label>
          <input
            type="range"
            min="0"
            max="11"
            value={masterVolume}
            onChange={(e) => setMasterVolume(Number(e.target.value))}
          />
        </div>
        <DisplayScreen />
        <Visualizer />
      </div>

      <div className="control-panel__scroll">
        <div className="control-panel__section">
          <h2>Presets</h2>
          <PresetSelector />
        </div>

        <div className="control-panel__section">
          <h2>8-Bit</h2>
          <div className="sound-banks">
            {SOUND_BANKS.map((bankId) => (
              <SoundBankControl
                key={bankId}
                label={BANK_LABELS[bankId]}
                volume={soundBanks[bankId].volume}
                pitch={soundBanks[bankId].pitch}
                onVolumeChange={(v) => setSoundBankVolume(bankId, v)}
                onPitchChange={(p) => setSoundBankPitch(bankId, p)}
              />
            ))}
          </div>
        </div>

        <div className="control-panel__section">
          <h2>Synth</h2>
          <SynthBankControl
            synthBank={synthBank}
            onVolumeChange={setSynthBankVolume}
            onWaveformChange={setSynthBankWaveform}
            onFilterCutoffChange={setSynthBankFilterCutoff}
            onFilterQChange={setSynthBankFilterQ}
            onAttackChange={setSynthBankAttack}
            onReleaseChange={setSynthBankRelease}
          />
        </div>

        <div className="control-panel__section">
          <h2>Effects</h2>
          <EffectsPanel
            echo={effects.echo}
            reverb={effects.reverb}
            onEchoEnabledChange={setEchoEnabled}
            onEchoDelayChange={setEchoDelay}
            onEchoFeedbackChange={setEchoFeedback}
            onReverbEnabledChange={setReverbEnabled}
            onReverbDecayChange={setReverbDecay}
            onReverbDensityChange={setReverbDensity}
            onReverbGainChange={setReverbGain}
          />
        </div>
      </div>
    </div>
  )
}
