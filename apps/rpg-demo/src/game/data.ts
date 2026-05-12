import type { Enemy, Hero, HeroClass } from './types'

export const MAP_SIZE = 10
export const BOSS_POS = { x: 0, y: 0 }
export const HERO_START = { x: 5, y: 5 }
export const ENCOUNTER_RATE = 0.22

export interface ClassProfile {
  id: HeroClass
  name: string
  sprite: string
  blurb: string
  hp: number
  mp: number
  atk: number
  def: number
  spd: number
  /** Bonus crit chance added to the base 8%. */
  critBonus: number
}

export const CLASSES: Record<HeroClass, ClassProfile> = {
  warrior: {
    id: 'warrior',
    name: 'Warrior',
    sprite: '🛡',
    blurb: 'High HP and ATK. The default party tank.',
    hp: 55,
    mp: 8,
    atk: 14,
    def: 9,
    spd: 5,
    critBonus: 0,
  },
  mage: {
    id: 'mage',
    name: 'Mage',
    sprite: '🔮',
    blurb: 'Frail body, generous MP. Fireball hits for more.',
    hp: 40,
    mp: 18,
    atk: 9,
    def: 6,
    spd: 6,
    critBonus: 0,
  },
  rogue: {
    id: 'rogue',
    name: 'Rogue',
    sprite: '🗡',
    blurb: 'Fast and lucky. Higher crit chance, easier escapes.',
    hp: 45,
    mp: 10,
    atk: 11,
    def: 6,
    spd: 9,
    critBonus: 0.07,
  },
}

export function createHero(name = 'Eddy', heroClass: HeroClass = 'warrior'): Hero {
  const profile = CLASSES[heroClass]
  return {
    id: 'hero',
    name,
    sprite: profile.sprite,
    level: 1,
    hp: profile.hp,
    maxHp: profile.hp,
    mp: profile.mp,
    maxMp: profile.mp,
    atk: profile.atk,
    def: profile.def,
    spd: profile.spd,
    xp: 0,
    xpToNext: 30,
    lives: 3,
    maxLives: 3,
    gold: 30, // small starting purse so the merchant isn't unreachable
    heroClass,
    defending: false,
  }
}

export interface EnemyTemplate {
  id: string
  name: string
  sprite: string
  hp: number
  mp: number
  atk: number
  def: number
  spd: number
  xpReward: number
  goldReward: number
  isBoss?: boolean
}

const TEMPLATES: EnemyTemplate[] = [
  {
    id: 'slime',
    name: 'Goo Slime',
    sprite: '🟢',
    hp: 18,
    mp: 0,
    atk: 5,
    def: 2,
    spd: 3,
    xpReward: 10,
    goldReward: 4,
  },
  {
    id: 'bat',
    name: 'Pixel Bat',
    sprite: '🦇',
    hp: 14,
    mp: 0,
    atk: 6,
    def: 1,
    spd: 9,
    xpReward: 12,
    goldReward: 6,
  },
  {
    id: 'goblin',
    name: 'Goblin Thief',
    sprite: '👺',
    hp: 28,
    mp: 0,
    atk: 8,
    def: 4,
    spd: 5,
    xpReward: 20,
    goldReward: 12,
  },
  {
    id: 'skeleton',
    name: 'Bone Knight',
    sprite: '💀',
    hp: 40,
    mp: 0,
    atk: 10,
    def: 6,
    spd: 4,
    xpReward: 30,
    goldReward: 20,
  },
  {
    id: 'dragon',
    name: 'Pixel Dragon',
    sprite: '🐉',
    hp: 110,
    mp: 0,
    atk: 18,
    def: 10,
    spd: 8,
    xpReward: 200,
    goldReward: 200,
    isBoss: true,
  },
]

export function findEnemyTemplate(id: string): EnemyTemplate {
  const t = TEMPLATES.find((x) => x.id === id)
  if (!t) throw new Error(`Unknown enemy template: ${id}`)
  return t
}

export function instantiateEnemy(template: EnemyTemplate): Enemy {
  return {
    id: template.id,
    name: template.name,
    sprite: template.sprite,
    level: template.isBoss ? 5 : 1,
    hp: template.hp,
    maxHp: template.hp,
    mp: template.mp,
    maxMp: template.mp,
    atk: template.atk,
    def: template.def,
    spd: template.spd,
    xpReward: template.xpReward,
    goldReward: template.goldReward,
    isBoss: template.isBoss,
    defending: false,
  }
}

/**
 * Roll a random encounter — biased toward weaker enemies near the spawn and
 * tougher ones near the boss corner. Bosses come from explicit tile triggers,
 * not random encounters.
 */
export function rollEncounter(distanceFromCenter: number): Enemy {
  const roll = Math.random()
  if (distanceFromCenter < 3) {
    // Near spawn — weak enemies only
    return instantiateEnemy(findEnemyTemplate(roll < 0.6 ? 'slime' : 'bat'))
  }
  if (distanceFromCenter < 6) {
    if (roll < 0.4) return instantiateEnemy(findEnemyTemplate('bat'))
    if (roll < 0.85) return instantiateEnemy(findEnemyTemplate('goblin'))
    return instantiateEnemy(findEnemyTemplate('skeleton'))
  }
  if (roll < 0.3) return instantiateEnemy(findEnemyTemplate('goblin'))
  return instantiateEnemy(findEnemyTemplate('skeleton'))
}

export function bossEncounter(): Enemy {
  return instantiateEnemy(findEnemyTemplate('dragon'))
}

export interface Skill {
  id: 'fireball' | 'heal'
  name: string
  mpCost: number
  description: string
}

export const SKILLS: Record<Skill['id'], Skill> = {
  fireball: {
    id: 'fireball',
    name: 'Fireball',
    mpCost: 5,
    description: 'Ignites the target for major damage.',
  },
  heal: {
    id: 'heal',
    name: 'Heal',
    mpCost: 4,
    description: 'Restores ~40% of max HP.',
  },
}
