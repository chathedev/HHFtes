import { loadContent, type PageContent, type FAQItem } from "@/lib/content-store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, MapPin, Users } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default async function KontaktPage() {
  const content: PageContent = await loadContent()
  const { kontaktPage } = content

  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      <h1 className="text-4xl font-bold text-green-700 mb-8 text-center">Kontakta Oss</h1>
      <p className="text-center text-gray-700 mb-12 max-w-2xl mx-auto">
        Har du frågor eller funderingar? Tveka inte att höra av dig till oss!
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <Card className="flex flex-col items-center text-center p-6">
          <CardHeader>
            <Mail className="h-12 w-12 text-orange-500 mb-4" />
            <CardTitle className="text-2xl font-semibold">{kontaktPage.emailTitle}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-2">{kontaktPage.emailDescription}</p>
            <a href={`mailto:${kontaktPage.emailAddress}`} className="text-green-700 hover:underline font-medium">
              {kontaktPage.emailAddress}
            </a>
          </CardContent>
        </Card>

        <Card className="flex flex-col items-center text-center p-6">
          <CardHeader>
            <MapPin className="h-12 w-12 text-orange-500 mb-4" />
            <CardTitle className="text-2xl font-semibold">{kontaktPage.addressTitle}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-2">{kontaktPage.addressDescription}</p>
            <p className="text-green-700 font-medium">{kontaktPage.addressLocation}</p>
          </CardContent>
        </Card>

        <Card className="flex flex-col items-center text-center p-6">
          <CardHeader>
            <Users className="h-12 w-12 text-orange-500 mb-4" />
            <CardTitle className="text-2xl font-semibold">{kontaktPage.boardTitle}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-2">{kontaktPage.boardDescription}</p>
            <p className="text-green-700 font-medium">{kontaktPage.boardContact}</p>
          </CardContent>
        </Card>
      </div>

      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-green-700 mb-6 text-center">{kontaktPage.faqTitle}</h2>
        <Accordion type="single" collapsible className="w-full">
          {kontaktPage.faqItems.map((item: FAQItem, index: number) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-lg font-semibold text-gray-800 hover:no-underline">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-gray-700">{item.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  )
}
