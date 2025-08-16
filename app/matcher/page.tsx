"use client"

import { Header } from "@/components/header"
import Footer from "@/components/footer"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useEffect, useState } from "react"

interface Match {
  id: string
  title: string
  date: string
  time: string
  opponent: string
  location: string
  isHome: boolean
  eventType: string
}

interface GroupedMatches {
  [monthYear: string]: Match[]
}

type FilterType = "all" | "home" | "away"

export default function MatcherPage() {
  const [content, setContent] = useState<any>(null)
  const [contentLoading, setContentLoading] = useState(true)
  const [filter, setFilter] = useState<FilterType>("all")

  // Load static content from JSON
  useEffect(() => {
    const loadContent = async () => {
      try {
        const response = await fetch("/content/matcher.json")
        if (response.ok) {
          const data = await response.json()
          setContent(data)
        } else {
          setContent(getDefaultContent())
        }
      } catch (error) {
        console.error("Failed to load content:", error)
        setContent(getDefaultContent())
      } finally {
        setContentLoading(false)
      }
    }

    loadContent()
  }, [])

  const getDefaultContent = () => ({
    pageTitle: "Kommande Matcher",
    pageDescription: "Se alla kommande matcher för Härnösands HF",
    loadingMessage: "Laddar matcher...",
    errorMessage: "Fel: Detta kan bero på problem med att hämta data från källan.",
    noMatchesMessage: "Inga matcher planerade för närvarande.",
    filterLabels: {
      all: "Alla matcher",
      home: "Hemma",
      away: "Borta",
    },
    faq: [
      {
        question: "Hur börjar jag spela handboll i Härnösands HF?",
        answer:
          "Det enklaste sättet att börja är att kontakta oss! Vi hjälper dig att hitta rätt lag baserat på din ålder och erfarenhet. Du kan fylla i vårt kontaktformulär eller skicka ett mejl direkt till oss.",
      },
      {
        question: "Vilken utrustning behöver jag?",
        answer:
          "Till en början behöver du bara bekväma träningskläder, inomhusskor och en vattenflaska. Handbollar finns att låna under träningarna. När du väl bestämmer dig för att fortsätta kan du behöva klubbkläder.",
      },
      {
        question: "Finns det provträningar?",
        answer:
          "Absolut! Vi erbjuder alltid några kostnadsfria provträningar så att du kan känna efter om handboll är något för dig. Detta ger dig en chans att träffa laget och tränarna innan du bestämmer dig.",
      },
      {
        question: "Hur anmäler jag mig?",
        answer:
          "Efter dina provträningar får du information om hur du enkelt anmäler dig och blir en fullvärdig medlem i Härnösands HF. Vi ser fram emot att välkomna dig till vår handbollsfamilj!",
      },
    ],
  })

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("sv-SE", { day: "numeric", month: "short" })
  }

  if (contentLoading) {
    return (
      <>
        <Header />
        <main className="flex-1 bg-gray-50">
          <div className="h-24"></div>
          <div className="container px-4 md:px-6 py-12 md:py-16 lg:py-20">
            <div className="flex items-center justify-center py-8">
              <p className="text-gray-600">Laddar sida...</p>
            </div>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  if (!content) {
    return (
      <>
        <Header />
        <main className="flex-1 bg-gray-50">
          <div className="h-24"></div>
          <div className="container px-4 md:px-6 py-12 md:py-16 lg:py-20">
            <div className="flex items-center justify-center py-8">
              <p className="text-red-600">Kunde inte ladda sida. Försök igen senare.</p>
            </div>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="flex-1 bg-gray-50">
        <div className="h-24"></div>
        <div className="container px-4 md:px-6 py-12 md:py-16 lg:py-20">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4 text-center text-green-700">
            {content?.pageTitle || "Kommande Matcher"}
          </h1>

          {/* Development message */}
          <div className="max-w-2xl mx-auto text-center py-16">
            <div className="bg-white rounded-lg shadow-lg p-8 border-l-4 border-orange-500">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Under utveckling</h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Vi arbetar för närvarande med ett partnerskap/API-åtkomst från Profixio för att göra matchvisningen
                enklare och snabbare. Tack för ditt tålamod!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <p className="text-sm text-gray-500">Har du frågor?</p>
                <Button asChild className="bg-orange-500 hover:bg-orange-600 text-white">
                  <a href="mailto:kontakt@harnosandshf.se">Kontakta oss</a>
                </Button>
              </div>
            </div>

            <div className="bg-orange-50 rounded-lg shadow-md p-6 mt-8 border-l-4 border-green-600">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Under tiden</h3>
              <p className="text-gray-600 mb-4">Du kan se alla våra matcher direkt på Profixio:</p>
              <Button
                asChild
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-md font-semibold transition-colors"
              >
                <a
                  href="https://www.profixio.com/app/tournaments?term=&filters[open_registration]=0&filters[kampoppsett]=0&filters[land_id]=se&filters[type]=seriespill&filters[idrett]=HB&filters[listingtype]=matches&filters[season]=765&dateTo=2026-04-30&klubbid=26031&dateFrom=2025-08-16"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Visa Matcher på Profixio
                </a>
              </Button>
            </div>
          </div>

          {/* FAQ Section */}
          <section className="bg-white shadow-lg rounded-lg p-8 md:p-12 max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-green-700 mb-8 text-center">Vanliga frågor om att börja träna</h2>
            <Accordion type="single" collapsible className="w-full">
              {content.faq.map((faqItem: any, index: number) => (
                <AccordionItem key={index} value={`item-${index + 1}`}>
                  <AccordionTrigger className="text-lg font-semibold text-gray-800 hover:no-underline">
                    {faqItem.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-700 text-base">
                    {faqItem.answer}
                    {faqItem.question.includes("anmäler") && (
                      <Link href="/kontakt" className="text-orange-500 hover:underline ml-2">
                        Anmäl dig via kontaktformuläret.
                      </Link>
                    )}
                    {faqItem.question.includes("börjar") && (
                      <Link href="/kontakt" className="text-orange-500 hover:underline ml-2">
                        Kontakta oss här.
                      </Link>
                    )}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            <div className="text-center mt-8">
              <Button
                asChild
                className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-md text-lg font-semibold transition-colors"
              >
                <a href="/kontakt">Kontakta oss för mer information</a>
              </Button>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}
