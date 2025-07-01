"use client"

import { Label } from "@/components/ui/label"

import type React from "react"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"

interface HeroSectionProps {
  content: {
    title: string
    description: string
    primaryButtonText: string
    primaryButtonLink: string
    secondaryButtonText: string
    secondaryButtonLink: string
    imageUrl: string
  }
  isEditing?: boolean
  setContent?: React.Dispatch<React.SetStateAction<any>>
}

const availablePages = [
  { name: "Hem", path: "/" },
  { name: "Nyheter", path: "/nyheter" },
  { name: "Kalender", path: "/kalender" },
  { name: "Lag", path: "/lag" },
  { name: "Matcher", path: "/matcher" },
  { name: "Partners", path: "/partners" },
  { name: "Kontakt", path: "/kontakt" },
  { name: "Logga in", path: "/login" },
]

export function HeroSection({ content, isEditing = false, setContent }: HeroSectionProps) {
  const [localContent, setLocalContent] = useState(content)

  // Update local state when content prop changes (e.g., on save/reset from parent)
  useState(() => {
    setLocalContent(content)
  }, [content])

  const handleContentChange = (field: string, value: string | number) => {
    const updatedContent = { ...localContent, [field]: value }
    setLocalContent(updatedContent)
    if (setContent) {
      setContent((prev: any) => ({
        ...prev,
        hero: updatedContent,
      }))
    }
  }

  return (
    <section className="relative w-full h-[60vh] md:h-[70vh] lg:h-[80vh] flex items-center justify-center text-center">
      <Image
        alt="Hero Background"
        className="absolute inset-0 w-full h-full object-cover"
        height={1080}
        src={localContent.imageUrl || "/placeholder.svg?height=1080&width=1920&query=hero background"}
        style={{
          aspectRatio: "1920/1080",
          objectFit: "cover",
        }}
        width={1920}
        priority
      />
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative z-10 text-white px-4 md:px-6 max-w-4xl mx-auto">
        {isEditing ? (
          <Textarea
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 bg-white/20 text-white text-center resize-none focus:ring-2 focus:ring-orange-400"
            value={localContent.title}
            onChange={(e) => handleContentChange("title", e.target.value)}
            rows={2}
          />
        ) : (
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4">{localContent.title}</h1>
        )}
        {isEditing ? (
          <Textarea
            className="text-lg md:text-xl lg:text-2xl mb-8 bg-white/20 text-white text-center resize-none focus:ring-2 focus:ring-orange-400"
            value={localContent.description}
            onChange={(e) => handleContentChange("description", e.target.value)}
            rows={3}
          />
        ) : (
          <p className="text-lg md:text-xl lg:text-2xl mb-8">{localContent.description}</p>
        )}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          {isEditing ? (
            <div className="flex flex-col gap-2 items-center">
              <Input
                className="bg-white/20 text-white placeholder:text-gray-300 focus:ring-2 focus:ring-orange-400"
                value={localContent.primaryButtonText}
                onChange={(e) => handleContentChange("primaryButtonText", e.target.value)}
                placeholder="Primary Button Text"
              />
              <Select
                value={localContent.primaryButtonLink}
                onValueChange={(value) => handleContentChange("primaryButtonLink", value)}
              >
                <SelectTrigger className="w-[180px] bg-white/20 text-white focus:ring-2 focus:ring-orange-400">
                  <SelectValue placeholder="Välj sida" />
                </SelectTrigger>
                <SelectContent className="bg-white text-gray-900">
                  {availablePages.map((page) => (
                    <SelectItem key={page.path} value={page.path}>
                      {page.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : (
            <Link href={localContent.primaryButtonLink}>
              <Button className="px-8 py-3 text-lg bg-orange-500 hover:bg-orange-600 text-white">
                {localContent.primaryButtonText}
              </Button>
            </Link>
          )}
          {isEditing ? (
            <div className="flex flex-col gap-2 items-center">
              <Input
                className="bg-white/20 text-white placeholder:text-gray-300 focus:ring-2 focus:ring-orange-400"
                value={localContent.secondaryButtonText}
                onChange={(e) => handleContentChange("secondaryButtonText", e.target.value)}
                placeholder="Secondary Button Text"
              />
              <Select
                value={localContent.secondaryButtonLink}
                onValueChange={(value) => handleContentChange("secondaryButtonLink", value)}
              >
                <SelectTrigger className="w-[180px] bg-white/20 text-white focus:ring-2 focus:ring-orange-400">
                  <SelectValue placeholder="Välj sida" />
                </SelectTrigger>
                <SelectContent className="bg-white text-gray-900">
                  {availablePages.map((page) => (
                    <SelectItem key={page.path} value={page.path}>
                      {page.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : (
            <Link href={localContent.secondaryButtonLink}>
              <Button className="px-8 py-3 text-lg bg-transparent border border-white hover:bg-white/20 text-white">
                {localContent.secondaryButtonText}
              </Button>
            </Link>
          )}
        </div>
        {isEditing && (
          <div className="mt-8 flex flex-col items-center gap-2">
            <Label htmlFor="hero-image-url" className="text-white">
              Hero Image URL
            </Label>
            <Input
              id="hero-image-url"
              className="w-full max-w-md bg-white/20 text-white placeholder:text-gray-300 focus:ring-2 focus:ring-orange-400"
              value={localContent.imageUrl}
              onChange={(e) => handleContentChange("imageUrl", e.target.value)}
              placeholder="Enter image URL"
            />
          </div>
        )}
      </div>
    </section>
  )
}
