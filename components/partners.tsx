import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"

interface Partner {
  id: string
  name: string
  logo: string
  tier: string
  website?: string
}

interface PartnersProps {
  partners: Partner[]
}

export default function Partners({ partners }: PartnersProps) {
  const partnersByTier = partners.reduce(
    (acc, partner) => {
      if (!acc[partner.tier]) {
        acc[partner.tier] = []
      }
      acc[partner.tier].push(partner)
      return acc
    },
    {} as Record<string, Partner[]>,
  )

  const tierOrder = ["Diamantpartner", "Guldpartner", "Silverpartner", "Bronspartner"]

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Våra Partners</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Vi är stolta över att ha fantastiska partners som stödjer vår verksamhet och gör det möjligt för oss att
            utveckla handbollen i Härnösand.
          </p>
        </div>

        <div className="space-y-12">
          {tierOrder.map((tier) => {
            const tiersPartners = partnersByTier[tier]
            if (!tiersPartners || tiersPartners.length === 0) return null

            return (
              <div key={tier} className="text-center">
                <h3 className="text-2xl font-semibold text-gray-800 mb-8">{tier}</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {tiersPartners.map((partner) => (
                    <Card key={partner.id} className="hover:shadow-lg transition-shadow duration-300">
                      <CardContent className="p-6 flex items-center justify-center">
                        {partner.website ? (
                          <a
                            href={partner.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block w-full h-24 relative"
                          >
                            <Image
                              src={partner.logo || "/placeholder.svg"}
                              alt={partner.name}
                              fill
                              className="object-contain"
                            />
                          </a>
                        ) : (
                          <div className="w-full h-24 relative">
                            <Image
                              src={partner.logo || "/placeholder.svg"}
                              alt={partner.name}
                              fill
                              className="object-contain"
                            />
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
