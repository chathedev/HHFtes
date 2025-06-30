"use client"

import Link from "next/link"
import { ChevronLeft, Mail, MapPin, Users } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { useState, useEffect } from "react"
import { loadContent, type PageContent } from "@/lib/content-store"

export default function KontaktPage() {
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
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">{content.kontaktPage.emailTitle}</h2>
              <p className="text-lg text-gray-700 mb-2">{content.kontaktPage.emailDescription}</p>
              <a
                href={`mailto:${content.kontaktPage.emailAddress}`}
                className="text-orange-500 hover:underline text-lg font-medium"
              >
                {content.kontaktPage.emailAddress}
              </a>
            </div>
          </Card>
          <Card className="p-6 bg-white/80 shadow-lg rounded-lg flex items-start gap-4">
            <MapPin className="w-6 h-6 text-green-700 flex-shrink-0" />
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">{content.kontaktPage.addressTitle}</h2>
              <p className="text-lg text-gray-700 mb-2">{content.kontaktPage.addressDescription}</p>
              <p className="text-lg text-gray-700">{content.kontaktPage.addressLocation}</p>
            </div>
          </Card>
          <Card className="p-6 bg-white/80 shadow-lg rounded-lg flex items-start gap-4 md:col-span-2">
            <Users className="w-6 h-6 text-green-700 flex-shrink-0" />
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">{content.kontaktPage.boardTitle}</h2>
              <p className="text-lg text-gray-700 mb-2">{content.kontaktPage.boardDescription}</p>
              <p className="text-lg text-gray-700">{content.kontaktPage.boardContact}</p>
            </div>
          </Card>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold text-orange-500 mb-6 text-center md:text-left">
            {content.kontaktPage.faqTitle}
          </h2>
          <Accordion type="single" collapsible className="w-full">
            {content.kontaktPage.faqItems.map((item, index) => (
              <AccordionItem key={index} value={`item-${index + 1}`}>
                <AccordionTrigger className="text-lg font-semibold text-gray-800 hover:no-underline">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-700 text-base animate-fade-in">{item.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>
      </main>
    </div>
  )
}
