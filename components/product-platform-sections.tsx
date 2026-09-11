"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import {
  ArrowRightIcon,
  BotIcon,
  FileTextIcon,
  FolderUpIcon,
  Layers3Icon,
  MessageCircleIcon,
  MessagesSquareIcon,
  PanelsTopLeftIcon,
  PenLineIcon,
  PlugZapIcon,
  SlidersHorizontalIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { SiteLegalFooter } from "@/components/site-legal-footer"

function useSectionVisible(threshold = 0.38) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [threshold])

  return { isVisible, ref }
}

const mobileFeatures = [
  {
    icon: FileTextIcon,
    title: "Train from real material",
    description: "Files, notes, answers, and phrase choices.",
  },
  {
    icon: MessagesSquareIcon,
    title: "A separate voice for every role",
    description: "Each profile keeps its own chat history and style.",
  },
  {
    icon: PenLineIcon,
    title: "Create in your style",
    description: "Outline, rewrite, stylize, or answer from one screen.",
  },
] as const

const webFeatures = [
  {
    icon: MessageCircleIcon,
    title: "Profiles and source library",
    description: "Keep personal, work, and public voices separate.",
  },
  {
    icon: BotIcon,
    title: "Chat and text generation",
    description: "Write, adapt, and continue conversations with AI.",
  },
  {
    icon: SlidersHorizontalIcon,
    title: "Voice and integrations",
    description: "Clone speech and connect the providers you already use.",
  },
] as const

const floatingMobileFeatures = [
  {
    icon: FileTextIcon,
    title: "Train your voice",
    description: "Writing, chats & files",
    position: "platform-float-top-left",
  },
  {
    icon: MessagesSquareIcon,
    title: "AI chat",
    description: "A memory for every voice",
    position: "platform-float-top-right",
  },
  {
    icon: PenLineIcon,
    title: "Rewrite",
    description: "Keep your natural rhythm",
    position: "platform-float-bottom-left",
  },
  {
    icon: BotIcon,
    title: "Answer",
    description: "Reply in your own style",
    position: "platform-float-bottom-right",
  },
] as const

const floatingDesktopFeatures = [
  {
    icon: Layers3Icon,
    title: "Multiple workspaces",
    description: "Personal, work & public profiles",
    position: "platform-desktop-float-top-left",
  },
  {
    icon: FolderUpIcon,
    title: "Bulk imports",
    description: "ZIP, TXT, Markdown, JSON & HTML",
    position: "platform-desktop-float-top-right",
  },
  {
    icon: PanelsTopLeftIcon,
    title: "Desktop canvas",
    description: "More context on one screen",
    position: "platform-desktop-float-bottom-left",
  },
  {
    icon: PlugZapIcon,
    title: "Provider integrations",
    description: "Connect models and voice services",
    position: "platform-desktop-float-bottom-right",
  },
] as const

type PlatformSectionProps = {
  id: string
  titleId: string
  label: string
  title: string
  description: string
  image: string
  imageAlt: string
  imageKind: "phone" | "desktop"
  features: typeof mobileFeatures | typeof webFeatures
  releaseKind: "ios" | "web"
  dark?: boolean
}

function AppleMark() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="size-7 shrink-0 fill-current"
    >
      <path d="M17.05 12.54c.03-2.44 2-3.62 2.09-3.68a4.48 4.48 0 0 0-3.53-1.91c-1.48-.16-2.92.89-3.67.89-.77 0-1.93-.87-3.18-.84a4.69 4.69 0 0 0-3.94 2.4c-1.7 2.94-.43 7.27 1.2 9.64.82 1.16 1.77 2.46 3.02 2.41 1.22-.05 1.68-.77 3.16-.77 1.46 0 1.9.77 3.17.74 1.31-.02 2.14-1.17 2.93-2.34a9.65 9.65 0 0 0 1.34-2.73 4.21 4.21 0 0 1-2.59-3.81ZM14.64 5.38a4.27 4.27 0 0 0 .98-3.07 4.36 4.36 0 0 0-2.83 1.46 4.07 4.07 0 0 0-1 2.96 3.6 3.6 0 0 0 2.85-1.35Z" />
    </svg>
  )
}

