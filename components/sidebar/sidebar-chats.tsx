"use client"

import { useEffect, useState } from "react"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"

import { deleteChat } from "@/actions/chat"
import { TrashIcon } from "@/components/icons"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

import { useChats } from "../contexts/chats-provider"
import { Loader } from "../loader"
import TooltipWrapper from "../tooltip-wrapper"

export const SidebarChats = () => {
  const router = useRouter()
  const { chats, refreshChats } = useChats()
  const { isMobile, toggleSidebar } = useSidebar()

  const [open, setOpen] = useState<boolean>(false)
  const [deletedChatId, setDeletedChatId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const chatId = usePathname()?.split?.("/chat/")?.[1]

  const handleDelete = async () => {
    if (!deletedChatId) return

    try {
      setIsLoading(true)
      await deleteChat(deletedChatId)
      refreshChats()
      setOpen(false)
      setDeletedChatId(null)
      router.push("/")
    } finally {
      setIsLoading(false)
    }
  }

  const deletedChat = chats?.find((c) => c.id === deletedChatId)
  const currentChatData = chats?.find((c) => c.id === chatId)

  useEffect(() => {
    if (currentChatData?.title && chatId) {
      document.title = `${currentChatData?.title} - grep.chat`
    }
  }, [currentChatData?.title, chatId])

  return (
    <div className="flex flex-col gap-0.25">
      {chats.map((chat, index) => (
        <SidebarMenuItem
          className={cn(`group/chat-item flex w-full list-none items-center rounded-md`, {
            "bg-sidebar-accent": chatId === chat.id,
          })}
          key={chat.id}
        >
          <SidebarMenuButton className="inline-flex w-full pr-2" asChild>
            <Link
              prefetch={index < 5}
              onClick={() => {
                if (isMobile) {
                  toggleSidebar()
                }
              }}
              href={`/chat/${chat.id}`}
            >
              <span className="block w-full truncate">{chat.title}</span>

              <TooltipWrapper delayDuration={2000} side="right" tooltip="Delete chat">
                <Button
                  className={cn(
                    `size-9! shrink-0 transition-all md:opacity-0 md:group-hover/chat-item:opacity-100`,
                  )}
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setOpen(true)
                    setDeletedChatId(chat.id)
                  }}
                >
                  <TrashIcon className="size-4" />
                  <span className="sr-only">Delete</span>
                </Button>
              </TooltipWrapper>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-left">Delete chat?</AlertDialogTitle>
            <AlertDialogDescription className="text-foreground text-left">
              This will delete <span className="font-semibold">{deletedChat?.title}</span>{" "}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="my-1 w-full flex-row items-end justify-end gap-3">
            <Button
              variant="secondary"
              className="w-fit rounded-full"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              disabled={isLoading}
              variant="destructive"
              className="w-fit rounded-full"
              onClick={() => {
                if (isLoading) return
                handleDelete()
              }}
            >
              {isLoading ? <Loader /> : null}
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
