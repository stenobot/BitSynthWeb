import type { SoundBankId, VolumeLevel, Voice, SynthVoice, WaveformType, SynthBankState } from '../types'
import { NOTE_NAMES, SOUND_BANKS, VOLUME_GAINS } from '../types'
import { EchoEffect } from './effects/EchoEffect'
import { ReverbEffect } from './effects/ReverbEffect'

const BASE_URL = import.meta.env.BASE_URL

export class AudioEngine {
  private context: AudioContext | null = null
  private masterGain: GainNode | null = null
  private bankGains: Map<SoundBankId, GainNode> = new Map()
  private synthBankGain: GainNode | null = null

  // Sample buffers for the 4 sample banks
  private sampleBuffers: Map<string, AudioBuffer> = new Map()

  // Active voices
  private activeVoices: Map<string, Voice[]> = new Map()
  private activeSynthVoices: Map<string, SynthVoice[]> = new Map()

  private echoEffect: EchoEffect | null = null
  private reverbEffect: ReverbEffect | null = null
  private dryGain: GainNode | null = null
  private wetGain: GainNode | null = null

  // Per-bank settings
  private bankPitch: Map<SoundBankId, number> = new Map()
  private bankLoop: Map<SoundBankId, boolean> = new Map()

  // Synth bank settings
  private synthSettings: SynthBankState = {
    volume: 'off',
    loop: true,
    waveform: 'sawtooth',
    filterCutoff: 2000,
    attack: 0.05,
    release: 0.5,
    length: 1.2
  }

  async initialize(onProgress?: (loaded: number, total: number) => void): Promise<void> {
    this.context = new AudioContext({ latencyHint: 'interactive' })

    // Create master gain
    this.masterGain = this.context.createGain()
    this.masterGain.gain.value = 0.5

    // Create dry/wet mix nodes for effects
    this.dryGain = this.context.createGain()
    this.dryGain.gain.value = 1.0
    this.wetGain = this.context.createGain()
    this.wetGain.gain.value = 0.5

    // Create effects
    this.echoEffect = new EchoEffect(this.context)
    this.reverbEffect = new ReverbEffect(this.context)

    // Create per-bank gain nodes for sample banks
    for (const bankId of SOUND_BANKS) {
      const gain = this.context.createGain()
      gain.gain.value = bankId === 'p1' ? VOLUME_GAINS.high : VOLUME_GAINS.off
      gain.connect(this.masterGain)
      this.bankGains.set(bankId, gain)
      this.bankPitch.set(bankId, 1.0)
      this.bankLoop.set(bankId, false)
    }

    // Create synth bank gain node
    this.synthBankGain = this.context.createGain()
    this.synthBankGain.gain.value = VOLUME_GAINS.off
    this.synthBankGain.connect(this.masterGain)

    // Wire up audio graph
    this.masterGain.connect(this.dryGain)
    this.dryGain.connect(this.context.destination)

    this.masterGain.connect(this.echoEffect.input)
    this.echoEffect.output.connect(this.wetGain)

    this.masterGain.connect(this.reverbEffect.input)
    this.reverbEffect.output.connect(this.wetGain)

    this.wetGain.connect(this.context.destination)

    // Initially disable effects
    this.echoEffect.setEnabled(false)
    this.reverbEffect.setEnabled(false)

    // Load OGG samples
    await this.loadSamples(onProgress)
  }

