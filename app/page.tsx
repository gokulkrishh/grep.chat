import { v4 as uuidv4 } from "uuid"

import ChatContainer from "@/components/chat/chat-container"

export default function Home() {
  return <ChatContainer id={uuidv4()} initialMessages={[]} />
}
