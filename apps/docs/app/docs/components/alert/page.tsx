import type { Metadata } from 'next'
import { Alert, AlertDescription, AlertTitle } from '@pixelore/react'
import { ComponentPreview } from '../../../_components/component-preview'

export const metadata: Metadata = {
  title: 'Alert',
  description: 'An inline message panel with four semantic variants and live-region announcement.',
}

export default function AlertDocsPage() {
  return (
    <>
      <header className="mb-8 flex flex-col gap-2">
        <span className="font-display text-[10px] uppercase tracking-widest text-po-primary">
          Feedback
        </span>
        <h1 className="font-display text-3xl uppercase tracking-wider text-po-fg">Alert</h1>
        <p className="font-body text-xl leading-snug text-po-fg-muted">
          An inline message panel for important context that the user should notice but
          doesn&apos;t need to dismiss. Four semantic variants — info, success, warning, danger
          — each with the appropriate <code className="font-mono">aria-live</code> politeness.
        </p>
      </header>

      <h2 className="mb-3 font-display text-lg uppercase tracking-wide text-po-fg">Variants</h2>
      <ComponentPreview
        code={`<Alert variant="info">
  <AlertTitle>Tip</AlertTitle>
  <AlertDescription>Press X to view the world map.</AlertDescription>
</Alert>

<Alert variant="success">
  <AlertTitle>Saved</AlertTitle>
  <AlertDescription>Your game has been saved.</AlertDescription>
</Alert>

<Alert variant="warning">
  <AlertTitle>Low HP</AlertTitle>
  <AlertDescription>Use a Heal potion soon.</AlertDescription>
</Alert>

<Alert variant="danger">
  <AlertTitle>Game Over</AlertTitle>
  <AlertDescription>Your party has fallen.</AlertDescription>
</Alert>`}
      >
        <div className="flex w-full max-w-xl flex-col gap-3">
          <Alert variant="info">
            <AlertTitle>Tip</AlertTitle>
            <AlertDescription>Press X to view the world map.</AlertDescription>
          </Alert>
          <Alert variant="success">
            <AlertTitle>Saved</AlertTitle>
            <AlertDescription>Your game has been saved.</AlertDescription>
          </Alert>
          <Alert variant="warning">
            <AlertTitle>Low HP</AlertTitle>
            <AlertDescription>Use a Heal potion soon.</AlertDescription>
          </Alert>
          <Alert variant="danger">
            <AlertTitle>Game Over</AlertTitle>
            <AlertDescription>Your party has fallen.</AlertDescription>
          </Alert>
        </div>
      </ComponentPreview>

      <h2 className="mb-3 mt-10 font-display text-lg uppercase tracking-wide text-po-fg">
        Accessibility notes
      </h2>
      <ul className="ml-6 list-disc font-body text-lg leading-relaxed text-po-fg-muted">
        <li>
          Renders as <code className="font-mono">role=&ldquo;alert&rdquo;</code> with{' '}
          <code className="font-mono">aria-live=&ldquo;polite&rdquo;</code> for info/success and{' '}
          <code className="font-mono">assertive</code> for warning/danger — assistive tech
          interrupts the user for urgent variants only.
        </li>
        <li>
          Use Alert for messages that appear in response to a user action and should be noticed
          but don&apos;t block. For blocking confirmations, use Dialog.
        </li>
        <li>
          Don&apos;t put interactive controls inside an Alert — accessibility tools may not
          announce them in context. If the user needs to act, use a Toast or Dialog instead.
        </li>
      </ul>
    </>
  )
}
