"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { toast } from "@/components/ui/use-toast"
import { type PageContent, type FAQItem, saveContentToLocalStorage, resetContent } from "@/lib/content-store"
import {
  loadEditorContentServer,
  saveEditorContentServer,
  resetEditorContentServer,
} from "@/app/actions/editor-content"
import { useAuth } from "@/components/auth-provider"
import { logout } from "@/app/actions/auth"

export default function EditorClientPage() {
  const router = useRouter()
  const { isAuthenticated, setIsAuthenticated } = useAuth()
  const [content, setContent] = useState<PageContent | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    // This useEffect will only run on the client.
    // The server-side check in app/editor/page.tsx handles initial redirection.
    if (isAuthenticated) {
      const fetchContent = async () => {
        setLoading(true)
        const fetchedContent = await loadEditorContentServer()
        setContent(fetchedContent)
        saveContentToLocalStorage(fetchedContent) // Update local storage with server content
        setLoading(false)
      }
      fetchContent()
    }
  }, [isAuthenticated]) // Fetch content only if authenticated on the client

  const handleInputChange = useCallback(
    (page: keyof PageContent, field: string, value: string | number) => {
      if (!content) return
      setContent((prevContent) => {
        if (!prevContent) return null
        const updatedPage = {
          ...prevContent[page],
          [field]: value,
        }
        return {
          ...prevContent,
          [page]: updatedPage,
        }
      })
    },
    [content],
  )

  const handleFAQChange = useCallback(
    (index: number, field: keyof FAQItem, value: string) => {
      if (!content) return
      setContent((prevContent) => {
        if (!prevContent) return null
        const updatedFaqItems = [...prevContent.kontaktPage.faqItems]
        updatedFaqItems[index] = {
          ...updatedFaqItems[index],
          [field]: value,
        }
        return {
          ...prevContent,
          kontaktPage: {
            ...prevContent.kontaktPage,
            faqItems: updatedFaqItems,
          },
        }
      })
    },
    [content],
  )

  const handleAddFAQ = useCallback(() => {
    if (!content) return
    setContent((prevContent) => {
      if (!prevContent) return null
      const updatedFaqItems = [...prevContent.kontaktPage.faqItems, { question: "", answer: "" }]
      return {
        ...prevContent,
        kontaktPage: {
          ...prevContent.kontaktPage,
          faqItems: updatedFaqItems,
        },
      }
    })
  }, [content])

  const handleRemoveFAQ = useCallback(
    (index: number) => {
      if (!content) return
      setContent((prevContent) => {
        if (!prevContent) return null
        const updatedFaqItems = prevContent.kontaktPage.faqItems.filter((_, i) => i !== index)
        return {
          ...prevContent,
          kontaktPage: {
            ...prevContent.kontaktPage,
            faqItems: updatedFaqItems,
          },
        }
      })
    },
    [content],
  )

  const handleSave = useCallback(async () => {
    if (!content) return
    setSaving(true)
    const result = await saveEditorContentServer(content)
    if (result.success) {
      saveContentToLocalStorage(content)
      toast({
        title: "Innehåll sparat!",
        description: result.message,
        variant: "default",
      })
    } else {
      toast({
        title: "Fel vid sparning",
        description: result.message,
        variant: "destructive",
      })
    }
    setSaving(false)
  }, [content])

  const handleReset = useCallback(async () => {
    if (window.confirm("Är du säker på att du vill återställa allt innehåll till standard? Detta kan inte ångras.")) {
      setLoading(true)
      resetContent()
      const fetchedContent = await resetEditorContentServer()
      setContent(fetchedContent)
      saveContentToLocalStorage(fetchedContent)
      setLoading(false)
      toast({
        title: "Innehåll återställt!",
        description: "Allt innehåll har återställts till standardvärden.",
        variant: "default",
      })
    }
  }, [])

  const handleLogout = useCallback(async () => {
    await logout()
    setIsAuthenticated(false) // Update client-side state
    router.push("/login")
  }, [router, setIsAuthenticated])

  if (!isAuthenticated || loading) {
    // This state should ideally not be reached if server-side redirect works,
    // but provides a fallback loading state if client-side auth is still resolving.
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
    <div className="container mx-auto px-4 py-8 pt-24">
      <h1 className="text-4xl font-bold text-green-700 mb-8 text-center">Webbplatsredigerare</h1>
      <p className="text-center text-gray-700 mb-12 max-w-2xl mx-auto">
        Redigera text, bilder och länkar för din webbplats. Ändringar sparas lokalt och till din backend.
      </p>

      <div className="flex justify-center gap-4 mb-8">
        <Button onClick={handleSave} disabled={saving} className="bg-orange-500 hover:bg-orange-600 text-white">
          {saving ? "Sparar..." : "Spara ändringar"}
        </Button>
        <Button onClick={handleReset} variant="outline" disabled={saving}>
          Återställ till standard
        </Button>
        <Button onClick={handleLogout} variant="secondary">
          Logga ut
        </Button>
      </div>

      <Accordion type="multiple" className="w-full">
        {/* Hero Section */}
        <AccordionItem value="item-hero">
          <AccordionTrigger className="text-xl font-semibold text-gray-800">Startsida: Hero-sektion</AccordionTrigger>
          <AccordionContent className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
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
              <Label htmlFor="heroImageUrl">Bild URL</Label>
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
          <AccordionTrigger className="text-xl font-semibold text-gray-800">Startsida: Statistik</AccordionTrigger>
          <AccordionContent className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
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
          <AccordionTrigger className="text-xl font-semibold text-gray-800">Startsida: Om Klubben</AccordionTrigger>
          <AccordionContent className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
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
              <Label htmlFor="aboutClubImageSrc">Bild URL</Label>
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
              <Label htmlFor="aboutClubTotalTeamsCalloutText">Text för antal lag (callout)</Label>
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
          <AccordionTrigger className="text-xl font-semibold text-gray-800">
            Startsida: Partners Karusell
          </AccordionTrigger>
          <AccordionContent className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
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
          <AccordionTrigger className="text-xl font-semibold text-gray-800">Kontaktsida</AccordionTrigger>
          <AccordionContent className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
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
              <Label htmlFor="kontaktAddressTitle">Besöksadress Titel</Label>
              <Input
                id="kontaktAddressTitle"
                value={content.kontaktPage.addressTitle}
                onChange={(e) => handleInputChange("kontaktPage", "addressTitle", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="kontaktAddressDescription">Besöksadress Beskrivning</Label>
              <Textarea
                id="kontaktAddressDescription"
                value={content.kontaktPage.addressDescription}
                onChange={(e) => handleInputChange("kontaktPage", "addressDescription", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="kontaktAddressLocation">Besöksadress Plats</Label>
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
            <div className="md:col-span-2">
              <h3 className="text-lg font-semibold mb-2">Vanliga frågor (FAQ)</h3>
              {content.kontaktPage.faqItems.map((faq, index) => (
                <Card key={index} className="mb-4 p-4">
                  <Label htmlFor={`faqQuestion-${index}`}>Fråga {index + 1}</Label>
                  <Input
                    id={`faqQuestion-${index}`}
                    value={faq.question}
                    onChange={(e) => handleFAQChange(index, "question", e.target.value)}
                    className="mb-2"
                  />
                  <Label htmlFor={`faqAnswer-${index}`}>Svar {index + 1}</Label>
                  <Textarea
                    id={`faqAnswer-${index}`}
                    value={faq.answer}
                    onChange={(e) => handleFAQChange(index, "answer", e.target.value)}
                    className="mb-2"
                  />
                  <Button variant="destructive" size="sm" onClick={() => handleRemoveFAQ(index)}>
                    Ta bort FAQ
                  </Button>
                </Card>
              ))}
              <Button onClick={handleAddFAQ} className="mt-4">
                Lägg till FAQ
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Partners Page Section */}
        <AccordionItem value="item-partners-page">
          <AccordionTrigger className="text-xl font-semibold text-gray-800">Partnersida</AccordionTrigger>
          <AccordionContent className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
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
