import type { Metadata } from 'next'
import { Input, Label } from '@pixelore/react'
import { ComponentPreview } from '../../../_components/component-preview'

export const metadata: Metadata = {
  title: 'Input',
  description: 'A single-line text field with a pixel border and focus glow.',
}

export default function InputDocsPage() {
  return (
    <>
      <header className="mb-8 flex flex-col gap-2">
        <span className="font-display text-[10px] uppercase tracking-widest text-po-primary">
          Form
        </span>
        <h1 className="font-display text-3xl uppercase tracking-wider text-po-fg">Input</h1>
        <p className="font-body text-xl leading-snug text-po-fg-muted">
          A single-line text field. Always pair with a <code className="font-mono">Label</code>{' '}
          — never rely on placeholders alone.
        </p>
      </header>

      <h2 className="mb-3 font-display text-lg uppercase tracking-wide text-po-fg">Default</h2>
      <ComponentPreview
        code={`<Label htmlFor="player">Player Name</Label>
<Input id="player" placeholder="LINK" />`}
      >
        <div className="flex w-full max-w-sm flex-col gap-1.5">
          <Label htmlFor="player-1">Player Name</Label>
          <Input id="player-1" placeholder="LINK" />
        </div>
      </ComponentPreview>

      <h2 className="mb-3 mt-10 font-display text-lg uppercase tracking-wide text-po-fg">Disabled</h2>
      <ComponentPreview
        code={`<Input disabled placeholder="Read only" />`}
      >
        <Input className="w-full max-w-sm" disabled placeholder="Read only" />
      </ComponentPreview>

      <h2 className="mb-3 mt-10 font-display text-lg uppercase tracking-wide text-po-fg">Invalid</h2>
      <p className="mb-4 font-body text-lg text-po-fg-muted">
        The <code className="font-mono">invalid</code> prop (or{' '}
        <code className="font-mono">aria-invalid</code>) applies a red border and exposes the
        invalid state to assistive tech.
      </p>
      <ComponentPreview
        code={`<Label htmlFor="email">Email</Label>
<Input id="email" invalid value="not-an-email" />
<p id="email-error">Please enter a valid email.</p>`}
      >
        <div className="flex w-full max-w-sm flex-col gap-1.5">
          <Label htmlFor="email-1">Email</Label>
          <Input
            id="email-1"
            invalid
            defaultValue="not-an-email"
            aria-describedby="email-1-error"
          />
          <p
            id="email-1-error"
            className="font-body text-base text-po-danger"
            role="status"
          >
            Please enter a valid email.
          </p>
        </div>
      </ComponentPreview>

      <h2 className="mb-3 mt-10 font-display text-lg uppercase tracking-wide text-po-fg">
        Input types
      </h2>
      <ComponentPreview
        code={`<Input type="email" placeholder="you@domain.com" />
<Input type="number" placeholder="999" />
<Input type="password" placeholder="••••••" />`}
      >
        <div className="flex w-full max-w-sm flex-col gap-2">
          <Input type="email" placeholder="you@domain.com" />
          <Input type="number" placeholder="999" />
          <Input type="password" placeholder="••••••" />
        </div>
      </ComponentPreview>

      <h2 className="mb-3 mt-10 font-display text-lg uppercase tracking-wide text-po-fg">
        Accessibility notes
      </h2>
      <ul className="ml-6 list-disc font-body text-lg leading-relaxed text-po-fg-muted">
        <li>
          Always wire <code className="font-mono">htmlFor</code> on the Label to{' '}
          <code className="font-mono">id</code> on the Input. Without the pairing, screen
          readers won&apos;t announce the field&apos;s purpose.
        </li>
        <li>
          Use <code className="font-mono">aria-describedby</code> to point to a sibling element
          with the validation message. Combine with{' '}
          <code className="font-mono">aria-invalid</code> for assistive-tech-friendly errors.
        </li>
        <li>
          The focus outline uses the accent token, giving 3:1+ contrast against every theme
          surface.
        </li>
      </ul>
    </>
  )
}
