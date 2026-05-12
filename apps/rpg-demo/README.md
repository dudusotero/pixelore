# pixelore quest — RPG demo

A tiny turn-based RPG that doubles as a living showcase of the
[`@pixelore/react`](../../packages/react) design system.

## Play

```bash
pnpm install
pnpm --filter @pixelore/rpg-demo dev
# http://localhost:3040
```

Move on the map with **arrow keys / WASD**, or use the on-screen pad. Random
encounters fire ~22% per step; the **Pixel Dragon** waits at the top-left
corner.

## What you can do

- **Attack** — basic ATK – DEF damage with ~8% crit chance
- **Magic** — Fireball (5 MP) or Heal (4 MP)
- **Defend** — halves incoming damage on the next enemy turn
- **Run** — escape (can't run from the dragon)

Defeating enemies grants XP and may trigger a level-up. The hero has three
**hero stones** (lives) — losing your last one ends the run.

## Components used

Every screen below is composed entirely from `@pixelore/react`:

| Screen     | Components                                                    |
| ---------- | ------------------------------------------------------------- |
| Title      | Badge, Button                                                 |
| Map        | Card, Avatar, Badge, Button, HeartBar, Progress               |
| Battle     | Card, Button, Badge, useReducedMotion + Motion animations     |
| End screen | Card, Badge, Button                                           |

## Move it out later

This app is parked inside the pixelore monorepo for now. Lifting it to its
own repo is a copy of `apps/rpg-demo/` plus depending on the published
`@pixelore/react` from npm (instead of `workspace:*`).
