"use client"

import dynamic from "next/dynamic"
import { allPartners } from "@/lib/partners-data"
import type { Partner } from "@/lib/content-types"

const PartnersCarousel = dynamic(() => import("@/components/partners-carousel"), {
  ssr: false,
  loading: () => <div className="py-16 bg-gray-50 text-center text-gray-600">Laddar partners…</div>,
})

interface Props {
  partners?: Partner[]
}

export default function PartnersCarouselClient({ partners }: Props) {
  // Ensure partners is always an array, falling back to allPartners if undefined or null
  return <PartnersCarousel partners={partners ?? allPartners} />
}
