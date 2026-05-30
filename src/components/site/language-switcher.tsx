"use client"

import { useLocale } from "next-intl"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { triggerPageTransition } from "./page-transition-loader"
import { routing } from "@/i18n/routing"
import { cn } from "@/lib/utils"

type Locale = (typeof routing.locales)[number]

const localeCookieName = "NEXT_LOCALE"

function isLocaleSegment(value: string | undefined): value is Locale {
  return routing.locales.some((locale) => locale === value)
}

function getLocalizedPathname(pathname: string, nextLocale: Locale) {
  const segments = pathname.split("/").filter(Boolean)

  while (isLocaleSegment(segments[0])) {
    segments.shift()
  }

  const suffix = segments.join("/")
  return suffix ? `/${nextLocale}/${suffix}` : `/${nextLocale}`
}

function syncLocaleCookie(nextLocale: Locale) {
  document.cookie = `${localeCookieName}=${nextLocale}; path=/; max-age=31536000; samesite=lax`
}

export function LanguageSwitcher({ className }: { className?: string }) {
  const locale = useLocale()
  const pathname = usePathname() || "/"
  const router = useRouter()
  const searchParams = useSearchParams()

  return (
    <div
      className={cn(
        "inline-grid grid-cols-2 rounded-full border border-ink/20 p-1 text-[11px] uppercase tracking-[0.16em]",
        className,
      )}
    >
      {routing.locales.map((nextLocale) => {
        const localizedPathname = getLocalizedPathname(pathname, nextLocale)
        const isCurrent = locale === nextLocale && pathname === localizedPathname

        return (
          <button
            className={cn(
              "rounded-full px-3 py-1.5 transition",
              locale === nextLocale
                ? "bg-ink text-background"
                : "text-ink/60 hover:text-ink",
            )}
            key={nextLocale}
            onClick={() => {
              if (isCurrent) {
                return
              }

              const query = searchParams.toString()
              const hash = window.location.hash
              const href = `${localizedPathname}${query ? `?${query}` : ""}${hash}`

              syncLocaleCookie(nextLocale)
              triggerPageTransition()

              if (pathname === localizedPathname) {
                router.refresh()
                return
              }

              router.replace(href)
            }}
            type="button"
          >
            {nextLocale}
          </button>
        )
      })}
    </div>
  )
}
