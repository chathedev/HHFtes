import React from "react"
import { type Config } from "@measured/puck"
import Hero from "@/components/hero" // Reusing existing Hero component

// Define the props for our custom Puck components
interface RichTextProps {
  text: string
}

interface SectionProps {
  title: string
  body: string
}

// RichText Component for Puck
const RichText: React.FC<RichTextProps> = ({ text }) => {
  return <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: text }} />
}

// Section Component for Puck (a more structured text block)
const Section: React.FC<SectionProps> = ({ title, body }) => {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-6">{title}</h2>
        <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: body }} />
      </div>
    </section>
  )
}

// Puck Configuration
export const puckConfig: Config = {
  root: {
    render: ({ children }) => (
      <div className="min-h-screen bg-gray-50 text-gray-900">
        {children}
      </div>
    ),
    fields: {
      className: { type: "text" }, // Allow editing root class names
    },
  },
  components: {
    Hero: {
      render: Hero, // Use the existing Hero component
      fields: {
        imageUrl: { type: "text" },
        title: { type: "text" },
        description: { type: "textarea" },
        button1Text: { type: "text" },
        button1Link: { type: "text" },
        button2Text: { type: "text" },
        button2Link: { type: "text" },
      },
    },
    RichText: {
      render: RichText,
      fields: {
        text: { type: "richtext" },
      },
    },
    Section: {
      render: Section,
      fields: {
        title: { type: "text" },
        body: { type: "richtext" },
      },
    },
  },
};
