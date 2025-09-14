import { NextResponse } from "next/server"

import { createOpenRouter } from "@openrouter/ai-sdk-provider"
import {
  UIMessage,
  convertToModelMessages,
  smoothStream,
  stepCountIs,
  streamText,
  validateUIMessages,
} from "ai"
import { v4 as uuidv4 } from "uuid"

import { ensureChat } from "@/actions/chat"
import { systemPrompt } from "@/data/prompt"
import { Reasoning, autoModel } from "@/hooks/use-chat"
import { invalidateMessagesCache } from "@/lib/redis/cache"
import { createClient } from "@/lib/supabase/server"
import { Database, Json } from "@/supabase/database.types"

export const maxDuration = 300

const MAX_MESSAGES_FOR_CONTEXT = 20

const openrouterApiKey = process.env.OPENROUTER_API_KEY

if (!openrouterApiKey) {
  throw new Error("Missing OPENROUTER_API_KEY environment variable")
}

const openrouter = createOpenRouter({ apiKey: openrouterApiKey! })

type Metadata = {
  usage: {
    inputTokens: number
    outputTokens: number
    totalTokens: number
    reasoningTokens: number
    cachedInputTokens: number
  }
  finished: number
  started: number
  duration: number
  reasoningEnd: number
  reasoningStart: number
}

type RequestBody = {
  message: UIMessage
  id: Database["public"]["Tables"]["chats"]["Row"]["id"]
  trigger: "submit-message" | "regenerate-message"
  model: string
  reasoning: Reasoning
  webSearch: boolean
  messageIdToDelete?: string
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const {
      message,
      id: chatId,
      trigger,
      model,
      reasoning,
      webSearch,
      messageIdToDelete,
    }: RequestBody = await request.json()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 401 })
    }

    if (!chatId) {
      return NextResponse.json({ error: "chatId is missing" }, { status: 400 })
    }

    // Ensure chat exists or new chat is created with a title
    const title = message.parts[0].type === "text" ? message.parts[0].text : ""
    await ensureChat(chatId, title)

    if (trigger === "regenerate-message") {
      if (!messageIdToDelete) {
        return NextResponse.json({ error: "messageIdToDelete is missing" }, { status: 400 })
      }

      const { error: deleteError } = await supabase
        .from("messages")
        .delete()
        .eq("id", messageIdToDelete)
        .eq("chat_id", chatId)

      if (deleteError) {
        throw new Error(deleteError.message)
      }

      await invalidateMessagesCache(chatId)
    }

    const { data: previousMessages, error: selectError } = await supabase
      .from("messages")
      .select("*")
      .eq("chat_id", chatId)
      .order("created_at", { ascending: false })

    if (selectError) {
      throw new Error(selectError.message)
    }

    if (trigger === "submit-message") {
      const { error: insertError } = await supabase.from("messages").insert({
        chat_id: chatId,
        user_id: user.id,
        model,
        role: "user",
        parts: message.parts as Json,
      })

      if (insertError) {
        throw new Error(insertError.message)
      }

      await invalidateMessagesCache(chatId)
    }

    const validatedMessages = await validateUIMessages({
      messages: [...(previousMessages ?? []), message],
    })

    const originalMessages = validatedMessages.slice(-MAX_MESSAGES_FOR_CONTEXT)

    const started = Date.now()

    const result = streamText({
      model: openrouter.chat(model ?? autoModel, {
        ...(reasoning && { reasoning: { enabled: true, effort: reasoning } }),
        ...(webSearch && {
          plugins: [
            { id: "web", max_results: { high: 5, medium: 3, low: 1 }[reasoning ?? "low"] ?? 1 },
          ],
        }),
      }),
      experimental_transform: smoothStream({ chunking: "word" }),
      system: systemPrompt,
      stopWhen: stepCountIs(5),
      messages: convertToModelMessages(originalMessages),
      onError: (error) => {
        console.error("Error communicating with AI", error)
      },
    })

    return result.toUIMessageStreamResponse({
      sendSources: true,
      sendReasoning: true,
      generateMessageId: () => uuidv4(),
      onFinish: async ({ messages }) => {
        const lastMessage = messages.at(-1)

        if (!lastMessage) {
          throw new Error("Last message is missing")
        }

        const metadata = lastMessage?.metadata as Metadata

        const { error } = await supabase.from("messages").insert({
          id: lastMessage.id,
          chat_id: chatId,
          user_id: user.id,
          model,
          role: "assistant",
          parts: lastMessage?.parts as Json,
          metadata: {
            finished: metadata?.finished ?? 0,
            started: metadata?.started ?? 0,
            reasoningStart: metadata?.reasoningStart ?? 0,
            reasoningEnd: metadata?.reasoningEnd ?? 0,
            usage: metadata?.usage ?? {},
          } as Json,
        })

        if (error) {
          throw new Error(error.message)
        }

        await invalidateMessagesCache(chatId)
      },
      messageMetadata: ({ part }) => {
        if (part.type === "start") {
          return { ...part, started }
        }

        if (part.type === "reasoning-start") {
          return { reasoningStart: Date.now() }
        }

        if (part.type === "reasoning-end") {
          return { reasoningEnd: Date.now() }
        }

        if (part.type === "finish") {
          return { finished: Date.now() }
        }

        return { ...part }
      },
    })
  } catch (error) {
    console.error("error", error)
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred"
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
