"use client"

import { useState } from "react"

import { TooltipContentProps } from "@radix-ui/react-tooltip"

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

type Props = {
  className?: string
  show?: boolean
  tooltip: React.ReactNode
  children: React.ReactNode
  side?: TooltipContentProps["side"]
  sideOffset?: TooltipContentProps["sideOffset"]
  longPressDelay?: number
} & React.ComponentProps<typeof Tooltip>

export default function TooltipWrapper({
  show = true,
  tooltip,
  children,
  className,
  side = "bottom",
  sideOffset = 0,
  ...props
}: Props) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Tooltip delayDuration={300} open={show && isOpen} onOpenChange={setIsOpen} {...props}>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side={side} sideOffset={sideOffset} className={cn(className)}>
        {tooltip}
      </TooltipContent>
    </Tooltip>
  )
}
