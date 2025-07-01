"use client"

import Image from "next/image"
import Link from "next/link"
import type { Partner } from "@/lib/content-types"
import { Star, Plus, Minus } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface PartnersCarouselProps {
  partners: Partner[]
}

export default function PartnersCarousel({ partners }: PartnersCarouselProps) {
  const [openTier, setOpenTier] = useState<string | null>("Diamantpartner")
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null)

  const handleToggle = (tierName: string) => {
    setOpenTier((prevOpenTier) => (prevOpenTier === tierName ? null : tierName))
  }

  // Ensure partners is an array before filtering
  const partnersForDisplay = Array.isArray(partners) ? partners.filter((p) => p.visibleInCarousel) : []

  const partnersByTier: Record<string, Partner[]> = partnersForDisplay.reduce(
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
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-2">
          Våra <span className="text-orange-500">Partners</span>
        </h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Vi är stolta över att samarbeta med lokala företag och organisationer som stödjer vår verksamhet och hjälper
          us to develop handball in Härnösand.
        </p>

        {tierOrder.map(
          (tierName) =>
            partnersByTier[tierName] && (
              <section key={tierName} className="mb-8 border-b border-gray-200 pb-4">
                <div
                  className="flex justify-between items-center mb-4 cursor-pointer"
                  onClick={() => handleToggle(tierName)}
                >
                  <h3 className="text-3xl font-bold text-green-600">{tierName}</h3>
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
                      {partnersByTier[tierName].map((partner) => {
                        const isDiamant = partner.tier === "Diamantpartner"
                        const isHighcon = partner.id === "highcon" // Assuming 'highcon' is a specific ID for special styling
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
          <h2 className="text-3xl font-bold mb-4">Vill du stödja Härnösands HF?</h2>
          <p className="text-lg mb-8">
            Vi välkomnar nya partners som vill stödja vår verksamhet och bidra till utvecklingen av handbollen i
            regionen.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/kontakt" className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-md">
              Kontakta oss
            </Link>
          </div>
        </section>
      </div>
    </section>
  )
}
