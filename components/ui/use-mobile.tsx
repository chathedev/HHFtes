"use client"

import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(false)

  React.useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT) // Tailwind's 'md' breakpoint is 768px
    }

    checkIsMobile() // Check on mount
    window.addEventListener("resize", checkIsMobile) // Add event listener for resize

    return () => {
      window.removeEventListener("resize", checkIsMobile) // Clean up
    }
  }, [])

  return isMobile
}
