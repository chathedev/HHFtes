import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"

interface PartnersCarouselProps {
  content: {
    title: string
    description: string
    callToActionTitle: string
    callToActionDescription: string
    callToActionLinkText: string
    callToActionLink: string
  }
}

export function PartnersCarouselSection({ content }: PartnersCarouselProps) {
  // Sample partner logos - in a real app, these would come from the CMS
  const partners = [
    { name: "Partner 1", logo: "/placeholder-logo.png" },
    { name: "Partner 2", logo: "/placeholder-logo.png" },
    { name: "Partner 3", logo: "/placeholder-logo.png" },
    { name: "Partner 4", logo: "/placeholder-logo.png" },
    { name: "Partner 5", logo: "/placeholder-logo.png" },
    { name: "Partner 6", logo: "/placeholder-logo.png" },
  ]

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">{content.title}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">{content.description}</p>
        </div>

        <Carousel className="w-full max-w-5xl mx-auto">
          <CarouselContent>
            {partners.map((partner, index) => (
              <CarouselItem key={index} className="md:basis-1/3 lg:basis-1/4">
                <div className="p-4">
                  <div className="bg-white rounded-lg p-6 h-32 flex items-center justify-center">
                    <Image
                      src={partner.logo || "/placeholder.svg"}
                      alt={partner.name}
                      width={120}
                      height={80}
                      className="object-contain"
                    />
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex justify-center mt-4">
            <CarouselPrevious className="relative mr-2" />
            <CarouselNext className="relative" />
          </div>
        </Carousel>

        <div className="mt-16 bg-gray-100 rounded-lg p-8 max-w-3xl mx-auto text-center">
          <h3 className="text-2xl font-bold mb-3">{content.callToActionTitle}</h3>
          <p className="text-gray-600 mb-6">{content.callToActionDescription}</p>
          <Button asChild>
            <Link href={content.callToActionLink}>{content.callToActionLinkText}</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

export default PartnersCarouselSection
