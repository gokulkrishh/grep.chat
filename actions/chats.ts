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
    .order("created_at", { ascending: false })

  if (error) {
    return []
  }

  return data
}
