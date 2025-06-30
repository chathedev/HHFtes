import Link from "next/link"
import Image from "next/image"

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-50 py-8 px-4 md:px-6">
      <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Image src="/logo.png" alt="Härnösands HF Logo" width={30} height={30} />
          <span className="text-lg font-semibold">Härnösands HF</span>
        </div>
        <nav className="flex gap-4 sm:gap-6">
          <Link className="text-sm hover:underline underline-offset-4" href="/kontakt">
            Kontakt
          </Link>
          <Link className="text-sm hover:underline underline-offset-4" href="/partners">
            Partners
          </Link>
          <Link className="text-sm hover:underline underline-offset-4" href="/nyheter">
            Nyheter
          </Link>
          <Link className="text-sm hover:underline underline-offset-4" href="/lag">
            Lag
          </Link>
        </nav>
        <p className="text-sm text-gray-400">&copy; 2023 Härnösands HF. Alla rättigheter reserverade.</p>
      </div>
    </footer>
  )
}
