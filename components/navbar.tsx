"use client"

import type React from "react"

import { useState } from "react"
import { X } from "lucide-react"
// Modal lives in the same folder as the navbar, so use a relative import
import ContactModal from "./contact-modal"
import Logo from "./logo"

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [contactModalOpen, setContactModalOpen] = useState(false)

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault()
    window.scrollTo({ top: 0, behavior: "smooth" })
    setMobileMenuOpen(false)
  }

  const handlePhoneClick = () => {
    window.location.href = "tel:+77773231715"
  }

  const navItems = [
    { href: "/", label: "Главная" },
    { href: "/news", label: "Новости" },
    { href: "/contacts", label: "Контакты" },
  ]

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50">
        <div className="w-full">
          <div className="shadow-lg border-b border-gray-700" style={{ backgroundColor: "#141415" }}>
            <div className="max-w-7xl mx-auto relative flex items-center px-4 py-3 sm:px-6 md:py-4 lg:px-8 xl:px-10 2xl:px-12">
              {/* Navigation - Left Side */}
              <nav className="hidden lg:block">
                <ul className="flex space-x-6 lg:space-x-8 xl:space-x-10">
                  {navItems.map(({ href, label }) => (
                    <li key={href}>
                      <a
                        href={href}
                        className="text-sm lg:text-base font-medium transition-colors hover:text-green-400 whitespace-nowrap font-inter text-gray-200"
                      >
                        {label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>

              <div className="lg:absolute lg:left-1/2 lg:transform lg:-translate-x-1/2 flex-shrink-0">
                <a href="#" onClick={handleLogoClick} className="flex items-center">
                  <Logo className="h-10 w-10" />
                </a>
              </div>

              {/* Phone Number - Right Side */}
              <div className="ml-auto flex items-center space-x-3 md:space-x-6 flex-shrink-0">
                {/* Phone Number with Online Indicator - Desktop */}
                <div className="hidden md:flex items-center space-x-6">
                  <div className="flex flex-col items-end">
                    <a
                      href="tel:+77773231715"
                      className="text-white font-semibold text-lg hover:text-green-400 transition-colors"
                    >
                      +7 (777) 323-17-15
                    </a>
                    <div className="flex items-center space-x-2 mt-0">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm lg:text-base font-medium transition-colors hover:text-green-400 whitespace-nowrap font-inter text-gray-400">
                        Звоните, мы в сети
                      </span>
                    </div>
                  </div>
                </div>

                {/* Phone Number with Online Indicator - Mobile */}
                <div className="md:hidden flex flex-col items-end">
                  <a
                    href="tel:+77773231715"
                    className="text-white font-semibold text-base hover:text-green-400 transition-colors"
                  >
                    +7 (777) 323-17-15
                  </a>
                  <div className="flex items-center space-x-2 mt-0">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-gray-400">Звоните, мы в сети</span>
                  </div>
                </div>

                {/* Mobile Menu Button */}
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="rounded-lg p-2 text-gray-300 lg:hidden bg-gray-700 hover:bg-gray-600 transition-colors"
                  aria-label="Меню"
                >
                  {mobileMenuOpen ? (
                    <X className="h-6 w-6" />
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40" style={{ backgroundColor: "#141415" }}>
          <div className="flex flex-col h-full">
            <div className="pt-0">
              <div className="w-full">
                <div className="shadow-lg border-b border-gray-700" style={{ backgroundColor: "#141415" }}>
                  <div className="max-w-7xl mx-auto relative flex items-center px-4 py-3 sm:px-6 md:py-4 lg:px-8 xl:px-10 2xl:px-12">
                    <div className="flex-shrink-0">
                      <a href="#" onClick={handleLogoClick} className="flex items-center">
                        <div className="w-10 h-10 bg-gray-500 rounded" />
                      </a>
                    </div>

                    {/* Close button */}
                    <div className="ml-auto flex items-center space-x-3 md:space-x-4 flex-shrink-0">
                      <button
                        onClick={() => setMobileMenuOpen(false)}
                        className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-gray-300 hover:bg-gray-600 transition-colors"
                        aria-label="Закрыть меню"
                      >
                        <X className="w-6 h-6" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <nav className="flex-1 pt-8">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
                <ul className="space-y-0">
                  {navItems.map(({ href, label }, index) => (
                    <li key={href}>
                      <a
                        href={href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="block py-4 text-lg font-medium text-white transition-colors hover:text-green-400 font-inter"
                      >
                        {label}
                      </a>
                      {index < navItems.length - 1 && <div className="h-px bg-gray-700"></div>}
                    </li>
                  ))}
                </ul>
              </div>
            </nav>
          </div>
        </div>
      )}

      {/* Contact Modal */}
      <ContactModal isOpen={contactModalOpen} onClose={() => setContactModalOpen(false)} />
    </>
  )
}
