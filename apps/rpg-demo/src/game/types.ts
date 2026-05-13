import type { EquipmentId, EquipmentLoadout } from './equipment'
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

export type StatusEffectId = 'poison' | 'burn' | 'stun' | 'shield'

export interface StatusEffect {
  id: StatusEffectId
  /** Remaining turns; ticked down at the start of the owner's turn. */
  duration: number
  /** Per-tick damage for DoTs, or absorbed amount for shields. */
  magnitude: number
}

export interface Combatant extends Stats {
  id: string
  name: string
  level: number
  /** Defensive stance halves incoming damage for one enemy turn. */
  defending: boolean
  /** Active status effects (poison, burn, stun, shield). */
  statuses: StatusEffect[]
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
  /** What the hero is currently wearing. */
  equipped: EquipmentLoadout
  /** Pieces of equipment the hero owns (equipped or stored). */
  ownedEquipment: EquipmentId[]
}

/** Boss-only state. Currently tracks phase and the next telegraphed attack. */
export interface BossState {
  phase: 1 | 2
  /** Set after the boss "winds up" so the next turn can fire a heavy attack. */
  telegraph: 'fire-breath' | null
}

export interface Enemy extends Combatant {
  xpReward: number
  goldReward: number
  /** When true, the player cannot Run from this encounter. */
  isBoss?: boolean
  /** Chance (0-1) that a basic attack inflicts poison. */
  poisonChance?: number
  /** Chance (0-1) that a basic attack inflicts stun. */
  stunChance?: number
  /** Multi-phase boss bookkeeping. */
  bossState?: BossState
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
