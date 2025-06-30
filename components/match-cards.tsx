"use client"

import type React from "react"

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

/**
 * Triple-card layout: upcoming matches, league link, cup link.
 *
 * • Named export MatchCards (required by build)
 */
export function MatchCards() {
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await fetch("/api/matches")
        setMatches(await res.json())
      } catch (err) {
        console.error("Error fetching matches:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchMatches()
  }, [])

  const fmtDate = (d: string) =>
    new Date(d).toLocaleDateString("sv-SE", { weekday: "short", day: "numeric", month: "short" })

  return (
    <section className="py-16">
      <div className="container mx-auto grid gap-6 px-4 md:grid-cols-3">
        {/* Upcoming */}
        <CardWrapper>
          <Calendar className="h-12 w-12 text-orange-500" />
          <h3 className="mb-4 text-xl font-bold text-orange-500">KOMMANDE MATCHER</h3>
          {loading && <p className="text-sm text-gray-600">Laddar matcher…</p>}
          {!loading && matches.length === 0 && <p className="text-sm text-gray-600">Inga matcher hittades.</p>}
          {!loading && matches.length > 0 && (
            <div className="space-y-3">
              {matches.map((m) => (
                <div key={m.id} className="border-l-4 border-orange-500 pl-3 text-left">
                  <div className="text-sm font-semibold">{m.opponent}</div>
                  <div className="mt-1 flex items-center text-xs text-gray-600">
                    <Clock className="mr-1 h-3 w-3" />
                    {fmtDate(m.date)} {m.time}
                  </div>
                  <div className="flex items-center text-xs text-gray-600">
                    <MapPin className="mr-1 h-3 w-3" />
                    {m.isHome ? "Hemma" : "Borta"}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardWrapper>

        {/* League */}
        <CardWrapper>
          <Trophy className="h-12 w-12 text-green-600" />
          <h3 className="mb-2 text-xl font-bold text-green-600">HANDBOLLSLIGAN DAM</h3>
          <p className="text-sm text-gray-600">Följ vårt A-lag Dam i Handbollsligan</p>
        </CardWrapper>

        {/* Cup */}
        <CardWrapper>
          <Zap className="h-12 w-12 text-orange-500" />
          <h3 className="mb-2 text-xl font-bold text-orange-500">SVENSKA CUPEN 25/26</h3>
          <p className="text-sm text-gray-600">Följ vårt A-lag Herr i Svenska Cupen</p>
        </CardWrapper>
      </div>
    </section>
  )
}

function CardWrapper({ children }: { children: React.ReactNode }) {
  return <div className="overflow-hidden rounded-lg bg-white p-6 text-center shadow-lg">{children}</div>
}

// Make MatchCards available as a *named* export
