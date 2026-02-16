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
  setSoundBankLoop: (bank: SoundBankId, loop: boolean) => void
  setSoundBankPitch: (bank: SoundBankId, pitch: number) => void
  // Synth bank actions
  setSynthBankVolume: (volume: VolumeLevel) => void
  setSynthBankLoop: (loop: boolean) => void
  setSynthBankWaveform: (waveform: WaveformType) => void
  setSynthBankFilterCutoff: (cutoff: number) => void
  setSynthBankAttack: (attack: number) => void
  setSynthBankRelease: (release: number) => void
  setSynthBankLength: (length: number) => void
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
  subscribeWithSelector((set) => ({
    // Initial state matching UWP defaults (Preset 1: "Default")
    isLoading: true,
    loadProgress: 0,
    loadingBankLabel: '',
    masterVolume: 5,
    activePreset: 0,
    displayMessage: 'Preset: Game Cowboy',

    soundBanks: {
      p1: { volume: 'high', loop: false, pitch: 1.0 },
      p2: { volume: 'off', loop: false, pitch: 1.0 },
      w1: { volume: 'off', loop: false, pitch: 1.0 },
      w2: { volume: 'off', loop: false, pitch: 1.0 },
    },

    synthBank: {
      volume: 'low',
      loop: false,
      waveform: 'square',
      filterCutoff: 3000,
      attack: 0.02,
      release: 0.3,
      length: 0.8
    },

    effects: {
      echo: { enabled: false, delay: 150, feedback: 0 },
      reverb: { enabled: false, decayTime: 1, density: 1, gain: 1 }
    },

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

    setSoundBankLoop: (bank, loop) => set((state) => ({
      soundBanks: {
        ...state.soundBanks,
        [bank]: { ...state.soundBanks[bank], loop }
      },
      displayMessage: `${bank.toUpperCase()} Loop: ${loop ? 'On' : 'Off'}`
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

    setSynthBankLoop: (loop) => set((state) => ({
      synthBank: { ...state.synthBank, loop },
      displayMessage: `Synth Loop: ${loop ? 'On' : 'Off'}`
    })),

    setSynthBankWaveform: (waveform) => set((state) => ({
      synthBank: { ...state.synthBank, waveform },
      displayMessage: `Synth Wave: ${waveform}`
    })),

    setSynthBankFilterCutoff: (filterCutoff) => set((state) => ({
      synthBank: { ...state.synthBank, filterCutoff },
      displayMessage: `Synth Filter: ${filterCutoff} Hz`
    })),

    setSynthBankAttack: (attack) => set((state) => ({
      synthBank: { ...state.synthBank, attack },
      displayMessage: `Synth Attack: ${attack}s`
    })),

    setSynthBankRelease: (release) => set((state) => ({
      synthBank: { ...state.synthBank, release },
      displayMessage: `Synth Release: ${release}s`
    })),

    setSynthBankLength: (length) => set((state) => ({
      synthBank: { ...state.synthBank, length },
      displayMessage: `Synth Length: ${length}s`
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
  }))
)
