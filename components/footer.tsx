"use client"

import type React from "react"

import Link from "next/link"
import Image from "next/image"
import { Facebook, Instagram, Mail, Phone } from "lucide-react"
import { usePathname } from "next/navigation"

function Footer() {
  const pathname = usePathname()
  const isEditorMode = pathname === "/editor"

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (isEditorMode) {
      e.preventDefault()
    }
  }

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Section 1: Logo and Description */}
        <div className="md:col-span-1">
          <Link
            href="/"
            className={`flex items-center gap-3 mb-4 ${isEditorMode ? "pointer-events-none" : ""}`}
            onClick={handleLinkClick}
          >
            <div className="relative w-16 h-16">
              <Image src="/logo.png" alt="Härnösands HF Logo" fill className="object-contain" />
            </div>
            <div>
              <div className="font-bold text-2xl">Härnösands HF</div>
              <div className="text-sm text-gray-400">Förening</div>
            </div>
          </Link>
          <p className="text-gray-400 text-sm">
            Härnösands Handbollsförening är en anrik klubb med fokus på gemenskap, utveckling och handbollsglädje för
            alla åldrar.
          </p>
        </div>

        {/* Section 2: Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-orange-500">Snabblänkar</h3>
          <ul className="space-y-2">
            <li>
              <Link
                href="/nyheter"
                className={`text-gray-400 hover:text-white transition-colors ${isEditorMode ? "pointer-events-none cursor-default" : ""}`}
                onClick={handleLinkClick}
              >
                Nyheter
              </Link>
            </li>
            <li>
              <Link
                href="/kalender"
                className={`text-gray-400 hover:text-white transition-colors ${isEditorMode ? "pointer-events-none cursor-default" : ""}`}
                onClick={handleLinkClick}
              >
                Kalender
              </Link>
            </li>
            <li>
              <Link
                href="/lag"
                className={`text-gray-400 hover:text-white transition-colors ${isEditorMode ? "pointer-events-none cursor-default" : ""}`}
                onClick={handleLinkClick}
              >
                Våra Lag
              </Link>
            </li>
            <li>
              <Link
                href="/partners"
                className={`text-gray-400 hover:text-white transition-colors ${isEditorMode ? "pointer-events-none cursor-default" : ""}`}
                onClick={handleLinkClick}
              >
                Partners
              </Link>
            </li>
            <li>
              <Link
                href="/kontakt"
                className={`text-gray-400 hover:text-white transition-colors ${isEditorMode ? "pointer-events-none cursor-default" : ""}`}
                onClick={handleLinkClick}
              >
                Kontakt
              </Link>
            </li>
          </ul>
        </div>

        {/* Section 3: Contact Info */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-orange-500">Kontakt</h3>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              <span>070-123 45 67</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              <span>info@harnosandshf.se</span>
            </li>
            <li>
              <span>Arenavägen 10</span>
            </li>
            <li>
              <span>871 40 Härnösand</span>
            </li>
          </ul>
        </div>

        {/* Section 4: Social Media */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-orange-500">Följ Oss</h3>
          <div className="flex space-x-4">
            <Link
              href="https://facebook.com/harnosandshf"
              target="_blank"
              rel="noopener noreferrer"
              className={`text-gray-400 hover:text-white transition-colors ${isEditorMode ? "pointer-events-none cursor-default" : ""}`}
              onClick={handleLinkClick}
            >
              <Facebook className="w-6 h-6" />
            </Link>
            <Link
              href="https://instagram.com/harnosandshf"
              target="_blank"
              rel="noopener noreferrer"
              className={`text-gray-400 hover:text-white transition-colors ${isEditorMode ? "pointer-events-none cursor-default" : ""}`}
              onClick={handleLinkClick}
            >
              <Instagram className="w-6 h-6" />
            </Link>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} Härnösands HF. Alla rättigheter förbehållna.
      </div>
    </footer>
  )
}

export default Footer
export { Footer }
