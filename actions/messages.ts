"use server"

import { redirect } from "next/navigation"

import { UIMessage } from "ai"

import { createClient } from "@/lib/supabase/server"

export const getMessagesByChatId = async (chatId: string) => {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/")
  }

  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("chat_id", chatId)
    .order("created_at", { ascending: true })

  if (error) {
    throw new Error(error.message)
  }

  const messages = data ?? []

  return messages as unknown as UIMessage[]
}
