"use server"

import { redirect } from "next/navigation"

import { createClient } from "@/lib/supabase/server"

export const ensureChat = async (id: string, title?: string) => {
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
    return
  }

  await supabase
    .from("chats")
    .insert({ id, title: title ?? "New Chat", created_by: user.id })
    .select("id")
    .single()
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

export const getChatByShareToken = async (shareToken: string) => {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("chats")
    .select("id")
    .eq("share_token", shareToken)
    .not("share_token", "is", null)
    .not("share_created_at", "is", null)
    .single()

  if (!data?.id || error) {
    redirect("/")
  }

  const { data: messages, error: messagesError } = await supabase
    .from("messages")
    .select("*")
    .eq("chat_id", data?.id)

  if (messagesError) {
    throw new Error(messagesError.message)
  }

  return messages
}

export const getSharedChats = async () => {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("User not found")
  }

  const { data, error } = await supabase
    .from("chats")
    .select("id, title, share_created_at")
    .not("share_token", "is", null)
    .not("share_created_at", "is", null)
    .eq("created_by", user.id)

  if (error) {
    throw new Error(error.message)
  }

  return data
}
