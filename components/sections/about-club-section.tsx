"use client"

import type React from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Users, Trophy, CalendarDays } from "lucide-react"
import type { PageContent } from "@/lib/content-store"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface AboutClubSectionProps {
  content: PageContent["aboutClub"]
  isEditing?: boolean
  onContentChange?: (field: keyof PageContent["aboutClub"], value: string | number) => void
  availablePages: { name: string; path: string }[]
}

export default function AboutClubSection({
  content,
  isEditing = false,
  onContentChange,
  availablePages,
}: AboutClubSectionProps) {
  const handleTextChange = (field: keyof PageContent["aboutClub"], e: React.ChangeEvent<HTMLDivElement>) => {
    if (onContentChange) {
      onContentChange(field, e.currentTarget.innerText)
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onContentChange) {
      onContentChange("imageSrc", e.target.value)
    }
  }

  const handleLinkChange = (field: keyof PageContent["aboutClub"], value: string) => {
    if (onContentChange) {
      onContentChange(field, value)
    }
  }

  const handleNumberChange = (field: keyof PageContent["aboutClub"], e: React.ChangeEvent<HTMLInputElement>) => {
    if (onContentChange) {
      onContentChange(field, Number.parseInt(e.target.value) || 0)
    }
  }

  return (
    <section className="py-12 md:py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="relative h-64 md:h-96 lg:h-[500px] rounded-lg overflow-hidden shadow-lg">
            <Image
              src={content.imageSrc || "/placeholder.svg"} // No placeholder fallback here
              alt="Härnösands FF lagbild"
              fill
              className="object-cover object-center"
              onContextMenu={(e) => e.preventDefault()}
              onDragStart={(e) => e.preventDefault()}
            />
            {isEditing && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="text-white text-lg font-bold">Redigera bild</span>
              </div>
            )}
          </div>
          <div className="space-y-6">
            <h2
              className="text-3xl md:text-4xl font-bold text-gray-900 outline-none focus:ring-2 focus:ring-blue-500 rounded px-1"
              contentEditable={isEditing}
              suppressContentEditableWarning={true}
              onBlur={(e) => handleTextChange("title", e)}
            >
              {content.title}
            </h2>
            <p
              className="text-gray-700 text-lg leading-relaxed outline-none focus:ring-2 focus:ring-blue-500 rounded px-1"
              contentEditable={isEditing}
              suppressContentEditableWarning={true}
              onBlur={(e) => handleTextChange("description", e)}
            >
              {content.description}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card className="text-center p-4 shadow-sm">
                <CardContent className="flex flex-col items-center justify-center p-0">
                  <Users className="h-8 w-8 text-green-600 mb-2" />
                  <div className="text-3xl font-bold text-gray-900">
                    {isEditing ? (
                      <input
                        type="number"
                        value={content.totalTeamsCallout}
                        onChange={(e) => handleNumberChange("totalTeamsCallout", e)}
                        className="w-20 text-center border p-1 rounded outline-none focus:ring-2 focus:ring-green-300"
                      />
                    ) : (
                      content.totalTeamsCallout
                    )}
                  </div>
                  <p className="text-sm text-gray-600">Lag</p>
                </CardContent>
              </Card>
              <Card className="text-center p-4 shadow-sm">
                <CardContent className="flex flex-col items-center justify-center p-0">
                  <Trophy className="h-8 w-8 text-orange-500 mb-2" />
                  <div className="text-3xl font-bold text-gray-900">
                    {isEditing ? (
                      <input
                        type="number"
                        value={content.totalMembersCallout}
                        onChange={(e) => handleNumberChange("totalMembersCallout", e)}
                        className="w-20 text-center border p-1 rounded outline-none focus:ring-2 focus:ring-orange-300"
                      />
                    ) : (
                      content.totalMembersCallout
                    )}
                  </div>
                  <p className="text-sm text-gray-600">Medlemmar</p>
                </CardContent>
              </Card>
              <Card className="text-center p-4 shadow-sm">
                <CardContent className="flex flex-col items-center justify-center p-0">
                  <CalendarDays className="h-8 w-8 text-blue-600 mb-2" />
                  <div className="text-3xl font-bold text-gray-900">
                    {isEditing ? (
                      <input
                        type="number"
                        value={content.totalYearsCallout}
                        onChange={(e) => handleNumberChange("totalYearsCallout", e)}
                        className="w-20 text-center border p-1 rounded outline-none focus:ring-2 focus:ring-blue-300"
                      />
                    ) : (
                      content.totalYearsCallout
                    )}
                  </div>
                  <p className="text-sm text-gray-600">År i drift</p>
                </CardContent>
              </Card>
            </div>
            <div className="mt-6">
              {isEditing ? (
                <div className="flex items-center gap-2">
                  <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium">
                    <span
                      contentEditable={isEditing}
                      suppressContentEditableWarning={true}
                      onBlur={(e) => handleTextChange("linkText", e)}
                      className="outline-none focus:ring-2 focus:ring-white rounded px-1"
                    >
                      {content.linkText}
                    </span>
                  </Button>
                  <Select value={content.linkHref} onValueChange={(value) => handleLinkChange("linkHref", value)}>
                    <SelectTrigger className="w-[150px] h-auto p-1 text-sm bg-white text-gray-800 outline-none focus:ring-2 focus:ring-blue-300">
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
                  href={content.linkHref}
                  className="inline-flex items-center justify-center rounded-md bg-blue-600 px-6 py-3 text-base font-medium text-white shadow transition-colors hover:bg-blue-700"
                >
                  {content.linkText}
                </Link>
              )}
            </div>
          </div>
        </div>
        {isEditing && (
          <div className="mt-8 flex justify-center">
            <div className="bg-white p-4 rounded-lg shadow-lg flex gap-2 items-center">
              <label htmlFor="about-image-url" className="sr-only">
                Om Bild URL
              </label>
              <input
                id="about-image-url"
                type="text"
                value={content.imageSrc}
                onChange={handleImageChange}
                placeholder="Om Bild URL"
                className="border p-2 rounded w-80 text-gray-800 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
