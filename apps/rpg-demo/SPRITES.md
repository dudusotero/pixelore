# Sprite Migration Plan

Moving the RPG demo from emoji glyphs to a real pixel-art sprite pipeline.
All seven migration stages are complete; this document is kept as the
historical record of how the system was built and what conventions to follow
when adding new sprites.

**Status:** ✅ Complete. Every surface renders pixel-art PNGs; the emoji
fallback path on `<Sprite>` remains as a safety net but is no longer wired
into any data files.

---

## Goal

Replace every emoji-as-art usage (`enemy.sprite`, `hero.sprite`, item icons,
NPC icons, map tile glyphs) with hand-authored 32×32 pixel-art sprites,
preserving the current retro CRT vibe and the responsive layout we already
ship.

Non-goals for this first migration:

- Tilemap-based maps (we keep the 10×10 CSS grid).
- Animation rigs / bone systems. We allow **2-frame idle loops** only.
- Audio sync.

---

## Asset inventory

What needs a sprite, and how big.

| Surface              | Asset                                      | Canvas size | Frames | Notes                                                       |
| -------------------- | ------------------------------------------ | ----------- | ------ | ----------------------------------------------------------- |
| Battle: enemy        | slime, bat, goblin, skeleton, dragon       | 64×64       | 2 idle | Dragon can be 96×96 for boss weight.                        |
| Battle: hero         | warrior, mage, rogue                       | 48×48       | 2 idle | Front-facing battle stance.                                 |
| Map: hero token      | warrior, mage, rogue                       | 16×16       | 1      | Top-down, single facing. Reuse across all directions for v1.|
| Map: NPC tokens      | merchant, healer                           | 16×16       | 1      | Distinct silhouettes.                                       |
| Map: boss tile       | dragon                                     | 16×16       | 1      | Resting / sleeping pose.                                    |
| Items                | potion, ether, hero-stone, elixir          | 16×16       | 1      | Tooltip + inventory grid.                                   |
| Equipment            | 10 pieces                                  | 16×16       | 1      | Sword, staff, dagger, vests, robe, ring, charm, pendant.    |
| Statuses             | poison, burn, stun, shield                 | 12×12       | 1      | Badge / chip-sized.                                         |
| UI: target reticle   | target indicator                           | 16×16       | 2 idle | For future multi-target battles.                            |

**Total:** ~30 unique sprites for v1. Tractable for one weekend of pixel art,
or a single Aseprite contract.

---

## File layout & naming

```
apps/rpg-demo/public/sprites/
  enemies/
    slime.png         # 64×64, 2 frames horizontal → 128×64 strip
    bat.png
    goblin.png
    skeleton.png
    dragon.png        # 96×96 × 2 → 192×96
  heroes/
    warrior.png       # 48×48 × 2 → 96×48
    mage.png
    rogue.png
  tokens/
    hero-warrior.png  # 16×16 × 1
    hero-mage.png
    hero-rogue.png
    npc-merchant.png
    npc-healer.png
    boss-dragon.png
  items/
    potion.png
    ether.png
    ...
  equipment/
    bronze-sword.png
    ...
  statuses/
    poison.png
    burn.png
    stun.png
    shield.png
```

Strict rules:

1. **PNG-8 with palette**, transparent background. No anti-aliasing.
2. Filename is the **same string** as the `id` field in our data files. This
   lets us reference sprites by id without a lookup table.
3. Frame strips are **horizontal**: frame 0 left, frame N right. The CSS that
   plays the loop assumes this.

---

## Rendering technique

We render via plain `<img>` tags with three styling rules:

```css
.sprite {
  image-rendering: pixelated;     /* keep nearest-neighbour scaling */
  image-rendering: crisp-edges;
  width: auto;
  height: auto;
}
```

For 2-frame idle loops we use a **CSS keyframe** on `object-position` over a
strip image, advancing one frame width every 600ms. This is cheaper than a
canvas/render-loop and respects `prefers-reduced-motion` by halting the
animation.

```css
.sprite-idle {
  object-fit: none;
  object-position: 0 0;
  animation: sprite-idle 1.2s steps(2) infinite;
}
@media (prefers-reduced-motion: reduce) {
  .sprite-idle { animation: none; }
}
@keyframes sprite-idle {
  to { object-position: -64px 0; } /* one frame width */
}
```

A `<Sprite>` React component will own this so callers never repeat the
markup:

```tsx
<Sprite kind="enemy" id="dragon" size={96} animated />
<Sprite kind="item"  id="potion" size={24} />
```

Size prop scales via CSS `width`/`height` only — never resizes the raw image.
We always render at integer multiples (1×, 2×, 3×) of the source size so the
nearest-neighbour scaling stays crisp.

---

## Migration stages

Shipped in this order so the game stayed playable at every commit.

### Stage 0 — Infrastructure ✅

- `public/sprites/` directory tree with one magenta placeholder PNG for the
  showcase.
