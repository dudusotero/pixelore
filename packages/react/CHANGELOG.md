# @pixelore/react

## 0.2.1

### Patch Changes

- 34f4c72: Fix two visual bugs in Tabs and Dialog:
  - **Tabs:** the right-edge divider on the active tab could render against a
    half-pixel boundary, producing a thin blurry gap. Dividers now come from
    a 2px gap with the parent's black background showing through, so they
    always pixel-snap. No API change.
  - **Dialog:** when content exceeded the viewport height, the dialog spilled
    off the top and bottom of the page with no way to scroll. Content is now
    capped to `calc(100vh - 2rem)` with an internal scroll body; the close
    button stays pinned in the dialog frame while the body scrolls. No API
    change.

## 0.2.0

### Minor Changes

- 7aa7fa0: First public release.
  - 18 components built on Radix UI primitives: Button, Card, Input, Dialog, Tabs, Tooltip, Switch, Checkbox, RadioGroup, Progress, Alert, Avatar, Badge, Label, Separator, Skeleton, Textarea, and the signature HeartBar for HP / lives.
  - `@pixelore/react` ships dual ESM + CJS bundles, generated TypeScript declarations, and a stand-alone `styles.css` consumers can import once.
  - `@pixelore/tailwind-preset` ships a Tailwind v3 preset and a `@theme`-based Tailwind v4 CSS preset for projects that want to extend the design tokens.
  - Motion 12 animations branch on `useReducedMotion`; all interactive components target WCAG 2.2 AA.
