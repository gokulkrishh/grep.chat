import {
  PromptInput,
  PromptInputAction,
  PromptInputActions,
  PromptInputTextarea,
} from "@/components/prompt-kit/prompt-input"

import { ArrowUpIcon, BrainIcon, CpuIcon, GlobeIcon, PaperClipIcon } from "../icons"
import { Button } from "../ui/button"
import { ChatDisclaimer } from "./chat-disclaimer"

export default function ChatSkeleton() {
  return (
    <main className="mx-auto flex h-dvh w-full flex-col items-center justify-center px-4">
      <div className="relative mx-auto flex h-full w-full flex-col gap-8 overflow-y-auto md:mt-0 md:pt-0" />

      <PromptInput className="mx-auto w-full max-w-2xl">
        <PromptInputTextarea className="vertical-scroll-fade-mask" placeholder="Ask me anything" />

        <div className="flex justify-between pt-2">
          <PromptInputActions className="justify-end">
            <PromptInputAction tooltip="Attach files">
              <Button variant={"ghost"} size="icon" className="rounded-full">
                <PaperClipIcon className="size-4" />
              </Button>
            </PromptInputAction>

            <PromptInputAction tooltip="Web search">
              <Button variant={"ghost"} size="icon" className="rounded-full">
                <GlobeIcon className="size-4" />
              </Button>
            </PromptInputAction>

            <Button variant={"ghost"} className="rounded-full">
              <BrainIcon className="size-4" />
            </Button>
            <Button variant={"ghost"} className="rounded-full">
              <CpuIcon className="size-4.5" />
            </Button>
          </PromptInputActions>

          <PromptInputActions className="justify-end">
            <Button disabled variant="default" size="icon" className="rounded-full">
              <ArrowUpIcon className="size-4" />
            </Button>
          </PromptInputActions>
        </div>
      </PromptInput>
      <ChatDisclaimer />
    </main>
  )
}
