// Portrait keyboard S-curve layout
// SVG viewBox: 0 0 100 100
// Flow: top-right (lowest, C) → bottom-left (highest, B)
//
// Segments:
//   1: Top row (R→L)    y=0–18    x=0–100    4W + 3B
//   2: Left vert (↓)    y=22–42   x=0–25     2W + 1B
//   3: Middle row (L→R) y=46–64   x=25–75    3W + 2B
//   4: Right vert (↓)   y=66–80   x=75–100   1W + 1B
//   5: Bottom row (R→L) y=82–100  x=0–100    4W + 3B

export interface PortraitKey {
  noteIndex: number
  isBlack: boolean
  points: string
}

export const PORTRAIT_NOTE_START = 7
export const PORTRAIT_NOTE_END = 30

export const PORTRAIT_KEYS: PortraitKey[] = [
  // ── SEGMENT 1 — Top row (R→L) ─────────────────────────────
  // y=0–18, full width. Black keys at top edge (y=0–9)

  // White keys (25 wide each)
  { noteIndex: 7,  isBlack: false, points: '75,0 100,0 100,18 75,18' },         // C
  { noteIndex: 9,  isBlack: false, points: '50,0 75,0 75,18 50,18' },           // D
  { noteIndex: 11, isBlack: false, points: '25,0 50,0 50,18 25,18' },           // E
  // F — L-shape wrapping into left transition
  { noteIndex: 12, isBlack: false, points: '0,0 25,0 25,18 13,18 13,24 0,24' }, // F

  // Black keys (10 wide, height 9)
  { noteIndex: 8,  isBlack: true, points: '70,0 80,0 80,9 70,9' },              // C#
  { noteIndex: 10, isBlack: true, points: '45,0 55,0 55,9 45,9' },              // D#
  // F# at the corner transition between F and G
  { noteIndex: 13, isBlack: true, points: '0,15 9,15 9,23 0,23' },              // F#

  // ── SEGMENT 2 — Left vertical (↓) ─────────────────────────
  // x=0–25, y=22–42. Black key on left (outer) edge
  // Keys are horizontal rectangles (rotated 90°)

  { noteIndex: 14, isBlack: false, points: '0,26 25,26 25,34 0,34' },           // G
  { noteIndex: 16, isBlack: false, points: '0,36 25,36 25,44 0,44' },           // A

  { noteIndex: 15, isBlack: true, points: '0,32 7,32 7,39 0,39' },              // G#

  // ── SEGMENT 3 — Middle row (L→R) ──────────────────────────
  // y=46–64, x=25–75. Black keys at top edge (y=46–55)

  // White keys (~17 wide each)
  { noteIndex: 18, isBlack: false, points: '25,46 42,46 42,64 25,64' },         // B
  { noteIndex: 19, isBlack: false, points: '42,46 58,46 58,64 42,64' },         // C
  { noteIndex: 21, isBlack: false, points: '58,46 75,46 75,64 58,64' },         // D

  { noteIndex: 17, isBlack: true, points: '25,46 35,46 35,55 25,55' },          // A#
  { noteIndex: 20, isBlack: true, points: '53,46 63,46 63,55 53,55' },          // C#

  // ── SEGMENT 4 — Right vertical (↓) ────────────────────────
  // x=75–100, y=66–80. Black key on right (outer) edge

  { noteIndex: 23, isBlack: false, points: '75,72 100,72 100,80 75,80' },       // E

  { noteIndex: 22, isBlack: true, points: '93,66 100,66 100,74 93,74' },        // D#

  // ── SEGMENT 5 — Bottom row (R→L) ──────────────────────────
  // y=82–100, full width. Black keys at bottom edge (y=91–100)

  // White keys (25 wide each)
  { noteIndex: 24, isBlack: false, points: '75,82 100,82 100,100 75,100' },     // F
  { noteIndex: 26, isBlack: false, points: '50,82 75,82 75,100 50,100' },       // G
  { noteIndex: 28, isBlack: false, points: '25,82 50,82 50,100 25,100' },       // A
  { noteIndex: 30, isBlack: false, points: '0,82 25,82 25,100 0,100' },         // B

  { noteIndex: 25, isBlack: true, points: '70,91 80,91 80,100 70,100' },        // F#
  { noteIndex: 27, isBlack: true, points: '45,91 55,91 55,100 45,100' },        // G#
  { noteIndex: 29, isBlack: true, points: '20,91 30,91 30,100 20,100' },        // A#
]
