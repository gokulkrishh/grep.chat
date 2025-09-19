import { useEffect, useState } from "react"

import { User } from "@supabase/supabase-js"

import { createClient } from "@/lib/supabase/client"

export const useUser = () => {
  const supabase = createClient()
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
    }
    fetchUser()
  }, [supabase.auth])

  return { user }
}
