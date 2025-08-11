import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import type { AboutClubContent } from "@/lib/content-types"
import LazyImage from "@/components/lazy-image"

interface AboutClubProps {
  content: AboutClubContent
}

export default function AboutClub({ content }: AboutClubProps) {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">{content.title}</h2>
            <p className="text-lg text-gray-700 leading-relaxed">{content.description}</p>
            <div className="grid grid-cols-2 gap-6">
              {content.features.map((feature, index) => (
                <Card key={index} className="p-4 text-center">
                  <CardContent className="p-0">
                    <div className="text-3xl font-bold text-green-600 mb-2">{feature.value}</div>
                    <div className="text-sm text-gray-600">{feature.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="bg-green-700 hover:bg-green-800 text-white">
                <Link href={content.primaryButtonLink}>{content.primaryButtonText}</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-green-700 text-green-700 hover:bg-green-50 bg-transparent"
              >
                <Link href={content.secondaryButtonLink}>{content.secondaryButtonText}</Link>
              </Button>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
              <LazyImage
                src="/placeholder.svg?height=600&width=800"
                alt="Härnösands HF team"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
