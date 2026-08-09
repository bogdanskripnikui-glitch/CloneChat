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
      <span className="sr-only">Your words. Your rhythm. Your voice.</span>
      <span aria-hidden="true" className="inline-flex items-baseline gap-[0.14em]">
        <span>Your</span>
        <span className="hero-word-window">
          <span
            key={words[index]}
            className={`hero-word hero-word-${phase}`}
          >
            {words[index]}.
          </span>
        </span>
      </span>
    </>
  )
}
