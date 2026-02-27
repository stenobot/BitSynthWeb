import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import type { SoundBankId, SoundBankState, SynthBankState, EffectsState, VolumeLevel, WaveformType } from '../types'
import { PRESETS } from './presets'

interface AppState {
  // Loading state
  isLoading: boolean
  loadProgress: number
  loadingBankLabel: string

  // Master controls
  masterVolume: number // 0-11
  activePreset: number // 0-5

  // Display screen message
  displayMessage: string

  // Sample-based sound banks (P1, P2, W1, W2)
  soundBanks: Record<SoundBankId, SoundBankState>

  // Synthesis bank (SYN)
  synthBank: SynthBankState

  // Effects
  effects: EffectsState

  // Active keys for visual feedback
  pressedKeys: Set<number>

  // Actions
  setLoading: (loading: boolean) => void
  setLoadProgress: (progress: number) => void
  setLoadingBankLabel: (label: string) => void
  setMasterVolume: (volume: number) => void
  setSoundBankVolume: (bank: SoundBankId, volume: VolumeLevel) => void
  setSoundBankPitch: (bank: SoundBankId, pitch: number) => void
  // Synth bank actions
  setSynthBankVolume: (volume: VolumeLevel) => void
  setSynthBankWaveform: (waveform: WaveformType) => void
  setSynthBankFilterCutoff: (cutoff: number) => void
  setSynthBankFilterQ: (q: number) => void
  setSynthBankAttack: (attack: number) => void
  setSynthBankRelease: (release: number) => void
  // Effects actions
  setEchoEnabled: (enabled: boolean) => void
  setEchoDelay: (delay: number) => void
  setEchoFeedback: (feedback: number) => void
  setReverbEnabled: (enabled: boolean) => void
  setReverbDecay: (decay: number) => void
  setReverbDensity: (density: number) => void
  setReverbGain: (gain: number) => void
  applyPreset: (presetIndex: number) => void
  pressKey: (keyIndex: number) => void
  releaseKey: (keyIndex: number) => void
}

export const useSynthStore = create<AppState>()(
  subscribeWithSelector((set) => {
    const firstPreset = PRESETS[0]
    
    return {
    // Initial state using Preset 0
    isLoading: true,
    loadProgress: 0,
    loadingBankLabel: '',
    masterVolume: 5,
    activePreset: 0,
    displayMessage: `Preset: ${firstPreset.name}`,

    soundBanks: { ...firstPreset.soundBanks },
    synthBank: { ...firstPreset.synthBank },
    effects: { ...firstPreset.effects },

    pressedKeys: new Set(),

    // Actions
    setLoading: (loading) => set({ isLoading: loading }),
    setLoadProgress: (progress) => set({ loadProgress: progress }),
    setLoadingBankLabel: (label) => set({ loadingBankLabel: label }),
    setMasterVolume: (volume) => set({ masterVolume: volume, displayMessage: `Master Vol: ${volume}` }),

    setSoundBankVolume: (bank, volume) => set((state) => ({
      soundBanks: {
        ...state.soundBanks,
        [bank]: { ...state.soundBanks[bank], volume }
      },
      displayMessage: `${bank.toUpperCase()} Volume: ${volume}`
    })),

    setSoundBankPitch: (bank, pitch) => set((state) => ({
      soundBanks: {
        ...state.soundBanks,
        [bank]: { ...state.soundBanks[bank], pitch }
      },
      displayMessage: `${bank.toUpperCase()} Pitch: ${pitch}x`
    })),

    // Synth bank actions
    setSynthBankVolume: (volume) => set((state) => ({
      synthBank: { ...state.synthBank, volume },
      displayMessage: `Synth Volume: ${volume}`
    })),

    setSynthBankWaveform: (waveform) => set((state) => ({
      synthBank: { ...state.synthBank, waveform },
      displayMessage: `Synth Wave: ${waveform}`
    })),

    setSynthBankFilterCutoff: (filterCutoff) => set((state) => ({
      synthBank: { ...state.synthBank, filterCutoff },
      displayMessage: `Synth Filter: ${filterCutoff} Hz`
    })),

    setSynthBankFilterQ: (filterQ) => set((state) => ({
      synthBank: { ...state.synthBank, filterQ },
      displayMessage: `Synth Resonance: ${filterQ}`
    })),

    setSynthBankAttack: (attack) => set((state) => ({
      synthBank: { ...state.synthBank, attack },
      displayMessage: `Synth Attack: ${attack}s`
    })),

    setSynthBankRelease: (release) => set((state) => ({
      synthBank: { ...state.synthBank, release },
      displayMessage: `Synth Release: ${release}s`
    })),

    setEchoEnabled: (enabled) => set((state) => ({
      effects: {
        ...state.effects,
        echo: { ...state.effects.echo, enabled }
      },
      displayMessage: `Echo: ${enabled ? 'On' : 'Off'}`
    })),

    setEchoDelay: (delay) => set((state) => ({
      effects: {
        ...state.effects,
        echo: { ...state.effects.echo, delay }
      },
      displayMessage: `Echo Delay: ${delay}ms`
    })),

    setEchoFeedback: (feedback) => set((state) => ({
      effects: {
        ...state.effects,
        echo: { ...state.effects.echo, feedback }
      },
      displayMessage: `Echo Feedback: ${feedback}`
    })),

    setReverbEnabled: (enabled) => set((state) => ({
      effects: {
        ...state.effects,
        reverb: { ...state.effects.reverb, enabled }
      },
      displayMessage: `Reverb: ${enabled ? 'On' : 'Off'}`
    })),

    setReverbDecay: (decay) => set((state) => ({
      effects: {
        ...state.effects,
        reverb: { ...state.effects.reverb, decayTime: decay }
      },
      displayMessage: `Reverb Decay: ${decay}`
    })),

    setReverbDensity: (density) => set((state) => ({
      effects: {
        ...state.effects,
        reverb: { ...state.effects.reverb, density }
      },
      displayMessage: `Reverb Density: ${density}`
    })),

    setReverbGain: (gain) => set((state) => ({
      effects: {
        ...state.effects,
        reverb: { ...state.effects.reverb, gain }
      },
      displayMessage: `Reverb Gain: ${gain}`
    })),

    applyPreset: (presetIndex) => {
      const preset = PRESETS[presetIndex]
      if (!preset) return

      set({
        activePreset: presetIndex,
        soundBanks: { ...preset.soundBanks },
        synthBank: { ...preset.synthBank },
        effects: { ...preset.effects },
        displayMessage: `Preset: ${preset.name}`
      })
    },

    pressKey: (keyIndex) => set((state) => {
      const newSet = new Set(state.pressedKeys)
      newSet.add(keyIndex)
      return { pressedKeys: newSet }
    }),

    releaseKey: (keyIndex) => set((state) => {
      const newSet = new Set(state.pressedKeys)
      newSet.delete(keyIndex)
      return { pressedKeys: newSet }
    }),
    }
  })
)
