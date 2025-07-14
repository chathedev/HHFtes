import Link from "next/link"
import { Facebook, Instagram, Mail, Phone, MapPin, ExternalLink } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Club Info */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-orange-400">Härnösands HF</h3>
            <p className="text-gray-300">Härnösands Handbollsförening - En förening för alla som älskar handboll.</p>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-400 hover:text-orange-400 transition-colors">
                <Facebook size={20} />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-orange-400 transition-colors">
                <Instagram size={20} />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-orange-400">Snabblänkar</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/matcher" className="text-gray-300 hover:text-white transition-colors">
                  Matcher
                </Link>
              </li>
              <li>
                <Link href="/kalender" className="text-gray-300 hover:text-white transition-colors">
                  Kalender
                </Link>
              </li>
              <li>
                <Link href="/lag" className="text-gray-300 hover:text-white transition-colors">
                  Lag
                </Link>
              </li>
              <li>
                <Link href="/nyheter" className="text-gray-300 hover:text-white transition-colors">
                  Nyheter
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-orange-400">Kontakt</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-gray-300">
                <Mail size={16} />
                <span>info@harnosandshf.se</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-300">
                <Phone size={16} />
                <span>0611-123 456</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-300">
                <MapPin size={16} />
                <span>Härnösand, Sverige</span>
              </div>
            </div>
          </div>

          {/* Training Times */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-orange-400">Träningstider</h3>
            <div className="space-y-2 text-gray-300">
              <div>
                <p className="font-semibold">Måndag & Onsdag</p>
                <p>18:00 - 20:00</p>
              </div>
              <div>
                <p className="font-semibold">Lördag</p>
                <p>10:00 - 12:00</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">© 2024 Härnösands HF. Alla rättigheter förbehållna.</p>

          {/* WBY Credit with Blue Gradient */}
          <div className="mt-4 md:mt-0">
            <Link
              href="https://wby.se"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center space-x-1 text-sm transition-all duration-300 hover:scale-105"
            >
              <span className="text-gray-400">Designad av</span>
              <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent font-bold group-hover:from-blue-300 group-hover:to-blue-500 transition-all duration-300">
                WBY
              </span>
              <ExternalLink
                size={12}
                className="text-blue-400 group-hover:text-blue-300 transition-colors duration-300"
              />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
