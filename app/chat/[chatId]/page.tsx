import { Suspense } from "react"

import { getMessagesByChatId } from "@/actions/messages"
import ChatContainer from "@/components/chat/chat-container"
import ChatSkeleton from "@/components/chat/chat-skeleton"
import Header from "@/components/header"

type ChatPageProps = {
  params: { chatId: string }
}

async function Messages({ chatId }: { chatId: string }) {
  const initialMessages = await getMessagesByChatId(chatId)

  return <ChatContainer key={chatId} id={chatId} initialMessages={initialMessages} />
}

export default async function ChatPage({ params }: ChatPageProps) {
  const { chatId } = await params

  return (
    <Suspense fallback={<ChatSkeleton key={"chatId"} />}>
      <Header />
      <Messages chatId={chatId} />
    </Suspense>
  )
}
