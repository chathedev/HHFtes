"use client"

import * as React from "react"
import { useTinaUI } from "@/tina/config"

type Props = {
  filePath: string // e.g. "content/home.json"
  field: string // e.g. "heroTitle"
  fallback?: string
  as?: "h1" | "h2" | "p" | "span" | "div"
  className?: string
}

function hasEditCookie() {
  if (typeof document === "undefined") return false
  return document.cookie.split("; ").some((p) => p.startsWith("edit="))
}

export function EditableField({ filePath, field, fallback = "", as = "span", className }: Props) {
  const Tag: any = as
  const { isOpen, getValue, setValue, ensureLoaded } = useTinaUI()
  const [enabled, setEnabled] = React.useState(false)
  const [value, setLocalValue] = React.useState<string>(fallback)

  React.useEffect(() => {
    setEnabled(hasEditCookie())
  }, [])

  React.useEffect(() => {
    if (!enabled) return
    ensureLoaded(filePath).then(() => {
      const v = getValue(filePath, field)
      if (typeof v === "string") setLocalValue(v)
    })
  }, [enabled, filePath, field, getValue, ensureLoaded])

  if (!enabled || !isOpen) {
    // Public view: just render text (no editing).
    return <Tag className={className}>{value}</Tag>
  }

  return (
    <label className={className} style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
      <input
        value={value}
        onChange={(e) => {
          const next = e.target.value
          setLocalValue(next)
          setValue(filePath, field, next)
        }}
        className="rounded-md border px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-black"
      />
      <span className="text-xs text-muted-foreground">({filePath} • {field})</span>
    </label>
  )
}
