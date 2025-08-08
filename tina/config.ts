"use client"

import * as React from "react"

type FileMap = Map<string, any>

type TinaCtx = {
  isOpen: boolean
  toggle: () => void
  setOpen: (v: boolean) => void
  ensureLoaded: (filePath: string) => Promise<void>
  getValue: (filePath: string, field: string) => unknown
  setValue: (filePath: string, field: string, value: unknown) => void
  data: FileMap
}

const TinaContext = React.createContext<TinaCtx | null>(null)

function hasEditCookie() {
  if (typeof document === "undefined") return false
  return document.cookie.split("; ").some((p) => p.startsWith("edit="))
}

export function TinaProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setOpen] = React.useState(false)
  const data = React.useRef<FileMap>(new Map())

  const ensureLoaded = React.useCallback(async (filePath: string) => {
    if (data.current.has(filePath)) return
    // Pull file content via protected API
    const res = await fetch(`/api/edit/file?filePath=${encodeURIComponent(filePath)}`, {
      headers: {
        // CF Access cookies are sent automatically by the browser for protected routes.
      },
      cache: "no-store",
    })
    if (!res.ok) {
      data.current.set(filePath, {})
      return
    }
    const json = await res.json()
    try {
      const parsed = JSON.parse(json.content)
      data.current.set(filePath, parsed)
    } catch {
      data.current.set(filePath, {})
    }
  }, [])

  const getValue = React.useCallback((filePath: string, field: string) => {
    const obj = data.current.get(filePath) || {}
    return obj?.[field]
  }, [])

  const setValue = React.useCallback((filePath: string, field: string, value: unknown) => {
    const obj = data.current.get(filePath) || {}
    ;(obj as any)[field] = value
    data.current.set(filePath, obj)
  }, [])

  const toggle = React.useCallback(() => {
    if (!hasEditCookie()) return
    setOpen((v) => !v)
  }, [])

  const value: TinaCtx = {
    isOpen,
    toggle,
    setOpen,
    ensureLoaded,
    getValue,
    setValue,
    data: data.current,
  }

  return <TinaContext.Provider value={value}>{children}</TinaContext.Provider>
}

export function useTinaUI(): TinaCtx {
  const ctx = React.useContext(TinaContext)
  if (!ctx) throw new Error("useTinaUI must be used within <TinaProvider>")
  return ctx
}

/**
 * Minimal “sidebar” for visual feedback when toggled.
 * Consumers can mount this if they want a visible panel.
 */
export function TinaSidebar() {
  const { isOpen } = useTinaUI()
  if (!isOpen) return null
  return (
    <div className="fixed bottom-16 right-4 z-[9998] rounded-lg border bg-white shadow-lg p-3 text-sm">
      <div className="font-medium mb-1">Editor</div>
      <p className="text-muted-foreground">Redigeringsläge är aktiverat. Klicka på fälten för att uppdatera text.</p>
    </div>
  )
}

// (Optional) Example collection definition for reference:
export const tinaCollections = [
  {
    name: "home",
    label: "Home",
    path: "content",
    format: "json",
    fields: [
      { name: "heroTitle", label: "Hero Title", type: "string" },
      { name: "heroSubtitle", label: "Hero Subtitle", type: "string" },
      { name: "ctaText", label: "CTA Text", type: "string" },
    ],
  },
]
