"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  ArrowRight,
  CalendarDays,
  Clock,
  MapPin,
  Sparkles,
  Users,
  Trophy,
  Flame,
  BarChart3,
  Shield,
  Handshake,
  Ticket,
  Megaphone,
} from "lucide-react"
import { Header } from "@/components/header"
import Footer from "@/components/footer"
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

  const heroTitleWords = content.hero.title.trim().split(/\s+/)
  const heroTitleHighlight = heroTitleWords.length > 1 ? heroTitleWords.pop() ?? "" : heroTitleWords[0] ?? ""
  const heroTitlePrefix = heroTitleWords.join(" ")

  const heroMetrics = useMemo(
    () => [
      {
        label: "Lag i spel",
        value: content.stats.totalTeams,
        description: "Från yngsta bollskolan till seniorerna.",
        icon: Users,
      },
      {
        label: "A-lag",
        value: content.stats.aTeams,
        description: "Våra dam- och herrlag i tävlingsspel.",
        icon: Trophy,
      },
      {
        label: "Ungdomslag",
        value: content.stats.youthTeams,
        description: "Utveckling i varje åldersgrupp.",
        icon: Sparkles,
      },
      {
        label: "År av historia",
        value: content.stats.yearsHistory,
        description: "En förening byggd på tradition.",
        icon: Shield,
      },
    ],
    [content.stats.totalTeams, content.stats.aTeams, content.stats.youthTeams, content.stats.yearsHistory],
  )

  const clubPillars = useMemo(
    () => [
      {
        title: "Passion",
        body: content.aboutClub.passionText,
        icon: Flame,
      },
      {
        title: "Utveckling",
        body: content.aboutClub.developmentText,
        icon: BarChart3,
      },
      {
        title: "Gemenskap",
        body: content.aboutClub.communityText,
        icon: Handshake,
      },
    ],
    [content.aboutClub.passionText, content.aboutClub.developmentText, content.aboutClub.communityText],
  )

  const developmentTracks = [
    {
      title: "Ungdom & Akademi",
      description:
        "Individuellt fokus, skickliga ledare och träningsmiljöer där nästa generations profiler formas.",
      takeaways: ["Färdighetsgrupper", "Mentorskap från elitspelare", "Tävlingar i region norr"],
    },
    {
      title: "Junior till A-lag",
      description:
        "En tydlig väg från ungdomslag till seniortrupp med fysiska program och matchmiljöer anpassade efter nivå.",
      takeaways: ["Prestationsanalys", "Fystester", "Taktik- och analyskvällar"],
    },
    {
      title: "Supporter & ideell kraft",
      description:
        "Matchvärdar, funktionärer och engagerade supportrar skapar den unika atmosfären i Högslätten.",
      takeaways: ["Supporterklubb", "Eventteam", "Frivilligpool"],
    },
  ]

  const weeklyAgenda = [
    {
      day: "Tisdag",
      label: "Teknikpass U13",
      detail: "Högslättens Sporthall • 17:30",
    },
    {
      day: "Torsdag",
      label: "A-lag Dam – Förberedelse",
      detail: "Videogenomgång & matchplanering",
    },
    {
      day: "Lördag",
      label: "Matchdag – Herrar",
      detail: "Avkast 16:00 • Div 2 Norra",
    },
    {
      day: "Söndag",
      label: "Handbollsskolan",
      detail: "Öppet för alla 7–9 år • 10:00",
    },
  ]

  const newsHighlights = [
    {
      tag: "A-lag Herr",
      title: "Spelidé och tempo gav ny seger på hemmaplan",
      excerpt: "Härnösands HF fortsätter segersviten efter starkt försvarsspel och snabba omställningar.",
      link: "/nyheter",
    },
    {
      tag: "Ungdom",
      title: "F14 säkrade plats i steg 4 av USM",
      excerpt: "En helg med fullt tryck på läktaren och tekniskt övertygande handboll av våra F14-spelare.",
      link: "/nyheter",
    },
    {
      tag: "Klubben",
      title: "Nya samarbeten stärker föreningens framtid",
      excerpt: "Fler partners ansluter för att stötta satsningen på ungdomsverksamheten och event.",
      link: "/nyheter",
    },
  ]

  const featuredMatch = {
    opponent: "Täby HBK",
    competition: "Division 2 Norra",
    date: "26 januari 2025",
    time: "16:00",
    location: "Högslättens Sporthall",
    infoUrl: "/kop-biljett",
  }

  const highlightedPartner = marqueePartners.find((partner) => partner.tier === "Diamantpartner") ?? marqueePartners[0]

  return (
    <ErrorBoundary>
      <div className="bg-slate-950 text-white">
        <Header />
        <main className="relative">
          <section className="relative isolate overflow-hidden pt-28 pb-24 md:pb-32">
            <div className="absolute inset-0">
              <Image
                src={content.hero.imageUrl || "/placeholder.svg"}
                alt="Härnösands HF i spel"
                fill
                priority
                quality={85}
                className="object-cover opacity-40"
                {...(isEditorMode && {
                  "data-editable": "true",
                  "data-field-path": "home.hero.imageUrl",
                })}
              />
              <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-950/90 to-green-950/70" />
              <div className="absolute -left-24 -top-32 h-96 w-96 rounded-full bg-orange-500/20 blur-3xl" />
              <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-green-500/20 blur-3xl" />
            </div>

            <div className="relative mx-auto flex max-w-6xl flex-col gap-12 px-6 lg:flex-row">
              <div className="flex flex-1 flex-col gap-8">
                <span className="inline-flex w-fit items-center gap-2 rounded-full bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-green-200/80 backdrop-blur">
                  <Sparkles className="h-3.5 w-3.5" />
                  Härnösands HF
                </span>

                <div>
                  <h1
                    className="text-balance text-4xl font-black leading-tight text-white sm:text-5xl md:text-6xl xl:text-7xl"
                    {...(isEditorMode && {
                      "data-editable": "true",
                      "data-field-path": "home.hero.title",
                    })}
                  >
                    {heroTitlePrefix ? (
                      <>
                        <span>{heroTitlePrefix}</span>{" "}
                        <span className="text-orange-400" data-title-highlight="true">
                          {heroTitleHighlight}
                        </span>
                      </>
                    ) : (
                      <span className="text-orange-400" data-title-highlight="true">
                        {heroTitleHighlight}
                      </span>
                    )}
                  </h1>
                  <p
                    className="mt-6 max-w-2xl text-lg text-slate-200 md:text-xl"
                    {...(isEditorMode && {
                      "data-editable": "true",
                      "data-field-path": "home.hero.description",
                    })}
                  >
                    {content.hero.description}
                  </p>
                </div>

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <Button
                    asChild
                    className="group flex-1 bg-orange-500 px-8 py-6 text-base font-semibold transition hover:bg-orange-600"
                  >
                    <Link href={content.hero.button1Link}>
                      <span
                        {...(isEditorMode && {
                          "data-editable": "true",
                          "data-field-path": "home.hero.button1Text",
                        })}
                      >
                        {content.hero.button1Text}
                      </span>
                      <ArrowRight className="ml-3 inline h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="flex-1 border border-white/30 bg-white/5 px-8 py-6 text-base font-semibold text-white transition hover:bg-white/15"
                  >
                    <Link href={content.hero.button2Link}>
                      <span
                        {...(isEditorMode && {
                          "data-editable": "true",
                          "data-field-path": "home.hero.button2Text",
                        })}
                      >
                        {content.hero.button2Text}
                      </span>
                    </Link>
                  </Button>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  {heroMetrics.map(({ label, value, description, icon: Icon }) => (
                    <div
                      key={label}
                      className="group rounded-2xl border border-white/10 bg-white/5 p-5 shadow-lg shadow-black/20 transition hover:border-orange-400/50 hover:bg-white/10"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm uppercase tracking-wide text-slate-300">{label}</span>
                        <Icon className="h-5 w-5 text-orange-300" />
                      </div>
                      <p className="mt-4 text-4xl font-black text-white">{value}</p>
                      <p className="mt-2 text-sm text-slate-300">{description}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex w-full max-w-md flex-col gap-6">
                <Card className="space-y-6 border border-white/10 bg-white/10 p-6 text-white shadow-lg">
                  <div className="flex items-center justify-between text-sm uppercase tracking-[0.2em] text-green-200">
                    <span>Kommande match</span>
                    <CalendarDays className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.25em] text-slate-300">{featuredMatch.competition}</p>
                    <h2 className="mt-2 text-3xl font-black text-white">Härnösands HF vs {featuredMatch.opponent}</h2>
                  </div>
                  <div className="space-y-3 text-sm text-slate-200">
                    <div className="flex items-center gap-3">
                      <CalendarDays className="h-4 w-4 text-orange-300" />
                      <span>{featuredMatch.date}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="h-4 w-4 text-orange-300" />
                      <span>{featuredMatch.time}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="h-4 w-4 text-orange-300" />
                      <span>{featuredMatch.location}</span>
                    </div>
                  </div>
                  <Button
                    asChild
                    className="w-full bg-white text-slate-950 hover:bg-slate-100"
                  >
                    <Link href={featuredMatch.infoUrl}>
                      Köp biljett
                      <Ticket className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <p className="text-xs text-slate-300">
                    Matchvärdar och volontärer behövs – anmäl dig när du säkrar din plats!
                  </p>
                </Card>
                <Card className="space-y-4 border border-white/5 bg-slate-900/70 p-6 text-slate-200">
                  <div className="flex items-center gap-3">
                    <Megaphone className="h-5 w-5 text-orange-400" />
                    <span className="text-sm font-semibold uppercase tracking-[0.2em] text-white">
                      Veckans fokus
                    </span>
                  </div>
                  <ul className="space-y-3 text-sm">
                    {weeklyAgenda.map((item) => (
                      <li key={item.day} className="rounded-xl border border-white/10 bg-white/5 p-3">
                        <p className="text-xs uppercase tracking-[0.25em] text-green-200">{item.day}</p>
                        <p className="font-semibold text-white">{item.label}</p>
                        <p className="text-xs text-slate-300">{item.detail}</p>
                      </li>
                    ))}
                  </ul>
                </Card>
              </div>
            </div>
          </section>

          <section className="relative overflow-hidden bg-slate-900 py-20">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.08),_transparent_60%)]" />
            <div className="relative mx-auto grid max-w-6xl gap-12 px-6 lg:grid-cols-[1.15fr,0.85fr] lg:items-center">
              <div className="space-y-6">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-green-200/80">
                  Klubbens DNA
                </span>
                <h2
                  className="text-balance text-3xl font-black text-white md:text-5xl"
                  {...(isEditorMode && {
                    "data-editable": "true",
                    "data-field-path": "home.aboutClub.title",
                  })}
                >
                  {content.aboutClub.title}
                </h2>
                <p
                  className="text-lg text-slate-200"
                  {...(isEditorMode && {
                    "data-editable": "true",
                    "data-field-path": "home.aboutClub.paragraph1",
                  })}
                >
                  {content.aboutClub.paragraph1}
                </p>
                <p
                  className="text-lg text-slate-200"
                  {...(isEditorMode && {
                    "data-editable": "true",
                    "data-field-path": "home.aboutClub.paragraph2",
                  })}
                >
                  {content.aboutClub.paragraph2}
                </p>

                <div className="grid gap-4 md:grid-cols-3">
                  {clubPillars.map(({ title, body, icon: Icon }) => (
                    <div key={title} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                      <Icon className="h-6 w-6 text-orange-300" />
                      <h3 className="mt-4 text-lg font-semibold text-white">{title}</h3>
                      <p className="mt-2 text-sm text-slate-300">{body}</p>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col gap-4 sm:flex-row">
                  <Button
                    asChild
                    className="bg-orange-500 px-6 py-6 text-base font-semibold hover:bg-orange-600"
                  >
                    <Link href={content.aboutClub.button1Link}>
                      {content.aboutClub.button1Text}
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="border border-white/20 bg-white/5 px-6 py-6 text-base font-semibold text-white hover:bg-white/10"
                  >
                    <Link href={content.aboutClub.button2Link}>
                      {content.aboutClub.button2Text}
                    </Link>
                  </Button>
                </div>
              </div>

              <div className="relative hidden overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-2xl shadow-black/30 lg:block">
                <Image
                  src={content.aboutClub.imageSrc || "/placeholder.svg"}
                  alt={content.aboutClub.imageAlt || "Härnösands HF"}
                  width={720}
                  height={900}
                  className="h-full w-full object-cover"
                  loading="lazy"
                  placeholder="blur"
                  blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIW2P4z/D/PwAHggJ/lNqz1wAAAABJRU5ErkJggg=="
                  {...(isEditorMode && {
                    "data-editable": "true",
                    "data-field-path": "home.aboutClub.imageSrc",
                  })}
                />
                <div className="absolute bottom-6 left-6 rounded-2xl bg-slate-950/80 px-6 py-5 backdrop-blur">
                  <p className="text-sm uppercase tracking-[0.3em] text-green-200">{content.aboutClub.statLabel}</p>
                  <p className="text-4xl font-black text-white">{content.aboutClub.statNumber}</p>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-slate-950 py-20">
            <div className="mx-auto flex max-w-6xl flex-col gap-12 px-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-green-200/80">
                    Vägar inom klubben
                  </span>
                  <h2 className="mt-4 text-3xl font-black text-white md:text-4xl">Utvecklingsresan i Härnösands HF</h2>
                  <p className="mt-3 max-w-3xl text-lg text-slate-300">
                    Oavsett om du är spelare, ledare eller volontär finns en tydlig roll och en plats att växa på.
                  </p>
                </div>
                <Link
                  href="/kontakt"
                  className="group inline-flex items-center gap-2 text-sm font-semibold text-orange-400 transition hover:text-orange-300"
                >
                  Kontakta organisationen
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>

              <div className="grid gap-6 lg:grid-cols-3">
                {developmentTracks.map((track) => (
                  <Card
                    key={track.title}
                    className="flex h-full flex-col gap-4 border border-white/10 bg-gradient-to-br from-white/5 via-white/10 to-white/5 p-6 text-white shadow-xl"
                  >
                    <h3 className="text-2xl font-semibold">{track.title}</h3>
                    <p className="text-sm text-slate-200">{track.description}</p>
                    <ul className="mt-auto space-y-2 text-sm text-slate-200">
                      {track.takeaways.map((item) => (
                        <li key={item} className="flex items-center gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-orange-400" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          <section className="bg-slate-900 py-20">
            <div className="mx-auto max-w-6xl px-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-green-200/80">
                    Aktuellt
                  </span>
                  <h2 className="mt-4 text-3xl font-black text-white md:text-4xl">Nyheter och berättelser</h2>
                </div>
                <Button asChild variant="outline" className="border border-white/20 bg-white/5 text-white hover:bg-white/10">
                  <Link href="/nyheter">Visa alla nyheter</Link>
                </Button>
              </div>

              <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {newsHighlights.map((news) => (
                  <article
                    key={news.title}
                    className="group flex h-full flex-col justify-between rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:border-orange-400/70 hover:bg-white/10"
                  >
                    <div className="space-y-4">
                      <span className="inline-flex items-center rounded-full bg-orange-500/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-orange-300">
                        {news.tag}
                      </span>
                      <h3 className="text-2xl font-semibold text-white">{news.title}</h3>
                      <p className="text-sm text-slate-300">{news.excerpt}</p>
                    </div>
                    <Link
                      href={news.link}
                      className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-orange-300 transition group-hover:text-orange-200"
                    >
                      Läs mer
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section className="bg-slate-950 py-20">
            <div className="mx-auto max-w-6xl px-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-green-200/80">
                    Partnerskap
                  </span>
                  <h2 className="mt-4 text-3xl font-black text-white md:text-4xl">Tillsammans bygger vi framtiden</h2>
                  <p className="mt-3 max-w-2xl text-lg text-slate-300">
                    Våra partners är en aktiv del av klubben – i hallen, runt matcharrangemangen och i samhällsprojekten.
                  </p>
                </div>
                <Button asChild className="bg-orange-500 px-6 py-6 text-base font-semibold hover:bg-orange-600">
                  <Link href="/partners">Utforska partnerskap</Link>
                </Button>
              </div>

              {highlightedPartner && (
                <Card className="mt-12 grid gap-6 border border-white/10 bg-white/5 p-6 text-white shadow-xl lg:grid-cols-[auto,1fr] lg:items-center">
                  <div className="flex items-center justify-center rounded-2xl bg-white p-6">
                    <Image
                      src={highlightedPartner.src}
                      alt={highlightedPartner.alt}
                      width={200}
                      height={80}
                      className="h-16 w-auto object-contain"
                    />
                  </div>
                  <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-orange-300">{highlightedPartner.tier}</p>
                    <h3 className="mt-2 text-2xl font-semibold">{highlightedPartner.alt}</h3>
                    {highlightedPartner.benefits?.length ? (
                      <ul className="mt-4 flex flex-wrap gap-3 text-xs uppercase tracking-[0.2em] text-slate-300">
                        {highlightedPartner.benefits.map((benefit) => (
                          <li key={benefit} className="rounded-full border border-white/20 px-3 py-1">
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    ) : null}
                    {highlightedPartner.linkUrl ? (
                      <Link
                        href={highlightedPartner.linkUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-orange-300 transition hover:text-orange-200"
                      >
                        Besök partnern
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    ) : null}
                  </div>
                </Card>
              )}

              <div className="mt-10 grid gap-4 md:grid-cols-3 lg:grid-cols-4">
                {marqueePartners.map((partner) => (
                  <div key={partner.id} className="flex h-28 items-center justify-center rounded-2xl border border-white/10 bg-white/5 p-4">
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

          <section className="relative overflow-hidden bg-gradient-to-br from-green-600 via-green-700 to-green-500 py-20">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.15),_transparent_55%)]" />
            <div className="relative mx-auto flex max-w-5xl flex-col items-center gap-6 px-6 text-center text-white">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em]">
                Bli en del av laget
              </span>
              <h2 className="text-balance text-3xl font-black md:text-5xl">Ditt engagemang gör skillnad</h2>
              <p className="max-w-3xl text-lg text-white/90">
                Vi välkomnar nya spelare, ideella krafter, partners och supportrar som vill bidra till nästa kapitel av
                Härnösands HF. Hör av dig och hitta din plats i klubben.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Button asChild className="min-w-[180px] bg-white text-green-700 hover:bg-slate-100">
                  <Link href="/kontakt">Kontakta oss</Link>
                </Button>
                <Button asChild variant="outline" className="min-w-[180px] border-white bg-white/10 text-white hover:bg-white/20">
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
