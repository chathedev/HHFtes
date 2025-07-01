import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface Team {
  id: string
  name: string
  description: string
  imageUrl: string
  coach: string
  league: string
}

const teams: Team[] = [
  {
    id: "1",
    name: "Herrlaget",
    description: "Vårt seniorlag på herrsidan, tävlar i Division 2 Norra.",
    imageUrl: "/placeholder.svg?height=400&width=600",
    coach: "Erik Johansson",
    league: "Division 2 Norra",
  },
  {
    id: "2",
    name: "Damlaget",
    description: "Vårt seniorlag på damsidan, kämpar i Division 1 Mellansvenska.",
    imageUrl: "/placeholder.svg?height=400&width=600",
    coach: "Anna Svensson",
    league: "Division 1 Mellansvenska",
  },
  {
    id: "3",
    name: "Pojkar 16",
    description: "Ungdomslag för pojkar födda 2008.",
    imageUrl: "/placeholder.svg?height=400&width=600",
    coach: "Jonas Karlsson",
    league: "Ungdomsserie P16",
  },
  {
    id: "4",
    name: "Flickor 14",
    description: "Ungdomslag för flickor födda 2010.",
    imageUrl: "/placeholder.svg?height=400&width=600",
    coach: "Maria Lindgren",
    league: "Ungdomsserie F14",
  },
]

export default function LagPage() {
  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      <h1 className="text-4xl font-bold text-center mb-12 text-gray-800">Våra Lag</h1>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {teams.map((team) => (
          <Card key={team.id} className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="relative w-full h-48">
              <Image
                src={team.imageUrl || "/placeholder.svg"}
                alt={team.name}
                layout="fill"
                objectFit="cover"
                className="rounded-t-lg"
              />
            </div>
            <CardHeader className="p-4">
              <CardTitle className="text-2xl font-semibold text-gray-800">{team.name}</CardTitle>
              <CardDescription className="text-gray-600">{team.description}</CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0 text-gray-700">
              <p className="mb-1">
                <span className="font-semibold">Tränare:</span> {team.coach}
              </p>
              <p>
                <span className="font-semibold">Liga:</span> {team.league}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
