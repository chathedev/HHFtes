"use client"

import Link from "next/link"
import { ChevronLeft, CalendarDays, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState, useMemo } from "react" // Keep useState and useMemo for client-side filtering

interface Event {
  date: string // YYYY-MM-DD
  time: string // HH:MM or "Heldag"
  title: string // Event description
}

interface GroupedEvents {
  [monthYear: string]: Event[] // e.g., "Juli 2025": [...]
}

type EventFilter = "Alla" | "Träning" | "Match" | "Möte" | "Övrigt"

// Client component to handle filtering and rendering
function CalendarDisplay({ initialEvents }: { initialEvents: Event[] }) {
  const [activeFilter, setActiveFilter] = useState<EventFilter>("Alla")
  const [allEvents, setAllEvents] = useState<Event[]>(initialEvents) // Initialize with server-fetched data

  // No need for useEffect to fetch data here anymore, it's passed as prop

  const filteredEvents = useMemo(() => {
    if (activeFilter === "Alla") {
      return allEvents
    }
    return allEvents.filter((event) => {
      const lowerTitle = event.title.toLowerCase()
      switch (activeFilter) {
        case "Träning":
          return lowerTitle.includes("träning")
        case "Match":
          return (
            lowerTitle.includes("match") ||
            lowerTitle.includes("cup") ||
            lowerTitle.includes("sammandrag") ||
            lowerTitle.includes("blixten")
          )
        case "Möte":
          return lowerTitle.includes("möte") || lowerTitle.includes("årsmöte") || lowerTitle.includes("ledaravslutning")
        case "Övrigt":
          // Catch-all for anything not explicitly a training, match, or meeting
          return !(
            lowerTitle.includes("träning") ||
            lowerTitle.includes("match") ||
            lowerTitle.includes("cup") ||
            lowerTitle.includes("sammandrag") ||
            lowerTitle.includes("blixten") ||
            lowerTitle.includes("möte") ||
            lowerTitle.includes("årsmöte") ||
            lowerTitle.includes("ledaravslutning")
          )
        default:
          return true
      }
    })
  }, [allEvents, activeFilter])

  const groupedEvents = useMemo(() => {
    const grouped: GroupedEvents = filteredEvents.reduce((acc, event) => {
      const eventDate = new Date(event.date)
      const monthYearKey = eventDate.toLocaleDateString("sv-SE", { year: "numeric", month: "long" })
      if (!acc[monthYearKey]) {
        acc[monthYearKey] = []
      }
      acc[monthYearKey].push(event)
      return acc
    }, {} as GroupedEvents)

    // Sort months chronologically
    const sortedGrouped: GroupedEvents = Object.keys(grouped)
      .sort((a, b) => {
        const parseMonthYear = (str: string) => {
          const [monthName, year] = str.split(" ")
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
      }, {} as GroupedEvents)

    return sortedGrouped
  }, [filteredEvents])

  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("sv-SE", { day: "numeric", month: "short" })
  }

  const filterButtons: EventFilter[] = ["Alla", "Träning", "Match", "Möte", "Övrigt"]

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <main className="flex-1 py-8 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <Link href="/" className="inline-flex items-center text-green-700 hover:underline mb-8">
          <ChevronLeft className="w-4 h-4 mr-2" />
          Tillbaka till startsidan
        </Link>

        <h1 className="text-5xl font-bold text-green-700 mb-4 text-center">Kalender</h1>
        <p className="text-xl text-gray-700 mb-12 text-center max-w-3xl mx-auto">
          Här hittar du alla kommande aktiviteter, träningar och matcher för Härnösands HF.
        </p>

        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {filterButtons.map((filter) => (
            <Button
              key={filter}
              variant={activeFilter === filter ? "default" : "outline"}
              className={
                activeFilter === filter
                  ? "bg-orange-500 hover:bg-orange-600 text-white"
                  : "border-gray-300 text-gray-700 hover:bg-gray-100"
              }
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </Button>
          ))}
        </div>

        {/* No loading/error states here, as data is pre-fetched */}
        {Object.keys(groupedEvents).length === 0 && (
          <p className="text-center text-gray-600">Inga planerade aktiviteter hittades för den valda filter.</p>
        )}

        {Object.keys(groupedEvents).length > 0 && (
          <div className="space-y-12">
            {Object.entries(groupedEvents).map(([monthYear, events]) => (
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
                          <CalendarDays className="w-4 h-4 mr-1" />
                          <span>{formatEventDate(event.date)}</span>
                          <Clock className="w-4 h-4 ml-4 mr-1" />
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

// Main Server Component for the page
export default async function KalenderPageWrapper() {
  const initialEvents = await getCalendarEvents()
  return <CalendarDisplay initialEvents={initialEvents} />
}

// Server-side data fetching function
async function getCalendarEvents(): Promise<Event[]> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_VERCEL_URL || "http://localhost:3000"}/api/kalender-events`,
      {
        next: { revalidate: 3600 }, // Revalidate every hour
      },
    )
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data: Event[] = await response.json()
    return data
  } catch (e: any) {
    console.error("Server-side fetch error for calendar events:", e)
    return [] // Return empty array on error
  }
}
