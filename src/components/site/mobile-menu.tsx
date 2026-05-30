"use client"

import { Menu, X } from "lucide-react"
import { useEffect, useState } from "react"
import { NavLinks } from "./nav-links"

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  return (
    <div className="lg:hidden">
      <button
        aria-expanded={isOpen}
        aria-label={isOpen ? "Close menu" : "Open menu"}
        className="relative z-[70] inline-flex h-10 w-10 items-center justify-center rounded-full border border-ink/18 text-ink transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-line hover:bg-line/12"
        onClick={() => setIsOpen((value) => !value)}
        type="button"
      >
        {isOpen ? <X size={18} /> : <Menu size={18} />}
      </button>

      <div
        className={`fixed inset-0 z-[60] min-h-screen bg-background px-5 pb-8 pt-24 transition-all duration-500 ease-out ${
          isOpen
            ? "translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-4 opacity-0"
        }`}
      >
        <div className="mx-auto flex h-full max-w-7xl flex-col justify-between">
          <nav className="grid gap-1 text-3xl font-light leading-tight text-ink">
            <NavLinks variant="mobile" onNavigate={() => setIsOpen(false)} />
          </nav>
          {/* <div className="border-t border-ink/10 pt-6">
            <LanguageSwitcher />
          </div> */}
        </div>
      </div>
    </div>
  )
}
