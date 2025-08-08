"use client"

import { Puck } from "@measured/puck"
import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

// Hero Component
const Hero = ({ title, subtitle, backgroundImage, primaryButtonText, primaryButtonLink, secondaryButtonText, secondaryButtonLink }: {
  title: string
  subtitle: string
  backgroundImage: string
  primaryButtonText: string
  primaryButtonLink: string
  secondaryButtonText: string
  secondaryButtonLink: string
}) => (
  <section className="relative w-full h-screen flex items-center justify-center overflow-hidden">
    <Image
      src={backgroundImage || "/placeholder.svg"}
      alt="Hero Background"
      fill
      quality={90}
      priority
      className="object-cover z-0"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent z-10" />
    <div className="relative z-20 text-white text-center px-4 max-w-5xl mx-auto">
      <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold mb-4 leading-tight tracking-tight text-shadow-outline">
        {title.split(" ")[0]}{" "}
        <span className="text-orange-400">{title.split(" ").slice(1).join(" ")}</span>
      </h1>
      <p className="text-lg sm:text-xl md:text-2xl mb-10 max-w-3xl mx-auto text-shadow-md">
        {subtitle}
      </p>
      <div className="flex flex-col sm:flex-row justify-center gap-6">
        <Button
          asChild
          className="bg-orange-500 hover:bg-orange-600 text-white px-10 py-4 rounded-full text-lg font-semibold shadow-lg transition-transform duration-300 hover:scale-105"
        >
          <Link href={primaryButtonLink}>
            {primaryButtonText}
            <ArrowRight className="ml-3 h-5 w-5" />
          </Link>
        </Button>
        <Button
          asChild
          className="bg-green-700 hover:bg-green-800 text-white px-10 py-4 rounded-full text-lg font-semibold shadow-lg transition-transform duration-300 hover:scale-105"
        >
          <Link href={secondaryButtonLink}>{secondaryButtonText}</Link>
        </Button>
      </div>
    </div>
  </section>
)

// Section Component
const Section = ({ title, content, backgroundColor = "bg-white" }: {
  title: string
  content: string
  backgroundColor?: string
}) => (
  <section className={`py-16 ${backgroundColor}`}>
    <div className="container mx-auto px-4 max-w-4xl">
      <h2 className="text-4xl font-bold text-green-600 mb-6 text-center">{title}</h2>
      <p className="text-lg text-gray-700 text-center max-w-3xl mx-auto">{content}</p>
    </div>
  </section>
)

// RichText Component
const RichText = ({ content }: { content: string }) => (
  <div className="py-8">
    <div className="container mx-auto px-4 max-w-4xl">
      <div 
        className="prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  </div>
)

// Puck configuration
const config = {
  components: {
    Hero: {
      render: Hero,
      fields: {
        title: { type: "text" as const },
        subtitle: { type: "textarea" as const },
        backgroundImage: { type: "text" as const },
        primaryButtonText: { type: "text" as const },
        primaryButtonLink: { type: "text" as const },
        secondaryButtonText: { type: "text" as const },
        secondaryButtonLink: { type: "text" as const },
      },
      defaultProps: {
        title: "Your Title Here",
        subtitle: "Your subtitle here",
        backgroundImage: "/placeholder.svg",
        primaryButtonText: "Primary Action",
        primaryButtonLink: "/",
        secondaryButtonText: "Secondary Action",
        secondaryButtonLink: "/",
      },
    },
    Section: {
      render: Section,
      fields: {
        title: { type: "text" as const },
        content: { type: "textarea" as const },
        backgroundColor: {
          type: "select" as const,
          options: [
            { label: "White", value: "bg-white" },
            { label: "Gray 50", value: "bg-gray-50" },
            { label: "Gray 100", value: "bg-gray-100" },
            { label: "Green 50", value: "bg-green-50" },
            { label: "Orange 50", value: "bg-orange-50" },
          ],
        },
      },
      defaultProps: {
        title: "Section Title",
        content: "Section content goes here.",
        backgroundColor: "bg-white",
      },
    },
    RichText: {
      render: RichText,
      fields: {
        content: { type: "textarea" as const },
      },
      defaultProps: {
        content: "<p>Rich text content goes here.</p>",
      },
    },
  },
}

export default function EditorPage() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load initial data from content/home.json
    fetch('/api/edit/load')
      .then(res => res.json())
      .then(initialData => {
        setData(initialData)
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to load initial data:', err)
        // Fallback to empty data
        setData({
          content: [],
          root: { props: { title: "Härnösands HF - Hem" } }
        })
        setLoading(false)
      })
  }, [])

  const handlePublish = async (data: any) => {
    try {
      const response = await fetch('/api/edit/commit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Failed to publish changes')
      }

      alert('Changes published successfully!')
    } catch (error) {
      console.error('Publish error:', error)
      alert('Failed to publish changes. Please try again.')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-gray-600">Loading editor...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto">
        <Puck
          config={config}
          data={data}
          onPublish={handlePublish}
        />
      </div>
    </div>
  )
}