"use client"

import { useCallback, useEffect, useState } from "react"

import { AnimatePresence, motion } from "motion/react"

import { usePathname } from "next/navigation"

import { ClipboardIcon, LinkIcon, ShareIcon, TrashIcon } from "@/components/icons"
import { Loader } from "@/components/loader"
import { baseUrl } from "@/components/signin"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { createClient } from "@/lib/supabase/client"
import { cn } from "@/lib/utils"

import TooltipWrapper from "../tooltip-wrapper"

export default function ChatShare() {
  const supabase = createClient()
  const pathname = usePathname()
  const chatId = pathname?.split?.("/chat/")?.[1]
  const [open, setOpen] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const [shareToken, setShareToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const isChatIdPath = pathname.startsWith("/chat/")
  const [isSharedRemoveLoading, setIsSharedRemoveLoading] = useState(false)
  const [isSharedTokenLoading, setIsSharedTokenLoading] = useState(false)

  const fetchShareToken = useCallback(async () => {
    try {
      setIsSharedTokenLoading(true)
      const { data } = await supabase.from("chats").select("share_token").eq("id", chatId).single()
      setShareToken(data?.share_token ?? null)
    } finally {
      setIsSharedTokenLoading(false)
    }
  }, [supabase, chatId])

  useEffect(() => {
    if (open && chatId) {
      fetchShareToken()
    }
  }, [open, chatId, fetchShareToken])

  const handleCopy = async (token: string) => {
    setIsCopied(true)
    await navigator.clipboard.writeText(`${baseUrl}/share/${token}`)
    setTimeout(() => {
      setIsCopied(false)
    }, 2000)
  }

  const handleShare = async () => {
    if (!chatId) {
      return
    }

    if (shareToken) {
      handleCopy(shareToken)
      return
    }

    try {
      setIsLoading(true)
      const token = crypto.randomUUID()
      const { data, error } = await supabase
        .from("chats")
        .update({
          share_token: token,
          share_created_at: new Date().toISOString(),
        })
        .eq("id", chatId)
        .select("share_token")
        .single()

      if (error) {
        throw new Error(error.message)
      }

      if (data?.share_token) {
        setShareToken(data.share_token)
      } else {
        throw new Error("Failed to create share token")
      }
    } catch (error) {
      console.error("Failed to create share token", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemoveShared = async () => {
    try {
      setIsSharedRemoveLoading(true)
      const { error } = await supabase
        .from("chats")
        .update({
          share_token: null,
          share_created_at: null,
        })
        .eq("id", chatId)
        .select("id")
        .single()

      if (error) {
        throw new Error(error.message)
      }

      setShareToken(null)
    } catch (error) {
      console.error("Failed to remove shared", error)
    } finally {
      setIsCopied(false)
      setIsSharedRemoveLoading(false)
    }
  }

  if (!isChatIdPath) {
    return null
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-full" variant="ghost" type="button">
          <ShareIcon className="size-5" /> <span className="hidden md:block">Share</span>
        </Button>
      </DialogTrigger>
      <DialogContent showCloseButton={!isSharedTokenLoading}>
        {isSharedTokenLoading ? (
          <div className="flex items-center justify-center py-4">
            <Loader size={20} />
            <DialogTitle />
            <DialogDescription />
          </div>
        ) : (
          <>
            <DialogHeader className="gap-3 text-left">
              <DialogTitle>Share chat</DialogTitle>
              <DialogDescription className="text-pretty">
                Anyone with the link can view this chat. So verify the content before sharing the
                link.
              </DialogDescription>
            </DialogHeader>

            <AnimatePresence mode="popLayout">
              <motion.div
                className="my-4 flex w-full items-center gap-4"
                initial={false}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <div className="border-input dark:bg-accent flex w-full items-center gap-2 rounded-full border p-1 pl-2">
                  <input
                    type="text"
                    value={`${baseUrl}/share/${shareToken ?? ""}`}
                    readOnly
                    className={cn("w-full rounded-2xl mask-r-from-90 pr-1 pl-3 outline-none", {
                      "mask-r-from-0.5": !shareToken,
                    })}
                  />

                  <Button className="rounded-full font-semibold" onClick={() => handleShare()}>
                    {isCopied ? (
                      <>
                        <ClipboardIcon /> Copied
                      </>
                    ) : shareToken ? (
                      <>
                        <LinkIcon /> Copy link
                      </>
                    ) : isLoading ? (
                      <>
                        <Loader size={2} />
                        Creating
                      </>
                    ) : (
                      <>
                        <LinkIcon />
                        Create link
                      </>
                    )}
                  </Button>
                </div>
                {shareToken ? (
                  <TooltipWrapper delayDuration={1000} tooltip="Remove sharing">
                    <Button
                      className="size-10 rounded-full"
                      size="lg"
                      disabled={isSharedRemoveLoading}
                      variant="destructive"
                      onClick={() => handleRemoveShared()}
                    >
                      {isSharedRemoveLoading ? (
                        <Loader size={4} />
                      ) : (
                        <>
                          <TrashIcon className="size-5" />
                        </>
                      )}
                    </Button>
                  </TooltipWrapper>
                ) : null}
              </motion.div>
            </AnimatePresence>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
