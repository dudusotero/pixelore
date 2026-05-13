import { Badge, Tooltip, TooltipContent, TooltipTrigger } from '@pixelore/react'
import { Sprite } from '../sprites'
import { STATUS_TEMPLATES } from '../game/statuses'
import type { StatusEffect } from '../game/types'

const VARIANT_MAP = {
  danger: 'danger',
  success: 'success',
  warning: 'accent',
  info: 'secondary',
} as const

export function StatusChips({ statuses }: { statuses: StatusEffect[] | undefined }) {
  if (!statuses || statuses.length === 0) return null
  return (
    <div className="flex flex-wrap items-center gap-1">
      {statuses.map((s) => {
        const tpl = STATUS_TEMPLATES[s.id]
        return (
          <Tooltip key={s.id}>
            <TooltipTrigger asChild>
              <Badge variant={VARIANT_MAP[tpl.variant]} size="sm">
                <Sprite
                  kind="status"
                  id={s.id}
                  size={14}
                  label={tpl.name}
                />
                <span className="ml-1">
                  {tpl.name}
                  {s.id !== 'shield' && s.duration > 0 ? ` · ${s.duration}` : ''}
                </span>
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              {tpl.description}
              {s.magnitude > 0 && (s.id === 'poison' || s.id === 'burn')
                ? ` (${s.magnitude}/turn)`
                : ''}
            </TooltipContent>
          </Tooltip>
        )
      })}
    </div>
  )
}
