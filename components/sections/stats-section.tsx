"use client"

import type { ReactElement } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Users, Trophy, CalendarDays, ShieldCheck } from "lucide-react"
import { cn } from "@/lib/utils"
import type { PageContent } from "@/lib/content-store"

interface SelectedElementData {
  sectionKey: keyof PageContent
  elementId: string
  type: "text" | "number" | "link" | "image" | "button" | "color" | "font-size" | "select"
  label: string
  currentValue: string | number
  contentPath: string
  additionalFields?: {
    field: string
    label: string
    type: "text" | "select" | "color" | "font-size" | "number"
    currentValue: string | number
    options?: { name: string; value: string; bgClass?: string; textClass?: string }[]
  }[]
}

interface StatsSectionProps {
  content: PageContent["stats"]
  isEditing?: boolean
  onElementSelect: (data: SelectedElementData) => void
  handleInlineEdit: (path: string, newValue: string) => void
}

export default function StatsSection({
  content,
  isEditing = false,
  onElementSelect,
  handleInlineEdit,
}: StatsSectionProps): ReactElement {
  const handleStatClick = (field: keyof PageContent["stats"], label: string, type: "text" | "number") => {
    if (isEditing) {
      onElementSelect({
        sectionKey: "stats",
        elementId: field,
        type: type,
        label: label,
        currentValue: content[field],
        contentPath: `stats.${field}`,
      })
    }
  }

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-green-600 text-white">
      <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
        <div className="space-y-3">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Klubben i <span className="text-orange-500">Siffror</span>
          </h2>
          <p className="mx-auto max-w-[700px] text-gray-200 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            En översikt över Härnösands FF:s styrka och historia.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card
            className={cn(
              "flex flex-col items-center justify-center p-6 bg-white/10 text-white border-white/20",
              isEditing && "cursor-pointer group hover:outline hover:outline-2 hover:outline-white rounded",
            )}
            onClick={() => handleStatClick("totalTeams", "Totalt antal lag", "number")}
          >
            <CardHeader>
              <Users className="h-10 w-10 text-white" />
            </CardHeader>
            <CardContent className="text-center">
              <div
                className="text-5xl font-bold"
                contentEditable={isEditing}
                suppressContentEditableWarning={true}
                onBlur={(e) => handleInlineEdit("stats.totalTeams", e.currentTarget.innerText)}
              >
                {content.totalTeams}
              </div>
              <p className="text-sm text-gray-200">Totalt antal lag</p>
            </CardContent>
          </Card>
          <Card
            className={cn(
              "flex flex-col items-center justify-center p-6 bg-white/10 text-white border-white/20",
              isEditing && "cursor-pointer group hover:outline hover:outline-2 hover:outline-white rounded",
            )}
            onClick={() => handleStatClick("aTeams", "A-lag", "number")}
          >
            <CardHeader>
              <Trophy className="h-10 w-10 text-white" />
            </CardHeader>
            <CardContent className="text-center">
              <div
                className="text-5xl font-bold"
                contentEditable={isEditing}
                suppressContentEditableWarning={true}
                onBlur={(e) => handleInlineEdit("stats.aTeams", e.currentTarget.innerText)}
              >
                {content.aTeams}
              </div>
              <p className="text-sm text-gray-200">A-lag</p>
            </CardContent>
          </Card>
          <Card
            className={cn(
              "flex flex-col items-center justify-center p-6 bg-white/10 text-white border-white/20",
              isEditing && "cursor-pointer group hover:outline hover:outline-2 hover:outline-white rounded",
            )}
            onClick={() => handleStatClick("youthTeams", "Ungdomslag", "number")}
          >
            <CardHeader>
              <ShieldCheck className="h-10 w-10 text-white" />
            </CardHeader>
            <CardContent className="text-center">
              <div
                className="text-5xl font-bold"
                contentEditable={isEditing}
                suppressContentEditableWarning={true}
                onBlur={(e) => handleInlineEdit("stats.youthTeams", e.currentTarget.innerText)}
              >
                {content.youthTeams}
              </div>
              <p className="text-sm text-gray-200">Ungdomslag</p>
            </CardContent>
          </Card>
          <Card
            className={cn(
              "flex flex-col items-center justify-center p-6 bg-white/10 text-white border-white/20",
              isEditing && "cursor-pointer group hover:outline hover:outline-2 hover:outline-white rounded",
            )}
            onClick={() => handleStatClick("historyYears", "År i historien", "text")}
          >
            <CardHeader>
              <CalendarDays className="h-10 w-10 text-white" />
            </CardHeader>
            <CardContent className="text-center">
              <div
                className="text-5xl font-bold"
                contentEditable={isEditing}
                suppressContentEditableWarning={true}
                onBlur={(e) => handleInlineEdit("stats.historyYears", e.currentTarget.innerText)}
              >
                {content.historyYears}
              </div>
              <p className="text-sm text-gray-200">År i historien</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
