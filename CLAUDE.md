# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

- `npm run dev` — Start Vite dev server
- `npm run build` — TypeScript compile (`tsc -b`) then Vite production build
- `npm run lint` — ESLint on src directory
- `npm run preview` — Preview production build locally

No test framework is configured.

## Deployment

GitHub Actions (`.github/workflows/deploy.yml`) deploys to GitHub Pages on push to `main`. The build outputs to `dist/` and is served as a static site. PWA service worker (via `vite-plugin-pwa`) precaches all assets including ~264 OGG audio samples for offline support.

## Architecture

BitSynthWeb is an 8-bit synthesizer web app built with React, Zustand, and the Web Audio API.

### Audio Engine (`src/audio/`)

`AudioEngine.ts` is the core — a singleton accessed via `getAudioEngine()` exported from `App.tsx`. It owns:

- A single `AudioContext` with per-bank gain nodes feeding into a master gain
- **Sample playback**: 4 banks (P1, P2, W1, W2) × 37 notes × 2 variants (normal + loop) loaded as OGG files from `public/samples/`
- **Oscillator synthesis**: Synth bank generates waveforms (sine/square/sawtooth/triangle) with biquad lowpass filter and ADSR envelope
- **Effects chain**: Master → dry/wet split → EchoEffect (delay + feedback) and ReverbEffect (procedural convolver impulse response) → destination

Voice tracking uses `activeVoices` Map (samples) and `activeSynthVoices` Map (oscillators), keyed by note name.

### State Management (`src/store/synthStore.ts`)

Single Zustand store with `subscribeWithSelector` middleware. Key state shape:
- Loading state (progress, bank label)
- Master volume (0–11), active preset index
- 4 sound banks: each has volume (`'off'|'low'|'high'`), loop, pitch (0.5–2.0)
- Synth bank: waveform, filterCutoff, attack, release, length
- Effects: echo (delay, feedback, wet) and reverb (decay, density, wet), each toggleable
- `pressedKeys` Set for keyboard visual feedback

### Control Flow

`ControlPanel.tsx` bridges store ↔ AudioEngine: `useEffect` hooks watch store values and call corresponding AudioEngine methods. The Keyboard component handles both physical keyboard and multitouch pointer events, checking black keys before white keys for hit detection.

### Initialization

App mounts → AudioEngine loads all sample buffers with progress callbacks → store updates drive `LoadingScreen` → once complete, renders Keyboard + ControlPanel.

### Presets (`src/store/presets.ts`)

Array of complete state snapshots. `applyPreset()` does bulk state replacement across all banks and effects.

## Conventions

- All TypeScript interfaces and constants live in `src/types/index.ts`
- CSS uses BEM naming (`.control-panel__section`, `.key--pressed`) with custom properties for theming
- Theme colors: dark bg `#1a1a1a`, accent `#80b027` (lime green)
- Responsive breakpoints: 600px (mobile), 1300px (desktop), 1680px (large)
- Asset URLs use `import.meta.env.BASE_URL` prefix (set via `base` in vite.config.ts)
- Commit style: lowercase, descriptive, no conventional-commit prefixes

## Known Issues

- Loop samples for P1/P2 banks are disabled in UI (`loopDisabled` flag) pending sample file fixes
