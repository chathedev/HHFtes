"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { allPartners, type Partner } from "@/lib/partners-data"
import type { PageContent } from "@/lib/content-store"

interface EditablePartnersPageProps {
  content: PageContent["partnersPage"]
  isEditing: boolean
  onContentChange?: (field: keyof PageContent["partnersPage"], value: string | number) => void
}

export default function EditablePartnersPage({ content, isEditing, onContentChange }: EditablePartnersPageProps) {
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null)

  const handleTextChange = (field: keyof PageContent["partnersPage"], e: React.ChangeEvent<HTMLDivElement>) => {
    if (onContentChange) {
      onContentChange(field, e.currentTarget.innerText)
    }
  }

  const handleLinkChange = (field: keyof PageContent["partnersPage"], e: React.ChangeEvent<HTMLInputElement>) => {
    if (onContentChange) {
      onContentChange(field, e.target.value)
    }
  }

  const partnersByTier: Record<string, Partner[]> = allPartners.reduce(
    (acc, partner) => {
      if (!acc[partner.tier]) {
        acc[partner.tier] = []
      }
      acc[partner.tier].push(partner)
      return acc
    },
    {} as Record<string, Partner[]>,
  )

  const tierOrder = ["Diamantpartner", "Platinapartner", "Guldpartner", "Silverpartner", "Bronspartner"]

  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      <h1 className="text-4xl font-bold text-green-700 mb-4 text-center">
        <span
          contentEditable={isEditing}
          suppressContentEditableWarning={true}
          onBlur={(e) => handleTextChange("title", e)}
        >
          {content.title}
        </span>
      </h1>
      <p className="text-center text-gray-700 mb-12 max-w-2xl mx-auto">
        <span
          contentEditable={isEditing}
          suppressContentEditableWarning={true}
          onBlur={(e) => handleTextChange("description", e)}
        >
          {content.description}
        </span>
      </p>

      {tierOrder.map(
        (tierName) =>
          partnersByTier[tierName] && (
            <section key={tierName} className="mb-12">
              <h2 className="text-3xl font-bold text-orange-500 mb-6 text-center">{tierName}</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                {partnersByTier[tierName].map((partner) => {
                  const isDiamant = partner.tier === "Diamantpartner"
                  const isHighcon = partner.id === "highcon"
                  return (
                    <div
                      key={partner.id}
                      className="relative group w-full h-36"
                      onMouseEnter={() => setHoveredCardId(partner.id)}
                      onMouseLeave={() => setHoveredCardId(null)}
                    >
                      <Card
                        className={`p-4 shadow-lg rounded-lg flex flex-col items-center justify-center h-full w-full text-center
                          ${isDiamant ? "border-2 border-yellow-500" : "bg-white/80"}
                        `}
                      >
                        {isDiamant && (
                          <Star className="absolute top-1 right-1 w-5 h-5 text-yellow-500 fill-yellow-500" />
                        )}
                        <div className={`relative w-full mb-2 ${isHighcon ? "h-24" : "h-20"}`}>
                          <Image
                            src={partner.src || "/placeholder.svg"}
                            alt={partner.alt}
                            fill
                            unoptimized
                            className="object-contain transition-transform duration-300 group-hover:scale-105"
                          />
                        </div>
                        <h4 className={`text-sm font-semibold ${isDiamant ? "text-gray-900" : "text-gray-800"}`}>
                          {partner.alt}
                        </h4>
                        {partner.linkUrl && (
                          <div
                            className={`absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center rounded-lg transition-opacity duration-300
                              ${hoveredCardId === partner.id ? "opacity-100" : "opacity-0 group-hover:opacity-100"}
                            `}
                          >
                            <Button
                              onClick={(e) => {
                                if (isEditing) {
                                  e.preventDefault()
                                } else {
                                  window.open(partner.linkUrl, "_blank")
                                }
                              }}
                              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md"
                            >
                              Gå till
                            </Button>
                          </div>
                        )}
                      </Card>
                    </div>
                  )
                })}
              </div>
            </section>
          ),
      )}

      <section className="bg-green-700 text-white p-8 rounded-lg shadow-lg text-center mt-12">
        <h2 className="text-3xl font-bold mb-4">
          <span
            contentEditable={isEditing}
            suppressContentEditableWarning={true}
            onBlur={(e) => handleTextChange("callToActionTitle", e)}
          >
            {content.callToActionTitle}
          </span>
        </h2>
        <p className="text-lg mb-8">
          <span
            contentEditable={isEditing}
            suppressContentEditableWarning={true}
            onBlur={(e) => handleTextChange("callToActionDescription", e)}
          >
            {content.callToActionDescription}
          </span>
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            href={isEditing ? "#" : content.callToActionLink}
            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-md"
            onClick={(e) => {
              if (isEditing) e.preventDefault()
            }}
          >
            <span
              contentEditable={isEditing}
              suppressContentEditableWarning={true}
              onBlur={(e) => handleTextChange("callToActionLinkText", e)}
            >
              {content.callToActionLinkText}
            </span>
            {isEditing && (
              <input
                type="text"
                value={content.callToActionLink}
                onChange={(e) => handleLinkChange("callToActionLink", e)}
                className="ml-2 p-1 text-xs text-gray-800 bg-white rounded"
                placeholder="Länk"
                onClick={(e) => e.stopPropagation()} // Prevent link click
              />
            )}
          </Link>
        </div>
      </section>
    </div>
  )
}
