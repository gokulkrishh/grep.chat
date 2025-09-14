import { UIMessage } from "ai"

import { getChatByShareToken } from "@/actions/chat"
import ChatMessagesReadonly from "@/components/chat/chat-messages-readonly"

type ChatPageProps = {
  params: { chatId: string }
}

export default async function ChatPage({ params }: ChatPageProps) {
  const { chatId } = await params
  const initialMessages = (await getChatByShareToken(chatId)) as unknown as UIMessage[]

  return <ChatMessagesReadonly messages={initialMessages} />
}
