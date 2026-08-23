"use client"

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { useLanguage, type Locale } from "@/lib/i18n"
import { cn } from "@/lib/utils"

export function LanguageSwitcher({ className }: { className?: string }) {
  const { locale, setLocale } = useLanguage()

  return (
    <ToggleGroup
      value={[locale]}
      onValueChange={(value) => {
        const nextLocale = value[0] as Locale | undefined
        if (nextLocale) setLocale(nextLocale)
      }}
      aria-label="Language"
      size="sm"
      spacing={0}
      className={cn(
        "rounded-[12px] border border-border bg-background p-0.5",
        className
      )}
    >
      <ToggleGroupItem
        value="en"
        aria-label="English"
        className="h-7 min-w-8 rounded-[9px] px-1.5 text-[0.64rem] tracking-[0.04em]"
      >
        ENG
      </ToggleGroupItem>
      <ToggleGroupItem
        value="ru"
        aria-label="Русский"
        className="h-7 min-w-8 rounded-[9px] px-1.5 text-[0.64rem] tracking-[0.04em]"
      >
        RU
      </ToggleGroupItem>
    </ToggleGroup>
  )
}
