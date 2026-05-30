"use client";

import {useLocale} from "next-intl";
import {usePathname, useRouter} from "@/i18n/routing";
import { triggerPageTransition } from "./page-transition-loader"
import {cn} from "@/lib/utils";

export function LanguageSwitcher({className}: {className?: string}) {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div
      className={cn(
        "inline-grid grid-cols-2 rounded-full border border-ink/20 p-1 text-[11px] uppercase tracking-[0.16em]",
        className
      )}
    >
      {(["ru", "en"] as const).map((nextLocale) => (
        <button
          className={cn(
            "rounded-full px-3 py-1.5 transition",
            locale === nextLocale
              ? "bg-ink text-background"
              : "text-ink/60 hover:text-ink"
          )}
          key={nextLocale}
          onClick={() => {
            if (locale === nextLocale) {
              return
            }

            triggerPageTransition()
            router.replace(pathname, {locale: nextLocale})
          }}
          type="button"
        >
          {nextLocale}
        </button>
      ))}
    </div>
  );
}
