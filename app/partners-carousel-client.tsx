"use client"

import Image from "next/image"
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import * as React from "react"

interface Partner {
  name: string
  logo: string
  url: string
}

interface PartnersCarouselClientProps {
  partners: Partner[]
}

export function PartnersCarouselClient({ partners }: PartnersCarouselClientProps) {
  const plugin = React.useRef(Autoplay({ delay: 3000, stopOnInteraction: false }))

  return (
    <Carousel
      plugins={[plugin.current]}
      className="w-full max-w-6xl mx-auto"
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.play}
    >
      <CarouselContent className="-ml-4">
        {partners.map((partner, index) => (
          <CarouselItem key={index} className="pl-4 basis-1/2 md:basis-1/3 lg:basis-1/4">
            <div className="p-1">
              <a
                href={partner.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center h-24 bg-white rounded-lg shadow-md p-4 transition-transform duration-300 hover:scale-105"
              >
                <Image
                  src={partner.logo || "/placeholder.svg"}
                  alt={partner.name}
                  width={150}
                  height={60}
                  objectFit="contain"
                  className="max-h-full max-w-full"
                />
              </a>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  )
}
