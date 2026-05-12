'use client'

import {
  Button,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@pixelore/react'

/**
 * Live Tooltip demos. See dialog/_demos.tsx for the why — same Radix Portal
 * + React hydration race that drops the first inline instance's trigger.
 */

export function TooltipDefaultDemo() {
  return (
    <TooltipProvider delayDuration={100}>
      <div className="flex flex-wrap items-center gap-3">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost">Hover or focus</Button>
          </TooltipTrigger>
          <TooltipContent>Press X to confirm</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="primary">Attack</Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">Basic strike — no cost</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  )
}

export function TooltipSidesDemo() {
  return (
    <TooltipProvider delayDuration={100}>
      <div className="flex flex-wrap items-center gap-3">
        {(['top', 'right', 'bottom', 'left'] as const).map((side) => (
          <Tooltip key={side}>
            <TooltipTrigger asChild>
              <Button variant="secondary" size="sm">
                {side}
              </Button>
            </TooltipTrigger>
            <TooltipContent side={side}>{side} tooltip</TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  )
}
