"use client"

import { useState, useEffect } from "react"
import { Calendar, Clock } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface Event {
  id: string
  title: string
  date: string
  time: string
  location: string
  type: string
}

interface UpcomingEventsProps {
  content?: {
    title: string
    description: string
  }
}

export function UpcomingEventsSection({ content }: UpcomingEventsProps) {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch("/api/kalender-events")
        if (res.ok) {
          const data = await res.json()
          setEvents(data.slice(0, 3)) // Show only the first 3 events
        } else {
          console.error("Failed to fetch events")
          // Use sample data as fallback
          setEvents(sampleEvents)
        }
      } catch (error) {
        console.error("Error fetching events:", error)
        // Use sample data as fallback
        setEvents(sampleEvents)
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])

  const defaultTitle = "Kommande Evenemang"
  const defaultDescription = "Håll dig uppdaterad med våra senaste matcher och aktiviteter."

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">{content?.title || defaultTitle}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">{content?.description || defaultDescription}</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-6 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-4 w-1/2"></div>
                  <div className="h-10 bg-gray-200 rounded mt-4"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {events.map((event) => (
              <Card key={event.id}>
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-2">{event.title}</h3>
                  <div className="flex items-center text-gray-600 mb-1">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center text-gray-600 mb-3">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>{event.time}</span>
                  </div>
                  <div className="text-sm text-gray-500 mb-4">
                    <span className="inline-block bg-orange-100 text-orange-800 rounded-full px-3 py-1 text-xs font-semibold">
                      {event.type}
                    </span>
                    <span className="ml-2">{event.location}</span>
                  </div>
                  <Button variant="outline" className="w-full bg-transparent" asChild>
                    <Link href="/kalender">Läs mer</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="text-center mt-10">
          <Button asChild>
            <Link href="/kalender">Visa alla evenemang</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

// Sample events data as fallback
const sampleEvents: Event[] = [
  {
    id: "1",
    title: "HHF vs Sundsvall",
    date: "2023-09-15",
    time: "19:00",
    location: "Härnösands Arena",
    type: "Match",
  },
  {
    id: "2",
    title: "Ungdomsträning P14",
    date: "2023-09-16",
    time: "17:30",
    location: "Härnösands Arena",
    type: "Träning",
  },
  {
    id: "3",
    title: "Styrelsemöte",
    date: "2023-09-18",
    time: "18:00",
    location: "Klubbhuset",
    type: "Möte",
  },
]

export default UpcomingEventsSection
