import { useCallback, useEffect, useState } from 'react'
import { motion } from 'motion/react'
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  useReducedMotion,
} from '@pixelore/react'
import { resolveTurn, type DamageFlash } from '../game/battle'
import { SKILLS } from '../game/data'
import { ITEMS, type Inventory, type ItemId } from '../game/items'
import type { Settings } from '../game/settings'
import type { BattleAction, BattleEvent, Enemy, Hero } from '../game/types'
import { EnemyPanel } from '../components/EnemyPanel'
import { BattleLog } from '../components/BattleLog'
import { HeroStatPanel } from '../components/HeroStatPanel'

interface BattleScreenProps {
  hero: Hero
  enemy: Enemy
  inventory: Inventory
  settings: Settings
  onFinish: (
    hero: Hero,
    inventory: Inventory,
    outcome: 'victory' | 'defeat' | 'fled',
    defeatedEnemyId: string | null,
  ) => void
}

type Menu = 'root' | 'magic' | 'item'

export function BattleScreen({
  hero: initialHero,
  enemy: initialEnemy,
  inventory: initialInventory,
  settings,
  onFinish,
}: BattleScreenProps) {
  const [hero, setHero] = useState<Hero>(initialHero)
  const [enemy, setEnemy] = useState<Enemy>(initialEnemy)
  const [inventory, setInventory] = useState<Inventory>(initialInventory)
  const [events, setEvents] = useState<BattleEvent[]>([])
  const [busy, setBusy] = useState(false)
  const [menu, setMenu] = useState<Menu>('root')
  const [enemyHitFlash, setEnemyHitFlash] = useState(0)
  const [latestDamage, setLatestDamage] = useState<DamageFlash[]>([])
  const [finished, setFinished] = useState<'victory' | 'defeat' | 'fled' | null>(null)
  const reduced = useReducedMotion()

  const submit = useCallback(
    (action: BattleAction) => {
      if (busy || finished) return
      setBusy(true)
      setMenu('root')
      const prevEnemyHp = enemy.hp
      const result = resolveTurn(hero, enemy, action, inventory, settings)
      setEvents((prev) => [...prev, ...result.events])
      setHero(result.hero)
      setEnemy(result.enemy)
      setInventory(result.inventory)
      setLatestDamage(result.damageEvents)
      if (result.enemy.hp < prevEnemyHp) setEnemyHitFlash((n) => n + 1)

      // Let the events render before either continuing the loop or exiting.
      window.setTimeout(
        () => {
          setBusy(false)
          if (result.outcome !== 'continue') {
            setFinished(result.outcome === 'fled' ? 'fled' : result.outcome)
          }
        },
        reduced ? 250 : 700,
      )
    },
    [busy, enemy, finished, hero, inventory, reduced, settings],
  )

  // After the user reads the last event, return control to the App router.
  useEffect(() => {
    if (!finished) return
    const delay = finished === 'defeat' ? 1800 : finished === 'fled' ? 900 : 1800
    const t = window.setTimeout(() => {
      onFinish(
        hero,
        inventory,
        finished === 'fled' ? 'fled' : finished,
        finished === 'victory' ? enemy.id : null,
      )
    }, delay)
    return () => window.clearTimeout(t)
  }, [finished, hero, inventory, enemy.id, onFinish])

  return (
    <main className="flex flex-1 flex-col gap-4 px-3 py-4 sm:px-6 sm:py-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <Badge variant={enemy.isBoss ? 'danger' : 'primary'}>
          {enemy.isBoss ? 'Boss Encounter' : 'Battle'}
        </Badge>
      </header>

      {/* Source order = mobile order: Enemy → HeroStat → Log → Actions.
          On lg, grid-cols + auto-flow row gives the classic two-column layout
          (col1: Enemy/Log, col2: HeroStat/Actions) without re-ordering DOM. */}
      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <EnemyPanel enemy={enemy} hitFlash={enemyHitFlash} damageEvents={latestDamage} />
        <HeroStatPanel hero={hero} compact damageEvents={latestDamage} />
        <BattleLog events={events} />
        <ActionMenu
          hero={hero}
          enemy={enemy}
          inventory={inventory}
          menu={menu}
          busy={busy || !!finished}
          onMenu={setMenu}
          onAction={submit}
        />
      </div>

      {finished && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-30 flex items-center justify-center bg-po-bg/80 backdrop-blur-sm"
          aria-live="assertive"
        >
          <Card>
            <CardHeader>
              <CardTitle>
                {finished === 'victory' && 'Victory!'}
                {finished === 'fled' && 'Escaped!'}
                {finished === 'defeat' && 'You have fallen…'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-body text-lg text-po-fg-muted">
                {finished === 'victory' && `${enemy.name} is no more.`}
                {finished === 'fled' && 'You slip back into the wilds.'}
                {finished === 'defeat' && 'The realm mourns its hero.'}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </main>
  )
}

function ActionMenu({
  hero,
  enemy,
  inventory,
  menu,
  busy,
  onMenu,
  onAction,
}: {
  hero: Hero
  enemy: Enemy
  inventory: Inventory
  menu: Menu
  busy: boolean
  onMenu: (m: Menu) => void
  onAction: (a: BattleAction) => void
}) {
  if (menu === 'magic') {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Magic</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2">
            <Button
              variant="secondary"
              block
              disabled={busy || hero.mp < SKILLS.fireball.mpCost}
              onClick={() => onAction({ kind: 'magic', skillId: 'fireball' })}
            >
              Fireball · {SKILLS.fireball.mpCost} MP
            </Button>
            <Button
              variant="success"
              block
              disabled={busy || hero.mp < SKILLS.heal.mpCost || hero.hp >= hero.maxHp}
              onClick={() => onAction({ kind: 'magic', skillId: 'heal' })}
            >
              Heal · {SKILLS.heal.mpCost} MP
            </Button>
            <Button variant="ghost" block disabled={busy} onClick={() => onMenu('root')}>
              ← Back
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (menu === 'item') {
    const usable = inventory.filter((s) => s.quantity > 0)
    return (
      <Card>
        <CardHeader>
          <CardTitle>Use item</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2">
            {usable.length === 0 && (
              <p className="font-body text-base text-po-fg-muted">No items in your bag.</p>
            )}
            {usable.map((slot) => {
              const item = ITEMS[slot.itemId]
              return (
                <Button
                  key={slot.itemId}
                  variant="primary"
                  block
                  disabled={busy}
                  onClick={() => onAction({ kind: 'item', itemId: slot.itemId as ItemId })}
                >
                  {item.sprite} {item.name} · ×{slot.quantity}
                </Button>
              )
            })}
            <Button variant="ghost" block disabled={busy} onClick={() => onMenu('root')}>
              ← Back
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-2">
          <Button variant="primary" block disabled={busy} onClick={() => onAction({ kind: 'attack' })}>
            Attack
          </Button>
          <Button variant="secondary" block disabled={busy} onClick={() => onMenu('magic')}>
            Magic
          </Button>
          <Button variant="accent" block disabled={busy} onClick={() => onMenu('item')}>
            Item
          </Button>
        </div>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <Button variant="success" block disabled={busy} onClick={() => onAction({ kind: 'defend' })}>
            Defend
          </Button>
          <Button
            variant="ghost"
            block
            disabled={busy || enemy.isBoss}
            onClick={() => onAction({ kind: 'run' })}
            title={enemy.isBoss ? 'You cannot flee from a boss!' : undefined}
          >
            Run
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
