"use client"

import { useEffect, useState } from "react"

/**
 * Simple hook that returns `true` if the viewport width is below the given breakpoint
 * (default = 768 px, i.e. “md” in Tailwind).
 * It re-evaluates on resize and is SSR-safe (returns `false` on the server).
 */
export function useMobile(breakpoint = 768): boolean {
  // During SSR we don’t have `window`, so start with `false`
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < breakpoint)
    check() // run once on mount
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [breakpoint])

  return isMobile
}

export default useMobile
