"use client"

import * as React from "react"
import { useTinaUI } from "@/tina/config"
import { cn } from "@/lib/utils"

function hasEditCookie() {
  if (typeof document === "undefined") return false
  return document.cookie.split("; ").some((p) => p.startsWith("edit="))
}

export function EditGate({
  className,
  label = "Edit",
}: {
  className?: string
  label?: string
}) {
  const { toggle, isOpen } = useTinaUI()
  const [canEdit, setCanEdit] = React.useState(false)

  React.useEffect(() => {
    setCanEdit(hasEditCookie())
  }, [])

  if (!canEdit) return null

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={isOpen}
      className={cn(
        "fixed bottom-4 right-4 z-[9999] rounded-full bg-black/90 text-white text-sm px-4 py-2 shadow-lg",
        "hover:bg-black transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-black",
        className
      )}
    >
      {label}
    </button>
  )
}
