"use client" // Keep as client component for interactivity if needed

import { CalendarDays, Clock, ArrowRight, Goal } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Match {
  date: string // YYYY-MM-DD
  time: string // HH:MM or "Heldag"
  title: string // Match title
}

interface UpcomingEventsProps {
  upcomingMatches: Match[] // Receive matches as prop
}

export default function UpcomingEvents({ upcomingMatches }: UpcomingEventsProps) {
  // No loading/error states here, as data is passed as prop

  const formatMatchDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("sv-SE", {
      weekday: "short",
      day: "numeric",
      month: "short",
    })
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <Card className="bg-white rounded-lg shadow-lg overflow-hidden max-w-2xl mx-auto">
          <CardHeader className="p-6 flex flex-col items-center text-center border-b border-gray-200">
            <Goal className="w-16 h-16 text-green-600 mb-4" />
            <CardTitle className="text-3xl font-bold text-green-600 mb-2">KOMMANDE MATCHER</CardTitle>
            <p className="text-gray-600 text-lg">Håll dig uppdaterad med våra nästa matcher!</p>
          </CardHeader>
          <CardContent className="p-6">
            {upcomingMatches.length === 0 && (
              <p className="text-center text-gray-600">Inga kommande matcher hittades</p>
            )}

            {upcomingMatches.length > 0 && (
              <div className="space-y-4 mb-6">
                {upcomingMatches.slice(0, 5).map(
                  (
                    match,
                    index, // Display up to 5 matches
                  ) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-3 bg-gray-50 rounded-md border border-gray-200"
                    >
                      <div className="flex-shrink-0 text-center">
                        <CalendarDays className="w-6 h-6 text-orange-500" />
                        <span className="block text-xs text-gray-600">{formatMatchDate(match.date)}</span>
                      </div>
                      <div className="flex-grow">
                        <h4 className="font-semibold text-gray-800">{match.title}</h4>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <Clock className="w-4 h-4 mr-1" />
                          <span>{match.time}</span>
                        </div>
                      </div>
                    </div>
                  ),
                )}
              </div>
            )}

            <div className="text-center">
              <Button
                asChild
                className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-md text-lg font-semibold transition-colors"
              >
                <Link href="/matcher">
                  Visa Alla Matcher
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
