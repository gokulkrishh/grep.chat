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

export const SidebarChats = () => {
  const router = useRouter()
  const chatId = usePathname()?.split?.("/chat/")?.[1]
  const { isMobile, toggleSidebar } = useSidebar()
  const [show, setShow] = useState<string | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(false)
  const { chats, refreshChats } = useChats()

  const handleDelete = async (id: string | undefined) => {
    if (!id) return

    try {
      setIsLoading(true)
      await deleteChat(id)
    } finally {
      setShow(undefined)
      refreshChats()
      router.push("/")
      setIsLoading(false)
    }
  }

  const deletedChat = chats?.find((c) => c.id === show)
  const currentChatData = chats?.find((c) => c.id === chatId)

  useEffect(() => {
    if (currentChatData?.title && chatId) {
      document.title = `${currentChatData?.title} - grep.chat`
    }
  }, [currentChatData, chatId])

  return (
    <div className="flex flex-col gap-0.25">
      {chats.map((chat, index) => (
        <SidebarMenuItem
          className={cn(`group/chat-item flex w-full list-none items-center rounded-md`, {
            "bg-sidebar-accent": chatId === chat.id,
          })}
          key={chat.id}
        >
          <SidebarMenuButton className="w-full truncate" asChild>
            <Link
              prefetch={index < 5}
              onClick={() => {
                if (isMobile) {
                  toggleSidebar()
                }
              }}
              href={`/chat/${chat.id}`}
            >
              <span className="flex w-full truncate pr-2">{chat.title?.slice(0, 40)}</span>

              <Button
                className={cn(`size-9! shrink-0 md:opacity-0 md:group-hover/chat-item:opacity-100`)}
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setShow(chat.id)
                }}
              >
                <TrashIcon className="size-4" />
                <span className="sr-only">Delete</span>
              </Button>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
      <AlertDialog
        open={!!show}
        onOpenChange={(open) => setShow(open ? currentChatData?.id : undefined)}
      >
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
              onClick={() => setShow(undefined)}
            >
              Cancel
            </Button>
            <Button
              disabled={isLoading}
              variant="destructive"
              className="w-fit rounded-full"
              onClick={() => {
                handleDelete(currentChatData?.id)
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
