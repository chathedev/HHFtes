"use client" // Keep as client component if it has client-side interactivity

import { Calendar, Trophy, Zap, Clock } from "lucide-react"
// Removed useEffect and useState for data fetching, now receives props

interface Match {
  date: string // YYYY-MM-DD
  time: string // HH:MM or "Heldag" or "HH:MM - HH:MM"
  title: string // Match title
}

interface MatchCardsProps {
  upcomingMatches: Match[] // Receive matches as prop
}

export default function MatchCards({ upcomingMatches }: MatchCardsProps) {
  // No loading state needed here, data is pre-fetched

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

              {upcomingMatches.length > 0 ? (
                <div className="space-y-3 w-full">
                  {upcomingMatches.slice(0, 3).map(
                    (
                      match,
                      index, // Display top 3 matches
                    ) => (
                      <div key={index} className="border-l-4 border-orange-500 pl-3 text-left">
                        <div className="font-semibold text-sm text-gray-800">{match.title}</div>
                        <div className="flex items-center text-xs text-gray-600 mt-1">
                          <Clock className="w-3 h-3 mr-1" />
                          {formatDate(match.date)} {match.time}
                        </div>
                        {/* Removed opponent and location as they are not directly available from the new API */}
                      </div>
                    ),
                  )}
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
