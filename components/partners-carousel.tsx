"use client"

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import { partners } from "@/lib/partners-data"
import Link from "next/link"

interface PartnersCarouselProps {
  title: string
  description: string
  callToActionTitle: string
  callToActionDescription: string
  callToActionLinkText: string
  callToActionLink: string
}

export function PartnersCarousel({
  title,
  description,
  callToActionTitle,
  callToActionDescription,
  callToActionLinkText,
  callToActionLink,
}: PartnersCarouselProps) {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">{title}</h2>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              {description}
            </p>
          </div>
        </div>
        <div className="mt-8">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full max-w-6xl mx-auto"
          >
            <CarouselContent className="-ml-4">
              {partners.map((partner, index) => (
                <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/3">
                  <div className="p-1">
                    <Card className="flex flex-col items-center justify-center p-6 h-48">
                      <CardContent className="flex flex-col items-center justify-center p-0">
                        <Image
                          alt={partner.name}
                          className="aspect-[2/1] overflow-hidden rounded-lg object-contain object-center"
                          height="80"
                          src={partner.logo || "/placeholder.svg"}
                          width="160"
                          unoptimized // Use unoptimized for external images if you don't want Next.js Image optimization
                        />
                        <h3 className="text-lg font-semibold mt-4">{partner.name}</h3>
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
        <div className="mt-12 text-center">
          <h3 className="text-2xl font-bold">{callToActionTitle}</h3>
          <p className="mt-2 text-gray-500 dark:text-gray-400">{callToActionDescription}</p>
          <Link
            className="mt-4 inline-flex h-10 items-center justify-center rounded-md bg-orange-500 px-8 text-sm font-medium text-white shadow transition-colors hover:bg-orange-600 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-orange-700 disabled:pointer-events-none disabled:opacity-50"
            href={callToActionLink}
          >
            {callToActionLinkText}
          </Link>
        </div>
      </div>
    </section>
  )
}
