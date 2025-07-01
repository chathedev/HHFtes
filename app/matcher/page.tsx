import { MatchCard } from "@/components/match-cards"

export default function MatcherPage() {
  const upcomingMatches = [
    {
      id: "m1",
      date: "2024-08-15",
      time: "19:00",
      homeTeam: "Härnösands FF",
      awayTeam: "Sundsvalls FF",
      location: "Härnösands Arena",
      homeLogo: "/placeholder-logo.svg",
      awayLogo: "/placeholder-logo.svg",
      league: "Division 3 Norra",
    },
    {
      id: "m2",
      date: "2024-08-22",
      time: "17:00",
      homeTeam: "Östersunds BK",
      awayTeam: "Härnösands FF",
      location: "Jämtkraft Arena",
      homeLogo: "/placeholder-logo.svg",
      awayLogo: "/placeholder-logo.svg",
      league: "Division 3 Norra",
    },
    {
      id: "m3",
      date: "2024-08-29",
      time: "14:00",
      homeTeam: "Härnösands FF Dam",
      awayTeam: "Umeå IK Dam",
      location: "Härnösands Arena",
      homeLogo: "/placeholder-logo.svg",
      awayLogo: "/placeholder-logo.svg",
      league: "Division 2 Norrland Dam",
    },
  ]

  const pastMatches = [
    {
      id: "p1",
      date: "2024-08-08",
      time: "19:00",
      homeTeam: "Härnösands FF",
      awayTeam: "Timrå IF",
      location: "Härnösands Arena",
      homeLogo: "/placeholder-logo.svg",
      awayLogo: "/placeholder-logo.svg",
      homeScore: 2,
      awayScore: 1,
      league: "Division 3 Norra",
    },
    {
      id: "p2",
      date: "2024-08-01",
      time: "17:00",
      homeTeam: "Gefle IF",
      awayTeam: "Härnösands FF",
      location: "Gavlevallen",
      homeLogo: "/placeholder-logo.svg",
      awayLogo: "/placeholder-logo.svg",
      homeScore: 0,
      awayScore: 3,
      league: "Division 3 Norra",
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <h1 className="text-4xl font-bold text-center text-green-700 mb-8">Matcher</h1>

      <section className="mb-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-2">Kommande Matcher</h2>
        {upcomingMatches.length === 0 ? (
          <p className="text-center text-gray-600 text-lg">Inga kommande matcher att visa just nu.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {upcomingMatches.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-2">Tidigare Resultat</h2>
        {pastMatches.length === 0 ? (
          <p className="text-center text-gray-600 text-lg">Inga tidigare matcher att visa just nu.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {pastMatches.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
