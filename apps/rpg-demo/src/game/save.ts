import type { GameState } from '../App'
import type { Settings } from './settings'

const STORAGE_KEY = 'pixelore-quest:save:v2'
const SETTINGS_KEY = 'pixelore-quest:settings:v1'

interface SavePayload {
  version: 2
  state: GameState
}

/**
 * Read the saved game from localStorage. Returns null if no save exists or
 * the save is from a different schema version (treated as missing — we wipe
 * on mismatch rather than attempting a migration, since this is a demo).
 */
export function loadSave(): GameState | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as SavePayload
    if (parsed.version !== 2) return null
    return parsed.state
  } catch {
    return null
  }
}

export function writeSave(state: GameState): void {
  if (typeof window === 'undefined') return
  try {
    const payload: SavePayload = { version: 2, state }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
  } catch {
    // Quota exceeded / private mode — silently ignore. The player keeps
    // playing; their next refresh won't restore but the session is fine.
  }
}

export function clearSave(): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.removeItem(STORAGE_KEY)
  } catch {
    // ignore
  }
}

export function hasSave(): boolean {
  if (typeof window === 'undefined') return false
  return window.localStorage.getItem(STORAGE_KEY) !== null
}

export function loadSettings(): Settings | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(SETTINGS_KEY)
    if (!raw) return null
    return JSON.parse(raw) as Settings
  } catch {
    return null
  }
}

export function writeSettings(settings: Settings): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
  } catch {
    // ignore
  }
}
