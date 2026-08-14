"use client"

import { useEffect, useState } from "react"

const words = ["words", "rhythm", "voice"]

export function RotatingHeroWord() {
  const [index, setIndex] = useState(0)
  const [phase, setPhase] = useState<"enter" | "exit">("enter")

  useEffect(() => {
    const exitTimer = window.setTimeout(() => {
      setPhase("exit")
    }, 1500)

    const rotateTimer = window.setTimeout(() => {
      setIndex((current) => (current + 1) % words.length)
      setPhase("enter")
    }, 2000)

    return () => {
      window.clearTimeout(exitTimer)
      window.clearTimeout(rotateTimer)
    }
  }, [index])

  return (
    <>
      <span className="sr-only">
        AI clone with your words, rhythm, and voice.
      </span>
      <span
        aria-hidden="true"
        className="inline-flex flex-col items-center lg:items-start"
      >
        <span className="whitespace-nowrap">AI clone with your</span>
        <span className="hero-word-window">
          <span key={words[index]} className={`hero-word hero-word-${phase}`}>
            {words[index]}.
          </span>
        </span>
      </span>
    </>
  )
}
