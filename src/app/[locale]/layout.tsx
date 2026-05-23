import type {Metadata} from "next";
import {NextIntlClientProvider} from "next-intl";
import {getMessages} from "next-intl/server";
import {notFound} from "next/navigation";
import {Inter, Playfair_Display} from "next/font/google";
import {CustomCursor} from "@/components/site/custom-cursor";
import {routing} from "@/i18n/routing";
import "../globals.css";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-sans",
  display: "swap"
});

const playfair = Playfair_Display({
  subsets: ["latin", "cyrillic"],
  variable: "--font-serif",
  display: "swap"
});

export const metadata: Metadata = {
  title: "Anya Ansu | Breathwork & Somatic Facilitation",
  description:
    "Minimal bilingual website for breathwork and somatic facilitation."
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;

  if (!routing.locales.includes(locale as "ru" | "en")) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-screen font-sans antialiased">
        <NextIntlClientProvider messages={messages}>
          <CustomCursor />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
