"use client"

import { useState } from "react"

import Image from "next/image"

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import models from "@/data/models"
import { UseChatReturnType, autoModel } from "@/hooks/use-chat"
import { cn } from "@/lib/utils"

import { CheckmarkIcon, CpuIcon } from "../icons"
import { PromptInputAction } from "../prompt-kit/prompt-input"
import TooltipWrapper from "../tooltip-wrapper"
import { Button } from "../ui/button"

const getCompanyName = (modelName: string): string => {
  const match = modelName.match(/^([^:]+):/)
  return match ? match[1] : ""
}

const getCompanyFavicon = (companyName: string): string | null => {
  const companyWebsites: Record<string, string> = {
    xAI: "https://x.ai",
    OpenAI: "https://openai.com",
    Google: "https://google.com",
    Anthropic: "https://anthropic.com",
    DeepSeek: "https://deepseek.com",
    Perplexity: "https://perplexity.ai",
    MoonshotAI: "https://moonshot.ai",
    "Z.AI": "https://z.ai",
    Qwen: "https://qwen.ai",
  }

  const website = companyWebsites[companyName]
  if (!website) return null

  // Use Google's favicon service
  return `https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${encodeURIComponent(website)}&size=32`
}

const allModels = models.sort((a, b) => b.created - a.created)

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

// Get all free model IDs to exclude from other categories
const freeModelIds = new Set(freeModels.map((m) => m.id))

// Latest models - most recently created (last 3 months), excluding free models
const latestModels = [...allModels]
  .filter((model) => {
    const threeMonthsAgo = Date.now() / 1000 - 60 * 60 * 24 * 90
    return model.created >= threeMonthsAgo && !freeModelIds.has(model.id)
  })
  .slice(0, 3)

// Multimodal models - support image input, excluding free models
const multimodalModels = allModels.filter(
  (model) =>
    model.architecture?.input_modalities?.includes("image") &&
    !freeModelIds.has(model.id) &&
    !latestModels.some((m) => m.id === model.id),
)

type Props = Pick<UseChatReturnType, "model" | "setModel">

export default function ChatInputModels({ model, setModel }: Props) {
  const [open, setOpen] = useState(false)

  const renderModels = (models: typeof allModels) => {
    return models.map((modelOption) => {
      const companyName = getCompanyName(modelOption.name)
      const faviconUrl = getCompanyFavicon(companyName)

      return (
        <Button
          className={cn({
            "bg-accent": modelOption.id === model,
          })}
          key={modelOption.id}
          variant="ghost"
          onClick={() => setModel(modelOption.id)}
        >
          <TooltipWrapper
            delayDuration={500}
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
            <div className="flex w-full min-w-0 items-center justify-between gap-2">
              <div className="flex min-w-0 flex-1 items-center gap-2">
                {faviconUrl && (
                  <Image
                    src={faviconUrl}
                    alt={`${companyName} favicon`}
                    className="h-4 w-4 flex-shrink-0 rounded-full"
                    onError={(e) => {
                      e.currentTarget.style.display = "none"
                    }}
                    width={32}
                    height={32}
                  />
                )}
                <span className="min-w-0 flex-1 truncate text-left font-normal capitalize">
                  {modelOption.name.replaceAll(/(\(Free\)|\(free\))$/g, "")}
                </span>
              </div>
              <CheckmarkIcon
                className={cn(
                  "-mr-1 h-4 w-4 flex-shrink-0",
                  modelOption.id === model ? "opacity-100" : "opacity-0",
                )}
              />
            </div>
          </TooltipWrapper>
        </Button>
      )
    })
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
        {renderLabel("Latest")}
        {renderModels(latestModels)}
        {renderLabel("Multimodal")}
        {renderModels(multimodalModels)}
        {renderLabel("Free")}
        {renderModels(freeModels)}
      </PopoverContent>
    </Popover>
  )
}
