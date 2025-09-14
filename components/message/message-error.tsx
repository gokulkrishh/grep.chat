"use client"

import { TriangleIcon } from "@/components/icons"
import { Message } from "@/components/prompt-kit/message"

export default function MessageError({ error }: { error?: Error | null }) {
  if (!error) {
    return null
  }

  return (
    <div className="group mx-auto flex w-full max-w-3xl flex-col items-start gap-2">
      <Message className="not-prose flex w-full max-w-3xl flex-col items-start gap-2">
        <div className="text-primary flex max-w-2xl flex-row items-center gap-3 overflow-x-scroll rounded-lg bg-red-200 px-3 py-2 whitespace-pre-wrap dark:bg-red-950/50">
          <TriangleIcon className="size-5 shrink-0 text-red-500 dark:text-red-400" />
          <p className="text-sm text-red-500 dark:text-red-400">
            {"Error occurred. Please try again."}
          </p>
        </div>
      </Message>
    </div>
  )
}
