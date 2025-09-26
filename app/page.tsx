"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { ArrowRight, Facebook, Instagram, Heart } from "lucide-react"
import { Header } from "@/components/header"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ErrorBoundary } from "@/components/error-boundary"
import { defaultContent } from "@/lib/default-content"
import type { FullContent, Partner } from "@/lib/content-types"

export default function HomePage() {
  const searchParams = useSearchParams()
  const isEditorMode = searchParams?.get("editor") === "true"

  const [content] = useState<FullContent>(defaultContent)

  const partnersForDisplay = useMemo(
    () => (Array.isArray(content.partners) ? content.partners.filter((partner) => partner.visibleInCarousel) : []),
    [content.partners],
  )

  const grannstadenPartner: Partner = {
    id: "grannstaden",
    src: "/grannstaden.svg",
    alt: "Grannstaden",
    tier: "Platinapartner",
    visibleInCarousel: true,
    linkUrl: "https://grannstaden.se/",
    benefits: [],
  }

  const marqueePartners = useMemo(() => [...partnersForDisplay, grannstadenPartner], [partnersForDisplay])

  const actionCards = [
    {
      title: "Se matcher och schema",
      body: "Följ våra seniormatcher och ungdomsturneringar under säsongen.",
      link: "https://www.profixio.com/app/tournaments?term=&filters[open_registration]=0&filters[kampoppsett]=0&filters[land_id]=se&filters[type]=seriespill&filters[idrett]=HB&filters[listingtype]=matches&filters[season]=765&dateTo=2026-04-30&klubbid=26031&dateFrom=2024-09-01",
      external: true,
    },
    {
      title: "Hitta ditt lag",
      body: "Från handbollsskolan till senior – hitta rätt lag och börja spela med oss.",
      link: "/lag",
      external: false,
    },
    {
      title: "Bli partner",
      body: "Samarbeta med Härnösands HF och stötta föreningen både på och utanför planen.",
      link: "/partners",
      external: false,
    },
  ]

  return (
    <ErrorBoundary>
      <div className="bg-white text-slate-900">
        <Header />
        <main>
          <section className="relative isolate overflow-hidden pt-28 pb-24">
            <div className="absolute inset-0">
              <Image
                src={content.hero.imageUrl || "/placeholder.svg"}
                alt="Härnösands HF i spel"
                fill
                priority
                quality={85}
                className="object-cover"
                {...(isEditorMode && {
                  "data-editable": "true",
                  "data-field-path": "home.hero.imageUrl",
                })}
              />
              <div className="absolute inset-0 bg-gradient-to-br from-slate-950/75 via-slate-900/70 to-green-900/60" />
            </div>

            <div className="relative mx-auto flex max-w-5xl flex-col items-center gap-10 px-6 text-center text-white">
              <span className="inline-flex items-center gap-3 rounded-full bg-white/10 px-6 py-2 text-xs font-semibold uppercase tracking-[0.35em] backdrop-blur">
                Härnösands HF
              </span>
              <div className="space-y-6">
                <h1
                  className="text-balance text-4xl font-black leading-tight sm:text-5xl md:text-6xl"
                  {...(isEditorMode && {
                    "data-editable": "true",
                    "data-field-path": "home.hero.title",
                  })}
                >
                  {content.hero.title}
                </h1>
                <p
                  className="mx-auto max-w-3xl text-lg text-white/80 md:text-xl"
                  {...(isEditorMode && {
                    "data-editable": "true",
                    "data-field-path": "home.hero.description",
                  })}
                >
                  {content.hero.description}
                </p>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row">
                <Button asChild className="min-w-[180px] bg-orange-500 px-8 py-6 text-base font-semibold text-white hover:bg-orange-600">
                  <Link href={content.hero.button1Link}>
                    {content.hero.button1Text}
                    <ArrowRight className="ml-3 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="min-w-[180px] border border-white/40 bg-white/10 px-8 py-6 text-base font-semibold text-white hover:bg-white/20"
                >
                  <Link href={content.hero.button2Link}>{content.hero.button2Text}</Link>
                </Button>
              </div>

              <div className="flex items-center gap-4 text-sm text-white/70">
                <span>Följ oss</span>
                <div className="flex gap-3">
                  <Link
                    href="https://www.facebook.com/profile.php?id=61566621756014"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-white/10 hover:bg-white/20"
                  >
                    <Facebook className="h-5 w-5" />
                  </Link>
                  <Link
                    href="https://www.instagram.com/harnosandshf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-white/10 hover:bg-white/20"
                  >
                    <Instagram className="h-5 w-5" />
                  </Link>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white py-16">
            <div className="mx-auto grid max-w-5xl gap-6 px-6 md:grid-cols-3">
              {actionCards.map((item) => (
                <Card key={item.title} className="flex h-full flex-col justify-between border border-slate-200 bg-white/90 p-6 shadow-sm">
                  <div className="space-y-3">
                    <h3 className="text-xl font-semibold text-slate-900">{item.title}</h3>
                    <p className="text-sm text-slate-600">{item.body}</p>
                  </div>
                  <Link
                    href={item.link}
                    target={item.external ? "_blank" : undefined}
                    rel={item.external ? "noopener noreferrer" : undefined}
                    className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-green-700 hover:text-green-800"
                  >
                    Läs mer
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Card>
              ))}
            </div>
          </section>

          <section className="bg-slate-50 py-20">
            <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 lg:flex-row lg:items-center">
              <div className="flex-1 space-y-6">
                <span className="inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-green-700">
                  Om klubben
                </span>
                <h2
                  className="text-3xl font-bold text-slate-900 md:text-4xl"
                  {...(isEditorMode && {
                    "data-editable": "true",
                    "data-field-path": "home.aboutClub.title",
                  })}
                >
                  {content.aboutClub.title}
                </h2>
                <p
                  className="text-base text-slate-600"
                  {...(isEditorMode && {
                    "data-editable": "true",
                    "data-field-path": "home.aboutClub.paragraph1",
                  })}
                >
                  {content.aboutClub.paragraph1}
                </p>
                <p
                  className="text-base text-slate-600"
                  {...(isEditorMode && {
                    "data-editable": "true",
                    "data-field-path": "home.aboutClub.paragraph2",
                  })}
                >
                  {content.aboutClub.paragraph2}
                </p>

                <div className="flex flex-col gap-4 sm:flex-row">
                  <Button asChild className="bg-green-600 px-6 py-6 text-base font-semibold text-white hover:bg-green-700">
                    <Link href={content.aboutClub.button1Link}>{content.aboutClub.button1Text}</Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="border border-green-200 bg-white px-6 py-6 text-base font-semibold text-green-700 hover:bg-green-50"
                  >
                    <Link href={content.aboutClub.button2Link}>{content.aboutClub.button2Text}</Link>
                  </Button>
                </div>
              </div>

              <div className="flex-1">
                <Card className="overflow-hidden border border-green-100 bg-white shadow-md">
                  <div className="relative h-80 w-full">
                    <Image
                      src={content.aboutClub.imageSrc || "/placeholder.svg"}
                      alt={content.aboutClub.imageAlt || "Härnösands HF"}
                      fill
                      className="object-cover"
                      loading="lazy"
                      placeholder="blur"
                      blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIW2P4z/D/PwAHggJ/lNqz1wAAAABJRU5ErkJggg=="
                      {...(isEditorMode && {
                        "data-editable": "true",
                        "data-field-path": "home.aboutClub.imageSrc",
                      })}
                    />
                  </div>
                  <div className="flex items-center justify-between bg-green-50 px-6 py-5">
                    <div className="flex items-center gap-3">
                      <Heart className="h-5 w-5 text-green-600" />
                      <p className="text-sm font-semibold text-green-800">{content.aboutClub.statLabel}</p>
                    </div>
                    <p className="text-3xl font-bold text-green-900">{content.aboutClub.statNumber}</p>
                  </div>
                </Card>
              </div>
            </div>
          </section>

          <section className="bg-white py-16">
            <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6">
              <div className="text-center">
                <span className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-orange-600">
                  Våra partners
                </span>
                <h2 className="mt-4 text-2xl font-bold text-slate-900 md:text-3xl">Tillsammans skapar vi handbollsglädje</h2>
                <p className="mt-3 text-sm text-slate-600">
                  Stort tack till alla företag och organisationer som möjliggör vår verksamhet.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {marqueePartners.map((partner) => (
                  <div
                    key={partner.id}
                    className="flex h-28 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 p-6"
                  >
                    <Image
                      src={partner.src}
                      alt={partner.alt}
                      width={180}
                      height={72}
                      className="h-full w-auto object-contain"
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="bg-gradient-to-br from-green-600 via-green-700 to-green-500 py-16">
            <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 px-6 text-center text-white">
              <h2 className="text-3xl font-bold md:text-4xl">Redo att bli en del av Härnösands HF?</h2>
              <p className="max-w-2xl text-base text-white/90">
                Vi välkomnar spelare, ledare, volontärer och supportrar. Hör av dig så hittar vi rätt roll för dig i
                föreningen.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Button asChild className="min-w-[180px] bg-white text-green-700 hover:bg-slate-100">
                  <Link href="/kontakt">Kontakta oss</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="min-w-[180px] border border-white/40 bg-transparent text-white hover:bg-white/10"
                >
                  <Link href="/lag">Utforska lagen</Link>
                </Button>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </ErrorBoundary>
  )
}
