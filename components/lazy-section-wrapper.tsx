"use client"

import type React from "react"
import { useRef, useEffect, useState } from "react"
import { cn } from "@/lib/utils" // Assuming cn utility is available

interface LazySectionWrapperProps {
  children: React.ReactNode
  delay?: number // Delay in milliseconds before the animation starts
  className?: string
}

export default function LazySectionWrapper({ children, delay = 0, className }: LazySectionWrapperProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Add a small delay before setting isVisible to true
          const timer = setTimeout(() => {
            setIsVisible(true)
          }, delay)
          observer.unobserve(entry.target) // Stop observing once visible
          return () => clearTimeout(timer)
        }
      },
      {
        root: null, // viewport
        rootMargin: "0px",
        threshold: 0.1, // Trigger when 10% of the section is visible
      },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
    }
  }, [delay])

  return (
    <div
      ref={sectionRef}
      className={cn(
        "transition-all duration-700 ease-out",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10",
        className,
      )}
    >
      {children}
    </div>
  )
}
