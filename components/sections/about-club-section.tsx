"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Heart, Lightbulb, Users } from "lucide-react"

interface AboutClubProps {
  content: {
    title: string
    paragraph1: string
    paragraph2: string
    passionText: string
    developmentText: string
    communityText: string
    button1Text: string
    button1Link: string
    button2Text: string
    button2Link: string
    imageSrc: string
    imageAlt: string
    totalTeamsCallout: number
    totalTeamsCalloutText: string
  }
  isEditing?: boolean
  onContentChange?: (field: string, value: string | number) => void
}

export function AboutClubSection({ content, isEditing = false, onContentChange }: AboutClubProps) {
  const handleChange = (field: string, value: string | number) => {
    if (isEditing && onContentChange) {
      onContentChange(field, value)
    }
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image Column */}
          <div className="relative h-[400px] md:h-[500px] rounded-lg overflow-hidden">
            <Image
              src={content.imageSrc || "/placeholder.svg?height=800&width=600&query=handball+team"}
              alt={content.imageAlt}
              fill
              className="object-cover"
            />

            {/* Teams Callout */}
            <div className="absolute bottom-6 left-6 bg-orange-600 text-white p-4 rounded-lg shadow-lg">
              {isEditing ? (
                <input
                  type="number"
                  value={content.totalTeamsCallout}
                  onChange={(e) => handleChange("totalTeamsCallout", Number.parseInt(e.target.value))}
                  className="w-20 bg-orange-700 text-white text-3xl font-bold text-center mb-1 rounded"
                />
              ) : (
                <div className="text-3xl font-bold text-center mb-1">{content.totalTeamsCallout}</div>
              )}

              {isEditing ? (
                <input
                  type="text"
                  value={content.totalTeamsCalloutText}
                  onChange={(e) => handleChange("totalTeamsCalloutText", e.target.value)}
                  className="w-full bg-orange-700 text-white text-center rounded"
                />
              ) : (
                <div className="text-sm text-center">{content.totalTeamsCalloutText}</div>
              )}
            </div>
          </div>

          {/* Content Column */}
          <div>
            {isEditing ? (
              <input
                type="text"
                value={content.title}
                onChange={(e) => handleChange("title", e.target.value)}
                className="text-3xl font-bold mb-6 w-full border-b border-gray-300 focus:outline-none focus:border-orange-500"
              />
            ) : (
              <h2 className="text-3xl font-bold mb-6">{content.title}</h2>
            )}

            {isEditing ? (
              <textarea
                value={content.paragraph1}
                onChange={(e) => handleChange("paragraph1", e.target.value)}
                className="text-gray-600 mb-4 w-full h-32 border border-gray-300 rounded p-2 focus:outline-none focus:border-orange-500"
              />
            ) : (
              <p className="text-gray-600 mb-4">{content.paragraph1}</p>
            )}

            {isEditing ? (
              <textarea
                value={content.paragraph2}
                onChange={(e) => handleChange("paragraph2", e.target.value)}
                className="text-gray-600 mb-8 w-full h-32 border border-gray-300 rounded p-2 focus:outline-none focus:border-orange-500"
              />
            ) : (
              <p className="text-gray-600 mb-8">{content.paragraph2}</p>
            )}

            {/* Core Values */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="flex flex-col items-center text-center">
                <div className="p-3 bg-orange-100 rounded-full mb-3">
                  <Heart className="h-6 w-6 text-orange-500" />
                </div>
                {isEditing ? (
                  <input
                    type="text"
                    value={content.passionText}
                    onChange={(e) => handleChange("passionText", e.target.value)}
                    className="font-medium w-full text-center border-b border-gray-300 focus:outline-none focus:border-orange-500"
                  />
                ) : (
                  <h3 className="font-medium">{content.passionText}</h3>
                )}
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="p-3 bg-orange-100 rounded-full mb-3">
                  <Lightbulb className="h-6 w-6 text-orange-500" />
                </div>
                {isEditing ? (
                  <input
                    type="text"
                    value={content.developmentText}
                    onChange={(e) => handleChange("developmentText", e.target.value)}
                    className="font-medium w-full text-center border-b border-gray-300 focus:outline-none focus:border-orange-500"
                  />
                ) : (
                  <h3 className="font-medium">{content.developmentText}</h3>
                )}
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="p-3 bg-orange-100 rounded-full mb-3">
                  <Users className="h-6 w-6 text-orange-500" />
                </div>
                {isEditing ? (
                  <input
                    type="text"
                    value={content.communityText}
                    onChange={(e) => handleChange("communityText", e.target.value)}
                    className="font-medium w-full text-center border-b border-gray-300 focus:outline-none focus:border-orange-500"
                  />
                ) : (
                  <h3 className="font-medium">{content.communityText}</h3>
                )}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              {isEditing ? (
                <div className="flex flex-col gap-2">
                  <input
                    type="text"
                    value={content.button1Text}
                    onChange={(e) => handleChange("button1Text", e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded"
                    placeholder="Button 1 Text"
                  />
                  <input
                    type="text"
                    value={content.button1Link}
                    onChange={(e) => handleChange("button1Link", e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded"
                    placeholder="Button 1 Link"
                  />
                </div>
              ) : (
                <Button asChild>
                  <Link href={content.button1Link}>{content.button1Text}</Link>
                </Button>
              )}

              {isEditing ? (
                <div className="flex flex-col gap-2">
                  <input
                    type="text"
                    value={content.button2Text}
                    onChange={(e) => handleChange("button2Text", e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded"
                    placeholder="Button 2 Text"
                  />
                  <input
                    type="text"
                    value={content.button2Link}
                    onChange={(e) => handleChange("button2Link", e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded"
                    placeholder="Button 2 Link"
                  />
                </div>
              ) : (
                <Button asChild variant="outline">
                  <Link href={content.button2Link}>{content.button2Text}</Link>
                </Button>
              )}
            </div>

            {/* Image URL input (only visible in edit mode) */}
            {isEditing && (
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL:</label>
                <input
                  type="text"
                  value={content.imageSrc}
                  onChange={(e) => handleChange("imageSrc", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded"
                  placeholder="Image URL"
                />
                <input
                  type="text"
                  value={content.imageAlt}
                  onChange={(e) => handleChange("imageAlt", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded mt-2"
                  placeholder="Image Alt Text"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutClubSection
