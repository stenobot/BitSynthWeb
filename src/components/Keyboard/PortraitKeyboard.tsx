import { useCallback, useRef, useEffect } from 'react'
import { useSynthStore } from '../../store/synthStore'
import { useLoopStore } from '../../store/loopStore'
import { getAudioEngine } from '../../App'
import { PORTRAIT_KEYS } from './portraitKeyShapes'
import './PortraitKeyboard.css'

interface PointerState {
  pointerId: number
  currentNoteIndex: number | null
}

export function PortraitKeyboard() {
  const { pressedKeys, pressKey, releaseKey } = useSynthStore()
  const svgRef = useRef<SVGSVGElement>(null)
  const pointerStates = useRef<Map<number, PointerState>>(new Map())

  // Get note index from screen coordinates using SVG hit testing
  const getNoteIndexFromPoint = useCallback((x: number, y: number): number | null => {
    const el = document.elementFromPoint(x, y) as SVGElement | null
    if (!el) return null
    const noteAttr = el.getAttribute('data-note-index')
    if (noteAttr === null) return null
    return parseInt(noteAttr, 10)
  }, [])

  const handleNoteOn = useCallback((index: number) => {
    const engine = getAudioEngine()
    if (engine) {
      engine.ensureContextResumed()
      engine.playNote(index)
    }
    pressKey(index)
    useLoopStore.getState().recordEvent('press', index)
  }, [pressKey])

  const handleNoteOff = useCallback((index: number) => {
    releaseKey(index)
    getAudioEngine()?.stopNote(index)
    useLoopStore.getState().recordEvent('release', index)
  }, [releaseKey])

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    e.preventDefault()
    const target = e.currentTarget as SVGSVGElement
    target.setPointerCapture(e.pointerId)

    const noteIndex = getNoteIndexFromPoint(e.clientX, e.clientY)

    pointerStates.current.set(e.pointerId, {
      pointerId: e.pointerId,
      currentNoteIndex: noteIndex
    })

    if (noteIndex !== null) {
      handleNoteOn(noteIndex)
    }
  }, [getNoteIndexFromPoint, handleNoteOn])

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    const state = pointerStates.current.get(e.pointerId)
    if (!state) return

    const newNoteIndex = getNoteIndexFromPoint(e.clientX, e.clientY)
    const oldNoteIndex = state.currentNoteIndex

    if (newNoteIndex !== oldNoteIndex) {
      if (oldNoteIndex !== null) {
        handleNoteOff(oldNoteIndex)
      }
      if (newNoteIndex !== null) {
        handleNoteOn(newNoteIndex)
      }
      state.currentNoteIndex = newNoteIndex
    }
  }, [getNoteIndexFromPoint, handleNoteOn, handleNoteOff])

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    const state = pointerStates.current.get(e.pointerId)
    if (!state) return

    if (state.currentNoteIndex !== null) {
      handleNoteOff(state.currentNoteIndex)
    }
    pointerStates.current.delete(e.pointerId)
  }, [handleNoteOff])

  // Release all notes on unmount (e.g. orientation change)
  useEffect(() => {
    return () => {
      const { pressedKeys: keys, releaseKey: release } = useSynthStore.getState()
      const engine = getAudioEngine()
      keys.forEach((noteIndex) => {
        release(noteIndex)
        engine?.stopNote(noteIndex)
      })
    }
  }, [])

  // Separate white and black keys for correct paint order
  const whiteKeys = PORTRAIT_KEYS.filter(k => !k.isBlack)
  const blackKeys = PORTRAIT_KEYS.filter(k => k.isBlack)

  return (
    <div className="portrait-keyboard">
      <svg
        ref={svgRef}
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        {/* White keys first (behind black keys) */}
        {whiteKeys.map(key => (
          <path
            key={key.noteIndex}
            data-note-index={key.noteIndex}
            d={key.d}
            fill={pressedKeys.has(key.noteIndex) ? '#80b027' : '#ffffff'}
            stroke="#ccc"
            strokeWidth="0.5"
            style={{ pointerEvents: 'all' }}
          />
        ))}

        {/* Black keys on top */}
        {blackKeys.map(key => (
          <path
            key={key.noteIndex}
            data-note-index={key.noteIndex}
            d={key.d}
            fill={pressedKeys.has(key.noteIndex) ? '#80b027' : '#1a1a1a'}
            stroke="#333"
            strokeWidth="0.5"
            style={{ pointerEvents: 'all' }}
          />
        ))}
      </svg>
    </div>
  )
}
