"use client"

import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Mail, MapPin, Users } from "lucide-react"
import type { PageContent } from "@/lib/content-store"

interface EditableKontaktPageProps {
  content: PageContent["kontaktPage"]
  isEditing: boolean
  onContentChange?: (field: keyof PageContent["kontaktPage"], value: string | number) => void
}

export default function EditableKontaktPage({ content, isEditing, onContentChange }: EditableKontaktPageProps) {
  const handleTextChange = (field: keyof PageContent["kontaktPage"], e: React.ChangeEvent<HTMLDivElement>) => {
    if (onContentChange) {
      onContentChange(field, e.currentTarget.innerText)
    }
  }

  const handleFAQQuestionChange = (index: number, value: string) => {
    if (onContentChange) {
      const updatedFaqItems = [...content.faqItems]
      updatedFaqItems[index] = { ...updatedFaqItems[index], question: value }
      onContentChange("faqItems", updatedFaqItems)
    }
  }

  const handleFAQAnswerChange = (index: number, value: string) => {
    if (onContentChange) {
      const updatedFaqItems = [...content.faqItems]
      updatedFaqItems[index] = { ...updatedFaqItems[index], answer: value }
      onContentChange("faqItems", updatedFaqItems)
    }
  }

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
            <CardTitle className="mt-4">
              <span
                contentEditable={isEditing}
                suppressContentEditableWarning={true}
                onBlur={(e) => handleTextChange("emailTitle", e)}
              >
                {content.emailTitle}
              </span>
            </CardTitle>
            <CardDescription>
              <span
                contentEditable={isEditing}
                suppressContentEditableWarning={true}
                onBlur={(e) => handleTextChange("emailDescription", e)}
              >
                {content.emailDescription}
              </span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold text-gray-800">
              <span
                contentEditable={isEditing}
                suppressContentEditableWarning={true}
                onBlur={(e) => handleTextChange("emailAddress", e)}
              >
                {content.emailAddress}
              </span>
            </p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardHeader>
            <MapPin className="mx-auto h-12 w-12 text-orange-500" />
            <CardTitle className="mt-4">
              <span
                contentEditable={isEditing}
                suppressContentEditableWarning={true}
                onBlur={(e) => handleTextChange("addressTitle", e)}
              >
                {content.addressTitle}
              </span>
            </CardTitle>
            <CardDescription>
              <span
                contentEditable={isEditing}
                suppressContentEditableWarning={true}
                onBlur={(e) => handleTextChange("addressDescription", e)}
              >
                {content.addressDescription}
              </span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold text-gray-800">
              <span
                contentEditable={isEditing}
                suppressContentEditableWarning={true}
                onBlur={(e) => handleTextChange("addressLocation", e)}
              >
                {content.addressLocation}
              </span>
            </p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardHeader>
            <Users className="mx-auto h-12 w-12 text-orange-500" />
            <CardTitle className="mt-4">
              <span
                contentEditable={isEditing}
                suppressContentEditableWarning={true}
                onBlur={(e) => handleTextChange("boardTitle", e)}
              >
                {content.boardTitle}
              </span>
            </CardTitle>
            <CardDescription>
              <span
                contentEditable={isEditing}
                suppressContentEditableWarning={true}
                onBlur={(e) => handleTextChange("boardDescription", e)}
              >
                {content.boardDescription}
              </span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold text-gray-800">
              <span
                contentEditable={isEditing}
                suppressContentEditableWarning={true}
                onBlur={(e) => handleTextChange("boardContact", e)}
              >
                {content.boardContact}
              </span>
            </p>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-3xl font-bold text-green-700 mb-6 text-center">
        <span
          contentEditable={isEditing}
          suppressContentEditableWarning={true}
          onBlur={(e) => handleTextChange("faqTitle", e)}
        >
          {content.faqTitle}
        </span>
      </h2>
      <Accordion type="single" collapsible className="w-full max-w-3xl mx-auto">
        {content.faqItems.map((item, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger className="text-left text-lg font-medium">
              <span
                contentEditable={isEditing}
                suppressContentEditableWarning={true}
                onBlur={(e) => handleFAQQuestionChange(index, e.currentTarget.innerText)}
              >
                {item.question}
              </span>
            </AccordionTrigger>
            <AccordionContent className="text-gray-700">
              <span
                contentEditable={isEditing}
                suppressContentEditableWarning={true}
                onBlur={(e) => handleFAQAnswerChange(index, e.currentTarget.innerText)}
              >
                {item.answer}
              </span>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}
