"use client"

import { Header } from "@/components/header"
import Footer from "@/components/footer"
import { CalendarDays, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Match {
  date: string // YYYY-MM-DD
  time: string // HH:MM or "Heldag" or "HH:MM - HH:MM"
  title: string // Match title
}

interface GroupedMatches {
  [monthYear: string]: Match[]
}

// Mock data for client-side rendering
const mockMatches: Match[] = [
  { date: "2025-08-20", time: "19:00", title: "Härnösands HF vs. Gästriklands HK" },
  { date: "2025-08-27", time: "18:30", title: "Sundsvalls HK vs. Härnösands HF" },
  { date: "2025-09-03", time: "20:00", title: "Härnösands HF vs. Umeå IK" },
  { date: "2025-09-10", time: "Heldag", title: "Bortamatch mot Luleå HF" },
  { date: "2025-10-05", time: "17:00 - 19:00", title: "Träningsmatch mot Örnsköldsvik HF" },
]

export default function MatcherPage() {
  // In a real application, you would fetch this data from an API or server action
  // For now, we'll use mock data or an empty array to demonstrate the "no matches" message.
  const allMatches: Match[] = [] // Or mockMatches to test with matches
  const error: string | null = null // Simulate no error for now

  const groupedMatches: GroupedMatches = allMatches.reduce((acc, match) => {
    const matchDate = new Date(match.date)
    const monthYearKey = matchDate.toLocaleDateString("sv-SE", { year: "numeric", month: "long" })
    if (!acc[monthYearKey]) acc[monthYearKey] = []
    acc[monthYearKey].push(match)
    return acc
  }, {} as GroupedMatches)

  // Sort months chronologically
  const sortedGroupedMatches: GroupedMatches = Object.keys(groupedMatches)
    .sort((a, b) => {
      const parseMonthYear = (str: string) => {
        const [monthName, year] = str.split(" ")
        const monthIndex = new Date(Date.parse(`${monthName} 1, 2000`)).getMonth()
        return new Date(Number(year), monthIndex, 1)
      }
      return parseMonthYear(a).getTime() - parseMonthYear(b).getTime()
    })
    .reduce((sorted, key) => {
      sorted[key] = groupedMatches[key].sort((a, b) => {
        const dateTimeA = new Date(`${a.date}T${a.time.replace("Okänd tid", "00:00").replace("Heldag", "00:00")}`)
        const dateTimeB = new Date(`${b.date}T${b.time.replace("Okänd tid", "00:00").replace("Heldag", "00:00")}`)
        return dateTimeA.getTime() - dateTimeB.getTime()
      })
      return sorted
    }, {} as GroupedMatches)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("sv-SE", { day: "numeric", month: "short" })
  }

  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="h-24"></div> {/* Spacer for fixed header */}
        <div className="container px-4 md:px-6 py-8 md:py-12 lg:py-16 flex flex-col items-center justify-center text-center">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">Kommande Matcher</h1>
          {error && (
            <p className="text-center text-red-500 mb-8">
              Fel: {error}. Detta kan bero på problem med att hämta data från källan.
            </p>
          )}

          {!error && Object.keys(sortedGroupedMatches).length === 0 && (
            <p className="text-lg text-gray-700">Inga matcher planerade för närvarande.</p>
          )}

          {!error && Object.keys(sortedGroupedMatches).length > 0 && (
            <div className="space-y-12">
              {Object.entries(sortedGroupedMatches).map(([monthYear, matches]) => (
                <section key={monthYear}>
                  <h2 className="text-2xl font-bold text-orange-500 mb-6 text-center md:text-left">{monthYear}</h2>
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
        </div>
      </main>
      <Footer />
    </>
  )
}
