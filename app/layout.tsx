import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { AuthProvider } from "@/components/auth-provider" // Import AuthProvider
import { Toaster } from "@/components/ui/toaster" // Import Toaster
import { headers } from "next/headers" // Import headers to check pathname

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Härnösands HF - Handbollsklubb",
  description: "En handbollsklubb med stolthet, gemenskap och passion för sporten",
  icons: [{ rel: "icon", url: "/favicon.png", sizes: "any" }],
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const headerList = headers()
  const pathname = headerList.get("x-pathname") || "/"
  const isEditor = pathname === "/editor"

  return (
    <html lang="sv">
      <body className={`${inter.className} bg-white`}>
        <AuthProvider>
          <Header isEditor={isEditor} /> {/* Pass isEditor prop to Header */}
          <main>{children}</main>
          <Footer />
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}
