"use client"

import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { useEffect, useState, useMemo } from "react"
import { MatchCard } from "@/components/match-cards"

interface Match {
  id: string
  date: string // YYYY-MM-DD
  time: string // HH:MM
  homeTeam: string
  awayTeam: string
  homeScore: number | null
  awayScore: number | null
  status: string // "finished" or "upcoming"
  location: string
  title?: string // Added for scraped events
}

interface GroupedMatches {
  [monthYear: string]: Match[]
}

export default function MatchesPage() {
  const [fetchedMatches, setFetchedMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const staticMatches: Match[] = [
    {
      id: "static-1",
      date: "2024-03-10",
      time: "14:00",
      homeTeam: "Härnösands HF",
      awayTeam: "Sundsvall HK",
      homeScore: 28,
      awayScore: 25,
      status: "finished",
      location: "Härnösands Sporthall",
      title: "Härnösands HF vs. Sundsvall HK",
    },
    {
      id: "static-2",
      date: "2024-03-15",
      time: "18:30",
      homeTeam: "Östersunds HK",
      awayTeam: "Härnösands HF",
      homeScore: null,
      awayScore: null,
      status: "upcoming",
      location: "Östersund Arena",
      title: "Östersunds HK vs. Härnösands HF",
    },
    {
      id: "static-3",
      date: "2024-03-22",
      time: "19:00",
      homeTeam: "Härnösands HF",
      awayTeam: "Umeå IK",
      homeScore: null,
      awayScore: null,
      status: "upcoming",
      location: "Härnösands Sporthall",
      title: "Härnösands HF vs. Umeå IK",
    },
    {
      id: "static-4",
      date: "2024-03-03",
      time: "16:00",
      homeTeam: "Luleå HF",
      awayTeam: "Härnösands HF",
      homeScore: 30,
      awayScore: 29,
      status: "finished",
      location: "Luleå Energi Arena",
      title: "Luleå HF vs. Härnösands HF",
    },
  ]

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setLoading(true)
        const startDate = new Date()
        const tempFetchedMatches: Match[] = []

        // Fetch for current month + next 3 months
        for (let i = 0; i < 4; i++) {
          let year = startDate.getFullYear()
          let month = startDate.getMonth() + i
          if (month > 11) {
            month -= 12
            year++
          }

          const paddedMonth = (month + 1).toString().padStart(2, "0")
          const url = `https://www.laget.se/HarnosandsHF/Event/FilterEvents?Year=${year}&Month=${paddedMonth}&PrintMode=False&SiteType=Club&Visibility=2&types=6`

          const response = await fetch(url)
          if (!response.ok) {
            console.warn(`Failed to fetch matches for ${year}-${paddedMonth}: ${response.statusText}`)
            continue
          }

          const html = await response.text()
          const parser = new DOMParser()
          const doc = parser.parseFromString(html, "text/html")

          doc.querySelectorAll(".fullCalendar__day").forEach((dayElement) => {
            const dateAttribute = dayElement.getAttribute("data-day")
            if (!dateAttribute) return

            const fullDate = `${year}-${paddedMonth}-${dateAttribute.padStart(2, "0")}`

            dayElement.querySelectorAll(".fullCalendar__list li").forEach((liElement) => {
              const textContent = liElement.textContent?.toLowerCase() || ""
              if (textContent.includes("träning")) return // Skip training events

              let time = "Okänd tid"
              let title = ""

              const timeElement = liElement.querySelector("time")
              if (timeElement) {
                time = timeElement.textContent?.trim() || "Okänd tid"
              }

              let rawTitle = liElement.textContent?.trim() || ""

              if (rawTitle.includes("Heldag")) {
                time = "Heldag"
                rawTitle = rawTitle.replace(/Heldag/i, "").trim()
              }

              if (time === "Okänd tid") {
                const timeRegex = /\b(\d{2}:\d{2})\b/g
                const foundTimes: string[] = []
                let match
                while ((match = timeRegex.exec(rawTitle)) !== null) {
                  foundTimes.push(match[1])
                }

                if (foundTimes.length >= 2) {
                  time = `${foundTimes[0]} - ${foundTimes[foundTimes.length - 1]}`
                  rawTitle = rawTitle
                    .replace(foundTimes[0], "")
                    .replace(foundTimes[foundTimes.length - 1], "")
                    .trim()
                } else if (foundTimes.length === 1) {
                  time = foundTimes[0]
                  rawTitle = rawTitle.replace(foundTimes[0], "").trim()
                }
              }

              title = rawTitle
                .replace(/Läs mer/i, "")
                .replace(/v\.\d+/i, "")
                .replace(/\s+/g, " ")
                .trim()

              if (title) {
                tempFetchedMatches.push({
                  id: `scraped-${fullDate}-${time}-${title.replace(/\s/g, "-")}`, // Unique ID
                  date: fullDate,
                  time,
                  homeTeam: "", // Scraped data doesn't easily provide this
                  awayTeam: "", // Scraped data doesn't easily provide this
                  homeScore: null,
                  awayScore: null,
                  status: "upcoming", // Assume scraped are upcoming unless parsed otherwise
                  location: "Okänd plats", // Scraped data doesn't easily provide this
                  title: title, // Store the full title
                })
              }
            })
          })
        }

        const now = new Date()
        const filteredAndSortedMatches = tempFetchedMatches
          .filter((match) => {
            if (match.time === "Heldag") {
              const dateOnly = new Date(match.date)
              return dateOnly >= new Date(now.getFullYear(), now.getMonth(), now.getDate())
            }
            const dateTime = new Date(`${match.date}T${match.time.split(" ")[0].replace("Okänd tid", "00:00")}`)
            return dateTime >= now
          })
          .sort((a, b) => {
            const dateA = new Date(
              `${a.date}T${a.time.split(" ")[0].replace("Okänd tid", "00:00").replace("Heldag", "00:00")}`,
            )
            const dateB = new Date(
              `${b.date}T${b.time.split(" ")[0].replace("Okänd tid", "00:00").replace("Heldag", "00:00")}`,
            )
            return dateA.getTime() - dateB.getTime()
          })

        setFetchedMatches(filteredAndSortedMatches)
      } catch (e: any) {
        setError(e.message || "Failed to fetch matches.")
        console.error(e)
      } finally {
        setLoading(false)
      }
    }

    fetchMatches()
  }, [])

  const allMatchesCombined = useMemo(() => {
    // Combine fetched and static matches, ensuring uniqueness by ID
    const combined = [...fetchedMatches, ...staticMatches]
    const uniqueMatches = Array.from(new Map(combined.map((match) => [match.id, match])).values())

    // Sort all matches by date and time
    return uniqueMatches.sort((a, b) => {
      const dateA = new Date(
        `${a.date}T${a.time.split(" ")[0].replace("Okänd tid", "00:00").replace("Heldag", "00:00")}`,
      )
      const dateB = new Date(
        `${b.date}T${b.time.split(" ")[0].replace("Okänd tid", "00:00").replace("Heldag", "00:00")}`,
      )
      return dateA.getTime() - dateB.getTime()
    })
  }, [fetchedMatches, staticMatches])

  const groupedMatches = useMemo(() => {
    const grouped: GroupedMatches = allMatchesCombined.reduce((acc, match) => {
      const matchDate = new Date(match.date)
      const monthYearKey = matchDate.toLocaleDateString("sv-SE", { year: "numeric", month: "long" })
      if (!acc[monthYearKey]) acc[monthYearKey] = []
      acc[monthYearKey].push(match)
      return acc
    }, {} as GroupedMatches)

    return Object.keys(grouped)
      .sort((a, b) => {
        const parseMonthYear = (str: string) => {
          const [monthName, year] = str.split(" ")
          const monthIndex = new Date(Date.parse(`${monthName} 1, 2000`)).getMonth()
          return new Date(Number(year), monthIndex, 1)
        }
        return parseMonthYear(a).getTime() - parseMonthYear(b).getTime()
      })
      .reduce((sorted, key) => {
        sorted[key] = grouped[key]
        return sorted
      }, {} as GroupedMatches)
  }, [allMatchesCombined])

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
            från webbläsaren. Visar statiska matcher istället.
          </p>
        )}

        {!loading && allMatchesCombined.length === 0 && (
          <p className="text-center text-gray-600">Inga matcher planerade för tillfället.</p>
        )}

        {!loading && allMatchesCombined.length > 0 && (
          <div className="space-y-12">
            <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">Alla Matcher</h2>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {allMatchesCombined.map((match) => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
