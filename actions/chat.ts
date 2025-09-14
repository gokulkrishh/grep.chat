"use server"

import { createClient } from "@/lib/supabase/server"

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
