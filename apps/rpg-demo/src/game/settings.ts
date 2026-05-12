export type Difficulty = 'easy' | 'normal' | 'hard'

export interface Settings {
  sound: boolean
  scanlines: boolean
  difficulty: Difficulty
}

export const DEFAULT_SETTINGS: Settings = {
  sound: true,
  scanlines: false,
  difficulty: 'normal',
}

/**
 * Multiplier applied to damage the player takes. Easy → 0.75 (less damage),
 * Normal → 1, Hard → 1.5. Used in `resolveTurn` when computing the enemy's
 * attack damage.
 */
export const DIFFICULTY_DAMAGE_MULT: Record<Difficulty, number> = {
  easy: 0.75,
  normal: 1,
  hard: 1.5,
}

/**
 * Multiplier applied to XP and gold rewards on victory. Easy gives less,
 * Hard gives more — so Hard is risky but rewarding.
 */
export const DIFFICULTY_REWARD_MULT: Record<Difficulty, number> = {
  easy: 0.8,
  normal: 1,
  hard: 1.5,
}
