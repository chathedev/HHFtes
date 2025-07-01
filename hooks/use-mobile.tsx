"use client"

import { useEffect, useState } from "react"

/**
 * Returns true when the viewport width is below the given breakpoint
 * (default = 768 px – Tailwind’s “md”).
 */
export function useMobile(breakpoint = 768): boolean {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < breakpoint) // Tailwind's 'md' breakpoint
    }

    checkMobile() // Check on initial render
    window.addEventListener("resize", checkMobile) // Add event listener for resize

    return () => {
      window.removeEventListener("resize", checkMobile) // Clean up on unmount
    }
  }, [breakpoint])

  return isMobile
}

/*  ──────────────────────────────────────────────────────────────────────────
    Some parts of the codebase import { useIsMobile } while others import
    { useMobile }.  Export both names to stay backward-compatible.
    ──────────────────────────────────────────────────────────────────────── */
export const useIsMobile = useMobile

export default useMobile
