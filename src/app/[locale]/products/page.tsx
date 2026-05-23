import Image from "next/image"
import { ArrowRight, Headphones } from "lucide-react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Link } from "@/i18n/routing"
import { PageShell } from "@/components/site/page-shell"
import { SectionHeading } from "@/components/site/section-heading"

type Product = {
  slug: string
  title: string
  text: string
  cta: string
  listen?: boolean
  image: string
}

export default function ProductsPage() {
  const t = useTranslations("products")
  const products = t.raw("items") as Product[]

  return (
    <PageShell>
      <main className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24">
        <div className="grid gap-10 lg:grid-cols-[0.75fr_1fr] lg:items-end">
          <SectionHeading eyebrow={t("eyebrow")} title={t("title")} />
          <p
            className="max-w-xl text-xl leading-8 text-ink/58"
            dangerouslySetInnerHTML={{ __html: t.raw("intro") }}
          ></p>
        </div>

        <div className="mt-14 grid gap-10">
          {products.map((product, index) => (
            <article
              // className="group grid gap-5 border-t border-ink/12 pt-8 transition-colors duration-500 ease-out hover:border-line md:grid-cols-[0.78fr_1.1fr_0.38fr] md:items-center"
              key={product.title}
            >
              <Link
                href={`/products/${product.slug}`}
                className="group grid gap-5 border-t border-ink/12 pt-8 transition-colors duration-500 ease-out hover:border-line md:grid-cols-[0.78fr_1.1fr_0.38fr] md:items-center"
              >
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-line">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <h2
                    className="mt-4 text-2xl font-light leading-tight text-ink md:text-3xl"
                    dangerouslySetInnerHTML={{ __html: product.title }}
                  ></h2>
                  <p className="mt-4 leading-7 text-ink/58">{product.text}</p>
                </div>
                <div className="aspect-[16/7] overflow-hidden rounded-[6px] bg-muted md:order-none">
                  <Image
                    alt=""
                    className="h-full w-full object-cover grayscale transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                    height={560}
                    src={product.image}
                    width={1120}
                  />
                </div>
                <Button className="w-fit md:justify-self-end">
                  <>
                    {product.listen ? <Headphones size={16} /> : null}
                    {product.cta}
                    {!product.listen ? <ArrowRight size={16} /> : null}
                  </>
                </Button>
              </Link>
            </article>
          ))}
        </div>
      </main>
    </PageShell>
  )
}
