"use client"

import React, { createContext, useContext, useEffect, useRef, useState } from "react"

import { cn } from "@/lib/utils"

import { BrainIcon, ChevronDownIcon } from "../icons"
import { Markdown } from "./markdown"

type ReasoningContextType = {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

const ReasoningContext = createContext<ReasoningContextType | undefined>(undefined)

function useReasoningContext() {
  const context = useContext(ReasoningContext)
  if (!context) {
    throw new Error("useReasoningContext must be used within a Reasoning provider")
  }
  return context
}

export type ReasoningProps = {
  children: React.ReactNode
  className?: string
  open?: boolean
  onOpenChange?: (open: boolean) => void
  isStreaming?: boolean
}
function Reasoning({ children, className, open, onOpenChange, isStreaming }: ReasoningProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const [wasAutoOpened, setWasAutoOpened] = useState(false)

  const isControlled = open !== undefined
  const isOpen = isControlled ? open : internalOpen

  const handleOpenChange = (newOpen: boolean) => {
    if (!isControlled) {
      setInternalOpen(newOpen)
    }
    onOpenChange?.(newOpen)
  }

  useEffect(() => {
    if (isStreaming && !wasAutoOpened) {
      if (!isControlled) setInternalOpen(true)
      setWasAutoOpened(true)
    }

    if (!isStreaming && wasAutoOpened) {
      if (!isControlled) setInternalOpen(false)
      setWasAutoOpened(false)
    }
  }, [isStreaming, wasAutoOpened, isControlled])

  return (
    <ReasoningContext.Provider
      value={{
        isOpen,
        onOpenChange: handleOpenChange,
      }}
    >
      <div className={className}>{children}</div>
    </ReasoningContext.Provider>
  )
}

export type ReasoningTriggerProps = {
  children: React.ReactNode
  className?: string
} & React.HTMLAttributes<HTMLButtonElement>

function ReasoningTrigger({ children, className, ...props }: ReasoningTriggerProps) {
  const { isOpen, onOpenChange } = useReasoningContext()
  const [isHovering, setIsHovering] = useState(false)

  return (
    <button
      className={cn("flex cursor-pointer items-center gap-2 text-sm", className)}
      onClick={() => onOpenChange(!isOpen)}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      {...props}
    >
      <div
        className={cn(
          "text-muted-foreground transform transition-transform",
          isOpen ? "rotate-180" : "",
        )}
      >
        {isOpen || isHovering ? <ChevronDownIcon className="size-4 shrink-0" /> : null}
        {!isOpen && !isHovering ? <BrainIcon className="size-4 shrink-0" /> : null}
      </div>
      <span className="text-muted-foreground">{children}</span>
    </button>
  )
}

export type ReasoningContentProps = {
  children: React.ReactNode
  className?: string
  markdown?: boolean
  contentClassName?: string
} & React.HTMLAttributes<HTMLDivElement>

function ReasoningContent({
  children,
  className,
  contentClassName,
  markdown = false,
  ...props
}: ReasoningContentProps) {
  const contentRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)
  const { isOpen } = useReasoningContext()

  useEffect(() => {
    if (!contentRef.current || !innerRef.current) return

    const scrollToBottom = () => {
      if (contentRef.current && isOpen) {
        contentRef.current.scrollTop = contentRef.current.scrollHeight
      }
    }

    // Use ResizeObserver for size changes
    const resizeObserver = new ResizeObserver(() => {
      scrollToBottom()
    })

    // Use MutationObserver for DOM changes (text streaming)
    const mutationObserver = new MutationObserver(() => {
      scrollToBottom()
    })

    resizeObserver.observe(innerRef.current)
    mutationObserver.observe(innerRef.current, {
      childList: true,
      subtree: true,
      characterData: true,
    })

    // Initial scroll to bottom
    scrollToBottom()

    return () => {
      resizeObserver.disconnect()
      mutationObserver.disconnect()
    }
  }, [isOpen])

  const content = markdown ? <Markdown>{children as string}</Markdown> : children

  return (
    <div
      ref={contentRef}
      className={cn(
        "parent scroll-p-2 overflow-auto transition-[max-height] duration-150 ease-out empty:hidden",
        {
          "ml-2 h-fit max-h-40 border-l pl-2": isOpen,
          "h-0 max-h-0": !isOpen,
        },
        className,
      )}
      {...props}
    >
      <div
        ref={innerRef}
        className={cn(
          "text-muted-foreground prose prose-sm dark:prose-invert child empty:hidden",

          contentClassName,
        )}
      >
        {content}
      </div>
    </div>
  )
}

export { Reasoning, ReasoningTrigger, ReasoningContent }
