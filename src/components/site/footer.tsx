import { Instagram, Mail, MessageCircle, Send, TimerReset } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { Link } from "@/i18n/routing"
import { LanguageSwitcher } from "./language-switcher"
import { NavLinks } from "./nav-links"

export function Footer() {
  const common = useTranslations("common")
  const locale = useLocale()

  const socialItems = [
    {
      label: "Insight Timer",
      icon: TimerReset,
      href: "https://insighttimer.com/AnyaBreathwork",
      // wide: true,
    },
    {
      label: "Instagram",
      icon: Instagram,
      href: "https://www.instagram.com/apelsanna/",
    },
    locale === "ru"
      ? { label: "Telegram", icon: Send, href: "https://t.me/whatif_anya" }
      : {
          label: "WhatsApp",
          icon: MessageCircle,
          href: "https://wa.me/79309258202",
        },
    { label: "Email", icon: Mail, href: "mailto:ansu.facilitator@gmail.com" },
  ]

  return (
    <footer className="border-t border-ink/10 bg-[#d8d0c2]">
      <div className="mx-auto max-w-7xl px-5 py-10 md:px-8">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-center">
          <Link
            className="text-lg font-semibold tracking-[0.08em] text-ink transition-colors duration-300 hover:text-line"
            href="/"
          >
            Anya Ansu
          </Link>
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center">
            <nav className="flex flex-wrap gap-x-6 gap-y-3 text-xs uppercase tracking-[0.16em] text-ink/62">
              <NavLinks variant="footer" />
            </nav>
            <LanguageSwitcher />
          </div>
        </div>
        <div className="mt-10 flex flex-col justify-between gap-6 border-t border-ink/10 pt-6 md:flex-row md:items-center">
          <div className="flex flex-wrap gap-3">
            {socialItems.map((item) => {
              const Icon = item.icon
              return (
                <a
                  aria-label={item.label}
                  className={[
                    "inline-flex h-10 items-center justify-center rounded-full border border-ink/20 text-ink/70 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-line hover:bg-line/15 hover:text-inkw-10",
                  ].join(" ")}
                  href={item.href}
                  key={item.label}
                  target="_blank"
                >
                  <Icon size={17} />
                </a>
              )
            })}
          </div>
          <p className="text-xs text-ink/52">{common("copyright")}</p>
        </div>
      </div>
    </footer>
  )
}
