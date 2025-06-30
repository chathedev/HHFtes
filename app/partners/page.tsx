"use client"

import Link from "next/link"
import Image from "next/image"
import { ChevronLeft, Star, Plus, Minus } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { allPartners, type Partner } from "@/lib/partners-data"
import { useState, useEffect } from "react"
import { loadContent, type PageContent } from "@/lib/content-store"

export default function PartnersPage() {
  const [openTier, setOpenTier] = useState<string | null>("Diamantpartner") // State to manage open tier
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null) // State to manage hovered card
  const [content, setContent] = useState<PageContent | null>(null)

  useEffect(() => {
    const fetchContent = async () => {
      const fetchedContent = await loadContent()
      setContent(fetchedContent)
    }
    fetchContent()
  }, [])

  const handleToggle = (tierName: string) => {
    setOpenTier((prevOpenTier) => (prevOpenTier === tierName ? null : tierName))
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

  if (!content) {
    return <div className="flex justify-center items-center min-h-screen">Laddar innehåll...</div>
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <main className="flex-1 py-8 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <Link href="/" className="inline-flex items-center text-green-700 hover:underline mb-8">
          <ChevronLeft className="w-4 h-4 mr-2" />
          Tillbaka till startsidan
        </Link>

        <h1 className="text-5xl font-bold text-green-700 mb-4 text-center">{content.partnersPage.title}</h1>
        <p className="text-xl text-gray-700 mb-12 text-center max-w-3xl mx-auto">{content.partnersPage.description}</p>

        {tierOrder.map(
          (tierName) =>
            partnersByTier[tierName] && (
              <section key={tierName} className="mb-8 border-b border-gray-200 pb-4">
                <div
                  className="flex justify-between items-center mb-4 cursor-pointer"
                  onClick={() => handleToggle(tierName)}
                >
                  <h2 className="text-3xl font-bold text-orange-500">{tierName}</h2>
                  <Button variant="ghost" size="icon" aria-expanded={openTier === tierName}>
                    {openTier === tierName ? (
                      <Minus className="w-6 h-6 text-green-700" />
                    ) : (
                      <Plus className="w-6 h-6 text-green-700" />
                    )}
                  </Button>
                </div>
                {openTier === tierName && (
                  <div className="flex justify-center animate-fade-in">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                      {partnersByTier[tierName].map((partner, index) => {
                        const isDiamant = partner.tier === "Diamantpartner"
                        const isHighcon = partner.id === "highcon"
                        const cardContent = (
                          <Card
                            key={index}
                            className={`relative p-4 shadow-lg rounded-lg flex flex-col items-center justify-center h-full w-full text-center
                            ${isDiamant ? "border-2 border-yellow-500" : "bg-white/80"}
                          `}
                          >
                            {isDiamant && (
                              <Star className="absolute top-1 right-1 w-5 h-5 text-yellow-500 fill-yellow-500" />
                            )}
                            <div className={`relative w-full mb-2 ${isHighcon ? "h-32" : "h-24"}`}>
                              <Image
                                src={partner.src || "/placeholder.svg"}
                                alt={partner.alt}
                                fill
                                unoptimized
                                className="object-contain transition-transform duration-300 hover:scale-105"
                              />
                            </div>
                            <h3 className={`text-sm font-semibold ${isDiamant ? "text-gray-900" : "text-gray-800"}`}>
                              {partner.alt}
                            </h3>
                            {partner.benefits.length > 0 && (
                              <p className={`text-xs mt-1 ${isDiamant ? "text-gray-700" : "text-gray-500"}`}>
                                {partner.benefits[0]}
                              </p>
                            )}

                            {/* Hover Overlay */}
                            {hoveredCardId === partner.id && partner.linkUrl && (
                              <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center rounded-lg transition-opacity duration-300 opacity-0 group-hover:opacity-100">
                                <Button
                                  onClick={() => window.open(partner.linkUrl, "_blank")}
                                  className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md"
                                >
                                  Gå till
                                </Button>
                              </div>
                            )}
                          </Card>
                        )
                        return (
                          <div
                            key={partner.id}
                            className="relative group w-full h-36"
                            onMouseEnter={() => setHoveredCardId(partner.id)}
                            onMouseLeave={() => setHoveredCardId(null)}
                            title={partner.linkUrl ? "Besök sponsor" : undefined}
                          >
                            {cardContent}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </section>
            ),
        )}

        <section className="bg-green-700 text-white p-8 rounded-lg shadow-lg text-center mt-12">
          <h2 className="text-3xl font-bold mb-4">{content.partnersPage.callToActionTitle}</h2>
          <p className="text-lg mb-8">{content.partnersPage.callToActionDescription}</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-md">
              <Link href={content.partnersPage.callToActionLink}>{content.partnersPage.callToActionLinkText}</Link>
            </Button>
          </div>
        </section>
      </main>
    </div>
  )
}
