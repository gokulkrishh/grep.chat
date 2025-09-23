"use client"

import { useEffect, useState } from "react"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"

import { deleteChat } from "@/actions/chat"
import { TrashIcon } from "@/components/icons"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
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
      setDeletedChatId(null)
      if (chatId) {
        router.push("/")
      }
    } finally {
      setOpen(false)
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
            "bg-sidebar-accent/70": chatId === chat.id,
          })}
          key={chat.id}
        >
          <SidebarMenuButton className="inline-flex w-full gap-0 pr-0" asChild>
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

              <Button
                className={cn(
                  `size-9 shrink-0 transition-all md:opacity-0 md:group-hover/chat-item:opacity-100 md:group-focus/chat-item:opacity-100`,
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
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete chat?</AlertDialogTitle>
            <AlertDialogDescription>
              This will delete{" "}
              <span className="text-foreground font-semibold">{deletedChat?.title}</span>{" "}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="my-1 w-full gap-3">
            <AlertDialogCancel onClick={() => setOpen(false)}>Cancel</AlertDialogCancel>

            <AlertDialogAction
              disabled={isLoading}
              variant="destructive"
              onClick={() => {
                if (isLoading) return
                handleDelete()
              }}
            >
              {isLoading ? <Loader /> : null}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
