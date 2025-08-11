import { Header } from "@/components/header"
import Footer from "@/components/footer"
import { Mail, MapPin, Facebook, Instagram } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function KontaktPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="h-24"></div> {/* Spacer for fixed header */}
        <div className="container px-4 md:px-6 py-8 md:py-12 lg:py-16 max-w-7xl mx-auto w-full">
          <h1 className="text-5xl font-bold text-green-700 mb-4 text-center">Kontakta Oss</h1>
          <p className="text-xl text-gray-700 mb-12 text-center max-w-3xl mx-auto">
            Har du frågor eller funderingar? Tveka inte att höra av dig till uss!
          </p>

          {/* Contact Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
            <div className="bg-white/90 shadow-lg rounded-lg p-8 flex flex-col items-center text-center">
              <Mail className="w-12 h-12 text-orange-500 mb-4" />
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">E-post</h2>
              <p className="text-lg text-gray-700 mb-4">Skicka oss ett meddelande när som helst.</p>
              <a href="mailto:info@harnosandshf.se" className="text-green-700 hover:underline text-lg font-medium">
                info@harnosandshf.se
              </a>
            </div>

            <div className="bg-white/90 shadow-lg rounded-lg p-8 flex flex-col items-center text-center">
              <MapPin className="w-12 h-12 text-orange-500 mb-4" />
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">Besöksadress</h2>
              <p className="text-lg text-gray-700 mb-4">Härnösands Handbollsförening</p>
              <p className="text-lg text-gray-700">Idrottsgatan 10</p>
              <p className="text-lg text-gray-700">871 40 Härnösand</p>
            </div>
          </div>

          {/* Social Media Section - Moved outside the grid for full-width centering */}
          <div className="mt-12 text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Följ oss på sociala medier</h2>
            <div className="flex justify-center space-x-6">
              <a
                href="https://www.facebook.com/harnosandshf"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                <Facebook className="w-10 h-10" />
              </a>
              <a
                href="https://www.instagram.com/harnosandshf"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-700 hover:text-pink-600 transition-colors"
              >
                <Instagram className="w-10 h-10" />
              </a>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-16">
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
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
