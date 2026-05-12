import type { Metadata } from 'next'
import { Label, Textarea } from '@pixelore/react'
import { ComponentPreview } from '../../../_components/component-preview'

export const metadata: Metadata = {
  title: 'Textarea',
  description: 'A resizable multi-line text field with the same pixel border styling as Input.',
}

export default function TextareaDocsPage() {
  return (
    <>
      <header className="mb-8 flex flex-col gap-2">
        <span className="font-display text-[10px] uppercase tracking-widest text-po-primary">
          Form
        </span>
        <h1 className="font-display text-3xl uppercase tracking-wider text-po-fg">Textarea</h1>
        <p className="font-body text-xl leading-snug text-po-fg-muted">
          A multi-line text field. Defaults to a vertical resize handle and a 6rem minimum
          height — comfortable for short stories and dialogue trees alike.
        </p>
      </header>

      <h2 className="mb-3 font-display text-lg uppercase tracking-wide text-po-fg">Default</h2>
      <ComponentPreview
        code={`<Label htmlFor="lore">Quest Log</Label>
<Textarea id="lore" placeholder="What did the merchant say?" />`}
      >
        <div className="flex w-full max-w-md flex-col gap-1.5">
          <Label htmlFor="lore">Quest Log</Label>
          <Textarea id="lore" placeholder="What did the merchant say?" />
        </div>
      </ComponentPreview>

      <h2 className="mb-3 mt-10 font-display text-lg uppercase tracking-wide text-po-fg">Invalid</h2>
      <ComponentPreview
        code={`<Textarea invalid defaultValue="too short" aria-describedby="reason-error" />
<p id="reason-error">Minimum 10 characters.</p>`}
      >
        <div className="flex w-full max-w-md flex-col gap-1.5">
          <Textarea
            invalid
            defaultValue="too short"
            aria-describedby="ta-err"
          />
          <p id="ta-err" className="font-body text-base text-po-danger" role="status">
            Minimum 10 characters.
          </p>
        </div>
      </ComponentPreview>

      <h2 className="mb-3 mt-10 font-display text-lg uppercase tracking-wide text-po-fg">
        Accessibility notes
      </h2>
      <ul className="ml-6 list-disc font-body text-lg leading-relaxed text-po-fg-muted">
        <li>
          Same labelling rules as <code className="font-mono">Input</code> — never rely on the
          placeholder alone.
        </li>
        <li>
          Native <code className="font-mono">{'<textarea>'}</code> support means browser
          spellcheck, dictation, and IME composition all work without extra work.
        </li>
      </ul>
    </>
  )
}
