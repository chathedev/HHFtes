"use client"

import type { ReactElement } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarDays } from "lucide-react"
import { cn } from "@/lib/utils"
import type { PageContent, EventItem } from "@/lib/content-store"

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

interface UpcomingEventsSectionProps {
  content: EventItem[]
  isEditing?: boolean
  onElementSelect: (data: SelectedElementData) => void
  handleInlineEdit: (path: string, newValue: string) => void
}

export default function UpcomingEventsSection({
  content,
  isEditing = false,
  onElementSelect,
  handleInlineEdit,
}: UpcomingEventsSectionProps): ReactElement {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100">
      <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
        <div className="space-y-3">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Kommande <span className="text-orange-500">Evenemang</span>
          </h2>
          <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Håll dig uppdaterad med våra senaste matcher och evenemang.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {content.length > 0 ? (
            content.map((event, index) => (
              <Card key={index} className="flex flex-col">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle
                    className={cn(
                      "text-sm font-medium",
                      isEditing &&
                        "cursor-text group hover:outline hover:outline-2 hover:outline-gray-300 rounded px-1",
                    )}
                    contentEditable={isEditing}
                    suppressContentEditableWarning={true}
                    onBlur={(e) => handleInlineEdit(`upcomingEvents.${index}.title`, e.currentTarget.innerText)}
                  >
                    {event.title}
                  </CardTitle>
                  <CalendarDays className="h-4 w-4 text-gray-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    <span
                      className={cn(
                        isEditing &&
                          "cursor-text group hover:outline hover:outline-2 hover:outline-gray-300 rounded px-1",
                      )}
                      contentEditable={isEditing}
                      suppressContentEditableWarning={true}
                      onBlur={(e) => handleInlineEdit(`upcomingEvents.${index}.date`, e.currentTarget.innerText)}
                    >
                      {event.date}
                    </span>{" "}
                    kl{" "}
                    <span
                      className={cn(
                        isEditing &&
                          "cursor-text group hover:outline hover:outline-2 hover:outline-gray-300 rounded px-1",
                      )}
                      contentEditable={isEditing}
                      suppressContentEditableWarning={true}
                      onBlur={(e) => handleInlineEdit(`upcomingEvents.${index}.time`, e.currentTarget.innerText)}
                    >
                      {event.time}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    Plats:{" "}
                    <span
                      className={cn(
                        isEditing &&
                          "cursor-text group hover:outline hover:outline-2 hover:outline-gray-300 rounded px-1",
                      )}
                      contentEditable={isEditing}
                      suppressContentEditableWarning={true}
                      onBlur={(e) => handleInlineEdit(`upcomingEvents.${index}.location`, e.currentTarget.innerText)}
                    >
                      {event.location}
                    </span>
                  </p>
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="col-span-full text-center text-gray-600">Inga kommande evenemang planerade.</p>
          )}
        </div>
      </div>
    </section>
  )
}
