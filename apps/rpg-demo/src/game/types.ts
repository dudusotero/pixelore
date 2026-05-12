import type { ItemId } from './items'

export interface Stats {
  hp: number
  maxHp: number
  mp: number
  maxMp: number
  atk: number
  def: number
  spd: number
}

export interface Combatant extends Stats {
  id: string
  name: string
  sprite: string
  level: number
  /** Defensive stance halves incoming damage for one enemy turn. */
  defending: boolean
}

export type HeroClass = 'warrior' | 'mage' | 'rogue'

export interface Hero extends Combatant {
  xp: number
  xpToNext: number
  /** Number of times the player can survive a defeat. */
  lives: number
  maxLives: number
  /** Gold for buying items at the merchant. */
  gold: number
  /** Picked at new-game time; affects starting stats and crit chance. */
  heroClass: HeroClass
}

export interface Enemy extends Combatant {
  xpReward: number
  goldReward: number
  /** When true, the player cannot Run from this encounter. */
  isBoss?: boolean
}

export type Screen = 'title' | 'map' | 'battle' | 'victory' | 'defeat' | 'inventory'

export type BattleAction =
  | { kind: 'attack' }
  | { kind: 'magic'; skillId: 'fireball' | 'heal' }
  | { kind: 'item'; itemId: ItemId }
  | { kind: 'defend' }
  | { kind: 'run' }

export interface BattleEvent {
  id: number
  text: string
  variant?: 'damage' | 'heal' | 'crit' | 'miss' | 'info' | 'success' | 'fail'
}

export interface MapPosition {
  x: number
  y: number
}
