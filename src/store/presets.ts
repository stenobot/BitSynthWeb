import type { Preset, SynthBankState } from '../types'

const SYNTH_OFF: SynthBankState = {
  volume: 'off',
  loop: true,
  waveform: 'sawtooth',
  filterCutoff: 2000,
  attack: 0.05,
  release: 0.5,
  length: 1.2
}

// Presets ported from BitSynthPlus\Services\PresetInitializer.cs
export const PRESETS: Preset[] = [
  {
    name: 'Game Cowboy',
    soundBanks: {
      p1: { volume: 'high', loop: false, pitch: 1.0 },
      p2: { volume: 'off', loop: false, pitch: 1.0 },
      w1: { volume: 'off', loop: false, pitch: 1.0 },
      w2: { volume: 'off', loop: false, pitch: 1.0 }
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
    }
  },
  {
    name: 'All You Need Is Kill',
    soundBanks: {
      p1: { volume: 'low', loop: false, pitch: 2.0 },
      p2: { volume: 'off', loop: false, pitch: 1.0 },
      w1: { volume: 'off', loop: false, pitch: 1.0 },
      w2: { volume: 'high', loop: false, pitch: 1.0 }
    },
      synthBank: {
        volume: 'low',
        loop: false,
        waveform: 'sine',
        filterCutoff: 2035,
        attack: 0.07,
        release: 0.66,
        length: 1.2
      },
    effects: {
      echo: { enabled: true, delay: 0, feedback: 0.8 },
      reverb: { enabled: false, decayTime: 1, density: 1, gain: 1 }
    }
  },
  {
    name: 'Twix Peaks',
    soundBanks: {
      p1: { volume: 'off', loop: false, pitch: 1.0 },
      p2: { volume: 'high', loop: false, pitch: 1.0 },
      w1: { volume: 'off', loop: false, pitch: 1.0 },
      w2: { volume: 'off', loop: false, pitch: 1.0 }
    },
      synthBank: {
        volume: 'high',
        loop: true,
        waveform: 'square',
        filterCutoff: 2494,
        attack: 0.46,
        release: 2,
        length: 1.2
      },
    effects: {
      echo: { enabled: true, delay: 250, feedback: 0.4 },
      reverb: { enabled: false, decayTime: 1, density: 1, gain: 1 }
    }
  },
  {
    name: 'Saw Ten Thousand',
    soundBanks: {
      p1: { volume: 'off', loop: false, pitch: 1.0 },
      p2: { volume: 'off', loop: false, pitch: 1.0 },
      w1: { volume: 'off', loop: false, pitch: 1.0 },
      w2: { volume: 'off', loop: false, pitch: 1.0 }
    },
    synthBank: {
      volume: 'high',
      loop: true,
      waveform: 'sawtooth',
      filterCutoff: 1200,
      attack: 0.3,
      release: 1.5,
      length: 1.2
    },
    effects: {
      echo: { enabled: true, delay: 350, feedback: 0.5 },
      reverb: { enabled: true, decayTime: 30, density: 15, gain: 8 }
    }
  },
  {
    name: 'I Want To Believe',
    soundBanks: {
      p1: { volume: 'off', loop: false, pitch: 1.0 },
      p2: { volume: 'off', loop: false, pitch: 1.0 },
      w1: { volume: 'high', loop: true, pitch: 1.0 },
      w2: { volume: 'low', loop: true, pitch: 0.5 }
    },
    synthBank: SYNTH_OFF,
    effects: {
      echo: { enabled: true, delay: 400, feedback: 0.6 },
      reverb: { enabled: true, decayTime: 30, density: 15, gain: 10 }
    }
  },
  {
    name: 'Square Pluck',
    soundBanks: {
      p1: { volume: 'off', loop: false, pitch: 1.0 },
      p2: { volume: 'off', loop: false, pitch: 1.0 },
      w1: { volume: 'off', loop: false, pitch: 1.0 },
      w2: { volume: 'off', loop: false, pitch: 1.0 }
    },
    synthBank: {
      volume: 'high',
      loop: false,
      waveform: 'square',
      filterCutoff: 4000,
      attack: 0.01,
      release: 0.4,
      length: 0.6
    },
    effects: {
      echo: { enabled: true, delay: 200, feedback: 0.3 },
      reverb: { enabled: false, decayTime: 1, density: 1, gain: 1 }
    }
  },
  {
    name: 'Happy Accident',
    soundBanks: {
      p1: { volume: 'off', loop: false, pitch: 1.0 },
      p2: { volume: 'high', loop: false, pitch: 1.5 },
      w1: { volume: 'low', loop: true, pitch: 0.5 },
      w2: { volume: 'off', loop: false, pitch: 1.0 }
    },
    synthBank: SYNTH_OFF,
    effects: {
      echo: { enabled: false, delay: 150, feedback: 0 },
      reverb: { enabled: true, decayTime: 25, density: 12, gain: 8 }
    }
  },
  {
    name: 'Supercommuter',
    soundBanks: {
      p1: { volume: 'high', loop: false, pitch: 2.0 },
      p2: { volume: 'low', loop: false, pitch: 1.0 },
      w1: { volume: 'off', loop: false, pitch: 1.0 },
      w2: { volume: 'off', loop: false, pitch: 1.0 }
    },
    synthBank: SYNTH_OFF,
    effects: {
      echo: { enabled: true, delay: 200, feedback: 0.3 },
      reverb: { enabled: false, decayTime: 1, density: 1, gain: 1 }
    }
  },
  {
    name: 'Sine Drone',
    soundBanks: {
      p1: { volume: 'off', loop: false, pitch: 1.0 },
      p2: { volume: 'off', loop: false, pitch: 1.0 },
      w1: { volume: 'off', loop: false, pitch: 1.0 },
      w2: { volume: 'off', loop: false, pitch: 1.0 }
    },
    synthBank: {
      volume: 'high',
      loop: true,
      waveform: 'sine',
      filterCutoff: 6000,
      attack: 0.4,
      release: 2.0,
      length: 1.2
    },
    effects: {
      echo: { enabled: false, delay: 150, feedback: 0 },
      reverb: { enabled: true, decayTime: 40, density: 20, gain: 12 }
    }
  }
]
