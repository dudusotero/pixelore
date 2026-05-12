import { AnimatePresence, motion } from 'motion/react'
import { useReducedMotion } from '@pixelore/react'
import type { DamageFlash } from '../game/battle'

interface DamageNumbersProps {
  /** Most recent batch of damage / heal events. */
  events: DamageFlash[]
  /** Which target this layer renders ('hero' or 'enemy'). */
  target: DamageFlash['target']
}

/**
 * Floating damage / heal numbers. Each event animates from its starting
 * position upward + fading. Crits render bigger and in the accent yellow,
 * heals in green, normal damage in white. Reduced motion strips the upward
 * drift but keeps the fade.
 */
export function DamageNumbers({ events, target }: DamageNumbersProps) {
  const reduced = useReducedMotion()
  const filtered = events.filter((e) => e.target === target)

  return (
    <div className="pointer-events-none absolute inset-0 flex items-start justify-center">
      <AnimatePresence>
        {filtered.map((e) => (
          <motion.span
            key={e.id}
            initial={reduced ? { opacity: 0, y: 0 } : { opacity: 0, y: 10, scale: 0.8 }}
            animate={reduced ? { opacity: 1 } : { opacity: 1, y: -40, scale: e.kind === 'crit' ? 1.4 : 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0.15 : 0.9, ease: [0.32, 0.72, 0, 1] }}
            className={
              'absolute top-2 font-display tracking-wider drop-shadow-[2px_2px_0_rgba(0,0,0,0.8)] ' +
              (e.kind === 'crit'
                ? 'text-3xl text-po-accent'
                : e.kind === 'heal'
                  ? 'text-2xl text-po-success'
                  : 'text-2xl text-po-fg')
            }
          >
            {e.kind === 'heal' ? '+' : ''}
            {e.amount}
            {e.kind === 'crit' ? '!' : ''}
          </motion.span>
        ))}
      </AnimatePresence>
    </div>
  )
}
