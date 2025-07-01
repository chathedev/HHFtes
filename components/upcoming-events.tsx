"use client"

import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { PageContent } from "@/lib/content-store"

interface UpcomingEventsProps {
  content: PageContent["upcomingEvents"] // Assuming upcomingEvents is added to PageContent
  isEditing?: boolean
  onContentChange?: (field: keyof PageContent["upcomingEvents"], value: string | number) => void
}

export default function UpcomingEvents({ content, isEditing = false, onContentChange }: UpcomingEventsProps) {
  const events = [
    {
      title: "Träningsmatch: Härnösands FF vs. Sundsvall FF",
      date: "2024-03-10",
      time: "14:00",
      location: "Härnösands Arena",
    },
    {
      title: "Seriepremiär: Härnösands FF vs. Östersunds FK",
      date: "2024-04-05",
      time: "19:00",
      location: "Härnösands Arena",
    },
    {
      title: "Ungdomsturnering: Härnösands Cup",
      date: "2024-05-12",
      time: "09:00",
      location: "Härnösands Arena",
    },
  ]

  const handleTextChange = (field: keyof PageContent["upcomingEvents"], e: React.ChangeEvent<HTMLDivElement>) => {
    if (onContentChange) {
      onContentChange(field, e.currentTarget.innerText)
    }
  }

  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
        <div className="space-y-3">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Kommande Evenemang</h2>
          <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
            Håll dig uppdaterad med de senaste matcherna och evenemangen.
          </p>
        </div>
        <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>{event.title}</CardTitle>
                <CardDescription>
                  {event.date} - {event.time}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">{event.location}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
