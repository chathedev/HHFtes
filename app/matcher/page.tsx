import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getUpcomingMatchesServer } from "@/lib/get-matches" // Import the new server utility

interface Match {
  date: string // YYYY-MM-DD
  time: string // HH:MM or "Heldag" or "HH:MM - HH:MM"
  title: string // Match title
}

interface GroupedMatches {
  [monthYear: string]: Match[]
}

// Make this a Server Component
export default async function MatchesPage() {
  let allMatches: Match[] = []
  let error: string | null = null

  try {
    allMatches = await getUpcomingMatchesServer()
  } catch (e: any) {
    error = e.message || "Failed to fetch matches."
    console.error("Server-side fetch error for matches:", e)
  }

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
    <div className="flex flex-col min-h-screen bg-white">
      <main className="flex-1 py-8 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <Link href="/" className="inline-flex items-center text-green-700 hover:underline mb-8">← Tillbaka till startsidan</Link>

        <h1 className="text-5xl font-bold text-green-700 mb-4 text-center">Kommande Matcher</h1>
        <p className="text-xl text-gray-700 mb-12 text-center max-w-3xl mx-auto">
          Här hittar du alla kommande matcher för Härnösands HF.
        </p>

        {error && (
          <p className="text-center text-red-500">
            Fel: {error}. Detta kan bero på problem med att hämta data från källan.
          </p>
        )}

        {!error && Object.keys(sortedGroupedMatches).length === 0 && (
          <p className="text-center text-gray-600">Inga matcher planerade.</p>
        )}

        {!error && (
          <div className="space-y-12">
            {Object.entries(sortedGroupedMatches).map(([monthYear, matches]) => (
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
                          <div className="w-4 h-4 bg-gray-500 rounded mr-1"></div>
                          <span>{formatDate(match.date)}</span>
                          <div className="w-4 h-4 bg-gray-500 rounded ml-4 mr-1"></div>
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
