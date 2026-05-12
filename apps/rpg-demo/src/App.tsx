import { useCallback, useEffect, useState } from 'react'
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  TooltipProvider,
} from '@pixelore/react'
import { TitleScreen } from './screens/TitleScreen'
import { MapScreen } from './screens/MapScreen'
import { BattleScreen } from './screens/BattleScreen'
import { EndScreen } from './screens/EndScreen'
import { InventoryScreen } from './screens/InventoryScreen'
import { createHero, HERO_START } from './game/data'
import {
  addItem,
  applyItem,
  createStartingInventory,
  ITEMS,
  removeItem,
  type Inventory,
  type ItemId,
} from './game/items'
import { HEAL_COST, type NpcDef } from './game/npcs'
import { DEFAULT_SETTINGS, type Settings } from './game/settings'
import {
  clearSave,
  hasSave,
  loadSave,
  loadSettings,
  writeSave,
  writeSettings,
} from './game/save'
import { NpcDialog } from './components/NpcDialog'
import type { Enemy, Hero, HeroClass, MapPosition, Screen } from './game/types'

export interface GameState {
  hero: Hero
  inventory: Inventory
  position: MapPosition
  encounteredEnemy: Enemy | null
  defeatedBoss: boolean
  steps: number
}

function initialState(name?: string, heroClass?: HeroClass): GameState {
  return {
    hero: createHero(name, heroClass),
    inventory: createStartingInventory(),
    position: { ...HERO_START },
    encounteredEnemy: null,
    defeatedBoss: false,
    steps: 0,
  }
}

interface PendingNewGame {
  name: string
  heroClass: HeroClass
}

