import { MailIcon, MapPinIcon, UsersIcon } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { loadContent } from "@/lib/content-store"

export default async function KontaktPage() {
  const content = await loadContent()

  return (
    <div className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">Kontakta Oss</h1>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              Har du frågor eller funderingar? Tveka inte att höra av dig till oss.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl items-start gap-8 py-12 sm:grid-cols-2 lg:grid-cols-3">
          <div className="grid gap-1">
            <MailIcon className="h-8 w-8 text-gray-900 dark:text-gray-50" />
            <h3 className="text-xl font-bold">{content.kontaktPage.emailTitle}</h3>
            <p className="text-gray-500 dark:text-gray-400">{content.kontaktPage.emailDescription}</p>
            <a className="text-blue-600 hover:underline" href={`mailto:${content.kontaktPage.emailAddress}`}>
              {content.kontaktPage.emailAddress}
            </a>
          </div>
          <div className="grid gap-1">
            <MapPinIcon className="h-8 w-8 text-gray-900 dark:text-gray-50" />
            <h3 className="text-xl font-bold">{content.kontaktPage.addressTitle}</h3>
            <p className="text-gray-500 dark:text-gray-400">{content.kontaktPage.addressDescription}</p>
            <p>{content.kontaktPage.addressLocation}</p>
          </div>
          <div className="grid gap-1">
            <UsersIcon className="h-8 w-8 text-gray-900 dark:text-gray-50" />
            <h3 className="text-xl font-bold">{content.kontaktPage.boardTitle}</h3>
            <p className="text-gray-500 dark:text-gray-400">{content.kontaktPage.boardDescription}</p>
            <p>{content.kontaktPage.boardContact}</p>
          </div>
        </div>
        <div className="mx-auto max-w-3xl space-y-4 py-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-center">
            {content.kontaktPage.faqTitle}
          </h2>
          <Accordion className="w-full" type="single" collapsible>
            {content.kontaktPage.faqItems.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">{item.question}</AccordionTrigger>
                <AccordionContent>{item.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  )
}
