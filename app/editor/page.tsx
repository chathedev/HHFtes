"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { loadContent, saveContent, resetContent, type PageContent, type FAQItem } from "@/lib/content-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Plus, Trash2 } from "lucide-react"
import Link from "next/link"

type EditableFieldProps = {
  label: string
  value: string | number
  onChange: (newValue: string | number) => void
  type?: "text" | "textarea" | "number" | "url"
  className?: string
}

const EditableField: React.FC<EditableFieldProps> = ({ label, value, onChange, type = "text", className }) => {
  const inputComponent =
    type === "textarea" ? (
      <Textarea value={value as string} onChange={(e) => onChange(e.target.value)} className="min-h-[80px]" />
    ) : (
      <Input
        type={type === "number" ? "number" : type === "url" ? "url" : "text"}
        value={value}
        onChange={(e) => onChange(type === "number" ? Number(e.target.value) : e.target.value)}
      />
    )

  return (
    <div className={`space-y-2 ${className}`}>
      <Label className="font-semibold">{label}</Label>
      {inputComponent}
    </div>
  )
}

export default function EditorPage() {
  const [content, setContent] = useState<PageContent | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true)
      const fetchedContent = await loadContent()
      setContent(fetchedContent)
      setLoading(false)
    }
    fetchContent()
  }, [])

  const handleSave = useCallback(async () => {
    if (content) {
      const success = await saveContent(content)
      if (success) {
        toast({
          title: "Innehåll sparat!",
          description: "Dina ändringar har sparats till backend och lokalt.",
        })
      } else {
        toast({
          title: "Fel vid sparning!",
          description: "Kunde inte spara ändringar till backend. Kontrollera konsolen för mer info.",
          variant: "destructive",
        })
      }
    }
  }, [content, toast])

  const handleReset = useCallback(async () => {
    if (confirm("Är du säker på att du vill återställa allt innehåll till standardvärden? Detta kan inte ångras.")) {
      resetContent() // Removes from localStorage
      // För att återställa backend, skulle du behöva en specifik endpoint på din server.cjs
      // som återställer innehållet i databasen till standard.
      // Exempel: await fetch('https://api.nuredo.se/api/content/reset', { method: 'POST' });
      const fetchedContent = await loadContent() // Reloads default or from backend if localStorage is empty
      setContent(fetchedContent)
      toast({
        title: "Innehåll återställt!",
        description: "Allt innehåll har återställts till standardvärden lokalt.",
        variant: "destructive",
      })
    }
  }, [toast])

  const updateField = useCallback(
    (path: string, newValue: string | number | FAQItem[]) => {
      if (!content) return

      const newContent = { ...content }
      let current: any = newContent
      const parts = path.split(".")

      for (let i = 0; i < parts.length - 1; i++) {
        current = current[parts[i]]
      }
      current[parts[parts.length - 1]] = newValue
      setContent(newContent)
    },
    [content],
  )

  const addFAQItem = useCallback(() => {
    if (content) {
      const newFAQItems = [...content.kontaktPage.faqItems, { question: "", answer: "" }]
      updateField("kontaktPage.faqItems", newFAQItems)
    }
  }, [content, updateField])

  const updateFAQItem = useCallback(
    (index: number, field: keyof FAQItem, value: string) => {
      if (content) {
        const newFAQItems = [...content.kontaktPage.faqItems]
        newFAQItems[index] = { ...newFAQItems[index], [field]: value }
        updateField("kontaktPage.faqItems", newFAQItems)
      }
    },
    [content, updateField],
  )

  const removeFAQItem = useCallback(
    (index: number) => {
      if (content && confirm("Är du säker på att du vill ta bort denna FAQ-fråga?")) {
        const newFAQItems = content.kontaktPage.faqItems.filter((_, i) => i !== index)
        updateField("kontaktPage.faqItems", newFAQItems)
      }
    },
    [content, updateField],
  )

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Laddar redigerare...</div>
  }

  if (!content) {
    return <div className="flex justify-center items-center min-h-screen">Inget innehåll att redigera.</div>
  }

  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      <h1 className="text-4xl font-bold text-green-700 mb-8 text-center">Webbplatsredigerare</h1>
      <p className="text-center text-gray-700 mb-8">
        Redigera innehållet på din webbplats här. Ändringar sparas till din backend (`api.nuredo.se`) och cachas lokalt
        i din webbläsare.
        <br />
        **OBS:** Se till att din backend har korrekt autentisering/auktorisering för `POST /api/content`.
      </p>

      <div className="flex justify-center gap-4 mb-12">
        <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700 text-white">
          Spara ändringar
        </Button>
        <Button onClick={handleReset} variant="destructive">
          Återställ till standard (lokalt)
        </Button>
        <Button asChild variant="outline">
          <Link href="/">Gå till startsidan</Link>
        </Button>
      </div>

      {/* Home Page Sections */}
      <h2 className="text-3xl font-bold text-orange-500 mb-6">Startsidan</h2>

      {/* Hero Section */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Hero-sektion</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <EditableField label="Titel" value={content.hero.title} onChange={(val) => updateField("hero.title", val)} />
          <EditableField
            label="Beskrivning"
            value={content.hero.description}
            onChange={(val) => updateField("hero.description", val)}
            type="textarea"
          />
          <EditableField
            label="Bakgrundsbild URL"
            value={content.hero.imageUrl}
            onChange={(val) => updateField("hero.imageUrl", val)}
            type="url"
          />
          <EditableField
            label="Knapp 1 Text"
            value={content.hero.button1Text}
            onChange={(val) => updateField("hero.button1Text", val)}
          />
          <EditableField
            label="Knapp 1 Länk"
            value={content.hero.button1Link}
            onChange={(val) => updateField("hero.button1Link", val)}
            type="url"
          />
          <EditableField
            label="Knapp 2 Text"
            value={content.hero.button2Text}
            onChange={(val) => updateField("hero.button2Text", val)}
          />
          <EditableField
            label="Knapp 2 Länk"
            value={content.hero.button2Link}
            onChange={(val) => updateField("hero.button2Link", val)}
            type="url"
          />
        </CardContent>
      </Card>

      {/* Stats Section */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Statistik-sektion</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <EditableField
            label="Totalt antal lag"
            value={content.stats.totalTeams}
            onChange={(val) => updateField("stats.totalTeams", val)}
            type="number"
          />
          <EditableField
            label="Antal A-lag"
            value={content.stats.aTeams}
            onChange={(val) => updateField("stats.aTeams", val)}
            type="number"
          />
          <EditableField
            label="Antal ungdomslag"
            value={content.stats.youthTeams}
            onChange={(val) => updateField("stats.youthTeams", val)}
            type="number"
          />
          <EditableField
            label="År av historia"
            value={content.stats.historyYears}
            onChange={(val) => updateField("stats.historyYears", val)}
          />
        </CardContent>
      </Card>

      {/* About Club Section */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Om Klubben-sektion</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <EditableField
            label="Titel"
            value={content.aboutClub.title}
            onChange={(val) => updateField("aboutClub.title", val)}
          />
          <EditableField
            label="Paragraf 1"
            value={content.aboutClub.paragraph1}
            onChange={(val) => updateField("aboutClub.paragraph1", val)}
            type="textarea"
          />
          <EditableField
            label="Paragraf 2"
            value={content.aboutClub.paragraph2}
            onChange={(val) => updateField("aboutClub.paragraph2", val)}
            type="textarea"
          />
          <EditableField
            label="Passion text"
            value={content.aboutClub.passionText}
            onChange={(val) => updateField("aboutClub.passionText", val)}
          />
          <EditableField
            label="Utveckling text"
            value={content.aboutClub.developmentText}
            onChange={(val) => updateField("aboutClub.developmentText", val)}
          />
          <EditableField
            label="Gemenskap text"
            value={content.aboutClub.communityText}
            onChange={(val) => updateField("aboutClub.communityText", val)}
          />
          <EditableField
            label="Knapp 1 Text"
            value={content.aboutClub.button1Text}
            onChange={(val) => updateField("aboutClub.button1Text", val)}
          />
          <EditableField
            label="Knapp 1 Länk"
            value={content.aboutClub.button1Link}
            onChange={(val) => updateField("aboutClub.button1Link", val)}
            type="url"
          />
          <EditableField
            label="Knapp 2 Text"
            value={content.aboutClub.button2Text}
            onChange={(val) => updateField("aboutClub.button2Text", val)}
          />
          <EditableField
            label="Knapp 2 Länk"
            value={content.aboutClub.button2Link}
            onChange={(val) => updateField("aboutClub.button2Link", val)}
            type="url"
          />
          <EditableField
            label="Bild URL"
            value={content.aboutClub.imageSrc}
            onChange={(val) => updateField("aboutClub.imageSrc", val)}
            type="url"
          />
          <EditableField
            label="Bild Alt-text"
            value={content.aboutClub.imageAlt}
            onChange={(val) => updateField("aboutClub.imageAlt", val)}
          />
          <EditableField
            label="Antal lag i utrop"
            value={content.aboutClub.totalTeamsCallout}
            onChange={(val) => updateField("aboutClub.totalTeamsCallout", val)}
            type="number"
          />
          <EditableField
            label="Text för antal lag i utrop"
            value={content.aboutClub.totalTeamsCalloutText}
            onChange={(val) => updateField("aboutClub.totalTeamsCalloutText", val)}
          />
        </CardContent>
      </Card>

      {/* Partners Carousel Section (Home Page) */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Partners Karusell (Startsidan)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <EditableField
            label="Titel"
            value={content.partnersCarousel.title}
            onChange={(val) => updateField("partnersCarousel.title", val)}
          />
          <EditableField
            label="Beskrivning"
            value={content.partnersCarousel.description}
            onChange={(val) => updateField("partnersCarousel.description", val)}
            type="textarea"
          />
          <EditableField
            label="CTA Titel"
            value={content.partnersCarousel.callToActionTitle}
            onChange={(val) => updateField("partnersCarousel.callToActionTitle", val)}
          />
          <EditableField
            label="CTA Beskrivning"
            value={content.partnersCarousel.callToActionDescription}
            onChange={(val) => updateField("partnersCarousel.callToActionDescription", val)}
            type="textarea"
          />
          <EditableField
            label="CTA Länk Text"
            value={content.partnersCarousel.callToActionLinkText}
            onChange={(val) => updateField("partnersCarousel.callToActionLinkText", val)}
          />
          <EditableField
            label="CTA Länk URL"
            value={content.partnersCarousel.callToActionLink}
            onChange={(val) => updateField("partnersCarousel.callToActionLink", val)}
            type="url"
          />
        </CardContent>
      </Card>

      {/* Partners Page Sections */}
      <h2 className="text-3xl font-bold text-orange-500 mb-6 mt-12">Partnersidan</h2>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Partnersida Innehåll</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <EditableField
            label="Titel"
            value={content.partnersPage.title}
            onChange={(val) => updateField("partnersPage.title", val)}
          />
          <EditableField
            label="Beskrivning"
            value={content.partnersPage.description}
            onChange={(val) => updateField("partnersPage.description", val)}
            type="textarea"
          />
          <EditableField
            label="CTA Titel"
            value={content.partnersPage.callToActionTitle}
            onChange={(val) => updateField("partnersPage.callToActionTitle", val)}
          />
          <EditableField
            label="CTA Beskrivning"
            value={content.partnersPage.callToActionDescription}
            onChange={(val) => updateField("partnersPage.callToActionDescription", val)}
            type="textarea"
          />
          <EditableField
            label="CTA Länk Text"
            value={content.partnersPage.callToActionLinkText}
            onChange={(val) => updateField("partnersPage.callToActionLinkText", val)}
          />
          <EditableField
            label="CTA Länk URL"
            value={content.partnersPage.callToActionLink}
            onChange={(val) => updateField("partnersPage.callToActionLink", val)}
            type="url"
          />
        </CardContent>
      </Card>

      {/* Kontakt Page Sections */}
      <h2 className="text-3xl font-bold text-orange-500 mb-6 mt-12">Kontaktsidan</h2>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Kontaktinformation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <EditableField
            label="E-post Titel"
            value={content.kontaktPage.emailTitle}
            onChange={(val) => updateField("kontaktPage.emailTitle", val)}
          />
          <EditableField
            label="E-post Beskrivning"
            value={content.kontaktPage.emailDescription}
            onChange={(val) => updateField("kontaktPage.emailDescription", val)}
          />
          <EditableField
            label="E-post Adress"
            value={content.kontaktPage.emailAddress}
            onChange={(val) => updateField("kontaktPage.emailAddress", val)}
            type="text"
          />
          <EditableField
            label="Adress Titel"
            value={content.kontaktPage.addressTitle}
            onChange={(val) => updateField("kontaktPage.addressTitle", val)}
          />
          <EditableField
            label="Adress Beskrivning"
            value={content.kontaktPage.addressDescription}
            onChange={(val) => updateField("kontaktPage.addressDescription", val)}
          />
          <EditableField
            label="Adress Plats"
            value={content.kontaktPage.addressLocation}
            onChange={(val) => updateField("kontaktPage.addressLocation", val)}
          />
          <EditableField
            label="Styrelse Titel"
            value={content.kontaktPage.boardTitle}
            onChange={(val) => updateField("kontaktPage.boardTitle", val)}
          />
          <EditableField
            label="Styrelse Beskrivning"
            value={content.kontaktPage.boardDescription}
            onChange={(val) => updateField("kontaktPage.boardDescription", val)}
          />
          <EditableField
            label="Styrelse Kontakt"
            value={content.kontaktPage.boardContact}
            onChange={(val) => updateField("kontaktPage.boardContact", val)}
          />
        </CardContent>
      </Card>

      {/* FAQ Section */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Vanliga frågor (FAQ)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <EditableField
            label="FAQ Titel"
            value={content.kontaktPage.faqTitle}
            onChange={(val) => updateField("kontaktPage.faqTitle", val)}
          />
          {content.kontaktPage.faqItems.map((item, index) => (
            <div key={index} className="border p-4 rounded-md space-y-2 relative">
              <h4 className="font-semibold text-lg mb-2">FAQ #{index + 1}</h4>
              <EditableField
                label="Fråga"
                value={item.question}
                onChange={(val) => updateFAQItem(index, "question", val as string)}
              />
              <EditableField
                label="Svar"
                value={item.answer}
                onChange={(val) => updateFAQItem(index, "answer", val as string)}
                type="textarea"
              />
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2"
                onClick={() => removeFAQItem(index)}
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Ta bort FAQ</span>
              </Button>
            </div>
          ))}
          <Button onClick={addFAQItem} className="w-full">
            <Plus className="mr-2 h-4 w-4" /> Lägg till FAQ-fråga
          </Button>
        </CardContent>
      </Card>

      <div className="flex justify-center gap-4 mt-12">
        <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700 text-white">
          Spara ändringar
        </Button>
        <Button onClick={handleReset} variant="destructive">
          Återställ till standard (lokalt)
        </Button>
        <Button asChild variant="outline">
          <Link href="/">Gå till startsidan</Link>
        </Button>
      </div>
    </div>
  )
}
