"use client"

import type { ReactElement } from "react"
import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Users, Lightbulb, Handshake } from "lucide-react"
import type { PageContent } from "@/lib/content-store"

interface SelectedElementData {
  sectionKey: keyof PageContent
  elementId: string
  type: "text" | "number" | "link" | "image" | "button" | "color" | "font-size" | "select"
  label: string
  currentValue: string | number
  contentPath: string
  additionalFields?: {
    field: string
    label: string
    type: "text" | "select" | "color" | "font-size" | "number"
    currentValue: string | number
    options?: { name: string; value: string; bgClass?: string; textClass?: string }[]
  }[]
}

interface AboutClubSectionProps {
  content: PageContent["aboutClub"]
  isEditing?: boolean
  onElementSelect: (data: SelectedElementData) => void
  handleInlineEdit: (path: string, newValue: string) => void
  availablePages?: { name: string; path: string }[] // Added for button links
}

export default function AboutClubSection({
  content,
  isEditing = false,
  onElementSelect,
  handleInlineEdit,
  availablePages,
}: AboutClubSectionProps): ReactElement {
  const handleImageClick = () => {
    if (isEditing) {
      onElementSelect({
        sectionKey: "aboutClub",
        elementId: "imageSrc",
        type: "image",
        label: "Bildkälla",
        currentValue: content.imageSrc,
        contentPath: "aboutClub.imageSrc",
        additionalFields: [
          {
            field: "imageAlt",
            label: "Bild Alt-text",
            type: "text",
            currentValue: content.imageAlt,
            contentPath: "aboutClub.imageAlt",
          },
        ],
      })
    }
  }

  const handleCalloutClick = () => {
    if (isEditing) {
      onElementSelect({
        sectionKey: "aboutClub",
        elementId: "totalTeamsCallout",
        type: "number",
        label: "Antal Aktiva Lag",
        currentValue: content.totalTeamsCallout,
        contentPath: "aboutClub.totalTeamsCallout",
        additionalFields: [
          {
            field: "totalTeamsCalloutText",
            label: "Callout Text",
            type: "text",
            currentValue: content.totalTeamsCalloutText,
            contentPath: "aboutClub.totalTeamsCalloutText",
          },
        ],
      })
    }
  }

  const handleButtonClick = (buttonNum: 1 | 2) => {
    if (isEditing) {
      onElementSelect({
        sectionKey: "aboutClub",
        elementId: `button${buttonNum}`,
        type: "button",
        label: `Knapp ${buttonNum} Text`,
        currentValue: content[`button${buttonNum}Text`],
        contentPath: `aboutClub.button${buttonNum}Text`,
        additionalFields: [
          {
            field: `button${buttonNum}Link`,
            label: `Knapp ${buttonNum} Länk`,
            type: "select",
            currentValue: content[`button${buttonNum}Link`],
            options: availablePages || [], // Ensure options are provided
            contentPath: `aboutClub.button${buttonNum}Link`,
          },
        ],
      })
    }
  }

  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container grid items-center gap-6 px-4 md:grid-cols-2 md:px-6 lg:gap-10">
        <div className="space-y-4">
          <h2
            className={cn(
              "text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-green-600",
              isEditing && "cursor-text group hover:outline hover:outline-2 hover:outline-gray-300 rounded px-1",
            )}
            contentEditable={isEditing}
            suppressContentEditableWarning={true}
            onBlur={(e) => handleInlineEdit("aboutClub.title", e.currentTarget.innerText)}
          >
            {content.title}
          </h2>
          <p
            className={cn(
              "max-w-[600px] text-gray-700 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed",
              isEditing && "cursor-text group hover:outline hover:outline-2 hover:outline-gray-300 rounded px-1",
            )}
            contentEditable={isEditing}
            suppressContentEditableWarning={true}
            onBlur={(e) => handleInlineEdit("aboutClub.paragraph1", e.currentTarget.innerText)}
          >
            {content.paragraph1}
          </p>
          <p
            className={cn(
              "max-w-[600px] text-gray-700 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed",
              isEditing && "cursor-text group hover:outline hover:outline-2 hover:outline-gray-300 rounded px-1",
            )}
            contentEditable={isEditing}
            suppressContentEditableWarning={true}
            onBlur={(e) => handleInlineEdit("aboutClub.paragraph2", e.currentTarget.innerText)}
          >
            {content.paragraph2}
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="flex flex-col items-center text-center">
              <Users className="h-8 w-8 text-green-600" />
              <p
                className={cn(
                  "mt-2 text-sm font-medium text-gray-600",
                  isEditing && "cursor-text group hover:outline hover:outline-2 hover:outline-gray-300 rounded px-1",
                )}
                contentEditable={isEditing}
                suppressContentEditableWarning={true}
                onBlur={(e) => handleInlineEdit("aboutClub.passionText", e.currentTarget.innerText)}
              >
                {content.passionText}
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <Lightbulb className="h-8 w-8 text-green-600" />
              <p
                className={cn(
                  "mt-2 text-sm font-medium text-gray-600",
                  isEditing && "cursor-text group hover:outline hover:outline-2 hover:outline-gray-300 rounded px-1",
                )}
                contentEditable={isEditing}
                suppressContentEditableWarning={true}
                onBlur={(e) => handleInlineEdit("aboutClub.developmentText", e.currentTarget.innerText)}
              >
                {content.developmentText}
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <Handshake className="h-8 w-8 text-green-600" />
              <p
                className={cn(
                  "mt-2 text-sm font-medium text-gray-600",
                  isEditing && "cursor-text group hover:outline hover:outline-2 hover:outline-gray-300 rounded px-1",
                )}
                contentEditable={isEditing}
                suppressContentEditableWarning={true}
                onBlur={(e) => handleInlineEdit("aboutClub.communityText", e.currentTarget.innerText)}
              >
                {content.communityText}
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-2 min-[400px]:flex-row">
            <Link
              href={content.button1Link}
              className={cn(
                "inline-flex h-10 items-center justify-center rounded-md bg-orange-500 px-8 text-sm font-medium text-white shadow transition-colors hover:bg-orange-600 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-orange-950 disabled:pointer-events-none disabled:opacity-50",
                isEditing && "cursor-pointer group hover:outline hover:outline-2 hover:outline-orange-400 rounded px-1",
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
                "inline-flex h-10 items-center justify-center rounded-md border border-gray-200 bg-white px-8 text-sm font-medium shadow-sm transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50",
                isEditing && "cursor-pointer group hover:outline hover:outline-2 hover:outline-gray-300 rounded px-1",
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
        <div
          className={cn(
            "relative h-[400px] w-full overflow-hidden rounded-xl shadow-xl",
            isEditing && "cursor-pointer group hover:outline hover:outline-2 hover:outline-blue-500 rounded",
          )}
          onClick={handleImageClick}
        >
          <Image
            src={content.imageSrc || "/placeholder.svg"}
            alt={content.imageAlt}
            fill
            className="object-cover object-center"
            unoptimized
            onContextMenu={(e) => e.preventDefault()}
            onDragStart={(e) => e.preventDefault()}
          />
          {isEditing && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-white text-lg font-bold">Redigera bild</span>
            </div>
          )}
          <div
            className={cn(
              "absolute bottom-4 left-4 rounded-lg bg-orange-500 px-4 py-2 text-white text-center shadow-md",
              isEditing && "cursor-pointer group hover:outline hover:outline-2 hover:outline-white rounded px-1",
            )}
            onClick={(e) => {
              if (isEditing) {
                e.stopPropagation() // Prevent image click from triggering
                handleCalloutClick()
              }
            }}
          >
            <div
              className="text-3xl font-bold"
              contentEditable={isEditing}
              suppressContentEditableWarning={true}
              onBlur={(e) => handleInlineEdit("aboutClub.totalTeamsCallout", e.currentTarget.innerText)}
            >
              {content.totalTeamsCallout}
            </div>
            <div
              className="text-sm"
              contentEditable={isEditing}
              suppressContentEditableWarning={true}
              onBlur={(e) => handleInlineEdit("aboutClub.totalTeamsCalloutText", e.currentTarget.innerText)}
            >
              {content.totalTeamsCalloutText}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
