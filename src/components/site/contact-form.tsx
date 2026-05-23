"use client"

import { useTranslations } from "next-intl"
import { FormEvent, useState } from "react"
import { Button } from "@/components/ui/button"

type FormState = "idle" | "sending" | "success" | "error"

export function ContactForm() {
  const t = useTranslations("contact")
  const [state, setState] = useState<FormState>("idle")

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setState("sending")

    const form = event.currentTarget
    const formData = new FormData(form)

    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.get("name"),
        email: formData.get("email"),
        message: formData.get("message"),
      }),
    })

    if (response.ok) {
      form.reset()
      setState("success")
      return
    }

    setState("error")
  }

  return (
    <form className="grid gap-4" id="contact-form" onSubmit={handleSubmit}>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm text-ink/62">
          {t("name")}
          <input
            className="h-12 rounded-none border-b border-ink/25 bg-transparent px-0 text-ink outline-none transition focus:border-ink"
            name="name"
            required
          />
        </label>
        <label className="grid gap-2 text-sm text-ink/62">
          {t("email")}
          <input
            className="h-12 rounded-none border-b border-ink/25 bg-transparent px-0 text-ink outline-none transition focus:border-ink"
            name="email"
            required
            type="email"
          />
        </label>
      </div>
      <label className="grid gap-2 text-sm text-ink/62">
        {t("message")}
        <textarea
          className="min-h-32 resize-y rounded-none border-b border-ink/25 bg-transparent px-0 py-3 text-ink outline-none transition focus:border-ink"
          name="message"
          required
        />
      </label>
      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center">
        <Button disabled={state === "sending"} type="submit">
          {state === "sending" ? t("sending") : t("submit")}
        </Button>
        {state === "success" ? (
          <p className="text-sm leading-6 text-ink/62">{t("success")}</p>
        ) : null}
        {state === "error" ? (
          <p
            className="text-sm leading-6 text-clay"
            dangerouslySetInnerHTML={{ __html: t.raw("error") }}
          ></p>
        ) : null}
      </div>
    </form>
  )
}
