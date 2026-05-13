import type { ItemId } from './items'
import type { MapPosition } from './types'

export type NpcId = 'merchant' | 'healer'

export interface NpcDef {
  id: NpcId
  name: string
  position: MapPosition
  /** Short flavor line shown at the top of the dialog. */
  greeting: string
}

/** Items sold by the merchant, in display order. */
export const MERCHANT_STOCK: ItemId[] = ['potion', 'ether', 'hero-stone', 'elixir']

/** Cost of a full HP+MP restore at the healer. */
export const HEAL_COST = 30

export const NPCS: NpcDef[] = [
  {
    id: 'merchant',
    name: 'Merchant Brim',
    position: { x: 7, y: 3 },
    greeting: 'Adventurer! Step closer — my wares won’t bite. Most of them.',
  },
  {
    id: 'healer',
    name: 'Sister Vael',
    position: { x: 3, y: 7 },
    greeting: 'Rest a while. The road only gets harder from here.',
  },
]

export function findNpcAt(pos: MapPosition): NpcDef | null {
  return NPCS.find((n) => n.position.x === pos.x && n.position.y === pos.y) ?? null
}
