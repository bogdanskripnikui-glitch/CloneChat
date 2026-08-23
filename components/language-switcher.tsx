"use client"

import { useLanguage } from "@/lib/i18n"
import { cn } from "@/lib/utils"

export function LanguageSwitcher({ className }: { className?: string }) {
  const { locale, setLocale } = useLanguage()
  const isEnglish = locale === "en"

  return (
    <button
      type="button"
      onClick={() => setLocale(isEnglish ? "ru" : "en")}
      aria-label={
        isEnglish
          ? "Switch language to Russian"
          : "Переключить язык на английский"
      }
      title={isEnglish ? "Русский" : "English"}
      translate="no"
      className={cn(
        "shrink-0 cursor-pointer px-1 py-2 text-xs font-medium tracking-[0.04em] text-muted-foreground outline-none select-none hover:text-foreground focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className
      )}
    >
      {isEnglish ? "ENG" : "RU"}
    </button>
  )
}
