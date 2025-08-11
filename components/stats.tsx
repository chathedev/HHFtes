import { Users, Trophy, Award, History } from "lucide-react"
import type { StatsContent } from "@/lib/content-types"

interface StatsProps {
  content: StatsContent
}

export default function Stats({ content }: StatsProps) {
  return (
    <section className="bg-green-600 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="flex flex-col items-center">
            <Users className="w-12 h-12 mb-2" />
            <div className="text-4xl font-bold">{"23"}</div>
            <div className="text-sm">Totalt Lag</div>
          </div>

          <div className="flex flex-col items-center">
            <Trophy className="w-12 h-12 mb-2" />
            <div className="text-4xl font-bold">{"2"}</div>
            <div className="text-sm">A-lag</div>
          </div>

          <div className="flex flex-col items-center">
            <Award className="w-12 h-12 mb-2" />
            <div className="text-4xl font-bold">{"21"}</div>
            <div className="text-sm">Ungdomslag</div>
          </div>

          <div className="flex flex-col items-center">
            <History className="w-12 h-12 mb-2" />
            <div className="text-4xl font-bold">{"50+"}</div>
            <div className="text-sm">År av Historia</div>
          </div>
        </div>
      </div>
    </section>
  )
}
