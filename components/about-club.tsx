"use client"

import type React from "react"

import Image from "next/image"
import Link from "next/link"
import type { PageContent } from "@/lib/content-store"

interface AboutClubProps {
  content: PageContent["aboutClub"]
  isEditing?: boolean
  onContentChange?: (field: keyof PageContent["aboutClub"], value: string | number) => void
  availablePages: { name: string; path: string }[]
}

export default function AboutClub({ content, isEditing = false, onContentChange, availablePages }: AboutClubProps) {
  const handleTextChange = (field: keyof PageContent["aboutClub"], e: React.ChangeEvent<HTMLDivElement>) => {
    if (onContentChange) {
      onContentChange(field, e.currentTarget.innerText)
    }
  }

  // Note: Link changes are handled by the dialog in HeroSection, not direct editing here.
  // If you want to make these links editable directly, you'd need a similar mechanism.

  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container grid items-center gap-6 px-4 md:grid-cols-2 md:gap-10 lg:gap-12">
        <div className="space-y-4">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            <span
              contentEditable={isEditing}
              suppressContentEditableWarning={true}
              onBlur={(e) => handleTextChange("title", e.currentTarget.innerText)}
              className="outline-none focus:ring-2 focus:ring-gray-300 rounded px-1"
            >
              {content.title}
            </span>
          </h2>
          <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
            <span
              contentEditable={isEditing}
              suppressContentEditableWarning={true}
              onBlur={(e) => handleTextChange("paragraph1", e.currentTarget.innerText)}
              className="outline-none focus:ring-2 focus:ring-gray-300 rounded px-1"
            >
              {content.paragraph1}
            </span>
          </p>
          <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
            <span
              contentEditable={isEditing}
              suppressContentEditableWarning={true}
              onBlur={(e) => handleTextChange("paragraph2", e.currentTarget.innerText)}
              className="outline-none focus:ring-2 focus:ring-gray-300 rounded px-1"
            >
              {content.paragraph2}
            </span>
          </p>
          <div className="grid gap-2">
            <div className="flex items-center gap-2">
              <CheckIcon className="h-5 w-5 text-green-500" />
              <span
                contentEditable={isEditing}
                suppressContentEditableWarning={true}
                onBlur={(e) => handleTextChange("passionText", e.currentTarget.innerText)}
                className="outline-none focus:ring-2 focus:ring-gray-300 rounded px-1"
              >
                {content.passionText}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <CheckIcon className="h-5 w-5 text-green-500" />
              <span
                contentEditable={isEditing}
                suppressContentEditableWarning={true}
                onBlur={(e) => handleTextChange("developmentText", e.currentTarget.innerText)}
                className="outline-none focus:ring-2 focus:ring-gray-300 rounded px-1"
              >
                {content.developmentText}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <CheckIcon className="h-5 w-5 text-green-500" />
              <span
                contentEditable={isEditing}
                suppressContentEditableWarning={true}
                onBlur={(e) => handleTextChange("communityText", e.currentTarget.innerText)}
                className="outline-none focus:ring-2 focus:ring-gray-300 rounded px-1"
              >
                {content.communityText}
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-2 min-[400px]:flex-row">
            <Link
              href={content.button1Link}
              className="inline-flex h-10 items-center justify-center rounded-md bg-green-600 px-8 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-green-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-green-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-green-500 dark:text-gray-900 dark:hover:bg-green-600 dark:focus-visible:ring-green-300"
            >
              <span
                contentEditable={isEditing}
                suppressContentEditableWarning={true}
                onBlur={(e) => handleTextChange("button1Text", e.currentTarget.innerText)}
                className="outline-none focus:ring-2 focus:ring-white rounded px-1"
              >
                {content.button1Text}
              </span>
            </Link>
            <Link
              href={content.button2Link}
              className="inline-flex h-10 items-center justify-center rounded-md border border-gray-200 bg-white px-8 text-sm font-medium shadow-sm transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-gray-300"
            >
              <span
                contentEditable={isEditing}
                suppressContentEditableWarning={true}
                onBlur={(e) => handleTextChange("button2Text", e.currentTarget.innerText)}
                className="outline-none focus:ring-2 focus:ring-gray-300 rounded px-1"
              >
                {content.button2Text}
              </span>
            </Link>
          </div>
        </div>
        <div className="relative h-[300px] w-full overflow-hidden rounded-xl md:h-[400px] lg:h-[500px]">
          <Image
            src={content.imageSrc || "/placeholder.svg"}
            alt={content.imageAlt}
            fill
            className="object-cover object-center"
            onContextMenu={(e) => e.preventDefault()}
            onDragStart={(e) => e.preventDefault()}
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <div className="text-center text-white">
              <div className="text-5xl font-bold">
                <span
                  contentEditable={isEditing}
                  suppressContentEditableWarning={true}
                  onBlur={(e) => handleTextChange("totalTeamsCallout", Number.parseInt(e.currentTarget.innerText) || 0)}
                  className="outline-none focus:ring-2 focus:ring-white rounded px-1"
                >
                  {content.totalTeamsCallout}
                </span>
              </div>
              <p className="text-lg">
                <span
                  contentEditable={isEditing}
                  suppressContentEditableWarning={true}
                  onBlur={(e) => handleTextChange("totalTeamsCalloutText", e.currentTarget.innerText)}
                  className="outline-none focus:ring-2 focus:ring-white rounded px-1"
                >
                  {content.totalTeamsCalloutText}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  )
}
