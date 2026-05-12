import type { Metadata } from 'next'
import { HeartBar } from '@pixelore/react'
import { ComponentPreview } from '../../../_components/component-preview'

export const metadata: Metadata = {
  title: 'HeartBar',
  description:
    'A signature 8-bit HP / lives indicator. Renders discrete heart pixels and exposes value to assistive tech.',
}

export default function HeartBarDocsPage() {
  return (
    <>
      <header className="mb-8 flex flex-col gap-2">
        <span className="font-display text-[10px] uppercase tracking-widest text-po-primary">
          Component
        </span>
        <h1 className="font-display text-3xl uppercase tracking-wider text-po-fg">HeartBar</h1>
        <p className="font-body text-xl leading-snug text-po-fg-muted">
          A signature 8-bit HP / lives indicator. Renders <code className="font-mono">max</code>{' '}
          heart slots and fills <code className="font-mono">value</code> of them — pixel-art
          hearts, drawn as discrete rects so they never anti-alias.
        </p>
      </header>

      <h2 className="mb-3 font-display text-lg uppercase tracking-wide text-po-fg">Default</h2>
      <ComponentPreview
        code={`<HeartBar value={3} max={3} />
<HeartBar value={2} max={3} />
<HeartBar value={1} max={3} />
<HeartBar value={0} max={3} />`}
      >
        <div className="flex flex-col items-start gap-3">
          <HeartBar value={3} max={3} />
          <HeartBar value={2} max={3} />
          <HeartBar value={1} max={3} />
          <HeartBar value={0} max={3} />
        </div>
      </ComponentPreview>

      <h2 className="mb-3 mt-10 font-display text-lg uppercase tracking-wide text-po-fg">
        Custom max
      </h2>
      <ComponentPreview
        code={`<HeartBar value={4} max={5} />
<HeartBar value={7} max={10} />`}
      >
        <div className="flex flex-col items-start gap-3">
          <HeartBar value={4} max={5} />
          <HeartBar value={7} max={10} />
        </div>
      </ComponentPreview>

      <h2 className="mb-3 mt-10 font-display text-lg uppercase tracking-wide text-po-fg">
        Accessibility notes
      </h2>
      <ul className="ml-6 list-disc font-body text-lg leading-relaxed text-po-fg-muted">
        <li>
          Exposes <code className="font-mono">role=&ldquo;progressbar&rdquo;</code> with{' '}
          <code className="font-mono">aria-valuenow</code>,{' '}
          <code className="font-mono">aria-valuemin</code>, and{' '}
          <code className="font-mono">aria-valuemax</code> — screen readers announce
          &ldquo;Hearts: 2 of 3&rdquo; instead of asking the user to count pixels.
        </li>
        <li>
          Hearts pop in with a tiny scale animation that swaps to a no-op under reduced
          motion.
        </li>
        <li>
          Override the announced label with the{' '}
          <code className="font-mono">label</code> prop — useful when used for shields,
          lives, or any non-heart counter.
        </li>
      </ul>
    </>
  )
}
