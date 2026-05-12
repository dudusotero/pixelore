import type { Metadata } from 'next'
import { Label, Switch } from '@pixelore/react'
import { ComponentPreview } from '../../../_components/component-preview'

export const metadata: Metadata = {
  title: 'Switch',
  description: 'A two-state on/off toggle. Use for instant-effect settings, not multi-step choices.',
}

export default function SwitchDocsPage() {
  return (
    <>
      <header className="mb-8 flex flex-col gap-2">
        <span className="font-display text-[10px] uppercase tracking-widest text-po-primary">
          Form
        </span>
        <h1 className="font-display text-3xl uppercase tracking-wider text-po-fg">Switch</h1>
        <p className="font-body text-xl leading-snug text-po-fg-muted">
          An on/off toggle. Flips a setting that applies immediately — for choices that need an
          explicit Save action, use a Checkbox instead.
        </p>
      </header>

      <h2 className="mb-3 font-display text-lg uppercase tracking-wide text-po-fg">Default</h2>
      <ComponentPreview
        code={`<Switch id="sound" defaultChecked />
<Label htmlFor="sound">Sound FX</Label>`}
      >
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <Switch id="sw-1" />
            <Label htmlFor="sw-1" className="cursor-pointer">
              Music
            </Label>
          </div>
          <div className="flex items-center gap-3">
            <Switch id="sw-2" defaultChecked />
            <Label htmlFor="sw-2" className="cursor-pointer">
              Sound FX
            </Label>
          </div>
        </div>
      </ComponentPreview>

      <h2 className="mb-3 mt-10 font-display text-lg uppercase tracking-wide text-po-fg">
        Disabled
      </h2>
      <ComponentPreview
        code={`<Switch id="hard" disabled />
<Label htmlFor="hard">Hard mode (unlock at Lv 50)</Label>`}
      >
        <div className="flex items-center gap-3">
          <Switch id="sw-3" disabled />
          <Label htmlFor="sw-3">Hard mode (unlock at Lv 50)</Label>
        </div>
      </ComponentPreview>

      <h2 className="mb-3 mt-10 font-display text-lg uppercase tracking-wide text-po-fg">
        Accessibility notes
      </h2>
      <ul className="ml-6 list-disc font-body text-lg leading-relaxed text-po-fg-muted">
        <li>
          Built on Radix Switch — exposes <code className="font-mono">role=&ldquo;switch&rdquo;</code>{' '}
          with <code className="font-mono">aria-checked</code> instead of the generic checkbox
          role, so screen readers announce &ldquo;on/off&rdquo; rather than
          &ldquo;checked/unchecked&rdquo;.
        </li>
        <li>
          <code className="font-mono">Space</code> toggles. The thumb&apos;s translate animation
          honours <code className="font-mono">prefers-reduced-motion</code> via Tailwind&apos;s{' '}
          <code className="font-mono">motion-reduce</code> variant.
        </li>
      </ul>
    </>
  )
}
