"use client"

import { Calendar, Trophy, Zap, MapPin, Clock } from "lucide-react"
import { useEffect, useState } from "react"

interface Match {
  id: string
  title: string
  date: string
  time: string
  opponent: string
  location: string
  isHome: boolean
}

export default function MatchCards() {
  const [upcomingMatches, setUpcomingMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await fetch("/api/matches")
        const matches = await response.json()
        setUpcomingMatches(matches)
      } catch (error) {
        console.error("Error fetching matches:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchMatches()
  }, [])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("sv-SE", {
      weekday: "short",
      day: "numeric",
      month: "short",
    })
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-6">
          {/* Kommande Matcher */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-6 flex flex-col items-center text-center">
              <Calendar className="w-12 h-12 text-orange-500 mb-4" />
              <h3 className="text-xl font-bold text-orange-500 mb-4">KOMMANDE MATCHER</h3>

              {loading ? (
                <p className="text-gray-600 text-sm">Laddar matcher...</p>
              ) : upcomingMatches.length > 0 ? (
                <div className="space-y-3 w-full">
                  {upcomingMatches.map((match) => (
                    <div key={match.id} className="border-l-4 border-orange-500 pl-3 text-left">
                      <div className="font-semibold text-sm text-gray-800">{match.opponent}</div>
                      <div className="flex items-center text-xs text-gray-600 mt-1">
                        <Clock className="w-3 h-3 mr-1" />
                        {formatDate(match.date)} {match.time}
                      </div>
                      <div className="flex items-center text-xs text-gray-600">
                        <MapPin className="w-3 h-3 mr-1" />
                        {match.isHome ? "Hemma" : "Borta"}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 text-sm">Inga kommande matcher hittades</p>
              )}
            </div>
          </div>

          {/* Handbollsligan Dam */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-6 flex flex-col items-center text-center">
              <Trophy className="w-12 h-12 text-green-600 mb-4" />
              <h3 className="text-xl font-bold text-green-600 mb-2">HANDBOLLSLIGAN DAM</h3>
              <p className="text-gray-600 text-sm">Följ vårt A-lag Dam i Handbollsligan</p>
            </div>
          </div>

          {/* Svenska Cupen */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-6 flex flex-col items-center text-center">
              <Zap className="w-12 h-12 text-orange-500 mb-4" />
              <h3 className="text-xl font-bold text-orange-500 mb-2">SVENSKA CUPEN 25/26</h3>
              <p className="text-gray-600 text-sm">Följ vårt A-lag herr i Svenska Cupen</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
