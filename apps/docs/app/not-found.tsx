import Link from 'next/link'
import { Button } from '@pixelore/react'

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 px-4 py-24 text-center">
      <p className="font-display text-6xl uppercase tracking-wider text-po-primary">404</p>
      <h1 className="font-display text-2xl uppercase tracking-wider text-po-fg">
        Game Over
      </h1>
      <p className="font-body text-xl text-po-fg-muted">
        The page you were looking for does not exist. Insert coin to continue.
      </p>
      <Button asChild variant="primary">
        <Link href="/">Back to Start</Link>
      </Button>
    </div>
  )
}
