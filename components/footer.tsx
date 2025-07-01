import Link from "next/link"
import Image from "next/image"
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-300 py-12">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Section 1: Logo and Description */}
        <div className="col-span-1 md:col-span-2">
          <Link href="/" className="flex items-center gap-2 mb-4">
            <Image src="/logo.png" alt="Härnösands FF Logo" width={40} height={40} />
            <span className="text-2xl font-bold text-white">Härnösands FF</span>
          </Link>
          <p className="text-sm leading-relaxed">
            Härnösands FF är en fotbollsklubb med en rik historia och en stark gemenskap. Vi strävar efter att utveckla
            både elitspelare och ungdomar, och att vara en positiv kraft i Härnösand.
          </p>
        </div>

        {/* Section 2: Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Snabblänkar</h3>
          <ul className="space-y-2">
            <li>
              <Link href="/kalender" className="hover:text-white transition-colors">
                Kalender
              </Link>
            </li>
            <li>
              <Link href="/lag" className="hover:text-white transition-colors">
                Våra Lag
              </Link>
            </li>
            <li>
              <Link href="/matcher" className="hover:text-white transition-colors">
                Matcher
              </Link>
            </li>
            <li>
              <Link href="/nyheter" className="hover:text-white transition-colors">
                Nyheter
              </Link>
            </li>
            <li>
              <Link href="/partners" className="hover:text-white transition-colors">
                Partners
              </Link>
            </li>
            <li>
              <Link href="/kontakt" className="hover:text-white transition-colors">
                Kontakt
              </Link>
            </li>
          </ul>
        </div>

        {/* Section 3: Contact Info */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Kontakt</h3>
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-green-500" />
              <span>Härnösands Arena, Idrottsvägen 10, 871 50 Härnösand</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="w-5 h-5 text-green-500" />
              <span>+46 611-123 45</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-green-500" />
              <a href="mailto:info@harnosandff.se" className="hover:text-white transition-colors">
                info@harnosandff.se
              </a>
            </li>
          </ul>
        </div>

        {/* Section 4: Social Media */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Följ oss</h3>
          <div className="flex space-x-4">
            <a
              href="https://facebook.com/harnosandff"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              <Facebook className="w-7 h-7" />
            </a>
            <a
              href="https://instagram.com/harnosandff"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              <Instagram className="w-7 h-7" />
            </a>
            <a
              href="https://twitter.com/harnosandff"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              <Twitter className="w-7 h-7" />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} Härnösands FF. Alla rättigheter reserverade.
      </div>
    </footer>
  )
}
