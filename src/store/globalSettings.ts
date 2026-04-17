const STORAGE_KEY = 'bitsynth-settings'

interface GlobalSettings {
  experimentalKeyboardPortrait: boolean
  experimentalKeyboardLandscape: boolean
  pitchSnapEnabled: boolean
}

const DEFAULTS: GlobalSettings = {
  experimentalKeyboardPortrait: true,
  experimentalKeyboardLandscape: false,
  pitchSnapEnabled: true,
}

function load(): GlobalSettings {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return { ...DEFAULTS, ...JSON.parse(stored) }
    }
  } catch {
    // ignore corrupt data
  }
  return { ...DEFAULTS }
}

export function saveGlobalSettings(patch: Partial<GlobalSettings>): void {
  const current = load()
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...current, ...patch }))
}

export const globalSettings = load()
