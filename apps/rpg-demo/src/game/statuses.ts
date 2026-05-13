import type { StatusEffect, StatusEffectId } from './types'

export interface StatusTemplate {
  id: StatusEffectId
  name: string
  /** Short blurb shown in tooltips. */
  description: string
  /** Visual tint used by chips and the battle log. */
  variant: 'danger' | 'success' | 'warning' | 'info'
  /** Whether the effect counts as a debuff (true) or a buff. Used for UI sorting. */
  debuff: boolean
}

export const STATUS_TEMPLATES: Record<StatusEffectId, StatusTemplate> = {
  poison: {
    id: 'poison',
    name: 'Poison',
    description: 'Saps HP at the start of each turn.',
    variant: 'success',
    debuff: true,
  },
  burn: {
    id: 'burn',
    name: 'Burn',
    description: 'Searing fire chews through HP each turn.',
    variant: 'danger',
    debuff: true,
  },
  stun: {
    id: 'stun',
    name: 'Stun',
    description: 'Cannot act on the next turn.',
    variant: 'warning',
    debuff: true,
  },
  shield: {
    id: 'shield',
    name: 'Shield',
    description: 'Absorbs the next incoming hit completely.',
    variant: 'info',
    debuff: false,
  },
}

/** Build a fresh status effect of the given kind. */
export function makeStatus(
  id: StatusEffectId,
  duration: number,
  magnitude = 0,
): StatusEffect {
  return { id, duration, magnitude }
}

/**
 * Apply (or refresh) a status effect on a combatant. If a status of the same
 * id already exists we keep whichever has the longer remaining duration, and
 * take the higher magnitude. Avoids stacking surprises.
 */
export function withStatus(
  statuses: StatusEffect[] | undefined,
  next: StatusEffect,
): StatusEffect[] {
  const existing = statuses ?? []
  const found = existing.find((s) => s.id === next.id)
  if (!found) return [...existing, next]
  return existing.map((s) =>
    s.id === next.id
      ? {
          ...s,
          duration: Math.max(s.duration, next.duration),
          magnitude: Math.max(s.magnitude, next.magnitude),
        }
      : s,
  )
}

export function hasStatus(
  statuses: StatusEffect[] | undefined,
  id: StatusEffectId,
): boolean {
  return !!statuses?.some((s) => s.id === id)
}

export function removeStatus(
  statuses: StatusEffect[] | undefined,
  id: StatusEffectId,
): StatusEffect[] {
  return (statuses ?? []).filter((s) => s.id !== id)
}

/** Decrement durations and drop any effect that hit zero. */
export function decayStatuses(statuses: StatusEffect[] | undefined): StatusEffect[] {
  return (statuses ?? [])
    .map((s) => ({ ...s, duration: s.duration - 1 }))
    .filter((s) => s.duration > 0)
}
