import type { Metadata } from 'next'
import { Separator } from '@pixelore/react'
import { ComponentPreview } from '../../../_components/component-preview'

export const metadata: Metadata = {
  title: 'Separator',
  description: 'A pixel-thick horizontal or vertical divider between groups of content.',
}

export default function SeparatorDocsPage() {
  return (
    <>
      <header className="mb-8 flex flex-col gap-2">
        <span className="font-display text-[10px] uppercase tracking-widest text-po-primary">
          Surface
        </span>
        <h1 className="font-display text-3xl uppercase tracking-wider text-po-fg">Separator</h1>
        <p className="font-body text-xl leading-snug text-po-fg-muted">
          A 4px solid divider drawn in the border token colour. Use it sparingly — the bevelled
          edges of Card already separate most content.
        </p>
      </header>

      <h2 className="mb-3 font-display text-lg uppercase tracking-wide text-po-fg">Horizontal</h2>
      <ComponentPreview
        code={`<div>
  <p>Inventory</p>
  <Separator />
  <p>Equipment</p>
</div>`}
      >
        <div className="w-full max-w-sm font-body text-lg text-po-fg">
          <p>Inventory</p>
          <Separator className="my-3" />
          <p>Equipment</p>
        </div>
      </ComponentPreview>

      <h2 className="mb-3 mt-10 font-display text-lg uppercase tracking-wide text-po-fg">Vertical</h2>
      <ComponentPreview
        code={`<div className="flex items-center gap-3 h-8">
  <span>ATK 12</span>
  <Separator orientation="vertical" />
  <span>DEF 8</span>
  <Separator orientation="vertical" />
  <span>SPD 6</span>
</div>`}
      >
        <div className="flex h-8 items-center gap-3 font-body text-lg text-po-fg">
          <span>ATK 12</span>
          <Separator orientation="vertical" />
          <span>DEF 8</span>
          <Separator orientation="vertical" />
          <span>SPD 6</span>
        </div>
      </ComponentPreview>

      <h2 className="mb-3 mt-10 font-display text-lg uppercase tracking-wide text-po-fg">
        Accessibility notes
      </h2>
      <ul className="ml-6 list-disc font-body text-lg leading-relaxed text-po-fg-muted">
        <li>
          Renders as <code className="font-mono">role=&ldquo;none&rdquo;</code> by default
          (decorative). Set <code className="font-mono">decorative={'{false}'}</code> when the
          separator carries semantic meaning (e.g. between distinct landmark regions); the
          underlying Radix Separator then exposes the correct ARIA role.
        </li>
      </ul>
    </>
  )
}
