"use client"

import { useState } from "react"

import { useRouter } from "next/navigation"

import { createClient } from "@/lib/supabase/client"

import { GoogleIcon } from "./icons"
import { Loader } from "./loader"
import { Button } from "./ui/button"

export const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.NEXT_PUBLIC_VERCEL_URL
    ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
    : "http://localhost:3000")

export default function SignIn() {
  const supabase = createClient()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleSignIn = async () => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${baseUrl}/auth/callback`,
          queryParams: {
            prompt: "select_account",
          },
        },
      })

      if (error) {
        router.push(`/auth/error?error=${error.message}`)
      }
    } catch (error) {
      console.error(error)
    }
  }
  return (
    <Button className="gap-2 rounded-full" onClick={handleSignIn}>
      {loading ? <Loader /> : <GoogleIcon className="size-4 shrink-0" />}
      <span className="text-sm font-medium">Sign In</span>
    </Button>
  )
}
