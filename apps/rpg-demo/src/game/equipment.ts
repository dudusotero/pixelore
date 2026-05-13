import type { Hero } from './types'

export type EquipmentId =
  | 'bronze-sword'
  | 'steel-sword'
  | 'mage-staff'
  | 'rogue-dagger'
  | 'leather-vest'
  | 'chain-mail'
  | 'mage-robe'
  | 'vigor-ring'
  | 'lucky-charm'
  | 'aegis-pendant'

export type EquipmentSlot = 'weapon' | 'armor' | 'trinket'

export interface StatBonuses {
  atk?: number
  def?: number
  spd?: number
  maxHp?: number
  maxMp?: number
  critBonus?: number
}

export interface EquipmentTemplate {
  id: EquipmentId
  name: string
  slot: EquipmentSlot
  description: string
  price: number
  bonuses: StatBonuses
  /** Optional perk applied at the start of battle. */
  passive?: 'grant-shield'
}

export const EQUIPMENT: Record<EquipmentId, EquipmentTemplate> = {
  'bronze-sword': {
    id: 'bronze-sword',
    name: 'Bronze Sword',
    slot: 'weapon',
    description: 'Cheap and reliable. +3 ATK.',
    price: 40,
    bonuses: { atk: 3 },
  },
  'steel-sword': {
    id: 'steel-sword',
    name: 'Steel Sword',
    slot: 'weapon',
    description: 'Heavier swing, harder hits. +6 ATK.',
    price: 110,
    bonuses: { atk: 6 },
  },
  'mage-staff': {
    id: 'mage-staff',
    name: 'Spark Staff',
    slot: 'weapon',
    description: 'Channels arcane currents. +3 ATK, +4 max MP, +4% crit.',
    price: 90,
    bonuses: { atk: 3, maxMp: 4, critBonus: 0.04 },
  },
  'rogue-dagger': {
    id: 'rogue-dagger',
    name: 'Twin Fang',
    slot: 'weapon',
    description: 'Quick steel. +3 ATK, +2 SPD, +5% crit.',
    price: 95,
    bonuses: { atk: 3, spd: 2, critBonus: 0.05 },
  },
  'leather-vest': {
    id: 'leather-vest',
    name: 'Leather Vest',
    slot: 'armor',
    description: 'Light protection. +3 DEF.',
    price: 50,
    bonuses: { def: 3 },
  },
  'chain-mail': {
    id: 'chain-mail',
    name: 'Chain Mail',
    slot: 'armor',
    description: 'Heavy iron rings. +6 DEF, -1 SPD.',
    price: 130,
    bonuses: { def: 6, spd: -1 },
  },
  'mage-robe': {
    id: 'mage-robe',
    name: 'Star Weave Robe',
    slot: 'armor',
    description: 'Soft on the body, kind to the mana. +2 DEF, +6 max MP.',
    price: 105,
    bonuses: { def: 2, maxMp: 6 },
  },
  'vigor-ring': {
    id: 'vigor-ring',
    name: 'Vigor Ring',
    slot: 'trinket',
    description: 'A pulse of life. +12 max HP.',
    price: 80,
    bonuses: { maxHp: 12 },
  },
  'lucky-charm': {
    id: 'lucky-charm',
    name: 'Lucky Charm',
    slot: 'trinket',
    description: 'Fortune favors the wearer. +8% crit.',
    price: 95,
    bonuses: { critBonus: 0.08 },
  },
  'aegis-pendant': {
    id: 'aegis-pendant',
    name: 'Aegis Pendant',
    slot: 'trinket',
    description: 'Grants a Shield at the start of every battle.',
    price: 160,
    bonuses: { def: 1 },
    passive: 'grant-shield',
  },
}

export type EquipmentLoadout = Partial<Record<EquipmentSlot, EquipmentId>>

export interface DerivedStats {
  atk: number
  def: number
  spd: number
  maxHp: number
  maxMp: number
  critBonus: number
}

/**
 * Resolve the hero's effective stats by layering equipment bonuses on top of
 * their base stats. Hero state itself stores base values only — combat reads
 * the derived numbers, so unequipping never leaves HP above the new cap.
 */
export function deriveStats(
  hero: Pick<Hero, 'atk' | 'def' | 'spd' | 'maxHp' | 'maxMp' | 'equipped'>,
): DerivedStats {
  let atk = hero.atk
  let def = hero.def
  let spd = hero.spd
  let maxHp = hero.maxHp
  let maxMp = hero.maxMp
  let critBonus = 0
  for (const slot of Object.values(hero.equipped ?? {})) {
    if (!slot) continue
    const item = EQUIPMENT[slot]
    atk += item.bonuses.atk ?? 0
    def += item.bonuses.def ?? 0
    spd += item.bonuses.spd ?? 0
    maxHp += item.bonuses.maxHp ?? 0
    maxMp += item.bonuses.maxMp ?? 0
    critBonus += item.bonuses.critBonus ?? 0
  }
  return { atk, def, spd, maxHp, maxMp, critBonus }
}

/** Equip a piece into its slot. Returns updated equipped map and previous occupant. */
export function equipPiece(
  loadout: EquipmentLoadout,
  id: EquipmentId,
): { loadout: EquipmentLoadout; replaced: EquipmentId | null } {
  const item = EQUIPMENT[id]
  const replaced = loadout[item.slot] ?? null
  return {
    loadout: { ...loadout, [item.slot]: id },
    replaced,
  }
}

export function unequipPiece(
  loadout: EquipmentLoadout,
  slot: EquipmentSlot,
): { loadout: EquipmentLoadout; removed: EquipmentId | null } {
  const removed = loadout[slot] ?? null
  const next = { ...loadout }
  delete next[slot]
  return { loadout: next, removed }
}

/** Items the merchant sells in addition to consumables. */
export const MERCHANT_EQUIPMENT: EquipmentId[] = [
  'bronze-sword',
  'leather-vest',
  'vigor-ring',
  'steel-sword',
  'chain-mail',
  'mage-staff',
  'mage-robe',
  'rogue-dagger',
  'lucky-charm',
  'aegis-pendant',
]
