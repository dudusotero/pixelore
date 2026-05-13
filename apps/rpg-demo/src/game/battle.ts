import { CLASSES, SKILLS } from './data'
import { deriveStats, EQUIPMENT } from './equipment'
import { applyItem, ITEMS, removeItem, type Inventory } from './items'
import {
  DEFAULT_SETTINGS,
  DIFFICULTY_DAMAGE_MULT,
  DIFFICULTY_REWARD_MULT,
  type Settings,
} from './settings'
import {
  decayStatuses,
  hasStatus,
  makeStatus,
  removeStatus,
  withStatus,
} from './statuses'
import type {
  BattleAction,
  BattleEvent,
  Combatant,
  Enemy,
  Hero,
  StatusEffectId,
} from './types'

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

interface RollContext {
  /** ATK override — use derived stats for the hero, base for enemies. */
  atk: number
  /** DEF override on the defender. */
  defenderDef: number
}

function rollDamage(
  scale = 1,
  ignoreDef = false,
  critChance = 0.08,
  ctx: RollContext = { atk: 0, defenderDef: 0 },
) {
  // Small random variance keeps battles from feeling deterministic without
  // ever producing a 0-damage attack that feels broken.
  const variance = 0.85 + Math.random() * 0.3
  const raw = ctx.atk * scale - (ignoreDef ? 0 : ctx.defenderDef * 0.6)
  const damage = Math.max(1, Math.round(raw * variance))
  const crit = Math.random() < critChance
  return { damage: crit ? Math.round(damage * 1.5) : damage, crit }
}

/**
 * Apply damage to a combatant, respecting `defending` (halves damage) and any
 * active shield (full absorb of one hit). Returns the updated target.
 */
function takeHit<T extends Hero | Enemy>(target: T, damage: number): { next: T; absorbed: boolean } {
  if (hasStatus(target.statuses, 'shield')) {
    return {
      next: {
        ...target,
        statuses: removeStatus(target.statuses, 'shield'),
        defending: false,
      },
      absorbed: true,
    }
  }
  const incoming = target.defending ? Math.ceil(damage / 2) : damage
  return {
    next: { ...target, hp: Math.max(0, target.hp - incoming), defending: false },
    absorbed: false,
  }
}

interface TickResult<T extends Combatant> {
  /** Updated combatant after DoTs + duration decay. */
  next: T
  /** True if the owner should skip their action this turn (stun). */
  skip: boolean
  /** Damage events produced by this tick (for floating numbers). */
  damage: DamageFlash[]
  /** Battle log entries describing what the ticks did. */
  events: BattleEvent[]
}

/**
 * Tick status effects at the start of a combatant's turn — applies poison /
 * burn DoTs, decays durations, and reports whether the combatant is stunned.
 */
function tickStatuses<T extends Combatant>(
  c: T,
  who: 'hero' | 'enemy',
  displayName: string,
): TickResult<T> {
  let next = { ...c }
  const damage: DamageFlash[] = []
  const events: BattleEvent[] = []
  for (const s of c.statuses ?? []) {
    if (s.id === 'poison' || s.id === 'burn') {
      const dmg = Math.max(1, s.magnitude)
      next = { ...next, hp: Math.max(0, next.hp - dmg) }
      damage.push(flash(who, dmg, 'damage'))
      events.push(
        event(
          s.id === 'poison'
            ? `${displayName} suffers ${dmg} poison damage.`
            : `${displayName} burns for ${dmg}.`,
          'damage',
        ),
      )
    }
  }
  const skip = hasStatus(c.statuses, 'stun')
  if (skip) {
    events.push(event(`${displayName} is stunned and can't act!`, 'info'))
  }
  next = { ...next, statuses: decayStatuses(next.statuses) }
  return { next, skip, damage, events }
}

/**
 * Boss turn picker. Phase 1 (>50% HP): regular hits with occasional fire-breath
 * telegraph. Phase 2 (<=50% HP): boss roars on first entry, gains +ATK / +SPD,
 * and telegraphs more often.
 */
