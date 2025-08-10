"use client"

import Link from "next/link"
import { ChevronLeft, CalendarDays, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useState, useMemo } from "react" // Keep useState and useMemo for client-side interactivity if needed

interface Match {
  date: string // YYYY-MM-DD
  time: string // HH:MM or "Heldag" or "HH:MM - HH:MM"
  title: string // Match title
}

interface GroupedMatches {
  [monthYear: string]: Match[]
}

// Client component to render matches
function MatchesDisplay({ initialMatches }: { initialMatches: Match[] }) {
  const [allMatches, setAllMatches] = useState<Match[]>(initialMatches) // Initialize with server-fetched data

  // No need for useEffect to fetch data here anymore

  const groupedMatches = useMemo(() => {
    const grouped: GroupedMatches = allMatches.reduce((acc, match) => {
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
  }, [allMatches])

  const formatDate = (dateString: string) => {
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

        {allMatches.length === 0 && <p className="text-center text-gray-600">Inga matcher planerade.</p>}

        {allMatches.length > 0 && (
          <div className="space-y-12">
            {Object.entries(groupedMatches).map(([monthYear, matches]) => (
              <section key={monthYear}>
                <h2 className="text-4xl font-bold text-orange-500 mb-8 text-center md:text-left">{monthYear}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {matches.map((match) => (
                    <Card
                      key={match.date + match.time + match.title}
                      className="bg-white/90 shadow-lg rounded-lg flex flex-col transition hover:shadow-xl"
                    >
                      <CardHeader>
                        <CardTitle className="text-xl font-semibold text-gray-800 mb-2">{match.title}</CardTitle>
                        <div className="flex items-center text-sm text-gray-500">
                          <CalendarDays className="w-4 h-4 mr-1" />
                          <span>{formatDate(match.date)}</span>
                          <Clock className="w-4 h-4 ml-4 mr-1" />
                          <span>{match.time}</span>
                        </div>
                      </CardHeader>
                      <CardContent className="flex-grow flex flex-col justify-between" />
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

// Main Server Component for the page
export default async function MatchesPageWrapper() {
  const initialMatches = await getMatches()
  return <MatchesDisplay initialMatches={initialMatches} />
}

// Server-side data fetching function
async function getMatches(): Promise<Match[]> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_VERCEL_URL || "http://localhost:3000"}/api/matches`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    })
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data: Match[] = await response.json()
    return data
  } catch (e: any) {
    console.error("Server-side fetch error for matches:", e)
    return [] // Return empty array on error
  }
}
