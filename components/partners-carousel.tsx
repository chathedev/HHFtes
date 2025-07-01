"use client"

import type React from "react"

import Image from "next/image"
import Link from "next/link"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Card, CardContent } from "@/components/ui/card"
import type { PageContent } from "@/lib/content-store"

interface PartnersCarouselProps {
  content: PageContent["partnersCarousel"]
  isEditing?: boolean
  onContentChange?: (field: keyof PageContent["partnersCarousel"], value: string | number) => void
  availablePages: { name: string; path: string }[]
}

export default function PartnersCarousel({
  content,
  isEditing = false,
  onContentChange,
  availablePages,
}: PartnersCarouselProps) {
  const partners = [
    {
      name: "Acme Inc.",
      logo: "/placeholder-logo.png",
    },
    {
      name: "Globex Corp.",
      logo: "/placeholder-logo.png",
    },
    {
      name: "Soylent Corp.",
      logo: "/placeholder-logo.png",
    },
    {
      name: "Initech",
      logo: "/placeholder-logo.png",
    },
    {
      name: "Umbrella Corp.",
      logo: "/placeholder-logo.png",
    },
  ]

  const handleTextChange = (field: keyof PageContent["partnersCarousel"], e: React.ChangeEvent<HTMLDivElement>) => {
    if (onContentChange) {
      onContentChange(field, e.currentTarget.innerText)
    }
  }

  // Note: Link changes are handled by the dialog in HeroSection, not direct editing here.
  // If you want to make these links editable directly, you'd need a similar mechanism.

  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
        <div className="space-y-3">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            <span
              contentEditable={isEditing}
              suppressContentEditableWarning={true}
              onBlur={(e) => handleTextChange("title", e.currentTarget.innerText)}
              className="outline-none focus:ring-2 focus:ring-gray-300 rounded px-1"
            >
              {content.title}
            </span>
          </h2>
          <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
            <span
              contentEditable={isEditing}
              suppressContentEditableWarning={true}
              onBlur={(e) => handleTextChange("description", e.currentTarget.innerText)}
              className="outline-none focus:ring-2 focus:ring-gray-300 rounded px-1"
            >
              {content.description}
            </span>
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
            <CarouselContent className="-ml-1">
              {partners.map((partner, index) => (
                <CarouselItem key={index} className="pl-1 md:basis-1/2 lg:basis-1/3">
                  <div className="p-1">
                    <Card>
                      <CardContent className="flex aspect-square items-center justify-center p-6">
                        <Image
                          src={partner.logo || "/placeholder.svg"}
                          alt={partner.name}
                          width={150}
                          height={150}
                          className="object-contain"
                        />
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
        <div className="mt-8 space-y-4">
          <h3 className="text-2xl font-bold">
            <span
              contentEditable={isEditing}
              suppressContentEditableWarning={true}
              onBlur={(e) => handleTextChange("callToActionTitle", e.currentTarget.innerText)}
              className="outline-none focus:ring-2 focus:ring-gray-300 rounded px-1"
            >
              {content.callToActionTitle}
            </span>
          </h3>
          <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
            <span
              contentEditable={isEditing}
              suppressContentEditableWarning={true}
              onBlur={(e) => handleTextChange("callToActionDescription", e.currentTarget.innerText)}
              className="outline-none focus:ring-2 focus:ring-gray-300 rounded px-1"
            >
              {content.callToActionDescription}
            </span>
          </p>
          <Link
            href={content.callToActionLink}
            className="inline-flex h-10 items-center justify-center rounded-md bg-green-600 px-8 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-green-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-green-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-green-500 dark:text-gray-900 dark:hover:bg-green-600 dark:focus-visible:ring-green-300"
          >
            <span
              contentEditable={isEditing}
              suppressContentEditableWarning={true}
              onBlur={(e) => handleTextChange("callToActionLinkText", e.currentTarget.innerText)}
              className="outline-none focus:ring-2 focus:ring-white rounded px-1"
            >
              {content.callToActionLinkText}
            </span>
          </Link>
        </div>
      </div>
    </section>
  )
}
