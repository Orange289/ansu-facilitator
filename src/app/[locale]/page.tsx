import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { getTranslations } from "next-intl/server"
import { Button } from "@/components/ui/button"
import { ContactForm } from "@/components/site/contact-form"
import { PageShell } from "@/components/site/page-shell"
import { SectionHeading } from "@/components/site/section-heading"
import Link from "next/link"

type Practice = { date: string; title: string; format: string }
export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "home" })
  const practices = t.raw("schedule.items") as Practice[]
  const workItems = t.raw("work.items") as string[]
  const practicesLinks =
    locale === "ru"
      ? [
          "/products/individual-somatic-session",
          "/products/alive-breathwork-group",
          "/products/free-somatic-inner-support",
          "/products/free-breathwork-balance",
        ]
      : [
          "/products/alive-breathwork-group",
          "/products/free-somatic-inner-support",
          "/products/free-breathwork-balance",
        ]

  return (
    <PageShell locale={locale}>
      <main>
        <section className="mx-auto grid min-h-[calc(100vh-73px)] max-w-7xl items-center gap-12 px-5 py-14 md:px-8 lg:grid-cols-[1fr_0.78fr] lg:py-20">
          <div className="order-2 lg:order-1">
            <p className="text-sm uppercase tracking-[0.22em] text-ink/44">
              {t("hero.kicker")}
            </p>
            <h1
              className="mt-5 max-w-3xl text-5xl font-light leading-[0.98] text-ink md:text-7xl lg:text-8xl"
              dangerouslySetInnerHTML={{ __html: t.raw("hero.title") }}
            ></h1>
            <p className="mt-8 max-w-xl text-lg leading-8 text-ink/62">
              {t("hero.text")}
            </p>
            <Button asChild className="mt-9">
              <a href="#contact">
                {t("hero.cta")}
                <ArrowRight size={17} />
              </a>
            </Button>
          </div>

          <div className="relative order-1 lg:order-2">
            <div className="aspect-[4/5] overflow-hidden rounded-[6px] border border-ink/10 bg-muted shadow-soft">
              <Image
                alt={t("hero.imageAlt")}
                className="h-full w-full object-cover object-bottom transition-transform duration-700 ease-out hover:scale-[1.03]"
                height={1200}
                priority
                src="/images/1.jpg"
                width={960}
              />
            </div>
            <div className="absolute -bottom-6 -left-4 hidden h-28 w-28 rounded-full border border-line md:block" />
          </div>
        </section>

        <section
          className="mx-auto grid max-w-7xl gap-12 px-5 py-20 md:px-8 lg:grid-cols-[0.74fr_1fr] lg:items-center"
          id="about"
        >
          <div className="grid gap-8">
            <div className="relative max-w-md overflow-hidden rounded-[6px] border border-ink/10 bg-muted shadow-soft">
              <Image
                alt={t("about.imageAlt")}
                className="aspect-[4/5] h-full w-full object-cover object-center transition-transform duration-700 ease-out hover:scale-[1.03]"
                height={1200}
                src="/images/2.jpg"
                width={960}
              />
            </div>
          </div>
          <div className="grid gap-8 text-ink/66">
            <SectionHeading
              eyebrow={t("about.eyebrow")}
              title={t("about.title")}
            />
            <p className="max-w-2xl text-xl leading-9 text-ink/72">
              {t("about.lead")}
            </p>
            <p className="max-w-2xl leading-8">{t("about.text")}</p>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {(t.raw("about.stats") as { value: string; label: string }[]).map(
                (stat) => (
                  <div className="border-t border-ink/15 pt-4" key={stat.label}>
                    <p className="text-3xl font-light text-line">
                      {stat.value}
                    </p>
                    <p className="mt-2 text-sm leading-5 text-ink/52">
                      {stat.label}
                    </p>
                  </div>
                ),
              )}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-20 md:px-8" id="work">
          <div className="grid gap-8 lg:grid-cols-[0.75fr_1fr] lg:items-end">
            <SectionHeading
              eyebrow={t("work.eyebrow")}
              title={t("work.title")}
            />
            <p className="max-w-xl text-xl leading-8 text-ink/58">
              {t("work.subtitle")}
            </p>
          </div>
          <div className="mt-12 grid gap-5 grid-cols-2 lg:grid-cols-3">
            {workItems.map((item) => (
              <div
                className="flex aspect-square items-center justify-center rounded-full border border-line/80 px-8 text-center text-sm uppercase tracking-[0.12em] text-ink/62 transition-all duration-500 ease-out hover:-translate-y-1 hover:border-line hover:bg-line/10 hover:text-ink"
                key={item}
              >
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className="bg-[#e3dbcf] py-20" id="schedule">
          <div className="mx-auto max-w-7xl px-5 md:px-8">
            <SectionHeading
              eyebrow={t("schedule.eyebrow")}
              title={t("schedule.title")}
            />
            <div className="mt-10 divide-y divide-ink/12 border-y border-ink/12">
              {practices.map((practice, index) => (
                <Link
                  className="group grid gap-4 py-6 transition-colors duration-300 ease-out hover:bg-line/8 md:grid-cols-[0.3fr_1fr_0.3fr] md:items-center"
                  href={`/${locale}${practicesLinks[index]}`}
                  key={practice.title}
                >
                  <p className="text-sm uppercase tracking-[0.18em] text-ink/44 transition-colors duration-300 group-hover:text-ink/60">
                    {practice.date}
                  </p>
                  <h3
                    className="text-2xl font-light text-ink transition-colors duration-300 group-hover:text-line"
                    dangerouslySetInnerHTML={{ __html: practice.title }}
                  ></h3>
                  <p className="text-sm text-ink/55 transition-colors duration-300 group-hover:text-ink/70 md:text-right">
                    {practice.format}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* <section className="mx-auto max-w-7xl px-5 py-20 md:px-8">
          <SectionHeading
            eyebrow={t("testimonials.eyebrow")}
            title={t("testimonials.title")}
          />
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {testimonials.map((item) => (
              <figure
                className="rounded-[6px] border border-ink/12 bg-background/70 p-7"
                key={item.author}
              >
                <blockquote className="text-lg leading-8 text-ink/70">
                  “{item.quote}”
                </blockquote>
                <figcaption className="mt-6 text-sm uppercase tracking-[0.16em] text-ink/40">
                  {item.author}
                </figcaption>
              </figure>
            ))}
          </div>
        </section> */}

        <section
          className="mx-auto grid max-w-7xl gap-10 px-5 py-20 md:px-8 lg:grid-cols-[0.75fr_1fr]"
          id="contact"
        >
          <SectionHeading
            eyebrow={t("contact.eyebrow")}
            title={t("contact.title")}
          />
          <ContactForm />
        </section>
      </main>
    </PageShell>
  )
}
