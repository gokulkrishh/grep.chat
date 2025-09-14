"use client"

import { useEffect, useState } from "react"

import { AnimatePresence, motion } from "motion/react"

import { usePathname } from "next/navigation"

import { deleteSharedChat, getSharedTokenByChatId, shareChat } from "@/actions/chat"
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
import { cn } from "@/lib/utils"

import TooltipWrapper from "../tooltip-wrapper"

async function createShareToken(chatId: string) {
  const shareToken = await shareChat(chatId)
  return shareToken
}

async function getShareToken(chatId: string) {
  const shareToken = await getSharedTokenByChatId(chatId)
  return shareToken
}

export default function ChatShare() {
  const pathname = usePathname()
  const chatId = pathname?.split?.("/chat/")?.[1]
  const [open, setOpen] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const [shareToken, setShareToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const isChatIdPath = pathname.startsWith("/chat/")
  const [isSharedRemoveLoading, setIsSharedRemoveLoading] = useState(false)
  const [isSharedTokenLoading, setIsSharedTokenLoading] = useState(false)

  useEffect(() => {
    if (isChatIdPath && chatId && open) {
      const fetchShareToken = async () => {
        try {
          setIsSharedTokenLoading(true)
          const shareToken = await getShareToken(chatId as string)
          setShareToken(shareToken ?? null)
        } finally {
          setIsSharedTokenLoading(false)
        }
      }

      fetchShareToken()
    }
  }, [isChatIdPath, chatId, open])

  const handleCopy = async (token: string) => {
    setIsCopied(true)
    await navigator.clipboard.writeText(`${baseUrl}/share/${token}`)
    setTimeout(() => {
      setIsCopied(false)
    }, 2000)
  }

  const handleShare = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (shareToken) {
      handleCopy(shareToken)
      return
    }

    if (!chatId) {
      return
    }

    try {
      setIsLoading(true)
      const shareToken = await createShareToken(chatId)

      if (shareToken) {
        setShareToken(shareToken)
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
      await deleteSharedChat(chatId as string)
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
        <Button className="rounded-full" variant="ghost" type="submit">
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

                  <form onSubmit={handleShare}>
                    <Button className="rounded-full font-semibold" type="submit">
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
                  </form>
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
