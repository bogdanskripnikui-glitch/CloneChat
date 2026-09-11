import type { Metadata, Viewport } from "next"

import { LanguageProvider } from "@/lib/i18n"

import "./globals.css"

const publicSiteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3001")

export const metadata: Metadata = {
  metadataBase: new URL(publicSiteUrl),
  title: {
    default: "Youmanize — Write like yourself",
    template: "%s — Youmanize",
  },
  description:
    "Build a personal writing voice and create messages, posts, and replies that still sound like you.",
  applicationName: "Youmanize",
  authors: [{ name: "Skrypnyk Bohdan" }],
  creator: "Skrypnyk Bohdan",
  publisher: "Skrypnyk Bohdan",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
  openGraph: {
    title: "Youmanize — Write like yourself",
    description:
      "Build a personal writing voice and create text that still sounds like you.",
    siteName: "Youmanize",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/youmanize-social-card.png",
        width: 1200,
        height: 630,
        alt: "Youmanize — Write like yourself",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Youmanize — Write like yourself",
    description:
      "Build a personal writing voice and create text that still sounds like you.",
    images: ["/youmanize-social-card.png"],
  },
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
