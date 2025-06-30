"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { loadContent, saveContent, resetContent, type PageContent, type FAQItem } from "@/lib/content-store"
import { toast } from "@/components/ui/use-toast"

export default function EditorPage() {
  const [content, setContent] = useState<PageContent | null>(null)
  const [loading, setLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true)
      const fetchedContent = await loadContent()
      setContent(fetchedContent)
      setLoading(false)
    }
    fetchContent()
  }, [])

  const handleInputChange = useCallback(
    (section: keyof PageContent, field: string, value: string | number | FAQItem[]) => {
      if (!content) return
      setContent((prevContent) => {
        if (!prevContent) return null
        const newContent = { ...prevContent } as any // Use any for dynamic access
        if (section === "faq") {
          // Special handling for FAQ array
          newContent[section] = value as FAQItem[]
        } else {
          newContent[section] = {
            ...(newContent[section] || {}),
            [field]: value,
          }
        }
        return newContent
      })
    },
    [content],
  )

  const handleSave = useCallback(async () => {
    if (!content) return
    setIsSaving(true)
    const success = await saveContent(content)
    if (success) {
      toast({
        title: "Innehåll sparat!",
        description: "Dina ändringar har sparats framgångsrikt.",
      })
    } else {
      toast({
        title: "Fel vid sparande",
        description: "Kunde inte spara innehållet. Kontrollera konsolen för mer information.",
        variant: "destructive",
      })
    }
    setIsSaving(false)
  }, [content])

  const handleReset = useCallback(async () => {
    if (window.confirm("Är du säker på att du vill återställa allt innehåll till standardvärden?")) {
      setLoading(true)
      resetContent() // Resets localStorage
      const fetchedContent = await loadContent() // Reloads default (or from backend if localStorage is empty)
      setContent(fetchedContent)
      setLoading(false)
      toast({
        title: "Innehåll återställt!",
        description: "Innehållet har återställts till standardvärden.",
      })
    }
  }, [])

  const handleAddFaq = useCallback(() => {
    if (!content) return
    const newFaqItems = [...(content.kontaktPage.faqItems || []), { question: "", answer: "" }]
    handleInputChange("kontaktPage", "faqItems", newFaqItems)
  }, [content, handleInputChange])

  const handleRemoveFaq = useCallback(
    (index: number) => {
      if (!content) return
      const newFaqItems = content.kontaktPage.faqItems.filter((_, i) => i !== index)
      handleInputChange("kontaktPage", "faqItems", newFaqItems)
    },
    [content, handleInputChange],
  )

  const handleFaqChange = useCallback(
    (index: number, field: "question" | "answer", value: string) => {
      if (!content) return
      const newFaqItems = [...content.kontaktPage.faqItems]
      newFaqItems[index] = { ...newFaqItems[index], [field]: value }
      handleInputChange("kontaktPage", "faqItems", newFaqItems)
    },
    [content, handleInputChange],
  )

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Laddar redigerare...</div>
  }

  if (!content) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        Kunde inte ladda innehåll för redigering.
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Webbplatsredigerare</h1>

      <div className="flex justify-end gap-4 mb-8">
        <Button onClick={handleReset} variant="outline" disabled={isSaving}>
          Återställ till standard
        </Button>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? "Sparar..." : "Spara ändringar"}
        </Button>
      </div>

      <Accordion type="multiple" className="w-full">
        {/* Hero Section */}
        <AccordionItem value="item-hero">
          <AccordionTrigger className="text-xl font-semibold">Startsida: Hero-sektion</AccordionTrigger>
          <AccordionContent className="space-y-4 p-4">
            <div>
              <Label htmlFor="heroTitle">Titel</Label>
              <Input
                id="heroTitle"
                value={content.hero.title}
                onChange={(e) => handleInputChange("hero", "title", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="heroDescription">Beskrivning</Label>
              <Textarea
                id="heroDescription"
                value={content.hero.description}
                onChange={(e) => handleInputChange("hero", "description", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="heroImageUrl">Bild-URL</Label>
              <Input
                id="heroImageUrl"
                value={content.hero.imageUrl}
                onChange={(e) => handleInputChange("hero", "imageUrl", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="heroButton1Text">Knapp 1 Text</Label>
              <Input
                id="heroButton1Text"
                value={content.hero.button1Text}
                onChange={(e) => handleInputChange("hero", "button1Text", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="heroButton1Link">Knapp 1 Länk</Label>
              <Input
                id="heroButton1Link"
                value={content.hero.button1Link}
                onChange={(e) => handleInputChange("hero", "button1Link", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="heroButton2Text">Knapp 2 Text</Label>
              <Input
                id="heroButton2Text"
                value={content.hero.button2Text}
                onChange={(e) => handleInputChange("hero", "button2Text", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="heroButton2Link">Knapp 2 Länk</Label>
              <Input
                id="heroButton2Link"
                value={content.hero.button2Link}
                onChange={(e) => handleInputChange("hero", "button2Link", e.target.value)}
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Stats Section */}
        <AccordionItem value="item-stats">
          <AccordionTrigger className="text-xl font-semibold">Startsida: Statistik-sektion</AccordionTrigger>
          <AccordionContent className="space-y-4 p-4">
            <div>
              <Label htmlFor="statsTotalTeams">Totalt antal lag</Label>
              <Input
                id="statsTotalTeams"
                type="number"
                value={content.stats.totalTeams}
                onChange={(e) => handleInputChange("stats", "totalTeams", Number.parseInt(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="statsATeams">Antal A-lag</Label>
              <Input
                id="statsATeams"
                type="number"
                value={content.stats.aTeams}
                onChange={(e) => handleInputChange("stats", "aTeams", Number.parseInt(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="statsYouthTeams">Antal ungdomslag</Label>
              <Input
                id="statsYouthTeams"
                type="number"
                value={content.stats.youthTeams}
                onChange={(e) => handleInputChange("stats", "youthTeams", Number.parseInt(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="statsHistoryYears">År av historia</Label>
              <Input
                id="statsHistoryYears"
                value={content.stats.historyYears}
                onChange={(e) => handleInputChange("stats", "historyYears", e.target.value)}
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* About Club Section */}
        <AccordionItem value="item-about-club">
          <AccordionTrigger className="text-xl font-semibold">Startsida: Om Klubben-sektion</AccordionTrigger>
          <AccordionContent className="space-y-4 p-4">
            <div>
              <Label htmlFor="aboutClubTitle">Titel</Label>
              <Input
                id="aboutClubTitle"
                value={content.aboutClub.title}
                onChange={(e) => handleInputChange("aboutClub", "title", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="aboutClubParagraph1">Paragraf 1</Label>
              <Textarea
                id="aboutClubParagraph1"
                value={content.aboutClub.paragraph1}
                onChange={(e) => handleInputChange("aboutClub", "paragraph1", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="aboutClubParagraph2">Paragraf 2</Label>
              <Textarea
                id="aboutClubParagraph2"
                value={content.aboutClub.paragraph2}
                onChange={(e) => handleInputChange("aboutClub", "paragraph2", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="aboutClubPassionText">Passion Text</Label>
              <Input
                id="aboutClubPassionText"
                value={content.aboutClub.passionText}
                onChange={(e) => handleInputChange("aboutClub", "passionText", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="aboutClubDevelopmentText">Utveckling Text</Label>
              <Input
                id="aboutClubDevelopmentText"
                value={content.aboutClub.developmentText}
                onChange={(e) => handleInputChange("aboutClub", "developmentText", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="aboutClubCommunityText">Gemenskap Text</Label>
              <Input
                id="aboutClubCommunityText"
                value={content.aboutClub.communityText}
                onChange={(e) => handleInputChange("aboutClub", "communityText", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="aboutClubButton1Text">Knapp 1 Text</Label>
              <Input
                id="aboutClubButton1Text"
                value={content.aboutClub.button1Text}
                onChange={(e) => handleInputChange("aboutClub", "button1Text", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="aboutClubButton1Link">Knapp 1 Länk</Label>
              <Input
                id="aboutClubButton1Link"
                value={content.aboutClub.button1Link}
                onChange={(e) => handleInputChange("aboutClub", "button1Link", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="aboutClubButton2Text">Knapp 2 Text</Label>
              <Input
                id="aboutClubButton2Text"
                value={content.aboutClub.button2Text}
                onChange={(e) => handleInputChange("aboutClub", "button2Text", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="aboutClubButton2Link">Knapp 2 Länk</Label>
              <Input
                id="aboutClubButton2Link"
                value={content.aboutClub.button2Link}
                onChange={(e) => handleInputChange("aboutClub", "button2Link", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="aboutClubImageSrc">Bild-URL</Label>
              <Input
                id="aboutClubImageSrc"
                value={content.aboutClub.imageSrc}
                onChange={(e) => handleInputChange("aboutClub", "imageSrc", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="aboutClubImageAlt">Bild Alt-text</Label>
              <Input
                id="aboutClubImageAlt"
                value={content.aboutClub.imageAlt}
                onChange={(e) => handleInputChange("aboutClub", "imageAlt", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="aboutClubTotalTeamsCallout">Antal lag (callout)</Label>
              <Input
                id="aboutClubTotalTeamsCallout"
                type="number"
                value={content.aboutClub.totalTeamsCallout}
                onChange={(e) => handleInputChange("aboutClub", "totalTeamsCallout", Number.parseInt(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="aboutClubTotalTeamsCalloutText">Antal lag text (callout)</Label>
              <Input
                id="aboutClubTotalTeamsCalloutText"
                value={content.aboutClub.totalTeamsCalloutText}
                onChange={(e) => handleInputChange("aboutClub", "totalTeamsCalloutText", e.target.value)}
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Partners Carousel Section */}
        <AccordionItem value="item-partners-carousel">
          <AccordionTrigger className="text-xl font-semibold">Startsida: Partners-sektion</AccordionTrigger>
          <AccordionContent className="space-y-4 p-4">
            <div>
              <Label htmlFor="partnersCarouselTitle">Titel</Label>
              <Input
                id="partnersCarouselTitle"
                value={content.partnersCarousel.title}
                onChange={(e) => handleInputChange("partnersCarousel", "title", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="partnersCarouselDescription">Beskrivning</Label>
              <Textarea
                id="partnersCarouselDescription"
                value={content.partnersCarousel.description}
                onChange={(e) => handleInputChange("partnersCarousel", "description", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="partnersCarouselCallToActionTitle">Call to Action Titel</Label>
              <Input
                id="partnersCarouselCallToActionTitle"
                value={content.partnersCarousel.callToActionTitle}
                onChange={(e) => handleInputChange("partnersCarousel", "callToActionTitle", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="partnersCarouselCallToActionDescription">Call to Action Beskrivning</Label>
              <Textarea
                id="partnersCarouselCallToActionDescription"
                value={content.partnersCarousel.callToActionDescription}
                onChange={(e) => handleInputChange("partnersCarousel", "callToActionDescription", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="partnersCarouselCallToActionLinkText">Call to Action Länk Text</Label>
              <Input
                id="partnersCarouselCallToActionLinkText"
                value={content.partnersCarousel.callToActionLinkText}
                onChange={(e) => handleInputChange("partnersCarousel", "callToActionLinkText", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="partnersCarouselCallToActionLink">Call to Action Länk</Label>
              <Input
                id="partnersCarouselCallToActionLink"
                value={content.partnersCarousel.callToActionLink}
                onChange={(e) => handleInputChange("partnersCarousel", "callToActionLink", e.target.value)}
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Kontakt Page Section */}
        <AccordionItem value="item-kontakt-page">
          <AccordionTrigger className="text-xl font-semibold">Kontaktsida</AccordionTrigger>
          <AccordionContent className="space-y-4 p-4">
            <div>
              <Label htmlFor="kontaktEmailTitle">E-post Titel</Label>
              <Input
                id="kontaktEmailTitle"
                value={content.kontaktPage.emailTitle}
                onChange={(e) => handleInputChange("kontaktPage", "emailTitle", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="kontaktEmailDescription">E-post Beskrivning</Label>
              <Textarea
                id="kontaktEmailDescription"
                value={content.kontaktPage.emailDescription}
                onChange={(e) => handleInputChange("kontaktPage", "emailDescription", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="kontaktEmailAddress">E-post Adress</Label>
              <Input
                id="kontaktEmailAddress"
                value={content.kontaktPage.emailAddress}
                onChange={(e) => handleInputChange("kontaktPage", "emailAddress", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="kontaktAddressTitle">Adress Titel</Label>
              <Input
                id="kontaktAddressTitle"
                value={content.kontaktPage.addressTitle}
                onChange={(e) => handleInputChange("kontaktPage", "addressTitle", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="kontaktAddressDescription">Adress Beskrivning</Label>
              <Textarea
                id="kontaktAddressDescription"
                value={content.kontaktPage.addressDescription}
                onChange={(e) => handleInputChange("kontaktPage", "addressDescription", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="kontaktAddressLocation">Adress Plats</Label>
              <Input
                id="kontaktAddressLocation"
                value={content.kontaktPage.addressLocation}
                onChange={(e) => handleInputChange("kontaktPage", "addressLocation", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="kontaktBoardTitle">Styrelse Titel</Label>
              <Input
                id="kontaktBoardTitle"
                value={content.kontaktPage.boardTitle}
                onChange={(e) => handleInputChange("kontaktPage", "boardTitle", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="kontaktBoardDescription">Styrelse Beskrivning</Label>
              <Textarea
                id="kontaktBoardDescription"
                value={content.kontaktPage.boardDescription}
                onChange={(e) => handleInputChange("kontaktPage", "boardDescription", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="kontaktBoardContact">Styrelse Kontakt</Label>
              <Input
                id="kontaktBoardContact"
                value={content.kontaktPage.boardContact}
                onChange={(e) => handleInputChange("kontaktPage", "boardContact", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="kontaktFaqTitle">FAQ Titel</Label>
              <Input
                id="kontaktFaqTitle"
                value={content.kontaktPage.faqTitle}
                onChange={(e) => handleInputChange("kontaktPage", "faqTitle", e.target.value)}
              />
            </div>

            <h3 className="text-lg font-semibold mt-6">Vanliga frågor (FAQ)</h3>
            {content.kontaktPage.faqItems.map((faq, index) => (
              <Card key={index} className="p-4 border border-gray-200 rounded-md">
                <div className="space-y-2">
                  <div>
                    <Label htmlFor={`faq-question-${index}`}>Fråga {index + 1}</Label>
                    <Input
                      id={`faq-question-${index}`}
                      value={faq.question}
                      onChange={(e) => handleFaqChange(index, "question", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor={`faq-answer-${index}`}>Svar {index + 1}</Label>
                    <Textarea
                      id={`faq-answer-${index}`}
                      value={faq.answer}
                      onChange={(e) => handleFaqChange(index, "answer", e.target.value)}
                    />
                  </div>
                  <Button variant="destructive" size="sm" onClick={() => handleRemoveFaq(index)}>
                    Ta bort fråga
                  </Button>
                </div>
              </Card>
            ))}
            <Button onClick={handleAddFaq} className="mt-4">
              Lägg till fråga
            </Button>
          </AccordionContent>
        </AccordionItem>

        {/* Partners Page Section */}
        <AccordionItem value="item-partners-page">
          <AccordionTrigger className="text-xl font-semibold">Partnersida</AccordionTrigger>
          <AccordionContent className="space-y-4 p-4">
            <div>
              <Label htmlFor="partnersPageTitle">Titel</Label>
              <Input
                id="partnersPageTitle"
                value={content.partnersPage.title}
                onChange={(e) => handleInputChange("partnersPage", "title", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="partnersPageDescription">Beskrivning</Label>
              <Textarea
                id="partnersPageDescription"
                value={content.partnersPage.description}
                onChange={(e) => handleInputChange("partnersPage", "description", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="partnersPageCallToActionTitle">Call to Action Titel</Label>
              <Input
                id="partnersPageCallToActionTitle"
                value={content.partnersPage.callToActionTitle}
                onChange={(e) => handleInputChange("partnersPage", "callToActionTitle", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="partnersPageCallToActionDescription">Call to Action Beskrivning</Label>
              <Textarea
                id="partnersPageCallToActionDescription"
                value={content.partnersPage.callToActionDescription}
                onChange={(e) => handleInputChange("partnersPage", "callToActionDescription", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="partnersPageCallToActionLinkText">Call to Action Länk Text</Label>
              <Input
                id="partnersPageCallToActionLinkText"
                value={content.partnersPage.callToActionLinkText}
                onChange={(e) => handleInputChange("partnersPage", "callToActionLinkText", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="partnersPageCallToActionLink">Call to Action Länk</Label>
              <Input
                id="partnersPageCallToActionLink"
                value={content.partnersPage.callToActionLink}
                onChange={(e) => handleInputChange("partnersPage", "callToActionLink", e.target.value)}
              />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
