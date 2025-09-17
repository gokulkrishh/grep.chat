import { SettingsIcon } from "../icons"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { SidebarMenuButton } from "../ui/sidebar"

export default function SettingsDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <SidebarMenuButton>
          <SettingsIcon className="text-muted-foreground size-4.5!" /> Settings
        </SidebarMenuButton>
      </DialogTrigger>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
