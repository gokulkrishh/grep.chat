import { useState } from "react"

import { BrainIcon } from "lucide-react"

import { CheckmarkIcon } from "@/components/icons"
import { PromptInputAction } from "@/components/prompt-kit/prompt-input"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Reasoning, UseChatReturnType } from "@/hooks/use-chat"
import { cn } from "@/lib/utils"

type Props = Pick<UseChatReturnType, "reasoning" | "setReasoning">

export default function ChatInputReasoning({ reasoning, setReasoning }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PromptInputAction tooltip="Reasoning">
        <PopoverTrigger asChild>
          <Button variant={reasoning ? "secondary" : "ghost"} className="rounded-full">
            <BrainIcon className="size-4" />
            <span className="hidden font-normal capitalize empty:hidden md:inline-block">
              {reasoning}
            </span>
          </Button>
        </PopoverTrigger>
      </PromptInputAction>
      <PopoverContent align="center" className="flex w-40 flex-col gap-0.5 p-1">
        {["low", "medium", "high"].map((reasoningOption) => (
          <Button
            className={cn({
              "bg-accent": reasoningOption === reasoning,
            })}
            key={reasoningOption}
            variant="ghost"
            onClick={() => {
              if (reasoningOption === reasoning) {
                setReasoning(null)
                return
              }

              setReasoning(reasoningOption as Reasoning)
            }}
          >
            <p className="flex w-full items-center justify-between">
              <span className="flex w-full truncate text-left font-normal capitalize">
                {reasoningOption}
              </span>
              <CheckmarkIcon
                className={cn(
                  "-mr-2 h-4 w-4 flex-shrink-0",
                  reasoningOption === reasoning ? "opacity-100" : "opacity-0",
                )}
              />
            </p>
          </Button>
        ))}
      </PopoverContent>
    </Popover>
  )
}
