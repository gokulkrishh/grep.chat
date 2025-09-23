"use client"

import { useState } from "react"

import { motion } from "motion/react"

import { CheckmarkIcon, ClipboardIcon } from "@/components/icons"

export type CodeBlockCopyProps = {
  code: string
  language?: string
}

export default function ChatCodeBlockCopy({ code, language }: CodeBlockCopyProps) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const handleCopyToClipboard = async (code: string) => {
    setCopiedCode(code)
    await navigator.clipboard.writeText(code)
    setTimeout(() => {
      setCopiedCode(null)
    }, 3000)
  }

  return (
    <div className="top-0 z-14 flex w-full items-center justify-between gap-2 bg-neutral-900 py-2 pr-1 pl-4 md:sticky">
      <span className="text-sm text-white capitalize">{language}</span>
      <button
        className="flex cursor-pointer items-center gap-2 px-2 py-1 text-sm text-white"
        onClick={() => handleCopyToClipboard(code)}
      >
        <motion.span
          className="flex items-center gap-2 text-white"
          key={copiedCode ? "check" : "copy"}
          initial={false}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          {copiedCode === code ? (
            <CheckmarkIcon className="size-4" />
          ) : (
            <ClipboardIcon className="size-4 rotate-180" />
          )}
          {copiedCode === code ? "Copied" : "Copy"}
        </motion.span>
      </button>
    </div>
  )
}
