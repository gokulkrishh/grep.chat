"use client"

import { createContext, useCallback, useContext, useEffect, useState } from "react"

import { createClient } from "@/lib/supabase/client"
import { Database } from "@/supabase/database.types"

type Chats = Database["public"]["Tables"]["chats"]["Row"][]

type Context = {
  chats: Chats
  setChats: (chats: Chats) => void
  refreshChats: () => void
}

const ChatsContext = createContext<Context>({
  chats: [],
  setChats: () => {},
  refreshChats: () => {},
})

const ChatsProvider = ({ children }: { children: React.ReactNode }) => {
  const [chats, setChats] = useState<Chats>([])

  const fetchChats = useCallback(async () => {
    const supabase = createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return
    }

    const { data: chats } = await supabase
      .from("chats")
      .select("id,title,created_at")
      .eq("created_by", user.id)
      .order("created_at", { ascending: false })

    setChats((chats ?? []) as unknown as Chats)
  }, [])

  useEffect(() => {
    fetchChats()
  }, [fetchChats])

  return (
    <ChatsContext.Provider value={{ chats, setChats, refreshChats: fetchChats }}>
      {children}
    </ChatsContext.Provider>
  )
}

export default ChatsProvider

export const useChats = () => {
  const context = useContext(ChatsContext)

  if (!context) {
    throw new Error("useChats must be used within a ChatsProvider")
  }

  return context
}
