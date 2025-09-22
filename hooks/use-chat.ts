"use client"

import { useCallback, useEffect, useState } from "react"

import { useChat as useAiSdkChat } from "@ai-sdk/react"

import { DefaultChatTransport, UIMessage } from "ai"
import { v4 as uuidv4 } from "uuid"

type Props = {
  id: string
  initialMessages?: UIMessage[]
}

export type Reasoning = "low" | "medium" | "high" | null
export const autoModel = "openrouter/auto"

export const useChat = ({ id, initialMessages }: Props) => {
  const [model, setModel] = useState(autoModel)
  const [webSearch, setWebSearch] = useState(false)
  const [reasoning, setReasoning] = useState<Reasoning>(null)

  const chat = useAiSdkChat({
    id,
    messages: initialMessages,
    generateId: () => uuidv4(),
    transport: new DefaultChatTransport({
      api: `/api/chat`,
      prepareSendMessagesRequest({ messages, trigger, body }) {
        return {
          body: {
            trigger,
            message: messages.at(-1),
            model,
            webSearch,
            reasoning,
            ...body,
          },
        }
      },
    }),
  })

  const resetChat = useCallback(() => {
    chat.stop()
    chat.clearError()
    chat.setMessages([])
  }, [chat])

  useEffect(() => {
    const handleResetChat = resetChat

    document.addEventListener("reset-chat", handleResetChat)

    return () => {
      document.removeEventListener("reset-chat", handleResetChat)
    }
  }, [chat, resetChat])

  return {
    ...chat,
    id,
    model,
    setModel,
    webSearch,
    setWebSearch,
    reasoning,
    setReasoning,
    resetChat,
  }
}

export type UseChatReturnType = ReturnType<typeof useChat>
