"use client"

import Link from "next/link"
import { useLocale, useTranslations } from "next-intl"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { routing } from "@/i18n/routing"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/#about", key: "about", section: "about" },
  { href: "/#work", key: "work", section: "work" },
  { href: "/#schedule", key: "schedule", section: "schedule" },
  { href: "/products", key: "products", section: null },
  { href: "/#contact", key: "contact", section: "contact" },
] as const

type NavVariant = "desktop" | "footer" | "mobile"
type Locale = (typeof routing.locales)[number]

const variantClasses: Record<NavVariant, string> = {
  desktop:
    "relative transition-colors duration-300 ease-out hover:text-ink after:absolute after:-bottom-2 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-line after:transition-transform after:duration-300 after:ease-out hover:after:scale-x-100",
  footer: "transition-colors duration-300 ease-out hover:text-ink",
  mobile: "border-b border-ink/10 py-5 transition-colors duration-300 hover:text-line",
}

const activeClasses: Record<NavVariant, string> = {
  desktop: "text-ink after:scale-x-100",
  footer: "text-ink",
  mobile: "text-line",
}

function isLocaleSegment(value: string | undefined): value is Locale {
  return routing.locales.some((locale) => locale === value)
}

function stripLocale(pathname: string) {
  const segments = pathname.split("/").filter(Boolean)

  while (isLocaleSegment(segments[0])) {
    segments.shift()
  }

  return segments.length ? `/${segments.join("/")}` : "/"
}

function getLocalizedHref(href: string, locale: string) {
  if (href.startsWith("/#")) {
    return `/${locale}${href.slice(1)}`
  }

  return href === "/" ? `/${locale}` : `/${locale}${href}`
}

export function NavLinks({
  variant = "desktop",
  onNavigate,
}: {
  variant?: NavVariant
  onNavigate?: () => void
}) {
  const t = useTranslations("navigation")
  const locale = useLocale()
  const pathname = stripLocale(usePathname() || "/")
  const [activeSection, setActiveSection] = useState<string | null>(null)

  useEffect(() => {
    if (pathname !== "/") {
      setActiveSection(null)
      return
    }

    const sectionIds = navItems
      .map((item) => item.section)
      .filter(Boolean) as string[]

    const sections = sectionIds
      .map((section) => document.getElementById(section))
      .filter((section): section is HTMLElement => Boolean(section))

    if (!sections.length) {
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]

        if (visible?.target.id) {
          setActiveSection(visible.target.id)
        }
      },
      {
        rootMargin: "-28% 0px -55% 0px",
        threshold: [0.08, 0.18, 0.32],
      },
    )

    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [pathname])

  return (
    <>
      {navItems.map((item) => {
        const isActive = item.section
          ? pathname === "/" && activeSection === item.section
          : pathname.startsWith("/products")

        return (
          <Link
            aria-current={isActive ? "page" : undefined}
            className={cn(
              variantClasses[variant],
              isActive && activeClasses[variant],
            )}
            href={getLocalizedHref(item.href, locale)}
            key={item.key}
            onClick={onNavigate}
          >
            {t(item.key)}
          </Link>
        )
      })}
    </>
  )
}
