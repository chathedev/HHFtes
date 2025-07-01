import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import { CalendarDays, Clock, MapPin } from "lucide-react"

interface Match {
  id: string
  date: string
  time: string
  homeTeam: string
  awayTeam: string
  location: string
  homeLogo: string
  awayLogo: string
  homeScore?: number
  awayScore?: number
  league: string
}

interface MatchCardProps {
  match: Match
}

export function MatchCard({ match }: MatchCardProps) {
  const matchDate = new Date(match.date)
  const formattedDate = matchDate.toLocaleDateString("sv-SE", {
    weekday: "short",
    day: "numeric",
    month: "short",
  })

  const isPastMatch = match.homeScore !== undefined && match.awayScore !== undefined

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-center mb-2">{match.league}</CardTitle>
        <div className="flex items-center justify-around text-center">
          <div className="flex flex-col items-center">
            <Image
              src={match.homeLogo || "/placeholder.svg"}
              alt={`${match.homeTeam} logo`}
              width={60}
              height={60}
              className="object-contain mb-1"
            />
            <span className="text-md font-medium">{match.homeTeam}</span>
          </div>
          <div className="text-2xl font-bold mx-4">
            {isPastMatch ? (
              <span className="text-green-600">
                {match.homeScore} - {match.awayScore}
              </span>
            ) : (
              <span className="text-gray-500">vs</span>
            )}
          </div>
          <div className="flex flex-col items-center">
            <Image
              src={match.awayLogo || "/placeholder.svg"}
              alt={`${match.awayTeam} logo`}
              width={60}
              height={60}
              className="object-contain mb-1"
            />
            <span className="text-md font-medium">{match.awayTeam}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-2 text-gray-700 text-sm space-y-1">
        <div className="flex items-center gap-2">
          <CalendarDays className="w-4 h-4 text-orange-500" />
          <span>{formattedDate}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-orange-500" />
          <span>{match.time}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-orange-500" />
          <span>{match.location}</span>
        </div>
      </CardContent>
    </Card>
  )
}
