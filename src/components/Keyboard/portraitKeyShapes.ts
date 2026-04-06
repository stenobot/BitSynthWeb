// Portrait keyboard S-curve layout
// SVG viewBox: 0 0 100 100
// Flow: top-right (lowest, B) → bottom-left (highest, B)
//
// Segments:
//   1: Top row (R→L)    y=0–32    x=0–100    5W + 3B  (B,C,D,E,F + C#,D#,F#)
//   2: Row 2 (L→R)      y=34–66   x=0–100    5W + 3B + D# (right-side transition)
//   3: Bottom row (R→L) y=68–100  x=0–100    5W + 3B

export interface PortraitKey {
  noteIndex: number
  isBlack: boolean
  d: string // SVG path data
}

export const PORTRAIT_NOTE_START = 6
export const PORTRAIT_NOTE_END = 30

export const PORTRAIT_KEYS: PortraitKey[] = [
  // ── SEGMENT 1 — Top row (R→L) ─────────────────────────────
  // y=0–32, full width. 5 white keys (20 wide each), black keys at top edge (y=0–13)

  // White keys
  { noteIndex: 6,  isBlack: false, d: 'M80,0 H97 Q100,0 100,3 V29 Q100,32 97,32 H80 Z' }, // B
  { noteIndex: 7,  isBlack: false, d: 'M60,0 H80 V32 H60 Z' },                                     // C
  { noteIndex: 9,  isBlack: false, d: 'M40,0 H60 V32 H40 Z' },                                     // D
  { noteIndex: 11, isBlack: false, d: 'M20,0 H40 V32 H22.29 A2.5,2.5 0 0,0 20,30.5 V0 Z' },         // E
  { noteIndex: 12, isBlack: false, d: 'M8,0 Q0,0 0,8 V33 H17.5 A2.5,2.5 0 0,1 20,30.5 V0 Z' },   // F

  // Black keys (14 wide, height 13)
  { noteIndex: 8,  isBlack: true, d: 'M50,0 H71 L70,9 A2,2 0 0,1 68,11 H53 A2,2 0 0,1 51,9 Z' },   // C#
  { noteIndex: 10, isBlack: true, d: 'M29,0 H49 L48,9 A2,2 0 0,1 46,11 H32 A2,2 0 0,1 30,9 Z' },   // D#
  // F# at the corner transition between F and G
  { noteIndex: 13, isBlack: true, d: 'M0,20 L8,20.889 A2,2 0 0,1 9,22.889 V38 A2,2 0 0,1 7,40 L0,41 Z' }, // F#

  // ── SEGMENT 2 — Row 2 (L→R) ─────────────────────────────────
  // y=34–66, full width. Black keys at top edge (y=34–44)
  // 5 white keys (20 wide each, height 32)

  { noteIndex: 14, isBlack: false, d: 'M0,33 H17.5 A2.5,2.5 0 0,0 20,35.5 V66 H8 Q0,66 0,58 Z' }, // G
  { noteIndex: 16, isBlack: false, d: 'M22.29,34 H40 V66 H20 V35.5 A2.5,2.5 0 0,0 22.29,34 Z' }, // A
  { noteIndex: 18, isBlack: false, d: 'M40,34 H60 V66 H40 Z' },                // B
  { noteIndex: 19, isBlack: false, d: 'M60,34 H80 V64.5 A2.5,2.5 0 0,0 77.71,66 H60 Z' },       // C
  { noteIndex: 21, isBlack: false, d: 'M80,34 H92 Q100,34 100,42 V67 H82.5 A2.5,2.5 0 0,0 80,64.5 V34 Z' }, // D

  { noteIndex: 15, isBlack: true, d: 'M11,66 H30 L29,57 A2,2 0 0,0 27,55 H14 A2,2 0 0,0 12,57 Z' }, // G#
  { noteIndex: 17, isBlack: true, d: 'M31,66 H50 L49,57 A2,2 0 0,0 47,55 H34 A2,2 0 0,0 32,57 Z' }, // A#
  { noteIndex: 20, isBlack: true, d: 'M71,34 H90 L89,43 A2,2 0 0,1 87,45 H74 A2,2 0 0,1 72,43 Z' }, // C#
  // D# at the corner transition between D (21) and E (23), right-side mirror of F#
  { noteIndex: 22, isBlack: true, d: 'M100,54 L92,54.889 A2,2 0 0,0 91,56.889 V72 A2,2 0 0,0 93,74 L100,75 Z' }, // D#

  // ── SEGMENT 3 — Bottom row (R→L) ──────────────────────────
  // y=68–100, full width. Black keys at bottom edge (y=89–100)
  // 5 white keys (20 wide each, height 32)

  { noteIndex: 23, isBlack: false, d: 'M82.5,67 H100 V92 Q100,100 92,100 H80 V69.5 A2.5,2.5 0 0,0 82.5,67 Z' }, // E
  { noteIndex: 24, isBlack: false, d: 'M60,68 H77.71 A2.5,2.5 0 0,0 80,69.5 V100 H60 Z' },       // F
  { noteIndex: 26, isBlack: false, d: 'M40,68 H60 V100 H40 Z' },               // G
  { noteIndex: 28, isBlack: false, d: 'M20,68 H40 V100 H20 Z' },               // A
  { noteIndex: 30, isBlack: false, d: 'M3,68 Q0,68 0,71 V97 Q0,100 3,100 H20 V68 Z' }, // B

  { noteIndex: 25, isBlack: true, d: 'M51,100 H70 L69,91 A2,2 0 0,0 67,89 H54 A2,2 0 0,0 52,91 Z' }, // F#
  { noteIndex: 27, isBlack: true, d: 'M31,100 H50 L49,91 A2,2 0 0,0 47,89 H34 A2,2 0 0,0 32,91 Z' }, // G#
  { noteIndex: 29, isBlack: true, d: 'M11,100 H30 L29,91 A2,2 0 0,0 27,89 H14 A2,2 0 0,0 12,91 Z' }, // A#
]
