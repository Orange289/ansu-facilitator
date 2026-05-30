import { NextRequest, NextResponse } from "next/server"
import { routing } from "./i18n/routing"

type Locale = (typeof routing.locales)[number]

const localeCookieName = "NEXT_LOCALE"

function isLocale(value: string | undefined): value is Locale {
  return routing.locales.some((locale) => locale === value)
}

function hasLocalePrefix(pathname: string) {
  return routing.locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  )
}

function getPreferredLocale(request: NextRequest): Locale {
  const cookieLocale = request.cookies.get(localeCookieName)?.value

  if (isLocale(cookieLocale)) {
    return cookieLocale
  }

  const acceptLanguage = request.headers.get("accept-language")?.toLowerCase() ?? ""
  const browserLocale = routing.locales.find((locale) => acceptLanguage.includes(locale))

  return browserLocale ?? routing.defaultLocale
}

function getForwardedValue(value: string | null) {
  return value?.split(",")[0]?.trim()
}

function getRequestOrigin(request: NextRequest) {
  const forwardedProto = getForwardedValue(request.headers.get("x-forwarded-proto"))
  const forwardedHost = getForwardedValue(request.headers.get("x-forwarded-host"))
  const host = forwardedHost ?? request.headers.get("host") ?? request.nextUrl.host
  const protocol = forwardedProto ?? (host.includes("localhost") ? "http" : "https")

  return `${protocol}://${host}`
}

export default function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl

  if (hasLocalePrefix(pathname)) {
    return NextResponse.next()
  }

  const locale = getPreferredLocale(request)
  const localizedPathname = pathname === "/" ? `/${locale}` : `/${locale}${pathname}`
  const response = NextResponse.redirect(
    new URL(`${localizedPathname}${search}`, getRequestOrigin(request)),
    307,
  )

  response.cookies.set(localeCookieName, locale, {
    path: "/",
    sameSite: "lax",
  })

  return response
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
}
