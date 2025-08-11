import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_VERCEL_URL || "http://localhost:3000"),
  title: "Härnösands HF",
  description: "Härnösands Handbollsförening - En förening för alla som älskar handboll.",
  keywords: [
    "Härnösands HF",
    "Handboll Härnösand",
    "Handbollsklubb",
    "HHF",
    "Sport Härnösand",
    "Ungdomshandboll",
    "A-lag handboll",
    "Matcher",
    "Träningar",
    "Partners",
    "Idrottsförening",
    "Öbackahallen",
  ],
  authors: [{ name: "Härnösands HF", url: "https://www.harnosandshf.se" }],
  creator: "Härnösands HF",
  publisher: "Härnösands HF",
  openGraph: {
    title: "Härnösands HF - Handbollsklubb",
    description:
      "Härnösands Handbollsförening – en handbollsklubb med stolthet, gemenskap och passion för sporten. Följ våra lag, nyheter och evenemang.",
    url: "https://www.harnosandshf.se",
    siteName: "Härnösands HF",
    images: [
      {
        url: "/opengraph-image.png", // Reference to the dynamic OG image
        width: 1200,
        height: 630,
        alt: "Härnösands HF - Laget Före Allt",
      },
    ],
    locale: "sv_SE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Härnösands HF - Handbollsklubb",
    description:
      "Härnösands Handbollsförening – en handbollsklubb med stolthet, gemenskap och passion för sporten. Följ våra lag, nyheter och evenemang.",
    images: ["/opengraph-image.png"], // Reference to the dynamic OG image
    creator: "@HarnosandsHF", // Replace with actual Twitter handle if available
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: [{ rel: "icon", url: "/favicon.png", sizes: "any" }],
  alternates: {
    canonical: "https://www.harnosandshf.se",
  },
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
