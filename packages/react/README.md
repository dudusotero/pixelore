# @pixelore/react

An 8-bit aesthetic React design system. Accessible. Animated. Pixel-perfect.

## Install

```bash
pnpm add @pixelore/react motion
# or
npm install @pixelore/react motion
```

`react`, `react-dom` and `motion` are peer dependencies — provide them yourself.

## Use

```tsx
// Once at the root of your app
import "@pixelore/react/styles.css"

import { Button, Card, HeartBar } from "@pixelore/react"

export default function App() {
  return (
    <Card>
      <HeartBar value={2} max={3} />
      <Button variant="primary">Start Game</Button>
    </Card>
  )
}
```

## Accessibility

Every interactive component is built on a Radix UI primitive (or follows the
matching WAI-ARIA pattern), giving you:

- Keyboard navigation out of the box
- Focus management and visible focus styles
- Screen-reader-friendly labels and ARIA states

## Reduced motion

Every animated component respects `prefers-reduced-motion`. Motion-actuated
movement (translate, scale) is replaced with a subtle opacity change — the
approach recommended by WCAG 2.3.3.

## License

MIT
