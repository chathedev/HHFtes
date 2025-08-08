// app/editor/page.tsx
"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/hooks/use-toast"
import type { FullContent, Partner } from "@/lib/content-types"
import { defaultContent } from "@/lib/default-content"
import { GripVertical, Trash2, PlusCircle, ExternalLink } from "lucide-react"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || "https://api.nuredo.se"

interface EditableSectionProps {
  sectionKey: string
  content: any
  onContentChange: (key: string, value: any) => void
}

// Helper component for sortable items
function SortableItem({ id, children }: { id: string; children: React.ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} className="relative">
      <div className="absolute top-1/2 -left-8 -translate-y-1/2 cursor-grab text-gray-400 hover:text-gray-700">
        <GripVertical className="w-6 h-6" {...listeners} />
      </div>
      {children}
    </div>
  )
}

const HeroEditor: React.FC<EditableSectionProps> = ({ content, onContentChange }) => (
  <Card className="mb-6">
    <CardHeader>
      <CardTitle>Hero Section</CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <div>
        <Label htmlFor="hero-image">Image URL</Label>
        <Input
          id="hero-image"
          value={content.imageUrl}
          onChange={(e) => onContentChange("hero", { ...content, imageUrl: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="hero-title">Title</Label>
        <Input
          id="hero-title"
          value={content.title}
          onChange={(e) => onContentChange("hero", { ...content, title: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="hero-description">Description</Label>
        <Textarea
          id="hero-description"
          value={content.description}
          onChange={(e) => onContentChange("hero", { ...content, description: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="hero-btn1-text">Button 1 Text</Label>
        <Input
          id="hero-btn1-text"
          value={content.button1Text}
          onChange={(e) => onContentChange("hero", { ...content, button1Text: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="hero-btn1-link">Button 1 Link</Label>
        <Input
          id="hero-btn1-link"
          value={content.button1Link}
          onChange={(e) => onContentChange("hero", { ...content, button1Link: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="hero-btn2-text">Button 2 Text</Label>
        <Input
          id="hero-btn2-text"
          value={content.button2Text}
          onChange={(e) => onContentChange("hero", { ...content, button2Text: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="hero-btn2-link">Button 2 Link</Label>
        <Input
          id="hero-btn2-link"
          value={content.button2Link}
          onChange={(e) => onContentChange("hero", { ...content, button2Link: e.target.value })}
        />
      </div>
    </CardContent>
  </Card>
)

const StatsEditor: React.FC<EditableSectionProps> = ({ content, onContentChange }) => (
  <Card className="mb-6">
    <CardHeader>
      <CardTitle>Stats Section</CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <div>
        <Label htmlFor="stats-total-teams">Total Teams</Label>
        <Input
          id="stats-total-teams"
          type="number"
          value={content.totalTeams}
          onChange={(e) => onContentChange("stats", { ...content, totalTeams: Number.parseInt(e.target.value) })}
        />
      </div>
      <div>
        <Label htmlFor="stats-a-teams">A-Teams</Label>
        <Input
          id="stats-a-teams"
          type="number"
          value={content.aTeams}
          onChange={(e) => onContentChange("stats", { ...content, aTeams: Number.parseInt(e.target.value) })}
        />
      </div>
      <div>
        <Label htmlFor="stats-youth-teams">Youth Teams</Label>
        <Input
          id="stats-youth-teams"
          type="number"
          value={content.youthTeams}
          onChange={(e) => onContentChange("stats", { ...content, youthTeams: Number.parseInt(e.target.value) })}
        />
      </div>
      <div>
        <Label htmlFor="stats-years-history">Years of History</Label>
        <Input
          id="stats-years-history"
          value={content.yearsHistory}
          onChange={(e) => onContentChange("stats", { ...content, yearsHistory: e.target.value })}
        />
      </div>
    </CardContent>
  </Card>
)

const AboutClubEditor: React.FC<EditableSectionProps> = ({ content, onContentChange }) => (
  <Card className="mb-6">
    <CardHeader>
      <CardTitle>About Club Section</CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <div>
        <Label htmlFor="about-title">Title</Label>
        <Input
          id="about-title"
          value={content.title}
          onChange={(e) => onContentChange("aboutClub", { ...content, title: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="about-p1">Paragraph 1</Label>
        <Textarea
          id="about-p1"
          value={content.paragraph1}
          onChange={(e) => onContentChange("aboutClub", { ...content, paragraph1: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="about-p2">Paragraph 2</Label>
        <Textarea
          id="about-p2"
          value={content.paragraph2}
          onChange={(e) => onContentChange("aboutClub", { ...content, paragraph2: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="about-passion">Passion Text</Label>
        <Input
          id="about-passion"
          value={content.passionText}
          onChange={(e) => onContentChange("aboutClub", { ...content, passionText: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="about-development">Development Text</Label>
        <Input
          id="about-development"
          value={content.developmentText}
          onChange={(e) => onContentChange("aboutClub", { ...content, developmentText: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="about-community">Community Text</Label>
        <Input
          id="about-community"
          value={content.communityText}
          onChange={(e) => onContentChange("aboutClub", { ...content, communityText: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="about-btn1-text">Button 1 Text</Label>
        <Input
          id="about-btn1-text"
          value={content.button1Text}
          onChange={(e) => onContentChange("aboutClub", { ...content, button1Text: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="about-btn1-link">Button 1 Link</Label>
        <Input
          id="about-btn1-link"
          value={content.button1Link}
          onChange={(e) => onContentChange("aboutClub", { ...content, button1Link: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="about-btn2-text">Button 2 Text</Label>
        <Input
          id="about-btn2-text"
          value={content.button2Text}
          onChange={(e) => onContentChange("aboutClub", { ...content, button2Text: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="about-btn2-link">Button 2 Link</Label>
        <Input
          id="about-btn2-link"
          value={content.button2Link}
          onChange={(e) => onContentChange("aboutClub", { ...content, button2Link: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="about-image-src">Image Source URL</Label>
        <Input
          id="about-image-src"
          value={content.imageSrc}
          onChange={(e) => onContentChange("aboutClub", { ...content, imageSrc: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="about-image-alt">Image Alt Text</Label>
        <Input
          id="about-image-alt"
          value={content.imageAlt}
          onChange={(e) => onContentChange("aboutClub", { ...content, imageAlt: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="about-stat-number">Stat Number</Label>
        <Input
          id="about-stat-number"
          type="number"
          value={content.statNumber}
          onChange={(e) => onContentChange("aboutClub", { ...content, statNumber: Number.parseInt(e.target.value) })}
        />
      </div>
      <div>
        <Label htmlFor="about-stat-label">Stat Label</Label>
        <Input
          id="about-stat-label"
          value={content.statLabel}
          onChange={(e) => onContentChange("aboutClub", { ...content, statLabel: e.target.value })}
        />
      </div>
    </CardContent>
  </Card>
)

const PartnersEditor: React.FC<EditableSectionProps> = ({ content, onContentChange }) => {
  const partners: Partner[] = content

  const handlePartnerChange = (index: number, field: keyof Partner, value: any) => {
    const updatedPartners = [...partners]
    updatedPartners[index] = { ...updatedPartners[index], [field]: value }
    onContentChange("partners", updatedPartners)
  }

  const handleAddPartner = () => {
    const newPartner: Partner = {
      id: `new-partner-${Date.now()}`,
      src: "/placeholder.svg",
      alt: "New Partner",
      width: 150,
      height: 75,
      tier: "Bronspartner",
      benefits: [],
      visibleInCarousel: true,
      linkUrl: undefined,
    }
    onContentChange("partners", [...partners, newPartner])
  }

  const handleRemovePartner = (index: number) => {
    const updatedPartners = partners.filter((_, i) => i !== index)
    onContentChange("partners", updatedPartners)
  }

  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle>Partners Section</CardTitle>
        <Button onClick={handleAddPartner} size="sm" className="bg-green-600 hover:bg-green-700">
          <PlusCircle className="w-4 h-4 mr-2" /> Add Partner
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {partners.map((partner, index) => (
          <div key={partner.id} className="border p-4 rounded-md space-y-3 relative">
            <h4 className="font-semibold text-lg mb-2">
              Partner {index + 1}: {partner.alt}
            </h4>
            <Button
              variant="destructive"
              size="sm"
              className="absolute top-4 right-4"
              onClick={() => handleRemovePartner(index)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
            <div>
              <Label htmlFor={`partner-${index}-alt`}>Alt Text</Label>
              <Input
                id={`partner-${index}-alt`}
                value={partner.alt}
                onChange={(e) => handlePartnerChange(index, "alt", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor={`partner-${index}-src`}>Image URL</Label>
              <Input
                id={`partner-${index}-src`}
                value={partner.src}
                onChange={(e) => handlePartnerChange(index, "src", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor={`partner-${index}-tier`}>Tier</Label>
              <select
                id={`partner-${index}-tier`}
                value={partner.tier}
                onChange={(e) => handlePartnerChange(index, "tier", e.target.value as Partner["tier"])}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="Diamantpartner">Diamantpartner</option>
                <option value="Platinapartner">Platinapartner</option>
                <option value="Guldpartner">Guldpartner</option>
                <option value="Silverpartner">Silverpartner</option>
                <option value="Bronspartner">Bronspartner</option>
              </select>
            </div>
            <div>
              <Label htmlFor={`partner-${index}-link`}>Link URL</Label>
              <Input
                id={`partner-${index}-link`}
                value={partner.linkUrl || ""}
                onChange={(e) => handlePartnerChange(index, "linkUrl", e.target.value || undefined)}
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={`partner-${index}-visible`}
                checked={partner.visibleInCarousel}
                onChange={(e) => handlePartnerChange(index, "visibleInCarousel", e.target.checked)}
                className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
              />
              <Label htmlFor={`partner-${index}-visible`}>Visible in Carousel</Label>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

const sectionEditors: { [key: string]: React.FC<EditableSectionProps> } = {
  hero: HeroEditor,
  stats: StatsEditor,
  aboutClub: AboutClubEditor,
  partnersCarousel: PartnersEditor,
  // UpcomingEvents is dynamic from external API, not directly editable here
  upcomingEvents: ({ sectionKey }) => (
    <Card className="mb-6 bg-gray-100 border-dashed border-gray-300">
      <CardHeader>
        <CardTitle>Upcoming Events Section</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600">
          This section's content is dynamically fetched from an external API and is not directly editable here. Its
          visibility and order can be managed.
        </p>
      </CardContent>
    </Card>
  ),
}

export default function EditorPage() {
  const [content, setContent] = useState<FullContent | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [sectionOrder, setSectionOrder] = useState<string[]>([])
  const router = useRouter()

  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor))

  const fetchContent = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`${BACKEND_API_URL}/api/content`)
      if (!res.ok) {
        throw new Error(`Failed to fetch content: ${res.statusText}`)
      }
      const data: FullContent = await res.json()
      setContent(data)
      setSectionOrder(data.sections || defaultContent.sections) // Use fetched order or default
    } catch (error: any) {
      console.error("Error fetching content:", error)
      toast({
        title: "Error",
        description: `Failed to load content: ${error.message}. Using default content.`,
        variant: "destructive",
      })
      setContent(defaultContent)
      setSectionOrder(defaultContent.sections)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchContent()
  }, [fetchContent])

  const handleContentChange = useCallback((sectionKey: keyof FullContent, updatedSectionContent: any) => {
    setContent((prevContent) => {
      if (!prevContent) return null
      return {
        ...prevContent,
        [sectionKey]: updatedSectionContent,
      }
    })
  }, [])

  const handleSave = async () => {
    if (!content) return
    setSaving(true)
    try {
      // Save main content
      const contentResponse = await fetch(`${BACKEND_API_URL}/api/content`, {
        method: "POST", // Or PATCH if your API supports partial updates for the whole content object
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.API_SECRET}`, // Pass API_SECRET for authentication
        },
        body: JSON.stringify(content),
      })

      if (!contentResponse.ok) {
        const errorData = await contentResponse.json()
        throw new Error(`Failed to save content: ${errorData.message || contentResponse.statusText}`)
      }

      // Save section order
      const sectionsResponse = await fetch(`${BACKEND_API_URL}/api/sections`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.API_SECRET}`, // Pass API_SECRET
        },
        body: JSON.stringify({ order: sectionOrder }),
      })

      if (!sectionsResponse.ok) {
        const errorData = await sectionsResponse.json()
        throw new Error(`Failed to save section order: ${errorData.message || sectionsResponse.statusText}`)
      }

      // Trigger revalidation on the Next.js frontend
      const revalidateResponse = await fetch(`/api/revalidate?secret=${process.env.REVALIDATE_SECRET}`)
      if (!revalidateResponse.ok) {
        console.warn("Failed to trigger revalidation on frontend.")
      }

      toast({
        title: "Success",
        description: "Content saved and site revalidated!",
      })
    } catch (error: any) {
      console.error("Save error:", error)
      toast({
        title: "Error",
        description: `Failed to save content: ${error.message}`,
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      router.push("/login")
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      })
    } catch (error) {
      console.error("Logout error:", error)
      toast({
        title: "Error",
        description: "Failed to log out.",
        variant: "destructive",
      })
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (active.id !== over?.id) {
      setSectionOrder((items) => {
        const oldIndex = items.indexOf(active.id as string)
        const newIndex = items.indexOf(over?.id as string)
        const newItems = [...items]
        const [movedItem] = newItems.splice(oldIndex, 1)
        newItems.splice(newIndex, 0, movedItem)
        return newItems
      })
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <p className="text-gray-600">Loading editor...</p>
      </div>
    )
  }

  if (!content) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <p className="text-red-500">Error: Could not load content.</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Editor Sidebar */}
      <aside className="w-1/2 p-8 bg-white border-r border-gray-200 overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-green-700">Site Editor</h1>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="text-red-500 border-red-300 hover:bg-red-50 bg-transparent"
          >
            Logout
          </Button>
        </div>

        <div className="mb-8 flex justify-end gap-4">
          <Button onClick={handleSave} disabled={saving} className="bg-orange-500 hover:bg-orange-600">
            {saving ? "Saving..." : "Save Changes"}
          </Button>
          <Button asChild variant="outline">
            <a href="/" target="_blank" rel="noopener noreferrer">
              View Live Site <ExternalLink className="ml-2 w-4 h-4" />
            </a>
          </Button>
        </div>

        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Edit Sections</h2>
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={sectionOrder} strategy={verticalListSortingStrategy}>
            <div className="space-y-6">
              {sectionOrder.map((sectionKey) => {
                const EditorComponent = sectionEditors[sectionKey]
                if (!EditorComponent) return null

                return (
                  <SortableItem key={sectionKey} id={sectionKey}>
                    <EditorComponent
                      sectionKey={sectionKey}
                      content={content[sectionKey as keyof FullContent]}
                      onContentChange={handleContentChange}
                    />
                  </SortableItem>
                )
              })}
            </div>
          </SortableContext>
        </DndContext>
      </aside>

      {/* Live Preview */}
      <main className="flex-1 p-4">
        <h2 className="sr-only">Live Preview</h2>
        <iframe src="/" title="Live Site Preview" className="w-full h-full border rounded-lg shadow-md" />
      </main>
    </div>
  )
}
