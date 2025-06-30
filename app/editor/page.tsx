"use client"

import { useState, useEffect } from "react"
import { loadContent, saveContent, defaultContent, type PageContent, type FAQItem } from "@/lib/content-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { toast } from "@/components/ui/use-toast"

export default function EditorPage() {
  const [content, setContent] = useState<PageContent | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    async function fetchContent() {
      const loadedContent = await loadContent()
      setContent(loadedContent)
      setLoading(false)
    }
    fetchContent()
  }, [])

  const handleSave = async () => {
    if (!content) return
    setSaving(true)
    const success = await saveContent(content)
    if (success) {
      toast({
        title: "Innehåll sparat!",
        description: "Dina ändringar har sparats framgångsrikt.",
      })
    } else {
      toast({
        title: "Fel vid sparning",
        description: "Kunde inte spara innehållet. Kontrollera konsolen för mer information.",
        variant: "destructive",
      })
    }
    setSaving(false)
  }

  const handleReset = () => {
    if (confirm("Är du säker på att du vill återställa allt innehåll till standardvärden? Detta kan inte ångras.")) {
      setContent(defaultContent)
      // Notera: resetContent() i lib/content-store.ts tar bara bort från localStorage.
      // För att återställa backend, skulle du behöva en specifik backend-endpoint.
      toast({
        title: "Innehåll återställt",
        description: "Innehållet har återställts till standardvärden (lokalt).",
      })
    }
  }

  const handleChange = (section: keyof PageContent, field: string, value: any) => {
    setContent((prevContent) => {
      if (!prevContent) return null
      return {
        ...prevContent,
        [section]: {
          ...prevContent[section],
          [field]: value,
        },
      }
    })
  }

  const handleFAQChange = (index: number, field: keyof FAQItem, value: string) => {
    setContent((prevContent) => {
      if (!prevContent) return null
      const updatedFaqItems = [...(prevContent.kontaktPage.faqItems || [])]
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
  }

  const addFAQItem = () => {
    setContent((prevContent) => {
      if (!prevContent) return null
      const updatedFaqItems = [...(prevContent.kontaktPage.faqItems || [])]
      updatedFaqItems.push({ question: "", answer: "" })
      return {
        ...prevContent,
        kontaktPage: {
          ...prevContent.kontaktPage,
          faqItems: updatedFaqItems,
        },
      }
    })
  }

  const removeFAQItem = (index: number) => {
    setContent((prevContent) => {
      if (!prevContent) return null
      const updatedFaqItems = [...(prevContent.kontaktPage.faqItems || [])]
      updatedFaqItems.splice(index, 1)
      return {
        ...prevContent,
        kontaktPage: {
          ...prevContent.kontaktPage,
          faqItems: updatedFaqItems,
        },
      }
    })
  }

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Laddar redigerare...</div>
  }

  if (!content) {
    return <div className="flex justify-center items-center min-h-screen text-red-500">Kunde inte ladda innehåll.</div>
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Webbplatsredigerare</h1>

      <div className="flex justify-end gap-4 mb-6">
        <Button onClick={handleReset} variant="outline">
          Återställ till standard
        </Button>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? "Sparar..." : "Spara ändringar"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hero Section */}
        <Card>
          <CardHeader>
            <CardTitle>Hero Sektion</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="hero-title">Titel</Label>
              <Input
                id="hero-title"
                value={content.hero.title || ""}
                onChange={(e) => handleChange("hero", "title", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="hero-description">Beskrivning</Label>
              <Textarea
                id="hero-description"
                value={content.hero.description || ""}
                onChange={(e) => handleChange("hero", "description", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="hero-imageUrl">Bild URL</Label>
              <Input
                id="hero-imageUrl"
                value={content.hero.imageUrl || ""}
                onChange={(e) => handleChange("hero", "imageUrl", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="hero-button1Text">Knapp 1 Text</Label>
              <Input
                id="hero-button1Text"
                value={content.hero.button1Text || ""}
                onChange={(e) => handleChange("hero", "button1Text", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="hero-button1Link">Knapp 1 Länk</Label>
              <Input
                id="hero-button1Link"
                value={content.hero.button1Link || ""}
                onChange={(e) => handleChange("hero", "button1Link", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="hero-button2Text">Knapp 2 Text</Label>
              <Input
                id="hero-button2Text"
                value={content.hero.button2Text || ""}
                onChange={(e) => handleChange("hero", "button2Text", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="hero-button2Link">Knapp 2 Länk</Label>
              <Input
                id="hero-button2Link"
                value={content.hero.button2Link || ""}
                onChange={(e) => handleChange("hero", "button2Link", e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Stats Section */}
        <Card>
          <CardHeader>
            <CardTitle>Statistik Sektion</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="stats-totalTeams">Totalt antal lag</Label>
              <Input
                id="stats-totalTeams"
                type="number"
                value={content.stats.totalTeams || ""}
                onChange={(e) => handleChange("stats", "totalTeams", Number.parseInt(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="stats-aTeams">Antal A-lag</Label>
              <Input
                id="stats-aTeams"
                type="number"
                value={content.stats.aTeams || ""}
                onChange={(e) => handleChange("stats", "aTeams", Number.parseInt(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="stats-youthTeams">Antal ungdomslag</Label>
              <Input
                id="stats-youthTeams"
                type="number"
                value={content.stats.youthTeams || ""}
                onChange={(e) => handleChange("stats", "youthTeams", Number.parseInt(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="stats-historyYears">År av historia</Label>
              <Input
                id="stats-historyYears"
                value={content.stats.historyYears || ""}
                onChange={(e) => handleChange("stats", "historyYears", e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* About Club Section */}
        <Card>
          <CardHeader>
            <CardTitle>Om Klubben Sektion</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="about-title">Titel</Label>
              <Input
                id="about-title"
                value={content.aboutClub.title || ""}
                onChange={(e) => handleChange("aboutClub", "title", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="about-paragraph1">Paragraf 1</Label>
              <Textarea
                id="about-paragraph1"
                value={content.aboutClub.paragraph1 || ""}
                onChange={(e) => handleChange("aboutClub", "paragraph1", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="about-paragraph2">Paragraf 2</Label>
              <Textarea
                id="about-paragraph2"
                value={content.aboutClub.paragraph2 || ""}
                onChange={(e) => handleChange("aboutClub", "paragraph2", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="about-passionText">Passion Text</Label>
              <Input
                id="about-passionText"
                value={content.aboutClub.passionText || ""}
                onChange={(e) => handleChange("aboutClub", "passionText", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="about-developmentText">Utveckling Text</Label>
              <Input
                id="about-developmentText"
                value={content.aboutClub.developmentText || ""}
                onChange={(e) => handleChange("aboutClub", "developmentText", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="about-communityText">Gemenskap Text</Label>
              <Input
                id="about-communityText"
                value={content.aboutClub.communityText || ""}
                onChange={(e) => handleChange("aboutClub", "communityText", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="about-button1Text">Knapp 1 Text</Label>
              <Input
                id="about-button1Text"
                value={content.aboutClub.button1Text || ""}
                onChange={(e) => handleChange("aboutClub", "button1Text", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="about-button1Link">Knapp 1 Länk</Label>
              <Input
                id="about-button1Link"
                value={content.aboutClub.button1Link || ""}
                onChange={(e) => handleChange("aboutClub", "button1Link", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="about-button2Text">Knapp 2 Text</Label>
              <Input
                id="about-button2Text"
                value={content.aboutClub.button2Text || ""}
                onChange={(e) => handleChange("aboutClub", "button2Text", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="about-button2Link">Knapp 2 Länk</Label>
              <Input
                id="about-button2Link"
                value={content.aboutClub.button2Link || ""}
                onChange={(e) => handleChange("aboutClub", "button2Link", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="about-imageSrc">Bild Källa</Label>
              <Input
                id="about-imageSrc"
                value={content.aboutClub.imageSrc || ""}
                onChange={(e) => handleChange("aboutClub", "imageSrc", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="about-imageAlt">Bild Alt-text</Label>
              <Input
                id="about-imageAlt"
                value={content.aboutClub.imageAlt || ""}
                onChange={(e) => handleChange("aboutClub", "imageAlt", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="about-totalTeamsCallout">Antal lag (callout)</Label>
              <Input
                id="about-totalTeamsCallout"
                type="number"
                value={content.aboutClub.totalTeamsCallout || ""}
                onChange={(e) => handleChange("aboutClub", "totalTeamsCallout", Number.parseInt(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="about-totalTeamsCalloutText">Text för antal lag (callout)</Label>
              <Input
                id="about-totalTeamsCalloutText"
                value={content.aboutClub.totalTeamsCalloutText || ""}
                onChange={(e) => handleChange("aboutClub", "totalTeamsCalloutText", e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Partners Carousel Section */}
        <Card>
          <CardHeader>
            <CardTitle>Partners Karusell Sektion</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="partners-carousel-title">Titel</Label>
              <Input
                id="partners-carousel-title"
                value={content.partnersCarousel.title || ""}
                onChange={(e) => handleChange("partnersCarousel", "title", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="partners-carousel-description">Beskrivning</Label>
              <Textarea
                id="partners-carousel-description"
                value={content.partnersCarousel.description || ""}
                onChange={(e) => handleChange("partnersCarousel", "description", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="partners-carousel-cta-title">Call to Action Titel</Label>
              <Input
                id="partners-carousel-cta-title"
                value={content.partnersCarousel.callToActionTitle || ""}
                onChange={(e) => handleChange("partnersCarousel", "callToActionTitle", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="partners-carousel-cta-description">Call to Action Beskrivning</Label>
              <Textarea
                id="partners-carousel-cta-description"
                value={content.partnersCarousel.callToActionDescription || ""}
                onChange={(e) => handleChange("partnersCarousel", "callToActionDescription", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="partners-carousel-cta-link-text">Call to Action Länk Text</Label>
              <Input
                id="partners-carousel-cta-link-text"
                value={content.partnersCarousel.callToActionLinkText || ""}
                onChange={(e) => handleChange("partnersCarousel", "callToActionLinkText", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="partners-carousel-cta-link">Call to Action Länk</Label>
              <Input
                id="partners-carousel-cta-link"
                value={content.partnersCarousel.callToActionLink || ""}
                onChange={(e) => handleChange("partnersCarousel", "callToActionLink", e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Kontakt Page Section */}
        <Card>
          <CardHeader>
            <CardTitle>Kontakt Sida Innehåll</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="kontakt-emailTitle">E-post Titel</Label>
              <Input
                id="kontakt-emailTitle"
                value={content.kontaktPage.emailTitle || ""}
                onChange={(e) => handleChange("kontaktPage", "emailTitle", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="kontakt-emailDescription">E-post Beskrivning</Label>
              <Textarea
                id="kontakt-emailDescription"
                value={content.kontaktPage.emailDescription || ""}
                onChange={(e) => handleChange("kontaktPage", "emailDescription", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="kontakt-emailAddress">E-post Adress</Label>
              <Input
                id="kontakt-emailAddress"
                value={content.kontaktPage.emailAddress || ""}
                onChange={(e) => handleChange("kontaktPage", "emailAddress", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="kontakt-addressTitle">Adress Titel</Label>
              <Input
                id="kontakt-addressTitle"
                value={content.kontaktPage.addressTitle || ""}
                onChange={(e) => handleChange("kontaktPage", "addressTitle", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="kontakt-addressDescription">Adress Beskrivning</Label>
              <Textarea
                id="kontakt-addressDescription"
                value={content.kontaktPage.addressDescription || ""}
                onChange={(e) => handleChange("kontaktPage", "addressDescription", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="kontakt-addressLocation">Adress Plats</Label>
              <Input
                id="kontakt-addressLocation"
                value={content.kontaktPage.addressLocation || ""}
                onChange={(e) => handleChange("kontaktPage", "addressLocation", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="kontakt-boardTitle">Styrelse Titel</Label>
              <Input
                id="kontakt-boardTitle"
                value={content.kontaktPage.boardTitle || ""}
                onChange={(e) => handleChange("kontaktPage", "boardTitle", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="kontakt-boardDescription">Styrelse Beskrivning</Label>
              <Textarea
                id="kontakt-boardDescription"
                value={content.kontaktPage.boardDescription || ""}
                onChange={(e) => handleChange("kontaktPage", "boardDescription", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="kontakt-boardContact">Styrelse Kontakt</Label>
              <Input
                id="kontakt-boardContact"
                value={content.kontaktPage.boardContact || ""}
                onChange={(e) => handleChange("kontaktPage", "boardContact", e.target.value)}
              />
            </div>

            <h3 className="text-lg font-semibold mt-6 mb-2">Vanliga frågor (FAQ)</h3>
            <Button onClick={addFAQItem} className="mb-4">
              Lägg till FAQ-fråga
            </Button>
            <Accordion type="multiple" className="w-full">
              {content.kontaktPage.faqItems?.map((item, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger>FAQ #{index + 1}</AccordionTrigger>
                  <AccordionContent className="space-y-2 p-2">
                    <div>
                      <Label htmlFor={`faq-question-${index}`}>Fråga</Label>
                      <Input
                        id={`faq-question-${index}`}
                        value={item.question || ""}
                        onChange={(e) => handleFAQChange(index, "question", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`faq-answer-${index}`}>Svar</Label>
                      <Textarea
                        id={`faq-answer-${index}`}
                        value={item.answer || ""}
                        onChange={(e) => handleFAQChange(index, "answer", e.target.value)}
                      />
                    </div>
                    <Button variant="destructive" onClick={() => removeFAQItem(index)}>
                      Ta bort FAQ
                    </Button>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        {/* Partners Page Section */}
        <Card>
          <CardHeader>
            <CardTitle>Partnersida</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="partners-page-title">Titel</Label>
              <Input
                id="partners-page-title"
                value={content.partnersPage.title || ""}
                onChange={(e) => handleChange("partnersPage", "title", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="partners-page-description">Beskrivning</Label>
              <Textarea
                id="partners-page-description"
                value={content.partnersPage.description || ""}
                onChange={(e) => handleChange("partnersPage", "description", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="partners-page-cta-title">Call to Action Titel</Label>
              <Input
                id="partners-page-cta-title"
                value={content.partnersPage.callToActionTitle || ""}
                onChange={(e) => handleChange("partnersPage", "callToActionTitle", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="partners-page-cta-description">Call to Action Beskrivning</Label>
              <Textarea
                id="partners-page-cta-description"
                value={content.partnersPage.callToActionDescription || ""}
                onChange={(e) => handleChange("partnersPage", "callToActionDescription", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="partners-page-cta-link-text">Call to Action Länk Text</Label>
              <Input
                id="partners-page-cta-link-text"
                value={content.partnersPage.callToActionLinkText || ""}
                onChange={(e) => handleChange("partnersPage", "callToActionLinkText", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="partners-page-cta-link">Call to Action Länk</Label>
              <Input
                id="partners-page-cta-link"
                value={content.partnersPage.callToActionLink || ""}
                onChange={(e) => handleChange("partnersPage", "callToActionLink", e.target.value)}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