  private async loadSamples(onProgress?: (loaded: number, total: number) => void): Promise<void> {
    if (!this.context) return

    const total = SOUND_BANKS.length * NOTE_NAMES.length * 2
    let loaded = 0

    for (const bankId of SOUND_BANKS) {
      for (let noteIndex = 0; noteIndex < NOTE_NAMES.length; noteIndex++) {
        const noteName = NOTE_NAMES[noteIndex]

        // Load normal sample
        try {
          const normalUrl = `${BASE_URL}samples/${bankId}-${noteName}.ogg`
          const normalBuffer = await this.loadAudioFile(normalUrl)
          if (normalBuffer) {
            this.sampleBuffers.set(`${bankId}-${noteName}`, normalBuffer)
          }
        } catch (e) {
          console.warn(`Failed to load ${bankId}-${noteName}.ogg`)
        }
        loaded++
        onProgress?.(loaded, total)

        // Load loop sample
        try {
          const loopUrl = `${BASE_URL}samples/${bankId}-${noteName}-loop.ogg`
          const loopBuffer = await this.loadAudioFile(loopUrl)
          if (loopBuffer) {
            const shouldCrossFade = bankId === 'p1' || bankId === 'p2'
            this.sampleBuffers.set(`${bankId}-${noteName}-loop`, shouldCrossFade ? this.crossFadeLoopBuffer(loopBuffer) : loopBuffer)
          }
        } catch (e) {
          console.warn(`Failed to load ${bankId}-${noteName}-loop.ogg`)
        }
        loaded++
        onProgress?.(loaded, total)
      }
    }
  }

  // Cross-fade the tail of a loop buffer into the head for seamless looping.
  // Only the tail is modified so the loop point wraps cleanly into the untouched head.
  // Uses an equal-power (cosine) curve to maintain constant perceived loudness.
  private crossFadeLoopBuffer(buffer: AudioBuffer): AudioBuffer {
    if (!this.context) return buffer

    const fadeSamples = Math.min(Math.floor(buffer.sampleRate * 0.15), Math.floor(buffer.length / 3))
    const newBuffer = this.context.createBuffer(buffer.numberOfChannels, buffer.length, buffer.sampleRate)

    for (let ch = 0; ch < buffer.numberOfChannels; ch++) {
      const src = buffer.getChannelData(ch)
      const dst = newBuffer.getChannelData(ch)
      dst.set(src)

      for (let i = 0; i < fadeSamples; i++) {
        const t = i / fadeSamples
        const fadeOut = Math.cos(t * Math.PI * 0.5)
        const fadeIn = Math.sin(t * Math.PI * 0.5)
        dst[buffer.length - fadeSamples + i] = src[buffer.length - fadeSamples + i] * fadeOut + src[i] * fadeIn
      }
    }

    return newBuffer
  }

  private async loadAudioFile(url: string): Promise<AudioBuffer | null> {
    if (!this.context) return null

    try {
      const response = await fetch(url)
      if (!response.ok) return null
      const arrayBuffer = await response.arrayBuffer()
      return await this.context.decodeAudioData(arrayBuffer)
    } catch {
      return null
    }
  }

  // Get frequency for a note index (starting from F3)
  private getNoteFrequency(noteIndex: number): number {
    const baseFreq = 174.61 // F3
    return baseFreq * Math.pow(2, noteIndex / 12)
  }

  playNote(noteIndex: number): void {
    if (!this.context || !this.masterGain) return

    if (this.context.state === 'suspended') {
      this.context.resume()
    }

    // Play on sample banks
    for (const bankId of SOUND_BANKS) {
      const bankGain = this.bankGains.get(bankId)
      if (!bankGain || bankGain.gain.value === 0) continue

      const pitch = this.bankPitch.get(bankId) ?? 1.0
      const loop = this.bankLoop.get(bankId) ?? false
      const noteName = NOTE_NAMES[noteIndex]

      const bufferKey = loop ? `${bankId}-${noteName}-loop` : `${bankId}-${noteName}`
      const buffer = this.sampleBuffers.get(bufferKey)

      if (!buffer) continue

      const sourceNode = this.context.createBufferSource()
      sourceNode.buffer = buffer
      sourceNode.playbackRate.value = pitch
      sourceNode.loop = loop

      const voiceGain = this.context.createGain()
      voiceGain.gain.value = 1.0

      sourceNode.connect(voiceGain)
      voiceGain.connect(bankGain)

      sourceNode.start()

      const key = `${noteIndex}`
      const voice: Voice = {
        sourceNode,
        gainNode: voiceGain,
        bankId,
        noteIndex,
        isLooping: loop,
        startTime: this.context.currentTime
      }

      // Clean up one-shot voices when they finish naturally
      if (!loop) {
        sourceNode.onended = () => {
          try {
            voiceGain.disconnect()
          } catch {
            // Already disconnected
          }
          const voices = this.activeVoices.get(key)
          if (voices) {
            const idx = voices.indexOf(voice)
            if (idx !== -1) voices.splice(idx, 1)
            if (voices.length === 0) this.activeVoices.delete(key)
          }
        }
      }
      if (!this.activeVoices.has(key)) {
        this.activeVoices.set(key, [])
      }
      this.activeVoices.get(key)!.push(voice)
    }

    // Play on synth bank (oscillator-based)
    if (this.synthBankGain && this.synthBankGain.gain.value > 0) {
      this.playSynthNote(noteIndex)
    }
  }

