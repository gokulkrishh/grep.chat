"use client"

import Link from "next/link"

import { NewChatIcon, SearchIcon } from "../icons"
import {
  SidebarGroup,
  SidebarHeader,
  SidebarMenuButton,
  SidebarTrigger,
  useSidebar,
} from "../ui/sidebar"

export default function AppSidebarHeader() {
  const { isMobile } = useSidebar()

  return (
    <>
      <SidebarHeader className="flex w-full flex-row justify-between py-4 pr-2 pl-4">
        <h1 className="text-2xl font-black tracking-tight">grep</h1>
        {isMobile ? <SidebarTrigger /> : <div />}
      </SidebarHeader>
    </>
  )
}

export function SidebarHeaderActions() {
  const { isMobile, toggleSidebar } = useSidebar()

  const handleClick = () => {
    if (isMobile) {
      toggleSidebar()
    }
  }

  return (
    <SidebarGroup className="-mt-1 flex flex-col">
      <SidebarMenuButton className="flex w-full text-sm" asChild>
        <Link onClick={handleClick} className="flex w-full gap-2 text-sm" href="/">
          <NewChatIcon className="size-4.5" /> New chat
        </Link>
      </SidebarMenuButton>
      <SidebarMenuButton className="flex w-full text-sm" asChild>
        <Link onClick={handleClick} className="flex w-full gap-2 text-sm" href="/">
          <SearchIcon className="size-4.5" /> Search chats
        </Link>
      </SidebarMenuButton>
    </SidebarGroup>
  )
}
