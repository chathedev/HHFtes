import { CalendarDays } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Event {
  id: string
  date: string
  time: string
  title: string
  location: string
}

async function getEvents(): Promise<Event[]> {
  // In a real application, you would fetch this from a database or API
  // For this example, we'll use a static array
  const response = await fetch(`${process.env.NEXT_PUBLIC_VERCEL_URL}/api/kalender-events`, {
    next: { revalidate: 3600 }, // Revalidate every hour
  })
  if (!response.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch events")
  }
  return response.json()
}

export default async function KalenderPage() {
  const events = await getEvents()

  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      <h1 className="text-4xl font-bold text-center mb-12 text-gray-800">Klubbkalender</h1>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          <Card key={event.id} className="bg-white shadow-lg rounded-lg overflow-hidden">
            <CardHeader className="bg-orange-500 text-white p-4 flex flex-row items-center justify-between">
              <CardTitle className="text-xl font-semibold">{event.title}</CardTitle>
              <CalendarDays className="h-6 w-6" />
            </CardHeader>
            <CardContent className="p-4 text-gray-700">
              <p className="mb-2">
                <span className="font-semibold">Datum:</span> {event.date}
              </p>
              <p className="mb-2">
                <span className="font-semibold">Tid:</span> {event.time}
              </p>
              <p>
                <span className="font-semibold">Plats:</span> {event.location}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
