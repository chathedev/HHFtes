import { CalendarDays } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Event {
  id: string
  date: string
  time: string
  title: string
  location: string
  category: "match" | "training" | "tournament" | "meeting"
}

async function getEvents(): Promise<Event[]> {
  // In a real application, this would fetch from a database or external API
  // For now, we'll use a mock API route
  const res = await fetch(`${process.env.NEXT_PUBLIC_VERCEL_URL}/api/kalender-events`, {
    next: { revalidate: 3600 }, // Revalidate every hour
  })
  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch events")
  }
  return res.json()
}

export default async function KalenderPage() {
  const events = await getEvents()

  const groupedEvents: { [key: string]: Event[] } = events.reduce((acc, event) => {
    const date = event.date // Use the full date as the key
    if (!acc[date]) {
      acc[date] = []
    }
    acc[date].push(event)
    return acc
  }, {})

  const sortedDates = Object.keys(groupedEvents).sort()

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <h1 className="text-4xl font-bold text-center text-green-700 mb-8">Kalender</h1>

      {sortedDates.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">Inga kommande händelser att visa just nu.</p>
      ) : (
        <div className="space-y-8">
          {sortedDates.map((date) => (
            <div key={date}>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">
                {new Date(date).toLocaleDateString("sv-SE", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {groupedEvents[date].map((event) => (
                  <Card key={event.id} className="shadow-md hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-green-600">
                        <CalendarDays className="w-5 h-5" />
                        {event.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-gray-700">
                      <p>
                        <span className="font-medium">Tid:</span> {event.time}
                      </p>
                      <p>
                        <span className="font-medium">Plats:</span> {event.location}
                      </p>
                      <p>
                        <span className="font-medium">Kategori:</span>{" "}
                        {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
