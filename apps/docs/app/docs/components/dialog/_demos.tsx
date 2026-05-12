'use client'

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@pixelore/react'

/**
 * Live Dialog demos. Pulled out of the docs page (a Server Component with
 * `export const metadata`) because two `<Dialog>` instances rendered inline
 * in a Server Component subtree race during hydration — the first trigger
 * silently drops from the DOM. Co-locating the JSX inside a `'use client'`
 * file fixes it because the Elements that hydrate are CREATED inside the
 * client component's render function, not in the surrounding Server Component.
 * This is a Radix Portal + Next.js 16 / React 19 hydration interaction.
 * Library-level mount-checks were tested and don't help — the SSR HTML is
 * already correct; it's specifically the hydration step that drops the node.
 */

export function DialogDefaultDemo() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="primary">Open quest log</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Quest log</DialogTitle>
          <DialogDescription>Three quests remain in the realm.</DialogDescription>
        </DialogHeader>
        <ul className="ml-6 list-disc font-body text-lg text-po-fg-muted">
          <li>Find the lost grimoire</li>
          <li>Rescue the merchant&apos;s pup</li>
          <li>Defeat the Pixel Dragon</li>
        </ul>
        <DialogFooter>
          <Button variant="ghost">Close</Button>
          <Button variant="primary">Mark complete</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function DialogDestructiveDemo() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="danger">Delete save</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete this save file?</DialogTitle>
          <DialogDescription>
            This cannot be undone. Your hero will be lost to time.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="ghost">Cancel</Button>
          <Button variant="danger">Delete forever</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
