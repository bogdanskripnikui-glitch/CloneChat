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
    description: "Files, Telegram chats, answers, and phrase choices.",
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
  dark?: boolean
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
  dark = false,
}: PlatformSectionProps) {
  const { isVisible, ref } = useSectionVisible()

  return (
    <section
      ref={ref}
      id={id}
      aria-labelledby={titleId}
      className={cn(
        "flex h-[100svh] min-h-0 snap-start snap-always items-stretch overflow-hidden",
        dark && "bg-primary text-primary-foreground"
      )}
    >
      <div className="mobile-section-safe mx-auto flex h-full min-h-0 w-full max-w-[1440px] items-center px-4 pt-20 pb-4 sm:px-5 sm:pt-30 sm:pb-6 xl:px-8 xl:pt-32 xl:pb-8">
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
                      <Icon aria-hidden="true" strokeWidth={1.7} className="size-5" />
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
                <div className="platform-phone-fade relative mx-auto h-full w-auto max-w-full aspect-[1206/2622]">
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
                <Image
                  src={image}
                  alt={imageAlt}
                  fill
                  loading="lazy"
                  sizes="(max-width: 767px) 94vw, (max-width: 1200px) 54vw, 900px"
                  className="platform-desktop-fade block object-contain"
                />
              )}
            </div>

            {imageKind === "phone" && (
              <div className="pointer-events-none absolute inset-0 z-10" aria-hidden="true">
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
                        <strong className="block whitespace-nowrap text-sm leading-tight font-medium">
                          {feature.title}
                        </strong>
                        <span className="mt-1 block whitespace-nowrap text-xs leading-tight text-muted-foreground">
                          {feature.description}
                        </span>
                      </span>
                      <ArrowRightIcon className="ml-1 size-4 shrink-0 text-muted-foreground" strokeWidth={1.7} />
                    </div>
                  )
                })}
              </div>
            )}

            {imageKind === "desktop" && (
              <div className="pointer-events-none absolute inset-0 z-10" aria-hidden="true">
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
                        <strong className="block whitespace-nowrap text-sm leading-tight font-medium">
                          {feature.title}
                        </strong>
                        <span className="mt-1 block whitespace-nowrap text-xs leading-tight text-muted-foreground">
                          {feature.description}
                        </span>
                      </span>
                      <ArrowRightIcon className="ml-1 size-4 shrink-0 text-muted-foreground" strokeWidth={1.7} />
                    </div>
                  )
                })}
              </div>
            )}
          </figure>
        </div>
      </div>
    </section>
  )
}

export function MobileAppSection() {
  return (
    <PlatformSection
      id="mobile-app"
      titleId="mobile-app-title"
      label="VOXFORM for iOS"
      title="Your voice, in your pocket."
      description="Build a voice profile from the words you already use, then create posts, rewrite drafts, and answer messages in your own style."
      image="/voxform-ios-profiles-current.png"
      imageAlt="VOXFORM iOS Profiles screen with voice profile progress and training sources"
      imageKind="phone"
      features={mobileFeatures}
    />
  )
}

export function WebAppSection() {
  return (
    <PlatformSection
      id="web-app"
      titleId="web-app-title"
      label="VOXFORM for Web"
      title="One workspace for every version of you."
      description="Manage distinct style profiles, add source material, chat with AI, generate text, and turn a trained voice into audio from one focused workspace."
      image="/voxform-web-cutout-4k.png"
      imageAlt="VOXFORM Web profile library with Personal, Work, and Public voices"
      imageKind="desktop"
      features={webFeatures}
      dark
    />
  )
}
