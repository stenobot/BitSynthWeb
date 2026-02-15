import {
  REVERB_DECAY_MIN, REVERB_DECAY_MAX,
  REVERB_DENSITY_MIN, REVERB_DENSITY_MAX,
  REVERB_GAIN_MIN, REVERB_GAIN_MAX
} from '../../types'

export class ReverbEffect {
  private context: AudioContext
  private inputGain: GainNode
  private outputGain: GainNode
  private convolver: ConvolverNode
  private wetGain: GainNode
  private _enabled = false

  private currentDecay = REVERB_DECAY_MIN
  private currentDensity = REVERB_DENSITY_MIN
  private currentGain = REVERB_GAIN_MIN

  constructor(context: AudioContext) {
    this.context = context

    // Create nodes
    this.inputGain = context.createGain()
    this.outputGain = context.createGain()
    this.convolver = context.createConvolver()
    this.wetGain = context.createGain()

    // Wire up: input -> convolver -> wet -> output
    this.inputGain.connect(this.convolver)
    this.convolver.connect(this.wetGain)
    this.wetGain.connect(this.outputGain)

    // Generate initial impulse response
    this.updateImpulseResponse()

    // Start disabled
    this.wetGain.gain.value = 0
  }

  get input(): AudioNode {
    return this.inputGain
  }

  get output(): AudioNode {
    return this.outputGain
  }

  setParams(decayTime: number, density: number, gain: number): void {
    this.currentDecay = Math.max(REVERB_DECAY_MIN, Math.min(REVERB_DECAY_MAX, decayTime))
    this.currentDensity = Math.max(REVERB_DENSITY_MIN, Math.min(REVERB_DENSITY_MAX, density))
    this.currentGain = Math.max(REVERB_GAIN_MIN, Math.min(REVERB_GAIN_MAX, gain))
    this.updateImpulseResponse()
  }

  private updateImpulseResponse(): void {
    const sampleRate = this.context.sampleRate
    // Scale decay time: 1-50 maps to ~0.2s to ~3s
    const length = Math.floor(sampleRate * (this.currentDecay / 50) * 3)
    const buffer = this.context.createBuffer(2, length, sampleRate)

    // Higher density = more reflections
    const reflectionCount = Math.floor(this.currentDensity * 4)

    for (let channel = 0; channel < 2; channel++) {
      const data = buffer.getChannelData(channel)

      for (let i = 0; i < length; i++) {
        // Base exponential decay
        const decay = Math.exp(-3 * i / length)

        // Random noise for diffusion
        let sample = (Math.random() * 2 - 1) * decay

        // Add early reflections for density
        for (let r = 1; r <= reflectionCount; r++) {
          const reflectionDelay = Math.floor(sampleRate * 0.02 * r)
          if (i > reflectionDelay) {
            sample += (Math.random() * 2 - 1) * decay * 0.5 / r
          }
        }

        // Apply gain scaling (1-15 maps to 0.1-1.0)
        data[i] = sample * (this.currentGain / 15) * 0.3
      }
    }

    this.convolver.buffer = buffer
  }

  setEnabled(enabled: boolean): void {
    this._enabled = enabled
    this.wetGain.gain.value = enabled ? 0.4 : 0
  }

  get enabled(): boolean {
    return this._enabled
  }
}
