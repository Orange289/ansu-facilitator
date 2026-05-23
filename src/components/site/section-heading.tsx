import { cn } from "@/lib/utils"

export function SectionHeading({
  eyebrow,
  title,
  align = "left",
  className,
}: {
  eyebrow?: string
  title: string
  align?: "left" | "center"
  className?: string
}) {
  return (
    <div className={cn(align === "center" && "text-center", className)}>
      {eyebrow ? (
        <p className="section-label text-xs uppercase tracking-[0.2em] text-ink/48">
          {eyebrow}
        </p>
      ) : null}
      <h2
        className="mt-4 max-w-3xl text-3xl font-light leading-tight text-ink md:text-5xl"
        dangerouslySetInnerHTML={{ __html: title }}
      ></h2>
    </div>
  )
}
