import { useCallback, useRef, useEffect } from 'react'
import { useSynthStore } from '../../store/synthStore'
import { getAudioEngine } from '../../App'
import { Key } from './Key'
import { NOTE_NAMES } from '../../types'
import './Keyboard.css'

// Map physical keyboard keys to note indices
const KEY_MAP: Record<string, number> = {
  // Lower row (white keys)
  'a': 0,  // F
  's': 2,  // G
  'd': 4,  // A
  'f': 6,  // B
  'g': 7,  // C
  'h': 9,  // D
  'j': 11, // E
  'k': 12, // F
  'l': 14, // G
  ';': 16, // A
  // Upper row (black keys)
  'w': 1,  // F#
  'e': 3,  // G#
  't': 5,  // A#
  'y': 8,  // C#
  'u': 10, // D#
  'o': 13, // F#
  'p': 15, // G#
}

interface PointerState {
  pointerId: number
  currentKeyIndex: number | null
}

export function Keyboard() {
  const { pressedKeys, pressKey, releaseKey } = useSynthStore()
  const containerRef = useRef<HTMLDivElement>(null)
  const keyRefs = useRef<(HTMLDivElement | null)[]>([])
  const pointerStates = useRef<Map<number, PointerState>>(new Map())

  // Get key index from screen coordinates
  const getKeyIndexFromPoint = useCallback((x: number, y: number): number | null => {
    // Check black keys first (they're on top visually)
    for (let i = 0; i < NOTE_NAMES.length; i++) {
      if (!isBlackKey(i)) continue
      const el = keyRefs.current[i]
      if (!el) continue

      const rect = el.getBoundingClientRect()
      if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
        return i
      }
    }

    // Then check white keys
    for (let i = 0; i < NOTE_NAMES.length; i++) {
      if (isBlackKey(i)) continue
      const el = keyRefs.current[i]
      if (!el) continue

      const rect = el.getBoundingClientRect()
      if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
        return i
      }
    }

    return null
  }, [])

  const handleNoteOn = useCallback((index: number) => {
    pressKey(index)
    getAudioEngine()?.playNote(index)
  }, [pressKey])

  const handleNoteOff = useCallback((index: number) => {
    releaseKey(index)
    getAudioEngine()?.stopNote(index)
  }, [releaseKey])

  // Pointer event handlers for touch slide support
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    e.preventDefault()
    const target = e.currentTarget as HTMLElement
    target.setPointerCapture(e.pointerId)

    const keyIndex = getKeyIndexFromPoint(e.clientX, e.clientY)

    pointerStates.current.set(e.pointerId, {
      pointerId: e.pointerId,
      currentKeyIndex: keyIndex
    })

    if (keyIndex !== null) {
      handleNoteOn(keyIndex)
    }
  }, [getKeyIndexFromPoint, handleNoteOn])

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    const state = pointerStates.current.get(e.pointerId)
    if (!state) return

    const newKeyIndex = getKeyIndexFromPoint(e.clientX, e.clientY)
    const oldKeyIndex = state.currentKeyIndex

    if (newKeyIndex !== oldKeyIndex) {
      // Finger slid to a different key
      if (oldKeyIndex !== null) {
        handleNoteOff(oldKeyIndex)
      }

      if (newKeyIndex !== null) {
        handleNoteOn(newKeyIndex)
      }

      state.currentKeyIndex = newKeyIndex
    }
  }, [getKeyIndexFromPoint, handleNoteOn, handleNoteOff])

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    const state = pointerStates.current.get(e.pointerId)
    if (!state) return

    if (state.currentKeyIndex !== null) {
      handleNoteOff(state.currentKeyIndex)
    }

    pointerStates.current.delete(e.pointerId)
  }, [handleNoteOff])

  const handlePointerCancel = useCallback((e: React.PointerEvent) => {
    handlePointerUp(e)
  }, [handlePointerUp])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return
      const index = KEY_MAP[e.key.toLowerCase()]
      if (index !== undefined && !pressedKeys.has(index)) {
        handleNoteOn(index)
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      const index = KEY_MAP[e.key.toLowerCase()]
      if (index !== undefined) {
        handleNoteOff(index)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [pressedKeys, handleNoteOn, handleNoteOff])

  // Build keyboard layout
  const whiteKeys: number[] = []
  const blackKeys: { index: number; position: number }[] = []

  let whiteKeyPosition = 0
  for (let i = 0; i < NOTE_NAMES.length; i++) {
    if (isBlackKey(i)) {
      // Black key goes after previous white key
      blackKeys.push({ index: i, position: whiteKeyPosition - 1 })
    } else {
      whiteKeys.push(i)
      whiteKeyPosition++
    }
  }

  return (
    <div
      ref={containerRef}
      className="keyboard"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      onPointerLeave={handlePointerUp}
    >
      <div className="keyboard-keys">
        {/* White keys */}
        {whiteKeys.map((noteIndex, position) => (
          <Key
            key={noteIndex}
            ref={(el) => { keyRefs.current[noteIndex] = el }}
            isBlack={false}
            isPressed={pressedKeys.has(noteIndex)}
            style={{ left: `calc(${position} * var(--white-key-width))` }}
          />
        ))}

        {/* Black keys */}
        {blackKeys.map(({ index, position }) => (
          <Key
            key={index}
            ref={(el) => { keyRefs.current[index] = el }}
            isBlack={true}
            isPressed={pressedKeys.has(index)}
            style={{ left: `calc(${position} * var(--white-key-width) + var(--white-key-width) - var(--black-key-width) / 2)` }}
          />
        ))}
      </div>
    </div>
  )
}

// Helper to determine if a note index is a black key
function isBlackKey(index: number): boolean {
  const noteName = NOTE_NAMES[index]
  return noteName.includes('sharp')
}
