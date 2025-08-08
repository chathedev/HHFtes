'use client'

import { useEffect, useMemo, useState } from 'react'

type Props = {
  filePath: string // e.g. content/home.json
  field: string // e.g. heroTitle
  fallback?: string
  className?: string
}

/**
 * Inline-editable field bound to JSON file content.
 * - When cookie edit=1 is absent, renders static text (fallback).
 * - When present and "tina sidebar" is toggled, renders an input and keeps local state.
 * - This component only edits client-side; publishing is done via /api/edit/commit.
 */
export function EditableField({ filePath, field, fallback, className }: Props) {
  const [hasEdit, setHasEdit] = useState(false)
  const [enabled, setEnabled] = useState(false)
  const [value, setValue] = useState<string | undefined>(undefined)

  // read initial content
  useEffect(() => {
    const present = document.cookie.split('; ').some((c) => c.startsWith('edit=1'))
    setHasEdit(present)
  }, [])

  useEffect(() => {
    const onToggle = () => setEnabled((v) => !v)
    window.addEventListener('tina:toggle', onToggle)
    return () => window.removeEventListener('tina:toggle', onToggle)
  }, [])

  useEffect(() => {
    // fetch JSON only when editing
    if (!hasEdit) return
    fetch(`/${filePath}`, { cache: 'no-store' })
      .then((r) => r.json())
      .then((json) => {
        const v = json?.[field]
        if (typeof v === 'string') setValue(v)
        else if (fallback !== undefined) setValue(fallback)
      })
      .catch(() => {
        if (fallback !== undefined) setValue(fallback)
      })
  }, [filePath, field, hasEdit, fallback])

  const display = useMemo(() => value ?? fallback ?? '', [value, fallback])

  if (!hasEdit || !enabled) {
    return <span className={className}>{display}</span>
  }

  return (
    <input
      value={display}
      onChange={(e) => setValue(e.target.value)}
      className={
        className ??
        'rounded border px-2 py-1 text-sm outline-none ring-2 ring-offset-2 ring-amber-400'
      }
      data-file-path={filePath}
      data-field={field}
    />
  )
}
