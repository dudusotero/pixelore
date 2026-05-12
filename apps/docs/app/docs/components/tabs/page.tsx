import type { Metadata } from 'next'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@pixelore/react'
import { ComponentPreview } from '../../../_components/component-preview'

export const metadata: Metadata = {
  title: 'Tabs',
  description: 'Switch between mutually exclusive views in the same surface.',
}

export default function TabsDocsPage() {
  return (
    <>
      <header className="mb-8 flex flex-col gap-2">
        <span className="font-display text-[10px] uppercase tracking-widest text-po-primary">
          Navigation
        </span>
        <h1 className="font-display text-3xl uppercase tracking-wider text-po-fg">Tabs</h1>
        <p className="font-body text-xl leading-snug text-po-fg-muted">
          Switch between mutually exclusive views in the same surface. Built on Radix Tabs —
          arrow keys move focus across tab triggers, <code className="font-mono">Home</code>{' '}
          and <code className="font-mono">End</code> jump to first / last.
        </p>
      </header>

      <h2 className="mb-3 font-display text-lg uppercase tracking-wide text-po-fg">Default</h2>
      <ComponentPreview
        code={`<Tabs defaultValue="stats">
  <TabsList>
    <TabsTrigger value="stats">Stats</TabsTrigger>
    <TabsTrigger value="inventory">Inventory</TabsTrigger>
    <TabsTrigger value="skills">Skills</TabsTrigger>
  </TabsList>
  <TabsContent value="stats">HP 50, MP 12, ATK 12...</TabsContent>
  <TabsContent value="inventory">3 potions, 1 grimoire...</TabsContent>
  <TabsContent value="skills">Fireball, Heal, Defend...</TabsContent>
</Tabs>`}
      >
        <Tabs defaultValue="stats" className="w-full max-w-md">
          <TabsList>
            <TabsTrigger value="stats">Stats</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
          </TabsList>
          <TabsContent value="stats">HP 50 · MP 12 · ATK 12 · DEF 8 · SPD 6</TabsContent>
          <TabsContent value="inventory">3 potions · 1 grimoire · 1 hero stone</TabsContent>
          <TabsContent value="skills">Fireball · Heal · Defend</TabsContent>
        </Tabs>
      </ComponentPreview>

      <h2 className="mb-3 mt-10 font-display text-lg uppercase tracking-wide text-po-fg">
        Disabled tab
      </h2>
      <ComponentPreview
        code={`<TabsTrigger value="locked" disabled>Locked</TabsTrigger>`}
      >
        <Tabs defaultValue="open" className="w-full max-w-md">
          <TabsList>
            <TabsTrigger value="open">Open</TabsTrigger>
            <TabsTrigger value="locked" disabled>
              Locked
            </TabsTrigger>
          </TabsList>
          <TabsContent value="open">Available content.</TabsContent>
          <TabsContent value="locked">Unreachable while disabled.</TabsContent>
        </Tabs>
      </ComponentPreview>

      <h2 className="mb-3 mt-10 font-display text-lg uppercase tracking-wide text-po-fg">
        Accessibility notes
      </h2>
      <ul className="ml-6 list-disc font-body text-lg leading-relaxed text-po-fg-muted">
        <li>
          Implements the WAI-ARIA Tabs pattern: roving tabindex on the trigger list, automatic
          activation on arrow keys (configurable to manual via Radix).
        </li>
        <li>
          Each <code className="font-mono">TabsContent</code> is associated with its trigger via{' '}
          <code className="font-mono">aria-labelledby</code> — screen readers announce the
          relationship.
        </li>
        <li>
          The active panel is focusable. Use this to provide keyboard navigation to content
          inside (e.g. <code className="font-mono">Tab</code> moves into the panel after the
          trigger list).
        </li>
      </ul>
    </>
  )
}
