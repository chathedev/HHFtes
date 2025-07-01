"use client"

import dynamic from "next/dynamic"
import { allPartners } from "@/lib/partners-data"
import type { Partner } from "@/lib/content-types"

const PartnersCarousel = dynamic(() => import("@/components/partners-carousel"), {
  ssr: false,
})

interface Props {
  partners?: Partner[]
}

export default function PartnersCarouselClient({ partners }: Props) {
  return <PartnersCarousel partners={partners ?? allPartners} />
}
