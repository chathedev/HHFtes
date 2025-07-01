"use client"

import Image from "next/image"
import Link from "next/link"
import { Heart, TrendingUp, Users } from "lucide-react"
import type { PageContent } from "@/lib/content-store"
import { cn } from "@/lib/utils"

interface SelectedElementData {
  sectionKey: keyof PageContent
  elementId: string // Unique ID for the element within the section (e.g., "heroTitle", "aboutClubImage")
  type: "text" | "number" | "link" | "image" | "button" | "color" | "font-size" // Type of element being edited
  label: string // Label for the input field in the sidebar
  currentValue: string | number // The current value of the primary field (e.g., text content, URL)
  contentPath?: string // e.g., "hero.title", "aboutClub.imageSrc"
  additionalFields?: {
    field: string
    label: string
    type: "text" | "select" | "color" | "font-size"
    currentValue: string | number
    options?: { name: string; value: string; bgClass?: string; textClass?: string }[]
  }[]
}

interface AboutClubSectionProps {
  content: PageContent["aboutClub"]
  isEditing?: boolean
  onElementSelect: (data: SelectedElementData) => void
  availablePages: { name: string; path: string }[]
}

export default function AboutClubSection({
  content,
  isEditing = false,
  onElementSelect,
  availablePages,
}: AboutClubSectionProps) {
  const handleTextClick = (field: keyof PageContent["aboutClub"], label: string) => {
    if (isEditing) {
      onElementSelect({
        sectionKey: "aboutClub",
        elementId: field,
        type: "text",
        label: label,
        currentValue: content[field],
      })
    }
  }

  const handleNumberClick = (field: keyof PageContent["aboutClub"], label: string) => {
    if (isEditing) {
      onElementSelect({
        sectionKey: "aboutClub",
        elementId: field,
        type: "number",
        label: label,
        currentValue: content[field],
      })
    }
  }

  const handleImageClick = () => {
    if (isEditing) {
      onElementSelect({
        sectionKey: "aboutClub",
        elementId: "imageSrc",
        type: "image",
        label: "Bild URL",
        currentValue: content.imageSrc,
        additionalFields: [{ field: "imageAlt", label: "Bild Alt Text", type: "text", currentValue: content.imageAlt }],
      })
    }
  }

  const handleButtonClick = (buttonNumber: 1 | 2) => {
    if (isEditing) {
      const textKey = `button${buttonNumber}Text` as keyof PageContent["aboutClub"]
      const linkKey = `button${buttonNumber}Link` as keyof PageContent["aboutClub"]
      onElementSelect({
        sectionKey: "aboutClub",
        elementId: textKey,
        type: "button",
        label: `Knapp ${buttonNumber} Text`,
        currentValue: content[textKey],
        additionalFields: [
          {
            field: linkKey,
            label: `Knapp ${buttonNumber} Länk`,
            type: "select",
            currentValue: content[linkKey],
            options: availablePages,
          },
        ],
      })
    }
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2
              className={cn(
                "text-4xl font-bold text-green-600 mb-2",
                isEditing && "cursor-pointer group hover:outline hover:outline-2 hover:outline-green-400 rounded px-1",
              )}
              onClick={() => handleTextClick("title", "Titel")}
            >
              {content.title}
            </h2>

            <p
              className={cn(
                "text-gray-700 mb-6",
                isEditing && "cursor-pointer group hover:outline hover:outline-2 hover:outline-gray-400 rounded px-1",
              )}
              onClick={() => handleTextClick("paragraph1", "Paragraf 1")}
            >
              {content.paragraph1}
            </p>

            <p
              className={cn(
                "text-gray-700 mb-8",
                isEditing && "cursor-pointer group hover:outline hover:outline-2 hover:outline-gray-400 rounded px-1",
              )}
              onClick={() => handleTextClick("paragraph2", "Paragraf 2")}
            >
              {content.paragraph2}
            </p>

            <div className="grid grid-cols-3 gap-4 mb-8">
              <div
                className={cn(
                  "border border-gray-200 rounded-lg p-4 text-center",
                  isEditing && "cursor-pointer group hover:outline hover:outline-2 hover:outline-gray-300",
                )}
                onClick={() => handleTextClick("passionText", "Passion Text")}
              >
                <Heart className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <h4 className="font-medium mb-1">Passion</h4>
                <p className="text-xs text-gray-600">{content.passionText}</p>
              </div>

              <div
                className={cn(
                  "border border-gray-200 rounded-lg p-4 text-center",
                  isEditing && "cursor-pointer group hover:outline hover:outline-2 hover:outline-gray-300",
                )}
                onClick={() => handleTextClick("developmentText", "Utveckling Text")}
              >
                <TrendingUp className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                <h4 className="font-medium mb-1">Utveckling</h4>
                <p className="text-xs text-gray-600">{content.developmentText}</p>
              </div>

              <div
                className={cn(
                  "border border-gray-200 rounded-lg p-4 text-center",
                  isEditing && "cursor-pointer group hover:outline hover:outline-2 hover:outline-gray-300",
                )}
                onClick={() => handleTextClick("communityText", "Gemenskap Text")}
              >
                <Users className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <h4 className="font-medium mb-1">Gemenskap</h4>
                <p className="text-xs text-gray-600">{content.communityText}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link
                href={content.button1Link}
                className={cn(
                  "bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-md font-medium transition-colors",
                  isEditing &&
                    "cursor-pointer group hover:outline hover:outline-2 hover:outline-orange-400 rounded px-1",
                )}
                onClick={(e) => {
                  if (isEditing) {
                    e.preventDefault()
                    handleButtonClick(1)
                  }
                }}
              >
                {content.button1Text}
              </Link>
              <Link
                href={content.button2Link}
                className={cn(
                  "bg-white border border-gray-300 hover:bg-gray-100 text-gray-800 px-6 py-2 rounded-md font-medium transition-colors",
                  isEditing && "cursor-pointer group hover:outline hover:outline-2 hover:outline-gray-400 rounded px-1",
                )}
                onClick={(e) => {
                  if (isEditing) {
                    e.preventDefault()
                    handleButtonClick(2)
                  }
                }}
              >
                {content.button2Text}
              </Link>
            </div>
          </div>

          <div className="relative">
            <div
              className={cn(
                "relative h-[400px] rounded-lg overflow-hidden shadow-xl",
                isEditing && "cursor-pointer group hover:outline hover:outline-2 hover:outline-blue-500",
              )}
              onClick={handleImageClick}
            >
              <Image
                src={content.imageSrc || "/placeholder.svg"}
                alt={content.imageAlt}
                fill
                className="object-cover"
                onContextMenu={(e) => e.preventDefault()}
                onDragStart={(e) => e.preventDefault()}
              />
              {isEditing && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-white text-lg font-bold">Redigera bild</span>
                </div>
              )}
            </div>

            <div
              className={cn(
                "absolute -top-4 -right-4 bg-orange-500 text-white rounded-lg p-4 shadow-lg",
                isEditing && "cursor-pointer group hover:outline hover:outline-2 hover:outline-white rounded px-1",
              )}
              onClick={() => handleNumberClick("totalTeamsCallout", "Aktiva lag Antal")}
            >
              <div className="text-3xl font-bold">{content.totalTeamsCallout}</div>
              <div
                className={cn(
                  "text-sm",
                  isEditing && "cursor-pointer group hover:outline hover:outline-2 hover:outline-white rounded px-1",
                )}
                onClick={(e) => {
                  if (isEditing) {
                    e.stopPropagation() // Prevent parent click
                    handleTextClick("totalTeamsCalloutText", "Aktiva lag Text")
                  }
                }}
              >
                {content.totalTeamsCalloutText}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export { default as AboutClubSection } from "./about-club-section"
