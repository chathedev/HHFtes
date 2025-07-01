"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { type PageContent, defaultContent } from "@/lib/content-store" // Keep defaultContent for client-side fallback/initial state
import {
  loadEditorContentServer,
  saveEditorContentServer,
  resetEditorContentServer,
} from "@/app/actions/editor-content"

export default function EditorPage() {
  const [contentJsonString, setContentJsonString] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Load content on initial render
  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true)
      try {
        const fetchedContent = await loadEditorContentServer()
        setContentJsonString(JSON.stringify(fetchedContent, null, 2))
      } catch (error) {
        console.error("Failed to load content:", error)
        toast({
          title: "Fel vid laddning",
          description: "Kunde inte ladda innehåll från servern. Visar standardinnehåll.",
          variant: "destructive",
        })
        // Fallback to default content if server fetch fails
        setContentJsonString(JSON.stringify(defaultContent, null, 2))
      } finally {
        setLoading(false)
      }
    }
    fetchContent()
  }, [])

  const handleSave = useCallback(async () => {
    setSaving(true)
    try {
      const contentToSave: PageContent = JSON.parse(contentJsonString)
      const result = await saveEditorContentServer(contentToSave)
      if (result.success) {
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
    } catch (error) {
      console.error("Error parsing or saving content:", error)
      toast({
        title: "Felaktigt JSON-format",
        description: "Kontrollera att innehållet är giltig JSON.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }, [contentJsonString])

  const handleReset = useCallback(async () => {
    if (window.confirm("Är du säker på att du vill återställa allt innehåll till standard? Detta kan inte ångras.")) {
      setLoading(true)
      try {
        const fetchedContent = await resetEditorContentServer()
        setContentJsonString(JSON.stringify(fetchedContent, null, 2))
        toast({
          title: "Innehåll återställt!",
          description: "Allt innehåll har återställts till standardvärden.",
          variant: "default",
        })
      } catch (error) {
        console.error("Failed to reset content:", error)
        toast({
          title: "Fel vid återställning",
          description: "Kunde inte återställa innehåll från servern.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }
  }, [])

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Laddar redigerare...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      <h1 className="text-4xl font-bold text-green-700 mb-8 text-center">Webbplatsredigerare</h1>
      <p className="text-center text-gray-700 mb-12 max-w-2xl mx-auto">
        Redigera webbplatsens innehåll direkt som JSON. Ändringar sparas till din backend.
      </p>

      <div className="flex justify-center gap-4 mb-8">
        <Button onClick={handleSave} disabled={saving} className="bg-orange-500 hover:bg-orange-600 text-white">
          {saving ? "Sparar..." : "Spara ändringar"}
        </Button>
        <Button onClick={handleReset} variant="outline" disabled={saving}>
          Återställ till standard
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 p-4">
        <div>
          <Label htmlFor="contentEditor" className="sr-only">
            Redigera innehåll (JSON)
          </Label>
          <Textarea
            id="contentEditor"
            value={contentJsonString}
            onChange={(e) => setContentJsonString(e.target.value)}
            className="min-h-[600px] font-mono text-sm"
            placeholder="Laddar innehåll..."
            aria-label="Redigera webbplatsens innehåll som JSON"
          />
        </div>
      </div>
    </div>
  )
}
