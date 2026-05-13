import { AnimatePresence, motion } from 'motion/react'
import { Badge, Card, CardContent, useReducedMotion } from '@pixelore/react'
import type { DamageFlash } from '../game/battle'
import { Sprite } from '../sprites'
import type { Enemy } from '../game/types'
import { DamageNumbers } from './DamageNumber'
import { StatusChips } from './StatusChips'

export function EnemyPanel({
  enemy,
  hitFlash,
  damageEvents = [],
}: {
  enemy: Enemy
  /** Increments each time the enemy takes damage so we can replay a flash. */
  hitFlash: number
  /** Latest resolved battle's damage events; used for floating numbers + hurt flash. */
  damageEvents?: DamageFlash[]
}) {
  const reduced = useReducedMotion()
  const lastEnemyEvent = [...damageEvents].reverse().find((e) => e.target === 'enemy')
  const isCrit = lastEnemyEvent?.kind === 'crit'

  return (
    // Wrapper is the positioning context for the floating damage numbers.
    // The Card keeps its `overflow-hidden` so the hurt-flash stays inside
    // the panel; DamageNumbers sits outside the Card as a sibling and is
    // free to float above the Card's top edge without being clipped.
    <div className="relative">
      <Card className="relative overflow-hidden">
        <CardContent>
          <motion.div
            key={hitFlash}
            initial={reduced ? { opacity: 0.5 } : { x: 0, opacity: 1 }}
            animate={reduced ? { opacity: 1 } : { x: [-4, 4, -2, 2, 0] }}
            transition={{ duration: reduced ? 0.1 : 0.3 }}
            className="relative flex flex-col items-center gap-3 py-6"
          >
            {/* Hurt-flash overlay — white on damage, red on crit, fades out. */}
            <AnimatePresence>
              {lastEnemyEvent &&
                (lastEnemyEvent.kind === 'damage' || lastEnemyEvent.kind === 'crit') && (
                  <motion.div
                    key={hitFlash}
                    initial={{ opacity: reduced ? 0.4 : 0.65 }}
                    animate={{ opacity: 0 }}
                    transition={{ duration: reduced ? 0.15 : 0.4 }}
                    className={
                      'pointer-events-none absolute inset-0 z-10 ' +
                      (isCrit ? 'bg-po-danger' : 'bg-white')
                    }
                    aria-hidden="true"
                  />
                )}
            </AnimatePresence>

            <Sprite
              kind="enemy"
              id={enemy.id}
              size={enemy.isBoss ? 144 : 96}
              animated
              label={enemy.name}
            />
            <div className="flex flex-col items-center gap-1">
              <h2 className="font-display text-base uppercase tracking-wider text-po-fg">
                {enemy.name}
              </h2>
              <div className="flex flex-wrap items-center justify-center gap-1">
                <Badge variant={enemy.isBoss ? 'danger' : 'neutral'}>
                  {enemy.isBoss
                    ? enemy.bossState
                      ? `BOSS · Phase ${enemy.bossState.phase}`
                      : 'BOSS'
                    : `Lv ${enemy.level}`}
                </Badge>
                {enemy.bossState?.telegraph === 'fire-breath' && (
                  <Badge variant="danger" size="sm">
                    ⚠ Fire Breath
                  </Badge>
                )}
              </div>
              <StatusChips statuses={enemy.statuses} />
            </div>
            <div className="w-full max-w-sm">
              <div className="flex items-center justify-between font-display text-[10px] uppercase tracking-wider">
                <span>HP</span>
                <span className="text-po-fg-muted">
                  {enemy.hp} / {enemy.maxHp}
                </span>
              </div>
              <div className="h-3 w-full overflow-hidden border-2 border-black bg-po-bg-elevated">
                <motion.div
                  className="h-full bg-po-danger"
                  initial={false}
                  animate={{ width: `${Math.max(0, (enemy.hp / enemy.maxHp) * 100)}%` }}
                  transition={{ duration: reduced ? 0.05 : 0.35, ease: [0.32, 0.72, 0, 1] }}
                />
              </div>
            </div>
          </motion.div>
        </CardContent>
      </Card>

      {/* Damage numbers live OUTSIDE the Card so they're free to drift above
          the Card's top edge. The wrapper above is the positioning context
          and shares the Card's footprint. */}
      <DamageNumbers events={damageEvents} target="enemy" />
    </div>
  )
}
