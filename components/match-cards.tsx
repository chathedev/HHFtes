import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

interface Match {
  id: string
  date: string
  time: string
  homeTeam: string
  awayTeam: string
  homeScore: number | null
  awayScore: number | null
  status: "upcoming" | "finished"
  location: string
}

interface MatchCardProps {
  match: Match
}

export function MatchCard({ match }: MatchCardProps) {
  const isFinished = match.status === "finished"

  return (
    <Card className="bg-white shadow-lg rounded-lg overflow-hidden">
      <CardHeader
        className={cn(
          "p-4 text-white",
          isFinished ? "bg-gray-700" : "bg-orange-500", // Different color for finished matches
        )}
      >
        <CardTitle className="text-xl font-semibold text-center">
          {match.homeTeam} vs. {match.awayTeam}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 text-gray-700 text-center">
        <p className="text-lg font-medium mb-2">
          {match.date} - {match.time}
        </p>
        {isFinished ? (
          <div className="flex justify-center items-center gap-4 text-3xl font-bold mb-4">
            <span>{match.homeScore}</span>
            <span className="text-gray-400">-</span>
            <span>{match.awayScore}</span>
          </div>
        ) : (
          <p className="text-xl font-bold text-green-600 mb-4">Kommande Match</p>
        )}
        <Separator className="my-3" />
        <p className="text-sm text-gray-600">Plats: {match.location}</p>
      </CardContent>
    </Card>
  )
}
