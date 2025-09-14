"use client"

import { UIMessage } from "ai"

import { Loader } from "../prompt-kit/loader"
import { Reasoning, ReasoningContent, ReasoningTrigger } from "../prompt-kit/reasoning"
import { formatMs } from "./mesage-info"

type Props = {
  message: UIMessage
  isStreaming?: boolean
}

export default function MessageReasoning({ message, isStreaming }: Props) {
  const reasoningText = message.parts?.find((part) => part.type === "reasoning")?.text ?? ""

  if (!reasoningText) {
    return null
  }

  const metadata = message.metadata as {
    reasoningStart: number
    reasoningEnd: number
  }

  const reasoningMs =
    metadata?.reasoningEnd && metadata?.reasoningStart
      ? metadata.reasoningEnd - metadata.reasoningStart
      : 0

  return (
    <Reasoning className="mb-2 empty:hidden" key={message.id} isStreaming={isStreaming}>
      <ReasoningTrigger>
        {isStreaming && !reasoningMs ? (
          <Loader variant="text-shimmer" text="Thinking" />
        ) : reasoningMs > 0 ? (
          `Thought for ${formatMs(reasoningMs)}`
        ) : (
          "Thoughts"
        )}
      </ReasoningTrigger>
      <ReasoningContent markdown>{reasoningText}</ReasoningContent>
    </Reasoning>
  )
}
