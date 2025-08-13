"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Save, Monitor, Tablet, Smartphone, Loader2, X, Check } from "lucide-react"

const PAGES = [
  { name: "home", displayName: "Hem", path: "/" },
  { name: "kontakt", displayName: "Kontakt", path: "/kontakt" },
  { name: "lag", displayName: "Lag", path: "/lag" },
  { name: "matcher", displayName: "Matcher", path: "/matcher" },
  { name: "nyheter", displayName: "Nyheter", path: "/nyheter" },
  { name: "partners", displayName: "Partners", path: "/partners" },
]

const VIEWPORTS = {
  desktop: { width: "100%", height: "100%", icon: Monitor },
  tablet: { width: "768px", height: "1024px", icon: Tablet },
  mobile: { width: "375px", height: "667px", icon: Smartphone },
}

const DEFAULT_CONTENT = {
  home: {
    hero: {
      title: "LAGET FÖRE ALLT",
      subtitle: "Härnösands Handbollsförening",
      description: "Välkommen till Härnösands HF - där passion möter prestation",
      primaryButton: "Bli Medlem",
      secondaryButton: "Se Matcher",
      backgroundImage: "/placeholder.svg?height=600&width=1200",
    },
    stats: {
      members: "200+",
      teams: "12",
      years: "25+",
      titles: "15",
    },
    about: {
      title: "Om Härnösands HF",
      description:
        "Vi är en handbollsförening som brinner för sporten och gemenskapen. Sedan 1999 har vi varit en del av Härnösands idrottsliv.",
      features: ["Professionell träning", "Stark gemenskap", "Alla åldrar välkomna", "Moderna faciliteter"],
    },
  },
  kontakt: {
    title: "Kontakta Oss",
    description: "Har du frågor eller vill veta mer om föreningen? Hör av dig till oss!",
    departments: [
      {
        name: "Allmän Information",
        email: "kontakt@harnosandshf.se",
        description: "För allmänna frågor om föreningen",
      },
      {
        name: "Marknadsföring",
        email: "marknad@harnosandshf.se",
        description: "Vill du sponsra oss eller samarbeta?",
      },
    ],
  },
}

