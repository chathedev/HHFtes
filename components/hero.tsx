import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function Hero() {
  return (
    <section className="relative w-full h-screen flex items-center justify-center overflow-hidden">
      <Image
        src="https://az316141.cdn.laget.se/2317159/11348130.jpg"
        alt="Härnösands HF Team"
        fill
        quality={90}
        priority
        unoptimized
        className="object-cover z-0"
      />
      <div className="absolute inset-0 bg-black/60 z-10" /> {/* Darker, full overlay */}
      <div className="relative z-20 text-white text-center px-4 max-w-4xl mx-auto">
        <h1 className="text-6xl md:text-8xl font-extrabold mb-4 leading-tight tracking-tight animate-fade-in-up">
          LAGET <span className="text-green-500">FÖRE ALLT</span>
        </h1>
        <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto animate-fade-in-up delay-200">
          Härnösands HF - En förening med stolthet, gemenskap och passion för sporten.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-6 animate-fade-in-up delay-400">
          <Button
            asChild
            className="bg-orange-500 hover:bg-orange-600 text-white px-10 py-4 rounded-md text-lg font-semibold shadow-lg transition-transform duration-300 hover:scale-105"
          >
            <Link href="/lag">
              Våra 23 Lag
              <ArrowRight className="ml-3 h-5 w-5" />
            </Link>
          </Button>
          <Button
            asChild
            className="bg-green-700 hover:bg-green-800 text-white px-10 py-4 rounded-md text-lg font-semibold shadow-lg transition-transform duration-300 hover:scale-105"
          >
            <Link href="/nyheter">Senaste Nytt</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
