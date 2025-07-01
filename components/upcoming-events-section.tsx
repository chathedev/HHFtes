"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, MapPin } from "lucide-react"
import Link from "next/link"

interface Event {
  id: string
  title: string
  date: string
  location: string
  link: string
}

export default function UpcomingEventsSection() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("/api/kalender-events")
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data: Event[] = await response.json()
        setEvents(data)
      } catch (e: any) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])

  if (loading) {
    return (
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4 text-center">Laddar kommande evenemang...</div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4 text-center text-red-500">Kunde inte ladda evenemang: {error}</div>
      </section>
    )
  }

  if (events.length === 0) {
    return (
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4 text-center text-gray-600">Inga kommande evenemang.</div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-gray-100">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center text-green-600 mb-12">Kommande Evenemang</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <Card key={event.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="p-0">
                <div className="relative h-48 w-full bg-gray-200 flex items-center justify-center text-gray-500">
                  {/* Placeholder for event image */}
                  <Image
                    src="/placeholder.svg?height=192&width=384&text=Event Image"
                    alt="Event Image"
                    fill
                    className="object-cover"
                  />
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <CardTitle className="text-2xl font-bold mb-3 text-gray-800">{event.title}</CardTitle>
                <div className="flex items-center text-gray-600 mb-2">
                  <Calendar className="w-5 h-5 mr-2 text-orange-500" />
                  <span>{event.date}</span>
                </div>
                <div className="flex items-center text-gray-600 mb-4">
                  <MapPin className="w-5 h-5 mr-2 text-orange-500" />
                  <span>{event.location}</span>
                </div>
                <Link
                  href={event.link}
                  className="inline-flex items-center text-green-600 hover:text-green-700 font-semibold transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Läs mer &rarr;
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
