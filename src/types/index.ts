export type VolumeLevel = 'off' | 'low' | 'high'

export type SoundBankId = 'p1' | 'p2' | 'w1' | 'w2'

export interface SoundBankState {
  volume: VolumeLevel
  loop: boolean
  pitch: number // 0.5, 1.0, 1.5, 2.0
}

export type WaveformType = 'sine' | 'square' | 'sawtooth' | 'triangle'

export interface SynthBankState {
  volume: VolumeLevel
  loop: boolean
  waveform: WaveformType
  filterCutoff: number // 200-8000 Hz
  attack: number // 0.01-0.5 seconds
  release: number // 0.1-2.0 seconds
  length: number // 0.5-2.0 seconds (one-shot sustain)
}

export interface EchoState {
  enabled: boolean
  delay: number // 150-600ms
  feedback: number // 0-0.9
}

export interface ReverbState {
  enabled: boolean
  decayTime: number // 1-50
  density: number // 1-25
  gain: number // 1-15
}

export interface EffectsState {
  echo: EchoState
  reverb: ReverbState
}

export interface Preset {
  name: string
  soundBanks: Record<SoundBankId, SoundBankState>
  synthBank: SynthBankState
  effects: EffectsState
}

export interface Voice {
  sourceNode: AudioBufferSourceNode
  gainNode: GainNode
  bankId: SoundBankId
  noteIndex: number
  isLooping: boolean
  startTime: number
}

export interface SynthVoice {
  oscillator: OscillatorNode
  filter: BiquadFilterNode
  gainNode: GainNode
  noteIndex: number
  startTime: number
}

// Note names matching UWP SoundBankInitializer.cs
export const NOTE_NAMES = [
  '1f', '1fsharp', '1g', '1gsharp',
  '2a', '2asharp', '2b', '2c', '2csharp', '2d', '2dsharp', '2e', '2f', '2fsharp', '2g', '2gsharp',
  '3a', '3asharp', '3b', '3c', '3csharp', '3d', '3dsharp', '3e', '3f', '3fsharp', '3g', '3gsharp',
  '4a', '4asharp', '4b', '4c', '4csharp', '4d', '4dsharp', '4e', '4f', '4fsharp', '4g'
] as const

export const SOUND_BANKS: SoundBankId[] = ['p1', 'p2', 'w1', 'w2']

// Volume gain values from UWP SoundPlayer.cs
export const VOLUME_GAINS: Record<VolumeLevel, number> = {
  off: 0.0,
  low: 0.3,
  high: 1.0
}

// Effect parameter ranges from CustomResources.xaml
export const ECHO_DELAY_MIN = 150
export const ECHO_DELAY_MAX = 600
export const ECHO_FEEDBACK_MIN = 0
export const ECHO_FEEDBACK_MAX = 0.9

export const REVERB_DECAY_MIN = 1
export const REVERB_DECAY_MAX = 50
export const REVERB_DENSITY_MIN = 1
export const REVERB_DENSITY_MAX = 25
export const REVERB_GAIN_MIN = 1
export const REVERB_GAIN_MAX = 15

// Synth bank parameter ranges
export const SYNTH_FILTER_MIN = 200
export const SYNTH_FILTER_MAX = 8000
export const SYNTH_ATTACK_MIN = 0.01
export const SYNTH_ATTACK_MAX = 0.5
export const SYNTH_RELEASE_MIN = 0.1
export const SYNTH_RELEASE_MAX = 2.0
export const SYNTH_LENGTH_MIN = 0.5
export const SYNTH_LENGTH_MAX = 2.0

export const WAVEFORMS: WaveformType[] = ['sawtooth', 'square', 'triangle', 'sine']