export function App() {
  const [screen, setScreen] = useState<Screen>('title')
  const [state, setState] = useState<GameState>(() => initialState())
  const [settings, setSettings] = useState<Settings>(
    () => loadSettings() ?? DEFAULT_SETTINGS,
  )
  const [hasSaveState, setHasSaveState] = useState<boolean>(() => hasSave())
  const [pendingNewGame, setPendingNewGame] = useState<PendingNewGame | null>(null)
  const [activeNpc, setActiveNpc] = useState<NpcDef | null>(null)
  // After a battle ends we route back to map (or to victory/defeat). When the
  // player visits Inventory mid-game we want to remember where they came from.
  const [previousScreen, setPreviousScreen] = useState<Screen>('map')

  // Apply the scanline overlay setting at the body level so it doesn't have to
  // be re-applied on every screen mount.
  useEffect(() => {
    document.body.classList.toggle('po-scanlines', settings.scanlines)
    document.body.classList.toggle('relative', settings.scanlines)
  }, [settings.scanlines])

  // Persist settings whenever they change.
  useEffect(() => {
    writeSettings(settings)
  }, [settings])

  // Persist game state during active play; clear save once the run ends.
  useEffect(() => {
    if (screen === 'victory' || screen === 'defeat') {
      clearSave()
      setHasSaveState(false)
    } else if (
      screen === 'map' ||
      screen === 'battle' ||
      screen === 'inventory'
    ) {
      writeSave(state)
      setHasSaveState(true)
    }
  }, [state, screen])

  const beginNewGame = useCallback((name: string, heroClass: HeroClass) => {
    clearSave()
    setHasSaveState(false)
    setState(initialState(name, heroClass))
    setScreen('map')
  }, [])

  const start = useCallback(
    (name?: string, heroClass?: HeroClass) => {
      const safeName = name ?? 'Eddy'
      const safeClass = heroClass ?? 'warrior'
      if (hasSaveState) {
        setPendingNewGame({ name: safeName, heroClass: safeClass })
        return
      }
      beginNewGame(safeName, safeClass)
    },
    [hasSaveState, beginNewGame],
  )

  const continueSave = useCallback(() => {
    const saved = loadSave()
    if (!saved) return
    setState(saved)
    setScreen('map')
  }, [])

  const confirmOverwrite = useCallback(() => {
    if (!pendingNewGame) return
    beginNewGame(pendingNewGame.name, pendingNewGame.heroClass)
    setPendingNewGame(null)
  }, [pendingNewGame, beginNewGame])

  const startEncounter = useCallback((enemy: Enemy) => {
    setState((s) => ({ ...s, encounteredEnemy: enemy }))
    setScreen('battle')
  }, [])

  const finishBattle = useCallback(
    (
      hero: Hero,
      inventory: Inventory,
      outcome: 'victory' | 'defeat' | 'fled',
      defeatedEnemyId: string | null,
    ) => {
      setState((s) => ({
        ...s,
        hero,
        inventory,
        encounteredEnemy: null,
        defeatedBoss: s.defeatedBoss || defeatedEnemyId === 'dragon',
      }))
      if (outcome === 'defeat') setScreen('defeat')
      else if (outcome === 'victory' && defeatedEnemyId === 'dragon') setScreen('victory')
      else setScreen('map')
    },
    [],
  )

  const move = useCallback((next: MapPosition) => {
    setState((s) => ({ ...s, position: next, steps: s.steps + 1 }))
  }, [])

  const openInventory = useCallback(() => {
    setPreviousScreen(screen === 'inventory' ? previousScreen : screen)
    setScreen('inventory')
  }, [screen, previousScreen])

  const useItemFromInventory = useCallback((itemId: ItemId) => {
    setState((s) => {
      const slot = s.inventory.find((x) => x.itemId === itemId)
      if (!slot || slot.quantity <= 0) return s
      const item = ITEMS[itemId]
      const applied = applyItem(s.hero, item)
      return {
        ...s,
        hero: applied.hero,
        inventory: removeItem(s.inventory, itemId, 1),
      }
    })
  }, [])

  const buyItem = useCallback((itemId: ItemId) => {
    setState((s) => {
      const item = ITEMS[itemId]
      if (s.hero.gold < item.price) return s
      return {
        ...s,
        hero: { ...s.hero, gold: s.hero.gold - item.price },
        inventory: addItem(s.inventory, itemId, 1),
      }
    })
  }, [])

  const healFromNpc = useCallback(() => {
    setState((s) => {
      if (s.hero.gold < HEAL_COST) return s
      const atFull = s.hero.hp === s.hero.maxHp && s.hero.mp === s.hero.maxMp
      if (atFull) return s
      return {
        ...s,
        hero: {
          ...s.hero,
          gold: s.hero.gold - HEAL_COST,
          hp: s.hero.maxHp,
          mp: s.hero.maxMp,
        },
      }
    })
  }, [])

  return (
    <TooltipProvider delayDuration={150}>
      <div className="relative mx-auto flex h-full min-h-screen max-w-5xl flex-col">
        {screen === 'title' && (
          <TitleScreen
            onStart={start}
            hasSave={hasSaveState}
            onContinue={continueSave}
          />
        )}
        {screen === 'map' && (
          <MapScreen
            hero={state.hero}
            inventory={state.inventory}
            settings={settings}
            position={state.position}
            defeatedBoss={state.defeatedBoss}
            steps={state.steps}
            onMove={move}
            onEncounter={startEncounter}
            onSurrender={() => setScreen('title')}
            onOpenInventory={openInventory}
            onUpdateSettings={setSettings}
            onTalkToNpc={setActiveNpc}
          />
        )}
        {screen === 'battle' && state.encounteredEnemy && (
          <BattleScreen
            hero={state.hero}
            enemy={state.encounteredEnemy}
            inventory={state.inventory}
            settings={settings}
            onFinish={finishBattle}
          />
        )}
        {screen === 'inventory' && (
          <InventoryScreen
            hero={state.hero}
            inventory={state.inventory}
            onUse={useItemFromInventory}
            onBack={() => setScreen(previousScreen)}
          />
        )}
        {(screen === 'victory' || screen === 'defeat') && (
          <EndScreen
            variant={screen}
            hero={state.hero}
            steps={state.steps}
            onRestart={() => start()}
            onTitle={() => setScreen('title')}
          />
        )}

        <NpcDialog
          npc={activeNpc}
          hero={state.hero}
          onClose={() => setActiveNpc(null)}
          onBuy={buyItem}
          onHeal={healFromNpc}
        />

        <Dialog
          open={pendingNewGame !== null}
          onOpenChange={(open) => {
            if (!open) setPendingNewGame(null)
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Overwrite saved game?</DialogTitle>
              <DialogDescription>
                Starting a new quest will erase your existing save. This can't
                be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setPendingNewGame(null)}>
                Keep playing
              </Button>
              <Button variant="primary" onClick={confirmOverwrite}>
                Start fresh
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  )
}
