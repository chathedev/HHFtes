"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Mail, MapPin, Users, ChevronDown } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
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
    <div className="container mx-auto px-4 py-8 pt-24">
      <h1 className="text-4xl font-bold text-green-700 mb-8 text-center">Kontakta Oss</h1>
      <p className="text-center text-gray-700 mb-12 max-w-2xl mx-auto">
        Har du frågor eller funderingar? Tveka inte att höra av dig till oss!
      </p>

      <div className="grid md:grid-cols-3 gap-8 mb-12">
        <Card className="text-center p-6 shadow-lg rounded-lg">
          <CardHeader>
            <Mail className="w-12 h-12 text-orange-500 mx-auto mb-4" />
            <CardTitle className="text-2xl font-semibold text-gray-800">{content.kontaktPage.emailTitle}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">{content.kontaktPage.emailDescription}</p>
            <Link
              href={`mailto:${content.kontaktPage.emailAddress}`}
              className="text-green-600 hover:underline font-medium"
            >
              {content.kontaktPage.emailAddress}
            </Link>
          </CardContent>
        </Card>

        <Card className="text-center p-6 shadow-lg rounded-lg">
          <CardHeader>
            <MapPin className="w-12 h-12 text-orange-500 mx-auto mb-4" />
            <CardTitle className="text-2xl font-semibold text-gray-800">{content.kontaktPage.addressTitle}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">{content.kontaktPage.addressDescription}</p>
            <p className="font-medium text-gray-800">{content.kontaktPage.addressLocation}</p>
            <Link
              href="https://www.google.com/maps/search/?api=1&query=%C3%96backa+Sporthall,+H%C3%A4rn%C3%B6sand"
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-600 hover:underline font-medium mt-2 inline-block"
            >
              Visa på karta
            </Link>
          </CardContent>
        </Card>

        <Card className="text-center p-6 shadow-lg rounded-lg">
          <CardHeader>
            <Users className="w-12 h-12 text-orange-500 mx-auto mb-4" />
            <CardTitle className="text-2xl font-semibold text-gray-800">{content.kontaktPage.boardTitle}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">{content.kontaktPage.boardDescription}</p>
            <p className="font-medium text-gray-800">{content.kontaktPage.boardContact}</p>
          </CardContent>
        </Card>
      </div>

      <section className="mb-12">
        <h2 className="text-3xl font-bold text-green-700 mb-6 text-center">{content.kontaktPage.faqTitle}</h2>
        <Accordion type="single" collapsible className="w-full max-w-3xl mx-auto">
          {content.kontaktPage.faqItems.map((item, index) => (
            <AccordionItem value={`item-${index}`} key={index} className="border-b">
              <AccordionTrigger className="flex justify-between items-center py-4 text-lg font-semibold text-gray-800 hover:no-underline">
                {item.question}
                <ChevronDown className="h-5 w-5 shrink-0 transition-transform duration-200" />
              </AccordionTrigger>
              <AccordionContent className="pb-4 text-gray-700 text-base animate-fade-in">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </div>
  )
}
