"use client"

import { useTheme } from "next-themes"

import { CheckmarkIcon, ThemeIcon } from "@/components/icons"
import {
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

export default function SidebarTheme() {
  const { setTheme, theme } = useTheme()

  return (
    <>
      <DropdownMenuSubTrigger className="flex w-full items-center gap-2.5">
        <ThemeIcon className="text-muted-foreground size-4.5" /> Theme
      </DropdownMenuSubTrigger>
      <DropdownMenuPortal>
        <DropdownMenuSubContent sideOffset={8} className="flex min-w-40 flex-col gap-0.25">
          <DropdownMenuItem
            className={cn("text-foreground flex items-center justify-between", {
              "bg-accent": theme === "system",
            })}
            onClick={() => setTheme("system")}
          >
            System{" "}
            <CheckmarkIcon
              className={cn("text-primary size-4.5 opacity-0", {
                "opacity-100": theme === "system",
              })}
            />
          </DropdownMenuItem>
          <DropdownMenuItem
            className={cn("text-foreground flex items-center justify-between", {
              "bg-accent": theme === "light",
            })}
            onClick={() => setTheme("light")}
          >
            Light{" "}
            <CheckmarkIcon
              className={cn("text-primary size-4.5 opacity-0", {
                "opacity-100": theme === "light",
              })}
            />
          </DropdownMenuItem>
          <DropdownMenuItem
            className={cn("text-foreground flex items-center justify-between", {
              "bg-accent": theme === "dark",
            })}
            onClick={() => setTheme("dark")}
          >
            Dark{" "}
            <CheckmarkIcon
              className={cn("text-primary size-4.5 opacity-0", {
                "opacity-100": theme === "dark",
              })}
            />
          </DropdownMenuItem>
        </DropdownMenuSubContent>
      </DropdownMenuPortal>
    </>
  )
}
