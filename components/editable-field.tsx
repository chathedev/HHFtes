"use client"

import { useEffect, useMemo, useState } from "react"

type Props = {
  filePath: string // e.g., "content/home.json"
  field: string // e.g., "heroTitle"
  fallback?: string
  className?: string
}

/**
 * Renders static text for the public. When the edit cookie exists and the
 * “Edit” pill toggles on, this becomes an inline input bound to the file content.
 */
export function EditableField({ filePath, field, fallback = "", className }: Props) {
  const [hasEdit, setHasEdit] = useState(false)
  const [enabled, setEnabled] = useState(false)
  const [value, setValue] = useState<string | undefined>(undefined)

  useEffect(() => {
    setHasEdit(document.cookie.split("; ").some((c) => c.startsWith("edit=1")))
  }, [])

  useEffect(() => {
    const onToggle = () => setEnabled((v) => !v)
    window.addEventListener("tina:toggle", onToggle)
    return () => window.removeEventListener("tina:toggle", onToggle)
  }, [])

  useEffect(() => {
    if (!hasEdit) return
    fetch(`/${filePath}`, { cache: "no-store" })
      .then((r) => r.json())
      .then((json) => {
        const v = json?.[field]
        setValue(typeof v === "string" ? v : fallback)
      })
      .catch(() => setValue(fallback))
  }, [filePath, field, hasEdit, fallback])

  const display = useMemo(() => value ?? fallback, [value, fallback])

  if (!hasEdit || !enabled) {
    return <span className={className}>{display}</span>
  }

  return (
    <input
      value={display}
      onChange={(e) => setValue(e.target.value)}
      data-file-path={filePath}
      data-field={field}
      className={className || "rounded border px-2 py-1 text-sm outline-none ring-2 ring-offset-2 ring-amber-400"}
    />
  )
}
