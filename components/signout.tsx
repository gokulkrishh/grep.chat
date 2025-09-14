"use client"

import { createClient } from "@/lib/supabase/client"
import { cn } from "@/lib/utils"

import { LogoutIcon } from "./icons"

type Props = {
  className?: string
  onClick?: () => void
  props?: React.ButtonHTMLAttributes<HTMLButtonElement>
}

export default function SignOut({ className, ...props }: Props) {
  const signOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.reload()
  }

  return (
    <button
      type="submit"
      className={cn("flex w-full items-center gap-2", className)}
      {...props}
      onClick={signOut}
    >
      <LogoutIcon className="size-5" /> Logout
    </button>
  )
}
