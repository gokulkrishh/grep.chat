import { Suspense } from "react"

import Link from "next/link"

import { createClient } from "@/lib/supabase/server"

import ChatShare from "./chat/chat-share"
import { GitIcon } from "./icons"
import SignIn from "./signin"
import TooltipWrapper from "./tooltip-wrapper"
import { Button } from "./ui/button"
import { SidebarTrigger } from "./ui/sidebar"

export default async function Header() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <Suspense fallback={<div />}>
      <header className="absolute top-0 z-2 mx-auto flex h-18 w-full items-center justify-between p-4 max-sm:py-3">
        {user ? (
          <TooltipWrapper delayDuration={2000} tooltip="Toggle sidebar (⌘ B)">
            <SidebarTrigger />
          </TooltipWrapper>
        ) : (
          <div />
        )}

        <div className="flex h-full max-w-fit items-center gap-4">
          <Button size="sm" className="rounded-full" asChild variant="ghost">
            <Link target="_blank" href="https://github.com/gokulkrishh/grep.chat">
              <GitIcon className="size-4.5 shrink-0" />
              <div className="flex w-full flex-col truncate text-left">
                <span className="text-primary truncate text-sm font-medium">Github</span>
              </div>
            </Link>
          </Button>
          {!user && <SignIn />}
          {user && <ChatShare />}
        </div>
      </header>
    </Suspense>
  )
}
