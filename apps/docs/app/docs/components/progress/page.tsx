import type { Metadata } from 'next'
import { Progress } from '@pixelore/react'
import { ComponentPreview } from '../../../_components/component-preview'

export const metadata: Metadata = {
  title: 'Progress',
  description: 'A stepped, 8-bit loading bar with smooth motion and reduced-motion fallback.',
}

export default function ProgressDocsPage() {
  return (
    <>
      <header className="mb-8 flex flex-col gap-2">
        <span className="font-display text-[10px] uppercase tracking-widest text-po-primary">
          Feedback
        </span>
        <h1 className="font-display text-3xl uppercase tracking-wider text-po-fg">Progress</h1>
        <p className="font-body text-xl leading-snug text-po-fg-muted">
          A determinate progress bar. The default fill uses a stepped easing and a faint
          repeating gradient that hints at scanlines — disabled when the user prefers reduced
          motion.
        </p>
      </header>

      <h2 className="mb-3 font-display text-lg uppercase tracking-wide text-po-fg">Default</h2>
      <ComponentPreview
        code={`<Progress value={64} />
<Progress value={32} />
<Progress value={100} />`}
      >
        <div className="flex w-full max-w-md flex-col gap-3">
          <Progress value={64} />
          <Progress value={32} />
          <Progress value={100} />
        </div>
      </ComponentPreview>

      <h2 className="mb-3 mt-10 font-display text-lg uppercase tracking-wide text-po-fg">
        Custom maximum
      </h2>
      <ComponentPreview
        code={`<Progress value={12} max={30} />`}
      >
        <Progress className="w-full max-w-md" value={12} max={30} />
      </ComponentPreview>

      <h2 className="mb-3 mt-10 font-display text-lg uppercase tracking-wide text-po-fg">
        Without the stepped texture
      </h2>
      <p className="mb-4 font-body text-lg text-po-fg-muted">
        The stepped texture suits XP bars and loading screens. For minimal usage (e.g. real-time
        meters) pass <code className="font-mono">stepped={'{false}'}</code>.
      </p>
      <ComponentPreview
        code={`<Progress value={45} stepped={false} />`}
      >
        <Progress className="w-full max-w-md" value={45} stepped={false} />
      </ComponentPreview>

      <h2 className="mb-3 mt-10 font-display text-lg uppercase tracking-wide text-po-fg">
        Accessibility notes
      </h2>
      <ul className="ml-6 list-disc font-body text-lg leading-relaxed text-po-fg-muted">
        <li>
          Exposes <code className="font-mono">role=&ldquo;progressbar&rdquo;</code> with{' '}
          <code className="font-mono">aria-valuenow</code>,{' '}
          <code className="font-mono">aria-valuemin</code>, and{' '}
          <code className="font-mono">aria-valuemax</code> via Radix.
        </li>
        <li>
          Pair with a visible label above the bar — screen readers announce the value but
          sighted users need to know what&apos;s being measured.
        </li>
        <li>
          The motion-driven width animation reduces to an instant set under{' '}
          <code className="font-mono">prefers-reduced-motion</code>.
        </li>
      </ul>
    </>
  )
}
