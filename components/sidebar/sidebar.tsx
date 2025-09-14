import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
} from "@/components/ui/sidebar"
import { createClient } from "@/lib/supabase/server"

import { SidebarChats } from "./sidebar-chats"
import AppSidebarHeader, { SidebarHeaderActions } from "./sidebar-header"
import SidebarProfile from "./sidebar-profile"

export async function AppSidebar() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  return (
    <Sidebar>
      <AppSidebarHeader />
      <SidebarContent>
        <SidebarHeaderActions />
        <SidebarGroup>
          <SidebarGroupLabel>Chats</SidebarGroupLabel>
          <SidebarChats />
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarProfile />
      </SidebarFooter>
    </Sidebar>
  )
}
