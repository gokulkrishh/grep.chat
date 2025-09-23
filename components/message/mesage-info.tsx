import { UIMessage } from "ai"
import prettyMilliseconds from "pretty-ms"

import { ChartIcon, TimeIcon } from "@/components/icons"
import TooltipWrapper from "@/components/tooltip-wrapper"
import models from "@/data/models"

import { Button } from "../ui/button"

export const formatMs = (ms?: number) => {
  if (ms == null) return null
  return prettyMilliseconds(ms, { compact: true })
}

type MessageMetadata = UIMessage & {
  model?: (typeof models)[number]["id"]
}

export default function MessageInfo({ message }: { message: MessageMetadata }) {
  const metadata = message.metadata as {
    started: number
    finished: number
    usage: {
      inputTokens: number
      outputTokens: number
      reasoningTokens: number
      totalTokens: number
    }
  }

  const totalDuration = metadata?.finished - metadata?.started
  const usage = metadata.usage

  if (isNaN(totalDuration) || totalDuration < 0 || !totalDuration) {
    return null
  }

  const modelName =
    message.model === "openrouter/auto"
      ? "Auto"
      : models.find((m) => m.id === message.model)?.name || "Auto"

  return (
    <>
      <TooltipWrapper
        tooltip={
          <div className="flex min-w-28 flex-col gap-1 py-1">
            <h4 className="mb-0.5 text-xs font-semibold">Tokens usage</h4>
            <p className="text-xs">
              <span className="font-semibold">Input: </span>
              <span className="tabular-nums">{usage?.inputTokens ?? 0}</span>
            </p>
            <p className="text-xs">
              <span className="font-semibold">Output: </span>
              <span className="tabular-nums">{usage?.outputTokens ?? 0}</span>
            </p>
            {usage?.reasoningTokens ? (
              <p className="text-xs">
                <span className="font-semibold">Reasoning: </span>
                <span className="tabular-nums">{usage?.reasoningTokens ?? 0}</span>
              </p>
            ) : null}
            <p className="text-xs">
              <span className="font-semibold">Total: </span>
              <span className="tabular-nums">{usage?.totalTokens ?? 0}</span>
            </p>
            {message.model && (
              <p className="text-xs">
                <span className="font-semibold">Model: </span>
                <span className="tabular-nums">{modelName}</span>
              </p>
            )}
          </div>
        }
      >
        <Button variant="ghost" size="icon" className="rounded-full">
          <ChartIcon className="size-5" />
        </Button>
      </TooltipWrapper>

      <TooltipWrapper tooltip="Response time">
        <Button variant="ghost" className="rounded-full">
          <TimeIcon className="size-5 shrink-0" />
          <span className="text-xs tabular-nums">
            <time key="time-text">{formatMs(totalDuration)}</time>
          </span>
        </Button>
      </TooltipWrapper>
    </>
  )
}
