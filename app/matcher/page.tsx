"use client"

import Link from "next/link"
import { ChevronLeft, CalendarDays, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState, useMemo } from "react"

interface Match {
  date: string // YYYY-MM-DD
  time: string // HH:MM or "Heldag"
  title: string // Match title
}

interface GroupedMatches {
  [monthYear: string]: Match[] // e.g., "April 2025": [...]
}

export default function MatcherPage() {
  const [allMatches, setAllMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setLoading(true)
        // Use the actual current date for dynamic fetching
        const now = new Date()
        const fetchedMatches: Match[] = []

        // Loop over the current month and the next 5 months (total 6 months)
        for (let i = 0; i < 6; i++) {
          let currentYear = now.getFullYear()
          let currentMonth = now.getMonth() + i // 0-indexed month

          // Adjust year and month if we go past December
          if (currentMonth > 11) {
            currentMonth -= 12
            currentYear++
          }

          const paddedMonth = (currentMonth + 1).toString().padStart(2, "0") // Convert to 1-indexed and pad
          const url = `https://www.laget.se/HarnosandsHF/Event/FilterEvents?Year=${currentYear}&Month=${paddedMonth}&PrintMode=False&SiteType=Club&Visibility=2&types=6`

          const response = await fetch(url)
          if (!response.ok) {
            console.warn(`Failed to fetch matches for ${currentYear}-${paddedMonth}: ${response.statusText}`)
            continue // Continue to next month even if one fails
          }

          const html = await response.text()
          const parser = new DOMParser()
          const doc = parser.parseFromString(html, "text/html")

          doc.querySelectorAll(".fullCalendar__day").forEach((dayElement) => {
            const dateAttribute = dayElement.getAttribute("data-day")
            if (!dateAttribute) return

            // The date from data-day is already YYYY-MM-DD
            const fullDate = dateAttribute

            dayElement.querySelectorAll(".fullCalendar__list li").forEach((liElement) => {
              let time = "Okänd tid"
              let title = ""

              const timeElement = liElement.querySelector("time")
              if (timeElement) {
                time = timeElement.textContent?.trim() || "Okänd tid"
              }

              // Get all text content of the li, then clean it up
              let rawTitle = liElement.textContent?.trim() || ""

              // Remove the time string if present
              if (time !== "Okänd tid") {
                rawTitle = rawTitle.replace(time, "").trim()
              }

              // Check for "Heldag" and clean up
              if (rawTitle.includes("Heldag")) {
                time = "Heldag"
                rawTitle = rawTitle.replace(/Heldag/i, "").trim()
              }

              // Remove common unwanted strings like "Läs mer" and week numbers (e.g., "v.14")
              title = rawTitle
                .replace(/Läs mer/i, "")
                .replace(/v\.\d+/i, "")
                .replace(/\s+/g, " ") // Replace multiple spaces with single space
                .trim()

              if (title) {
                fetchedMatches.push({ date: fullDate, time, title })
              }
            })
          })
        }

        // Sort all matches by date and time
        fetchedMatches.sort((a, b) => {
          const dateTimeA = new Date(`${a.date}T${a.time.replace("Okänd tid", "00:00").replace("Heldag", "00:00")}`)
          const dateTimeB = new Date(`${b.date}T${b.time.replace("Okänd tid", "00:00").replace("Heldag", "00:00")}`)
          return dateTimeA.getTime() - dateTimeB.getTime()
        })

        setAllMatches(fetchedMatches)
      } catch (e: any) {
        setError(e.message || "Failed to fetch matches.")
        console.error("Client-side fetch error:", e)
      } finally {
        setLoading(false)
      }
    }

    fetchMatches()
  }, [])

  const groupedMatches = useMemo(() => {
    const grouped: GroupedMatches = allMatches.reduce((acc, match) => {
      const matchDate = new Date(match.date)
      const monthYearKey = matchDate.toLocaleDateString("sv-SE", { year: "numeric", month: "long" })
      if (!acc[monthYearKey]) {
        acc[monthYearKey] = []
      }
      acc[monthYearKey].push(match)
      return acc
    }, {} as GroupedMatches)

    // Sort months chronologically
    const sortedGrouped: GroupedMatches = Object.keys(grouped)
      .sort((a, b) => {
        const parseMonthYear = (str: string) => {
          const [monthName, year] = str.split(" ")
          // Create a dummy date to get the month index (e.g., "Juli 1, 2000")
          const monthIndex = new Date(Date.parse(monthName + " 1, 2000")).getMonth()
          return new Date(Number(year), monthIndex, 1)
        }
        return parseMonthYear(a).getTime() - parseMonthYear(b).getTime()
      })
      .reduce((obj, key) => {
        obj[key] = grouped[key].sort((a, b) => {
          const dateTimeA = new Date(`${a.date}T${a.time.replace("Okänd tid", "00:00").replace("Heldag", "00:00")}`)
          const dateTimeB = new Date(`${b.date}T${b.time.replace("Okänd tid", "00:00").replace("Heldag", "00:00")}`)
          return dateTimeA.getTime() - dateTimeB.getTime()
        })
        return obj
      }, {} as GroupedMatches)

    return sortedGrouped
  }, [allMatches])

  const formatMatchDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("sv-SE", { day: "numeric", month: "short" })
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <main className="flex-1 py-8 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <Link href="/" className="inline-flex items-center text-green-700 hover:underline mb-8">
          <ChevronLeft className="w-4 h-4 mr-2" />
          Tillbaka till startsidan
        </Link>

        <h1 className="text-5xl font-bold text-green-700 mb-4 text-center">Kommande Matcher</h1>
        <p className="text-xl text-gray-700 mb-12 text-center max-w-3xl mx-auto">
          Här hittar du alla kommande matcher för Härnösands HF.
        </p>

        {loading && <p className="text-center text-gray-600">Laddar matcher...</p>}
        {error && (
          <p className="text-center text-red-500">
            Fel: {error}. Detta kan bero på CORS-begränsningar från källwebbplatsen när du försöker hämta data direkt
            från webbläsaren.
          </p>
        )}

        {!loading && !error && Object.keys(groupedMatches).length === 0 && (
          <p className="text-center text-gray-600">Inga matcher planerade.</p>
        )}

        {!loading && !error && (
          <div className="space-y-12">
            {Object.entries(groupedMatches).map(([monthYear, matches]) => (
              <section key={monthYear}>
                <h2 className="text-4xl font-bold text-orange-500 mb-8 text-center md:text-left">{monthYear}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {matches.map((match) => (
                    <Card
                      key={match.date + match.time + match.title} // Unique key for matches
                      className="bg-white/80 shadow-lg rounded-lg flex flex-col"
                    >
                      <CardHeader>
                        <CardTitle className="text-xl font-semibold text-gray-800 mb-2">{match.title}</CardTitle>
                        <div className="flex items-center text-sm text-gray-500">
                          <CalendarDays className="w-4 h-4 mr-1" />
                          <span>{formatMatchDate(match.date)}</span>
                          <Clock className="w-4 h-4 ml-4 mr-1" />
                          <span>{match.time}</span>
                        </div>
                      </CardHeader>
                      <CardContent className="flex-grow flex flex-col justify-between">
                        {/* No separate description field as per new API format */}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
