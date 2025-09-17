import { Suspense } from "react"

import { createClient } from "@/lib/supabase/server"

import ChatShare from "./chat/chat-share"
import SignIn from "./signin"
import TooltipWrapper from "./tooltip-wrapper"
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
          {!user && <SignIn />}
          {user && <ChatShare />}
        </div>
      </header>
    </Suspense>
  )
}
