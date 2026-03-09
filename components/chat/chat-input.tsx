"use client"

import { useRef, useState } from "react"

import { usePathname } from "next/navigation"

import { toast } from "sonner"

import { ensureChat } from "@/actions/chat"
import { UseChatReturnType } from "@/hooks/use-chat"
import { useIsMobile } from "@/hooks/use-mobile"
import { useUser } from "@/hooks/use-user"
import { uploadChatFiles, validateFiles } from "@/lib/supabase/storage"

import { useChats } from "../contexts/chats-provider"
import { ArrowUpIcon, GlobeIcon, PaperClipIcon, SquareIcon } from "../icons"
import { Loader } from "../prompt-kit/loader"
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
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { refreshChats } = useChats()
  const { user } = useUser()

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
    if (!user) {
      toast.error("Please sign in to chat")
      return
    }

    if (isStreaming) {
      props.stop()
      return
    }

    if (!text.trim() && !files.length) {
      return
    }

    try {
      const chatId = props.id
      const messageText = text.trim()

      const parts: Array<
        | { type: "text"; text: string }
        | { type: "file"; url: string; mediaType: string; filename: string }
      > = []

      // Upload files to Supabase Storage if any
      if (files.length > 0) {
        setIsUploading(true)

        try {
          const uploaded = await uploadChatFiles(files, chatId, user.id)

          for (const file of uploaded) {
            parts.push({
              type: "file",
              url: file.url,
              mediaType: file.mediaType,
              filename: file.name,
            })
          }
        } catch (error) {
          const message = error instanceof Error ? error.message : "Failed to upload files"
          toast.error(message)
          setIsUploading(false)
          return
        }

        setIsUploading(false)
      }

      // Clear text only after uploads succeed
      setText("")

      if (messageText) {
        parts.push({ type: "text", text: messageText })
      }

      sendMessage(
        { role: "user", parts },
        {
          body: {
            reasoning: props.reasoning,
            webSearch,
            model: props.model,
            id: chatId,
          },
        },
      )

      if (isHomePath) {
        await ensureChat(chatId, messageText?.slice(0, 40))
        redirectToChat(chatId)
      }
    } catch (error) {
      console.log("Error while submitting message", error)
    } finally {
      refreshChats()
      setFiles([])
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return

    const newFiles = Array.from(event.target.files)
    const allFiles = [...files, ...newFiles]
    const validationError = validateFiles(allFiles)

    if (validationError) {
      toast.error(validationError)
      // Reset file input so the same file can be re-selected
      if (fileInputRef.current) fileInputRef.current.value = ""
      return
    }

    setFiles(allFiles)

    // Reset file input so the same file can be re-selected
    if (fileInputRef.current) fileInputRef.current.value = ""
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
              className="relative rounded-full"
              disabled={isUploading}
              aria-label={files.length ? `Attach files (${files.length} selected)` : "Attach files"}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/jpeg,image/png,image/gif,image/webp,application/pdf,text/plain,text/csv,text/markdown,application/json"
                onChange={handleFileChange}
                className="hidden"
              />
              <PaperClipIcon className="size-4" />
              {files.length > 0 && (
                <span className="bg-primary text-primary-foreground absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full text-[10px] leading-none font-medium">
                  {files.length}
                </span>
              )}
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
          <PromptInputAction tooltip={isUploading ? "Uploading…" : isLoading ? "Stop" : "Send"}>
            <Button
              disabled={isUploading || (!isLoading && !text.trim() && !files.length)}
              variant="default"
              size="icon"
              className="rounded-full"
              onClick={handleSubmit}
              aria-label={isUploading ? "Uploading files" : isLoading ? "Stop" : "Send message"}
            >
              {isUploading ? (
                <Loader variant="pulse-dot" size="sm" />
              ) : isLoading ? (
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
