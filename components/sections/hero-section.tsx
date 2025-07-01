"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

interface HeroProps {
  content: {
    title: string
    description: string
    imageUrl: string
    button1Text: string
    button1Link: string
    button2Text: string
    button2Link: string
  }
  isEditing?: boolean
  onContentChange?: (field: string, value: string) => void
}

export function HeroSection({ content, isEditing = false, onContentChange }: HeroProps) {
  const handleChange = (field: string, value: string) => {
    if (isEditing && onContentChange) {
      onContentChange(field, value)
    }
  }

  return (
    <section className="relative h-screen min-h-[600px] w-full overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={content.imageUrl || "/placeholder.svg?height=1080&width=1920&query=sports+team"}
          alt="Härnösands HF"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex h-full items-center">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            {isEditing ? (
              <textarea
                value={content.title}
                onChange={(e) => handleChange("title", e.target.value)}
                className="mb-4 w-full resize-none bg-transparent text-4xl font-bold text-white md:text-6xl lg:text-7xl"
                style={{ background: "rgba(0,0,0,0.3)" }}
              />
            ) : (
              <h1 className="mb-4 text-4xl font-bold text-white md:text-6xl lg:text-7xl">{content.title}</h1>
            )}

            {isEditing ? (
              <textarea
                value={content.description}
                onChange={(e) => handleChange("description", e.target.value)}
                className="mb-8 w-full resize-none bg-transparent text-lg text-white/90 md:text-xl lg:text-2xl"
                style={{ background: "rgba(0,0,0,0.3)" }}
                rows={3}
              />
            ) : (
              <p className="mb-8 text-lg text-white/90 md:text-xl lg:text-2xl">{content.description}</p>
            )}

            <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
              {isEditing ? (
                <div className="flex flex-col space-y-2">
                  <input
                    type="text"
                    value={content.button1Text}
                    onChange={(e) => handleChange("button1Text", e.target.value)}
                    className="rounded border border-gray-300 bg-white px-4 py-2 text-black"
                    placeholder="Button 1 Text"
                  />
                  <input
                    type="text"
                    value={content.button1Link}
                    onChange={(e) => handleChange("button1Link", e.target.value)}
                    className="rounded border border-gray-300 bg-white px-4 py-2 text-black"
                    placeholder="Button 1 Link"
                  />
                </div>
              ) : (
                <Button asChild size="lg" className="bg-orange-600 hover:bg-orange-700">
                  <Link href={content.button1Link}>{content.button1Text}</Link>
                </Button>
              )}

              {isEditing ? (
                <div className="flex flex-col space-y-2">
                  <input
                    type="text"
                    value={content.button2Text}
                    onChange={(e) => handleChange("button2Text", e.target.value)}
                    className="rounded border border-gray-300 bg-white px-4 py-2 text-black"
                    placeholder="Button 2 Text"
                  />
                  <input
                    type="text"
                    value={content.button2Link}
                    onChange={(e) => handleChange("button2Link", e.target.value)}
                    className="rounded border border-gray-300 bg-white px-4 py-2 text-black"
                    placeholder="Button 2 Link"
                  />
                </div>
              ) : (
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/20 bg-transparent"
                >
                  <Link href={content.button2Link}>{content.button2Text}</Link>
                </Button>
              )}
            </div>

            {isEditing && (
              <div className="mt-8">
                <label className="block text-sm font-medium text-white">Hero Image URL:</label>
                <input
                  type="text"
                  value={content.imageUrl}
                  onChange={(e) => handleChange("imageUrl", e.target.value)}
                  className="mt-1 w-full rounded border border-gray-300 bg-white px-4 py-2 text-black"
                  placeholder="Image URL"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
