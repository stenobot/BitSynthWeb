import { ECHO_DELAY_MIN, ECHO_DELAY_MAX, ECHO_FEEDBACK_MIN, ECHO_FEEDBACK_MAX } from '../../types'

export class EchoEffect {
  private inputGain: GainNode
  private outputGain: GainNode
  private delayNode: DelayNode
  private feedbackGain: GainNode
  private wetGain: GainNode
  private _enabled = false

  constructor(context: AudioContext) {
    // Create nodes
    this.inputGain = context.createGain()
    this.outputGain = context.createGain()
    this.delayNode = context.createDelay(1.0) // Max 1 second
    this.feedbackGain = context.createGain()
    this.wetGain = context.createGain()

    // Wire up:
    // input -> delay -> wet -> output
    //       -> delay -> feedback -> delay (loop)
    this.inputGain.connect(this.delayNode)
    this.delayNode.connect(this.wetGain)
    this.wetGain.connect(this.outputGain)

    // Feedback loop
    this.delayNode.connect(this.feedbackGain)
    this.feedbackGain.connect(this.delayNode)

    // Set initial values
    this.setDelay(ECHO_DELAY_MIN)
    this.setFeedback(ECHO_FEEDBACK_MIN)
    this.wetGain.gain.value = 0 // Start disabled
  }

  get input(): AudioNode {
    return this.inputGain
  }

  get output(): AudioNode {
    return this.outputGain
  }

  setDelay(ms: number): void {
    const clamped = Math.max(ECHO_DELAY_MIN, Math.min(ECHO_DELAY_MAX, ms))
    this.delayNode.delayTime.value = clamped / 1000
  }

  setFeedback(value: number): void {
    const clamped = Math.max(ECHO_FEEDBACK_MIN, Math.min(ECHO_FEEDBACK_MAX, value))
    this.feedbackGain.gain.value = clamped
  }

  setEnabled(enabled: boolean): void {
    this._enabled = enabled
    this.wetGain.gain.value = enabled ? 0.5 : 0
  }

  get enabled(): boolean {
    return this._enabled
  }
}
