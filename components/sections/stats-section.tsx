"use client"

import { Users, Trophy, Award, History } from "lucide-react"
import type { PageContent } from "@/lib/content-store"
import { cn } from "@/lib/utils"

interface SelectedElementData {
  sectionKey: keyof PageContent
  elementId: string // Unique ID for the element within the section (e.g., "heroTitle", "aboutClubImage")
  type: "text" | "number" | "link" | "image" | "button" | "color" | "font-size" // Type of element being edited
  label: string // Label for the input field in the sidebar
  currentValue: string | number // The current value of the primary field (e.g., text content, URL)
  contentPath?: string // e.g., "hero.title", "aboutClub.imageSrc"
  additionalFields?: {
    field: string
    label: string
    type: "text" | "select" | "color" | "font-size"
    currentValue: string | number
    options?: { name: string; value: string; bgClass?: string; textClass?: string }[]
  }[]
}

interface StatsSectionProps {
  content: PageContent["stats"]
  isEditing?: boolean
  onElementSelect: (data: SelectedElementData) => void
}

function StatsSection({ content, isEditing = false, onElementSelect }: StatsSectionProps) {
  const handleStatClick = (field: keyof PageContent["stats"], label: string, type: "text" | "number") => {
    if (isEditing) {
      onElementSelect({
        sectionKey: "stats",
        elementId: field,
        type: type,
        label: label,
        currentValue: content[field],
      })
    }
  }

  return (
    <section className="bg-green-600 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div
            className={cn(
              "flex flex-col items-center",
              isEditing && "cursor-pointer group hover:outline hover:outline-2 hover:outline-white rounded px-1",
            )}
            onClick={() => handleStatClick("totalTeams", "Totalt Lag", "number")}
          >
            <Users className="w-12 h-12 mb-2" />
            <div className="text-4xl font-bold">{content.totalTeams}</div>
            <div className="text-sm">Totalt Lag</div>
          </div>

          <div
            className={cn(
              "flex flex-col items-center",
              isEditing && "cursor-pointer group hover:outline hover:outline-2 hover:outline-white rounded px-1",
            )}
            onClick={() => handleStatClick("aTeams", "A-lag", "number")}
          >
            <Trophy className="w-12 h-12 mb-2" />
            <div className="text-4xl font-bold">{content.aTeams}</div>
            <div className="text-sm">A-lag</div>
          </div>

          <div
            className={cn(
              "flex flex-col items-center",
              isEditing && "cursor-pointer group hover:outline hover:outline-2 hover:outline-white rounded px-1",
            )}
            onClick={() => handleStatClick("youthTeams", "Ungdomslag", "number")}
          >
            <Award className="w-12 h-12 mb-2" />
            <div className="text-4xl font-bold">{content.youthTeams}</div>
            <div className="text-sm">Ungdomslag</div>
          </div>

          <div
            className={cn(
              "flex flex-col items-center",
              isEditing && "cursor-pointer group hover:outline hover:outline-2 hover:outline-white rounded px-1",
            )}
            onClick={() => handleStatClick("historyYears", "År av Historia", "text")}
          >
            <History className="w-12 h-12 mb-2" />
            <div className="text-4xl font-bold">{content.historyYears}</div>
            <div className="text-sm">År av Historia</div>
          </div>
        </div>
      </div>
    </section>
  )
}

export { StatsSection } // named export required by the build
export default StatsSection // keep the existing default export
