"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarDays } from "lucide-react"

interface UpcomingEventsProps {
  content: any // Assuming upcomingEvents might not be fully defined in PageContent yet
  isEditing?: boolean
  onContentChange?: (field: string, value: string | number) => void
}

export default function UpcomingEvents({ content, isEditing = false, onContentChange }: UpcomingEventsProps) {
  // Placeholder for events data. In a real app, this would come from an API or content store.
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

  const handleTextChange = (field: string, e: React.ChangeEvent<HTMLDivElement>) => {
    if (onContentChange) {
      // This section's content is hardcoded, so direct editing won't persist without
      // a more complex data structure for events in content-store.ts.
      // For now, this will only update the local state if content.upcomingEvents was a real object.
      // To make actual event details editable, you'd need to define them in PageContent.
      console.warn(`Attempted to edit hardcoded event text: ${field} - ${e.currentTarget.innerText}`)
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
          {events.map((event, index) => (
            <Card key={index} className="flex flex-col">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  <span
                    contentEditable={isEditing}
                    suppressContentEditableWarning={true}
                    onBlur={(e) => handleTextChange(`event-${index}-title`, e)}
                    className="outline-none focus:ring-2 focus:ring-gray-300 rounded px-1"
                  >
                    {event.title}
                  </span>
                </CardTitle>
                <CalendarDays className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  <span
                    contentEditable={isEditing}
                    suppressContentEditableWarning={true}
                    onBlur={(e) => handleTextChange(`event-${index}-date`, e)}
                    className="outline-none focus:ring-2 focus:ring-gray-300 rounded px-1"
                  >
                    {event.date}
                  </span>{" "}
                  kl{" "}
                  <span
                    contentEditable={isEditing}
                    suppressContentEditableWarning={true}
                    onBlur={(e) => handleTextChange(`event-${index}-time`, e)}
                    className="outline-none focus:ring-2 focus:ring-gray-300 rounded px-1"
                  >
                    {event.time}
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Plats:{" "}
                  <span
                    contentEditable={isEditing}
                    suppressContentEditableWarning={true}
                    onBlur={(e) => handleTextChange(`event-${index}-location`, e)}
                    className="outline-none focus:ring-2 focus:ring-gray-300 rounded px-1"
                  >
                    {event.location}
                  </span>
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
