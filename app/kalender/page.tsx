import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Event {
  date: string // YYYY-MM-DD
  time: string // HH:MM or "Heldag"
  title: string // Event description
}

interface GroupedEvents {
  [monthYear: string]: Event[] // e.g., "Juli 2025": [...]
}

type EventFilter = "Alla" | "Träning" | "Match" | "Möte" | "Övrigt"

// Make this a Server Component
export default async function KalenderPage() {
  const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || "https://api.nuredo.se"
  let allEvents: Event[] = []
  let error: string | null = null
  let loading = true

  try {
    const response = await fetch(`${BACKEND_API_URL}/api/kalender-events`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    })
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    allEvents = await response.json()
  } catch (e: any) {
    error = e.message || "Failed to fetch calendar events."
    console.error("Server-side fetch error for calendar:", e)
  } finally {
    loading = false // Data fetching is complete on the server
  }

  const groupedEvents: GroupedEvents = allEvents.reduce((acc, event) => {
    const eventDate = new Date(event.date)
    const monthYearKey = eventDate.toLocaleDateString("sv-SE", { year: "numeric", month: "long" })
    if (!acc[monthYearKey]) {
      acc[monthYearKey] = []
    }
    acc[monthYearKey].push(event)
    return acc
  }, {} as GroupedEvents)

  // Sort months chronologically
  const sortedGrouped: GroupedEvents = Object.keys(groupedEvents)
    .sort((a, b) => {
      const parseMonthYear = (str: string) => {
        const [monthName, year] = str.split(" ")
        const monthIndex = new Date(Date.parse(monthName + " 1, 2000")).getMonth()
        return new Date(Number(year), monthIndex, 1)
      }
      return parseMonthYear(a).getTime() - parseMonthYear(b).getTime()
    })
    .reduce((obj, key) => {
      obj[key] = groupedEvents[key].sort((a, b) => {
        const dateTimeA = new Date(`${a.date}T${a.time.replace("Okänd tid", "00:00").replace("Heldag", "00:00")}`)
        const dateTimeB = new Date(`${b.date}T${b.time.replace("Okänd tid", "00:00").replace("Heldag", "00:00")}`)
        return dateTimeA.getTime() - dateTimeB.getTime()
      })
      return obj
    }, {} as GroupedEvents)

  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("sv-SE", { day: "numeric", month: "short" })
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <main className="flex-1 py-8 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <Link href="/" className="inline-flex items-center text-green-700 hover:underline mb-8">← Tillbaka till startsidan</Link>

        <h1 className="text-5xl font-bold text-green-700 mb-4 text-center">Kalender</h1>
        <p className="text-xl text-gray-700 mb-12 text-center max-w-3xl mx-auto">
          Här hittar du alla kommande aktiviteter, träningar och matcher för Härnösands HF.
        </p>

        {/* Removed interactive filter buttons for full server-side rendering speed */}
        {/* If interactive filters are needed, this section would need to be a client component */}

        {error && <p className="text-center text-red-500">Fel: {error}</p>}

        {!error && Object.keys(sortedGrouped).length === 0 && (
          <p className="text-center text-gray-600">Inga planerade aktiviteter hittades.</p>
        )}

        {!error && (
          <div className="space-y-12">
            {Object.entries(sortedGrouped).map(([monthYear, events]) => (
              <section key={monthYear}>
                <h2 className="text-4xl font-bold text-orange-500 mb-8 text-center md:text-left">{monthYear}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {events.map((event) => (
                    <Card
                      key={event.date + event.time + event.title} // Unique key for events
                      className="bg-white/80 shadow-lg rounded-lg flex flex-col"
                    >
                      <CardHeader>
                        <CardTitle className="text-xl font-semibold text-gray-800 mb-2">{event.title}</CardTitle>
                        <div className="flex items-center text-sm text-gray-500">
                          <div className="w-4 h-4 bg-gray-500 rounded mr-1"></div>
                          <span>{formatEventDate(event.date)}</span>
                          <div className="w-4 h-4 bg-gray-500 rounded ml-4 mr-1"></div>
                          <span>{event.time}</span>
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
