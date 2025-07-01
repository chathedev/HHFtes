"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarDays, MapPin } from "lucide-react"
import { loadContent, type MatchItem } from "@/lib/content-store"

export default function MatcherPage() {
  const [matches, setMatches] = useState<MatchItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMatches = async () => {
      setLoading(true)
      setError(null)
      try {
        // Fetch from API
        const apiRes = await fetch("/api/kalender-events", { cache: "no-store" })
        let apiMatches: MatchItem[] = []
        if (apiRes.ok) {
          apiMatches = (await apiRes.json()) as MatchItem[]
        } else {
          console.warn(`Failed to fetch matches from API: ${apiRes.status} ${apiRes.statusText}`)
          setError("Kunde inte ladda matcher från servern. Visar endast statiska matcher.")
        }

        // Load static content (which now includes matches from content-store.ts)
        const staticContent = await loadContent()
        const staticMatches = staticContent.matches || []

        // Combine and deduplicate matches if necessary (e.g., by ID or unique properties)
        // For simplicity, we'll just combine them here. You might want more sophisticated deduplication.
        const combinedMatches = [...apiMatches, ...staticMatches].filter(
          (match, index, self) => index === self.findIndex((m) => m.id === match.id),
        )

        setMatches(combinedMatches)
      } catch (err) {
        console.error("Error fetching matches:", err)
        setError("Ett oväntat fel uppstod vid laddning av matcher.")
        // Still try to load static content if API fails completely
        try {
          const staticContent = await loadContent()
          setMatches(staticContent.matches || [])
        } catch (staticErr) {
          console.error("Failed to load static matches as fallback:", staticErr)
          setMatches([])
        }
      } finally {
        setLoading(false)
      }
    }

    fetchMatches()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Laddar matcher...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-10 text-green-700">Kommande Matcher</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
          <strong className="font-bold">Fel!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}

      {matches.length === 0 ? (
        <div className="text-center text-gray-600 text-lg">Inga kommande matcher planerade för tillfället.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {matches.map((match) => (
            <Card key={match.id} className="flex flex-col">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold text-center">
                  {match.homeTeam} vs {match.awayTeam}
                </CardTitle>
                <p className="text-sm text-gray-500 text-center">{match.league}</p>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-between">
                <div className="flex items-center justify-around my-4">
                  <div className="flex flex-col items-center">
                    {match.homeLogo && (
                      <Image
                        src={match.homeLogo || "/placeholder.svg"}
                        alt={match.homeTeam}
                        width={60}
                        height={60}
                        className="mb-2"
                      />
                    )}
                    <span className="font-medium">{match.homeTeam}</span>
                  </div>
                  <span className="text-2xl font-bold mx-4">-</span>
                  <div className="flex flex-col items-center">
                    {match.awayLogo && (
                      <Image
                        src={match.awayLogo || "/placeholder.svg"}
                        alt={match.awayTeam}
                        width={60}
                        height={60}
                        className="mb-2"
                      />
                    )}
                    <span className="font-medium">{match.awayTeam}</span>
                  </div>
                </div>
                {match.result && (
                  <div className="text-center text-xl font-bold text-green-600 mb-4">Resultat: {match.result}</div>
                )}
                <div className="flex items-center text-sm text-gray-600 mt-auto">
                  <CalendarDays className="h-4 w-4 mr-2" />
                  <span>
                    {match.date} kl {match.time}
                  </span>
                </div>
                <div className="flex items-center text-sm text-gray-600 mt-2">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>{match.location}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