- `<Sprite>` component (`src/sprites/Sprite.tsx`) with kind/id → path lookup,
  load-probe, `image-rendering: pixelated`.
- 2-frame idle-loop CSS via `background-position` + `steps(2, jump-none)`.
  (`steps(2, jump-end)` produces a half-frame splice; the `jump-none` term
  outputs both endpoints, which is what a flip-book wants.)

### Stage 1 — Enemies ✅

- 5 enemy sprites (slime, bat, goblin, skeleton, dragon) authored as 2-frame
  strips; `EnemyPanel.tsx` renders them at 96px (144px for bosses).

### Stage 2 — Heroes ✅

- 3 battle sprites (warrior, mage, rogue) + matching map tokens.
- Wired into `HeroStatPanel.tsx` (48px in a bordered avatar slot),
  `MapScreen.tsx` (28px keyed on `hero.heroClass`), and `TitleScreen.tsx`
  class picker (48px animated).

### Stage 3 — NPCs & map tile ✅

- Merchant, healer, sleeping-dragon tokens. `MapGrid` and `NpcDialog` both
  render the token sprite (NPC dialog header at 40px).

### Stage 4 — Items ✅

- 4 consumable icons. Used in `InventoryScreen` (32px cards), `NpcDialog`
  merchant Items tab (28px rows), `BattleScreen` item submenu (20px in
  button labels), and the map header inventory badge (16px next to count).

### Stage 5 — Equipment ✅

- 10 gear pieces. Rendered in the merchant Gear tab and the Inventory
  Equipment tab (both Equipped slot rows and Stash cards).

### Stage 6 — Statuses ✅

- 4 chip icons (poison, burn, stun, shield), rendered at 14px inside the
  `<StatusChips>` `<Badge>`.

### Stage 7 — Polish ✅

- Deleted the magenta placeholder PNG.
- Removed every `sprite: '🛡'` field from the data layer (types, factories,
  ITEMS, EQUIPMENT, NPCS, STATUS_TEMPLATES, CLASSES, enemy templates).
- Stripped `emoji={...}` from every `<Sprite>` call site; the prop remains
  optional on the component as a safety net.

Each stage was independently shippable. The game stayed playable throughout.

---

## Sourcing the art

Three viable paths in roughly increasing cost / increasing quality:

1. **Free / CC0 packs.** Kenney.nl, OpenGameArt's "Tiny RPG" style packs,
   PIPOYA character sets. Good silhouettes, mismatched styles — needs a
   palette unification pass in Aseprite (one shared 16-colour palette).
   Time: ~1 weekend to source + recolor.

2. **Single artist contract.** Hire one pixel artist on Fiverr / Pixelopolis
   Discord; pay ~\$100–200 for the ~30-sprite pack. Get a consistent style
   from one hand. Time: ~1–2 weeks lead.

3. **In-house Aseprite session.** Author every sprite ourselves on a shared
   16-colour palette. Highest control, slowest. Time: ~2–3 weekends.

For the demo, **path 1 plus a palette pass** is the right call: we get
shipping art fast and can upgrade individual sprites later without
restructuring code.

---

## Palette

Pick a 16-colour palette up front and re-index every sourced sprite to it.
Strong candidates: AAP-16, Sweetie-16, Endesga-16. All three are free and
designed for cohesive pixel art. We'll commit the `.gpl` palette file to
`apps/rpg-demo/public/sprites/palette.gpl` for reproducibility.

Tailwind tokens (`po-fg`, `po-danger`, `po-accent`, …) should be re-derived
from this palette so UI chrome and sprites visually agree.

---

## Risks & open questions

- **Bundle size.** 30 PNGs at 16–64px each is under 50 KB total — negligible
  vs. the current 497 KB JS bundle. No CDN needed.
- **Aspect ratios in cards.** `EnemyPanel` currently centres a 7xl emoji.
  64×64 sprites scaled to 4× = 256px, which is taller than the current
  emoji's rendered height. Verify the card heights still align with
  `HeroStatPanel` on the lg breakpoint, or constrain dragon to 3×.
- **Reduced motion.** Idle loops must halt under `prefers-reduced-motion`.
  The CSS rule above handles it; verify with the existing `useReducedMotion`
  hook in case we want JS-side gating too.
- **Animation budget.** We capped at 2-frame idles. If we want hit-react /
  attack frames later, the `<Sprite>` component should grow a `state` prop
  (`'idle' | 'hurt' | 'attack'`) rather than each call site managing its own
  strip offsets.

---

## Definition of done

- [ ] Every `sprite: '<emoji>'` reference in `src/game/*.ts` is gone.
- [ ] Every `<span aria-hidden="true">{some.sprite}</span>` is replaced by
      a `<Sprite>` component.
- [ ] Lint + typecheck still pass.
- [ ] Reduced-motion mode shows static frame-0 only.
- [ ] README hero screenshot updated to show real sprites.
