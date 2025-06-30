"use client"

import type React from "react"

import Link from "next/link"
import Image from "next/image"

interface AboutClubProps {
  title: string
  paragraph1: string
  paragraph2: string
  passionText: string
  developmentText: string
  communityText: string
  button1Text: string
  button1Link: string
  button2Text: string
  button2Link: string
  imageSrc: string
  imageAlt: string
  totalTeamsCallout: number
  totalTeamsCalloutText: string
}

export function AboutClub({
  title,
  paragraph1,
  paragraph2,
  passionText,
  developmentText,
  communityText,
  button1Text,
  button1Link,
  button2Text,
  button2Link,
  imageSrc,
  imageAlt,
  totalTeamsCallout,
  totalTeamsCalloutText,
}: AboutClubProps) {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_500px]">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">{title}</h2>
              <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                {paragraph1}
              </p>
              <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                {paragraph2}
              </p>
            </div>
            <ul className="grid gap-2 py-4">
              <li>
                <CheckIcon className="mr-2 inline-block h-4 w-4" />
                {passionText}
              </li>
              <li>
                <CheckIcon className="mr-2 inline-block h-4 w-4" />
                {developmentText}
              </li>
              <li>
                <CheckIcon className="mr-2 inline-block h-4 w-4" />
                {communityText}
              </li>
            </ul>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link
                className="inline-flex h-10 items-center justify-center rounded-md bg-orange-500 px-8 text-sm font-medium text-white shadow transition-colors hover:bg-orange-600 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-orange-700 disabled:pointer-events-none disabled:opacity-50"
                href={button1Link}
              >
                {button1Text}
              </Link>
              <Link
                className="inline-flex h-10 items-center justify-center rounded-md border border-gray-200 bg-white px-8 text-sm font-medium shadow-sm transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-gray-300"
                href={button2Link}
              >
                {button2Text}
              </Link>
            </div>
          </div>
          <div className="relative group">
            <Image
              alt={imageAlt}
              className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last lg:aspect-square"
              height="500"
              src={imageSrc || "/placeholder.svg"}
              width="500"
              onContextMenu={(e) => e.preventDefault()} // Prevent right-click context menu
              onDragStart={(e) => e.preventDefault()} // Prevent dragging
              unoptimized // Use unoptimized for external images if you don't want Next.js Image optimization
            />
            <div className="absolute bottom-4 left-4 bg-white px-4 py-2 rounded-lg shadow-lg text-gray-900 dark:bg-gray-900 dark:text-gray-50">
              <span className="text-2xl font-bold">{totalTeamsCallout}</span> {totalTeamsCalloutText}
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
