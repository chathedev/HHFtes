"use client"

import { useCallback } from "react"

import type React from "react"

import { useEffect, useMemo, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/hooks/use-toast"
import type { FullContent, Partner } from "@/lib/content-types"
import { defaultContent } from "@/lib/default-content"
import { GripVertical, Trash2, PlusCircle } from "lucide-react"
import { KeyboardSensor, PointerSensor, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || "https://api.nuredo.se"

const RAW_URL = "https://raw.githubusercontent.com/chathedev/HHFNAF/main/content/home.json"

const owner = process.env.NEXT_PUBLIC_GITHUB_OWNER || "chathedev"
const repo = process.env.NEXT_PUBLIC_GITHUB_REPO || "HHFNAF"
const branch = process.env.NEXT_PUBLIC_GITHUB_BRANCH || "main"
const ghToken = process.env.NEXT_PUBLIC_GITHUB_TOKEN

type HomeData = {
  heroTitle: string
  heroSubtitle: string
  ctaText: string
  heroImage: string // URL
  partners: { name: string; logoUrl: string }[]
}

type ValidationErrors = Record<string, string>

function isHttpsUrl(url: string) {
  return /^https:\/\/.+/i.test(url.trim())
}

function encodeToBase64(str: string) {
  // Robust base64 for UTF-8 strings in the browser
  return btoa(unescape(encodeURIComponent(str)))
}

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
  const [data, setData] = useState<HomeData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [publishing, setPublishing] = useState(false)
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({})
  const [showToast, setShowToast] = useState<{ message: string; href?: string } | null>(null)

  // Inline edit states
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [isEditingSubtitle, setIsEditingSubtitle] = useState(false)
  const [isEditingCTA, setIsEditingCTA] = useState(false)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const ctaRef = useRef<HTMLButtonElement>(null)
  const titleDraft = useRef<string>("")
  const subtitleDraft = useRef<string>("")
  const ctaDraft = useRef<string>("")

  // Hero image inline popover
  const [imagePopoverOpen, setImagePopoverOpen] = useState(false)
  const [imagePopoverPos, setImagePopoverPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 })
  const imageInputRef = useRef<HTMLInputElement>(null)

  // Partner popover per index
  const [partnerLogoEdit, setPartnerLogoEdit] = useState<{ index: number; x: number; y: number } | null>(null)
  const partnerLogoInputRef = useRef<HTMLInputElement>(null)

  const router = useRouter()
  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor))

  // Fetch latest content
  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(RAW_URL, { cache: "no-store" })
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
      const json: HomeData = await res.json()
      setData(json)
    } catch (e: any) {
      setError(`Failed to load data: ${e?.message || "Unknown error"}`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // Validation
  const validate = () => {
    const errs: ValidationErrors = {}
    if (!data) {
      setValidationErrors(errs)
      return errs
    }
    if (!data.heroTitle.trim()) errs.heroTitle = "Hero title cannot be empty."
    if (!data.ctaText.trim()) errs.ctaText = "CTA text cannot be empty."
    if (!data.heroImage.trim()) errs.heroImage = "Hero image URL cannot be empty."
    else if (!isHttpsUrl(data.heroImage)) errs.heroImage = "Hero image URL must start with https://"

    data.partners.forEach((p, i) => {
      if (!p.logoUrl.trim()) errs[`partners.${i}.logoUrl`] = "Logo URL cannot be empty."
      else if (!isHttpsUrl(p.logoUrl)) errs[`partners.${i}.logoUrl`] = "Logo URL must start with https://"
      if (!p.name.trim()) errs[`partners.${i}.name`] = "Partner name cannot be empty."
    })

    setValidationErrors(errs)
    return errs
  }

  const hasErrors = useMemo(() => Object.keys(validationErrors).length > 0, [validationErrors])

  // Publish via GitHub Contents API
  const handlePublish = async () => {
    if (!data) return
    const errs = validate()
    if (Object.keys(errs).length > 0) return

    if (!ghToken) {
      setError("Missing NEXT_PUBLIC_GITHUB_TOKEN.")
      return
    }

    setPublishing(true)
    try {
      // 1) Get file sha
      const getRes = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/contents/content/home.json?ref=${branch}`,
        {
          headers: {
            Authorization: `Bearer ${ghToken}`,
            Accept: "application/vnd.github+json",
          },
        },
      )
      if (!getRes.ok) throw new Error(`GET file failed: ${getRes.status} ${getRes.statusText}`)
      const fileInfo = await getRes.json()
      const sha = fileInfo?.sha
      if (!sha) throw new Error("Could not read file sha from GitHub response.")

      // 2) PUT update
      const pretty = JSON.stringify(data, null, 2)
      const contentB64 = encodeToBase64(pretty)
      const putRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/content/home.json`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${ghToken}`,
          Accept: "application/vnd.github+json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: "Editor changes from /editor",
          content: contentB64,
          sha,
          branch,
        }),
      })
      if (!putRes.ok) throw new Error(`PUT update failed: ${putRes.status} ${putRes.statusText}`)
      const result = await putRes.json()
      const commitUrl: string | undefined = result?.commit?.html_url

      setShowToast({ message: "Changes published successfully.", href: commitUrl })
      // Auto-hide toast
      setTimeout(() => setShowToast(null), 5000)
    } catch (e: any) {
      setError(e?.message || "Failed to publish changes.")
    } finally {
      setPublishing(false)
    }
  }

  // Reset: re-fetch from source
  const handleReset = () => {
    fetchData()
    setValidationErrors({})
  }

  // Editing helpers
  const startEdit = (type: "title" | "subtitle" | "cta") => {
    if (!data) return
    if (type === "title") {
      titleDraft.current = data.heroTitle
      setIsEditingTitle(true)
      setTimeout(() => titleRef.current?.focus(), 0)
    } else if (type === "subtitle") {
      subtitleDraft.current = data.heroSubtitle
      setIsEditingSubtitle(true)
      setTimeout(() => subtitleRef.current?.focus(), 0)
    } else {
      ctaDraft.current = data.ctaText
      setIsEditingCTA(true)
      setTimeout(() => ctaRef.current?.focus(), 0)
    }
  }

  const onKeyDownEditable = (e: React.KeyboardEvent<HTMLElement>, type: "title" | "subtitle" | "cta") => {
    if (e.key === "Enter") {
      e.preventDefault()(e.target as HTMLElement).blur()
    } else if (e.key === "Escape") {
      // Cancel to draft
      if (!data) return
      if (type === "title") {
        if (titleRef.current) titleRef.current.textContent = titleDraft.current
        setIsEditingTitle(false)
      } else if (type === "subtitle") {
        if (subtitleRef.current) subtitleRef.current.textContent = subtitleDraft.current
        setIsEditingSubtitle(false)
      } else {
        if (ctaRef.current) ctaRef.current.textContent = ctaDraft.current
        setIsEditingCTA(false)
      }
    }
  }

  const onBlurEditable = (e: React.FocusEvent<HTMLElement>, type: "title" | "subtitle" | "cta") => {
    if (!data) return
    const text = e.currentTarget.textContent ?? ""
    if (type === "title") {
      setData({ ...data, heroTitle: text })
      setIsEditingTitle(false)
    } else if (type === "subtitle") {
      setData({ ...data, heroSubtitle: text })
      setIsEditingSubtitle(false)
    } else {
      setData({ ...data, ctaText: text })
      setIsEditingCTA(false)
    }
  }

  // Image popover
  const openImagePopover = (e: React.MouseEvent) => {
    setImagePopoverPos({ x: e.clientX, y: e.clientY })
    setImagePopoverOpen(true)
    setTimeout(() => imageInputRef.current?.focus(), 0)
  }

  const updateHeroImage = (url: string) => {
    if (!data) return
    setData({ ...data, heroImage: url })
  }

  // Partner editing
  const addPartner = () => {
    if (!data) return
    setData({
      ...data,
      partners: [...data.partners, { name: "New Partner", logoUrl: "https://via.placeholder.com/200x80?text=Logo" }],
    })
  }

  const removePartner = (index: number) => {
    if (!data) return
    const next = [...data.partners]
    next.splice(index, 1)
    setData({ ...data, partners: next })
  }

  const startEditPartnerName = (index: number) => {
    const el = document.getElementById(`partner-name-${index}`) as HTMLParagraphElement | null
    if (el) {
      el.contentEditable = "true"
      el.focus()
      ;(el as any).__draft = el.textContent || ""
    }
  }

  const onKeyDownPartnerName = (e: React.KeyboardEvent<HTMLParagraphElement>, index: number) => {
    if (e.key === "Enter") {
      e.preventDefault()
      e.currentTarget.blur()
    } else if (e.key === "Escape") {
      const draft = (e.currentTarget as any).__draft as string
      e.currentTarget.textContent = draft
      e.currentTarget.blur()
    }
  }

  const onBlurPartnerName = (e: React.FocusEvent<HTMLParagraphElement>, index: number) => {
    const name = e.currentTarget.textContent || ""
    e.currentTarget.contentEditable = "false"
    if (!data) return
    const next = [...data.partners]
    next[index] = { ...next[index], name }
    setData({ ...data, partners: next })
  }

  const openPartnerLogoPopover = (index: number, e: React.MouseEvent) => {
    setPartnerLogoEdit({ index, x: e.clientX, y: e.clientY })
    setTimeout(() => partnerLogoInputRef.current?.focus(), 0)
  }

  const updatePartnerLogo = (index: number, logoUrl: string) => {
    if (!data) return
    const next = [...data.partners]
    next[index] = { ...next[index], logoUrl }
    setData({ ...data, partners: next })
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

  const [sectionOrder, setSectionOrder] = useState<string[]>([])

  const handleContentChange = useCallback((sectionKey: keyof FullContent, updatedSectionContent: any) => {
    setContent((prevContent) => {
      if (!prevContent) return null
      return {
        ...prevContent,
        [sectionKey]: updatedSectionContent,
      }
    })
  }, [])

  const [content, setContent] = useState<FullContent | null>(null)

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="sticky top-0 bg-white shadow px-4 py-3">
          <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="max-w-7xl mx-auto p-4 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-4">
            <div className="h-10 bg-white rounded shadow animate-pulse" />
            <div className="h-56 bg-white rounded shadow animate-pulse" />
          </div>
          <div className="md:col-span-2 h-[28rem] bg-white rounded shadow animate-pulse" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="sticky top-0 bg-white shadow px-4 py-3">
          <h1 className="font-semibold">Site Editor</h1>
        </div>
        <div className="max-w-3xl mx-auto p-4">
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded">
            <p className="font-medium">Error</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
          <button
            onClick={() => {
              setError(null)
              fetchData()
            }}
            className="mt-4 inline-flex items-center rounded bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Try again
          </button>
        </div>
      </div>
    )
  }

  if (!data) return null

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky top bar */}
      <div className="sticky top-0 z-20 bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg font-semibold">Site Editor</h1>
          <div className="flex gap-2">
            <button
              onClick={validate}
              className="inline-flex items-center rounded bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Validate
            </button>
            <button
              onClick={handleReset}
              className="inline-flex items-center rounded bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Reset
            </button>
            <button
              onClick={handlePublish}
              disabled={publishing}
              className={`inline-flex items-center rounded ${
                publishing ? "bg-green-400" : "bg-green-600 hover:bg-green-700"
              } text-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:cursor-not-allowed`}
            >
              {publishing ? "Publishing..." : "Publish"}
            </button>
          </div>
        </div>
      </div>

      {/* Split layout */}
      <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left tools */}
        <aside className="space-y-6">
          <section className="bg-white rounded shadow p-4">
            <h2 className="font-medium mb-3">Hero image</h2>
            <label htmlFor="heroImageInput" className="block text-sm text-gray-700">
              Image URL
            </label>
            <input
              id="heroImageInput"
              type="text"
              value={data.heroImage}
              onChange={(e) => updateHeroImage(e.target.value)}
              className={`mt-1 w-full rounded border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                validationErrors.heroImage ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="https://example.com/image.jpg"
            />
            {validationErrors.heroImage && <p className="mt-2 text-xs text-red-600">{validationErrors.heroImage}</p>}
            <p className="mt-2 text-xs text-gray-500">Tip: Click the hero image in the preview to edit inline.</p>
          </section>

          <section className="bg-white rounded shadow p-4">
            <div className="flex items-center justify-between">
              <h2 className="font-medium">Partners</h2>
              <button
                onClick={addPartner}
                className="text-xs inline-flex items-center rounded bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                + Add partner
              </button>
            </div>
            <div className="mt-3 space-y-2">
              <button
                onClick={() => {
                  if (data.partners.length > 0) removePartner(data.partners.length - 1)
                }}
                className="w-full text-xs inline-flex items-center justify-center rounded bg-red-600 hover:bg-red-700 text-white px-2 py-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Remove last partner
              </button>
            </div>
          </section>

          {hasErrors && (
            <section className="bg-red-50 border border-red-200 rounded p-4">
              <h3 className="font-medium text-red-800">Validation</h3>
              <ul className="mt-2 list-disc list-inside text-sm text-red-700 space-y-1">
                {Object.entries(validationErrors).map(([k, v]) => (
                  <li key={k}>
                    <span className="font-mono">{k}</span>: {v}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </aside>

        {/* Right live preview (primary) */}
        <main className="md:col-span-2">
          <div className="bg-white rounded shadow overflow-hidden">
            {/* Hero */}
            <div
              className="relative h-80 sm:h-96 bg-gray-200 bg-center bg-cover cursor-pointer"
              style={{ backgroundImage: `url('${data.heroImage}')` }}
              onClick={(e) => openImagePopover(e)}
              role="button"
              aria-label="Edit hero image URL"
            >
              <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white px-4">
                <h2
                  ref={titleRef}
                  className={`text-3xl sm:text-4xl font-bold text-center outline-none rounded ${
                    validationErrors.heroTitle ? "ring-2 ring-red-500" : ""
                  }`}
                  contentEditable={isEditingTitle}
                  suppressContentEditableWarning
                  onDoubleClick={() => startEdit("title")}
                  onKeyDown={(e) => onKeyDownEditable(e, "title")}
                  onBlur={(e) => onBlurEditable(e, "title")}
                  tabIndex={0}
                >
                  {data.heroTitle}
                </h2>

                <p
                  ref={subtitleRef}
                  className="mt-3 text-lg sm:text-xl text-center max-w-3xl outline-none rounded"
                  contentEditable={isEditingSubtitle}
                  suppressContentEditableWarning
                  onDoubleClick={() => startEdit("subtitle")}
                  onKeyDown={(e) => onKeyDownEditable(e, "subtitle")}
                  onBlur={(e) => onBlurEditable(e, "subtitle")}
                  tabIndex={0}
                >
                  {data.heroSubtitle}
                </p>

                <button
                  ref={ctaRef}
                  className={`mt-6 inline-flex items-center rounded bg-blue-600 hover:bg-blue-700 px-5 py-3 text-white font-medium outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                    validationErrors.ctaText ? "ring-2 ring-red-500 focus:ring-red-500" : ""
                  }`}
                  contentEditable={isEditingCTA}
                  suppressContentEditableWarning
                  onDoubleClick={() => startEdit("cta")}
                  onKeyDown={(e) => onKeyDownEditable(e as any, "cta")}
                  onBlur={(e) => onBlurEditable(e as any, "cta")}
                >
                  {data.ctaText}
                </button>
              </div>
            </div>

            {/* Partners */}
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Our Partners</h3>
                <button
                  onClick={addPartner}
                  className="text-xs inline-flex items-center rounded bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  + Add partner
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {data.partners.map((p, i) => (
                  <div key={`${p.name}-${i}`} className="relative border rounded p-3 flex flex-col items-center">
                    <img
                      src={p.logoUrl || "/placeholder.svg"}
                      alt={p.name}
                      className={`h-16 object-contain cursor-pointer ${validationErrors[`partners.${i}.logoUrl`] ? "outline outline-2 outline-red-500" : ""}`}
                      onClick={(e) => openPartnerLogoPopover(i, e)}
                    />
                    <p
                      id={`partner-name-${i}`}
                      className={`mt-2 text-sm text-center outline-none rounded ${
                        validationErrors[`partners.${i}.name`] ? "ring-2 ring-red-500" : ""
                      }`}
                      onDoubleClick={() => startEditPartnerName(i)}
                      onKeyDown={(e) => onKeyDownPartnerName(e, i)}
                      onBlur={(e) => onBlurPartnerName(e, i)}
                      tabIndex={0}
                    >
                      {p.name}
                    </p>
                    <button
                      onClick={() => removePartner(i)}
                      className="absolute top-2 right-2 text-xs rounded bg-red-600 hover:bg-red-700 text-white px-2 py-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      aria-label={`Remove partner ${p.name}`}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Hero image popover */}
      {imagePopoverOpen && (
        <>
          <div
            className="fixed z-30 bg-white shadow-lg border rounded p-3 w-72"
            style={{
              top: imagePopoverPos.y,
              left: imagePopoverPos.x,
              transform: "translate(-50%, -110%)",
            }}
          >
            <label htmlFor="heroImagePopover" className="block text-sm text-gray-700 mb-1">
              Hero Image URL
            </label>
            <input
              id="heroImagePopover"
              ref={imageInputRef}
              type="text"
              value={data.heroImage}
              onChange={(e) => updateHeroImage(e.target.value)}
              className={`w-full rounded border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                validationErrors.heroImage ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="https://..."
            />
            <div className="mt-2 flex justify-end gap-2">
              <button
                onClick={() => setImagePopoverOpen(false)}
                className="text-sm rounded bg-gray-200 hover:bg-gray-300 px-3 py-1"
              >
                Close
              </button>
            </div>
          </div>
          <div className="fixed inset-0 z-20" onClick={() => setImagePopoverOpen(false)} aria-hidden="true" />
        </>
      )}

      {/* Partner logo popover */}
      {partnerLogoEdit && (
        <>
          <div
            className="fixed z-30 bg-white shadow-lg border rounded p-3 w-80"
            style={{
              top: partnerLogoEdit.y,
              left: partnerLogoEdit.x,
              transform: "translate(-50%, -110%)",
            }}
          >
            <label htmlFor="partnerLogoUrl" className="block text-sm text-gray-700 mb-1">
              Partner Logo URL
            </label>
            <input
              id="partnerLogoUrl"
              ref={partnerLogoInputRef}
              type="text"
              value={data.partners[partnerLogoEdit.index]?.logoUrl || ""}
              onChange={(e) => updatePartnerLogo(partnerLogoEdit.index, e.target.value)}
              className={`w-full rounded border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                validationErrors[`partners.${partnerLogoEdit.index}.logoUrl`] ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="https://..."
            />
            <div className="mt-2 flex justify-end gap-2">
              <button
                onClick={() => setPartnerLogoEdit(null)}
                className="text-sm rounded bg-gray-200 hover:bg-gray-300 px-3 py-1"
              >
                Close
              </button>
            </div>
          </div>
          <div className="fixed inset-0 z-20" onClick={() => setPartnerLogoEdit(null)} aria-hidden="true" />
        </>
      )}

      {/* Simple toast */}
      {showToast && (
        <div className="fixed bottom-4 right-4 z-50 bg-gray-900 text-white rounded shadow-lg px-4 py-3 max-w-sm">
          <p className="text-sm">{showToast.message}</p>
          {showToast.href && (
            <a
              href={showToast.href}
              target="_blank"
              rel="noreferrer"
              className="text-xs underline text-blue-300 mt-1 inline-block"
            >
              View commit
            </a>
          )}
          <button
            onClick={() => setShowToast(null)}
            className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-white text-gray-900 text-xs"
            aria-label="Close toast"
          >
            ×
          </button>
        </div>
      )}
    </div>
  )
}
