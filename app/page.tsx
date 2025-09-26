"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { ArrowRight, CalendarDays, Clock, MapPin, Users, Trophy, Sparkles, Heart } from "lucide-react"
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

  const heroMetrics = useMemo(
    () => [
      {
        label: "Lag i spel",
        value: content.stats.totalTeams,
        icon: Users,
      },
      {
        label: "A-lag",
        value: content.stats.aTeams,
        icon: Trophy,
      },
      {
        label: "Ungdomslag",
        value: content.stats.youthTeams,
        icon: Sparkles,
      },
    ],
    [content.stats.totalTeams, content.stats.aTeams, content.stats.youthTeams],
  )

  const highlightCards = [
    {
      title: "Upplev matcherna",
      body: "Se våra kommande matcher, följ resultaten och planera nästa hemmakväll på Högslätten.",
      link: "https://www.profixio.com/app/tournaments?term=&filters[open_registration]=0&filters[kampoppsett]=0&filters[land_id]=se&filters[type]=seriespill&filters[idrett]=HB&filters[listingtype]=matches&filters[season]=765&dateTo=2026-04-30&klubbid=26031&dateFrom=2024-09-01",
      linkLabel: "Se spelschemat",
    },
    {
      title: "Bli en del av klubben",
      body: "Vi välkomnar nya spelare, ledare och ideella krafter. Hör av dig så guidar vi dig rätt.",
      link: "/kontakt",
      linkLabel: "Kontakta oss",
    },
    {
      title: "23 lag – ett HHF",
      body: "Upptäck alla våra lag från handbollsskolan till senior. Hitta ditt lag och häng med!",
      link: "/lag",
      linkLabel: "Utforska lagen",
    },
  ]

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

  const featuredMatch = {
    opponent: "Täby HBK",
    competition: "Division 2 Norra",
    date: "26 januari 2025",
    time: "16:00",
    location: "Högslättens Sporthall",
    infoUrl: "/kop-biljett",
  }

  return (
    <ErrorBoundary>
      <div className="bg-slate-50 text-slate-900">
        <Header />
        <main>
          <section className="relative isolate overflow-hidden bg-white pt-28 pb-20">
            <div className="absolute inset-0">
              <Image
                src={content.hero.imageUrl || "/placeholder.svg"}
                alt="Härnösands HF i spel"
                fill
                priority
                quality={85}
                className="object-cover opacity-20"
                {...(isEditorMode && {
                  "data-editable": "true",
                  "data-field-path": "home.hero.imageUrl",
                })}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-white via-white/90 to-white" />
            </div>

            <div className="relative mx-auto flex max-w-6xl flex-col gap-16 px-6 lg:flex-row lg:items-center">
              <div className="flex-1 space-y-8">
                <span className="inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-green-700">
                  Härnösands HF
                </span>

                <div className="space-y-6">
                  <h1
                    className="text-4xl font-black leading-tight text-slate-900 sm:text-5xl md:text-6xl"
                    {...(isEditorMode && {
                      "data-editable": "true",
                      "data-field-path": "home.hero.title",
                    })}
                  >
                    {content.hero.title}
                  </h1>
                  <p
                    className="max-w-2xl text-lg text-slate-600 md:text-xl"
                    {...(isEditorMode && {
                      "data-editable": "true",
                      "data-field-path": "home.hero.description",
                    })}
                  >
                    {content.hero.description}
                  </p>
                </div>

                <div className="flex flex-col gap-4 sm:flex-row">
                  <Button asChild className="bg-green-600 px-6 py-6 text-base font-semibold text-white hover:bg-green-700">
                    <Link href={content.hero.button1Link}>
                      {content.hero.button1Text}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="border border-slate-200 bg-white px-6 py-6 text-base font-semibold text-slate-900 hover:bg-slate-100"
                  >
                    <Link href={content.hero.button2Link}>{content.hero.button2Text}</Link>
                  </Button>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {heroMetrics.map(({ label, value, icon: Icon }) => (
                    <Card key={label} className="border border-slate-200 bg-white/80 p-5">
                      <div className="flex items-center gap-3">
                        <Icon className="h-6 w-6 text-green-600" />
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{label}</p>
                      </div>
                      <p className="mt-3 text-3xl font-bold text-slate-900">{value}</p>
                    </Card>
                  ))}
                </div>
              </div>

              <Card className="w-full max-w-sm border border-slate-200 bg-white p-8 shadow-md">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-green-700">Nästa match</p>
                <h2 className="mt-4 text-2xl font-bold text-slate-900">Härnösands HF vs {featuredMatch.opponent}</h2>
                <p className="mt-2 text-sm text-slate-500">{featuredMatch.competition}</p>

                <div className="mt-6 space-y-3 text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-green-600" />
                    <span>{featuredMatch.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-green-600" />
                    <span>{featuredMatch.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-green-600" />
                    <span>{featuredMatch.location}</span>
                  </div>
                </div>

                <Button asChild className="mt-6 w-full bg-orange-500 text-white hover:bg-orange-600">
                  <Link href={featuredMatch.infoUrl}>Köp biljett</Link>
                </Button>
                <p className="mt-4 text-xs text-slate-500">
                  Volontärer och matchvärdar behövs – anmäl intresse när du säkrar din plats!
                </p>
              </Card>
            </div>
          </section>

          <section className="bg-slate-50 py-16">
            <div className="mx-auto grid max-w-6xl gap-6 px-6 md:grid-cols-3">
              {highlightCards.map((item) => (
                <Card key={item.title} className="flex h-full flex-col border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="text-xl font-semibold text-slate-900">{item.title}</h3>
                  <p className="mt-3 text-sm text-slate-600">{item.body}</p>
                  <Link
                    href={item.link}
                    target={item.link.startsWith("http") ? "_blank" : undefined}
                    rel={item.link.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-green-700 hover:text-green-800"
                  >
                    {item.linkLabel}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Card>
              ))}
            </div>
          </section>

          <section className="bg-white py-20">
            <div className="mx-auto flex max-w-6xl flex-col gap-12 px-6 lg:flex-row lg:items-center">
              <div className="flex-1 space-y-6">
                <span className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-orange-600">
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
                    className="border border-slate-200 bg-white px-6 py-6 text-base font-semibold text-slate-900 hover:bg-slate-100"
                  >
                    <Link href={content.aboutClub.button2Link}>{content.aboutClub.button2Text}</Link>
                  </Button>
                </div>
              </div>

              <div className="flex-1">
                <Card className="overflow-hidden border border-slate-200 bg-slate-100">
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
                  <div className="flex items-center justify-between bg-white px-6 py-5">
                    <div className="flex items-center gap-3">
                      <Heart className="h-5 w-5 text-orange-500" />
                      <p className="text-sm font-semibold text-slate-700">{content.aboutClub.statLabel}</p>
                    </div>
                    <p className="text-3xl font-bold text-slate-900">{content.aboutClub.statNumber}</p>
                  </div>
                </Card>
              </div>
            </div>
          </section>

          <section className="bg-slate-50 py-16">
            <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6">
              <div className="flex flex-col gap-3 text-center">
                <span className="mx-auto inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-green-700">
                  Våra partners
                </span>
                <h2 className="text-2xl font-bold text-slate-900 md:text-3xl">Tillsammans gör vi handbollen starkare</h2>
                <p className="mx-auto max-w-2xl text-sm text-slate-600">
                  Tack till alla företag och organisationer som stöttar Härnösands HF och hjälper ungdomar och seniorer
                  att utvecklas.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {marqueePartners.map((partner) => (
                  <div
                    key={partner.id}
                    className="flex h-28 items-center justify-center rounded-2xl border border-slate-200 bg-white p-6"
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

          <section className="bg-white py-20">
            <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 px-6 text-center">
              <span className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-orange-600">
                Bli en del av laget
              </span>
              <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">Vi bygger framtidens HHF – häng på!</h2>
              <p className="max-w-2xl text-base text-slate-600">
                Oavsett om du vill spela, bidra som ledare eller stötta från läktaren finns det en plats för dig i
                föreningen. Hör av dig så berättar vi mer.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Button asChild className="min-w-[180px] bg-green-600 px-6 py-6 text-base font-semibold text-white hover:bg-green-700">
                  <Link href="/kontakt">Kontakta oss</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="min-w-[180px] border border-slate-200 bg-white px-6 py-6 text-base font-semibold text-slate-900 hover:bg-slate-100"
                >
                  <Link href="/lag">Se alla lag</Link>
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
