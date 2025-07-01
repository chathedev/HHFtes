"use client"

import { useEffect, useState } from "react"

const BREAKPOINT = 768

export function useMobile(): boolean {
  const [isMobile, setIsMobile] = useState<boolean>(() =>
    typeof window === "undefined" ? false : window.innerWidth < BREAKPOINT,
  )

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < BREAKPOINT)
    window.addEventListener("resize", handler)
    return () => window.removeEventListener("resize", handler)
  }, [])

  return isMobile
}

export const useIsMobile = useMobile
