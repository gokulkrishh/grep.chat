"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { GitIcon } from "./icons"
import { Button } from "./ui/button"

export default function GithubLink() {
  const pathname = usePathname()
  const isHome = pathname === "/"

  if (!isHome) {
    return null
  }

  return (
    <Button size="sm" className="rounded-full" asChild variant="ghost" disabled={isHome}>
      <Link target="_blank" href="https://github.com/gokulkrishh/grep.chat">
        <GitIcon className="size-4.5 shrink-0" />
        <div className="flex w-full flex-col truncate text-left">
          <span className="text-primary truncate text-sm font-medium">Github</span>
        </div>
      </Link>
    </Button>
  )
}
