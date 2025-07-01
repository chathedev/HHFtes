"use client"

import type React from "react"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import type { PageContent } from "@/lib/content-store"
import { useState } from "react"

interface HeroSectionProps {
  content: PageContent["hero"]
  isEditing?: boolean
  onContentChange?: (field: keyof PageContent["hero"], value: string | number) => void
}

export default function HeroSection({ content, isEditing = false, onContentChange }: HeroSectionProps) {
  const [showImageInput, setShowImageInput] = useState(false)

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

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (isEditing) {
      e.preventDefault()
    }
  }

  return (
    <section className="relative w-full h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src={content.imageUrl || "/placeholder.svg?height=800&width=1200&text=Hero Image"}
          alt="Härnösands FF Team"
          fill
          quality={90}
          priority
          unoptimized
          className="object-cover"
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
          <Button
            asChild
            className={`bg-orange-500 hover:bg-orange-600 text-white px-10 py-4 rounded-md text-lg font-semibold shadow-lg transition-transform duration-300 hover:scale-105 ${isEditing ? "pointer-events-none cursor-default" : ""}`}
          >
            <Link href={content.button1Link} onClick={handleLinkClick}>
              <span
                contentEditable={isEditing}
                suppressContentEditableWarning={true}
                onBlur={(e) => handleTextChange("button1Text", e)}
              >
                {content.button1Text}
              </span>
              <ArrowRight className="ml-3 h-5 w-5" />
            </Link>
          </Button>
          <Button
            asChild
            className={`bg-green-700 hover:bg-green-800 text-white px-10 py-4 rounded-md text-lg font-semibold shadow-lg transition-transform duration-300 hover:scale-105 ${isEditing ? "pointer-events-none cursor-default" : ""}`}
          >
            <Link href={content.button2Link} onClick={handleLinkClick}>
              <span
                contentEditable={isEditing}
                suppressContentEditableWarning={true}
                onBlur={(e) => handleTextChange("button2Text", e)}
              >
                {content.button2Text}
              </span>
            </Link>
          </Button>
        </div>
      </div>
      {isEditing && showImageInput && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 bg-white p-4 rounded-lg shadow-lg flex gap-2">
          <input
            type="text"
            value={content.imageUrl}
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
