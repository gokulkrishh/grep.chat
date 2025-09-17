"use client"

import { useMemo, useState } from "react"
import { useHotkeys } from "react-hotkeys-hook"

import { useRouter } from "next/navigation"

import { useChats } from "../contexts/chats-provider"
import { ChatIcon, SearchIcon } from "../icons"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command"
import { SidebarMenuBadge, SidebarMenuButton } from "../ui/sidebar"

export default function ChatSearchDialog() {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const { chats } = useChats()
  const router = useRouter()

  useHotkeys("meta+k", () => setOpen(true), [open])

  const filteredChats = useMemo(
    () => chats.filter((chat) => chat.title?.toLowerCase().includes(search.toLowerCase())),
    [chats, search],
  )

  return (
    <>
      <SidebarMenuButton
        className="group/search-dialog flex w-full justify-between text-sm"
        onClick={() => setOpen(true)}
      >
        <span className="flex items-center gap-2">
          <SearchIcon className="size-4.5" /> Search chats{" "}
        </span>
        <SidebarMenuBadge className="text-muted-foreground mr-2 h-3 items-center text-xs opacity-0 group-hover/search-dialog:opacity-100">
          ⌘ K
        </SidebarMenuBadge>
      </SidebarMenuButton>

      <CommandDialog open={open} onOpenChange={setOpen} className="sm:max-w-2xl" showCloseButton>
        <CommandInput
          autoFocus
          placeholder="Search chats.."
          value={search}
          onValueChange={setSearch}
        />
        <CommandList>
          <CommandEmpty>No chats found.</CommandEmpty>

          {filteredChats.length > 0 && (
            <CommandGroup heading="Chats">
              {filteredChats.map((chat) => (
                <CommandItem
                  key={chat.id}
                  value={chat.title ?? chat.id}
                  onSelect={() => {
                    setOpen(false)
                    router.push(`/chat/${chat.id}`)
                  }}
                >
                  <ChatIcon className="size-4.5" />
                  <span>{chat.title}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  )
}
