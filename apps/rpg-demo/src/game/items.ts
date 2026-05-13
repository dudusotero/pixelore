import type { Hero } from './types'

export type ItemId = 'potion' | 'ether' | 'hero-stone' | 'elixir'

export interface ItemTemplate {
  id: ItemId
  name: string
  description: string
  /** What happens when the hero consumes it. */
  effect:
    | { kind: 'heal'; amount: number }
    | { kind: 'restore-mp'; amount: number }
    | { kind: 'revive'; hpFraction: number }
    | { kind: 'full-restore' }
  /** Gold cost at the merchant. */
  price: number
  /** Whether the item can be used outside of battle. */
  usableOnMap?: boolean
}

export const ITEMS: Record<ItemId, ItemTemplate> = {
  potion: {
    id: 'potion',
    name: 'Potion',
    description: 'Restores 30 HP. Tastes like cherry medicine.',
    effect: { kind: 'heal', amount: 30 },
    price: 15,
    usableOnMap: true,
  },
  ether: {
    id: 'ether',
    name: 'Ether',
    description: 'Restores 8 MP. Bubbling blue mystery.',
    effect: { kind: 'restore-mp', amount: 8 },
    price: 25,
    usableOnMap: true,
  },
  'hero-stone': {
    id: 'hero-stone',
    name: 'Hero Stone',
    description: 'Adds a life to the party. Used automatically on defeat.',
    effect: { kind: 'revive', hpFraction: 0.4 },
    price: 80,
  },
  elixir: {
    id: 'elixir',
    name: 'Elixir',
    description: 'Restores HP and MP to maximum. Vanishing-rare.',
    effect: { kind: 'full-restore' },
    price: 120,
    usableOnMap: true,
  },
}

export interface InventorySlot {
  itemId: ItemId
  quantity: number
}

export type Inventory = InventorySlot[]

export function createStartingInventory(): Inventory {
  return [
    { itemId: 'potion', quantity: 3 },
    { itemId: 'ether', quantity: 1 },
  ]
}

export function countItem(inventory: Inventory, id: ItemId): number {
  return inventory.find((s) => s.itemId === id)?.quantity ?? 0
}

export function addItem(inventory: Inventory, id: ItemId, qty = 1): Inventory {
  const existing = inventory.find((s) => s.itemId === id)
  if (existing) {
    return inventory.map((s) =>
      s.itemId === id ? { ...s, quantity: s.quantity + qty } : s,
    )
  }
  return [...inventory, { itemId: id, quantity: qty }]
}

export function removeItem(inventory: Inventory, id: ItemId, qty = 1): Inventory {
  return inventory
    .map((s) => (s.itemId === id ? { ...s, quantity: s.quantity - qty } : s))
    .filter((s) => s.quantity > 0)
}

/**
 * Apply an item's effect to the hero and return the new hero state plus a
 * description of what happened (for the battle log / toast). `caps` lets
 * callers supply equipment-derived max HP/MP so healing respects gear bonuses.
 */
export function applyItem(
  hero: Hero,
  item: ItemTemplate,
  caps: { maxHp: number; maxMp: number } = { maxHp: hero.maxHp, maxMp: hero.maxMp },
): { hero: Hero; message: string } {
  switch (item.effect.kind) {
    case 'heal': {
      const restore = Math.min(item.effect.amount, caps.maxHp - hero.hp)
      return {
        hero: { ...hero, hp: hero.hp + restore },
        message: `${item.name} restores ${restore} HP.`,
      }
    }
    case 'restore-mp': {
      const restore = Math.min(item.effect.amount, caps.maxMp - hero.mp)
      return {
        hero: { ...hero, mp: hero.mp + restore },
        message: `${item.name} restores ${restore} MP.`,
      }
    }
    case 'revive': {
      const restore = Math.round(caps.maxHp * item.effect.hpFraction)
      return {
        hero: { ...hero, hp: restore, lives: hero.lives + 1 },
        message: `${item.name} grants an extra life.`,
      }
    }
    case 'full-restore': {
      return {
        hero: { ...hero, hp: caps.maxHp, mp: caps.maxMp },
        message: `${item.name} fully restores HP and MP.`,
      }
    }
  }
}
