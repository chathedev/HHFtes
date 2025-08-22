"use client"

import { Header } from "@/components/header"
import Footer from "@/components/footer"
import { useEffect, useState } from "react"

export default function MatcherPage() {
  const [content, setContent] = useState<any>(null)
  const [contentLoading, setContentLoading] = useState(true)

  // Load static content from JSON
  useEffect(() => {
    const loadContent = async () => {
      try {
        const response = await fetch("/content/matcher.json")
        if (response.ok) {
          const data = await response.json()
          setContent(data)
        } else {
          setContent(getDefaultContent())
        }
      } catch (error) {
        console.error("Failed to load content:", error)
        setContent(getDefaultContent())
      } finally {
        setContentLoading(false)
      }
    }

    loadContent()
  }, [])

  const getDefaultContent = () => ({
    pageTitle: "Kommande Matcher",
    pageDescription: "Se alla kommande matcher för Härnösands HF",
  })

  if (contentLoading) {
    return (
      <>
        <Header />
        <main className="flex-1 bg-gray-50">
          <div className="h-24"></div>
          <div className="container px-4 md:px-6 py-12 md:py-16 lg:py-20">
            <div className="flex items-center justify-center py-8">
              <p className="text-gray-600">Laddar sida...</p>
            </div>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  if (!content) {
    return (
      <>
        <Header />
        <main className="flex-1 bg-gray-50">
          <div className="h-24"></div>
          <div className="container px-4 md:px-6 py-12 md:py-16 lg:py-20">
            <div className="flex items-center justify-center py-8">
              <p className="text-red-600">Kunde inte ladda sida. Försök igen senare.</p>
            </div>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="flex-1 bg-gray-50">
        <div className="h-24"></div>
        <div className="container px-4 md:px-6 py-12 md:py-16 lg:py-20">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-8 text-center text-green-700">
            {content?.pageTitle || "Kommande Matcher"}
          </h1>

          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="relative w-full" style={{ height: "800px" }}>
              <iframe
                src="https://www.profixio.com/app/tournaments?term=&filters[open_registration]=0&filters[kampoppsett]=0&filters[land_id]=se&filters[type]=seriespill&filters[idrett]=HB&filters[listingtype]=matches&filters[season]=765&dateTo=2026-04-30&klubbid=26031&dateFrom=2025-08-16"
                className="absolute inset-0 w-full h-full border-0"
                style={{
                  transform: "scale(1)",
                  transformOrigin: "top left",
                  marginTop: "-100px", // Crop top navigation
                  height: "calc(100% + 200px)", // Extend height to compensate for cropping
                }}
                title="Härnösands HF Matcher"
                loading="lazy"
                sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
              />
            </div>

            {/* Fallback link in case iframe doesn't load */}
            <div className="p-4 text-center bg-gray-50 border-t">
              <p className="text-sm text-gray-600 mb-2">Har du problem att se matcherna?</p>
              <a
                href="https://www.profixio.com/app/tournaments?term=&filters[open_registration]=0&filters[kampoppsett]=0&filters[land_id]=se&filters[type]=seriespill&filters[idrett]=HB&filters[listingtype]=matches&filters[season]=765&dateTo=2026-04-30&klubbid=26031&dateFrom=2025-08-16"
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-600 hover:text-green-700 underline font-medium"
              >
                Öppna i nytt fönster
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
