import Image from "next/image"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { createClient } from "@/lib/supabase/server"

import SignOut from "../signout"
import SidebarTheme from "./sidebar-theme"

export default async function SidebarProfile() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="hover:bg-background flex gap-3 rounded-sm p-2">
        <Image
          className="inline-flex size-8 shrink-0 rounded-full"
          src={user.user_metadata.avatar_url}
          alt={`${user.user_metadata.full_name} avatar`}
          width={36}
          height={36}
        />

        <div className="flex w-full flex-col truncate text-left">
          <span className="text-primary truncate text-sm font-medium">
            {user?.user_metadata.full_name}
          </span>
          <span className="text-muted-foreground min-w-40 truncate text-xs font-medium">
            {user?.email}
          </span>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-background w-62" sideOffset={10} align="center">
        <DropdownMenuSub>
          <SidebarTheme />
        </DropdownMenuSub>
        <DropdownMenuItem className="flex items-center gap-2" asChild>
          <SignOut />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
