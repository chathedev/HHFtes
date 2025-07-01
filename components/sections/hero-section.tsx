"use client"

import type React from "react"

import Image from "next/image"
import Link from "next/link"
import type { PageContent } from "@/lib/content-store"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface HeroSectionProps {
  content: PageContent["hero"]
  isEditing?: boolean
  onContentChange?: (field: keyof PageContent["hero"], value: string | number) => void
  availablePages: { name: string; path: string }[]
}

export default function HeroSection({ content, isEditing = false, onContentChange, availablePages }: HeroSectionProps) {
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

  const handleLinkChange = (field: keyof PageContent["hero"], value: string) => {
    if (onContentChange) {
      onContentChange(field, value)
    }
  }

  return (
    <section className="relative h-[800px] w-full overflow-hidden">
      <Image
        src={content.imageUrl || "/placeholder.svg"}
        alt="Härnösands FF fotbollsplan"
        fill
        className="object-cover object-center"
        priority
        onContextMenu={(e) => e.preventDefault()}
        onDragStart={(e) => e.preventDefault()}
      />
      {isEditing && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <span className="text-white text-lg font-bold">Redigera bild</span>
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
      <div className="relative z-10 flex h-full items-center justify-center p-8 md:p-12 text-center">
        <div className="max-w-3xl text-white">
          <h1
            className="text-4xl font-bold leading-tight md:text-6xl outline-none focus:ring-2 focus:ring-white rounded px-1"
            contentEditable={isEditing}
            suppressContentEditableWarning={true}
            onBlur={(e) => handleTextChange("title", e)}
          >
            {content.title}
          </h1>
          <p
            className="mt-4 text-lg md:text-xl outline-none focus:ring-2 focus:ring-white rounded px-1"
            contentEditable={isEditing}
            suppressContentEditableWarning={true}
            onBlur={(e) => handleTextChange("description", e)}
          >
            {content.description}
          </p>
          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            {isEditing ? (
              <div className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-md font-medium">
                <span
                  contentEditable={isEditing}
                  suppressContentEditableWarning={true}
                  onBlur={(e) => handleTextChange("button1Text", e)}
                  className="outline-none focus:ring-2 focus:ring-white rounded px-1"
                >
                  {content.button1Text}
                </span>
                <Select value={content.button1Link} onValueChange={(value) => handleLinkChange("button1Link", value)}>
                  <SelectTrigger className="w-[120px] h-auto p-1 text-xs bg-white text-gray-800 outline-none focus:ring-2 focus:ring-green-300">
                    <SelectValue placeholder="Välj sida" />
                  </SelectTrigger>
                  <SelectContent>
                    {availablePages.map((page) => (
                      <SelectItem key={page.path} value={page.path}>
                        {page.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <Link
                href={content.button1Link}
                className="inline-flex items-center justify-center rounded-md bg-green-600 px-6 py-3 text-base font-medium text-white shadow transition-colors hover:bg-green-700"
              >
                {content.button1Text}
              </Link>
            )}

            {isEditing ? (
              <div className="flex items-center gap-2 bg-white text-gray-800 px-6 py-3 rounded-md font-medium border border-gray-300">
                <span
                  contentEditable={isEditing}
                  suppressContentEditableWarning={true}
                  onBlur={(e) => handleTextChange("button2Text", e)}
                  className="outline-none focus:ring-2 focus:ring-gray-300 rounded px-1"
                >
                  {content.button2Text}
                </span>
                <Select value={content.button2Link} onValueChange={(value) => handleLinkChange("button2Link", value)}>
                  <SelectTrigger className="w-[120px] h-auto p-1 text-xs bg-white text-gray-800 outline-none focus:ring-2 focus:ring-gray-300">
                    <SelectValue placeholder="Välj sida" />
                  </SelectTrigger>
                  <SelectContent>
                    {availablePages.map((page) => (
                      <SelectItem key={page.path} value={page.path}>
                        {page.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <Link
                href={content.button2Link}
                className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-6 py-3 text-base font-medium text-gray-800 shadow-sm transition-colors hover:bg-gray-100"
              >
                {content.button2Text}
              </Link>
            )}
          </div>
        </div>
      </div>
      {isEditing && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 bg-white p-4 rounded-lg shadow-lg flex gap-2 items-center">
          <label htmlFor="hero-image-url" className="sr-only">
            Hero Bild URL
          </label>
          <input
            id="hero-image-url"
            type="text"
            value={content.imageUrl}
            onChange={handleImageChange}
            placeholder="Hero Bild URL"
            className="border p-2 rounded w-80 text-gray-800 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )}
    </section>
  )
}
