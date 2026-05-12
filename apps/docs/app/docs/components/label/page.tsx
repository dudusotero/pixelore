import type { Metadata } from 'next'
import { Input, Label } from '@pixelore/react'
import { ComponentPreview } from '../../../_components/component-preview'

export const metadata: Metadata = {
  title: 'Label',
  description: 'The label that pairs with a form control — built on Radix Label for correct association.',
}

export default function LabelDocsPage() {
  return (
    <>
      <header className="mb-8 flex flex-col gap-2">
        <span className="font-display text-[10px] uppercase tracking-widest text-po-primary">
          Form
        </span>
        <h1 className="font-display text-3xl uppercase tracking-wider text-po-fg">Label</h1>
        <p className="font-body text-xl leading-snug text-po-fg-muted">
          A small uppercase label that pairs with any form control. Built on Radix Label so the
          click target reliably forwards focus to the associated input — even when the input
          is several elements away.
        </p>
      </header>

      <h2 className="mb-3 font-display text-lg uppercase tracking-wide text-po-fg">Default</h2>
      <ComponentPreview
        code={`<Label htmlFor="name">Player Name</Label>
<Input id="name" placeholder="LINK" />`}
      >
        <div className="flex w-full max-w-sm flex-col gap-1.5">
          <Label htmlFor="lname-1">Player Name</Label>
          <Input id="lname-1" placeholder="LINK" />
        </div>
      </ComponentPreview>

      <h2 className="mb-3 mt-10 font-display text-lg uppercase tracking-wide text-po-fg">
        Accessibility notes
      </h2>
      <ul className="ml-6 list-disc font-body text-lg leading-relaxed text-po-fg-muted">
        <li>
          <code className="font-mono">Label</code> renders a real{' '}
          <code className="font-mono">{'<label>'}</code> element. Clicking the label focuses the
          input.
        </li>
        <li>
          When the associated control is disabled, the label automatically dims via the{' '}
          <code className="font-mono">peer-disabled</code> Tailwind variant — no extra code
          required.
        </li>
      </ul>
    </>
  )
}
