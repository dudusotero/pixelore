import { AnimatePresence, motion } from 'motion/react'
import {
  Avatar,
  AvatarFallback,
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  useReducedMotion,
} from '@pixelore/react'
import type { DamageFlash } from '../game/battle'
import type { Hero } from '../game/types'
import { DamageNumbers } from './DamageNumber'

interface HeroStatPanelProps {
  hero: Hero
  compact?: boolean
  /** Latest battle's damage events; renders floating numbers + HP flash. */
  damageEvents?: DamageFlash[]
}

export function HeroStatPanel({
  hero,
  compact = false,
  damageEvents = [],
}: HeroStatPanelProps) {
  const reduced = useReducedMotion()
  const lastHeroEvent = [...damageEvents].reverse().find((e) => e.target === 'hero')
  const tookDamage =
    lastHeroEvent &&
    (lastHeroEvent.kind === 'damage' || lastHeroEvent.kind === 'crit')

  return (
    <Card className="relative overflow-hidden">
      {/* Red border flash when the hero takes damage. */}
      <AnimatePresence>
        {tookDamage && (
          <motion.div
            key={lastHeroEvent.id}
            initial={{ opacity: reduced ? 0.25 : 0.6 }}
            animate={{ opacity: 0 }}
            transition={{ duration: reduced ? 0.15 : 0.5 }}
            className="pointer-events-none absolute inset-0 z-10 border-4 border-po-danger"
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      <CardHeader>
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback aria-hidden="true">{hero.sprite}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-0.5">
            <CardTitle>{hero.name}</CardTitle>
            <Badge variant="neutral">Lv {hero.level}</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative flex flex-col gap-3">
          <DamageNumbers events={damageEvents} target="hero" />
          <StatBar label="HP" value={hero.hp} max={hero.maxHp} color="bg-po-danger" />
          <StatBar label="MP" value={hero.mp} max={hero.maxMp} color="bg-po-secondary" />
          {!compact && (
            <dl className="mt-2 grid grid-cols-3 gap-2 font-body text-base text-po-fg-muted">
              <Stat label="ATK" value={hero.atk} />
              <Stat label="DEF" value={hero.def} />
              <Stat label="SPD" value={hero.spd} />
            </dl>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function StatBar({
  label,
  value,
  max,
  color,
}: {
  label: string
  value: number
  max: number
  color: string
}) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between font-display text-[10px] uppercase tracking-wider">
        <span>{label}</span>
        <span className="text-po-fg-muted">
          {value} / {max}
        </span>
      </div>
      <div className="h-3 w-full overflow-hidden border-2 border-black bg-po-bg-elevated">
        <div
          className={`h-full transition-[width] duration-200 ${color}`}
          style={{ width: `${Math.max(0, Math.min(100, (value / max) * 100))}%` }}
        />
      </div>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col items-center border-2 border-po-border bg-po-bg-elevated p-2">
      <dt className="font-display text-[9px] uppercase tracking-wider text-po-fg-muted">
        {label}
      </dt>
      <dd className="font-display text-base text-po-fg">{value}</dd>
    </div>
  )
}
