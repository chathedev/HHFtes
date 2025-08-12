import Link from "next/link"
import { ExternalLink, Instagram } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Header } from "@/components/header"
import Footer from "@/components/footer"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"

export default function LagPage() {
  const teamCategories = [
    {
      name: "A-lag",
      count: 2,
      teams: [
        {
          name: "Dam/utv",
          link: "https://www.laget.se/HHK-dam-utv",
          instagramLink: "https://www.instagram.com/harnosandshfdam/",
        },
        {
          name: "A-lag Herrar",
          link: "https://www.laget.se/HarnosandsHFHerr",
          instagramLink: "https://www.instagram.com/harnosandshfherr/",
        },
      ],
    },
    {
      name: "Ungdomslag",
      count: 21,
      teams: [
        {
          name: "Fritids-Teknikskola",
          link: "https://www.laget.se/HarnosandsHK-Fritids-Teknikskola",
        },
        {
          name: "Flickor 16 (F08/09)",
          link: "https://www.laget.se/HHK-Flickor16",
        },
        {
          name: "F-10",
          link: "https://www.laget.se/HHK-F10",
          instagramLink: "https://www.instagram.com/harnosandhff10/",
        },
        { name: "F-11", link: "https://www.laget.se/HHK-F11" },
        { name: "F-12", link: "https://www.laget.se/HHK-F12" },
        { name: "F-13", link: "https://www.laget.se/HHF-F13" },
        { name: "F-14", link: "https://www.laget.se/HarnosandsHK-F-14" },
        { name: "F-15", link: "https://www.laget.se/HarnosandsHK-F-15" },
        { name: "F-16", link: "https://www.laget.se/HarnosandsHK-F-16" },
        { name: "F-17", link: "https://www.laget.se/HarnosandsHK-F-17" },
        { name: "F-18", link: "https://www.laget.se/HarnosandsHF-F-18" },
        {
          name: "Pojkar 16 (P08/09)",
          link: "https://www.laget.se/HarnosandsHFP09",
        },
        {
          name: "P16 (09/10)",
          link: "https://www.laget.se/HarnosandsHFP16",
          instagramLink: "https://www.instagram.com/harnosandshf_p11/",
        },
        { name: "P-11", link: "https://www.laget.se/HHFP11" },
        { name: "P-12", link: "https://www.laget.se/HarnosandsHFP2012" },
        { name: "P-13", link: "https://www.laget.se/HHF2013" },
        {
          name: "P-14",
          link: "https://www.laget.se/HarnosandsHK-P-14",
          instagramLink: "https://www.instagram.com/harnosands_hf_p14",
        },
        { name: "P-15", link: "https://www.laget.se/HarnosandsHFP2015" },
        { name: "P-16", link: "https://www.laget.se/HarnosandsHFP2016" },
        { name: "P-17", link: "https://www.laget.se/HarnosandsHFP2017" },
        { name: "P-18", link: "https://www.laget.se/HarnosandsHF-P-18" },
      ],
    },
  ]

  const totalTeams = teamCategories.reduce((sum, cat) => sum + cat.count, 0)

  return (
    <>
      <Header />
      <main className="flex-1 bg-white">
        <div className="h-24"></div> {/* Spacer for fixed header */}
        <div className="container px-4 md:px-6 py-8 md:py-12 lg:py-16">
          <h1 className="text-5xl font-bold text-green-700 mb-4 text-center">VÅRA LAG</h1>
          <p className="text-lg text-gray-700 mb-12 text-center max-w-3xl mx-auto">
            Härnösands HF har {totalTeams} lag från ungdom till seniorer. Klicka på ett lag för att besöka deras
            officiella sida.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 text-center">
            <Card className="p-6 bg-white/80 shadow-lg rounded-lg">
              <div className="text-5xl font-bold text-green-700">
                {teamCategories.find((c) => c.name === "A-lag")?.count || 0}
              </div>
              <div className="text-lg text-gray-600">A-lag</div>
            </Card>
            <Card className="p-6 bg-white/80 shadow-lg rounded-lg">
              <div className="text-5xl font-bold text-green-700">
                {teamCategories.find((c) => c.name === "Ungdomslag")?.count || 0}
              </div>
              <div className="text-lg text-gray-600">Ungdomslag</div>
            </Card>
            <Card className="p-6 bg-white/80 shadow-lg rounded-lg">
              <div className="text-5xl font-bold text-green-700">{totalTeams}</div>
              <div className="text-lg text-gray-600">Totalt</div>
            </Card>
          </div>

          {teamCategories.map((category) => (
            <section key={category.name} className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-orange-500">{category.name}</h2>
                <span className="text-xl font-bold text-orange-500">{category.count}</span>
              </div>
              <p className="text-lg text-gray-700 mb-8">{category.count} lag i kategorin</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.teams.map((team, index) => (
                  <Card key={index} className="p-6 bg-white/80 shadow-lg rounded-lg flex flex-col justify-between">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">{team.name}</h3>
                    <Link
                      href={team.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-green-700 hover:underline font-medium group"
                    >
                      Besök lagets sida
                      <ExternalLink className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </Link>
                    {team.instagramLink && (
                      <Link
                        href={team.instagramLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-pink-600 hover:underline font-medium group mt-2"
                      >
                        Följ på Instagram
                        <Instagram className="w-4 h-4 ml-2 transition-transform group-hover:scale-110" />
                      </Link>
                    )}
                  </Card>
                ))}
              </div>
            </section>
          ))}

          <section className="mt-16">
            <div className="bg-white shadow-lg rounded-lg p-8 md:p-12 max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-green-700 mb-8 text-center">Vanliga frågor om att börja träna</h2>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger className="text-lg font-semibold text-gray-800 hover:no-underline">
                    Hur börjar jag spela handboll i Härnösands HF?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-700 text-base">
                    Det enklaste sättet att börja är att kontakta oss! Vi hjälper dig att hitta rätt lag baserat på din
                    ålder och erfarenhet. Du kan fylla i vårt kontaktformulär eller skicka ett mejl direkt till oss.
                    <Link href="/kontakt" className="text-orange-500 hover:underline ml-2">
                      Kontakta oss här.
                    </Link>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger className="text-lg font-semibold text-gray-800 hover:no-underline">
                    Vilken utrustning behöver jag?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-700 text-base">
                    Till en början behöver du bara bekväma träningskläder, inomhusskor och en vattenflaska. Handbollar
                    finns att låna under träningarna. När du väl bestämmer dig för att fortsätta kan du behöva
                    klubbkläder.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger className="text-lg font-semibold text-gray-800 hover:no-underline">
                    Finns det provträningar?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-700 text-base">
                    Absolut! Vi erbjuder alltid några kostnadsfria provträningar så att du kan känna efter om handboll
                    är något för dig. Detta ger dig en chans att träffa laget och tränarna innan du bestämmer dig.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                  <AccordionTrigger className="text-lg font-semibold text-gray-800 hover:no-underline">
                    Hur anmäler jag mig?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-700 text-base">
                    Efter dina provträningar får du information om hur du enkelt anmäler dig och blir en fullvärdig
                    medlem i Härnösands HF. Vi ser fram emot att välkomna dig till vår handbollsfamilj!
                    <Link href="/kontakt" className="text-orange-500 hover:underline ml-2">
                      Anmäl dig via kontaktformuläret.
                    </Link>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              <div className="text-center mt-8">
                <Button
                  asChild
                  className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-md text-lg font-semibold transition-colors"
                >
                  <Link href="/kontakt">Kontakta oss för mer information</Link>
                </Button>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}
