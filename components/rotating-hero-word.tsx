"use client"

import { useEffect, useState } from "react"

import { useLanguage } from "@/lib/i18n"

const words = {
  en: ["words", "rhythm", "voice"],
  ru: ["ритмом", "стилем", "голосом"],
}

export function RotatingHeroWord() {
  const { locale } = useLanguage()
  const [index, setIndex] = useState(0)
  const [phase, setPhase] = useState<"enter" | "exit">("enter")

  useEffect(() => {
    const exitTimer = window.setTimeout(() => {
      setPhase("exit")
    }, 1500)

    const rotateTimer = window.setTimeout(() => {
      setIndex((current) => (current + 1) % words[locale].length)
      setPhase("enter")
    }, 2000)

    return () => {
      window.clearTimeout(exitTimer)
      window.clearTimeout(rotateTimer)
    }
  }, [index, locale])

  return (
    <>
      <span className="sr-only">
        {locale === "ru"
          ? "С вашим ритмом, стилем и голосом."
          : "AI clone with your words, rhythm, and voice."}
      </span>
      <span
        aria-hidden="true"
        className="inline-flex flex-col items-center lg:items-start"
      >
        <span className="whitespace-nowrap">
          {locale === "ru" ? "С вашим" : "AI clone with your"}
        </span>
        <span className="hero-word-window">
          <span
            key={`${locale}-${words[locale][index]}`}
            className={`hero-word hero-word-${phase}`}
          >
            {words[locale][index]}.
          </span>
        </span>
      </span>
    </>
  )
}
