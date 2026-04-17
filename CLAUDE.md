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
- Zustand for state management (two stores: `synthStore` with `subscribeWithSelector`, `loopStore`)
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

### State Management
Two Zustand stores:

- **`src/store/synthStore.ts`** (`useSynthStore`): All synth parameters, active keys, preset data, and UI state. Store actions also update the display screen message. **ControlPanel is the only bridge between this store and AudioEngine** — it has useEffect hooks that push state changes into the engine whenever store slices change.
- **`src/store/loopStore.ts`** (`useLoopStore`): Loop recorder/playback. Records note press/release events with timestamps, persists to `localStorage`, plays back in a looping setTimeout-based scheduler. Uses module-level mutable variables (not Zustand) for in-flight recording/playback state to avoid unnecessary re-renders. Accesses the audio engine via `getAudioEngine()` imported from `App.tsx`.

### Keyboard (`src/components/Keyboard/`)
Touch-enabled piano keyboard using pointer events. Supports multi-touch, slide between keys, and physical keyboard input (ASDF row = white keys, WE/TY/OP = black keys). Pointer capture provides reliable tracking.

Three keyboard variants — `App.tsx` selects among them based on `useOrientation()` hook + `experimentalKeyboard` store flag (toggled in Settings):

- **`Keyboard.tsx`** — default keyboard, used in both orientations when experimental is off
- **`PortraitKeyboard.tsx`** — experimental S-shaped keyboard for portrait orientation; key shapes defined in `portraitKeyShapes.ts`
- **`LandscapeKeyboard.tsx`** — experimental split keyboard for landscape orientation; key shapes defined in `landscapeKeyShapes.ts`

The landscape experimental keyboard uses SVG viewBox `0 0 200 75` with `preserveAspectRatio="none"`. Layout:
- **Left half** (x=0–100): notes 6–17 (B→A#), low-to-high left-to-right; white key widths taper narrow→wide (B=10.86 to A=17.71, step≈1.14)
- **Right half** (x=100–200): notes 18–29 (B→A#), mirrored right-to-left
- **Center ellipse** (note 30): single oval key at center (100,35), rx=12 ry=19; the A keys on each side contour around the ellipse arc
- **Black keys**: 5 upside-down triangle pairs — each pair's two halves share an apex point and together form a downward-pointing triangle; pair 3 (A#17 + A#29) is centered on the ellipse

Hit testing uses `document.elementFromPoint()` + `data-note-index` attributes on SVG `<path>` elements. React keys on paths use index-based `w${i}`/`b${i}` (not noteIndex) to avoid duplicate key warnings.

### Presets (`src/store/presets.ts`)
9 named presets that define complete synth state (all bank volumes/pitches, synth params, effects). Custom presets are persisted to `localStorage` under keys `bitsynth-preset-0` through `bitsynth-preset-8`, overlaying the built-in defaults at load time.

### AudioEngine access pattern
`App.tsx` exports `getAudioEngine(): AudioEngine | null` — a module-level getter for the singleton. Components and stores call this function directly rather than using React context. Always null-check the result since the engine may not yet be initialized.

### PWA (`vite.config.ts`)
Service worker caches all assets including 176 audio samples (~3MB). App is installable as standalone.

### Global Settings (`src/store/globalSettings.ts`)
Persists user preferences (not preset data) to `localStorage` under the key `bitsynth-settings`. Currently stores `experimentalKeyboardPortrait`, `experimentalKeyboardLandscape`, and `pitchSnapEnabled`. Loaded once at module init; each setter in `synthStore` calls `saveGlobalSettings()` immediately on change.

## Known Bugs & Investigation Notes

### Pitch slider snap-back on touch screens (`src/components/Controls/PitchControl.tsx`)

**Symptom:** When pitch lock (`pitchSnapEnabled`) is on, the slider does not visually snap back to center immediately after the user lifts their finger on a touch screen. It only snapped back when something else triggered a re-render (e.g. pressing a piano key).

**Root cause (confirmed):** `useSynthStore()` without a selector causes `PitchControl` to re-render on *any* store change (including `pressedKeys`). The snap logic (`setMasterPitch(1.0)`) was always executing correctly on `pointerup` — the store updated to `1.0` immediately. The problem is purely visual: mobile browsers retain an internal touch-tracking state on `<input type="range">` even after `pointerup` fires, and during that window they ignore programmatic `value` changes (both from React's reconciler setting the `value` prop and from direct `element.value =` writes). The thumb only moved when the next *unrelated* re-render occurred, by which point the browser had released touch tracking.

**What was tried:**

1. **`onPointerUp` on the element + RAF + direct DOM write** — Made it worse. On mobile, React's synthetic `onPointerUp` on a range input does not reliably fire during touch interactions (the browser handles range inputs natively). Snap stopped working entirely.

2. **`window.addEventListener('pointerup')` + RAF for direct DOM write (current approach)** — Restored the window listener (which does fire reliably on mobile). `setMasterPitch(1.0)` is called synchronously to update the store, then a `requestAnimationFrame` callback sets `sliderRef.current.value = '0'` directly. The RAF fires after the browser exits the touch event cycle, at which point the programmatic value write is accepted and the thumb snaps visually. This approach works on desktop (mouse). **Not yet confirmed working on touch — needs device testing.**

**Key insight for future attempts:** Do not use `onPointerUp` (React synthetic event) on a range input for touch detection — use `window.addEventListener('pointerup')` instead, registered in an `onPointerDown` handler. The direct DOM ref write (`sliderRef.current.value`) is necessary because React's controlled input reconciliation alone is not enough to overcome the browser's touch-active state.

## Conventions

- Co-located CSS files per component (e.g., `Keyboard.tsx` + `Keyboard.css`)
- Sound bank IDs are lowercase: `p1`, `p2`, `w1`, `w2`
- Note naming format: `{octave}{note}{sharp}` (e.g., `2csharp`)
- All TypeScript types in `src/types/index.ts`
- Functional components with hooks only (no class components)
- Mobile-first responsive design with width breakpoints at 480px, 600px, 950px, 1300px, 1440px, 1680px and a height breakpoint at 424px
- Keyboard sizing is controlled via CSS custom properties in `src/styles/global.css` — black keys are full white-key width below 1300px (mobile/tablet) and 70% width on desktop (1300px+)
- Retro aesthetic: "Early GameBoy" font, green accent (#80b027), LCD-style display
