"use server"

import { redirect } from "next/navigation"

import { UIMessage } from "ai"

import { getMessagesCache, setMessagesCache } from "@/lib/redis/cache"
import { createClient } from "@/lib/supabase/server"

export const getMessagesByChatId = async (chatId: string) => {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/")
  }

  const cachedMessages = await getMessagesCache(chatId)

  if (cachedMessages) {
    return cachedMessages
  }

  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("chat_id", chatId)
    .order("created_at", { ascending: true })

  if (error) {
    throw new Error(error.message)
  }

  const messages = (data ?? []) as unknown as UIMessage[]

  if (messages.length > 0) {
    await setMessagesCache(chatId, messages)
  }

  return messages
}
