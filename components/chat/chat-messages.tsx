"use client"

import MessageInfo from "@/components/message/mesage-info"
import MessageCopy from "@/components/message/message-copy"
import MessageError from "@/components/message/message-error"
import MessageReasoning from "@/components/message/message-reasoning"
import MessageRegenerate from "@/components/message/message-regenerate"
import MessageSources from "@/components/message/message-sources"
import { ChatContainerContent, ChatContainerRoot } from "@/components/prompt-kit/chat-container"
import { Loader } from "@/components/prompt-kit/loader"
import { Message, MessageActions, MessageContent } from "@/components/prompt-kit/message"
import { useChat } from "@/hooks/use-chat"
import { cn } from "@/lib/utils"

import MessageScrollButton from "../message/message-scroll-button"

type Props = ReturnType<typeof useChat>

export default function ChatMessages({ regenerate, error, status, messages, ...props }: Props) {
  const lastMessage = messages.at(-1)
  const isSubmitted = status === "submitted"
  const isStreaming = status === "streaming"
  const isLastMessageHasStartStep = !lastMessage?.parts?.some((part) => part.type === "step-start")

  const handleRegenerate = async (messageId: string) => {
    regenerate({
      messageId,
      body: {
        messageIdToDelete: messageId,
        model: props.model,
        reasoning: props.reasoning,
        webSearch: props.webSearch,
      },
    })
  }

  return (
    <div className="relative mx-auto flex h-full w-full flex-col gap-8 overflow-hidden md:mt-0 md:pt-0">
      <ChatContainerRoot>
        <ChatContainerContent className="mt-8 space-y-6 p-4 pb-14">
          {messages.map((message) => {
            const isAssistant = message.role === "assistant"
            const textParts = message.parts?.find((part) => part.type === "text")?.text ?? ""
            const isLastMessage = message.id === lastMessage?.id
            const isLastMessageStreaming = isStreaming && message.id === lastMessage?.id
            const isReasoningDone = message.parts?.some(
              (part) => part.type === "reasoning" && part?.state === "done",
            )
            const isSearching =
              message.parts?.some((part) => part.type === "source-url") && !textParts

            return (
              <Message
                key={message.id}
                className={cn(
                  "parent mx-auto flex w-full max-w-3xl flex-col items-end empty:hidden",
                  {
                    "items-start": isAssistant,
                  },
                )}
              >
                {isAssistant ? (
                  <div className="group child flex w-full flex-col gap-2 empty:hidden">
                    {isLastMessageStreaming && isSearching && (
                      <MessageSources isStreaming message={message} />
                    )}

                    <MessageReasoning
                      key={message.id}
                      message={message}
                      isStreaming={isLastMessageStreaming && !isReasoningDone}
                    />

                    {textParts && (
                      <MessageContent
                        className="text-foreground prose w-full flex-1 rounded-lg bg-transparent p-0 empty:hidden"
                        markdown
                      >
                        {textParts}
                      </MessageContent>
                    )}

                    {!isLastMessageStreaming && (
                      <MessageActions
                        className={cn("-ml-2.5 opacity-0", {
                          "opacity-100": !isLastMessageStreaming,
                        })}
                      >
                        <MessageCopy message={message} />
                        {isLastMessage && (
                          <MessageRegenerate onClick={() => handleRegenerate(message.id)} />
                        )}

                        <MessageInfo message={message} />
                        <MessageSources message={message} isStreaming={false} />
                      </MessageActions>
                    )}
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

          <div className="mx-auto flex w-full max-w-3xl flex-col space-y-8 empty:hidden">
            <div className="h-3">
              {(isSubmitted || (isStreaming && isLastMessageHasStartStep)) && (
                <Loader variant="pulse-dot" size="lg" />
              )}
            </div>

            {error && <MessageError error={error} />}
          </div>
        </ChatContainerContent>
      </ChatContainerRoot>
    </div>
  )
}
