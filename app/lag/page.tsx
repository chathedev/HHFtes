import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Shirt, Shield } from "lucide-react"

interface Team {
  id: string
  name: string
  category: string
  description: string
  coach: string
  playersCount: number
}

const teams: Team[] = [
  {
    id: "herr-a",
    name: "Herrlaget A",
    category: "Senior",
    description: "Vårt flaggskeppslag som tävlar i Division 3.",
    coach: "Erik Johansson",
    playersCount: 25,
  },
  {
    id: "dam-a",
    name: "Damlaget A",
    category: "Senior",
    description: "Vårt damlag som spelar i Division 2.",
    coach: "Maria Andersson",
    playersCount: 22,
  },
  {
    id: "u19-herr",
    name: "Pojkar U19",
    category: "Ungdom",
    description: "Framtidens stjärnor i vår U19-trupp.",
    coach: "Jonas Lindgren",
    playersCount: 20,
  },
  {
    id: "u17-dam",
    name: "Flickor U17",
    category: "Ungdom",
    description: "Vårt lovande U17-lag för tjejer.",
    coach: "Sofia Karlsson",
    playersCount: 18,
  },
  {
    id: "u15-herr",
    name: "Pojkar U15",
    category: "Ungdom",
    description: "Utvecklingslaget för pojkar 15 år och yngre.",
    coach: "Patrik Nilsson",
    playersCount: 20,
  },
  {
    id: "u13-dam",
    name: "Flickor U13",
    category: "Ungdom",
    description: "Vårt yngsta tävlingslag för flickor.",
    coach: "Lena Bergström",
    playersCount: 15,
  },
]

export default function LagPage() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <h1 className="text-4xl font-bold text-center text-green-700 mb-8">Våra Lag</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {teams.map((team) => (
          <Card key={team.id} className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-green-600">{team.name}</CardTitle>
              <p className="text-sm text-gray-500">{team.category}</p>
            </CardHeader>
            <CardContent className="text-gray-700 space-y-2">
              <p>{team.description}</p>
              <div className="flex items-center gap-2 text-sm">
                <Shirt className="w-4 h-4 text-orange-500" />
                <span>Tränare: {team.coach}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Users className="w-4 h-4 text-orange-500" />
                <span>Antal spelare: {team.playersCount}</span>
              </div>
              {team.category === "Senior" && (
                <div className="flex items-center gap-2 text-sm">
                  <Shield className="w-4 h-4 text-orange-500" />
                  <span>Division: {team.name.includes("Herr") ? "Division 3" : "Division 2"}</span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
