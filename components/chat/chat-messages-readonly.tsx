import { UIMessage } from "@ai-sdk/react"

import MessageCopy from "@/components/message/message-copy"
import MessageScrollButton from "@/components/message/message-scroll-button"
import { ChatContainerContent, ChatContainerRoot } from "@/components/prompt-kit/chat-container"
import { Message, MessageActions, MessageContent } from "@/components/prompt-kit/message"
import { cn } from "@/lib/utils"

type Props = {
  messages: UIMessage[]
}

export default function ChatMessagesReadonly({ messages }: Props) {
  if (!messages) {
    return null
  }

  return (
    <div className="relative mx-auto flex h-full w-full flex-col gap-8 overflow-y-auto">
      <ChatContainerRoot className="flex-1">
        <ChatContainerContent className="space-y-6 p-4 pb-20">
          <p className="text-muted-foreground text-center text-sm max-sm:mt-12">
            This is a copy of a conversation between grep.chat & anonymous.
          </p>
          {messages?.map((message) => {
            const isAssistant = message.role === "assistant"
            const textParts = message.parts?.find((part) => part.type === "text")?.text ?? ""

            return (
              <Message
                key={message.id}
                className={cn("mx-auto flex w-full max-w-3xl flex-col items-end", {
                  "items-start": isAssistant,
                })}
              >
                {isAssistant ? (
                  <div className="group flex w-full flex-col gap-2">
                    <MessageContent
                      className="text-foreground prose w-full flex-1 rounded-lg bg-transparent p-0"
                      markdown
                    >
                      {textParts}
                    </MessageContent>

                    <MessageActions className="-ml-2.5">
                      <MessageCopy message={message} />
                    </MessageActions>
                  </div>
                ) : (
                  <div className="group flex w-full flex-col items-end gap-2">
                    <MessageContent className="bg-muted text-primary w-fit max-w-[85%] rounded-3xl sm:max-w-[75%]">
                      {textParts}
                    </MessageContent>

                    <MessageActions>
                      <MessageCopy message={message} />
                    </MessageActions>
                  </div>
                )}
              </Message>
            )
          })}

          <MessageScrollButton />
        </ChatContainerContent>
      </ChatContainerRoot>
    </div>
  )
}