function bossTurn(
  enemy: Enemy,
  hero: Hero,
  derivedHeroDef: number,
  damageMult: number,
): { enemy: Enemy; hero: Hero; events: BattleEvent[]; damage: DamageFlash[] } {
  const events: BattleEvent[] = []
  const damage: DamageFlash[] = []
  let currentEnemy = enemy
  let currentHero = hero

  // Phase transition — once HP drops to or below 50%, the dragon enrages.
  if (currentEnemy.bossState?.phase === 1 && currentEnemy.hp <= currentEnemy.maxHp / 2) {
    currentEnemy = {
      ...currentEnemy,
      atk: currentEnemy.atk + 4,
      spd: currentEnemy.spd + 2,
      bossState: { phase: 2, telegraph: null },
    }
    events.push(
      event(
        `${currentEnemy.name} ROARS — its scales glow red-hot!`,
        'fail',
      ),
    )
  }

  // If the boss already telegraphed last round, unleash fire breath now.
  if (currentEnemy.bossState?.telegraph === 'fire-breath') {
    const { damage: raw } = rollDamage(1.8, true, 0.05, {
      atk: currentEnemy.atk,
      defenderDef: derivedHeroDef,
    })
    const dmg = Math.max(1, Math.round(raw * damageMult))
    const { next, absorbed } = takeHit(currentHero, dmg)
    currentHero = next
    if (absorbed) {
      events.push(event(`Shield absorbs the dragon's flames!`, 'info'))
    } else {
      damage.push(flash('hero', dmg, 'damage'))
      events.push(event(`Fire Breath engulfs ${currentHero.name} for ${dmg}!`, 'damage'))
      // High chance to apply burn.
      if (Math.random() < 0.8) {
        currentHero = {
          ...currentHero,
          statuses: withStatus(currentHero.statuses, makeStatus('burn', 2, 5)),
        }
        events.push(event(`${currentHero.name} catches fire!`, 'fail'))
      }
    }
    currentEnemy = {
      ...currentEnemy,
      bossState: { ...currentEnemy.bossState!, telegraph: null },
    }
    return { enemy: currentEnemy, hero: currentHero, events, damage }
  }

  // Decide whether to telegraph or attack normally.
  const phase = currentEnemy.bossState?.phase ?? 1
  const telegraphChance = phase === 1 ? 0.25 : 0.4
  if (Math.random() < telegraphChance) {
    currentEnemy = {
      ...currentEnemy,
      bossState: { phase, telegraph: 'fire-breath' },
    }
    events.push(
      event(`${currentEnemy.name} inhales deeply… flames gather!`, 'info'),
    )
    return { enemy: currentEnemy, hero: currentHero, events, damage }
  }

  // Regular boss attack — phase 2 has a small extra crit bias.
  const { damage: raw, crit } = rollDamage(1, false, phase === 2 ? 0.18 : 0.1, {
    atk: currentEnemy.atk,
    defenderDef: derivedHeroDef,
  })
  const dmg = Math.max(1, Math.round(raw * damageMult))
  const { next, absorbed } = takeHit(currentHero, dmg)
  currentHero = next
  if (absorbed) {
    events.push(event(`Shield blocks the dragon's strike!`, 'info'))
  } else {
    damage.push(flash('hero', dmg, crit ? 'crit' : 'damage'))
    events.push(
      event(
        crit
          ? `${currentEnemy.name} rakes for ${dmg}!`
          : `${currentEnemy.name} strikes for ${dmg}.`,
        crit ? 'crit' : 'damage',
      ),
    )
  }
  return { enemy: currentEnemy, hero: currentHero, events, damage }
}

