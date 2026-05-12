import { AnimatePresence, motion } from 'motion/react'
import { Card, CardContent, CardHeader, CardTitle, useReducedMotion } from '@pixelore/react'
import type { BattleEvent } from '../game/types'

const VARIANT_COLOR: Record<NonNullable<BattleEvent['variant']>, string> = {
  damage: 'text-po-fg',
  crit: 'text-po-accent',
  heal: 'text-po-success',
  miss: 'text-po-fg-muted',
  info: 'text-po-fg-muted',
  success: 'text-po-success',
  fail: 'text-po-danger',
}

export function BattleLog({ events }: { events: BattleEvent[] }) {
  const reduced = useReducedMotion()
  // Show the most recent 5 events, newest first.
  const recent = events.slice(-5).reverse()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Battle Log</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="flex flex-col gap-1.5 font-body text-lg leading-snug" aria-live="polite">
          <AnimatePresence initial={false}>
            {recent.map((e) => (
              <motion.li
                key={e.id}
                initial={reduced ? { opacity: 0 } : { opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduced ? 0.1 : 0.18 }}
                className={e.variant ? VARIANT_COLOR[e.variant] : 'text-po-fg-muted'}
              >
                ▸ {e.text}
              </motion.li>
            ))}
          </AnimatePresence>
          {recent.length === 0 && (
            <li className="text-po-fg-muted">A wild encounter begins…</li>
          )}
        </ul>
      </CardContent>
    </Card>
  )
}
