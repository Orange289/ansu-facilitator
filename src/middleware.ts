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

export default function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl

  if (hasLocalePrefix(pathname)) {
    return NextResponse.next()
  }

  const locale = getPreferredLocale(request)
  const localizedPathname = pathname === "/" ? `/${locale}` : `/${locale}${pathname}`
  const response = new NextResponse(null, {
    status: 307,
    headers: {
      Location: `${localizedPathname}${search}`,
    },
  })

  response.cookies.set(localeCookieName, locale, {
    path: "/",
    sameSite: "lax",
  })

  return response
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
}
