# Sprite assets

Drop PNG-8 pixel art here, transparent background, no anti-aliasing.

## Naming

The `<Sprite>` component looks up `kind` + `id` → `kind/id.png`:

| Kind        | Folder       | Source size |
| ----------- | ------------ | ----------- |
| `enemy`     | `enemies/`   | 64×64 (dragon 96×96) |
| `hero`      | `heroes/`    | 48×48       |
| `token`     | `tokens/`    | 16×16       |
| `item`      | `items/`     | 16×16       |
| `equipment` | `equipment/` | 16×16       |
| `status`    | `statuses/`  | 12×12       |

`id` is the same string used in the game data files (`slime`, `dragon`,
`bronze-sword`, `poison`, …).

## Animation

2-frame idle loops use a horizontal frame strip: frame 0 on the left, frame 1
on the right. Total image width = `2 × source size`. The component scrolls
`object-position` via the `sprite-idle` CSS keyframe (see
`apps/rpg-demo/src/styles.css`). Reduced-motion mode halts the animation
on frame 0.

## Fallback

`<Sprite>` accepts an `emoji` prop. If the PNG fails to load (no file yet,
network error), the emoji renders instead. This is how we migrate one
surface at a time without breaking the build.

See `apps/rpg-demo/SPRITES.md` for the migration roadmap.
