"use client"

import PartnersCarousel from "@/components/partners-carousel"
import type { Partner } from "@/lib/content-types"

interface PartnersCarouselClientProps {
  partners: Partner[]
}

export default function PartnersCarouselClient({ partners }: PartnersCarouselClientProps) {
  return <PartnersCarousel partners={partners} />
}
