import type { Metadata } from 'next'
import { Button } from '@pixelore/react'
import { ComponentPreview } from '../../../_components/component-preview'

export const metadata: Metadata = {
  title: 'Button',
  description:
    'An 8-bit pressable button. Six variants, three sizes, full keyboard support, motion-aware.',
}

export default function ButtonDocsPage() {
  return (
    <>
      <header className="mb-8 flex flex-col gap-2">
        <span className="font-display text-[10px] uppercase tracking-widest text-po-primary">
          Component
        </span>
        <h1 className="font-display text-3xl uppercase tracking-wider text-po-fg">Button</h1>
        <p className="font-body text-xl leading-snug text-po-fg-muted">
          A pressable, animated button. Built on Radix Slot (for{' '}
          <code className="font-mono">asChild</code> polymorphism) and Motion (for the
          press-down animation that swaps to opacity under reduced motion).
        </p>
      </header>

      <h2 className="mb-3 font-display text-lg uppercase tracking-wide text-po-fg">Variants</h2>
      <ComponentPreview
        code={`<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="accent">Accent</Button>
<Button variant="success">Success</Button>
<Button variant="danger">Danger</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="outline">Outline</Button>`}
      >
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="accent">Accent</Button>
          <Button variant="success">Success</Button>
          <Button variant="danger">Danger</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="outline">Outline</Button>
        </div>
      </ComponentPreview>

      <h2 className="mb-3 mt-10 font-display text-lg uppercase tracking-wide text-po-fg">
        Sizes
      </h2>
      <ComponentPreview
        code={`<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>`}
      >
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
        </div>
      </ComponentPreview>

      <h2 className="mb-3 mt-10 font-display text-lg uppercase tracking-wide text-po-fg">
        Loading state
      </h2>
      <ComponentPreview
        code={`<Button loading>Saving</Button>
<Button variant="secondary" loading>Loading</Button>`}
      >
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button loading>Saving</Button>
          <Button variant="secondary" loading>
            Loading
          </Button>
        </div>
      </ComponentPreview>

      <h2 className="mb-3 mt-10 font-display text-lg uppercase tracking-wide text-po-fg">
        As a link (asChild)
      </h2>
      <p className="mb-4 font-body text-lg text-po-fg-muted">
        Use <code className="font-mono">asChild</code> to render the Button as its child
        element while keeping all of the styles. Combine with{' '}
        <code className="font-mono">next/link</code> for client-side navigation:
      </p>
      <ComponentPreview
        code={`import Link from "next/link"

<Button asChild>
  <Link href="/docs">Read the docs</Link>
</Button>`}
      >
        <Button asChild>
          <a href="/docs">Read the docs</a>
        </Button>
      </ComponentPreview>

      <h2 className="mb-3 mt-10 font-display text-lg uppercase tracking-wide text-po-fg">
        Accessibility notes
      </h2>
      <ul className="ml-6 list-disc font-body text-lg leading-relaxed text-po-fg-muted">
        <li>
          Renders as a real <code className="font-mono">{'<button>'}</code> by default —
          keyboard activation via <code className="font-mono">Enter</code> and{' '}
          <code className="font-mono">Space</code> works out of the box.
        </li>
        <li>
          Sets <code className="font-mono">aria-busy</code> when{' '}
          <code className="font-mono">loading</code> is true, and the loading spinner has{' '}
          <code className="font-mono">role=&ldquo;status&rdquo;</code>.
        </li>
        <li>
          Focus is shown via <code className="font-mono">:focus-visible</code> only — no
          permanent ring on mouse click.
        </li>
        <li>
          The press animation translates 2px diagonally for users who allow motion, and
          drops to a subtle opacity change for users with{' '}
          <code className="font-mono">prefers-reduced-motion: reduce</code>.
        </li>
      </ul>
    </>
  )
}
