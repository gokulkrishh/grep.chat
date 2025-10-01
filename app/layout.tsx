import { Analytics } from "@vercel/analytics/next"
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { cookies } from "next/headers"

import ChatsProvider from "@/components/contexts/chats-provider"
import { ThemeProvider } from "@/components/contexts/theme-provider"
import Header from "@/components/header"
import { AppSidebar } from "@/components/sidebar/sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { Toaster } from "@/components/ui/sonner"

import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: true,
})

export const metadata: Metadata = {
  metadataBase: new URL("https://grep.chat"),
  title: "grep.chat",
  description: "Choose your AI. Ask anything. Get answers that matter.",
  icons: [
    {
      rel: "icon",
      type: "image/svg+xml",
      media: "(prefers-color-scheme: light)",
      url: "/logo-dark.svg",
    },
    {
      rel: "icon",
      type: "image/svg+xml",
      media: "(prefers-color-scheme: dark)",
      url: "/logo-light.svg",
    },
  ],
  openGraph: {
    title: "grep.chat",
    description: "Choose your AI. Ask anything. Get answers that matter.",
    url: "https://grep.chat",
    siteName: "grep.chat",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "grep.chat - Choose your AI. Ask anything. Get answers that matter.",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "grep.chat",
    description: "Choose your AI. Ask anything. Get answers that matter.",
    images: ["/og.png"],
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
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
      <head>
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider>
          <SidebarProvider defaultOpen={defaultOpen}>
            <ChatsProvider>
              <div className="flex h-full w-full overflow-hidden">
                <AppSidebar />
                <div className="relative flex h-full w-full flex-col overflow-hidden">
                  <Header />
                  {children}
                </div>
              </div>
            </ChatsProvider>
          </SidebarProvider>
        </ThemeProvider>
        <Analytics />
        <Toaster position="top-center" />
      </body>
    </html>
  )
}
