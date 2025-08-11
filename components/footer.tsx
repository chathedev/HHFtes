import Link from "next/link"
import { Facebook, Instagram } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Härnösands HF</h3>
            <p className="text-gray-300">
              En av Sveriges mest framgångsrika handbollsklubbar med tradition sedan 1946.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Snabblänkar</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/lag" className="text-gray-300 hover:text-white transition-colors">
                  Våra Lag
                </Link>
              </li>
              <li>
                <Link href="/nyheter" className="text-gray-300 hover:text-white transition-colors">
                  Nyheter
                </Link>
              </li>
              <li>
                <Link href="/matcher" className="text-gray-300 hover:text-white transition-colors">
                  Matcher
                </Link>
              </li>
              <li>
                <Link href="/kontakt" className="text-gray-300 hover:text-white transition-colors">
                  Kontakt
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Kontakt</h4>
            <div className="text-gray-300 space-y-2">
              <p>Härnösands Ishall</p>
              <p>Storgatan 1</p>
              <p>871 32 Härnösand</p>
              <p>info@harnosandshf.se</p>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Följ Oss</h4>
            <div className="flex space-x-4">
              <Link
                href="https://www.facebook.com/harnosandshf"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors"
              >
                <Facebook className="w-6 h-6" />
              </Link>
              <Link
                href="https://www.instagram.com/harnosandshf"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors"
              >
                <Instagram className="w-6 h-6" />
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-300">
            © 2025 Härnösands HF. Alla rättigheter förbehållna. |{" "}
            <Link
              href="https://wby.se"
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-500 hover:text-orange-400 transition-colors"
            >
              Websites by You
            </Link>
          </p>
        </div>
      </div>
    </footer>
  )
}
