import { UIMessage } from "ai"

import { cn } from "@/lib/utils"

import { Loader } from "../prompt-kit/loader"
import { Source, SourceContent, SourceTrigger } from "../prompt-kit/source"

export type Source = {
  url: string
  title: string
  description: string
}

type Props = {
  message: UIMessage
  isStreaming: boolean
}

export default function MessageSources({ message, isStreaming }: Props) {
  const sources = getSources(message.parts)

  if (!sources.length) {
    return null
  }

  return (
    <div
      className={cn("text-muted-foreground flex items-center gap-2 text-sm", {
        "mb-2": isStreaming,
      })}
    >
      {isStreaming ? <Loader variant="text-shimmer" text="Searching the web" /> : "Sources"}
      <div className="flex items-center -space-x-2">
        {sources.map((source: Source) => (
          <Source href={source.url} key={source.url}>
            <SourceTrigger label="" showFavicon />
            <SourceContent title={source.title} description={source.description} />
          </Source>
        ))}
      </div>
    </div>
  )
}

export function getSources(parts: UIMessage["parts"]): Source[] {
  const sources = parts
    ?.filter((part) => part.type.startsWith("source"))
    ?.map((part) => {
      if (part.type.startsWith("source")) {
        return part
      }

      return null
    })
    .filter(Boolean)
    .flat()

  if (sources?.length === 0) {
    return []
  }

  const validSources =
    sources?.filter(
      (source) =>
        source &&
        typeof source === "object" &&
        "url" in source &&
        (source as { url: string }).url !== "",
    ) || []

  return validSources as unknown as Source[]
}
