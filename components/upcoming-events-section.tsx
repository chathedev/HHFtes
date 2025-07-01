"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarDays } from "lucide-react"
import { cn } from "@/lib/utils"
import type { PageContent } from "@/lib/content-store"

interface SelectedElementData {
  sectionKey: keyof PageContent
  elementId: string
  type: "text" | "number" | "link" | "image" | "button" | "color" | "font-size" | "select"
  label: string
  currentValue: string | number
  contentPath?: string
  additionalFields?: {
    field: string
    label: string
    type: "text" | "select" | "color" | "font-size" | "number"
    currentValue: string | number
    options?: { name: string; value: string; bgClass?: string; textClass?: string }[]
  }[]
}

interface UpcomingEventsSectionProps {
  content: any // Assuming upcomingEvents might not be fully defined in PageContent yet
  isEditing?: boolean
  onElementSelect: (data: SelectedElementData) => void
}

export default function UpcomingEventsSection({
  content,
  isEditing = false,
  onElementSelect,
}: UpcomingEventsSectionProps) {
  // Placeholder for events data. In a real app, this would come from an API or content store.
  // For editing purposes, we'll make these editable via the sidebar if isEditing is true.
  const events = [
    {
      date: "2024-10-26",
      time: "14:00",
      title: "Herrar Div 1: Härnösands HF vs. IFK Skövde HK",
      location: "Härnösands Arena",
    },
    {
      date: "2024-11-02",
      time: "16:00",
      title: "Damer Div 2: Härnösands HF vs. Strands IF",
      location: "Härnösands Arena",
    },
    {
      date: "2024-11-09",
      time: "10:00",
      title: "Ungdomscup: Härnösand Cup",
      location: "Härnösands Arena",
    },
  ]

  const handleTextClick = (index: number, field: "title" | "date" | "time" | "location", label: string) => {
    if (isEditing) {
      onElementSelect({
        sectionKey: "upcomingEvents", // This section key would need to be added to PageContent
        elementId: `event-${index}-${field}`,
        type: "text",
        label: label,
        currentValue: events[index][field],
      })
    }
  }

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100">
      <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
        <div className="space-y-3">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Kommande <span className="text-orange-500">Evenemang</span>
          </h2>
          <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
            Håll dig uppdaterad med våra senaste matcher och evenemang.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.length > 0 ? (
            events.map((event, index) => (
              <Card key={index} className="flex flex-col">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle
                    className={cn(
                      "text-sm font-medium",
                      isEditing &&
                        "cursor-pointer group hover:outline hover:outline-2 hover:outline-gray-300 rounded px-1",
                    )}
                    onClick={() => handleTextClick(index, "title", "Titel")}
                  >
                    {event.title}
                  </CardTitle>
                  <CalendarDays className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    <span
                      className={cn(
                        isEditing &&
                          "cursor-pointer group hover:outline hover:outline-2 hover:outline-gray-300 rounded px-1",
                      )}
                      onClick={() => handleTextClick(index, "date", "Datum")}
                    >
                      {event.date}
                    </span>{" "}
                    kl{" "}
                    <span
                      className={cn(
                        isEditing &&
                          "cursor-pointer group hover:outline hover:outline-2 hover:outline-gray-300 rounded px-1",
                      )}
                      onClick={() => handleTextClick(index, "time", "Tid")}
                    >
                      {event.time}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Plats:{" "}
                    <span
                      className={cn(
                        isEditing &&
                          "cursor-pointer group hover:outline hover:outline-2 hover:outline-gray-300 rounded px-1",
                      )}
                      onClick={() => handleTextClick(index, "location", "Plats")}
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

export { default as UpcomingEventsSection } from "./upcoming-events-section"
