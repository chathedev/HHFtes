"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"

interface LazySectionWrapperProps {
  children: React.ReactNode
  delay?: number
  threshold?: number
}

export default function LazySectionWrapper({ children, delay = 0, threshold = 0.1 }: LazySectionWrapperProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [shouldRender, setShouldRender] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (entry.isIntersecting) {
          setShouldRender(true)
          setTimeout(() => {
            setIsVisible(true)
          }, delay)
          observer.disconnect()
        }
      },
      {
        threshold,
        rootMargin: "50px",
      },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      observer.disconnect()
    }
  }, [delay, threshold])

  return (
    <div
      ref={sectionRef}
      className={`transition-all duration-700 ease-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      {shouldRender ? children : <div className="h-64 bg-gray-100 animate-pulse rounded-lg" />}
    </div>
  )
}
