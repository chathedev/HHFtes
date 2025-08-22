"use client"

import { Header } from "@/components/header"
import Footer from "@/components/footer"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Calendar, Clock, MapPin } from "lucide-react"

interface Match {
  id?: string
  date: string
  time: string
  title: string
  location?: string
  opponent?: string
  homeTeam?: string
  awayTeam?: string
}

export default function MatcherPage() {
  const [content, setContent] = useState<any>(null)
  const [contentLoading, setContentLoading] = useState(true)
  const [matches, setMatches] = useState<Match[]>([])
  const [matchesLoading, setMatchesLoading] = useState(true)
  const [matchesError, setMatchesError] = useState<string | null>(null)

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

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        console.log("[v0] Fetching matches from new API...")
        const response = await fetch("https://m-api.harnosandshf.se/matches", {
          method: "GET",
          cache: "no-store",
          headers: {
            Accept: "application/json",
          },
        })

        console.log("[v0] Response status:", response.status, "ok:", response.ok)

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        console.log("[v0] API response data:", JSON.stringify(data).substring(0, 500) + "...")

        // Expect matches field in response
        const matchesData = data.matches || []
        console.log("[v0] Matches array length:", matchesData.length)

        if (Array.isArray(matchesData)) {
          setMatches(matchesData)
        } else {
          setMatches([])
        }
      } catch (error) {
        console.error("Failed to fetch matches:", error)
        setMatchesError("Kunde inte ladda matcher från servern.")
        setMatches([])
      } finally {
        setMatchesLoading(false)
      }
    }

    fetchMatches()
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

          {matchesLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Laddar matcher...</p>
              </div>
            </div>
          ) : matchesError || matches.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-white rounded-lg shadow-md p-8 max-w-2xl mx-auto">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  {matchesError ? "Kunde inte ladda matcher" : "Inga matcher tillgängliga"}
                </h3>
                <p className="text-gray-600 mb-6">
                  {matchesError
                    ? "Det uppstod ett problem när vi försökte hämta matcherna. Försök igen senare eller använd länken nedan."
                    : "Det finns inga matcher att visa just nu. Kolla gärna Profixio för den senaste informationen."}
                </p>
                <Button
                  asChild
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-md font-semibold transition-colors"
                >
                  <a
                    href="https://www.profixio.com/app/tournaments?term=&filters[open_registration]=0&filters[kampoppsett]=0&filters[land_id]=se&filters[type]=seriespill&filters[idrett]=HB&filters[listingtype]=matches&filters[season]=765&dateTo=2026-04-30&klubbid=26031&dateFrom=2025-08-16"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Visa Matcher på Profixio
                  </a>
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {matches.map((match, index) => (
                <Card key={match.id || index} className="p-6 hover:shadow-lg transition-shadow duration-300">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{match.title}</h3>

                    <div className="space-y-2 text-sm text-gray-600">
                      {match.date && (
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-green-600" />
                          <span>{match.date}</span>
                        </div>
                      )}

                      {match.time && (
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-green-600" />
                          <span>{match.time}</span>
                        </div>
                      )}

                      {match.location && (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-green-600" />
                          <span className="line-clamp-1">{match.location}</span>
                        </div>
                      )}
                    </div>

                    {match.homeTeam && match.awayTeam && (
                      <div className="pt-2 border-t border-gray-100">
                        <div className="text-sm font-medium text-gray-700">
                          {match.homeTeam} vs {match.awayTeam}
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
