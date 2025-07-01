"use client"

import type { ReactElement } from "react"
import Link from "next/link"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import Image from "next/image"
import { partners } from "@/lib/partners-data"
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

interface PartnersCarouselSectionProps {
  content: PageContent["partnersCarousel"]
  isEditing?: boolean
  onElementSelect: (data: SelectedElementData) => void
  availablePages?: { name: string; path: string }[]
}

export default function PartnersCarouselSection({
  content,
  isEditing = false,
  onElementSelect,
  availablePages,
}: PartnersCarouselSectionProps): ReactElement {
  const handleTextClick = (field: keyof PageContent["partnersCarousel"], label: string) => {
    if (isEditing) {
      onElementSelect({
        sectionKey: "partnersCarousel",
        elementId: field,
        type: "text",
        label: label,
        currentValue: content[field] as string,
      })
    }
  }

  const handleButtonClick = () => {
    if (isEditing) {
      onElementSelect({
        sectionKey: "partnersCarousel",
        elementId: "callToActionLinkText",
        type: "button",
        label: "Länktext",
        currentValue: content.callToActionLinkText,
        additionalFields: [
          {
            field: "callToActionLink",
            label: "Länk URL",
            type: "select",
            currentValue: content.callToActionLink,
            options: availablePages || [],
          },
        ],
      })
    }
  }

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100">
      <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
        <div className="space-y-3">
          <h2
            className={cn(
              "text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl",
              isEditing && "cursor-pointer group hover:outline hover:outline-2 hover:outline-gray-300 rounded px-1",
            )}
            onClick={() => handleTextClick("title", "Titel")}
          >
            {content.title}
          </h2>
          <p
            className={cn(
              "mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400",
              isEditing && "cursor-pointer group hover:outline hover:outline-2 hover:outline-gray-300 rounded px-1",
            )}
            onClick={() => handleTextClick("description", "Beskrivning")}
          >
            {content.description}
          </p>
        </div>
        <div className="w-full max-w-5xl mx-auto">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {partners.map((partner, index) => (
                <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/3">
                  <div className="p-1">
                    <div className="flex aspect-square items-center justify-center p-6 bg-white rounded-lg shadow-sm">
                      <Image
                        src={partner.logo || "/placeholder.svg"}
                        alt={partner.name}
                        width={150}
                        height={150}
                        objectFit="contain"
                        className="max-h-[150px] max-w-[150px]"
                      />
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
        <div className="mt-12 space-y-4">
          <h3
            className={cn(
              "text-2xl font-bold",
              isEditing && "cursor-pointer group hover:outline hover:outline-2 hover:outline-gray-300 rounded px-1",
            )}
            onClick={() => handleTextClick("callToActionTitle", "Call to Action Titel")}
          >
            {content.callToActionTitle}
          </h3>
          <p
            className={cn(
              "mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400",
              isEditing && "cursor-pointer group hover:outline hover:outline-2 hover:outline-gray-300 rounded px-1",
            )}
            onClick={() => handleTextClick("callToActionDescription", "Call to Action Beskrivning")}
          >
            {content.callToActionDescription}
          </p>
          <Link
            href={content.callToActionLink}
            className={cn(
              "inline-flex h-10 items-center justify-center rounded-md bg-green-600 px-8 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-green-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-green-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-green-500 dark:text-gray-900 dark:hover:bg-green-600 dark:focus-visible:ring-green-300",
              isEditing && "cursor-pointer group hover:outline hover:outline-2 hover:outline-gray-300 rounded px-1",
            )}
            onClick={(e) => {
              if (isEditing) {
                e.preventDefault()
                handleButtonClick()
              }
            }}
          >
            {content.callToActionLinkText}
          </Link>
        </div>
      </div>
    </section>
  )
}

export { default as PartnersCarouselSection } from "./partners-carousel-section"
