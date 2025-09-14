"use client"

import { useState } from "react"

import { motion } from "motion/react"

import { UIMessage } from "ai"

import { CheckmarkIcon, ClipboardIcon } from "@/components/icons"
import { MessageAction } from "@/components/prompt-kit/message"
import { Button } from "@/components/ui/button"

export default function MessageCopy({ message }: { message: UIMessage }) {
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const handleCopyToClipboard = async (message: UIMessage) => {
    try {
      await navigator.clipboard.writeText(
        message.parts
          ?.map((part) => {
            if (part.type === "text") {
              return part.text
            }
            return ""
          })
          .join("") ?? "",
      )
    } finally {
      setCopiedId(message.id)

      setTimeout(() => {
        setCopiedId(null)
      }, 3000)
    }
  }

  return (
    <MessageAction tooltip={copiedId === message.id ? "Copied" : "Copy"}>
      <Button variant="ghost" size="icon" onClick={() => handleCopyToClipboard(message)}>
        <motion.span
          key={copiedId === message.id ? "check" : "copy"}
          initial={false}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          {copiedId === message.id ? (
            <CheckmarkIcon className="size-6" />
          ) : (
            <ClipboardIcon className="size-5 rotate-180" />
          )}
        </motion.span>
      </Button>
    </MessageAction>
  )
}
