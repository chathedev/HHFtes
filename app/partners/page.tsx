export const dynamic = "force-dynamic"

import Image from "next/image"
import Link from "next/link"
import { Star } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { defaultContent } from "@/lib/default-content"
import type { Partner, SiteContent } from "@/lib/content-types"

const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || "https://api.nuredo.se"

async function getDynamicContent(): Promise<SiteContent> {
  try {
    const res = await fetch(`${BACKEND_API_URL}/api/content`, { cache: "no-store" })
    if (!res.ok) {
      console.error(`Failed to fetch content from backend: ${res.statusText}`)
      return defaultContent // Fallback to default content
    }
    const data = await res.json()
    // Merge fetched content with default to ensure all fields exist
    return { ...defaultContent, ...data, partners: data.partners || defaultContent.partners }
  } catch (error) {
    console.error("Error fetching dynamic content:", error)
    return defaultContent // Fallback to default content on error
  }
}

interface PartnersPageContentProps {
  partners: Partner[]
}

function PartnersPageContent({ partners }: PartnersPageContentProps) {
  const partnersByTier: Record<string, Partner[]> = partners.reduce(
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
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-5xl font-extrabold text-center mb-4 text-gray-900">
        Våra <span className="text-orange-500">Partners</span>
      </h1>
      <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto text-lg">
        Vi är djupt tacksamma för det ovärderliga stöd vi får från våra partners. Deras engagemang är avgörande för att
        vi ska kunna fortsätta utveckla handbollen i Härnösand och erbjuda en meningsfull fritidsaktivitet för alla
        åldrar.
      </p>

      {tierOrder.map(
        (tierName) =>
          partnersByTier[tierName] && (
            <section key={tierName} className="mb-12">
              <h2 className="text-4xl font-bold text-green-700 mb-8 text-center">{tierName}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
                {partnersByTier[tierName].map((partner) => {
                  const isDiamant = partner.tier === "Diamantpartner"
                  return (
                    <Card
                      key={partner.id}
                      className={`p-6 shadow-lg rounded-lg flex flex-col items-center text-center transition-all duration-300 hover:shadow-xl
                        ${isDiamant ? "border-4 border-yellow-500 bg-yellow-50" : "bg-white"}
                      `}
                    >
                      {isDiamant && <Star className="w-8 h-8 text-yellow-500 fill-yellow-500 mb-4" />}
                      <div className="relative w-full h-24 mb-4">
                        <Image
                          src={partner.src || "/placeholder.svg"}
                          alt={partner.alt}
                          fill
                          unoptimized
                          className="object-contain"
                        />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{partner.alt}</h3>
                      {partner.benefits && partner.benefits.length > 0 && (
                        <ul className="text-sm text-gray-600 list-disc list-inside mb-4">
                          {partner.benefits.map((benefit, index) => (
                            <li key={index}>{benefit}</li>
                          ))}
                        </ul>
                      )}
                      {partner.linkUrl && (
                        <Button asChild className="mt-auto bg-orange-500 hover:bg-orange-600 text-white">
                          <Link href={partner.linkUrl} target="_blank" rel="noopener noreferrer">
                            Besök hemsida
                          </Link>
                        </Button>
                      )}
                    </Card>
                  )
                })}
              </div>
            </section>
          ),
      )}

      <section className="bg-green-700 text-white p-10 rounded-lg shadow-xl text-center mt-16">
        <h2 className="text-4xl font-bold mb-4">Bli en del av Härnösands HF-familjen!</h2>
        <p className="text-xl mb-8">
          Är ditt företag intresserat av att stödja lokal idrott och synas tillsammans med oss? Vi erbjuder olika
          partnerskapspaket som kan anpassas efter era behov.
        </p>
        <Link
          href="/kontakt"
          className="bg-orange-500 hover:bg-orange-600 text-white px-10 py-4 rounded-full text-lg font-semibold shadow-lg transition-transform transform hover:scale-105"
        >
          Kontakta oss för mer information
        </Link>
      </section>
    </div>
  )
}

export default async function PartnersPage() {
  const content = await getDynamicContent()
  return <PartnersPageContent partners={content.partners} />
}
