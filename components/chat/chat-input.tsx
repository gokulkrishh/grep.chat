"use client"

import { useRef, useState } from "react"

import { usePathname } from "next/navigation"

import { ensureChat } from "@/actions/chat"
import { UseChatReturnType } from "@/hooks/use-chat"
import { useIsMobile } from "@/hooks/use-mobile"

import { useChats } from "../contexts/chats-provider"
import { ArrowUpIcon, GlobeIcon, PaperClipIcon, SquareIcon } from "../icons"
import { PromptInput, PromptInputActions, PromptInputTextarea } from "../prompt-kit/prompt-input"
import { PromptInputAction } from "../prompt-kit/prompt-input"
import { Button } from "../ui/button"
import ChatFiles from "./chat-files"
import ChatInputModels from "./chat-input-models"
import ChatInputReasoning from "./chat-input-reasoning"

export default function ChatInput({
  sendMessage,
  setWebSearch,
  webSearch,
  ...props
}: UseChatReturnType) {
  const pathname = usePathname()
  const isMobile = useIsMobile()
  const [text, setText] = useState("")
  const [files, setFiles] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { refreshChats } = useChats()

  const isHomePath = pathname === "/"
  const isStreaming = props.status === "streaming"
  const isSubmitted = props.status === "submitted"
  const isLoading = isStreaming || isSubmitted

  const handleValueChange = (value: string) => {
    setText(value)
  }

  const redirectToChat = (chatId: string) => {
    window.history.pushState({}, "", `/chat/${chatId}`)
  }

  const handleSubmit = async () => {
    if (isStreaming) {
      props.stop()
      return
    }

    if (!text.trim()) {
      return
    }

    try {
      setText("")

      const chatId = props.id

      sendMessage(
        { role: "user", parts: [{ type: "text", text }] },
        { body: { reasoning: props.reasoning, webSearch, model: props.model, id: chatId } },
      )

      if (isHomePath) {
        await ensureChat(chatId, text?.slice(0, 40))
        redirectToChat(chatId)
        refreshChats()
      }
    } catch (error) {
      console.log("Error while submitting message", error)
    } finally {
      setFiles([])
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files)

      setFiles((prev) => [...prev, ...newFiles])
    }
  }

  const handleRemoveFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index))
  }

  return (
    <PromptInput
      value={text}
      onValueChange={handleValueChange}
      isLoading={isLoading}
      onSubmit={handleSubmit}
      className="mx-auto w-full max-w-2xl"
    >
      <ChatFiles files={files} handleRemoveFile={handleRemoveFile} />

      <PromptInputTextarea
        autoFocus={!isMobile}
        className="vertical-scroll-fade-mask"
        placeholder="Ask me anything"
      />

      <div className="flex justify-between pt-2">
        <PromptInputActions className="justify-end">
          <PromptInputAction tooltip="Attach files">
            <Button
              onClick={() => fileInputRef.current?.click()}
              variant={files?.length ? "secondary" : "ghost"}
              size="icon"
              className="rounded-full"
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileChange}
                className="hidden"
              />
              <PaperClipIcon className="size-4" />
            </Button>
          </PromptInputAction>

          <PromptInputAction tooltip="Web search">
            <Button
              onClick={() => setWebSearch(!webSearch)}
              variant={webSearch ? "secondary" : "ghost"}
              size="icon"
              className="rounded-full"
            >
              <GlobeIcon className="size-4" />
            </Button>
          </PromptInputAction>

          <ChatInputReasoning reasoning={props.reasoning} setReasoning={props.setReasoning} />
          <ChatInputModels model={props.model} setModel={props.setModel} />
        </PromptInputActions>

        <PromptInputActions className="justify-end">
          <PromptInputAction tooltip={isLoading ? "Stop" : "Send"}>
            <Button
              disabled={!isLoading && !text.trim()}
              variant="default"
              size="icon"
              className="rounded-full"
              onClick={handleSubmit}
            >
              {isLoading ? (
                <SquareIcon className="size-4 fill-current" />
              ) : (
                <ArrowUpIcon className="size-4" />
              )}
            </Button>
          </PromptInputAction>
        </PromptInputActions>
      </div>
    </PromptInput>
  )
}
