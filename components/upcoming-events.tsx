"use client"

import { CalendarDays, Clock, ArrowRight, Goal } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from "react"

interface Match {
  date: string // YYYY-MM-DD
  time: string // HH:MM or "Heldag"
  title: string // Match title
}

export default function UpcomingEvents() {
  const [upcomingMatches, setUpcomingMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setLoading(true)
        const now = new Date() // Use actual current date
        const fetchedMatches: Match[] = []

        // Loop over the current month and the next 5 months (total 6 months)
        for (let i = 0; i < 6; i++) {
          let currentYear = now.getFullYear()
          let currentMonth = now.getMonth() + i // 0-indexed month

          if (currentMonth > 11) {
            currentMonth -= 12
            currentYear++
          }

          const paddedMonth = (currentMonth + 1).toString().padStart(2, "0") // Convert to 1-indexed and pad
          const url = `https://www.laget.se/HarnosandsHF/Event/FilterEvents?Year=${currentYear}&Month=${paddedMonth}&PrintMode=False&SiteType=Club&Visibility=2&types=6`

          const response = await fetch(url)
          if (!response.ok) {
            console.warn(`Failed to fetch matches for ${currentYear}-${paddedMonth}: ${response.statusText}`)
            continue
          }

          const html = await response.text()
          const parser = new DOMParser()
          const doc = parser.parseFromString(html, "text/html")

          doc.querySelectorAll(".fullCalendar__day").forEach((dayElement) => {
            const dateAttribute = dayElement.getAttribute("data-day")
            if (!dateAttribute) return

            const fullDate = dateAttribute

            dayElement.querySelectorAll(".fullCalendar__list li").forEach((liElement) => {
              let time = "Okänd tid"
              let title = ""

              const timeElement = liElement.querySelector("time")
              if (timeElement) {
                time = timeElement.textContent?.trim() || "Okänd tid"
              }

              let rawTitle = liElement.textContent?.trim() || ""

              if (time !== "Okänd tid") {
                rawTitle = rawTitle.replace(time, "").trim()
              }

              if (rawTitle.includes("Heldag")) {
                time = "Heldag"
                rawTitle = rawTitle.replace(/Heldag/i, "").trim()
              }

              title = rawTitle
                .replace(/Läs mer/i, "")
                .replace(/v\.\d+/i, "")
                .replace(/\s+/g, " ")
                .trim()

              if (title) {
                fetchedMatches.push({ date: fullDate, time, title })
              }
            })
          })
        }

        // Filter out past matches and sort by date and time
        const nowDateTime = new Date()
        const filteredAndSortedMatches = fetchedMatches
          .filter((match) => {
            const matchDateTime = new Date(
              `${match.date}T${match.time.replace("Okänd tid", "00:00").replace("Heldag", "00:00")}`,
            )
            return matchDateTime >= nowDateTime
          })
          .sort((a, b) => {
            const dateTimeA = new Date(`${a.date}T${a.time.replace("Okänd tid", "00:00").replace("Heldag", "00:00")}`)
            const dateTimeB = new Date(`${b.date}T${b.time.replace("Okänd tid", "00:00").replace("Heldag", "00:00")}`)
            return dateTimeA.getTime() - dateTimeB.getTime()
          })

        setUpcomingMatches(filteredAndSortedMatches)
      } catch (e: any) {
        setError(e.message || "Failed to fetch matches.")
        console.error("Client-side fetch error:", e)
      } finally {
        setLoading(false)
      }
    }

    fetchMatches()
  }, [])

  const formatMatchDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("sv-SE", {
      weekday: "short",
      day: "numeric",
      month: "short",
    })
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <Card className="bg-white rounded-lg shadow-lg overflow-hidden max-w-2xl mx-auto">
          <CardHeader className="p-6 flex flex-col items-center text-center border-b border-gray-200">
            <Goal className="w-16 h-16 text-green-600 mb-4" />
            <CardTitle className="text-3xl font-bold text-green-600 mb-2">KOMMANDE MATCHER</CardTitle>
            <p className="text-gray-600 text-lg">Håll dig uppdaterad med våra nästa matcher!</p>
          </CardHeader>
          <CardContent className="p-6">
            {loading && <p className="text-center text-gray-600">Laddar matcher...</p>}
            {error && (
              <p className="text-center text-red-500">
                Fel: {error}. Detta kan bero på CORS-begränsningar från källwebbplatsen.
              </p>
            )}

            {!loading && !error && upcomingMatches.length === 0 && null}

            {!loading && !error && upcomingMatches.length > 0 && (
              <div className="space-y-4 mb-6">
                {upcomingMatches.slice(0, 5).map(
                  (
                    match,
                    index, // Display up to 5 matches
                  ) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-3 bg-gray-50 rounded-md border border-gray-200"
                    >
                      <div className="flex-shrink-0 text-center">
                        <CalendarDays className="w-6 h-6 text-orange-500" />
                        <span className="block text-xs text-gray-600">{formatMatchDate(match.date)}</span>
                      </div>
                      <div className="flex-grow">
                        <h4 className="font-semibold text-gray-800">{match.title}</h4>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <Clock className="w-4 h-4 mr-1" />
                          <span>{match.time}</span>
                        </div>
                      </div>
                    </div>
                  ),
                )}
              </div>
            )}

            <div className="text-center">
              <Button
                asChild
                className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-md text-lg font-semibold transition-colors"
              >
                <Link href="/matcher">
                  Visa Alla Matcher
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
