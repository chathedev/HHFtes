"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import type { HeroContent } from "@/lib/content-types"
import LazyImage from "@/components/lazy-image"

interface HeroProps {
  content: HeroContent
}

export default function Hero({ content }: HeroProps) {
  return (
    <section className="relative bg-gradient-to-br from-green-700 via-green-600 to-orange-500 text-white overflow-hidden">
      {/* Background Image with Lazy Loading */}
      <div className="absolute inset-0">
        <LazyImage
          src="/placeholder.svg?height=800&width=1200"
          alt="Handball action background"
          fill
          className="object-cover opacity-20"
          priority={true} // Hero image should load immediately
          sizes="100vw"
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-24 md:py-32 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">{content.title}</h1>
          <p className="text-xl md:text-2xl mb-8 leading-relaxed opacity-90">{content.subtitle}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-lg transition-all duration-300 hover:scale-105"
            >
              <Link href={content.primaryButtonLink}>{content.primaryButtonText}</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-2 border-white text-white hover:bg-white hover:text-green-700 px-8 py-4 text-lg font-semibold rounded-full shadow-lg transition-all duration-300 hover:scale-105 bg-transparent"
            >
              <Link href={content.secondaryButtonLink}>{content.secondaryButtonText}</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
