"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { allPartners, type Partner } from "@/lib/partners-data"
import { loadContent, type PageContent } from "@/lib/content-store"

export default function PartnersPage() {
  const [content, setContent] = useState<PageContent | null>(null)

  useEffect(() => {
    const fetchContent = async () => {
      const fetchedContent = await loadContent()
      setContent(fetchedContent)
    }
    fetchContent()
  }, [])

  if (!content) {
    return <div className="flex justify-center items-center min-h-screen">Laddar innehåll...</div>
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
      <h1 className="text-4xl font-bold text-green-700 mb-4 text-center">{content.partnersPage.title}</h1>
      <p className="text-center text-gray-700 mb-12 max-w-2xl mx-auto">{content.partnersPage.description}</p>

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
                    <div key={partner.id} className="relative group w-full h-36">
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
            </section>
          ),
      )}

      <section className="bg-green-700 text-white p-8 rounded-lg shadow-lg text-center mt-12">
        <h2 className="text-3xl font-bold mb-4">{content.partnersPage.callToActionTitle}</h2>
        <p className="text-lg mb-8">{content.partnersPage.callToActionDescription}</p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            href={content.partnersPage.callToActionLink}
            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-md"
          >
            {content.partnersPage.callToActionLinkText}
          </Link>
        </div>
      </section>
    </div>
  )
}