function ReleaseDetails({
  kind,
  dark,
}: {
  kind: "ios" | "web"
  dark: boolean
}) {
  const noteId = `${kind}-availability-note`

  return (
    <div className="platform-release mt-7">
      <p
        className={cn(
          "text-xs font-medium tracking-[0.12em] uppercase",
          dark ? "text-primary-foreground/48" : "text-muted-foreground"
        )}
      >
        Planned pricing
      </p>
      <div
        className={cn(
          "mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm",
          dark ? "text-primary-foreground/74" : "text-foreground/72"
        )}
      >
        <span>3-day free trial</span>
        <span aria-hidden="true">·</span>
        <span>$4.99 per month</span>
        <span aria-hidden="true">·</span>
        <span>$49.99 per year</span>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        {kind === "ios" ? (
          <Button
            type="button"
            disabled
            aria-disabled="true"
            aria-describedby={noteId}
            className="h-auto min-w-[12.5rem] justify-start gap-3 rounded-[12px] px-4 py-2.5 disabled:pointer-events-none disabled:opacity-100"
          >
            <AppleMark />
            <span className="text-left leading-none">
              <span className="block text-[0.62rem] font-normal tracking-normal">
                Download on the
              </span>
              <span className="mt-1 block text-lg font-medium tracking-[-0.02em]">
                App Store
              </span>
            </span>
          </Button>
        ) : (
          <Button
            type="button"
            disabled
            aria-disabled="true"
            aria-describedby={noteId}
            variant="secondary"
            className="min-w-[10rem] disabled:pointer-events-none disabled:opacity-100"
          >
            Coming soon
          </Button>
        )}
        <span
          id={noteId}
          className={cn(
            kind === "web" ? "sr-only" : "text-sm",
            dark ? "text-primary-foreground/54" : "text-muted-foreground"
          )}
        >
          Coming soon
        </span>
      </div>
    </div>
  )
}

