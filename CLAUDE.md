# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

BitSynth is a browser-based 8-bit mobile synthesizer built as a Progressive Web App. It's the third generation of a synth app (Windows Phone 2012 → UWP 2018 → PWA). Deployed via GitHub Pages to https://stenobot.github.io/BitSynthWeb/.

## Build & Development Commands

```bash
npm run dev      # Vite dev server with HMR
npm run build    # TypeScript compile (tsc -b) + Vite production build → dist/
npm run lint     # ESLint
npm run preview  # Preview production build locally
```

Deployment is automated via GitHub Actions on push to `main` → GitHub Pages.

## Tech Stack

- React 18 + TypeScript (strict mode) + Vite
- Zustand for state management (single store with `subscribeWithSelector`)
- Web Audio API for audio synthesis and sample playback
- vite-plugin-pwa for offline/installable PWA support

## Architecture

### Audio Engine (`src/audio/AudioEngine.ts`)
Singleton class that owns the entire Web Audio graph. Handles:
- **4 sample banks** (P1, P2, W1, W2): each has 44 pre-recorded .ogg samples (F1-G4), independent volume (off/low/high) and pitch multiplier
- **1 synth bank** (SYN): oscillator-based with waveform selection, biquad lowpass filter (cutoff + Q), and ADSR envelope
- **Effects chain**: dry signal always passes through; wet signal routes through EchoEffect → ReverbEffect (convolution with procedurally-generated impulse response)
- **Master pitch bend**: affects all active voices in real-time

Audio graph routing:
```
Banks & Synth → Master Gain → Dry → Destination
                             → Wet → Echo → Reverb → Destination
```

### State Management (`src/store/synthStore.ts`)
Single Zustand store (`useSynthStore`) holds all synth parameters, active keys, and preset data. The ControlPanel component syncs store state → AudioEngine via useEffect hooks. Store actions also update the display screen message.

### Keyboard (`src/components/Keyboard/`)
Touch-enabled piano keyboard using pointer events. Supports multi-touch, slide between keys, and physical keyboard input (ASDF row = white keys, WE/TY/OP = black keys). Pointer capture provides reliable tracking.

### Presets (`src/store/presets.ts`)
9 named presets that define complete synth state (all bank volumes/pitches, synth params, effects).

### PWA (`vite.config.ts`)
Service worker caches all assets including 176 audio samples (~3MB). App is installable as standalone.

## Conventions

- Co-located CSS files per component (e.g., `Keyboard.tsx` + `Keyboard.css`)
- Sound bank IDs are lowercase: `p1`, `p2`, `w1`, `w2`
- Note naming format: `{octave}{note}{sharp}` (e.g., `2csharp`)
- All TypeScript types in `src/types/index.ts`
- Functional components with hooks only (no class components)
- Mobile-first responsive design with breakpoints at 600px, 1300px, 1680px
- Retro aesthetic: "Early GameBoy" font, green accent (#80b027), LCD-style display
