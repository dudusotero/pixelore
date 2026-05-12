import type { Metadata } from 'next'
import { ComponentPreview } from '../../../_components/component-preview'
import { DialogDefaultDemo, DialogDestructiveDemo } from './_demos'

export const metadata: Metadata = {
  title: 'Dialog',
  description:
    'A modal overlay that focus-traps and centres above the rest of the page.',
}

export default function DialogDocsPage() {
  return (
    <>
      <header className="mb-8 flex flex-col gap-2">
        <span className="font-display text-[10px] uppercase tracking-widest text-po-primary">
          Overlay
        </span>
        <h1 className="font-display text-3xl uppercase tracking-wider text-po-fg">Dialog</h1>
        <p className="font-body text-xl leading-snug text-po-fg-muted">
          A modal overlay that focus-traps and centres above the rest of the page. Use for
          confirmation prompts, focused tasks, or critical decisions that require attention.
        </p>
      </header>

      <h2 className="mb-3 font-display text-lg uppercase tracking-wide text-po-fg">Default</h2>
      <ComponentPreview
        code={`<Dialog>
  <DialogTrigger asChild>
    <Button variant="primary">Open quest log</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Quest log</DialogTitle>
      <DialogDescription>Three quests remain in the realm.</DialogDescription>
    </DialogHeader>
    <ul>...</ul>
    <DialogFooter>
      <Button variant="ghost">Close</Button>
      <Button variant="primary">Mark complete</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>`}
      >
        <DialogDefaultDemo />
      </ComponentPreview>

      <h2 className="mb-3 mt-10 font-display text-lg uppercase tracking-wide text-po-fg">
        Destructive confirmation
      </h2>
      <ComponentPreview
        code={`<Dialog>
  <DialogTrigger asChild>
    <Button variant="danger">Delete save</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Delete this save file?</DialogTitle>
      <DialogDescription>
        This cannot be undone. Your hero will be lost to time.
      </DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <Button variant="ghost">Cancel</Button>
      <Button variant="danger">Delete forever</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>`}
      >
        <DialogDestructiveDemo />
      </ComponentPreview>

      <h2 className="mb-3 mt-10 font-display text-lg uppercase tracking-wide text-po-fg">
        Server Component note
      </h2>
      <p className="mb-4 font-body text-lg text-po-fg-muted">
        Using multiple <code className="font-mono">{'<Dialog>'}</code> instances inline in a
        Next.js App Router Server Component currently hits a Radix + React 19 hydration race
        that drops the first trigger from the DOM. The fix is to put your live demos in a{' '}
        <code className="font-mono">{"'use client'"}</code> sibling file (e.g.{' '}
        <code className="font-mono">_demos.tsx</code>) and import the demo functions into the
        Server Component page — that&apos;s how these examples are written. Inside a Client
        Component, you can render Dialog freely without the wrapper.
      </p>

      <h2 className="mb-3 mt-10 font-display text-lg uppercase tracking-wide text-po-fg">
        Accessibility notes
      </h2>
      <ul className="ml-6 list-disc font-body text-lg leading-relaxed text-po-fg-muted">
        <li>
          Built on Radix Dialog — focus is trapped inside the panel while it&apos;s open,{' '}
          <code className="font-mono">Escape</code> and overlay click dismiss it, and focus
          returns to the trigger on close.
        </li>
        <li>
          The dialog uses <code className="font-mono">aria-labelledby</code> +{' '}
          <code className="font-mono">aria-describedby</code> tied to{' '}
          <code className="font-mono">DialogTitle</code> and{' '}
          <code className="font-mono">DialogDescription</code> — always include both for screen
          readers to announce the dialog properly.
        </li>
        <li>
          The scale + opacity entry animation uses Motion and{' '}
          <code className="font-mono">useReducedMotion</code> — it becomes a simple opacity
          fade when the user prefers reduced motion.
        </li>
      </ul>
    </>
  )
}
