import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { AuthProvider } from "@/components/auth-provider"
import { Toaster } from "@/components/ui/toaster"
import { isAuthenticatedServer } from "@/app/actions/auth" // Import server-side auth check

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Härnösands HF - Handbollsklubb",
  description: "En handbollsklubb med stolthet, gemenskap och passion för sporten",
  icons: [{ rel: "icon", url: "/favicon.png", sizes: "any" }],
  generator: "v0.dev",
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const initialIsAuthenticated = await isAuthenticatedServer() // Get auth state on the server

  return (
    <html lang="sv">
      <body className={`${inter.className} bg-white`}>
        <AuthProvider initialIsAuthenticated={initialIsAuthenticated}>
          <Header />
          <main>{children}</main>
          <Footer />
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}
