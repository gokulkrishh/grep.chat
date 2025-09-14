"use server"

import { redirect } from "next/navigation"

import { v4 as uuidv4 } from "uuid"

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

export const shareChat = async (id: string) => {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("User not found")
  }

  const { data: sharedChat } = await supabase
    .from("chats")
    .select("share_token")
    .eq("id", id)
    .eq("created_by", user.id)
    .single()

  if (sharedChat?.share_token) {
    return sharedChat.share_token
  }

  const { data, error } = await supabase
    .from("chats")
    .update({
      share_token: uuidv4(),
      share_created_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("created_by", user.id)
    .select("share_token")
    .single()

  if (error) {
    throw new Error(error.message)
  }

  if (!data?.share_token) {
    throw new Error("Failed to share the chat")
  }

  return data.share_token
}

export const getSharedTokenByChatId = async (chatId: string) => {
  const supabase = await createClient()

  const { data } = await supabase
    .from("chats")
    .select("share_token")
    .eq("id", chatId)
    .not("share_token", "is", null)
    .single()

  return data?.share_token
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

export const deleteSharedChat = async (id: string) => {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("User not found")
  }

  const { data, error } = await supabase
    .from("chats")
    .update({
      share_token: null,
      share_created_at: null,
    })
    .eq("id", id)
    .eq("created_by", user.id)
    .select("id")
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data?.id
}
