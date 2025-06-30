import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Mail, MapPin, Users } from "lucide-react"
import { loadContent } from "@/lib/content-store" // Load content from content-store

export default function KontaktPage() {
  const content = loadContent().kontaktPage // Get contact page content

  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      <h1 className="text-4xl font-bold text-green-700 mb-8 text-center">Kontakta Oss</h1>
      <p className="text-center text-gray-700 mb-12 max-w-2xl mx-auto">
        Har du frågor, funderingar eller vill du komma i kontakt med Härnösands HF? Här hittar du all information du
        behöver.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <Card className="flex flex-col items-center text-center p-6">
          <Mail className="h-12 w-12 text-orange-500 mb-4" />
          <CardHeader>
            <CardTitle className="text-xl font-semibold mb-2">{content.emailTitle}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">{content.emailDescription}</p>
            <a href={`mailto:${content.emailAddress}`} className="text-green-700 font-medium hover:underline">
              {content.emailAddress}
            </a>
          </CardContent>
        </Card>

        <Card className="flex flex-col items-center text-center p-6">
          <MapPin className="h-12 w-12 text-orange-500 mb-4" />
          <CardHeader>
            <CardTitle className="text-xl font-semibold mb-2">{content.addressTitle}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">{content.addressDescription}</p>
            <address className="not-italic text-green-700 font-medium">
              {content.addressLocation.split(", ").map((line, index) => (
                <span key={index}>
                  {line}
                  <br />
                </span>
              ))}
            </address>
          </CardContent>
        </Card>

        <Card className="flex flex-col items-center text-center p-6">
          <Users className="h-12 w-12 text-orange-500 mb-4" />
          <CardHeader>
            <CardTitle className="text-xl font-semibold mb-2">{content.boardTitle}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">{content.boardDescription}</p>
            <a href={`mailto:${content.boardContact}`} className="text-green-700 font-medium hover:underline">
              {content.boardContact}
            </a>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-3xl font-bold text-green-700 mb-6 text-center">Vanliga Frågor</h2>
      <Accordion type="single" collapsible className="w-full max-w-3xl mx-auto">
        {content.faqItems.map((item, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger className="text-lg font-semibold text-gray-800 hover:no-underline">
              {item.question}
            </AccordionTrigger>
            <AccordionContent className="text-gray-700">{item.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}
