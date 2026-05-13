import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Separator,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@pixelore/react'
import { ITEMS, type Inventory, type ItemId } from '../game/items'
import { CLASSES } from '../game/data'
import type { Hero } from '../game/types'

interface InventoryScreenProps {
  hero: Hero
  inventory: Inventory
  onUse: (id: ItemId) => void
  onBack: () => void
}

/**
 * The inventory screen — exercises Tabs (Items / Equipment / Quests) +
 * Tooltip (hover an item to read its description) + Separator + Card +
 * Badge. Items can be used outside of battle when their `usableOnMap` flag
 * is set.
 */
export function InventoryScreen({ hero, inventory, onUse, onBack }: InventoryScreenProps) {
  return (
    <main className="flex flex-1 flex-col gap-4 px-3 py-4 sm:gap-6 sm:px-6 sm:py-6">
      <header className="flex flex-wrap items-center justify-between gap-2 sm:gap-3">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <Badge variant="accent">Inventory</Badge>
          <span className="font-body text-base text-po-fg-muted sm:text-lg">
            Gold: <span className="text-po-accent">{hero.gold}g</span>
          </span>
        </div>
        <Button variant="ghost" size="sm" onClick={onBack}>
          ← Back
        </Button>
      </header>

      <Tabs defaultValue="items">
        <TabsList>
          <TabsTrigger value="items">Items</TabsTrigger>
          <TabsTrigger value="equipment">Equipment</TabsTrigger>
          <TabsTrigger value="quests">Quests</TabsTrigger>
        </TabsList>

        <TabsContent value="items">
          <ItemsTab hero={hero} inventory={inventory} onUse={onUse} />
        </TabsContent>

        <TabsContent value="equipment">
          <EquipmentTab hero={hero} />
        </TabsContent>

        <TabsContent value="quests">
          <QuestsTab />
        </TabsContent>
      </Tabs>
    </main>
  )
}

function ItemsTab({
  hero,
  inventory,
  onUse,
}: {
  hero: Hero
  inventory: Inventory
  onUse: (id: ItemId) => void
}) {
  if (inventory.length === 0) {
    return (
      <Card>
        <CardContent>
          <p className="font-body text-lg text-po-fg-muted">
            Your bag is empty. Defeat enemies or visit the merchant.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {inventory.map((slot) => {
        const item = ITEMS[slot.itemId]
        const usable = item.usableOnMap
        const wouldBeWasted =
          (item.effect.kind === 'heal' && hero.hp >= hero.maxHp) ||
          (item.effect.kind === 'restore-mp' && hero.mp >= hero.maxMp)
        return (
          <Tooltip key={slot.itemId}>
            <TooltipTrigger asChild>
              <Card interactive className="w-full">
                <CardHeader>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl" aria-hidden="true">
                        {item.sprite}
                      </span>
                      <CardTitle>{item.name}</CardTitle>
                    </div>
                    <Badge variant="neutral">×{slot.quantity}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="mb-3 font-body text-base text-po-fg-muted">
                    {item.description}
                  </p>
                  <Button
                    variant="primary"
                    size="sm"
                    disabled={!usable || wouldBeWasted}
                    onClick={() => onUse(slot.itemId)}
                  >
                    {!usable ? 'Battle only' : wouldBeWasted ? 'Already full' : 'Use'}
                  </Button>
                </CardContent>
              </Card>
            </TooltipTrigger>
            <TooltipContent>{item.description}</TooltipContent>
          </Tooltip>
        )
      })}
    </div>
  )
}

function EquipmentTab({ hero }: { hero: Hero }) {
  // Equipment isn't yet a real subsystem — this view is a placeholder that
  // sets up the layout (and demonstrates a third Tabs panel + Separator).
  const profile = CLASSES[hero.heroClass]
  return (
    <Card>
      <CardHeader>
        <CardTitle>{hero.name}</CardTitle>
        <Badge variant="neutral" size="sm" className="self-start">
          {profile.name}
        </Badge>
      </CardHeader>
      <CardContent>
        <p className="mb-3 font-body text-base text-po-fg-muted">{profile.blurb}</p>
        <Separator className="my-3" />
        <dl className="grid grid-cols-2 gap-2 font-body text-base sm:grid-cols-3 sm:gap-3">
          <Stat label="HP" value={`${hero.hp} / ${hero.maxHp}`} />
          <Stat label="MP" value={`${hero.mp} / ${hero.maxMp}`} />
          <Stat label="LVL" value={String(hero.level)} />
          <Stat label="ATK" value={String(hero.atk)} />
          <Stat label="DEF" value={String(hero.def)} />
          <Stat label="SPD" value={String(hero.spd)} />
        </dl>
        <Separator className="my-4" />
        <p className="font-body text-base text-po-fg-muted">
          Crafting weapons & armour ships in v0.3 — for now your fists do the talking.
        </p>
      </CardContent>
    </Card>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col items-center border-2 border-po-border bg-po-bg-elevated p-2">
      <dt className="font-display text-[9px] uppercase tracking-wider text-po-fg-muted">
        {label}
      </dt>
      <dd className="font-display text-base text-po-fg">{value}</dd>
    </div>
  )
}

function QuestsTab() {
  // Quest log is intentionally static for now — gives the user something to
  // read and demonstrates the third Tabs panel with mixed content.
  return (
    <div className="flex flex-col gap-3">
      <Card>
        <CardHeader>
          <Badge variant="primary" size="sm" className="self-start">
            Main
          </Badge>
          <CardTitle>Defeat the Pixel Dragon</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="font-body text-base text-po-fg-muted">
            The Pixel Dragon waits in the northwest corner of the realm. Level up,
            stock potions, and bring fire.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <Badge variant="secondary" size="sm" className="self-start">
            Side
          </Badge>
          <CardTitle>Reach Lv 5</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="font-body text-base text-po-fg-muted">
            Mid-realm enemies hit hard. Get to Lv 5 before approaching the boss.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
