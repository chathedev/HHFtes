import { PartnersCarouselClient } from "@/app/partners-carousel-client"
import { allPartners, type Partner } from "@/lib/partners-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"
import { ExternalLink } from "lucide-react"

export default function PartnersPage() {
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
    <div className="container mx-auto px-4 py-8 md:py-12">
      <h1 className="text-4xl font-bold text-center text-green-700 mb-8">Våra Partners</h1>

      <section className="mb-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Huvudpartners</h2>
        <div className="flex justify-center mb-8">
          <PartnersCarouselClient />
        </div>
        <p className="text-center text-gray-600 max-w-2xl mx-auto">
          Vi är oerhört tacksamma för det ovärderliga stöd vi får från alla våra partners. Deras engagemang gör det
          möjligt för oss att fortsätta utveckla fotbollen i Härnösand och erbjuda en meningsfull verksamhet för alla
          åldrar.
        </p>
      </section>

      {tierOrder.map(
        (tierName) =>
          partnersByTier[tierName] && (
            <section key={tierName} className="mb-10">
              <h2 className="text-3xl font-bold text-green-600 mb-6 border-b pb-2">{tierName}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {partnersByTier[tierName].map((partner) => (
                  <Card key={partner.id} className="shadow-md hover:shadow-lg transition-shadow flex flex-col">
                    <CardHeader className="flex-row items-center space-x-4 space-y-0 pb-2">
                      <Image
                        src={partner.src || "/placeholder.svg"}
                        alt={partner.alt}
                        width={60}
                        height={60}
                        className="object-contain"
                      />
                      <CardTitle className="text-xl font-semibold text-gray-800">{partner.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow flex flex-col justify-between">
                      <p className="text-gray-600 text-sm mb-4">
                        {partner.tier} sedan {new Date().getFullYear() - 3}
                      </p>
                      {partner.linkUrl && (
                        <Link
                          href={partner.linkUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-orange-500 hover:text-orange-600 transition-colors font-medium"
                        >
                          Besök hemsida
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          ),
      )}

      <section className="bg-green-700 text-white p-8 rounded-lg shadow-lg text-center mt-12">
        <h2 className="text-3xl font-bold mb-4">Bli en del av vårt team!</h2>
        <p className="text-lg mb-8">
          Är ditt företag intresserat av att stödja Härnösands FF och samtidigt få värdefull exponering? Kontakta oss
          för att diskutera partnerskapsmöjligheter.
        </p>
        <Link
          href="/kontakt"
          className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-md text-lg font-medium transition-colors"
        >
          Kontakta oss om partnerskap
        </Link>
      </section>
    </div>
  )
}
