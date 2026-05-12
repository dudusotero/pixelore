# Contributing to pixelore

Thanks for your interest! pixelore is a small personal project but PRs and issues are very
welcome.

## Getting set up

```bash
git clone https://github.com/dudusotero/pixelore.git
cd pixelore
pnpm install
pnpm dev
```

`pnpm dev` runs Turbo in watch mode — the docs site at <http://localhost:3030> live-reloads
when you edit the library.

## Project layout

```
packages/react/             The component library — @pixelore/react
packages/tailwind-preset/   Tailwind v3 + v4 presets
apps/docs/                  Next.js 16 docs site
```

## Adding a component

1. Create `packages/react/src/components/<name>.tsx`.
2. Re-export it from `packages/react/src/components/index.ts`.
3. Add a docs page under `apps/docs/app/docs/components/<name>/page.tsx`.
4. Add the route to the sidebar config in
   `apps/docs/app/_components/sidebar.tsx`.
5. If your change is user-facing, run `pnpm changeset` to add a changeset.

### Component checklist

Before opening a PR, make sure your component:

- [ ] Renders as a real HTML element or a Radix primitive — no `<div role="button">` shortcuts
- [ ] Supports keyboard interaction (Enter, Space, arrow keys where appropriate)
- [ ] Has visible `:focus-visible` styles
- [ ] Forwards `ref` (use `forwardRef`)
- [ ] Accepts and merges `className` via the `cn()` utility
- [ ] Handles `prefers-reduced-motion` for any animation
- [ ] Has an entry in the docs site with a live preview and accessibility notes

## Coding standards

- TypeScript strict mode, `noUncheckedIndexedAccess` on
- Function components with `forwardRef` (no class components)
- `cva` for variant styles, `cn()` for className merging
- No `any` — narrow types or use `unknown` and refine
- Prefer Radix primitives over hand-rolling ARIA

## Tests

We use Vitest + Testing Library. Run them with `pnpm test`.

When adding interactive components, please include at least one test for:

- The default render (no errors, correct DOM)
- Keyboard activation (Enter / Space)
- ARIA state (where the component exposes state)

## Commit messages

We loosely follow [Conventional Commits](https://www.conventionalcommits.org/) but don't
enforce a format. Examples:

```
feat(button): add `loading` prop
fix(dialog): trap focus when opened via keyboard
docs(motion): clarify reduced-motion testing steps
```

## Code of conduct

Be kind. Be specific. Don't be a jerk.