  private playSynthNote(noteIndex: number): void {
    if (!this.context || !this.synthBankGain) return

    const frequency = this.getNoteFrequency(noteIndex)

    // Create oscillator
    const oscillator = this.context.createOscillator()
    oscillator.type = this.synthSettings.waveform
    oscillator.frequency.value = frequency

    // Create filter
    const filter = this.context.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.value = this.synthSettings.filterCutoff
    filter.Q.value = 1

    // Create gain for envelope
    const gainNode = this.context.createGain()
    gainNode.gain.value = 0

    // Connect: oscillator -> filter -> gain -> synthBankGain
    oscillator.connect(filter)
    filter.connect(gainNode)
    gainNode.connect(this.synthBankGain)

    // Apply attack envelope
    const now = this.context.currentTime
    const attack = this.synthSettings.attack
    const release = this.synthSettings.release
    gainNode.gain.setValueAtTime(0, now)
    gainNode.gain.linearRampToValueAtTime(1, now + attack)

    oscillator.start()

    const key = `${noteIndex}`
    const synthVoice: SynthVoice = {
      oscillator,
      filter,
      gainNode,
      noteIndex,
      startTime: now
    }

    // One-shot mode: schedule sustain + release to auto-stop
    if (!this.synthSettings.loop) {
      const sustainEnd = now + this.synthSettings.length
      gainNode.gain.setValueAtTime(1, sustainEnd)
      gainNode.gain.linearRampToValueAtTime(0, sustainEnd + release)
      oscillator.stop(sustainEnd + release + 0.01)

      setTimeout(() => {
        try {
          oscillator.disconnect()
          filter.disconnect()
          gainNode.disconnect()
        } catch {
          // Already disconnected
        }
        const voices = this.activeSynthVoices.get(key)
        if (voices) {
          const idx = voices.indexOf(synthVoice)
          if (idx !== -1) voices.splice(idx, 1)
          if (voices.length === 0) this.activeSynthVoices.delete(key)
        }
      }, (this.synthSettings.length + release + 0.1) * 1000)
    }

    if (!this.activeSynthVoices.has(key)) {
      this.activeSynthVoices.set(key, [])
    }
    this.activeSynthVoices.get(key)!.push(synthVoice)
  }

  stopNote(noteIndex: number): void {
    if (!this.context) return

    const key = `${noteIndex}`

    // Stop sample voices
    const voices = this.activeVoices.get(key) || []
    for (const voice of voices) {
      try {
        voice.sourceNode.stop()
        voice.sourceNode.disconnect()
      } catch {
        // Already stopped
      }

      if (voice.isLooping) {
        // Looping voice: play the non-loop sample for ring-out
        const pitch = this.bankPitch.get(voice.bankId) ?? 1.0
        const noteName = NOTE_NAMES[voice.noteIndex]
        const releaseBufferKey = `${voice.bankId}-${noteName}`
        const releaseBuffer = this.sampleBuffers.get(releaseBufferKey)

        if (releaseBuffer && this.context) {
          const bankGain = this.bankGains.get(voice.bankId)
          if (bankGain) {
            const releaseSource = this.context.createBufferSource()
            releaseSource.buffer = releaseBuffer
            releaseSource.playbackRate.value = pitch
            releaseSource.loop = false

            releaseSource.connect(voice.gainNode)
            releaseSource.start()

            releaseSource.onended = () => {
              try {
                voice.gainNode.disconnect()
              } catch {
                // Already disconnected
              }
            }
          }
        } else {
          voice.gainNode.disconnect()
        }
      } else {
        // One-shot voice: just clean up
        voice.gainNode.disconnect()
      }
    }
    this.activeVoices.delete(key)

    // Stop synth voices with release envelope
    const synthVoices = this.activeSynthVoices.get(key) || []
    for (const voice of synthVoices) {
      const now = this.context.currentTime
      const releaseTime = this.synthSettings.release

      // Apply release envelope
      voice.gainNode.gain.cancelScheduledValues(now)
      voice.gainNode.gain.setValueAtTime(voice.gainNode.gain.value, now)
      voice.gainNode.gain.linearRampToValueAtTime(0, now + releaseTime)

      // Stop oscillator after release
      voice.oscillator.stop(now + releaseTime + 0.01)

      // Clean up after release
      setTimeout(() => {
        try {
          voice.oscillator.disconnect()
          voice.filter.disconnect()
          voice.gainNode.disconnect()
        } catch {
          // Already disconnected
        }
      }, (releaseTime + 0.1) * 1000)
    }
    this.activeSynthVoices.delete(key)
  }

