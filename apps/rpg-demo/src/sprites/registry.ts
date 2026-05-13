/**
 * Sprite registry. Maps a `kind` + `id` to the public path on disk and the
 * emoji to render when the PNG isn't there yet. Stage 0 of the sprite
 * migration ships zero real PNGs — every lookup falls back to its emoji, so
 * the game renders identically to before until art lands.
 *
 * See apps/rpg-demo/SPRITES.md for the migration roadmap.
 */

export type SpriteKind = 'enemy' | 'hero' | 'token' | 'item' | 'equipment' | 'status'

/** Source frame size in CSS pixels for each kind. The `<Sprite>` component
 *  scales by integer multiples to keep nearest-neighbour rendering crisp. */
export const NATIVE_SIZE: Record<SpriteKind, number> = {
  enemy: 64,
  hero: 48,
  token: 16,
  item: 16,
  equipment: 16,
  status: 12,
}

const FOLDER: Record<SpriteKind, string> = {
  enemy: 'enemies',
  hero: 'heroes',
  token: 'tokens',
  item: 'items',
  equipment: 'equipment',
  status: 'statuses',
}

/** Build the public URL for a given sprite. */
export function spritePath(kind: SpriteKind, id: string): string {
  return `/sprites/${FOLDER[kind]}/${id}.png`
}
