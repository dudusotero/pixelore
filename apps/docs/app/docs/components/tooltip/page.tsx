import type { Metadata } from 'next'
import { ComponentPreview } from '../../../_components/component-preview'
import { TooltipDefaultDemo, TooltipSidesDemo } from './_demos'

export const metadata: Metadata = {
  title: 'Tooltip',
  description: 'A small floating label that appears on hover or focus to explain a control.',
}

export default function TooltipDocsPage() {
  return (
    <>
      <header className="mb-8 flex flex-col gap-2">
        <span className="font-display text-[10px] uppercase tracking-widest text-po-primary">
          Feedback
        </span>
        <h1 className="font-display text-3xl uppercase tracking-wider text-po-fg">Tooltip</h1>
        <p className="font-body text-xl leading-snug text-po-fg-muted">
          A small floating label that appears on hover or focus to explain a control. Built on
          Radix Tooltip — keyboard-accessible, dismissable with{' '}
          <code className="font-mono">Escape</code>.
        </p>
      </header>

      <h2 className="mb-3 font-display text-lg uppercase tracking-wide text-po-fg">Setup</h2>
      <p className="mb-4 font-body text-lg text-po-fg-muted">
        Wrap your app in a single <code className="font-mono">TooltipProvider</code> once at the
        root (configurable delay/skip). Individual tooltips are composed from{' '}
        <code className="font-mono">Tooltip</code>,{' '}
        <code className="font-mono">TooltipTrigger</code>, and{' '}
        <code className="font-mono">TooltipContent</code>.
      </p>

      <h2 className="mb-3 mt-10 font-display text-lg uppercase tracking-wide text-po-fg">Default</h2>
      <ComponentPreview
        code={`<TooltipProvider delayDuration={150}>
  <Tooltip>
    <TooltipTrigger asChild>
      <Button variant="ghost">Hover me</Button>
    </TooltipTrigger>
    <TooltipContent>Press X to confirm</TooltipContent>
  </Tooltip>
</TooltipProvider>`}
      >
        <TooltipDefaultDemo />
      </ComponentPreview>

      <h2 className="mb-3 mt-10 font-display text-lg uppercase tracking-wide text-po-fg">
        Sides
      </h2>
      <ComponentPreview
        code={`<TooltipContent side="top">Above</TooltipContent>
<TooltipContent side="right">Right</TooltipContent>
<TooltipContent side="bottom">Below</TooltipContent>
<TooltipContent side="left">Left</TooltipContent>`}
      >
        <TooltipSidesDemo />
      </ComponentPreview>

      <h2 className="mb-3 mt-10 font-display text-lg uppercase tracking-wide text-po-fg">
        Server Component note
      </h2>
      <p className="mb-4 font-body text-lg text-po-fg-muted">
        Same caveat as <code className="font-mono">{'<Dialog>'}</code>: multiple inline{' '}
        <code className="font-mono">{'<Tooltip>'}</code> instances in a Next.js Server Component
        can race during hydration. Use a sibling{' '}
        <code className="font-mono">{"'use client'"}</code> file (
        <code className="font-mono">_demos.tsx</code>) to host the live JSX and import the demo
        functions into the page. Inside a Client Component this works without any wrapper.
      </p>

      <h2 className="mb-3 mt-10 font-display text-lg uppercase tracking-wide text-po-fg">
        Accessibility notes
      </h2>
      <ul className="ml-6 list-disc font-body text-lg leading-relaxed text-po-fg-muted">
        <li>
          Triggers on both hover <strong>and</strong> focus, so keyboard users see the same
          context.
        </li>
        <li>
          <code className="font-mono">Escape</code> dismisses an open tooltip. Long-press on
          touch devices.
        </li>
        <li>
          Don&apos;t put essential information in a tooltip — it&apos;s a hint, not a label.
          Tooltips shouldn&apos;t contain interactive content (use Popover instead).
        </li>
        <li>
          The fade/zoom-in animation uses CSS, so it&apos;s automatically nullified by the
          library&apos;s global reduced-motion rule.
        </li>
      </ul>
    </>
  )
}
