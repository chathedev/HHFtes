"use client"

import type React from "react"

import Image from "next/image"
import Link from "next/link"
import { Heart, TrendingUp, Users } from "lucide-react"
import type { PageContent } from "@/lib/content-store"
import { useState } from "react"
import { Button } from "@/components/ui/button"

interface AboutClubSectionProps {
  content: PageContent["aboutClub"]
  isEditing?: boolean
  onContentChange?: (field: keyof PageContent["aboutClub"], value: string | number) => void
}

export default function AboutClubSection({ content, isEditing = false, onContentChange }: AboutClubSectionProps) {
  const [showImageInput, setShowImageInput] = useState(false)

  const handleTextChange = (field: keyof PageContent["aboutClub"], e: React.ChangeEvent<HTMLDivElement>) => {
    if (onContentChange) {
      onContentChange(field, e.currentTarget.innerText)
    }
  }

  const handleNumberChange = (field: keyof PageContent["aboutClub"], e: React.ChangeEvent<HTMLDivElement>) => {
    if (onContentChange) {
      const value = Number.parseInt(e.currentTarget.innerText, 10)
      if (!isNaN(value)) {
        onContentChange(field, value)
      }
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onContentChange) {
      onContentChange("imageSrc", e.target.value)
    }
  }

  const handleLinkChange = (field: keyof PageContent["aboutClub"], e: React.ChangeEvent<HTMLInputElement>) => {
    if (onContentChange) {
      onContentChange(field, e.target.value)
    }
  }

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (isEditing) {
      e.preventDefault()
    }
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2
              className="text-4xl font-bold text-green-600 mb-2"
              contentEditable={isEditing}
              suppressContentEditableWarning={true}
              onBlur={(e) => handleTextChange("title", e)}
            >
              {content.title}
            </h2>

            <p
              className="text-gray-700 mb-6"
              contentEditable={isEditing}
              suppressContentEditableWarning={true}
              onBlur={(e) => handleTextChange("paragraph1", e)}
            >
              {content.paragraph1}
            </p>

            <p
              className="text-gray-700 mb-8"
              contentEditable={isEditing}
              suppressContentEditableWarning={true}
              onBlur={(e) => handleTextChange("paragraph2", e)}
            >
              {content.paragraph2}
            </p>

            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="border border-gray-200 rounded-lg p-4 text-center">
                <Heart className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <h4 className="font-medium mb-1">Passion</h4>
                <p
                  className="text-xs text-gray-600"
                  contentEditable={isEditing}
                  suppressContentEditableWarning={true}
                  onBlur={(e) => handleTextChange("passionText", e)}
                >
                  {content.passionText}
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-4 text-center">
                <TrendingUp className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                <h4 className="font-medium mb-1">Utveckling</h4>
                <p
                  className="text-xs text-gray-600"
                  contentEditable={isEditing}
                  suppressContentEditableWarning={true}
                  onBlur={(e) => handleTextChange("developmentText", e)}
                >
                  {content.developmentText}
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-4 text-center">
                <Users className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <h4 className="font-medium mb-1">Gemenskap</h4>
                <p
                  className="text-xs text-gray-600"
                  contentEditable={isEditing}
                  suppressContentEditableWarning={true}
                  onBlur={(e) => handleTextChange("communityText", e)}
                >
                  {content.communityText}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link
                href={content.button1Link}
                className={`bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-md font-medium transition-colors ${isEditing ? "pointer-events-none cursor-default" : ""}`}
                onClick={handleLinkClick}
              >
                <span
                  contentEditable={isEditing}
                  suppressContentEditableWarning={true}
                  onBlur={(e) => handleTextChange("button1Text", e)}
                >
                  {content.button1Text}
                </span>
                {isEditing && (
                  <input
                    type="text"
                    value={content.button1Link}
                    onChange={(e) => handleLinkChange("button1Link", e)}
                    className="ml-2 p-1 text-xs text-gray-800 bg-white rounded"
                    placeholder="Länk"
                    onClick={(e) => e.stopPropagation()} // Prevent link click
                  />
                )}
              </Link>
              <Link
                href={content.button2Link}
                className={`bg-white border border-gray-300 hover:bg-gray-100 text-gray-800 px-6 py-2 rounded-md font-medium transition-colors ${isEditing ? "pointer-events-none cursor-default" : ""}`}
                onClick={handleLinkClick}
              >
                <span
                  contentEditable={isEditing}
                  suppressContentEditableWarning={true}
                  onBlur={(e) => handleTextChange("button2Text", e)}
                >
                  {content.button2Text}
                </span>
                {isEditing && (
                  <input
                    type="text"
                    value={content.button2Link}
                    onChange={(e) => handleLinkChange("button2Link", e)}
                    className="ml-2 p-1 text-xs text-gray-800 bg-white rounded"
                    placeholder="Länk"
                    onClick={(e) => e.stopPropagation()} // Prevent link click
                  />
                )}
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="relative h-[400px] rounded-lg overflow-hidden shadow-xl">
              <Image
                src={content.imageSrc || "/placeholder.svg?height=400&width=600&text=About Club Image"}
                alt={content.imageAlt}
                fill
                className="object-cover"
                onContextMenu={(e) => e.preventDefault()}
                onDragStart={(e) => e.preventDefault()}
              />
              {isEditing && (
                <div
                  className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                  onClick={() => setShowImageInput(true)}
                >
                  <span className="text-white text-lg font-bold">Ändra bild</span>
                </div>
              )}
            </div>

            <div className="absolute -top-4 -right-4 bg-orange-500 text-white rounded-lg p-4 shadow-lg">
              <div
                className="text-3xl font-bold"
                contentEditable={isEditing}
                suppressContentEditableWarning={true}
                onBlur={(e) => handleNumberChange("totalTeamsCallout", e)}
              >
                {content.totalTeamsCallout}
              </div>
              <div
                className="text-sm"
                contentEditable={isEditing}
                suppressContentEditableWarning={true}
                onBlur={(e) => handleTextChange("totalTeamsCalloutText", e)}
              >
                {content.totalTeamsCalloutText}
              </div>
            </div>
          </div>
        </div>
      </div>
      {isEditing && showImageInput && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 bg-white p-4 rounded-lg shadow-lg flex gap-2">
          <input
            type="text"
            value={content.imageSrc}
            onChange={handleImageChange}
            placeholder="Bild URL"
            className="border p-2 rounded w-80"
          />
          <Button onClick={() => setShowImageInput(false)}>Stäng</Button>
        </div>
      )}
    </section>
  )
}
