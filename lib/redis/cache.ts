import { UIMessage } from "ai"

import redis from "./client"

const CACHE_CONFIG = {
  MESSAGES_PREFIX: "chat:",
  MESSAGES_TTL: 60 * 60 * 24, // 24 hours
}

const getMessagesCacheKey = (chatId: string) => {
  return `${CACHE_CONFIG.MESSAGES_PREFIX}${chatId}`
}

export const setMessagesCache = async (chatId: string, messages: UIMessage[]) => {
  try {
    const key = getMessagesCacheKey(chatId)
    await redis.setEx(key, CACHE_CONFIG.MESSAGES_TTL, JSON.stringify(messages))
    console.log("Messages cache set successfully", key, messages.length)
  } catch (error) {
    console.error("Error setting messages cache", error)
  }
}

export const getMessagesCache = async (chatId: string) => {
  try {
    const key = getMessagesCacheKey(chatId)
    const messages = await redis.get(key)
    console.log("Messages cache get", key, messages?.length)
    return messages ? JSON.parse(messages) : []
  } catch (error) {
    console.error("Error getting messages cache", error)
    return []
  }
}

export const invalidateMessagesCache = async (chatId: string) => {
  try {
    const key = getMessagesCacheKey(chatId)
    await redis.del(key)
    console.log("Messages cache invalidated", key)
  } catch (error) {
    console.error("Error invalidating messages cache", error)
  }
}
