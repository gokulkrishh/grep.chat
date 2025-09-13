import Link from "next/link"

import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="relative mx-auto flex h-[calc(100vh-4rem)] w-full flex-col">
      <main className="mx-auto flex h-full w-full max-w-3xl flex-col justify-center gap-4 px-6">
        <div className="flex w-full flex-col gap-3">
          <h2 className="w-full text-2xl font-bold tracking-tight transition-all">
            Page not found
          </h2>
          <p className="text-muted-foreground text-pretty">Unable to find the requested page.</p>
          <Button className="mt-2 w-fit" asChild>
            <Link href="/">Home</Link>
          </Button>
        </div>
      </main>
    </div>
  )
}
