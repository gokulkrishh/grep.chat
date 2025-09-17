"use client"

import { useMemo, useState } from "react"
import { useHotkeys } from "react-hotkeys-hook"

import Link from "next/link"

import { useChats } from "../contexts/chats-provider"
import { ChatIcon, SearchIcon } from "../icons"
import { Button } from "../ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Input } from "../ui/input"
import { SidebarMenuBadge, SidebarMenuButton } from "../ui/sidebar"

export default function ChatSearchDialog() {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const { chats } = useChats()

  useHotkeys("meta+k", () => setOpen(true), [open])

  const filteredChats = useMemo(
    () => chats.filter((chat) => chat.title?.toLowerCase().includes(search.toLowerCase())),
    [chats, search],
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <SidebarMenuButton className="group/search-dialog flex w-full justify-between text-sm">
          <span className="flex items-center gap-2">
            <SearchIcon className="size-4.5" /> Search chats{" "}
          </span>
          <SidebarMenuBadge className="text-muted-foreground mr-2 h-3 items-center text-xs opacity-0 group-hover/search-dialog:opacity-100">
            ⌘ K
          </SidebarMenuBadge>
        </SidebarMenuButton>
      </DialogTrigger>
      <DialogContent
        className="bg-popover w-full gap-0 overflow-hidden p-0 shadow-2xl sm:max-w-2xl"
        hideOverlay
      >
        <DialogHeader className="sr-only">
          <DialogTitle />
        </DialogHeader>
        <div className="flex flex-col gap-4 border-b">
          <Input
            autoFocus
            placeholder="Search chats.."
            className="h-14 w-full rounded-none border-0 px-4 py-4 pl-5 focus-visible:ring-0"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1 p-1 py-2">
          {filteredChats.length > 0 ? (
            filteredChats.map((chat) => (
              <Button
                variant="ghost"
                className="flex w-full justify-start gap-2 text-left"
                key={chat.id}
                asChild
                size="lg"
                onClick={() => {
                  setOpen(false)
                }}
              >
                <Link href={`/chat/${chat.id}`}>
                  <ChatIcon className="size-4.5" /> {chat.title}
                </Link>
              </Button>
            ))
          ) : (
            <div className="flex flex-col gap-1 p-1 py-8 text-center">
              <p className="text-muted-foreground text-sm">No chats found</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