  setMasterVolume(volume: number): void {
    if (this.masterGain) {
      this.masterGain.gain.value = volume / 11
    }
  }

  setSoundBankVolume(bankId: SoundBankId, volume: VolumeLevel): void {
    const gain = this.bankGains.get(bankId)
    if (gain) {
      gain.gain.value = VOLUME_GAINS[volume]
    }
  }

  setSoundBankPitch(bankId: SoundBankId, pitch: number): void {
    this.bankPitch.set(bankId, pitch)
  }

  setSoundBankLoop(bankId: SoundBankId, loop: boolean): void {
    this.bankLoop.set(bankId, loop)
  }

  // Synth bank setters
  setSynthBankVolume(volume: VolumeLevel): void {
    this.synthSettings.volume = volume
    if (this.synthBankGain) {
      this.synthBankGain.gain.value = VOLUME_GAINS[volume]
    }
  }

  setSynthBankLoop(loop: boolean): void {
    this.synthSettings.loop = loop
  }

  setSynthBankWaveform(waveform: WaveformType): void {
    this.synthSettings.waveform = waveform
  }

  setSynthBankFilterCutoff(cutoff: number): void {
    this.synthSettings.filterCutoff = cutoff
    // Update filter on active voices
    for (const voices of this.activeSynthVoices.values()) {
      for (const voice of voices) {
        voice.filter.frequency.value = cutoff
      }
    }
  }

  setSynthBankAttack(attack: number): void {
    this.synthSettings.attack = attack
  }

  setSynthBankRelease(release: number): void {
    this.synthSettings.release = release
  }

  setSynthBankLength(length: number): void {
    this.synthSettings.length = length
  }

  setEchoEnabled(enabled: boolean): void {
    this.echoEffect?.setEnabled(enabled)
  }

  setEchoDelay(delay: number): void {
    this.echoEffect?.setDelay(delay)
  }

  setEchoFeedback(feedback: number): void {
    this.echoEffect?.setFeedback(feedback)
  }

  setReverbEnabled(enabled: boolean): void {
    this.reverbEffect?.setEnabled(enabled)
  }

  setReverbParams(decayTime: number, density: number, gain: number): void {
    this.reverbEffect?.setParams(decayTime, density, gain)
  }

  dispose(): void {
    // Stop all sample voices
    for (const voices of this.activeVoices.values()) {
      for (const voice of voices) {
        try {
          voice.sourceNode.stop()
          voice.sourceNode.disconnect()
          voice.gainNode.disconnect()
        } catch {
          // Already stopped
        }
      }
    }
    this.activeVoices.clear()

    // Stop all synth voices
    for (const voices of this.activeSynthVoices.values()) {
      for (const voice of voices) {
        try {
          voice.oscillator.stop()
          voice.oscillator.disconnect()
          voice.filter.disconnect()
          voice.gainNode.disconnect()
        } catch {
          // Already stopped
        }
      }
    }
    this.activeSynthVoices.clear()

    if (this.context) {
      this.context.close()
      this.context = null
    }
  }
}
