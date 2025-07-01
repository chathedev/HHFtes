"use client"

import dynamic from "next/dynamic"
import type { Partner } from "@/lib/content-types" // Import Partner type

/**
 * Wrapper that lazy-loads the real PartnersCarousel on the client
 * (SSR disabled to avoid prerender errors).
 */
const PartnersCarousel = dynamic(() => import("@/components/partners-carousel"), {
  ssr: false,
  loading: () => <div className="py-16 bg-gray-50 text-center text-gray-600">Laddar partners…</div>,
})

interface PartnersCarouselClientProps {
  partners: Partner[]
}

export default function PartnersCarouselClient({ partners }: PartnersCarouselClientProps) {
  return <PartnersCarousel partners={partners} />
}
