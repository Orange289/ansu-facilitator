import { Footer } from "./footer"
import { Header } from "./header"

export function PageShell({
  children,
  locale,
}: {
  children: React.ReactNode
  locale: string
}) {
  return (
    <>
      <Header locale={locale} />
      {children}
      <Footer locale={locale} />
    </>
  )
}
