"use server"

import { createClient } from "@/lib/supabase/server"

export const ensureChat = async (id: string, title: string) => {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("User not found")
  }

  const { data: existingChat } = await supabase
    .from("chats")
    .select("id")
    .eq("id", id)
    .eq("created_by", user?.id)
    .single()

  if (existingChat) {
    return existingChat
  }

  await supabase.from("chats").insert({ id, title, created_by: user.id }).select("id").single()
}

export const deleteChat = async (id: string) => {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("User not found")
  }

  const { error } = await supabase.from("chats").delete().eq("id", id)

  if (error) {
    throw new Error(error.message)
  }
}
