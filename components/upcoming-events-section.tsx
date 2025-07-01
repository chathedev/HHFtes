"use client"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"
import Link from "next/link"
import { CalendarDays, Clock, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { PageContent } from "@/lib/content-store"

interface Match {
  date: string // YYYY-MM-DD
  time: string // HH:MM or "Heldag"
  title: string // Match title
}

interface Event {
  id: number
  title: string
  date: string
  time: string
  location: string
  type: string
}

interface UpcomingEventsSectionProps {
  className?: string
  content: PageContent["upcomingEvents"]
  isEditing?: boolean
  onContentChange?: (newContent: any) => void
}

export function UpcomingEventsSection({
  className,
  content,
  isEditing = false,
  onContentChange,
}: UpcomingEventsSectionProps) {
  const [upcomingMatches, setUpcomingMatches] = useState<Match[]>([])
  const [events, setEvents] = useState<Event[]>([])
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

    const fetchEvents = async () => {
      try {
        const response = await fetch("/api/kalender-events")
        if (!response.ok) {
          throw new Error("Failed to fetch events")
        }
        const data = await response.json()
        setEvents(data.slice(0, 3)) // Only show the first 3 events
      } catch (error) {
        console.error("Error fetching events:", error)
        // Fallback data if API fails
        setEvents([
          {
            id: 1,
            title: "Hemma match: HHF vs IFK Umeå",
            date: "2023-11-15",
            time: "19:00",
            location: "Härnösands Arena",
            type: "match",
          },
          {
            id: 2,
            title: "Ungdomsträning: U14",
            date: "2023-11-16",
            time: "17:30",
            location: "Härnösands Arena",
            type: "training",
          },
          {
            id: 3,
            title: "Klubbmöte",
            date: "2023-11-20",
            time: "18:00",
            location: "Klubbhuset",
            type: "event",
          },
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchMatches()
    fetchEvents()
  }, [])

  const formatMatchDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("sv-SE", {
      weekday: "short",
      day: "numeric",
      month: "short",
    })
  }

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString("sv-SE", options)
  }

  const handleChange = (field: string, value: string) => {
    if (onContentChange) {
      onContentChange({
        ...content,
        [field]: value,
      })
    }
  }

  return (
    <section className={cn("py-12 md:py-16 lg:py-20 bg-gray-50", className)}>
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center text-center mb-10">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">
            {isEditing ? (
              <input
                type="text"
                value={content.title}
                onChange={(e) => handleChange("title", e.target.value)}
                className="w-full text-center border rounded px-2"
              />
            ) : (
              content.title
            )}
          </h2>
          <p className="max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            {isEditing ? (
              <textarea
                value={content.description}
                onChange={(e) => handleChange("description", e.target.value)}
                className="w-full text-center border rounded px-2"
                rows={3}
              />
            ) : (
              content.description
            )}
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center">
            <div className="animate-pulse flex space-x-4">
              <div className="flex-1 space-y-6 py-1">
                <div className="h-60 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <Card key={event.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div
                    className={`p-1 text-center text-white ${
                      event.type === "match" ? "bg-primary" : event.type === "training" ? "bg-secondary" : "bg-gray-600"
                    }`}
                  >
                    {event.type === "match" ? "Match" : event.type === "training" ? "Träning" : "Evenemang"}
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                    <div className="space-y-2 text-sm text-gray-500">
                      <div className="flex items-center">
                        <CalendarDays className="h-4 w-4 mr-2" />
                        <span>{formatDate(event.date)}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span>{event.location}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {upcomingMatches.slice(0, 5).map((match, index) => (
              <Card key={index} className="overflow-hidden">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-3 text-green-700">{match.title}</h3>
                  <div className="space-y-2 text-sm text-gray-500">
                    <div className="flex items-center">
                      <CalendarDays className="h-4 w-4 mr-2" />
                      <span>{formatMatchDate(match.date)}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>{match.time}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="flex justify-center mt-10">
          <Button asChild>
            <Link href="/kalender">Visa alla evenemang</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

// Add default export for backward compatibility
export default UpcomingEventsSection
