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
import { startBattleHero } from './game/battle'
import { createHero, HERO_START } from './game/data'
import {
  deriveStats,
  EQUIPMENT,
  equipPiece,
  unequipPiece,
  type EquipmentId,
  type EquipmentSlot,
} from './game/equipment'
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
  // The save file is the source of truth for `hasSave()` — components read it
  // directly at render time rather than mirroring it in component state.
  useEffect(() => {
    if (screen === 'victory' || screen === 'defeat') {
      clearSave()
    } else if (
      screen === 'map' ||
      screen === 'battle' ||
      screen === 'inventory'
    ) {
      writeSave(state)
    }
  }, [state, screen])

  const beginNewGame = useCallback((name: string, heroClass: HeroClass) => {
    clearSave()
    setState(initialState(name, heroClass))
    setScreen('map')
  }, [])

  const start = useCallback(
    (name?: string, heroClass?: HeroClass) => {
      const safeName = name ?? 'Eddy'
      const safeClass = heroClass ?? 'warrior'
      if (hasSave()) {
        setPendingNewGame({ name: safeName, heroClass: safeClass })
        return
      }
      beginNewGame(safeName, safeClass)
    },
    [beginNewGame],
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
    setState((s) => ({ ...s, hero: startBattleHero(s.hero), encounteredEnemy: enemy }))
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
      const derived = deriveStats(s.hero)
      const applied = applyItem(s.hero, item, {
        maxHp: derived.maxHp,
        maxMp: derived.maxMp,
      })
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

  const buyEquipment = useCallback((id: EquipmentId) => {
    setState((s) => {
      const piece = EQUIPMENT[id]
      if (s.hero.gold < piece.price) return s
      if (s.hero.ownedEquipment.includes(id)) return s
      return {
        ...s,
        hero: {
          ...s.hero,
          gold: s.hero.gold - piece.price,
          ownedEquipment: [...s.hero.ownedEquipment, id],
        },
      }
    })
  }, [])

  const equipItem = useCallback((id: EquipmentId) => {
    setState((s) => {
      if (!s.hero.ownedEquipment.includes(id)) return s
      const { loadout } = equipPiece(s.hero.equipped, id)
      return { ...s, hero: { ...s.hero, equipped: loadout } }
    })
  }, [])

  const unequipSlot = useCallback((slot: EquipmentSlot) => {
    setState((s) => {
      const { loadout } = unequipPiece(s.hero.equipped, slot)
      const derived = deriveStats({ ...s.hero, equipped: loadout })
      // Clamp current HP/MP to the new caps so unequipping doesn't leave the
      // hero "overfilled" on display.
      return {
        ...s,
        hero: {
          ...s.hero,
          equipped: loadout,
          hp: Math.min(s.hero.hp, derived.maxHp),
          mp: Math.min(s.hero.mp, derived.maxMp),
        },
      }
    })
  }, [])

  const healFromNpc = useCallback(() => {
    setState((s) => {
      if (s.hero.gold < HEAL_COST) return s
      const derived = deriveStats(s.hero)
      const atFull = s.hero.hp === derived.maxHp && s.hero.mp === derived.maxMp
      if (atFull) return s
      return {
        ...s,
        hero: {
          ...s.hero,
          gold: s.hero.gold - HEAL_COST,
          hp: derived.maxHp,
          mp: derived.maxMp,
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
            hasSave={hasSave()}
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
            onEquip={equipItem}
            onUnequip={unequipSlot}
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
          onBuyEquipment={buyEquipment}
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
                Starting a new quest will erase your existing save. This
                can&apos;t be undone.
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
