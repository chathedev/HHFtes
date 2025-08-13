import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { ScrollToTop } from "@/components/scroll-to-top"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_VERCEL_URL || "http://localhost:3000"),
  title: {
    default: "Härnösands HF - Handbollsklubb",
    template: "%s | Härnösands HF",
  },
  description:
    "Härnösands Handbollsförening - En förening för alla som älskar handboll. Följ våra lag, matcher, nyheter och träningar i Härnösand.",
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
    "Västernorrland handboll",
    "Svenska handbollsförbundet",
    "Handbollslag Härnösand",
    "Ungdomsidrott",
    "Damhandboll",
    "Herrhandboll",
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
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Härnösands HF - Laget Före Allt",
      },
    ],
    locale: "sv_SE",
    type: "website",
    countryName: "Sweden",
  },
  twitter: {
    card: "summary_large_image",
    title: "Härnösands HF - Handbollsklubb",
    description:
      "Härnösands Handbollsförening – en handbollsklubb med stolthet, gemenskap och passion för sporten. Följ våra lag, nyheter och evenemang.",
    images: ["/opengraph-image.png"],
    creator: "@HarnosandsHF",
    site: "@HarnosandsHF",
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
  icons: [
    { rel: "icon", url: "/favicon.png", sizes: "any" },
    { rel: "icon", url: "/favicon.svg", type: "image/svg+xml" },
    { rel: "apple-touch-icon", url: "/apple-touch-icon.png" },
  ],
  manifest: "/manifest.json",
  alternates: {
    canonical: "https://www.harnosandshf.se",
  },
  category: "Sports",
  classification: "Handbollsklubb",
  other: {
    "google-site-verification": "your-google-verification-code", // Replace with actual verification code
    "msvalidate.01": "your-bing-verification-code", // Replace with actual verification code
  },
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="sv" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#15803d" />
        <meta name="format-detection" content="telephone=no" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SportsOrganization",
              name: "Härnösands HF",
              alternateName: "HHF",
              description: "Härnösands Handbollsförening - En förening för alla som älskar handboll",
              url: "https://www.harnosandshf.se",
              logo: "https://www.harnosandshf.se/shield-logo.png",
              image: "https://www.harnosandshf.se/opengraph-image.png",
              sport: "Handball",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Härnösand",
                addressCountry: "SE",
              },
              sameAs: ["https://www.facebook.com/harnosandshf", "https://www.instagram.com/harnosandshf"],
              foundingDate: "1970",
              memberOf: {
                "@type": "Organization",
                name: "Svenska Handbollsförbundet",
              },
            }),
          }}
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <ScrollToTop />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
