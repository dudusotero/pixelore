import { useCallback, useEffect } from 'react'
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  HeartBar,
  Progress,
} from '@pixelore/react'
import {
  BOSS_POS,
  ENCOUNTER_RATE,
  MAP_SIZE,
  bossEncounter,
  rollEncounter,
} from '../game/data'
import { countItem, type Inventory } from '../game/items'
import { findNpcAt, NPCS, type NpcDef } from '../game/npcs'
import type { Settings } from '../game/settings'
import type { Enemy, Hero, MapPosition } from '../game/types'
import { HeroStatPanel } from '../components/HeroStatPanel'
import { SettingsDialog } from '../components/SettingsDialog'

interface MapScreenProps {
  hero: Hero
  inventory: Inventory
  settings: Settings
  position: MapPosition
  defeatedBoss: boolean
  steps: number
  onMove: (next: MapPosition) => void
  onEncounter: (enemy: Enemy) => void
  onSurrender: () => void
  onOpenInventory: () => void
  onUpdateSettings: (next: Settings) => void
  onTalkToNpc: (npc: NpcDef) => void
}

function distance(a: MapPosition, b: MapPosition) {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y)
}

export function MapScreen({
  hero,
  inventory,
  settings,
  position,
  defeatedBoss,
  steps,
  onMove,
  onEncounter,
  onSurrender,
  onOpenInventory,
  onUpdateSettings,
  onTalkToNpc,
}: MapScreenProps) {
  const potionCount = countItem(inventory, 'potion')
  const tryMove = useCallback(
    (dx: number, dy: number) => {
      const next = {
        x: Math.max(0, Math.min(MAP_SIZE - 1, position.x + dx)),
        y: Math.max(0, Math.min(MAP_SIZE - 1, position.y + dy)),
      }
      if (next.x === position.x && next.y === position.y) return
      onMove(next)

      // Boss tile triggers boss encounter immediately
      if (!defeatedBoss && next.x === BOSS_POS.x && next.y === BOSS_POS.y) {
        onEncounter(bossEncounter())
        return
      }

      // NPC tiles are safe (no random encounter) and open a shop / chapel.
      const npc = findNpcAt(next)
      if (npc) {
        onTalkToNpc(npc)
        return
      }

      const distFromCenter = distance(next, { x: 5, y: 5 })
      if (Math.random() < ENCOUNTER_RATE) {
        onEncounter(rollEncounter(distFromCenter))
      }
    },
    [position, defeatedBoss, onMove, onEncounter, onTalkToNpc],
  )

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          e.preventDefault()
          tryMove(0, -1)
          break
        case 'ArrowDown':
        case 's':
        case 'S':
          e.preventDefault()
          tryMove(0, 1)
          break
        case 'ArrowLeft':
        case 'a':
        case 'A':
          e.preventDefault()
          tryMove(-1, 0)
          break
        case 'ArrowRight':
        case 'd':
        case 'D':
          e.preventDefault()
          tryMove(1, 0)
          break
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [tryMove])

  return (
    <main className="relative flex flex-1 flex-col gap-4 px-3 py-4 pb-[12.5rem] sm:gap-6 sm:px-6 sm:py-6 lg:pb-6">
      <header className="flex flex-wrap items-center justify-between gap-2 sm:gap-3">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <Badge variant="accent">World Map</Badge>
          <span className="font-body text-base text-po-fg-muted sm:text-lg">
            Steps: <span className="text-po-fg">{steps}</span>
          </span>
          <span className="font-body text-base text-po-fg-muted sm:text-lg">
            Gold: <span className="text-po-accent">{hero.gold}g</span>
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="secondary" size="sm" onClick={onOpenInventory}>
            Inventory{potionCount > 0 ? ` · ${potionCount} 🧪` : ''}
          </Button>
          <SettingsDialog
            settings={settings}
            onChange={onUpdateSettings}
            trigger={
              <Button variant="ghost" size="sm">
                Settings
              </Button>
            }
          />
          <Button variant="ghost" size="sm" onClick={onSurrender}>
            Quit
          </Button>
        </div>
      </header>

      <div className="grid gap-4 sm:gap-6 lg:grid-cols-[1fr_280px]">
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>{defeatedBoss ? 'Realm Saved' : 'Hunt the Dragon'}</CardTitle>
          </CardHeader>
          <CardContent>
            <MapGrid position={position} defeatedBoss={defeatedBoss} />
            <p className="mt-4 font-body text-base text-po-fg-muted">
              {defeatedBoss
                ? 'The dragon is slain. Roam the realm in peace.'
                : 'Reach the dragon at the top-left. Random encounters lurk every step.'}
            </p>
          </CardContent>
        </Card>

        <aside className="flex flex-col gap-4">
          <HeroStatPanel hero={hero} />
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-1">
            <Card>
              <CardHeader>
                <CardTitle>Lives</CardTitle>
              </CardHeader>
              <CardContent>
                <HeartBar value={hero.lives} max={hero.maxLives} label="Hero stones" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>XP</CardTitle>
              </CardHeader>
              <CardContent>
                <Progress value={hero.xp} max={hero.xpToNext} />
                <p className="mt-2 font-body text-base text-po-fg-muted">
                  {hero.xp} / {hero.xpToNext}
                </p>
              </CardContent>
            </Card>
          </div>
          {/* Desktop move pad — the mobile version lives in the sticky footer below. */}
          <Card className="hidden lg:block">
            <CardHeader>
              <CardTitle>Move</CardTitle>
            </CardHeader>
            <CardContent>
              <MovementPad onMove={tryMove} />
            </CardContent>
          </Card>
        </aside>
      </div>

      {/* Thumb-friendly fixed pad on mobile so the player can move without
          scrolling away from the map. Falls back to the in-sidebar Card above
          at lg+. */}
      <div
        className="fixed inset-x-0 bottom-0 z-30 border-t-2 border-po-border bg-po-bg/95 px-3 py-3 backdrop-blur supports-[backdrop-filter]:bg-po-bg/80 lg:hidden"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 0.75rem)' }}
      >
        <MovementPad onMove={tryMove} />
      </div>
    </main>
  )
}

