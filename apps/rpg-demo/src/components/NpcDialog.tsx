import {
  Badge,
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Separator,
} from '@pixelore/react'
import { ITEMS, type ItemId } from '../game/items'
import { HEAL_COST, MERCHANT_STOCK, type NpcDef } from '../game/npcs'
import type { Hero } from '../game/types'

interface NpcDialogProps {
  npc: NpcDef | null
  hero: Hero
  onClose: () => void
  onBuy: (itemId: ItemId) => void
  onHeal: () => void
}

export function NpcDialog({ npc, hero, onClose, onBuy, onHeal }: NpcDialogProps) {
  return (
    <Dialog
      open={npc !== null}
      onOpenChange={(open) => {
        if (!open) onClose()
      }}
    >
      <DialogContent className="max-w-xl">
        {npc && (
          <>
            <DialogHeader>
              <div className="flex items-center gap-3">
                <span className="text-3xl" aria-hidden="true">
                  {npc.sprite}
                </span>
                <div className="flex flex-col gap-1">
                  <DialogTitle>{npc.name}</DialogTitle>
                  <DialogDescription>{npc.greeting}</DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="flex items-center justify-between">
              <span className="font-display text-[10px] uppercase tracking-wider text-po-fg-muted">
                Your purse
              </span>
              <Badge variant="accent">{hero.gold}g</Badge>
            </div>
            <Separator />

            {npc.id === 'merchant' && (
              <MerchantBody hero={hero} onBuy={onBuy} />
            )}
            {npc.id === 'healer' && <HealerBody hero={hero} onHeal={onHeal} />}

            <DialogFooter>
              <Button variant="ghost" onClick={onClose}>
                Leave
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

function MerchantBody({
  hero,
  onBuy,
}: {
  hero: Hero
  onBuy: (itemId: ItemId) => void
}) {
  return (
    <ul className="flex flex-col gap-2">
      {MERCHANT_STOCK.map((id) => {
        const item = ITEMS[id]
        const cantAfford = hero.gold < item.price
        return (
          <li
            key={id}
            className="flex items-center gap-3 border-2 border-po-border bg-po-bg-elevated p-3"
          >
            <span className="text-2xl" aria-hidden="true">
              {item.sprite}
            </span>
            <div className="flex flex-1 flex-col">
              <span className="font-display text-xs uppercase tracking-wider text-po-fg">
                {item.name}
              </span>
              <span className="font-body text-base leading-snug text-po-fg-muted">
                {item.description}
              </span>
            </div>
            <Badge variant={cantAfford ? 'neutral' : 'accent'}>
              {item.price}g
            </Badge>
            <Button
              variant="primary"
              size="sm"
              disabled={cantAfford}
              onClick={() => onBuy(id)}
            >
              Buy
            </Button>
          </li>
        )
      })}
    </ul>
  )
}

function HealerBody({ hero, onHeal }: { hero: Hero; onHeal: () => void }) {
  const atFull = hero.hp === hero.maxHp && hero.mp === hero.maxMp
  const cantAfford = hero.gold < HEAL_COST

  let helperText: string
  if (atFull) helperText = 'You are already at full strength. Travel safely.'
  else if (cantAfford) helperText = `You need ${HEAL_COST}g for the rite.`
  else helperText = 'A full restore of HP and MP.'

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-2 font-body text-base text-po-fg">
        <Stat label="HP" value={hero.hp} max={hero.maxHp} />
        <Stat label="MP" value={hero.mp} max={hero.maxMp} />
      </div>
      <p className="font-body text-base text-po-fg-muted">{helperText}</p>
      <Button
        variant="primary"
        disabled={atFull || cantAfford}
        onClick={onHeal}
      >
        Rest at the chapel · {HEAL_COST}g
      </Button>
    </div>
  )
}

function Stat({ label, value, max }: { label: string; value: number; max: number }) {
  return (
    <div className="flex items-baseline justify-between border-2 border-po-border bg-po-bg-elevated px-3 py-1.5">
      <span className="font-display text-[10px] uppercase tracking-wider text-po-fg-muted">
        {label}
      </span>
      <span className="font-mono">
        {value} / {max}
      </span>
    </div>
  )
}
