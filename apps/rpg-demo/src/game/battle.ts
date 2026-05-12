import { CLASSES, SKILLS } from './data'
import { applyItem, ITEMS, removeItem, type Inventory } from './items'
import {
  DEFAULT_SETTINGS,
  DIFFICULTY_DAMAGE_MULT,
  DIFFICULTY_REWARD_MULT,
  type Settings,
} from './settings'
import type { BattleAction, BattleEvent, Combatant, Enemy, Hero } from './types'

export interface ResolveResult {
  hero: Hero
  enemy: Enemy
  inventory: Inventory
  /** Per-event damage data, for floating-number animation. */
  damageEvents: DamageFlash[]
  events: BattleEvent[]
  outcome: 'continue' | 'victory' | 'defeat' | 'fled'
}

/** Visual side-effect of a damage tick (or heal); the screen renders these as
 *  floating numbers. */
export interface DamageFlash {
  id: number
  target: 'hero' | 'enemy'
  amount: number
  kind: 'damage' | 'heal' | 'crit'
}

let eventIdCounter = 0
let flashIdCounter = 0
function event(text: string, variant?: BattleEvent['variant']): BattleEvent {
  return { id: ++eventIdCounter, text, variant }
}
function flash(
  target: DamageFlash['target'],
  amount: number,
  kind: DamageFlash['kind'],
): DamageFlash {
  return { id: ++flashIdCounter, target, amount, kind }
}

function rollDamage(
  attacker: Combatant,
  defender: Combatant,
  scale = 1,
  ignoreDef = false,
  critChance = 0.08,
) {
  // Small random variance keeps battles from feeling deterministic without
  // ever producing a 0-damage attack that feels broken.
  const variance = 0.85 + Math.random() * 0.3
  const raw = attacker.atk * scale - (ignoreDef ? 0 : defender.def * 0.6)
  const damage = Math.max(1, Math.round(raw * variance))
  const crit = Math.random() < critChance
  return { damage: crit ? Math.round(damage * 1.5) : damage, crit }
}

function applyDamage(target: Hero | Enemy, damage: number): Hero | Enemy {
  const incoming = target.defending ? Math.ceil(damage / 2) : damage
  return { ...target, hp: Math.max(0, target.hp - incoming), defending: false }
}

/**
 * Resolve a single full round: player action first, then the enemy attacks
 * if still alive. Stats and HP are immutable — every change returns new
 * objects so React state updates stay clean. Settings control difficulty
 * scaling and class-based crit bonus.
 */
