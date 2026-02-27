import type { Preset, SynthBankState } from '../types'

const SYNTH_OFF: SynthBankState = {
  volume: 'off',
  waveform: 'sawtooth',
  filterCutoff: 2000,
  filterQ: 1,
  attack: 0.05,
  release: 0.5
}

// Presets ported from BitSynthPlus\Services\PresetInitializer.cs
export const PRESETS: Preset[] = [
  {
    name: 'Supercommuter',
    soundBanks: {
      p1: { volume: 'high', pitch: 2.0 },
      p2: { volume: 'low', pitch: 1.0 },
      w1: { volume: 'off', pitch: 1.0 },
      w2: { volume: 'off', pitch: 1.0 }
    },
    synthBank: SYNTH_OFF,
    effects: {
      echo: { enabled: true, delay: 200, feedback: 0.3 },
      reverb: { enabled: false, decayTime: 1, density: 1, gain: 1 }
    }
  },
  {
    name: 'All You Need Is Everything',
    soundBanks: {
      p1: { volume: 'high', pitch: 2.0 },
      p2: { volume: 'off', pitch: 1.0 },
      w1: { volume: 'off', pitch: 1.0 },
      w2: { volume: 'low', pitch: 1.0 }
    },
    synthBank: {
      volume: 'low',
      waveform: 'sine',
      filterCutoff: 2035,
      filterQ: 1,
      attack: 0.07,
      release: 0.66
    },
    effects: {
      echo: { enabled: true, delay: 0, feedback: 0.8 },
      reverb: { enabled: false, decayTime: 1, density: 1, gain: 1 }
    }
  },
  {
    name: 'Twix Peaks',
    soundBanks: {
      p1: { volume: 'off', pitch: 1.0 },
      p2: { volume: 'high', pitch: 1.0 },
      w1: { volume: 'off', pitch: 1.0 },
      w2: { volume: 'off', pitch: 1.0 }
    },
    synthBank: {
      volume: 'high',
      waveform: 'square',
      filterCutoff: 2494,
      filterQ: 1,
      attack: 0.46,
      release: 2
    },
    effects: {
      echo: { enabled: true, delay: 250, feedback: 0.4 },
      reverb: { enabled: false, decayTime: 1, density: 1, gain: 1 }
    }
  },
  {
    name: 'Saw VV',
    soundBanks: {
      p1: { volume: 'off', pitch: 1.0 },
      p2: { volume: 'off', pitch: 1.0 },
      w1: { volume: 'off', pitch: 1.0 },
      w2: { volume: 'off', pitch: 1.0 }
    },
    synthBank: {
      volume: 'high',
      waveform: 'sawtooth',
      filterCutoff: 1200,
      filterQ: 1,
      attack: 0.3,
      release: 1.5
    },
    effects: {
      echo: { enabled: true, delay: 350, feedback: 0.5 },
      reverb: { enabled: true, decayTime: 30, density: 15, gain: 8 }
    }
  },
  {
    name: 'I Want To Believe',
    soundBanks: {
      p1: { volume: 'off', pitch: 1.0 },
      p2: { volume: 'off', pitch: 1.0 },
      w1: { volume: 'high', pitch: 1.0 },
      w2: { volume: 'low', pitch: 0.5 }
    },
    synthBank: SYNTH_OFF,
    effects: {
      echo: { enabled: true, delay: 400, feedback: 0.6 },
      reverb: { enabled: true, decayTime: 30, density: 15, gain: 10 }
    }
  },
  {
    name: "Asterix's Idea",
    soundBanks: {
      p1: { volume: 'off', pitch: 1.0 },
      p2: { volume: 'off', pitch: 1.0 },
      w1: { volume: 'off', pitch: 1.0 },
      w2: { volume: 'off', pitch: 1.0 }
    },
    synthBank: {
      volume: 'high',
      waveform: 'sine',
      filterCutoff: 8000,
      filterQ: 1,
      attack: 0.1,
      release: 0
    },
    effects: {
      echo: { enabled: true, delay: 600, feedback: 0 },
      reverb: { enabled: true, decayTime: 40, density: 20, gain: 12 }
    }
  },
  {
    name: 'Happy Accident',
    soundBanks: {
      p1: { volume: 'off', pitch: 1.0 },
      p2: { volume: 'high', pitch: 1.5 },
      w1: { volume: 'low', pitch: 0.5 },
      w2: { volume: 'off', pitch: 1.0 }
    },
    synthBank: SYNTH_OFF,
    effects: {
      echo: { enabled: false, delay: 150, feedback: 0 },
      reverb: { enabled: true, decayTime: 25, density: 12, gain: 8 }
    }
  },
  {
    name: 'Corporate Anthem',
    soundBanks: {
      p1: { volume: 'high', pitch: 1.0 },
      p2: { volume: 'high', pitch: 1.5 },
      w1: { volume: 'off', pitch: 1.0 },
      w2: { volume: 'off', pitch: 1.0 }
    },
    synthBank: SYNTH_OFF,
    effects: {
      echo: { enabled: false, delay: 150, feedback: 0 },
      reverb: { enabled: false, decayTime: 1, density: 1, gain: 1 }
    }
  },
  {
    name: 'Sine Language',
    soundBanks: {
      p1: { volume: 'off', pitch: 1.0 },
      p2: { volume: 'off', pitch: 1.0 },
      w1: { volume: 'off', pitch: 1.0 },
      w2: { volume: 'off', pitch: 1.0 }
    },
    synthBank: {
      volume: 'high',
      waveform: 'sine',
      filterCutoff: 6000,
      filterQ: 1,
      attack: 0.4,
      release: 2.0
    },
    effects: {
      echo: { enabled: false, delay: 150, feedback: 0 },
      reverb: { enabled: true, decayTime: 40, density: 20, gain: 12 }
    }
  }
]
