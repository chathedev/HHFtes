"use client"
import { Users, Trophy, CalendarDays } from "lucide-react"
import type { PageContent } from "@/lib/content-store"
import { cn } from "@/lib/utils"

interface StatsSectionProps {
  className?: string
  isEditing?: boolean
  content: PageContent["stats"]
  onContentChange?: (newContent: any) => void
}

export function StatsSection({ className, isEditing = false, content, onContentChange }: StatsSectionProps) {
  const handleChange = (field: string, value: any) => {
    if (onContentChange) {
      onContentChange({
        ...content,
        [field]: value,
      })
    }
  }

  return (
    <section className={cn("py-12 md:py-16 lg:py-20 bg-gray-50", className)}>
      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="flex flex-col items-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
              <Users className="h-8 w-8 text-primary" />
            </div>
            <div className="space-y-2">
              <h3 className="text-3xl font-bold">
                {isEditing ? (
                  <input
                    type="number"
                    value={content.totalTeams}
                    onChange={(e) => handleChange("totalTeams", Number.parseInt(e.target.value))}
                    className="w-20 text-center border rounded px-2"
                  />
                ) : (
                  content.totalTeams
                )}
              </h3>
              <p className="text-muted-foreground">Totalt antal lag</p>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
              <Trophy className="h-8 w-8 text-primary" />
            </div>
            <div className="space-y-2">
              <h3 className="text-3xl font-bold">
                {isEditing ? (
                  <input
                    type="number"
                    value={content.aTeams}
                    onChange={(e) => handleChange("aTeams", Number.parseInt(e.target.value))}
                    className="w-20 text-center border rounded px-2"
                  />
                ) : (
                  content.aTeams
                )}
              </h3>
              <p className="text-muted-foreground">A-lag</p>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
              <CalendarDays className="h-8 w-8 text-primary" />
            </div>
            <div className="space-y-2">
              <h3 className="text-3xl font-bold">
                {isEditing ? (
                  <input
                    type="number"
                    value={content.youthTeams}
                    onChange={(e) => handleChange("youthTeams", Number.parseInt(e.target.value))}
                    className="w-20 text-center border rounded px-2"
                  />
                ) : (
                  content.youthTeams
                )}
              </h3>
              <p className="text-muted-foreground">Ungdomslag</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// Add default export that points to the named export for backward compatibility
export default StatsSection
