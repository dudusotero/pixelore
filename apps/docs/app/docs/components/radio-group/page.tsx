import type { Metadata } from 'next'
import { Label, RadioGroup, RadioGroupItem } from '@pixelore/react'
import { ComponentPreview } from '../../../_components/component-preview'

export const metadata: Metadata = {
  title: 'RadioGroup',
  description: 'A group of mutually exclusive radio options with roving tabindex keyboard navigation.',
}

export default function RadioGroupDocsPage() {
  return (
    <>
      <header className="mb-8 flex flex-col gap-2">
        <span className="font-display text-[10px] uppercase tracking-widest text-po-primary">
          Form
        </span>
        <h1 className="font-display text-3xl uppercase tracking-wider text-po-fg">
          RadioGroup
        </h1>
        <p className="font-body text-xl leading-snug text-po-fg-muted">
          A group of mutually exclusive options. Built on Radix RadioGroup — keyboard arrows
          move between options, the group occupies a single tab stop.
        </p>
      </header>

      <h2 className="mb-3 font-display text-lg uppercase tracking-wide text-po-fg">Default</h2>
      <ComponentPreview
        code={`<RadioGroup defaultValue="warrior">
  <div className="flex items-center gap-2">
    <RadioGroupItem id="r-w" value="warrior" />
    <Label htmlFor="r-w">Warrior</Label>
  </div>
  <div className="flex items-center gap-2">
    <RadioGroupItem id="r-m" value="mage" />
    <Label htmlFor="r-m">Mage</Label>
  </div>
  <div className="flex items-center gap-2">
    <RadioGroupItem id="r-r" value="rogue" />
    <Label htmlFor="r-r">Rogue</Label>
  </div>
</RadioGroup>`}
      >
        <RadioGroup defaultValue="warrior">
          <div className="flex items-center gap-2">
            <RadioGroupItem id="r-w" value="warrior" />
            <Label htmlFor="r-w" className="cursor-pointer">
              Warrior
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem id="r-m" value="mage" />
            <Label htmlFor="r-m" className="cursor-pointer">
              Mage
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem id="r-r" value="rogue" />
            <Label htmlFor="r-r" className="cursor-pointer">
              Rogue
            </Label>
          </div>
        </RadioGroup>
      </ComponentPreview>

      <h2 className="mb-3 mt-10 font-display text-lg uppercase tracking-wide text-po-fg">
        Disabled options
      </h2>
      <ComponentPreview
        code={`<RadioGroup defaultValue="normal">
  <div className="flex items-center gap-2">
    <RadioGroupItem id="d-n" value="normal" />
    <Label htmlFor="d-n">Normal</Label>
  </div>
  <div className="flex items-center gap-2">
    <RadioGroupItem id="d-h" value="hard" disabled />
    <Label htmlFor="d-h">Hard (locked)</Label>
  </div>
</RadioGroup>`}
      >
        <RadioGroup defaultValue="normal">
          <div className="flex items-center gap-2">
            <RadioGroupItem id="d-n" value="normal" />
            <Label htmlFor="d-n" className="cursor-pointer">
              Normal
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem id="d-h" value="hard" disabled />
            <Label htmlFor="d-h">Hard (locked)</Label>
          </div>
        </RadioGroup>
      </ComponentPreview>

      <h2 className="mb-3 mt-10 font-display text-lg uppercase tracking-wide text-po-fg">
        Accessibility notes
      </h2>
      <ul className="ml-6 list-disc font-body text-lg leading-relaxed text-po-fg-muted">
        <li>
          Implements the WAI-ARIA Radio Group pattern: arrow keys move selection, the group
          occupies one tab stop in the document.
        </li>
        <li>
          Wrap the group in a <code className="font-mono">{'<fieldset>'}</code> + {' '}
          <code className="font-mono">{'<legend>'}</code> when you need a heading for the whole
          group — Radix preserves the semantics.
        </li>
      </ul>
    </>
  )
}
