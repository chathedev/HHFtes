"use client"

import { useEffect, useState } from "react"

function hasEditCookie() {
  if (typeof document === "undefined") return false
  return document.cookie.split("; ").some((p) => p.startsWith("edit=1"))
}

/**
 * EditGate renders a small floating pill when the edit=1 cookie is present.
 * Clicking it toggles the inline editing sidebar via a custom event.
 * IMPORTANT: You must manually mount this component (e.g., in app/layout) where desired.
 */
export function EditGate() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setVisible(hasEditCookie())
  }, [])

  if (!visible) return null

  return (
    <button
      type="button"
      onClick={() => {
        window.dispatchEvent(new Event("tina:toggle"))
      }}
      className="fixed bottom-4 right-4 z-[9999] rounded-full bg-black text-white px-4 py-2 text-xs shadow-lg hover:opacity-90"
      aria-label="Toggle edit sidebar"
    >
      Edit
    </button>
  )
}
