import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { cookies } from "next/headers"

import ChatsProvider from "@/components/contexts/chats-provider"
import { ThemeProvider } from "@/components/contexts/theme-provider"
import { AppSidebar } from "@/components/sidebar/sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"

import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "grep.chat",
  description: "Choose your AI. Ask anything. Get answers that matter.",
  icons: [
    {
      rel: "icon",
      type: "image/svg+xml",
      media: "(prefers-color-scheme: light)",
      url: "/favicon-light.svg",
    },
    {
      rel: "icon",
      type: "image/svg+xml",
      media: "(prefers-color-scheme: dark)",
      url: "/favicon-dark.svg",
    },
  ],
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const cookieStore = await cookies()
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true"

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider>
          <SidebarProvider defaultOpen={defaultOpen}>
            <ChatsProvider>
              <div className="flex h-dvh w-full">
                <AppSidebar />
                {children}
              </div>
            </ChatsProvider>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
