"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"

import { ArrowRightIcon, SparklesIcon } from "lucide-react"

import { FooterSection, PricingSection } from "@/components/landing-sections"
import { RotatingHeroWord } from "@/components/rotating-hero-word"
import { VoiceCloneChat } from "@/components/voice-clone-chat"
import { VoiceFlowDiagram } from "@/components/voice-flow-diagram"
import { VoiceTrainingSection } from "@/components/voice-training-section"
import { WritingModes } from "@/components/voice-workbench"
import { buttonVariants } from "@/components/ui/button"
import { useMagneticProximitySurfaces } from "@/hooks/use-magnetic-proximity-surfaces"
import { cn } from "@/lib/utils"

const navigation = [
  { label: "Your voice", href: "#main-content" },
  { label: "Train your voice", href: "#voice-training" },
  { label: "AI clone", href: "#ai-clone" },
  { label: "Writing modes", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
  { label: "Get in touch", href: "#footer-cta" },
]

export default function Page() {
  const [isHeroVisible, setIsHeroVisible] = useState(false)
  const [activeNavHref, setActiveNavHref] = useState("#main-content")
  const [scrollDirection, setScrollDirection] = useState<
    "forward" | "backward"
  >("forward")
  const dotFieldRef = useRef<HTMLCanvasElement>(null)
  const mainRef = useRef<HTMLElement>(null)
  const heroRef = useRef<HTMLElement>(null)

  useMagneticProximitySurfaces()

  function navigateToSection(href: string) {
    const target = document.querySelector<HTMLElement>(href)
    if (!target) return

    target.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  function handleMenuClick(
    event: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>,
    href: string
  ) {
    event.preventDefault()
    navigateToSection(href)
  }

  useEffect(() => {
    const canvas = dotFieldRef.current
    if (!canvas) return

    const context = canvas.getContext("2d")
    if (!context) return

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches
    const pointer = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      targetX: window.innerWidth / 2,
      targetY: window.innerHeight / 2,
      active: false,
      targetActive: false,
    }

    const field = {
      width: 0,
      height: 0,
      spacing: 22,
      radius: 172,
      strength: 8.5,
      opacity: 0.085,
      activeOpacity: 0.18,
      dotRadius: 1.05,
      dpr: 1,
    }

    let frameId = 0
    let isRunning = false

    const draw = () => {
      context.clearRect(0, 0, field.width, field.height)

      for (let y = field.spacing; y < field.height; y += field.spacing) {
        for (let x = field.spacing; x < field.width; x += field.spacing) {
          let drawX = x
          let drawY = y
          let alpha = field.opacity

          if (pointer.active || pointer.targetActive) {
            const dx = pointer.x - x
            const dy = pointer.y - y
            const distance = Math.hypot(dx, dy)

            if (distance < field.radius) {
              const influence = 1 - distance / field.radius
              const easedInfluence = influence * influence * (2.2 - influence)
              const shift = field.strength * easedInfluence

              if (distance > 0.001) {
                drawX += (dx / distance) * shift
                drawY += (dy / distance) * shift
              }

              alpha += (field.activeOpacity - field.opacity) * easedInfluence
            }
          }

          context.beginPath()
          context.fillStyle = `rgb(29 30 34 / ${alpha})`
          context.arc(drawX, drawY, field.dotRadius, 0, Math.PI * 2)
          context.fill()
        }
      }
    }

    const step = () => {
      frameId = 0

      if (!reducedMotion) {
        pointer.x += (pointer.targetX - pointer.x) * 0.09
        pointer.y += (pointer.targetY - pointer.y) * 0.09

        if (pointer.targetActive !== pointer.active) {
          pointer.active = pointer.targetActive
        }
      }

      draw()

      const shouldContinue =
        !reducedMotion &&
        (Math.abs(pointer.targetX - pointer.x) > 0.12 ||
          Math.abs(pointer.targetY - pointer.y) > 0.12 ||
          pointer.active !== pointer.targetActive)

      if (shouldContinue) {
        frameId = window.requestAnimationFrame(step)
      } else {
        isRunning = false
      }
    }

    const requestDraw = () => {
      if (isRunning) return
      isRunning = true
      frameId = window.requestAnimationFrame(step)
    }

    const resizeCanvas = () => {
      field.dpr = Math.min(window.devicePixelRatio || 1, 2)
      field.width = window.innerWidth
      field.height = window.innerHeight
      canvas.width = Math.round(field.width * field.dpr)
      canvas.height = Math.round(field.height * field.dpr)
      canvas.style.width = `${field.width}px`
      canvas.style.height = `${field.height}px`
      context.setTransform(field.dpr, 0, 0, field.dpr, 0, 0)
      draw()
    }

    const handlePointerMove = (event: MouseEvent) => {
      if (reducedMotion) return
      pointer.targetX = event.clientX
      pointer.targetY = event.clientY
      pointer.targetActive = true
      requestDraw()
    }

    const handlePointerLeave = () => {
      if (reducedMotion) return
      pointer.targetActive = false
      requestDraw()
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)
    window.addEventListener("mousemove", handlePointerMove, { passive: true })
    window.addEventListener("mouseleave", handlePointerLeave)

    return () => {
      if (frameId !== 0) {
        window.cancelAnimationFrame(frameId)
      }
      window.removeEventListener("resize", resizeCanvas)
      window.removeEventListener("mousemove", handlePointerMove)
      window.removeEventListener("mouseleave", handlePointerLeave)
    }
  }, [])

  useEffect(() => {
    const node = heroRef.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsHeroVisible(entry.isIntersecting)
      },
      { threshold: 0.55 }
    )

    observer.observe(node)

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const mainNode = mainRef.current
    if (!mainNode) return

    const trackedSections = navigation
      .map((item) => ({
        href: item.href,
        element: document.querySelector<HTMLElement>(item.href),
      }))
      .filter(
        (
          item
        ): item is {
          href: string
          element: HTMLElement
        } => Boolean(item.element)
      )

    let frameId = 0
    let previousScrollTop = mainNode.scrollTop

    const updateHeaderProgress = () => {
      frameId = 0

      const viewportHeight = mainNode.clientHeight
      const scrollTop = mainNode.scrollTop

      if (Math.abs(scrollTop - previousScrollTop) > 1) {
        setScrollDirection(
          scrollTop > previousScrollTop ? "forward" : "backward"
        )
        previousScrollTop = scrollTop
      }

      const activeSection =
        trackedSections.findLast(
          ({ element }) =>
            scrollTop + viewportHeight * 0.38 >= element.offsetTop
        ) ?? trackedSections[0]

      if (activeSection) {
        setActiveNavHref(activeSection.href)
      }
    }

    const requestUpdate = () => {
      if (frameId !== 0) return
      frameId = window.requestAnimationFrame(updateHeaderProgress)
    }

    requestUpdate()
    mainNode.addEventListener("scroll", requestUpdate, { passive: true })
    window.addEventListener("resize", requestUpdate)

    return () => {
      if (frameId !== 0) {
        window.cancelAnimationFrame(frameId)
      }
      mainNode.removeEventListener("scroll", requestUpdate)
      window.removeEventListener("resize", requestUpdate)
    }
  }, [])

  const isHeaderCompact = !isHeroVisible
  const activeNavIndex = Math.max(
    navigation.findIndex((item) => item.href === activeNavHref),
    0
  )

  return (
    <main
      ref={mainRef}
      className="relative isolate h-[100svh] min-h-0 snap-y snap-mandatory overflow-x-clip overflow-y-auto overscroll-y-none"
    >
      <canvas
        ref={dotFieldRef}
        aria-hidden="true"
        className="interactive-dot-field"
      />

      <a
        href="#main-content"
        className="sr-only z-50 rounded-md bg-primary px-4 py-2 text-primary-foreground focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
      >
        Skip to content
      </a>

      <section
        ref={heroRef}
        id="main-content"
        aria-labelledby="hero-heading"
        className="flex h-[100svh] min-h-0 snap-start snap-always flex-col overflow-hidden"
      >
        <header className="mobile-header-safe fixed inset-x-0 top-0 z-30 px-3 pt-3 sm:px-5 sm:pt-5 xl:px-8">
          <nav
            aria-label="Primary navigation"
            className={cn(
              "screen-reveal screen-reveal-delay-1 header-shell mx-auto flex h-16 max-w-[1080px] items-center gap-3 rounded-[22px] bg-white px-3 shadow-[0_18px_55px_rgba(29,30,34,0.08)] backdrop-blur-sm sm:h-20 sm:gap-6 sm:rounded-[28px] sm:px-5 lg:px-6",
              isHeaderCompact ? "sm:px-6 lg:px-7" : "sm:px-5 lg:px-6"
            )}
          >
            <a
              href="#main-content"
              aria-label="Voxform home"
              translate="no"
              className={cn(
                "header-brand header-brand-motion flex min-h-11 shrink-0 items-center gap-2 sm:gap-3",
                isHeaderCompact ? "is-compact xl:pointer-events-none" : ""
              )}
              onClick={(event) => handleMenuClick(event, "#main-content")}
            >
              <span className="flex size-8 items-center justify-center rounded-[10px] bg-primary text-primary-foreground sm:size-9 sm:rounded-[12px]">
                <SparklesIcon
                  aria-hidden="true"
                  strokeWidth={1.8}
                  className="size-4.5"
                />
              </span>
              <span className="text-base font-semibold tracking-[-0.03em] sm:text-[1.05rem]">
                VOXFORM
              </span>
            </a>

            <div
              className={cn(
                "header-nav hidden flex-1 xl:flex",
                isHeaderCompact
                  ? [
                      "header-nav-compact flex-1 justify-center",
                      scrollDirection === "forward"
                        ? "is-forward"
                        : "is-backward",
                    ]
                  : "items-center justify-center gap-8"
              )}
            >
              {navigation.map((item, index) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(event) => handleMenuClick(event, item.href)}
                  className={cn(
                    "header-nav-link text-[0.95rem] transition-[color,opacity,transform] duration-200 hover:text-foreground focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring",
                    isHeaderCompact
                      ? [
                          activeNavHref === item.href ? "is-active" : "",
                          index <= activeNavIndex ? "is-complete" : "",
                        ]
                      : activeNavHref === item.href
                        ? "font-semibold text-foreground"
                        : "text-muted-foreground"
                  )}
                >
                  {item.label}
                </a>
              ))}
            </div>

            <Link
              href="/dashboard"
              className={cn(
                buttonVariants({ size: "default" }),
                "header-cta header-cta-motion ml-auto shrink-0 px-4 sm:px-6",
                isHeaderCompact ? "is-compact xl:pointer-events-none" : ""
              )}
            >
              Get started
            </Link>
          </nav>
        </header>

        <div className="mobile-section-safe mx-auto flex min-h-0 w-full max-w-[1440px] flex-1 flex-col px-4 pt-20 pb-3 sm:px-5 sm:pt-30 sm:pb-8 xl:px-8 xl:pt-32 xl:pb-8">
          <div className="grid min-h-0 flex-1 items-center gap-2 sm:gap-6 lg:grid-cols-[minmax(0,0.84fr)_minmax(31rem,1.16fr)] lg:gap-14">
            <div className="flex max-w-[39rem] flex-col items-start max-lg:mx-auto max-lg:items-center max-lg:text-center">
              <h1
                id="hero-heading"
                className={`screen-shift ${
                  isHeroVisible
                    ? "screen-shift-visible screen-shift-delay-2"
                    : ""
                } text-[clamp(2.35rem,4.6vw,4.35rem)] leading-[0.94] font-medium tracking-[-0.04em] text-balance`}
              >
                <RotatingHeroWord />
              </h1>
              <p
                className={`hero-mobile-description screen-shift mt-3 max-w-[34rem] text-base leading-relaxed text-pretty text-muted-foreground max-lg:mx-auto sm:mt-5 lg:mt-7 lg:text-lg ${
                  isHeroVisible
                    ? "screen-shift-visible screen-shift-delay-3"
                    : ""
                }`}
              >
                Add your writing once. Create messages, posts, and articles that
                still sound unmistakably like you.
              </p>

              <div
                className={`screen-shift mt-9 hidden flex-col gap-3 max-[920px]:mt-6 max-lg:justify-center sm:flex-row md:flex ${
                  isHeroVisible
                    ? "screen-shift-visible screen-shift-delay-4"
                    : ""
                }`}
              >
                <Link
                  href="/dashboard"
                  className={cn(buttonVariants({ size: "lg" }))}
                >
                  Start with my voice
                </Link>
                <a
                  href="#voice-training"
                  onClick={(event) => handleMenuClick(event, "#voice-training")}
                  className={cn(
                    buttonVariants({ variant: "outline", size: "lg" })
                  )}
                >
                  See how it works
                  <ArrowRightIcon data-icon="inline-end" aria-hidden="true" />
                </a>
              </div>

              <p
                className={`screen-shift mt-5 hidden text-sm text-muted-foreground max-[920px]:mt-4 md:block ${
                  isHeroVisible
                    ? "screen-shift-visible screen-shift-delay-5"
                    : ""
                }`}
              >
                No account needed for your first analysis.
              </p>
            </div>

            <VoiceFlowDiagram isActive={isHeroVisible} />
          </div>
        </div>
      </section>

      <VoiceTrainingSection onNavigate={navigateToSection} />
      <VoiceCloneChat />
      <WritingModes />
      <PricingSection onNavigate={navigateToSection} />
      <FooterSection onNavigate={navigateToSection} />
    </main>
  )
}