/** Roll an on-hit status from an enemy basic attack. */
function rollOnHitStatus(enemy: Enemy): StatusEffectId | null {
  if (enemy.poisonChance && Math.random() < enemy.poisonChance) return 'poison'
  if (enemy.stunChance && Math.random() < enemy.stunChance) return 'stun'
  return null
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
  const damageMult = DIFFICULTY_DAMAGE_MULT[settings.difficulty]
  const rewardMult = DIFFICULTY_REWARD_MULT[settings.difficulty]

  // Hero derived stats include equipment bonuses.
  const derivedHero = deriveStats(currentHero)
  const heroCrit = 0.08 + classProfile.critBonus + derivedHero.critBonus

  // ── Status tick: hero ────────────────────────────────────────────────
  const heroTick = tickStatuses(currentHero, 'hero', currentHero.name)
  currentHero = heroTick.next
  events.push(...heroTick.events)
  damageEvents.push(...heroTick.damage)
  if (currentHero.hp <= 0) {
    return finishHeroDeath(currentHero, currentEnemy, currentInventory, events, damageEvents)
  }

  const heroSkip = heroTick.skip

  // ── Hero turn ─────────────────────────────────────────────────────────
  if (!heroSkip) {
    switch (action.kind) {
      case 'attack': {
        const { damage, crit } = rollDamage(1, false, heroCrit, {
          atk: derivedHero.atk,
          defenderDef: currentEnemy.def,
        })
        const hit = takeHit(currentEnemy, damage)
        currentEnemy = hit.next
        if (hit.absorbed) {
          events.push(event(`${currentEnemy.name}'s shield absorbs the blow!`, 'info'))
        } else {
          damageEvents.push(flash('enemy', damage, crit ? 'crit' : 'damage'))
          events.push(
            event(
              crit
                ? `${currentHero.name} lands a CRITICAL hit for ${damage}!`
                : `${currentHero.name} attacks for ${damage}.`,
              crit ? 'crit' : 'damage',
            ),
          )
        }
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
          const { damage, crit } = rollDamage(scale, true, heroCrit, {
            atk: derivedHero.atk,
            defenderDef: currentEnemy.def,
          })
          const hit = takeHit(currentEnemy, damage)
          currentEnemy = hit.next
          if (hit.absorbed) {
            events.push(event(`${currentEnemy.name}'s shield burns away!`, 'info'))
          } else {
            damageEvents.push(flash('enemy', damage, crit ? 'crit' : 'damage'))
            events.push(
              event(
                `${skill.name} sears the foe for ${damage}!`,
                crit ? 'crit' : 'damage',
              ),
            )
            // 35% chance to ignite the target — 60% for mages.
            const burnChance = currentHero.heroClass === 'mage' ? 0.6 : 0.35
            if (Math.random() < burnChance) {
              currentEnemy = {
                ...currentEnemy,
                statuses: withStatus(
                  currentEnemy.statuses,
                  makeStatus('burn', 3, Math.max(3, Math.round(damage * 0.18))),
                ),
              }
              events.push(event(`${currentEnemy.name} catches fire!`, 'success'))
            }
          }
        } else if (skill.id === 'heal') {
          const restore = Math.round(derivedHero.maxHp * 0.42)
          currentHero = {
            ...currentHero,
            hp: Math.min(derivedHero.maxHp, currentHero.hp + restore),
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
        const applied = applyItem(currentHero, item, {
          maxHp: derivedHero.maxHp,
          maxMp: derivedHero.maxMp,
        })
        currentHero = applied.hero
        currentInventory = removeItem(currentInventory, action.itemId, 1)
        if (currentHero.hp > prevHp) {
          damageEvents.push(flash('hero', currentHero.hp - prevHp, 'heal'))
        }
        // Items that cleanse statuses report their cleanse in the message.
        events.push(event(applied.message, 'heal'))
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
        const chance =
          0.4 + (derivedHero.spd - currentEnemy.spd) * 0.05 + rogueBonus
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
  }

  if (currentEnemy.hp <= 0) {
    return finishEnemyDeath(
      currentHero,
      currentEnemy,
      currentInventory,
      events,
      damageEvents,
      rewardMult,
    )
  }

  // ── Status tick: enemy ───────────────────────────────────────────────
  const enemyTick = tickStatuses(currentEnemy, 'enemy', currentEnemy.name)
  currentEnemy = enemyTick.next
  events.push(...enemyTick.events)
  damageEvents.push(...enemyTick.damage)

  if (currentEnemy.hp <= 0) {
    return finishEnemyDeath(
      currentHero,
      currentEnemy,
      currentInventory,
      events,
      damageEvents,
      rewardMult,
    )
  }

  // ── Enemy turn ────────────────────────────────────────────────────────
  if (!enemyTick.skip) {
    if (currentEnemy.isBoss) {
      const turn = bossTurn(currentEnemy, currentHero, derivedHero.def, damageMult)
      currentEnemy = turn.enemy
      currentHero = turn.hero
      events.push(...turn.events)
      damageEvents.push(...turn.damage)
    } else {
      const raw = rollDamage(1, false, 0.08, {
        atk: currentEnemy.atk,
        defenderDef: derivedHero.def,
      })
      const damage = Math.max(1, Math.round(raw.damage * damageMult))
      const hit = takeHit(currentHero, damage)
      currentHero = hit.next
      if (hit.absorbed) {
        events.push(event(`Shield absorbs the blow!`, 'info'))
      } else {
        damageEvents.push(flash('hero', damage, raw.crit ? 'crit' : 'damage'))
        events.push(
          event(
            raw.crit
              ? `${currentEnemy.name} crits for ${damage}!`
              : `${currentEnemy.name} strikes for ${damage}.`,
            raw.crit ? 'crit' : 'damage',
          ),
        )
        // Roll on-hit status (poison/stun) once the hit lands.
        const onHit = rollOnHitStatus(currentEnemy)
        if (onHit === 'poison') {
          currentHero = {
            ...currentHero,
            statuses: withStatus(currentHero.statuses, makeStatus('poison', 3, 3)),
          }
          events.push(event(`${currentHero.name} is poisoned!`, 'fail'))
        } else if (onHit === 'stun') {
          currentHero = {
            ...currentHero,
            statuses: withStatus(currentHero.statuses, makeStatus('stun', 1, 0)),
          }
          events.push(event(`${currentHero.name} is stunned!`, 'fail'))
        }
      }
    }
  }

  if (currentHero.hp <= 0) {
    return finishHeroDeath(currentHero, currentEnemy, currentInventory, events, damageEvents)
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

function finishEnemyDeath(
  hero: Hero,
  enemy: Enemy,
  inventory: Inventory,
  events: BattleEvent[],
  damageEvents: DamageFlash[],
  rewardMult: number,
): ResolveResult {
  const xpGained = Math.round(enemy.xpReward * rewardMult)
  const goldGained = Math.round(enemy.goldReward * rewardMult)
  events.push(
    event(
      `${enemy.name} is defeated!  +${xpGained} XP · +${goldGained} gold`,
      'success',
    ),
  )
  const newXp = hero.xp + xpGained
  let level = hero.level
  let xpToNext = hero.xpToNext
  let xp = newXp
  let maxHp = hero.maxHp
  let maxMp = hero.maxMp
  let atk = hero.atk
  let def = hero.def
  while (xp >= xpToNext) {
    xp -= xpToNext
    level += 1
    xpToNext = Math.round(xpToNext * 1.6)
    maxHp += 8
    maxMp += 3
    atk += 2
    def += 1
    events.push(event(`LEVEL UP! ${hero.name} is now Lv${level}.`, 'success'))
  }
  const cleansed: Hero = {
    ...hero,
    xp,
    level,
    xpToNext,
    maxHp,
    maxMp,
    atk,
    def,
    gold: hero.gold + goldGained,
    hp: Math.min(hero.hp + (maxHp - hero.maxHp), maxHp),
    mp: Math.min(hero.mp + (maxMp - hero.maxMp), maxMp),
    statuses: [],
  }
  return {
    hero: cleansed,
    enemy,
    inventory,
    damageEvents,
    events,
    outcome: 'victory',
  }
}

function finishHeroDeath(
  hero: Hero,
  enemy: Enemy,
  inventory: Inventory,
  events: BattleEvent[],
  damageEvents: DamageFlash[],
): ResolveResult {
  if (hero.lives > 1) {
    const revived: Hero = {
      ...hero,
      hp: Math.round(hero.maxHp * 0.4),
      mp: Math.max(hero.mp, 4),
      lives: hero.lives - 1,
      statuses: [],
    }
    events.push(event(`${revived.name} falls — a hero stone revives you!`, 'success'))
    return {
      hero: revived,
      enemy,
      inventory,
      damageEvents,
      events,
      outcome: 'continue',
    }
  }
  events.push(event(`${hero.name} has fallen…`, 'fail'))
  return {
    hero,
    enemy,
    inventory,
    damageEvents,
    events,
    outcome: 'defeat',
  }
}

/**
 * Initial hero state when entering a battle: applies passive equipment perks
 * (e.g. Aegis Pendant grants a Shield) and clears any leftover combat flags.
 */
export function startBattleHero(hero: Hero): Hero {
  let next: Hero = { ...hero, defending: false, statuses: hero.statuses ?? [] }
  for (const id of Object.values(hero.equipped ?? {})) {
    if (!id) continue
    const piece = EQUIPMENT[id]
    if (piece.passive === 'grant-shield') {
      next = {
        ...next,
        statuses: withStatus(next.statuses, makeStatus('shield', 99, 0)),
      }
    }
  }
  return next
}
