"use client"

import Image from "next/image"
import Link from "next/link"
import { Header } from "@/components/header"
import Footer from "@/components/footer"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"

function formatDate(dateStr?: string) {
  try {
    if (!dateStr) return ""
    const d = new Date(dateStr)
    if (Number.isNaN(d.getTime())) return dateStr
    return new Intl.DateTimeFormat("sv-SE", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(d)
  } catch {
    return dateStr ?? ""
  }
}

const NEWS = [
  {
    guid: "99b802a3-5608-da7e-a12c-d5f4bb0360d6",
    title: "Handbollscamp 2025",
    link: "https://www.laget.se/HarnosandsHF/News/7904135/Handbollscamp-2025",
    description:
      "Spelare födda 2012 - 2015 se hit!<br>I år kör vi ett handbollscamp In och anmäl er på länken!<br> <a href='https://forms.office.com/Pages/ResponsePage.aspx?id=w-9zaNc360mUkFNgRBSBcAo4fkaTJfNPhDtAxiaNejZUOTNSTUZYUU9YMlUwMjBHUlRSUlhLTDlSQi4u' target='_blank' rel='noopener noreferrer'>Anmälan</a><br/><br/><i>Publicerad: 2025-07-03 19:13</i>",
    pubDate: "Thu, 03 Jul 2025 17:13:00 GMT",
    image: "https://laget001.blob.core.windows.net/11571904_medium.jpg",
  },
  {
    guid: "1d1a7224-4453-96b0-2e3e-eb3bdc68315e",
    title: "Årsmöte HHF",
    link: "https://www.laget.se/HarnosandsHF/News/7880108/Arsmote-HHF",
    description:
      "Hej Medlemmar,<br>Välkomna på årsmöte! Dags att summera säsongen 24/25.<br>Tid: 18:00 23 Juni.<br>Plats: House Be, Strengbergsgatan 2 (Företagshotellet)<br><br>Erforderliga handlingar kommer skickas ut i tid enligt stadgar.<br/><br/><i>Publicerad: 2025-05-23 19:51</i>",
    pubDate: "Fri, 23 May 2025 17:51:27 GMT",
  },
  {
    guid: "32611364-77df-9b2a-89c3-166316e6a3aa",
    title: "Ny Sportchef för Herrverksamheten",
    link: "https://www.laget.se/HarnosandsHF/News/7714033/Ny-Sportchef-for-Herrverksamheten",
    description:
      "Anette Norberg byter sport!<br><br>… (förkortad text – klipp från RSS) …<br/><br/><i>Publicerad: 2024-10-04 15:21</i>",
    pubDate: "Fri, 04 Oct 2024 13:21:41 GMT",
    image: "https://laget001.blob.core.windows.net/11238189_medium.png",
  },
  {
    guid: "b6fccd06-d4a7-712c-16d1-80b73c6e704d",
    title: "Handbollsfritids & Teknikskola startar 8/11",
    link: "https://www.laget.se/HarnosandsHF/News/7709515/Handbollsfritids---Teknikskola-startar-8-11",
    description: "Äntligen dags för Handbollsfritids & Teknikskola igen!<br/><br/><i>Publicerad: 2024-09-30 08:42</i>",
    pubDate: "Mon, 30 Sep 2024 06:42:54 GMT",
    image: "https://laget001.blob.core.windows.net/10923470_medium.jpg",
  },
]

export default function NyheterPage() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-white">
        <div className="h-24"></div> {/* Spacer for fixed header */}
        <div className="container px-4 md:px-6 py-8 md:py-12 lg:py-16">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-8 text-green-700">Senaste Nyheterna</h1>
          <p className="text-lg text-gray-700 mb-8">
            Här hittar du de senaste nyheterna och uppdateringarna från Härnösands HF.
          </p>

          <div className="flex justify-center mb-8">
            <div className="relative w-full max-w-md">
              <Input
                type="text"
                placeholder="Sök nyheter..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
          </div>

          <ul className="grid sm:grid-cols-2 gap-4">
            {NEWS.map((item) => (
              <li key={item.guid} className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                {item.image && (
                  <Link href={item.link} target="_blank" rel="noopener noreferrer">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.title}
                      width={600} // Added width
                      height={400} // Added height
                      className="w-full h-40 object-cover"
                      priority // Use priority for images in the initial view
                    />
                  </Link>
                )}
                <div className="p-4">
                  <Link href={item.link} target="_blank" rel="noopener noreferrer" className="hover:underline">
                    <h3 className="text-lg font-semibold leading-snug">{item.title}</h3>
                  </Link>
                  {item.pubDate && <p className="text-xs text-gray-500 mt-1">{formatDate(item.pubDate)}</p>}
                  <div
                    className="prose prose-sm max-w-none text-gray-700 mt-3"
                    dangerouslySetInnerHTML={{ __html: item.description }}
                  />
                </div>
              </li>
            ))}
          </ul>

          {/* FAQ Section */}
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
