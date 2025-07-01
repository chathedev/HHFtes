"use client"

import { useEffect, useState } from "react"

/**
 * Primary hook – returns `true` when viewport width < 768 px (Tailwind md).
 */
export function useMobile(): boolean {
  const [isMobile, setIsMobile] = useState<boolean>(() =>
    typeof window === "undefined" ? false : window.innerWidth < 768,
  )

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 768)
    }
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return isMobile
}

/**
 * Alias kept for backwards compatibility with older imports.
 */
export const useIsMobile = useMobile
