"use client"

import type React from "react"
import type { PageContent } from "@/lib/content-store"

interface StatsProps {
  content: PageContent["stats"]
  isEditing?: boolean
  onContentChange?: (field: keyof PageContent["stats"], value: string | number) => void
}

export default function Stats({ content, isEditing = false, onContentChange }: StatsProps) {
  const handleTextChange = (field: keyof PageContent["stats"], e: React.ChangeEvent<HTMLDivElement>) => {
    if (onContentChange) {
      onContentChange(field, e.currentTarget.innerText)
    }
  }

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100">
      <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
        <div className="space-y-3">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            <span
              contentEditable={isEditing}
              suppressContentEditableWarning={true}
              onBlur={(e) => handleTextChange("totalTeams", Number.parseInt(e.currentTarget.innerText) || 0)}
              className="outline-none focus:ring-2 focus:ring-gray-300 rounded px-1"
            >
              {content.totalTeams}
            </span>{" "}
            Aktiva lag
          </h2>
          <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
            <span
              contentEditable={isEditing}
              suppressContentEditableWarning={true}
              onBlur={(e) => handleTextChange("aTeams", Number.parseInt(e.currentTarget.innerText) || 0)}
              className="outline-none focus:ring-2 focus:ring-gray-300 rounded px-1"
            >
              {content.aTeams}
            </span>{" "}
            A-lag,{" "}
            <span
              contentEditable={isEditing}
              suppressContentEditableWarning={true}
              onBlur={(e) => handleTextChange("youthTeams", Number.parseInt(e.currentTarget.innerText) || 0)}
              className="outline-none focus:ring-2 focus:ring-gray-300 rounded px-1"
            >
              {content.youthTeams}
            </span>{" "}
            ungdomslag och en historia som sträcker sig tillbaka till{" "}
            <span
              contentEditable={isEditing}
              suppressContentEditableWarning={true}
              onBlur={(e) => handleTextChange("historyYears", e.currentTarget.innerText)}
              className="outline-none focus:ring-2 focus:ring-gray-300 rounded px-1"
            >
              {content.historyYears}
            </span>
            -talet.
          </p>
        </div>
      </div>
    </section>
  )
}
