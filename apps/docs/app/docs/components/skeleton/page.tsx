import type { Metadata } from 'next'
import { Skeleton } from '@pixelore/react'
import { ComponentPreview } from '../../../_components/component-preview'

export const metadata: Metadata = {
  title: 'Skeleton',
  description: 'A pulsing placeholder for content that is loading.',
}

export default function SkeletonDocsPage() {
  return (
    <>
      <header className="mb-8 flex flex-col gap-2">
        <span className="font-display text-[10px] uppercase tracking-widest text-po-primary">
          Feedback
        </span>
        <h1 className="font-display text-3xl uppercase tracking-wider text-po-fg">Skeleton</h1>
        <p className="font-body text-xl leading-snug text-po-fg-muted">
          A pulsing block that holds layout space while content loads. Compose multiple
          Skeletons to match the shape of the real content.
        </p>
      </header>

      <h2 className="mb-3 font-display text-lg uppercase tracking-wide text-po-fg">Default</h2>
      <ComponentPreview
        code={`<Skeleton className="h-6 w-40" />
<Skeleton className="h-4 w-64" />
<Skeleton className="h-4 w-56" />`}
      >
        <div className="flex w-full max-w-md flex-col gap-2">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-64" />
          <Skeleton className="h-4 w-56" />
        </div>
      </ComponentPreview>

      <h2 className="mb-3 mt-10 font-display text-lg uppercase tracking-wide text-po-fg">
        Composing a card placeholder
      </h2>
      <ComponentPreview
        code={`<div className="flex items-center gap-3">
  <Skeleton className="h-10 w-10" />
  <div className="flex flex-col gap-2">
    <Skeleton className="h-4 w-32" />
    <Skeleton className="h-3 w-20" />
  </div>
</div>`}
      >
        <div className="flex w-full max-w-md items-center gap-3">
          <Skeleton className="h-10 w-10" />
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
      </ComponentPreview>

      <h2 className="mb-3 mt-10 font-display text-lg uppercase tracking-wide text-po-fg">
        Accessibility notes
      </h2>
      <ul className="ml-6 list-disc font-body text-lg leading-relaxed text-po-fg-muted">
        <li>
          Sets <code className="font-mono">role=&ldquo;status&rdquo;</code> with{' '}
          <code className="font-mono">aria-busy=&ldquo;true&rdquo;</code> and{' '}
          <code className="font-mono">aria-live=&ldquo;polite&rdquo;</code> — screen readers
          announce a loading state without interrupting.
        </li>
        <li>
          The opacity pulse is driven by Motion and stops entirely under{' '}
          <code className="font-mono">prefers-reduced-motion</code> — the skeleton becomes a
          static dimmed block.
        </li>
        <li>
          For long-running loads, swap the role to a more specific live region announcing
          progress (e.g. <code className="font-mono">aria-busy</code> on the parent +{' '}
          <code className="font-mono">aria-live</code> on a sibling status node).
        </li>
      </ul>
    </>
  )
}
