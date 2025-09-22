"use server"

import { createClient } from "@/lib/supabase/server"

export const getChats = async () => {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return []
  }

  const { data, error } = await supabase
    .from("chats")
    .select("*")
    .eq("created_by", user.id)
    .order("updated_at", { ascending: false })

  if (error) {
    return []
  }

  return data
}

export const deleteAllChats = async () => {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("User not found")
  }

  const { error } = await supabase.from("chats").delete().eq("created_by", user.id)

  if (error) {
    throw new Error(error.message)
  }
}