function MapGrid({
  position,
  defeatedBoss,
}: {
  position: MapPosition
  defeatedBoss: boolean
}) {
  return (
    <div
      role="grid"
      aria-label="World map"
      className="grid border-2 border-black"
      style={{ gridTemplateColumns: `repeat(${MAP_SIZE}, minmax(0, 1fr))` }}
    >
      {Array.from({ length: MAP_SIZE * MAP_SIZE }).map((_, idx) => {
        const x = idx % MAP_SIZE
        const y = Math.floor(idx / MAP_SIZE)
        const isHero = x === position.x && y === position.y
        const isBoss = x === BOSS_POS.x && y === BOSS_POS.y && !defeatedBoss
        const npcHere = NPCS.find((n) => n.position.x === x && n.position.y === y)
        const isEdge = x === 0 || y === 0 || x === MAP_SIZE - 1 || y === MAP_SIZE - 1
        const distFromCenter = Math.abs(x - 5) + Math.abs(y - 5)
        return (
          <div
            key={idx}
            role="gridcell"
            aria-current={isHero ? 'true' : undefined}
            className={
              'relative flex aspect-square items-center justify-center border border-po-border text-xl ' +
              (isEdge
                ? 'bg-po-bg-elevated'
                : distFromCenter < 3
                  ? 'bg-po-surface'
                  : 'bg-po-bg-elevated')
            }
          >
            {isHero ? (
              <span
                aria-label="Your position"
                className="z-10 text-base drop-shadow sm:text-xl md:text-2xl lg:text-3xl"
              >
                🛡
              </span>
            ) : isBoss ? (
              <span
                aria-label="Boss"
                className="text-base sm:text-xl md:text-2xl lg:text-3xl"
              >
                🐉
              </span>
            ) : npcHere ? (
              <span
                aria-label={npcHere.name}
                className="text-sm sm:text-base md:text-xl lg:text-2xl"
              >
                {npcHere.sprite}
              </span>
            ) : null}
          </div>
        )
      })}
    </div>
  )
}

function MovementPad({ onMove }: { onMove: (dx: number, dy: number) => void }) {
  return (
    <div
      aria-label="Movement controls"
      className="mx-auto grid w-44 grid-cols-3 grid-rows-3 gap-1.5 sm:w-48"
    >
      <span />
      <Button
        variant="secondary"
        onClick={() => onMove(0, -1)}
        aria-label="Move north"
        className="h-12 min-h-12 px-0 text-lg sm:h-11 sm:min-h-11"
      >
        ▲
      </Button>
      <span />
      <Button
        variant="secondary"
        onClick={() => onMove(-1, 0)}
        aria-label="Move west"
        className="h-12 min-h-12 px-0 text-lg sm:h-11 sm:min-h-11"
      >
        ◀
      </Button>
      <span />
      <Button
        variant="secondary"
        onClick={() => onMove(1, 0)}
        aria-label="Move east"
        className="h-12 min-h-12 px-0 text-lg sm:h-11 sm:min-h-11"
      >
        ▶
      </Button>
      <span />
      <Button
        variant="secondary"
        onClick={() => onMove(0, 1)}
        aria-label="Move south"
        className="h-12 min-h-12 px-0 text-lg sm:h-11 sm:min-h-11"
      >
        ▼
      </Button>
      <span />
    </div>
  )
}
