"use client"

import type React from "react"

import { Users, Trophy, Award, History } from "lucide-react"
import type { PageContent } from "@/lib/content-store"

interface StatsSectionProps {
  content: PageContent["stats"]
  isEditing?: boolean
  onContentChange?: (field: keyof PageContent["stats"], value: string | number) => void
}

export default function StatsSection({ content, isEditing = false, onContentChange }: StatsSectionProps) {
  const handleNumberChange = (field: keyof PageContent["stats"], e: React.ChangeEvent<HTMLDivElement>) => {
    if (onContentChange) {
      const value = Number.parseInt(e.currentTarget.innerText, 10)
      if (!isNaN(value)) {
        onContentChange(field, value)
      }
    }
  }

  const handleTextChange = (field: keyof PageContent["stats"], e: React.ChangeEvent<HTMLDivElement>) => {
    if (onContentChange) {
      onContentChange(field, e.currentTarget.innerText)
    }
  }

  return (
    <section className="bg-green-600 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="flex flex-col items-center">
            <Users className="w-12 h-12 mb-2" />
            <div
              className="text-4xl font-bold"
              contentEditable={isEditing}
              suppressContentEditableWarning={true}
              onBlur={(e) => handleNumberChange("totalTeams", e)}
            >
              {content.totalTeams}
            </div>
            <div className="text-sm">Totalt Lag</div>
          </div>

          <div className="flex flex-col items-center">
            <Trophy className="w-12 h-12 mb-2" />
            <div
              className="text-4xl font-bold"
              contentEditable={isEditing}
              suppressContentEditableWarning={true}
              onBlur={(e) => handleNumberChange("aTeams", e)}
            >
              {content.aTeams}
            </div>
            <div className="text-sm">A-lag</div>
          </div>

          <div className="flex flex-col items-center">
            <Award className="w-12 h-12 mb-2" />
            <div
              className="text-4xl font-bold"
              contentEditable={isEditing}
              suppressContentEditableWarning={true}
              onBlur={(e) => handleNumberChange("youthTeams", e)}
            >
              {content.youthTeams}
            </div>
            <div className="text-sm">Ungdomslag</div>
          </div>

          <div className="flex flex-col items-center">
            <History className="w-12 h-12 mb-2" />
            <div
              className="text-4xl font-bold"
              contentEditable={isEditing}
              suppressContentEditableWarning={true}
              onBlur={(e) => handleTextChange("historyYears", e)}
            >
              {content.historyYears}
            </div>
            <div className="text-sm">År av Historia</div>
          </div>
        </div>
      </div>
    </section>
  )
}