export default function EditorPage() {
  const [currentPage, setCurrentPage] = useState(PAGES[0])
  const [viewport, setViewport] = useState<keyof typeof VIEWPORTS>("desktop")
  const [content, setContent] = useState<any>(DEFAULT_CONTENT)
  const [originalContent, setOriginalContent] = useState<any>(DEFAULT_CONTENT)
  const [editingField, setEditingField] = useState<string | null>(null)
  const [editingValue, setEditingValue] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  const saveContent = async () => {
    setIsSaving(true)
    try {
      const response = await fetch("/api/github-commit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          filename: `content/${currentPage.name}.json`,
          content: JSON.stringify(content[currentPage.name], null, 2),
          message: `Update ${currentPage.displayName} content via editor`,
        }),
      })

      if (!response.ok) {
        throw new Error(`Failed to save ${currentPage.name}`)
      }

      setOriginalContent(JSON.parse(JSON.stringify(content)))

      toast({
        title: "✅ Changes Committed to GitHub",
        description: `${currentPage.displayName} updated and pushed to repository`,
        className: "bg-green-500 text-white",
      })
    } catch (error) {
      console.error("Save error:", error)
      toast({
        title: "❌ GitHub Commit Failed",
        description: "Failed to commit changes to repository",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleEdit = (fieldPath: string, currentValue: string) => {
    setEditingField(fieldPath)
    setEditingValue(currentValue)
  }

  const saveField = () => {
    if (!editingField) return

    const keys = editingField.split(".")
    let obj = content

    for (let i = 0; i < keys.length - 1; i++) {
      if (!obj[keys[i]]) obj[keys[i]] = {}
      obj = obj[keys[i]]
    }

    obj[keys[keys.length - 1]] = editingValue
    setContent({ ...content })
    setEditingField(null)
    setEditingValue("")

    toast({
      title: "Field Updated",
      description: "Click Save Changes to commit to GitHub",
      className: "bg-blue-500 text-white",
    })
  }

  const cancelEdit = () => {
    setEditingField(null)
    setEditingValue("")
  }

  const renderPageContent = () => {
    const pageContent = content[currentPage.name] || {}

    if (currentPage.name === "home") {
      return (
        <div className="min-h-screen">
          {/* Hero Section */}
          <section className="relative h-screen flex items-center justify-center text-white">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${pageContent.hero?.backgroundImage})` }}
              onClick={() => handleEdit("home.hero.backgroundImage", pageContent.hero?.backgroundImage || "")}
            />
            <div className="absolute inset-0 bg-black/50" />
            <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
              <h1
                className="text-6xl font-bold mb-4 cursor-pointer hover:bg-white/10 p-2 rounded transition-colors"
                onClick={() => handleEdit("home.hero.title", pageContent.hero?.title || "")}
              >
                {pageContent.hero?.title}
              </h1>
              <h2
                className="text-2xl mb-6 cursor-pointer hover:bg-white/10 p-2 rounded transition-colors"
                onClick={() => handleEdit("home.hero.subtitle", pageContent.hero?.subtitle || "")}
              >
                {pageContent.hero?.subtitle}
              </h2>
              <p
                className="text-xl mb-8 cursor-pointer hover:bg-white/10 p-2 rounded transition-colors"
                onClick={() => handleEdit("home.hero.description", pageContent.hero?.description || "")}
              >
                {pageContent.hero?.description}
              </p>
              <div className="flex gap-4 justify-center">
                <button
                  className="bg-green-600 hover:bg-green-700 px-8 py-3 rounded-lg font-semibold cursor-pointer hover:bg-white/10 transition-colors"
                  onClick={() => handleEdit("home.hero.primaryButton", pageContent.hero?.primaryButton || "")}
                >
                  {pageContent.hero?.primaryButton}
                </button>
                <button
                  className="border-2 border-white hover:bg-white hover:text-black px-8 py-3 rounded-lg font-semibold cursor-pointer hover:bg-white/10 transition-colors"
                  onClick={() => handleEdit("home.hero.secondaryButton", pageContent.hero?.secondaryButton || "")}
                >
                  {pageContent.hero?.secondaryButton}
                </button>
              </div>
            </div>
          </section>

          {/* Stats Section */}
          <section className="py-16 bg-green-600 text-white">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                <div>
                  <div
                    className="text-4xl font-bold mb-2 cursor-pointer hover:bg-white/10 p-2 rounded transition-colors"
                    onClick={() => handleEdit("home.stats.members", pageContent.stats?.members || "")}
                  >
                    {pageContent.stats?.members}
                  </div>
                  <div className="text-lg">Medlemmar</div>
                </div>
                <div>
                  <div
                    className="text-4xl font-bold mb-2 cursor-pointer hover:bg-white/10 p-2 rounded transition-colors"
                    onClick={() => handleEdit("home.stats.teams", pageContent.stats?.teams || "")}
                  >
                    {pageContent.stats?.teams}
                  </div>
                  <div className="text-lg">Lag</div>
                </div>
                <div>
                  <div
                    className="text-4xl font-bold mb-2 cursor-pointer hover:bg-white/10 p-2 rounded transition-colors"
                    onClick={() => handleEdit("home.stats.years", pageContent.stats?.years || "")}
                  >
                    {pageContent.stats?.years}
                  </div>
                  <div className="text-lg">År</div>
                </div>
                <div>
                  <div
                    className="text-4xl font-bold mb-2 cursor-pointer hover:bg-white/10 p-2 rounded transition-colors"
                    onClick={() => handleEdit("home.stats.titles", pageContent.stats?.titles || "")}
                  >
                    {pageContent.stats?.titles}
                  </div>
                  <div className="text-lg">Titlar</div>
                </div>
              </div>
            </div>
          </section>

          {/* About Section */}
          <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center">
                <h2
                  className="text-4xl font-bold mb-6 cursor-pointer hover:bg-gray-100 p-2 rounded transition-colors"
                  onClick={() => handleEdit("home.about.title", pageContent.about?.title || "")}
                >
                  {pageContent.about?.title}
                </h2>
                <p
                  className="text-xl mb-8 cursor-pointer hover:bg-gray-100 p-2 rounded transition-colors"
                  onClick={() => handleEdit("home.about.description", pageContent.about?.description || "")}
                >
                  {pageContent.about?.description}
                </p>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {pageContent.about?.features?.map((feature: string, index: number) => (
                    <div
                      key={index}
                      className="p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => handleEdit(`home.about.features.${index}`, feature)}
                    >
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>
      )
    }

    if (currentPage.name === "kontakt") {
      return (
        <div className="min-h-screen py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h1
                className="text-4xl font-bold text-center mb-6 cursor-pointer hover:bg-white/50 p-2 rounded transition-colors"
                onClick={() => handleEdit("kontakt.title", pageContent.title || "")}
              >
                {pageContent.title}
              </h1>
              <p
                className="text-xl text-center mb-12 cursor-pointer hover:bg-white/50 p-2 rounded transition-colors"
                onClick={() => handleEdit("kontakt.description", pageContent.description || "")}
              >
                {pageContent.description}
              </p>

              <div className="grid md:grid-cols-2 gap-8">
                {pageContent.departments?.map((dept: any, index: number) => (
                  <div key={index} className="bg-white p-6 rounded-lg shadow-lg">
                    <h3
                      className="text-xl font-semibold mb-2 cursor-pointer hover:bg-gray-100 p-2 rounded transition-colors"
                      onClick={() => handleEdit(`kontakt.departments.${index}.name`, dept.name)}
                    >
                      {dept.name}
                    </h3>
                    <p
                      className="text-gray-600 mb-4 cursor-pointer hover:bg-gray-100 p-2 rounded transition-colors"
                      onClick={() => handleEdit(`kontakt.departments.${index}.description`, dept.description)}
                    >
                      {dept.description}
                    </p>
                    <a
                      href={`mailto:${dept.email}`}
                      className="text-green-600 font-semibold cursor-pointer hover:bg-gray-100 p-2 rounded transition-colors inline-block"
                      onClick={(e) => {
                        e.preventDefault()
                        handleEdit(`kontakt.departments.${index}.email`, dept.email)
                      }}
                    >
                      {dept.email}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="min-h-screen py-16 bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">{currentPage.displayName}</h1>
          <p className="text-gray-600">Click elements to edit them</p>
        </div>
      </div>
    )
  }

  const hasChanges = JSON.stringify(content) !== JSON.stringify(originalContent)

  return (
    <div className="h-screen bg-gray-100 flex flex-col">
      <div className="bg-white border-b px-6 py-3 flex items-center justify-between shadow-sm relative z-10">
        <div className="flex items-center gap-4">
          <Select
            value={currentPage.name}
            onValueChange={(value) => {
              const page = PAGES.find((p) => p.name === value)
              if (page) setCurrentPage(page)
            }}
          >
            <SelectTrigger className="w-48 bg-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white border shadow-lg z-50">
              {PAGES.map((page) => (
                <SelectItem key={page.name} value={page.name} className="bg-white hover:bg-gray-100">
                  {page.displayName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex gap-1">
            {Object.entries(VIEWPORTS).map(([size, config]) => {
              const IconComponent = config.icon
              return (
                <Button
                  key={size}
                  size="sm"
                  variant={viewport === size ? "default" : "outline"}
                  onClick={() => setViewport(size as keyof typeof VIEWPORTS)}
                >
                  <IconComponent className="w-4 h-4" />
                </Button>
              )
            })}
          </div>
        </div>

        <Button
          onClick={saveContent}
          disabled={isSaving || !hasChanges}
          className={hasChanges ? "bg-green-600 hover:bg-green-700" : ""}
        >
          {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          {isSaving ? "Saving..." : hasChanges ? "Save Changes" : "No Changes"}
        </Button>
      </div>

      <div className="flex-1 p-4 flex items-center justify-center overflow-auto">
        <div
          className="bg-white rounded-lg shadow-xl overflow-hidden overflow-y-auto"
          style={{
            width: VIEWPORTS[viewport].width,
            height: VIEWPORTS[viewport].height,
            maxWidth: "100%",
            maxHeight: "100%",
          }}
        >
          {renderPageContent()}
        </div>
      </div>

      {/* Edit Modal */}
      {editingField && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
            <h3 className="font-semibold mb-4">Edit: {editingField.split(".").pop()}</h3>

            {editingValue.length > 100 ? (
              <Textarea
                value={editingValue}
                onChange={(e) => setEditingValue(e.target.value)}
                rows={4}
                className="mb-4"
                placeholder="Enter your text here..."
              />
            ) : (
              <Input
                value={editingValue}
                onChange={(e) => setEditingValue(e.target.value)}
                className="mb-4"
                placeholder="Enter your text here..."
              />
            )}

            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={cancelEdit}>
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={saveField} className="bg-green-600 hover:bg-green-700">
                <Check className="w-4 h-4 mr-2" />
                Update
              </Button>
            </div>
          </div>
        </div>
      )}

      <Toaster />
    </div>
  )
}
