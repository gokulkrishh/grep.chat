import Image from "next/image"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { createClient } from "@/lib/supabase/server"

import SettingsDialog from "../settings/settings-dialog"
import SignOut from "../signout"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { SidebarMenuButton } from "../ui/sidebar"
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
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton size="lg">
          <Image
            className="inline-flex size-7 shrink-0 rounded-full"
            src={user.user_metadata.avatar_url}
            alt={`${user.user_metadata.full_name} avatar`}
            width={32}
            height={32}
          />

          <div className="flex w-full flex-col truncate text-left">
            <span className="text-primary truncate text-sm font-medium">
              {user?.user_metadata.full_name}
            </span>
            <span className="text-muted-foreground min-w-40 truncate text-xs font-medium">
              {user?.email}
            </span>
          </div>
        </SidebarMenuButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="max-w-58 min-w-48" sideOffset={-2} align="end">
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-2 py-1.5 text-left text-sm">
            <Avatar className="size-6 rounded-full">
              <AvatarImage src={user.user_metadata.avatar_url} alt={user.user_metadata.full_name} />
              <AvatarFallback className="rounded-full">
                {user.user_metadata.full_name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 gap-0.5 truncate text-left text-xs leading-tight">
              <span className="truncate font-medium">{user.user_metadata.full_name}</span>
              <span className="text-muted-foreground truncate">{user.email}</span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuSub>
          <SidebarTheme />
        </DropdownMenuSub>
        <DropdownMenuItem className="flex items-center gap-2" asChild>
          <SettingsDialog />
        </DropdownMenuItem>
        <DropdownMenuItem className="flex items-center gap-2" asChild>
          <SignOut />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
