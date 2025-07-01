"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X } from "lucide-react"
import { usePathname } from "next/navigation"
import { useAuth } from "@/components/auth-provider"

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const { isAuthenticated, loading } = useAuth()

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const navLinks = [
    { name: "Hem", href: "/" },
    { name: "Nyheter", href: "/nyheter" },
    { name: "Partners", href: "/partners" },
    { name: "Lag", href: "/lag" },
    { name: "Kontakt", href: "/kontakt" },
  ]

  // Add editor link if authenticated
  if (isAuthenticated) {
    navLinks.push({ name: "Redigera", href: "/editor" })
  }

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 text-white shadow-lg transition-all duration-300
        ${
          pathname === "/"
            ? scrolled
              ? "bg-black/90 backdrop-blur-md"
              : "bg-transparent backdrop-blur-none"
            : "bg-black/90 backdrop-blur-md"
        }
      `}
    >
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-3">
          <div className="relative w-12 h-12">
            <Image src="/logo.png" alt="Härnösands HF Logo" fill className="object-contain" priority />
          </div>
          <div>
            <div className="font-bold text-xl">Härnösands HF</div>
          </div>
        </Link>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`relative text-lg font-medium py-2 group transition-colors duration-300
                ${pathname === link.href ? "text-orange-500" : "text-white hover:text-gray-300"}
              `}
            >
              {link.name}
              <span
                className={`absolute bottom-0 left-0 h-[3px] bg-orange-500 transition-all duration-300 ease-out
                  ${pathname === link.href ? "w-full" : "w-0 group-hover:w-full"}
                `}
              />
            </Link>
          ))}

          {!isAuthenticated && !loading && (
            <Link
              href="/login"
              className="relative text-lg font-medium py-2 group transition-colors duration-300 text-white hover:text-gray-300"
            >
              Logga in
              <span className="absolute bottom-0 left-0 h-[3px] bg-orange-500 transition-all duration-300 ease-out w-0 group-hover:w-full" />
            </Link>
          )}
        </nav>
      </div>

      {/* Mobile navigation */}
      {isMenuOpen && (
        <nav className="md:hidden bg-black/90 py-4 px-4 flex flex-col gap-4 border-t border-gray-800">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`relative text-lg font-medium py-2
                ${pathname === link.href ? "text-orange-500" : "text-white hover:text-gray-300"}
              `}
              onClick={() => setIsMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}

          {!isAuthenticated && !loading && (
            <Link
              href="/login"
              className="relative text-lg font-medium py-2 text-white hover:text-gray-300"
              onClick={() => setIsMenuOpen(false)}
            >
              Logga in
            </Link>
          )}
        </nav>
      )}
    </header>
  )
}

export default Header
export { Header } // Add named export for Header
