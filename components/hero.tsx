import Link from "next/link"
import Image from "next/image"

interface HeroProps {
  title: string
  description: string
  imageUrl: string
  button1Text: string
  button1Link: string
  button2Text: string
  button2Link: string
}

export function Hero({ title, description, imageUrl, button1Text, button1Link, button2Text, button2Link }: HeroProps) {
  return (
    <section className="relative w-full h-[600px] md:h-[700px] lg:h-[800px] xl:h-[900px] overflow-hidden">
      <Image
        alt="Hero Background"
        className="absolute inset-0 object-cover w-full h-full"
        height={1080}
        src={imageUrl || "/placeholder.svg"}
        style={{
          aspectRatio: "1920/1080",
          objectFit: "cover",
        }}
        width={1920}
        unoptimized // Use unoptimized for external images if you don't want Next.js Image optimization
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-4 md:px-6">
        <div className="max-w-4xl space-y-6">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl leading-tight">
            {title}
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl">{description}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              className="inline-flex h-12 items-center justify-center rounded-md bg-orange-500 px-8 text-base font-medium text-white shadow transition-colors hover:bg-orange-600 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-orange-700 disabled:pointer-events-none disabled:opacity-50"
              href={button1Link}
            >
              {button1Text}
            </Link>
            <Link
              className="inline-flex h-12 items-center justify-center rounded-md border border-white bg-transparent px-8 text-base font-medium text-white shadow-sm transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white disabled:pointer-events-none disabled:opacity-50"
              href={button2Link}
            >
              {button2Text}
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
