import type { Metadata } from "next"
import { NextIntlClientProvider } from "next-intl"
import { getMessages } from "next-intl/server"
import { notFound } from "next/navigation"
import { Inter, Playfair_Display } from "next/font/google"
import { CustomCursor } from "@/components/site/custom-cursor"
import { PageTransitionLoader } from "@/components/site/page-transition-loader"
import { routing } from "@/i18n/routing"
import "../globals.css"

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-sans",
  display: "swap",
})

const playfair = Playfair_Display({
  subsets: ["latin", "cyrillic"],
  variable: "--font-serif",
  display: "swap",
})

const localizedMetadata = {
  ru: {
    title: "Аня Ансу | Breathwork и соматические практики",
    description:
      "Дыхательные и соматические практики с Аней Ансу: индивидуальные сессии, онлайн-группы, аудиозаписи и мягкое сопровождение к телесной опоре.",
  },
  en: {
    title: "Anya Ansu | Breathwork & Somatic Practices",
    description:
      "Breathwork and somatic practices with Anya Ansu: individual sessions, online group work, audio recordings, and gentle support for returning to the body.",
  },
} satisfies Record<string, Metadata>

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const metadata = localizedMetadata[locale as keyof typeof localizedMetadata] ?? localizedMetadata.ru

  return {
    ...metadata,
    openGraph: {
      title: metadata.title as string,
      description: metadata.description as string,
      type: "website",
    },
  }
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!routing.locales.includes(locale as "ru" | "en")) {
    notFound()
  }

  const messages = await getMessages({ locale })

  return (
    <html lang={locale} className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-screen font-sans antialiased">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <CustomCursor />
          <PageTransitionLoader />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
