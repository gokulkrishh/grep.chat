import Header from "@/components/header"

export default function Home() {
  return (
    <div className="flex h-full w-full flex-col overflow-hidden">
      <Header />
      <main className="mx-auto flex h-dvh w-full flex-col items-center justify-center"></main>
    </div>
  )
}
