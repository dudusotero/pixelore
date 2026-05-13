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
import {
  deriveStats,
  EQUIPMENT,
  type EquipmentId,
  type EquipmentSlot,
  type EquipmentTemplate,
} from '../game/equipment'
import { Sprite } from '../sprites'
import type { Hero } from '../game/types'

interface InventoryScreenProps {
  hero: Hero
  inventory: Inventory
  onUse: (id: ItemId) => void
  onEquip: (id: EquipmentId) => void
  onUnequip: (slot: EquipmentSlot) => void
  onBack: () => void
}

const SLOT_ORDER: EquipmentSlot[] = ['weapon', 'armor', 'trinket']
const SLOT_LABEL: Record<EquipmentSlot, string> = {
  weapon: 'Weapon',
  armor: 'Armor',
  trinket: 'Trinket',
}

/**
 * The inventory screen — exercises Tabs (Items / Equipment / Quests) +
 * Tooltip (hover an item to read its description) + Separator + Card +
 * Badge. Items can be used outside of battle when their `usableOnMap` flag
 * is set.
 */
export function InventoryScreen({
  hero,
  inventory,
  onUse,
  onEquip,
  onUnequip,
  onBack,
}: InventoryScreenProps) {
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
          <EquipmentTab hero={hero} onEquip={onEquip} onUnequip={onUnequip} />
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

  const derived = deriveStats(hero)

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {inventory.map((slot) => {
        const item = ITEMS[slot.itemId]
        const usable = item.usableOnMap
        const wouldBeWasted =
          (item.effect.kind === 'heal' && hero.hp >= derived.maxHp) ||
          (item.effect.kind === 'restore-mp' && hero.mp >= derived.maxMp)
        return (
          <Tooltip key={slot.itemId}>
            <TooltipTrigger asChild>
              <Card interactive className="w-full">
                <CardHeader>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <Sprite
                        kind="item"
                        id={slot.itemId}
                        size={32}
                        label={item.name}
                      />
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

function EquipmentTab({
  hero,
  onEquip,
  onUnequip,
}: {
  hero: Hero
  onEquip: (id: EquipmentId) => void
  onUnequip: (slot: EquipmentSlot) => void
}) {
  const profile = CLASSES[hero.heroClass]
  const derived = deriveStats(hero)
  const stash = hero.ownedEquipment.filter(
    (id) => !Object.values(hero.equipped).includes(id),
  )

  return (
    <div className="flex flex-col gap-4">
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
            <Stat label="HP" value={`${hero.hp} / ${derived.maxHp}`} />
            <Stat label="MP" value={`${hero.mp} / ${derived.maxMp}`} />
            <Stat label="LVL" value={String(hero.level)} />
            <Stat label="ATK" value={String(derived.atk)} />
            <Stat label="DEF" value={String(derived.def)} />
            <Stat label="SPD" value={String(derived.spd)} />
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Equipped</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2">
            {SLOT_ORDER.map((slot) => {
              const id = hero.equipped[slot]
              const piece = id ? EQUIPMENT[id] : null
              return (
                <div
                  key={slot}
                  className="flex items-center gap-3 border-2 border-po-border bg-po-bg-elevated p-3"
                >
                  <Badge variant="neutral" size="sm">
                    {SLOT_LABEL[slot]}
                  </Badge>
                  {piece ? (
                    <>
                      <Sprite
                        kind="equipment"
                        id={piece.id}
                        size={28}
                        label={piece.name}
                      />
                      <div className="flex flex-1 flex-col">
                        <span className="font-display text-xs uppercase tracking-wider text-po-fg">
                          {piece.name}
                        </span>
                        <span className="font-body text-base leading-snug text-po-fg-muted">
                          {bonusSummary(piece)}
                        </span>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => onUnequip(slot)}>
                        Unequip
                      </Button>
                    </>
                  ) : (
                    <span className="flex-1 font-body text-base text-po-fg-muted">
                      Empty
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Stash</CardTitle>
        </CardHeader>
        <CardContent>
          {stash.length === 0 && (
            <p className="font-body text-base text-po-fg-muted">
              Nothing in storage. Visit the merchant to buy gear.
            </p>
          )}
          <div className="grid gap-2 sm:grid-cols-2">
            {stash.map((id) => {
              const piece = EQUIPMENT[id]
              return (
                <Tooltip key={id}>
                  <TooltipTrigger asChild>
                    <Card interactive>
                      <CardHeader>
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <Sprite
                              kind="equipment"
                              id={piece.id}
                              size={32}
                              label={piece.name}
                            />
                            <CardTitle>{piece.name}</CardTitle>
                          </div>
                          <Badge variant="neutral" size="sm">
                            {SLOT_LABEL[piece.slot]}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="mb-3 font-body text-base text-po-fg-muted">
                          {piece.description}
                        </p>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => onEquip(id)}
                        >
                          Equip
                        </Button>
                      </CardContent>
                    </Card>
                  </TooltipTrigger>
                  <TooltipContent>{bonusSummary(piece)}</TooltipContent>
                </Tooltip>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function bonusSummary(piece: EquipmentTemplate): string {
  const parts: string[] = []
  const b = piece.bonuses
  if (b.atk) parts.push(`${b.atk > 0 ? '+' : ''}${b.atk} ATK`)
  if (b.def) parts.push(`${b.def > 0 ? '+' : ''}${b.def} DEF`)
  if (b.spd) parts.push(`${b.spd > 0 ? '+' : ''}${b.spd} SPD`)
  if (b.maxHp) parts.push(`${b.maxHp > 0 ? '+' : ''}${b.maxHp} HP`)
  if (b.maxMp) parts.push(`${b.maxMp > 0 ? '+' : ''}${b.maxMp} MP`)
  if (b.critBonus) parts.push(`${b.critBonus > 0 ? '+' : ''}${Math.round(b.critBonus * 100)}% crit`)
  if (piece.passive === 'grant-shield') parts.push('Battle start: Shield')
  return parts.join(' · ') || piece.description
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
