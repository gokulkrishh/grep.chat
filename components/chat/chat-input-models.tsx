"use client"

import { useState } from "react"

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import models from "@/data/models"
import { UseChatReturnType, autoModel } from "@/hooks/use-chat"
import { cn } from "@/lib/utils"

import { CheckmarkIcon, CpuIcon } from "../icons"
import { PromptInputAction } from "../prompt-kit/prompt-input"
import TooltipWrapper from "../tooltip-wrapper"
import { Button } from "../ui/button"

const allModels = models

const freeModels = models.filter(
  (m) => m?.pricing?.prompt === "0" && m?.pricing?.completion === "0",
)

const autoModels = [
  {
    id: autoModel,
    name: "Auto",
    description: "Auto-select the best model for the task.",
  } as unknown as (typeof models)[number],
]

const popular = [...allModels].sort((a, b) => b.created - a.created).slice(0, 3)

type Props = Pick<UseChatReturnType, "model" | "setModel">

export default function ChatInputModels({ model, setModel }: Props) {
  const [open, setOpen] = useState(false)

  const renderModels = (models: typeof allModels) => {
    return models.map((modelOption) => (
      <Button
        className={cn({
          "bg-accent": modelOption.id === model,
        })}
        key={modelOption.id}
        variant="ghost"
        onClick={() => setModel(modelOption.id)}
      >
        <TooltipWrapper
          delayDuration={200}
          sideOffset={4}
          side="top"
          className="w-full max-w-80"
          tooltip={
            <div className="flex max-w-80 flex-col gap-1 py-1">
              <h4 className="text-sm font-medium">{modelOption.name}</h4>
              <p className="text-sm">{modelOption.description}</p>
            </div>
          }
        >
          <p className="flex w-full min-w-0 items-center justify-between">
            <span className="min-w-0 flex-1 truncate text-left font-normal capitalize">
              {modelOption.name}
            </span>
            <CheckmarkIcon
              className={cn(
                "-mr-2 h-4 w-4 flex-shrink-0",
                modelOption.id === model ? "opacity-100" : "opacity-0",
              )}
            />
          </p>
        </TooltipWrapper>
      </Button>
    ))
  }

  const renderLabel = (label: string) => (
    <label className="text-muted-foreground px-4 py-2 text-xs font-medium">{label}</label>
  )

  const selectedModel = models.find((m) => m.id === model)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PromptInputAction tooltip="Models">
        <PopoverTrigger asChild>
          <Button variant={model !== autoModel ? "secondary" : "ghost"} className="rounded-full">
            <CpuIcon className="size-4.5" />
            <span className="hidden font-normal capitalize empty:hidden md:inline-block">
              {selectedModel?.id !== autoModel
                ? (selectedModel?.name.split(":")[1] ?? selectedModel?.name)
                : "Auto"}
            </span>
          </Button>
        </PopoverTrigger>
      </PromptInputAction>
      <PopoverContent align="center" className="flex max-h-80 flex-col gap-0.5 overflow-y-auto p-1">
        {renderModels(autoModels)}
        {renderLabel("Popular")}
        {renderModels(popular)}
        {renderLabel("Free")}
        {renderModels(freeModels)}
      </PopoverContent>
    </Popover>
  )
}
