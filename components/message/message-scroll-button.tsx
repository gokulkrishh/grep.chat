import { cn } from "@/lib/utils"

import { ScrollButton } from "../prompt-kit/scroll-button"

export default function MessageScrollButton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "absolute inset-x-0 bottom-2 z-10 mx-auto flex w-fit items-center justify-center",
        className,
      )}
      {...props}
    >
      <ScrollButton className="shrink-0" />
    </div>
  )
}
