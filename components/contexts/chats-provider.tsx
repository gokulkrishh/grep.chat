"use client"

import { createContext, useCallback, useContext, useEffect, useState } from "react"

import { getChats } from "@/actions/chats"
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
  const supabase = createClient()
  const [chats, setChats] = useState<Chats>([])
  const user = supabase.auth.getUser()

  const fetchChats = useCallback(async () => {
    if (!user) {
      return
    }

    const chats = await getChats()

    setChats(chats)
  }, [user])

  useEffect(() => {
    if (!chats.length) {
      fetchChats()
    }
  }, [chats.length, fetchChats])

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
