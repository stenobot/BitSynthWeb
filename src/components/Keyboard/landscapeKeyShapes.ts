// Landscape keyboard split layout
// SVG viewBox: 0 0 200 75
//
// Left half:  x=0–100,  notes 6–17  (B→A#), L→R low to high
// Right half: x=100–200, notes 18–29 (B→A#), R→L low to high (mirrored)
// Center:     full ellipse key (note 30, B), center (100,35) rx=12 ry=19
//
// White key widths taper from narrow (low/outer) to wide (high/inner):
//   B=10.86  C=12.00  D=13.14  E=14.29  F=15.43  G=16.57  A=17.71  (step ≈1.14)
//   Total per half = 100.  G/A boundary stays at x=82.29 / x=117.71.
//
// Left half x positions:
//   B(0–10.86)  C(10.86–22.86)  D(22.86–36)  E(36–50.29)
//   F(50.29–65.71)  G(65.71–82.29)  A(82.29–100)
//
// The A keys extend to x=100, hugging the ellipse on their inner edge.
// Ellipse: top y=16, bottom y=54; left x=88, right x=112.
//
// Black keys: C#/D#/F# centered on white-key boundaries; G# and A# shifted toward center.
// Black key width 8, bottom corners rounded r=1.5, height y=0–22.

export interface LandscapeKey {
  noteIndex: number
  isBlack: boolean
  d: string // SVG path data
}

export const LANDSCAPE_NOTE_START = 6
export const LANDSCAPE_NOTE_END = 30

export const LANDSCAPE_KEYS: LandscapeKey[] = [
  // ── LEFT HALF — White keys ────────────────────────────────────
  // B: outermost, top-left and bottom-left corners rounded (r=2.5)
  { noteIndex: 6,  isBlack: false, d: 'M2.5,0 Q0,0 0,2.5 V69.5 Q0,72 2.5,72 H10.86 V0 Z' },
  { noteIndex: 7,  isBlack: false, d: 'M10.86,0 H22.86 V72 H10.86 Z' },
  { noteIndex: 9,  isBlack: false, d: 'M22.86,0 H36 V72 H22.86 Z' },
  { noteIndex: 11, isBlack: false, d: 'M36,0 H50.29 V72 H36 Z' },
  { noteIndex: 12, isBlack: false, d: 'M50.29,0 H65.71 V72 H50.29 Z' },
  { noteIndex: 14, isBlack: false, d: 'M65.71,0 H82.29 V72 H65.71 Z' },
  // A: inner edge follows the left arc of the ellipse (large-arc CCW from y=16 to y=54)
  { noteIndex: 16, isBlack: false, d: 'M82.29,0 H100 V16 A12,19 0 1,0 100,54 V72 H82.29 Z' },

  // ── LEFT HALF — Black keys (triangle pairs) ──────────────────
  // Pair 1: C#(8) + D#(10) — upside-down triangle, apex at x=29.43
  { noteIndex: 8,  isBlack: true, d: 'M16.43,0 H29.43 V36 Z' },        // C# left half
  { noteIndex: 10, isBlack: true, d: 'M29.43,0 H42.43 L29.43,36 Z' },  // D# right half
  // Pair 2: F#(13) + G#(15) — upside-down triangle, apex at x=74
  { noteIndex: 13, isBlack: true, d: 'M61,0 H74 V36 Z' },               // F# left half
  { noteIndex: 15, isBlack: true, d: 'M74,0 H87 L74,36 Z' },            // G# right half
  // Pair 3 (left): A#(17) — left half of center triangle, apex at x=100
  { noteIndex: 17, isBlack: true, d: 'M87,0 H100 V36 Z' },              // A# left half

  // ── RIGHT HALF — White keys ───────────────────────────────────
  // B: outermost, top-right and bottom-right corners rounded (r=2.5)
  { noteIndex: 18, isBlack: false, d: 'M189.14,0 H197.5 Q200,0 200,2.5 V69.5 Q200,72 197.5,72 H189.14 Z' },
  { noteIndex: 19, isBlack: false, d: 'M177.14,0 H189.14 V72 H177.14 Z' },
  { noteIndex: 21, isBlack: false, d: 'M164,0 H177.14 V72 H164 Z' },
  { noteIndex: 23, isBlack: false, d: 'M149.71,0 H164 V72 H149.71 Z' },
  { noteIndex: 24, isBlack: false, d: 'M134.29,0 H149.71 V72 H134.29 Z' },
  { noteIndex: 26, isBlack: false, d: 'M117.71,0 H134.29 V72 H117.71 Z' },
  // A: inner edge follows the right arc of the ellipse (large-arc CW from y=16 to y=54)
  { noteIndex: 28, isBlack: false, d: 'M100,0 V16 A12,19 0 1,1 100,54 V72 H117.71 V0 Z' },

  // ── CENTER — Full ellipse key (note 30, B) ────────────────────
  // rx=12, ry=19 — center (100,35), spans y=16–54, x=88–112
  { noteIndex: 30, isBlack: false, d: 'M88,35 A12,19 0 1,0 112,35 A12,19 0 1,0 88,35 Z' },

  // ── RIGHT HALF — Black keys (triangle pairs) ─────────────────
  // Pair 3 (right): A#(29) — right half of center triangle, apex at x=100
  { noteIndex: 29, isBlack: true, d: 'M100,0 H113 L100,36 Z' },          // A# right half
  // Pair 4: G#(27) + F#(25) — upside-down triangle, apex at x=126
  { noteIndex: 27, isBlack: true, d: 'M113,0 H126 V36 Z' },              // G# left half
  { noteIndex: 25, isBlack: true, d: 'M126,0 H139 L126,36 Z' },          // F# right half
  // Pair 5: D#(22) + C#(20) — upside-down triangle, apex at x=170.57
  { noteIndex: 22, isBlack: true, d: 'M157.57,0 H170.57 V36 Z' },        // D# left half
  { noteIndex: 20, isBlack: true, d: 'M170.57,0 H183.57 L170.57,36 Z' }, // C# right half
]
