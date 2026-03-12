import { create } from 'zustand'
import type { NoteEvent, Recording } from '../types'
import { getAudioEngine } from '../App'
import { useSynthStore } from './synthStore'

const STORAGE_KEY = 'bitsynth-recording'
const MAX_DURATION = 30_000

function loadRecording(): Recording | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) return JSON.parse(stored)
  } catch {
    // ignore corrupt data
  }
  return null
}

function saveRecording(recording: Recording): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(recording))
}

// Module-level mutable state (not in Zustand to avoid re-renders)
let recordingStartTime = 0
let recordedEvents: NoteEvent[] = []
let playbackTimeouts: ReturnType<typeof setTimeout>[] = []
let playbackNotes: Set<number> = new Set()
let autoStopTimer: ReturnType<typeof setTimeout> | null = null

interface LoopState {
  recording: Recording | null
  isRecording: boolean
  isPlaying: boolean
  countdown: number | null
  startCountdown: () => void
  stopRecording: () => void
  togglePlayback: () => void
  recordEvent: (type: 'press' | 'release', noteIndex: number) => void
}

function stopAllPlaybackNotes() {
  const engine = getAudioEngine()
  const { releaseKey } = useSynthStore.getState()
  for (const noteIndex of playbackNotes) {
    engine?.stopNote(noteIndex)
    releaseKey(noteIndex)
  }
  playbackNotes.clear()
}

function clearPlayback() {
  for (const id of playbackTimeouts) clearTimeout(id)
  playbackTimeouts = []
  stopAllPlaybackNotes()
}

function scheduleLoop(recording: Recording) {
  const engine = getAudioEngine()
  if (!engine) return

  const { pressKey, releaseKey } = useSynthStore.getState()

  for (const event of recording.events) {
    const id = setTimeout(() => {
      if (event.type === 'press') {
        engine.playNote(event.noteIndex)
        pressKey(event.noteIndex)
        playbackNotes.add(event.noteIndex)
      } else {
        engine.stopNote(event.noteIndex)
        releaseKey(event.noteIndex)
        playbackNotes.delete(event.noteIndex)
      }
    }, event.time)
    playbackTimeouts.push(id)
  }

  // Schedule loop restart
  const loopId = setTimeout(() => {
    stopAllPlaybackNotes()
    const state = useLoopStore.getState()
    if (state.isPlaying && state.recording) {
      playbackTimeouts = []
      scheduleLoop(state.recording)
    }
  }, recording.duration)
  playbackTimeouts.push(loopId)
}

export const useLoopStore = create<LoopState>()((set, get) => ({
  recording: loadRecording(),
  isRecording: false,
  isPlaying: false,
  countdown: null,

  startCountdown: () => {
    // Stop playback if playing
    const state = get()
    if (state.isPlaying) {
      clearPlayback()
      set({ isPlaying: false })
    }

    set({ countdown: 3 })

    setTimeout(() => set({ countdown: 2 }), 1000)
    setTimeout(() => set({ countdown: 1 }), 2000)
    setTimeout(() => {
      // Start recording
      recordedEvents = []
      recordingStartTime = performance.now()
      set({ countdown: null, isRecording: true })

      // Auto-stop at 30 seconds
      autoStopTimer = setTimeout(() => {
        get().stopRecording()
      }, MAX_DURATION)
    }, 3000)
  },

  stopRecording: () => {
    if (autoStopTimer) {
      clearTimeout(autoStopTimer)
      autoStopTimer = null
    }

    const duration = Math.min(performance.now() - recordingStartTime, MAX_DURATION)
    const recording: Recording = {
      events: recordedEvents,
      duration,
    }
    saveRecording(recording)
    recordedEvents = []
    set({ isRecording: false, recording })
  },

  togglePlayback: () => {
    const state = get()
    if (state.isPlaying) {
      clearPlayback()
      set({ isPlaying: false })
    } else if (state.recording) {
      const engine = getAudioEngine()
      engine?.ensureContextResumed()
      set({ isPlaying: true })
      playbackTimeouts = []
      scheduleLoop(state.recording)
    }
  },

  recordEvent: (type, noteIndex) => {
    const state = get()
    if (!state.isRecording) return
    const time = performance.now() - recordingStartTime
    if (time > MAX_DURATION) return
    recordedEvents.push({ type, noteIndex, time })
  },
}))
