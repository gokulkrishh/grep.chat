"use client"

import { UIMessage } from "@ai-sdk/react"
import { AnimatePresence, motion } from "motion/react"

import { useChat } from "@/hooks/use-chat"

import { ChatDisclaimer } from "./chat-disclaimer"
import ChatInput from "./chat-input"
import ChatMessages from "./chat-messages"
import ChatWelcome from "./chat-welcome"

type Props = {
  id?: string
  initialMessages?: UIMessage[]
}

export default function ChatContainer({ id, initialMessages }: Props) {
  const chat = useChat({ id, initialMessages })
  const isMessagesEmpty = chat.messages.length === 0

  return (
    <AnimatePresence key={id ?? "homepage"} mode="popLayout">
      <main className="mx-auto flex h-dvh w-full flex-col items-center justify-center">
        {isMessagesEmpty ? <ChatWelcome /> : <ChatMessages {...chat} />}
        <motion.div
          key="chat-input-container"
          layoutId="chat-input-container"
          layout="position"
          className="w-full px-4"
          transition={{
            layout: { duration: chat.messages.length === 1 ? 0.2 : 0 },
          }}
        >
          <ChatInput {...chat} />
          <ChatDisclaimer />
        </motion.div>
      </main>
    </AnimatePresence>
  )
}
