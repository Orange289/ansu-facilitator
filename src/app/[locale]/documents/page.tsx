import { ArrowUpRight, FileText, Info } from "lucide-react"
import { getTranslations } from "next-intl/server"
import { PageShell } from "@/components/site/page-shell"
import { SectionHeading } from "@/components/site/section-heading"

type Document = {
  slug: string
  title: string
  text: string
  file: string
}

export default async function DocumentsPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "documents" })
  const documents = t.raw("items") as Document[]
  const note = t.has("note") ? t("note") : null
  const intro = t.has("intro") ? (t.raw("intro") as string) : null

  return (
    <PageShell locale={locale}>
      <main className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24">
        <div className="grid gap-10 lg:grid-cols-[0.75fr_1fr] lg:items-end">
          <SectionHeading eyebrow={t("eyebrow")} title={t("title")} />
          {intro ? (
            <p
              className="max-w-xl text-xl leading-8 text-ink/58"
              dangerouslySetInnerHTML={{ __html: intro }}
            ></p>
          ) : null}
        </div>

        {note ? (
          <p className="mt-10 flex max-w-3xl gap-3 rounded-[6px] border border-ink/12 bg-ink/[0.03] px-5 py-4 text-sm leading-7 text-ink/62">
            <Info className="mt-1 shrink-0 text-line" size={16} />
            <span>{note}</span>
          </p>
        ) : null}

        <div className="mt-14 grid gap-10">
          {documents.map((document, index) => (
            <article key={document.slug}>
              <a
                className="group grid gap-5 border-t border-ink/12 pt-8 transition-colors duration-500 ease-out hover:border-line md:grid-cols-[0.78fr_1.1fr_0.38fr] md:items-center"
                href={document.file}
                rel="noopener"
                target="_blank"
              >
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-line">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <h2 className="mt-4 text-2xl font-light leading-tight text-ink md:text-3xl">
                    {document.title}
                  </h2>
                </div>
                <p className="leading-7 text-ink/58">{document.text}</p>
                <span className="inline-flex w-fit items-center gap-2 whitespace-nowrap rounded-full border border-ink/20 px-5 py-2.5 text-xs uppercase tracking-[0.16em] text-ink/70 transition-all duration-300 ease-out group-hover:-translate-y-0.5 group-hover:border-line group-hover:bg-line/15 group-hover:text-ink md:justify-self-end">
                  <FileText size={15} />
                  {t("openCta")}
                  <ArrowUpRight size={15} />
                </span>
              </a>
            </article>
          ))}
        </div>
      </main>
    </PageShell>
  )
}
