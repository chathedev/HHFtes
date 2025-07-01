"use client"

import type React from "react"

import Image from "next/image"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"

interface AboutClubSectionProps {
  content: {
    title: string
    description: string
    linkText: string
    linkUrl: string
    totalTeamsCallout: number
    imageSrc: string
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

export function AboutClubSection({ content, isEditing = false, setContent }: AboutClubSectionProps) {
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
        aboutClub: updatedContent,
      }))
    }
  }

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50">
      <div className="container px-4 md:px-6">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
          <div className="space-y-6">
            {isEditing ? (
              <Textarea
                className="text-3xl md:text-4xl font-bold bg-white border border-gray-300 focus:ring-2 focus:ring-orange-400 resize-none"
                value={localContent.title}
                onChange={(e) => handleContentChange("title", e.target.value)}
                rows={1}
              />
            ) : (
              <h2 className="text-3xl md:text-4xl font-bold">{localContent.title}</h2>
            )}
            {isEditing ? (
              <Textarea
                className="text-gray-600 md:text-lg bg-white border border-gray-300 focus:ring-2 focus:ring-orange-400 resize-none"
                value={localContent.description}
                onChange={(e) => handleContentChange("description", e.target.value)}
                rows={5}
              />
            ) : (
              <p className="text-gray-600 md:text-lg">{localContent.description}</p>
            )}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              {isEditing ? (
                <div className="flex flex-col gap-2 w-full sm:w-auto">
                  <Input
                    className="bg-white border border-gray-300 focus:ring-2 focus:ring-orange-400"
                    value={localContent.linkText}
                    onChange={(e) => handleContentChange("linkText", e.target.value)}
                    placeholder="Link Text"
                  />
                  <Select value={localContent.linkUrl} onValueChange={(value) => handleContentChange("linkUrl", value)}>
                    <SelectTrigger className="w-full bg-white border border-gray-300 focus:ring-2 focus:ring-orange-400">
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
                <Link
                  className="inline-flex h-10 items-center justify-center rounded-md bg-orange-500 px-6 text-sm font-medium text-white shadow transition-colors hover:bg-orange-600 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-orange-700"
                  href={localContent.linkUrl}
                >
                  {localContent.linkText}
                </Link>
              )}
              <div className="text-2xl font-bold text-orange-500">
                {isEditing ? (
                  <Input
                    type="number"
                    className="w-24 bg-white border border-gray-300 focus:ring-2 focus:ring-orange-400"
                    value={localContent.totalTeamsCallout}
                    onChange={(e) => handleContentChange("totalTeamsCallout", Number.parseInt(e.target.value) || 0)}
                  />
                ) : (
                  localContent.totalTeamsCallout
                )}{" "}
                Lag
              </div>
            </div>
          </div>
          <div className="relative h-[300px] md:h-[400px] lg:h-[500px] rounded-lg overflow-hidden">
            <Image
              alt="About Club"
              className="object-cover w-full h-full"
              height={500}
              src={localContent.imageSrc || "/placeholder.svg?height=500&width=800&query=about club image"}
              style={{
                aspectRatio: "800/500",
                objectFit: "cover",
              }}
              width={800}
            />
            {isEditing && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-full max-w-md px-4">
                <Label htmlFor="about-image-url" className="sr-only">
                  About Image URL
                </Label>
                <Input
                  id="about-image-url"
                  className="w-full bg-white/90 text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-orange-400"
                  value={localContent.imageSrc}
                  onChange={(e) => handleContentChange("imageSrc", e.target.value)}
                  placeholder="Enter image URL"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
