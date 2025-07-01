import { Users, Trophy, CalendarDays } from "lucide-react"

interface StatsProps {
  content: {
    totalTeams: number
    aTeams: number
    youthTeams: number
    historyYears: string
  }
}

export function StatsSection({ content }: StatsProps) {
  return (
    <section className="py-12 bg-gray-100">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-md">
            <div className="p-3 bg-orange-100 rounded-full mb-4">
              <Users className="h-8 w-8 text-orange-500" />
            </div>
            <h3 className="text-4xl font-bold mb-2">{content.totalTeams}</h3>
            <p className="text-gray-600">Aktiva lag</p>
          </div>

          <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-md">
            <div className="p-3 bg-orange-100 rounded-full mb-4">
              <Trophy className="h-8 w-8 text-orange-500" />
            </div>
            <h3 className="text-4xl font-bold mb-2">{content.aTeams}</h3>
            <p className="text-gray-600">A-lag</p>
          </div>

          <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-md">
            <div className="p-3 bg-orange-100 rounded-full mb-4">
              <CalendarDays className="h-8 w-8 text-orange-500" />
            </div>
            <h3 className="text-4xl font-bold mb-2">{content.youthTeams}</h3>
            <p className="text-gray-600">Ungdomslag</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default StatsSection