export function resolveTurn(
  hero: Hero,
  enemy: Enemy,
  action: BattleAction,
  inventory: Inventory = [],
  settings: Settings = DEFAULT_SETTINGS,
): ResolveResult {
  let currentHero: Hero = { ...hero }
  let currentEnemy: Enemy = { ...enemy }
  let currentInventory: Inventory = inventory
  const events: BattleEvent[] = []
  const damageEvents: DamageFlash[] = []
  const classProfile = CLASSES[currentHero.heroClass]
  const heroCrit = 0.08 + classProfile.critBonus
  const damageMult = DIFFICULTY_DAMAGE_MULT[settings.difficulty]
  const rewardMult = DIFFICULTY_REWARD_MULT[settings.difficulty]

  // ── Hero turn ─────────────────────────────────────────────────────────
  switch (action.kind) {
    case 'attack': {
      const { damage, crit } = rollDamage(
        currentHero,
        currentEnemy,
        1,
        false,
        heroCrit,
      )
      currentEnemy = applyDamage(currentEnemy, damage) as Enemy
      damageEvents.push(flash('enemy', damage, crit ? 'crit' : 'damage'))
      events.push(
        event(
          crit
            ? `${currentHero.name} lands a CRITICAL hit for ${damage}!`
            : `${currentHero.name} attacks for ${damage}.`,
          crit ? 'crit' : 'damage',
        ),
      )
      break
    }
    case 'magic': {
      const skill = SKILLS[action.skillId]
      if (currentHero.mp < skill.mpCost) {
        events.push(event(`Not enough MP for ${skill.name}!`, 'fail'))
        break
      }
      currentHero = { ...currentHero, mp: currentHero.mp - skill.mpCost }
      if (skill.id === 'fireball') {
        // Mages cast a stronger fireball as their class identity.
        const scale = currentHero.heroClass === 'mage' ? 2.2 : 1.8
        const { damage, crit } = rollDamage(currentHero, currentEnemy, scale, true, heroCrit)
        currentEnemy = applyDamage(currentEnemy, damage) as Enemy
        damageEvents.push(flash('enemy', damage, crit ? 'crit' : 'damage'))
        events.push(event(`${skill.name} sears the foe for ${damage}!`, crit ? 'crit' : 'damage'))
      } else if (skill.id === 'heal') {
        const restore = Math.round(currentHero.maxHp * 0.42)
        currentHero = {
          ...currentHero,
          hp: Math.min(currentHero.maxHp, currentHero.hp + restore),
        }
        damageEvents.push(flash('hero', restore, 'heal'))
        events.push(event(`${skill.name} restores ${restore} HP.`, 'heal'))
      }
      break
    }
    case 'item': {
      const slot = currentInventory.find((s) => s.itemId === action.itemId)
      if (!slot || slot.quantity <= 0) {
        events.push(event(`No ${action.itemId} left!`, 'fail'))
        break
      }
      const item = ITEMS[action.itemId]
      const prevHp = currentHero.hp
      const prevMp = currentHero.mp
      const applied = applyItem(currentHero, item)
      currentHero = applied.hero
      currentInventory = removeItem(currentInventory, action.itemId, 1)
      if (currentHero.hp > prevHp) {
        damageEvents.push(flash('hero', currentHero.hp - prevHp, 'heal'))
      }
      // Implicit: MP restore doesn't get a floating number; the MP bar update
      // alone is feedback. We still surface in the battle log.
      events.push(event(applied.message, 'heal'))
      void prevMp // (suppress unused-var lint)
      break
    }
    case 'defend': {
      currentHero = { ...currentHero, defending: true }
      events.push(event(`${currentHero.name} braces for impact.`, 'info'))
      break
    }
    case 'run': {
      if (currentEnemy.isBoss) {
        events.push(event(`You cannot flee from ${currentEnemy.name}!`, 'fail'))
        break
      }
      // Speed matters when running; Rogue gets a flat bonus.
      const rogueBonus = currentHero.heroClass === 'rogue' ? 0.2 : 0
      const chance = 0.4 + (currentHero.spd - currentEnemy.spd) * 0.05 + rogueBonus
      if (Math.random() < chance) {
        events.push(event(`${currentHero.name} flees the battle.`, 'success'))
        return {
          hero: currentHero,
          enemy: currentEnemy,
          inventory: currentInventory,
          damageEvents,
          events,
          outcome: 'fled',
        }
      }
      events.push(event(`Cannot escape!`, 'fail'))
      break
    }
  }

  if (currentEnemy.hp <= 0) {
    const xpGained = Math.round(currentEnemy.xpReward * rewardMult)
    const goldGained = Math.round(currentEnemy.goldReward * rewardMult)
    events.push(
      event(
        `${currentEnemy.name} is defeated!  +${xpGained} XP · +${goldGained} gold`,
        'success',
      ),
    )
    const newXp = currentHero.xp + xpGained
    let level = currentHero.level
    let xpToNext = currentHero.xpToNext
    let xp = newXp
    let maxHp = currentHero.maxHp
    let maxMp = currentHero.maxMp
    let atk = currentHero.atk
    let def = currentHero.def
    while (xp >= xpToNext) {
      xp -= xpToNext
      level += 1
      xpToNext = Math.round(xpToNext * 1.6)
      maxHp += 8
      maxMp += 3
      atk += 2
      def += 1
      events.push(event(`LEVEL UP! ${currentHero.name} is now Lv${level}.`, 'success'))
    }
    currentHero = {
      ...currentHero,
      xp,
      level,
      xpToNext,
      maxHp,
      maxMp,
      atk,
      def,
      gold: currentHero.gold + goldGained,
      hp: Math.min(currentHero.hp + (maxHp - currentHero.maxHp), maxHp),
      mp: Math.min(currentHero.mp + (maxMp - currentHero.maxMp), maxMp),
    }
    return {
      hero: currentHero,
      enemy: currentEnemy,
      inventory: currentInventory,
      damageEvents,
      events,
      outcome: 'victory',
    }
  }

  // ── Enemy turn ────────────────────────────────────────────────────────
  const raw = rollDamage(currentEnemy, currentHero)
  const damage = Math.max(1, Math.round(raw.damage * damageMult))
  currentHero = applyDamage(currentHero, damage) as Hero
  damageEvents.push(flash('hero', damage, raw.crit ? 'crit' : 'damage'))
  events.push(
    event(
      raw.crit
        ? `${currentEnemy.name} crits for ${damage}!`
        : `${currentEnemy.name} strikes for ${damage}.`,
      raw.crit ? 'crit' : 'damage',
    ),
  )

  if (currentHero.hp <= 0) {
    if (currentHero.lives > 1) {
      currentHero = {
        ...currentHero,
        hp: Math.round(currentHero.maxHp * 0.4),
        mp: Math.max(currentHero.mp, 4),
        lives: currentHero.lives - 1,
      }
      events.push(
        event(`${currentHero.name} falls — a hero stone revives you!`, 'success'),
      )
      return {
        hero: currentHero,
        enemy: currentEnemy,
        inventory: currentInventory,
        damageEvents,
        events,
        outcome: 'continue',
      }
    }
    events.push(event(`${currentHero.name} has fallen…`, 'fail'))
    return {
      hero: currentHero,
      enemy: currentEnemy,
      inventory: currentInventory,
      damageEvents,
      events,
      outcome: 'defeat',
    }
  }

  return {
    hero: currentHero,
    enemy: currentEnemy,
    inventory: currentInventory,
    damageEvents,
    events,
    outcome: 'continue',
  }
}
