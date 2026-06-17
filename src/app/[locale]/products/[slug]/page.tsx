import Image from "next/image"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { getTranslations } from "next-intl/server"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { AudioPlayer } from "@/components/site/audio-player"
import { PageShell } from "@/components/site/page-shell"
import Link from "next/link"
import { routing } from "@/i18n/routing"
import { productSlugs } from "@/lib/products"

function getAudioSrc(slug: string, locale: string) {
  if (slug === "free-breathwork-balance") {
    return locale === "ru"
      ? "/audios/breathwork%20%D0%BD%D0%B0%20%D0%B1%D0%B0%D0%BB%D0%B0%D0%BD%D1%81.mp3"
      : "/audios/breathwork-balance-anya.mp3"
  }

  if (slug === "free-somatic-inner-support") {
    return locale === "ru"
      ? "/audios/%D0%B2%D0%BD%D1%83%D1%82%D1%80%D0%B5%D0%BD%D0%BD%D1%8F%D1%8F-%D0%BE%D0%BF%D0%BE%D1%80%D0%B0.mp3"
      : "/audios/inner-support.mp3"
  }

  return null
}

type Product = {
  slug: string
  title: string
  text: string
  detail: string
  cta: string
  ctaDetailed: string
  listen?: boolean
  individual?: boolean
  href: string
  image: string
}

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    productSlugs.map((slug) => ({ locale, slug })),
  )
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  const t = await getTranslations({ locale, namespace: "products" })
  const products = t.raw("items") as Product[]
  const product = products.find((item) => item.slug === slug)
  const audioSrc = getAudioSrc(slug, locale)

  if (!product) {
    notFound()
  }

  return (
    <PageShell locale={locale}>
      <main className="mx-auto max-w-7xl px-5 py-12 md:px-8 md:py-20">
        <Link
          className="inline-flex items-center gap-2 text-sm text-ink/58 transition-colors duration-300 hover:text-ink"
          href={`/${locale}/products`}
        >
          <ArrowLeft size={16} />
          {t("back")}
        </Link>

        <section className="mt-10 grid gap-10 lg:grid-cols-[0.86fr_1fr] lg:items-start">
          <div className="overflow-hidden rounded-[6px] border border-ink/10 bg-muted shadow-soft">
            <Image
              alt=""
              className="aspect-[4/5] h-full w-full object-cover grayscale"
              height={1200}
              priority
              src={product.image}
              width={960}
            />
          </div>

          <div className="lg:pt-8">
            <p className="section-label text-xs uppercase tracking-[0.2em] text-ink/48">
              {t("detailLabel")}
            </p>
            <h1
              className="mt-5 max-w-3xl text-4xl font-light leading-tight text-ink md:text-6xl"
              dangerouslySetInnerHTML={{ __html: product.title }}
            ></h1>

            {product.listen ? (
              <p
                className="mt-7 mb-12 max-w-2xl text-xl leading-9 text-ink/66"
                dangerouslySetInnerHTML={{ __html: product.detail }}
              ></p>
            ) : (
              <>
                <p
                  className="mt-7 max-w-2xl text-xl leading-9 text-ink/66"
                  dangerouslySetInnerHTML={{ __html: product.text }}
                ></p>

                <div className="mt-9 border-y border-ink/12 py-8">
                  <p
                    className="max-w-2xl leading-8 text-ink/62"
                    dangerouslySetInnerHTML={{ __html: product.detail }}
                  ></p>
                </div>
              </>
            )}

            {!product.listen && product.href ? (
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild>
                  <Link
                    href={
                      product.individual
                        ? locale === "ru"
                          ? "https://t.me/Orange289"
                          : "https://wa.me/79309258202"
                        : product.href
                    }
                    target={product.individual ? "_self" : "_blank"}
                  >
                    {product.individual
                      ? t("contactCta")
                      : product.ctaDetailed || product.cta}
                    <ArrowRight size={17} />
                  </Link>
                </Button>
              </div>
            ) : audioSrc ? (
              <AudioPlayer src={audioSrc} />
            ) : null}
          </div>
        </section>
      </main>
    </PageShell>
  )
}
