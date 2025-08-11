"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"

interface LazyImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  fill?: boolean
  className?: string
  priority?: boolean
  sizes?: string
  style?: React.CSSProperties
}

export default function LazyImage({
  src,
  alt,
  width,
  height,
  fill = false,
  className = "",
  priority = false,
  sizes,
  style,
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [shouldLoad, setShouldLoad] = useState(priority) // Load immediately if priority
  const imgRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (priority) return // Don't set up intersection observer for priority images

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (entry.isIntersecting) {
          setShouldLoad(true)
          observer.disconnect()
        }
      },
      {
        rootMargin: "50px", // Start loading 50px before the image comes into view
      },
    )

    if (imgRef.current) {
      observer.observe(imgRef.current)
    }

    return () => {
      observer.disconnect()
    }
  }, [priority])

  return (
    <div ref={imgRef} className={`relative ${className}`} style={style}>
      {shouldLoad ? (
        <>
          {/* Placeholder while loading */}
          {!isLoaded && (
            <div
              className={`absolute inset-0 bg-gray-200 animate-pulse rounded ${fill ? "w-full h-full" : ""}`}
              style={fill ? {} : { width: width || "auto", height: height || "auto" }}
            />
          )}
          <Image
            src={src || "/placeholder.svg"}
            alt={alt}
            width={fill ? undefined : width}
            height={fill ? undefined : height}
            fill={fill}
            sizes={sizes}
            className={`transition-opacity duration-300 ${isLoaded ? "opacity-100" : "opacity-0"} ${className}`}
            onLoad={() => setIsLoaded(true)}
            priority={priority}
          />
        </>
      ) : (
        // Show placeholder until intersection
        <div
          className={`bg-gray-200 animate-pulse rounded ${fill ? "w-full h-full" : ""}`}
          style={fill ? {} : { width: width || "auto", height: height || "auto" }}
        />
      )}
    </div>
  )
}
