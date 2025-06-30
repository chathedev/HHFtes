import Link from "next/link"
import { ChevronLeft, Mail, MapPin, Users } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function KontaktPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <main className="flex-1 py-8 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <Link href="/" className="inline-flex items-center text-green-700 hover:underline mb-8">
          <ChevronLeft className="w-4 h-4 mr-2" />
          Tillbaka till startsidan
        </Link>

        <h1 className="text-5xl font-bold text-green-700 mb-12 text-center">Kontakt</h1>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <Card className="p-6 bg-white/80 shadow-lg rounded-lg flex items-start gap-4">
            <Mail className="w-6 h-6 text-green-700 flex-shrink-0" />
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">E-post</h2>
              <p className="text-lg text-gray-700 mb-2">Skicka dina frågor till oss via e-post</p>
              <a href="mailto:info@harnosandshf.se" className="text-orange-500 hover:underline text-lg font-medium">
                info@harnosandshf.se
              </a>
            </div>
          </Card>
          <Card className="p-6 bg-white/80 shadow-lg rounded-lg flex items-start gap-4">
            <MapPin className="w-6 h-6 text-green-700 flex-shrink-0" />
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">Besöksadress</h2>
              <p className="text-lg text-gray-700 mb-2">Hitta oss på våra träningar</p>
              <p className="text-lg text-gray-700">Öbacka Sporthall, Härnösand</p>
            </div>
          </Card>
          <Card className="p-6 bg-white/80 shadow-lg rounded-lg flex items-start gap-4 md:col-span-2">
            <Users className="w-6 h-6 text-green-700 flex-shrink-0" />
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">Styrelse</h2>
              <p className="text-lg text-gray-700 mb-2">Kontakta vår styrelse för föreningsfrågor</p>
              <p className="text-lg text-gray-700">Via e-post eller på träningarna</p>
            </div>
          </Card>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold text-orange-500 mb-6 text-center md:text-left">Vanliga frågor</h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-lg font-semibold text-gray-800 hover:no-underline">
                Hur blir jag en ny spelare?
              </AccordionTrigger>
              <AccordionContent className="text-gray-700 text-base animate-fade-in">
                Kontakta oss via e-post eller telefon för att få information om provträningar och hur du anmäler dig
                till ett av våra lag. Vi välkomnar spelare i alla åldrar och nivåer!
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger className="text-lg font-semibold text-gray-800 hover:no-underline">
                Hur kan mitt företag sponsra Härnösands HF?
              </AccordionTrigger>
              <AccordionContent className="text-gray-700 text-base animate-fade-in">
                Vi är alltid öppna för nya partnerskap. Vänligen e-posta oss på info@harnosandshf.se för att diskutera
                sponsringsmöjligheter och hur vi kan samarbeta.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger className="text-lg font-semibold text-gray-800 hover:no-underline">
                Var finns era träningsanläggningar?
              </AccordionTrigger>
              <AccordionContent className="text-gray-700 text-base animate-fade-in">
                Våra huvudsakliga träningsanläggningar är Öbacka Sporthall och Landgrenshallen i Härnösand. Specifika
                tider och hallar för varje lag finns på respektive lagsida.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger className="text-lg font-semibold text-gray-800 hover:no-underline">
                Var hittar jag matchschemat?
              </AccordionTrigger>
              <AccordionContent className="text-gray-700 text-base animate-fade-in">
                Matchscheman för alla våra lag finns på de lagspecifika sidorna under "Lag" i menyn. Du kan också hitta
                en översikt över kommande matcher på vår "Matcher"-sida.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>
      </main>
    </div>
  )
}
