import Link from "next/link"
import { Facebook, Instagram, Mail, MapPin, ExternalLink } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Club Info */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-orange-400">Härnösands HF</h3>
            <p className="text-gray-300">Härnösands Handbollsförening - En förening för alla som älskar handboll.</p>
            <p className="text-sm text-gray-400">Härnösands HF – Handboll i Härnösand</p>
            <div className="flex space-x-4">
              <Link
                href="https://www.facebook.com/profile.php?id=61566621756014"
                className="text-gray-400 hover:text-orange-400 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Facebook size={20} />
              </Link>
              <Link
                href="https://www.instagram.com/harnosandshf"
                className="text-gray-400 hover:text-orange-400 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
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
                  Se matcher för Härnösands HF
                </Link>
              </li>
              <li>
                <Link href="/nyheter" className="text-gray-300 hover:text-white transition-colors">
                  Läs nyheter från Härnösands HF
                </Link>
              </li>
              <li>
                <Link href="/lag" className="text-gray-300 hover:text-white transition-colors">
                  Våra handbollslag i Härnösand
                </Link>
              </li>
              <li>
                <Link href="/kontakt" className="text-gray-300 hover:text-white transition-colors">
                  Kontakta Härnösands HF
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
                <span>kontakt@harnosandshf.se</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-300">
                <MapPin size={16} />
                <span>Härnösand, Sverige</span>
              </div>
              <p className="text-sm text-gray-400 mt-2">Medlem i Svenska Handbollförbundet</p>
            </div>
          </div>

          {/* Tips & Idéer */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-orange-400">Tips & Idéer</h3>
            <div className="space-y-2">
              <p className="text-gray-300 text-sm">Har du förslag eller idéer för hemsidan?</p>
              <div className="flex items-center space-x-2 text-gray-300">
                <Mail size={16} />
                <a href="mailto:styrelsen@harnosandshf.se" className="hover:text-orange-400 transition-colors">
                  styrelsen@harnosandshf.se
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <p className="text-gray-400 text-sm mb-2">© 2024 Härnösands HF. Alla rättigheter förbehållna.</p>
            <p className="text-gray-500 text-xs">
              Detta är Härnösands HF:s officiella hemsida. Tidigare låg hemsidan på laget.se men från 2025 hittar du all
              information här på harnosandshf.se.
            </p>
          </div>

          {/* WBY Credit with Blue Gradient */}
          <div className="mt-4 md:mt-0">
            <Link
              href="https://wby.se"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center space-x-1 text-sm transition-all duration-300 hover:scale-105"
            >
              <span className="text-gray-400">Byggd av</span>
              <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent font-bold group-hover:from-blue-300 group-hover:to-blue-500 transition-all duration-300">
                Websites by You
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
