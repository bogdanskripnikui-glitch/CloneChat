"use client"

import { useEffect, useRef, useState } from "react"

import {
  ArrowRightIcon,
  FileTextIcon,
  MailIcon,
  MessageSquareTextIcon,
  NotebookPenIcon,
  SendIcon,
  SparklesIcon,
} from "lucide-react"

import { FooterSection, PricingSection } from "@/components/landing-sections"
import { RotatingHeroWord } from "@/components/rotating-hero-word"
import { VoiceCloneChat } from "@/components/voice-clone-chat"
import {
  type DraftKind,
  VoiceWorkbench,
  WritingModes,
} from "@/components/voice-workbench"
import { buttonVariants } from "@/components/ui/button"
import { useMagneticProximitySurfaces } from "@/hooks/use-magnetic-proximity-surfaces"
import { cn } from "@/lib/utils"

const navigation = [
  { label: "Your voice", href: "#main-content" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
  { label: "Get in touch", href: "#footer-cta" },
]

const useCases = [
  { label: "Posts", icon: NotebookPenIcon, value: "post" },
  { label: "Messages", icon: MessageSquareTextIcon, value: "message" },
  { label: "Emails", icon: MailIcon, value: "email" },
  { label: "Articles", icon: FileTextIcon, value: "article" },
  { label: "Replies", icon: SendIcon, value: "reply" },
] as const satisfies ReadonlyArray<{
  label: string
  icon: typeof NotebookPenIcon
  value: DraftKind
}>

export default function Page() {
  const [isHeroVisible, setIsHeroVisible] = useState(false)
  const [activeDraft, setActiveDraft] = useState<DraftKind>("post")
  const [activeNavHref, setActiveNavHref] = useState("#main-content")
  const [scrollDirection, setScrollDirection] = useState<"forward" | "backward">(
    "forward"
  )
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

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
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
        setScrollDirection(scrollTop > previousScrollTop ? "forward" : "backward")
        previousScrollTop = scrollTop
      }

      const activeSection =
        trackedSections.findLast(
          ({ element }) => scrollTop + viewportHeight * 0.38 >= element.offsetTop
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
        <header className="fixed inset-x-0 top-0 z-30 px-4 pt-4 sm:px-5 sm:pt-5 lg:px-8">
          <nav
            aria-label="Primary navigation"
            className={cn(
              "screen-reveal screen-reveal-delay-1 header-shell mx-auto flex max-w-[1080px] items-center gap-6 rounded-[28px] bg-white shadow-[0_18px_55px_rgba(29,30,34,0.08)] backdrop-blur-sm",
              isHeaderCompact
                ? "h-20 px-5 sm:px-6 lg:px-7"
                : "h-20 px-4 sm:px-5 lg:px-6"
            )}
          >
            <a
              href="#main-content"
              aria-label="Voxform home"
              translate="no"
              className={cn(
                "header-brand header-brand-motion shrink-0 flex items-center gap-3",
                isHeaderCompact
                  ? "pointer-events-none is-compact"
                  : ""
              )}
              onClick={(event) => handleMenuClick(event, "#main-content")}
            >
              <span className="flex size-9 items-center justify-center rounded-[12px] bg-primary text-primary-foreground">
                <SparklesIcon
                  aria-hidden="true"
                  strokeWidth={1.8}
                  className="size-4.5"
                />
              </span>
              <span className="text-[1.05rem] font-semibold tracking-[-0.03em]">
                VOXFORM
              </span>
            </a>

            <div
              className={cn(
                "header-nav hidden flex-1 lg:flex",
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

            <a
              href="#voice-workbench"
              onClick={(event) => handleMenuClick(event, "#voice-workbench")}
              className={cn(
                buttonVariants({ size: "default" }),
                "header-cta header-cta-motion ml-auto shrink-0 px-6",
                isHeaderCompact
                  ? "pointer-events-none is-compact"
                  : ""
              )}
            >
              Get started
            </a>
          </nav>
        </header>

        <div className="mx-auto flex min-h-0 w-full max-w-[1440px] flex-1 flex-col px-4 pt-28 pb-6 sm:px-5 sm:pt-30 sm:pb-8 lg:px-8 max-[920px]:pt-24 max-[920px]:pb-4">
          <div className="grid min-h-0 flex-1 items-center gap-10 lg:grid-cols-[minmax(0,0.84fr)_minmax(31rem,1.16fr)] lg:gap-14 max-[920px]:gap-6 max-md:gap-3">
            <div className="flex max-w-[39rem] flex-col items-start">
              <h1
                id="hero-heading"
                className={`screen-shift ${
                  isHeroVisible ? "screen-shift-visible screen-shift-delay-2" : ""
                } text-[clamp(3rem,5.4vw,4.9rem)] leading-[0.94] font-medium tracking-[-0.04em] text-balance`}
              >
                <RotatingHeroWord />
              </h1>
              <p
                className={`screen-shift mt-7 max-w-[34rem] text-lg leading-relaxed text-pretty text-muted-foreground max-[920px]:mt-5 max-[920px]:text-base ${
                  isHeroVisible ? "screen-shift-visible screen-shift-delay-3" : ""
                }`}
              >
                Add your writing once. Create messages, posts, and articles that
                still sound unmistakably like you.
              </p>

              <div
                className={`screen-shift mt-9 hidden flex-col gap-3 sm:flex-row max-[920px]:mt-6 md:flex ${
                  isHeroVisible ? "screen-shift-visible screen-shift-delay-4" : ""
                }`}
              >
                <a
                  href="#voice-workbench"
                  onClick={(event) =>
                    handleMenuClick(event, "#voice-workbench")
                  }
                  className={cn(buttonVariants({ size: "lg" }))}
                >
                  Start with my voice
                </a>
                <a
                  href="#ai-clone"
                  onClick={(event) => handleMenuClick(event, "#ai-clone")}
                  className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
                >
                  See how it works
                  <ArrowRightIcon data-icon="inline-end" aria-hidden="true" />
                </a>
              </div>

              <p
                className={`screen-shift mt-5 hidden text-sm text-muted-foreground max-[920px]:mt-4 md:block ${
                  isHeroVisible ? "screen-shift-visible screen-shift-delay-5" : ""
                }`}
              >
                No account needed for your first analysis.
              </p>
            </div>

            <VoiceWorkbench
              isVisible={isHeroVisible}
              onNavigate={navigateToSection}
            />
          </div>

          <section
            id="use-cases"
            aria-label="Use cases"
            className={`hero-use-cases-strip screen-shift w-full pt-5 pb-8 sm:pt-6 sm:pb-10 max-[920px]:pt-3 max-[920px]:pb-6 ${
              isHeroVisible ? "screen-shift-visible screen-shift-delay-6" : ""
            }`}
          >
            <div className="w-full">
              <div className="flex w-full items-center justify-between">
                {useCases.map(({ label, icon: Icon, value }, index) => (
                  <div key={label} className="flex flex-1 items-center">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveDraft(value)
                        navigateToSection("#voice-workbench")
                      }}
                      className={cn(
                        "flex w-full items-center justify-center gap-4 py-3 transition-opacity duration-160 hover:opacity-100 sm:gap-5",
                        value === "message" ? "message-icon-trigger" : ""
                      )}
                    >
                      <Icon
                        aria-hidden="true"
                        strokeWidth={1.45}
                        className="size-6 text-foreground sm:size-7"
                      />
                      <span
                        className={`text-[0.95rem] font-medium sm:text-base ${
                          activeDraft === value
                            ? "text-foreground"
                            : "text-foreground/72"
                        }`}
                      >
                        {label}
                      </span>
                    </button>
                    {index < useCases.length - 1 ? (
                      <span
                        aria-hidden="true"
                        className="mx-auto h-12 w-px bg-border/90 sm:h-14"
                      />
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </section>

      <VoiceCloneChat />
      <WritingModes />
      <PricingSection onNavigate={navigateToSection} />
      <FooterSection onNavigate={navigateToSection} />
    </main>
  )
}
