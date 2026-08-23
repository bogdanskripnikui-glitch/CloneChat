import type { Metadata, Viewport } from "next"

import { LanguageProvider } from "@/lib/i18n"

import "./globals.css"

export const metadata: Metadata = {
  title: "Voxform — Write like yourself",
  description:
    "Teach AI your writing voice and create messages, posts, and articles that still sound like you.",
}

export const viewport: Viewport = {
  themeColor: "#f7f5f3",
  viewportFit: "cover",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="antialiased">
      <body>
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  )
}
