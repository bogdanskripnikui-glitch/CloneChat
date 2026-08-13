"use client"

import { useEffect, useRef, useState } from "react"

import { VoiceWorkbench } from "@/components/voice-workbench"

export function VoiceTrainingSection({
  onNavigate,
}: {
  onNavigate: (href: string) => void
}) {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const node = sectionRef.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.35 }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="voice-training"
      aria-labelledby="voice-training-title"
      className="flex h-[100svh] min-h-0 snap-start snap-always items-stretch overflow-hidden bg-transparent"
    >
      <div className="mx-auto grid h-full min-h-0 w-full max-w-[1440px] items-center gap-8 px-4 pt-28 pb-5 sm:px-5 sm:pt-36 sm:pb-10 lg:grid-cols-[minmax(19rem,0.7fr)_minmax(0,1.3fr)] lg:gap-14 lg:px-8 lg:py-28">
        <div
          className={`screen-shift hidden max-w-[32rem] flex-col justify-center lg:flex ${
            isVisible ? "screen-shift-visible screen-shift-delay-1" : ""
          }`}
        >
          <h2
            id="voice-training-title"
            className="text-[clamp(3rem,4.8vw,4.8rem)] leading-[0.95] font-medium tracking-[-0.04em] text-balance"
          >
            Give it something unmistakably yours.
          </h2>
          <p className="mt-5 max-w-[30rem] text-lg leading-relaxed text-pretty text-muted-foreground">
            Add a few paragraphs, a file, or existing writing. Voxform learns
            your rhythm, vocabulary, and level of directness before creating a
            single draft.
          </p>
        </div>

        <VoiceWorkbench isVisible={isVisible} onNavigate={onNavigate} />
      </div>
    </section>
  )
}
