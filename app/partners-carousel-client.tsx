"use client"

import Image from "next/image"
import { Card } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import { allPartners } from "@/lib/partners-data"

export function PartnersCarouselClient() {
  const visiblePartners = allPartners.filter((p) => p.visibleInCarousel)

  return (
    <Carousel
      opts={{
        align: "start",
        loop: true,
      }}
      plugins={[
        Autoplay({
          delay: 3000,
          stopOnInteraction: false,
          stopOnMouseEnter: true,
        }),
      ]}
      className="w-full max-w-6xl mx-auto"
    >
      <CarouselContent className="-ml-4">
        {visiblePartners.map((partner, index) => (
          <CarouselItem key={index} className="pl-4 basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5">
            <div className="p-1">
              <Card className="flex aspect-square items-center justify-center p-6 h-32 w-full">
                <Image
                  src={partner.src || "/placeholder.svg"}
                  alt={partner.alt}
                  width={120}
                  height={80}
                  className="object-contain max-h-full max-w-full"
                />
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}