function PlatformSection({
  id,
  titleId,
  label,
  title,
  description,
  image,
  imageAlt,
  imageKind,
  features,
  releaseKind,
  dark = false,
}: PlatformSectionProps) {
  const { isVisible, ref } = useSectionVisible()

  return (
    <section
      ref={ref}
      id={id}
      aria-labelledby={titleId}
      className={cn(
        "relative flex h-[100svh] min-h-0 snap-start snap-always items-stretch overflow-hidden",
        dark && "bg-primary text-primary-foreground"
      )}
    >
      <div
        className={cn(
          "mobile-section-safe mx-auto flex h-full min-h-0 w-full max-w-[1440px] items-center px-4 pt-20 pb-4 sm:px-5 sm:pt-30 sm:pb-6 xl:px-8 xl:pt-32 xl:pb-8",
          releaseKind === "web" && "platform-section-with-footer"
        )}
      >
        <div className="grid h-full min-h-0 w-full items-center gap-5 md:grid-cols-[minmax(0,0.88fr)_minmax(22rem,1.12fr)] md:gap-8 xl:gap-16">
          <div className="flex min-h-0 flex-col justify-center md:max-w-[34rem]">
            <p
              className={cn(
                "screen-shift text-sm font-medium",
                dark ? "text-primary-foreground/58" : "text-muted-foreground",
                isVisible && "screen-shift-visible screen-shift-delay-1"
              )}
            >
              {label}
            </p>
            <h2
              id={titleId}
              className={cn(
                "screen-shift mt-3 max-w-[11ch] text-[clamp(2.55rem,5.3vw,5.4rem)] leading-[0.93] font-medium tracking-[-0.045em] text-balance",
                isVisible && "screen-shift-visible screen-shift-delay-2"
              )}
            >
              {title}
            </h2>
            <p
              className={cn(
                "platform-description screen-shift mt-5 max-w-[33rem] text-base leading-relaxed text-pretty lg:text-lg",
                dark ? "text-primary-foreground/68" : "text-muted-foreground",
                isVisible && "screen-shift-visible screen-shift-delay-3"
              )}
            >
              {description}
            </p>

            <div className="platform-feature-list mt-7 grid gap-3">
              {features.map((feature, index) => {
                const Icon = feature.icon
                return (
                  <div
                    key={feature.title}
                    className={cn(
                      "screen-shift grid grid-cols-[2.5rem_minmax(0,1fr)] items-center gap-3",
                      isVisible &&
                        `screen-shift-visible ${index === 0 ? "screen-shift-delay-3" : index === 1 ? "screen-shift-delay-4" : "screen-shift-delay-5"}`
                    )}
                  >
                    <span
                      className={cn(
                        "flex size-10 items-center justify-center rounded-[12px]",
                        dark
                          ? "bg-white/9 text-primary-foreground"
                          : "bg-white text-foreground shadow-[0_10px_30px_rgba(29,30,34,0.06)]"
                      )}
                    >
                      <Icon
                        aria-hidden="true"
                        strokeWidth={1.7}
                        className="size-5"
                      />
                    </span>
                    <div className="min-w-0">
                      <h3 className="text-[0.98rem] leading-tight font-medium">
                        {feature.title}
                      </h3>
                      <p
                        className={cn(
                          "platform-feature-description mt-1 text-sm leading-snug",
                          dark
                            ? "text-primary-foreground/56"
                            : "text-muted-foreground"
                        )}
                      >
                        {feature.description}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
            <ReleaseDetails kind={releaseKind} dark={dark} />
          </div>

          <figure
            className={cn(
              "platform-visual screen-shift relative flex min-h-0 items-center justify-center overflow-visible",
              imageKind === "phone"
                ? "h-[min(64vh,39rem)]"
                : "h-[min(72vh,48rem)]",
              isVisible && "screen-shift-visible screen-shift-delay-3"
            )}
          >
            <div
              className={cn(
                "relative max-h-full w-full",
                imageKind === "phone"
                  ? "h-full max-w-[21rem]"
                  : "aspect-[4/3] max-w-[58rem] md:scale-[1.2]"
              )}
            >
              {imageKind === "phone" ? (
                <div className="platform-phone-fade relative mx-auto aspect-[1206/2622] h-full w-auto max-w-full">
                  <div className="platform-phone-shell absolute inset-0 overflow-hidden">
                    <Image
                      src={image}
                      alt={imageAlt}
                      fill
                      loading="eager"
                      sizes="(max-width: 767px) 56vw, (max-width: 1200px) 30vw, 336px"
                      className="block object-cover object-top"
                    />
                  </div>
                </div>
              ) : (
                <div className="platform-desktop-fade absolute inset-0">
                  <Image
                    src={image}
                    alt={imageAlt}
                    fill
                    loading="lazy"
                    sizes="(max-width: 767px) 94vw, (max-width: 1200px) 54vw, 900px"
                    className="block object-contain"
                  />
                  <span
                    className="platform-desktop-bezel-cleanup"
                    aria-hidden="true"
                  />
                </div>
              )}
            </div>

            {imageKind === "phone" && (
              <div
                className="pointer-events-none absolute inset-0 z-10"
                aria-hidden="true"
              >
                {floatingMobileFeatures.map((feature) => {
                  const Icon = feature.icon

                  return (
                    <div
                      key={feature.title}
                      className={cn(
                        "platform-floating-card absolute flex items-center gap-3 rounded-[18px] border border-black/6 bg-white/94 px-4 py-3 shadow-[0_18px_50px_rgba(29,30,34,0.12)] backdrop-blur-sm",
                        feature.position,
                        isVisible && "platform-floating-card-active"
                      )}
                    >
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-[12px] bg-secondary text-foreground">
                        <Icon className="size-5" strokeWidth={1.7} />
                      </span>
                      <span className="min-w-0">
                        <strong className="block text-sm leading-tight font-medium whitespace-nowrap">
                          {feature.title}
                        </strong>
                        <span className="mt-1 block text-xs leading-tight whitespace-nowrap text-muted-foreground">
                          {feature.description}
                        </span>
                      </span>
                      <ArrowRightIcon
                        className="ml-1 size-4 shrink-0 text-muted-foreground"
                        strokeWidth={1.7}
                      />
                    </div>
                  )
                })}
              </div>
            )}

            {imageKind === "desktop" && (
              <div
                className="pointer-events-none absolute inset-0 z-10"
                aria-hidden="true"
              >
                {floatingDesktopFeatures.map((feature) => {
                  const Icon = feature.icon

                  return (
                    <div
                      key={feature.title}
                      className={cn(
                        "platform-floating-card absolute flex items-center gap-3 rounded-[18px] border border-white/10 bg-white/95 px-4 py-3 text-foreground shadow-[0_18px_55px_rgba(0,0,0,0.28)] backdrop-blur-sm",
                        feature.position,
                        isVisible && "platform-floating-card-active"
                      )}
                    >
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-[12px] bg-secondary text-foreground">
                        <Icon className="size-5" strokeWidth={1.7} />
                      </span>
                      <span className="min-w-0">
                        <strong className="block text-sm leading-tight font-medium whitespace-nowrap">
                          {feature.title}
                        </strong>
                        <span className="mt-1 block text-xs leading-tight whitespace-nowrap text-muted-foreground">
                          {feature.description}
                        </span>
                      </span>
                      <ArrowRightIcon
                        className="ml-1 size-4 shrink-0 text-muted-foreground"
                        strokeWidth={1.7}
                      />
                    </div>
                  )
                })}
              </div>
            )}
          </figure>
        </div>
      </div>
      {releaseKind === "web" ? (
        <div className="absolute inset-x-0 bottom-0 z-20 bg-primary/92 backdrop-blur-sm">
          <SiteLegalFooter inverse />
        </div>
      ) : null}
    </section>
  )
}

export function MobileAppSection() {
  return (
    <PlatformSection
      id="mobile-app"
      titleId="mobile-app-title"
      label="Youmanize for iOS"
      title="Your voice, in your pocket."
      description="Build a voice profile from the words you already use, then create posts, rewrite drafts, and answer messages in your own style."
      image="/voxform-ios-profiles-current.png"
      imageAlt="Youmanize iOS Profiles screen with voice profile progress and training sources"
      imageKind="phone"
      features={mobileFeatures}
      releaseKind="ios"
    />
  )
}

export function WebAppSection() {
  return (
    <PlatformSection
      id="web-app"
      titleId="web-app-title"
      label="Youmanize for Web"
      title="One workspace for every version of you."
      description="Manage distinct style profiles, add source material, chat with AI, generate text, and turn a trained voice into audio from one focused workspace."
      image="/voxform-web-cutout-4k.png"
      imageAlt="Youmanize Web profile library with Personal, Work, and Public voices"
      imageKind="desktop"
      features={webFeatures}
      releaseKind="web"
      dark
    />
  )
}
