"use client"
import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"

interface PartnersCarouselSectionProps {
  className?: string
  isEditing?: boolean
  content: {
    title: string
    description: string
    callToActionTitle: string
    callToActionDescription: string
    callToActionLinkText: string
    callToActionLink: string
  }
  onContentChange?: (newContent: any) => void
}

export function PartnersCarouselSection({
  className,
  isEditing = false,
  content,
  onContentChange,
}: PartnersCarouselSectionProps) {
  const handleChange = (field: string, value: string) => {
    if (onContentChange) {
      onContentChange({
        ...content,
        [field]: value,
      })
    }
  }

  // Sample partner logos for demonstration
  const partnerLogos = [
    "/placeholder-logo.png",
    "/placeholder-logo.png",
    "/placeholder-logo.png",
    "/placeholder-logo.png",
    "/placeholder-logo.png",
    "/placeholder-logo.png",
  ]

  return (
    <section className={cn("py-12 md:py-16 lg:py-20", className)}>
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center text-center mb-10">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">
            {isEditing ? (
              <input
                type="text"
                value={content.title}
                onChange={(e) => handleChange("title", e.target.value)}
                className="w-full text-center border rounded px-2"
              />
            ) : (
              content.title
            )}
          </h2>
          <p className="max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            {isEditing ? (
              <textarea
                value={content.description}
                onChange={(e) => handleChange("description", e.target.value)}
                className="w-full text-center border rounded px-2"
                rows={3}
              />
            ) : (
              content.description
            )}
          </p>
        </div>

        <Carousel className="w-full max-w-5xl mx-auto">
          <CarouselContent>
            {partnerLogos.map((logo, index) => (
              <CarouselItem key={index} className="md:basis-1/3 lg:basis-1/4">
                <div className="p-4">
                  <div className="flex items-center justify-center h-24 bg-white rounded-lg shadow-sm p-4">
                    <Image
                      src={logo || "/placeholder.svg"}
                      alt={`Partner ${index + 1}`}
                      width={120}
                      height={60}
                      className="object-contain"
                    />
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex justify-center mt-6">
            <CarouselPrevious className="relative mr-2" />
            <CarouselNext className="relative ml-2" />
          </div>
        </Carousel>

        <div className="mt-16 bg-gray-50 rounded-lg p-8 max-w-3xl mx-auto">
          <h3 className="text-2xl font-bold mb-4">
            {isEditing ? (
              <input
                type="text"
                value={content.callToActionTitle}
                onChange={(e) => handleChange("callToActionTitle", e.target.value)}
                className="w-full border rounded px-2"
              />
            ) : (
              content.callToActionTitle
            )}
          </h3>
          <p className="text-gray-500 mb-6">
            {isEditing ? (
              <textarea
                value={content.callToActionDescription}
                onChange={(e) => handleChange("callToActionDescription", e.target.value)}
                className="w-full border rounded px-2"
                rows={3}
              />
            ) : (
              content.callToActionDescription
            )}
          </p>
          {isEditing ? (
            <div className="flex flex-col gap-2">
              <input
                type="text"
                value={content.callToActionLinkText}
                onChange={(e) => handleChange("callToActionLinkText", e.target.value)}
                className="w-full border rounded px-2"
                placeholder="Länktext"
              />
              <input
                type="text"
                value={content.callToActionLink}
                onChange={(e) => handleChange("callToActionLink", e.target.value)}
                className="w-full border rounded px-2"
                placeholder="Länk URL"
              />
            </div>
          ) : (
            <Button asChild>
              <Link href={content.callToActionLink}>{content.callToActionLinkText}</Link>
            </Button>
          )}
        </div>
      </div>
    </section>
  )
}

// Add default export for backward compatibility
export default PartnersCarouselSection
