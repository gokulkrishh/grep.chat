import { Suspense } from "react"

import { createClient } from "@/lib/supabase/server"

import SignIn from "./signin"
import { SidebarTrigger } from "./ui/sidebar"

export default async function Header() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <Suspense fallback={<div />}>
      <header className="absolute top-0 z-2 mx-auto flex h-fit w-full items-center justify-between p-4 max-sm:py-3">
        {user ? <SidebarTrigger /> : <div />}

        <div className="flex h-full max-w-fit items-center gap-4">{!user && <SignIn />}</div>
      </header>
    </Suspense>
  )
}
