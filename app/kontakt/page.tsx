"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Mail, MapPin, Users } from "lucide-react"
import { loadContent, type PageContent } from "@/lib/content-store"

export default function KontaktPage() {
  const [content, setContent] = useState<PageContent | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true)
      const fetchedContent = await loadContent()
      setContent(fetchedContent)
      setLoading(false)
    }
    fetchContent()
  }, [])

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Laddar innehåll...</div>
  }

  if (!content) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        Kunde inte ladda innehåll för kontaktsidan.
      </div>
    )
  }

  const { kontaktPage } = content

  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      <h1 className="text-4xl font-bold text-green-700 mb-8 text-center">Kontakta Oss</h1>
      <p className="text-center text-gray-700 mb-12 max-w-2xl mx-auto">
        Har du frågor eller funderingar? Tveka inte att höra av dig till oss!
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <Card className="text-center">
          <CardHeader>
            <Mail className="mx-auto h-12 w-12 text-orange-500" />
            <CardTitle className="mt-4">{kontaktPage.emailTitle}</CardTitle>
            <CardDescription>{kontaktPage.emailDescription}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold text-gray-800">{kontaktPage.emailAddress}</p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardHeader>
            <MapPin className="mx-auto h-12 w-12 text-orange-500" />
            <CardTitle className="mt-4">{kontaktPage.addressTitle}</CardTitle>
            <CardDescription>{kontaktPage.addressDescription}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold text-gray-800">{kontaktPage.addressLocation}</p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardHeader>
            <Users className="mx-auto h-12 w-12 text-orange-500" />
            <CardTitle className="mt-4">{kontaktPage.boardTitle}</CardTitle>
            <CardDescription>{kontaktPage.boardDescription}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold text-gray-800">{kontaktPage.boardContact}</p>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-3xl font-bold text-green-700 mb-6 text-center">{kontaktPage.faqTitle}</h2>
      <Accordion type="single" collapsible className="w-full max-w-3xl mx-auto">
        {kontaktPage.faqItems.map((item, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger className="text-left text-lg font-medium">{item.question}</AccordionTrigger>
            <AccordionContent className="text-gray-700">{item.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}
