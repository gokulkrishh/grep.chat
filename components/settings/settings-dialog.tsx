"use client"

import { useState } from "react"

import { useTheme } from "next-themes"

import { SettingsIcon, UserIcon } from "../icons"
import {
  AlertDialogContent as AlertContent,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTrigger,
  AlertDialogTitle as AlertTitle,
} from "../ui/alert-dialog"
import { Button } from "../ui/button"
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "../ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "../ui/select"
import { SidebarMenuButton } from "../ui/sidebar"
import VisuallyHidden from "../ui/visually-hidden"

type TabKey = "general" | "account"

const SettingsDialog: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>("general")
  const { theme, setTheme } = useTheme()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDeleteAccount = async () => {
    try {
      setIsDeleting(true)
      const res = await fetch("/api/account", { method: "DELETE", credentials: "include" })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data?.error || "Failed to delete account")
      }
      window.location.href = "/"
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error"
      console.log("Error deleting account", message)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <SidebarMenuButton>
          <SettingsIcon className="text-muted-foreground size-4.5!" /> Settings
        </SidebarMenuButton>
      </DialogTrigger>

      <DialogContent className="bg-sidebar border-0 p-0 sm:max-w-3xl">
        <VisuallyHidden>
          <DialogTitle>Settings</DialogTitle>
        </VisuallyHidden>
        <div className="grid min-h-54 md:min-h-96 md:grid-cols-[200px_1fr]">
          <aside className="border-r p-2 py-4">
            <nav className="flex gap-0.5 md:flex-col" aria-label="Settings navigation">
              <Button
                variant="ghost"
                aria-label="General"
                aria-current={activeTab === "general"}
                onClick={() => setActiveTab("general")}
                className="aria-current:bg-sidebar-accent aria-current:text-sidebar-accent-foreground justify-start aria-current:font-medium"
              >
                <SettingsIcon className="size-4" /> General
              </Button>

              <Button
                variant="ghost"
                aria-label="Account"
                aria-current={activeTab === "account"}
                onClick={() => setActiveTab("account")}
                className="aria-current:bg-sidebar-accent aria-current:text-sidebar-accent-foreground justify-start aria-current:font-medium"
              >
                <UserIcon className="size-4" /> Account
              </Button>
            </nav>
          </aside>

          <section className="p-4">
            {activeTab === "general" && (
              <div className="flex flex-col gap-2">
                <h2 className="text-lg font-semibold">General</h2>
                <SelectSeparator />

                <div className="mt-2 flex items-center justify-between gap-4">
                  <div className="flex min-w-0 flex-col gap-1">
                    <span className="text-sm font-medium">Theme</span>
                    <span className="text-muted-foreground text-xs">
                      Follow system or choose a theme
                    </span>
                  </div>

                  <Select
                    value={(theme as string) ?? "system"}
                    onValueChange={(value) => setTheme(value)}
                  >
                    <SelectTrigger aria-label="Theme">
                      <SelectValue placeholder="System" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="system">System</SelectItem>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {activeTab === "account" && (
              <div className="flex flex-col gap-2">
                <h2 className="text-lg font-semibold">Account</h2>
                <SelectSeparator />

                <div className="mt-2 flex items-center justify-between gap-3">
                  <p className="text-sm font-medium">Delete Account</p>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={isDeleting}
                        className="text-destructive border-destructive! hover:bg-sidebar-accent! hover:text-destructive! w-fit rounded-full bg-transparent!"
                      >
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertContent>
                      <AlertDialogHeader>
                        <AlertTitle>Delete account</AlertTitle>
                        <AlertDialogDescription>
                          This action is irreversible and will permanently delete your account and
                          all your chats.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          variant="destructive"
                          onClick={handleDeleteAccount}
                          disabled={isDeleting}
                        >
                          {isDeleting ? "Deleting..." : "Delete"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertContent>
                  </AlertDialog>
                </div>
              </div>
            )}
          </section>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default SettingsDialog
