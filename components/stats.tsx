import { Users, Trophy, Award, History } from "lucide-react"

/**
 * Quick club statistics section.
 *
 * • Named export Stats (required by build)
 */
export function Stats() {
  return (
    <section className="bg-green-600 py-12 text-white">
      <div className="container mx-auto grid grid-cols-2 gap-8 px-4 text-center md:grid-cols-4">
        <Stat icon={Users} value="23" label="Totalt Lag" />
        <Stat icon={Trophy} value="2" label="A-lag" />
        <Stat icon={Award} value="21" label="Ungdomslag" />
        <Stat icon={History} value="50+" label="År av Historia" />
      </div>
    </section>
  )
}

interface StatProps {
  icon: typeof Users
  value: string
  label: string
}

function Stat({ icon: Icon, value, label }: StatProps) {
  return (
    <div className="flex flex-col items-center">
      <Icon className="mb-2 h-12 w-12" />
      <span className="text-4xl font-bold">{value}</span>
      <span className="text-sm">{label}</span>
    </div>
  )
}

// Make Stats available as a *named* export
