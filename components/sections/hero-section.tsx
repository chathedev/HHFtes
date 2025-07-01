"use client"

import type React from "react"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import type { PageContent } from "@/lib/content-store"

interface HeroSectionProps {
  content: PageContent["hero"]
  isEditing?: boolean
  onContentChange?: (field: keyof PageContent["hero"], value: string | number) => void
}

export default function HeroSection({ content, isEditing = false, onContentChange }: HeroSectionProps) {
  const handleTextChange = (field: keyof PageContent["hero"], e: React.ChangeEvent<HTMLDivElement>) => {
    if (onContentChange) {
      onContentChange(field, e.currentTarget.innerText)
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onContentChange) {
      onContentChange("imageUrl", e.target.value)
    }
  }

  const handleLinkChange = (field: keyof PageContent["hero"], e: React.ChangeEvent<HTMLInputElement>) => {
    if (onContentChange) {
      onContentChange(field, e.target.value)
    }
  }

  return (
    <section className="relative w-full h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src={content.imageUrl || "/placeholder.svg"} // No placeholder fallback here
          alt="Härnösands FF Team"
          fill
          quality={90}
          priority
          unoptimized
          className="object-cover"
        />
        {isEditing && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white text-lg font-bold">Redigera bild</span>
          </div>
        )}
      </div>
      <div className="absolute inset-0 bg-black/60 z-10" /> {/* Darker, full overlay */}
      <div className="relative z-20 text-white text-center px-4 max-w-4xl mx-auto">
        <h1
          className="text-6xl md:text-8xl font-extrabold mb-4 leading-tight tracking-tight animate-fade-in-up"
          contentEditable={isEditing}
          suppressContentEditableWarning={true}
          onBlur={(e) => handleTextChange("title", e)}
        >
          {content.title}
        </h1>
        <p
          className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto animate-fade-in-up delay-200"
          contentEditable={isEditing}
          suppressContentEditableWarning={true}
          onBlur={(e) => handleTextChange("description", e)}
        >
          {content.description}
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-6 animate-fade-in-up delay-400">
          <Button className="bg-orange-500 hover:bg-orange-600 text-white px-10 py-4 rounded-md text-lg font-semibold shadow-lg transition-transform duration-300 hover:scale-105">
            {isEditing ? (
              <div className="flex items-center">
                <span
                  contentEditable={isEditing}
                  suppressContentEditableWarning={true}
                  onBlur={(e) => handleTextChange("button1Text", e)}
                  className="outline-none focus:ring-2 focus:ring-white rounded px-1"
                >
                  {content.button1Text}
                </span>
                <input
                  type="text"
                  value={content.button1Link}
                  onChange={(e) => handleLinkChange("button1Link", e)}
                  className="ml-2 p-1 text-xs text-gray-800 bg-white rounded w-24 outline-none focus:ring-2 focus:ring-orange-300"
                  placeholder="Länk"
                  onClick={(e) => e.stopPropagation()} // Prevent button click
                />
                <ArrowRight className="ml-3 h-5 w-5" />
              </div>
            ) : (
              <Link href={content.button1Link} className="flex items-center">
                <span>{content.button1Text}</span>
                <ArrowRight className="ml-3 h-5 w-5" />
              </Link>
            )}
          </Button>
          <Button className="bg-green-700 hover:bg-green-800 text-white px-10 py-4 rounded-md text-lg font-semibold shadow-lg transition-transform duration-300 hover:scale-105">
            {isEditing ? (
              <div className="flex items-center">
                <span
                  contentEditable={isEditing}
                  suppressContentEditableWarning={true}
                  onBlur={(e) => handleTextChange("button2Text", e)}
                  className="outline-none focus:ring-2 focus:ring-white rounded px-1"
                >
                  {content.button2Text}
                </span>
                <input
                  type="text"
                  value={content.button2Link}
                  onChange={(e) => handleLinkChange("button2Link", e)}
                  className="ml-2 p-1 text-xs text-gray-800 bg-white rounded w-24 outline-none focus:ring-2 focus:ring-green-300"
                  placeholder="Länk"
                  onClick={(e) => e.stopPropagation()} // Prevent button click
                />
              </div>
            ) : (
              <Link href={content.button2Link}>
                <span>{content.button2Text}</span>
              </Link>
            )}
          </Button>
        </div>
      </div>
      {isEditing && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 bg-white p-4 rounded-lg shadow-lg flex gap-2 items-center">
          <label htmlFor="hero-image-url" className="sr-only">
            Bild URL
          </label>
          <input
            id="hero-image-url"
            type="text"
            value={content.imageUrl}
            onChange={handleImageChange}
            placeholder="Bild URL"
            className="border p-2 rounded w-80 text-gray-800 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )}
    </section>
  )
}
