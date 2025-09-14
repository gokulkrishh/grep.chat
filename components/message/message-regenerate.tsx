import { RotateIcon } from "../icons"
import { MessageAction } from "../prompt-kit/message"
import { Button } from "../ui/button"

export default function MessageRegenerate({ onClick }: { onClick: () => void }) {
  return (
    <MessageAction tooltip="Regenerate">
      <Button variant="ghost" size="icon" onClick={onClick}>
        <RotateIcon className="size-5" />
      </Button>
    </MessageAction>
  )
}
