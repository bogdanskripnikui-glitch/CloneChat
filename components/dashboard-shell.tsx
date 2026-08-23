"use client"

import Link from "next/link"
import { useEffect, useMemo, useRef, useState } from "react"
import { Dialog } from "@base-ui/react/dialog"
import {
  ArrowRightIcon,
  CheckIcon,
  CopyIcon,
  CreditCardIcon,
  CrownIcon,
  DownloadIcon,
  FileTextIcon,
  LayoutDashboardIcon,
  LogOutIcon,
  MailIcon,
  MenuIcon,
  MessageCircleIcon,
  MessageSquareTextIcon,
  MoreVerticalIcon,
  NotebookPenIcon,
  PencilIcon,
  PlusIcon,
  SendIcon,
  Settings2Icon,
  SparklesIcon,
  Trash2Icon,
  XIcon,
} from "lucide-react"

import { Button, buttonVariants } from "@/components/ui/button"
import { DashboardAiChat } from "@/components/dashboard-ai-chat"
import { LanguageSwitcher } from "@/components/language-switcher"
import { VoiceWorkbench } from "@/components/voice-workbench"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { VoiceAnalysis, VoiceProfile } from "@/lib/stylelab/types"
import { cn } from "@/lib/utils"

type DashboardSection = "dashboard" | "chat" | "billing" | "settings"
type OutputKind = "post" | "message" | "email" | "article" | "reply"
type BillingCycle = "monthly" | "yearly"

const baseVoices: VoiceProfile[] = [
  {
    id: "founder",
    name: "Founder voice",
    summary: "Direct, calm, product-facing",
  },
  {
    id: "operator",
    name: "Operator voice",
    summary: "Structured, low-friction, internal clarity",
  },
]

const outputTemplates: Record<
  OutputKind,
  {
    label: string
    eyebrow: string
    title: string
    icon: typeof NotebookPenIcon
    transform: (source: string, voice: VoiceProfile) => string
  }
> = {
  post: {
    label: "Post",
    eyebrow: "Launch post",
    title: "A cleaner way to scale your writing without losing your voice",
    icon: NotebookPenIcon,
    transform: (source, voice) =>
      `Most AI writing tools flatten people into the same tone. ${voice.name} keeps the opposite promise.\n\n${source.trim()}\n\nThe point lands faster, the tone stays composed, and the message keeps its human cadence.`,
  },
  message: {
    label: "Message",
    eyebrow: "Direct message",
    title: "Quick draft for a follow-up",
    icon: MessageSquareTextIcon,
    transform: (source, voice) =>
      `Wanted to send a clearer version. ${source.trim()}\n\nThis keeps the ${voice.summary.toLowerCase()} voice and makes the next action easier to read.`,
  },
  email: {
    label: "Email",
    eyebrow: "Outbound email",
    title: "Subject: Voice-consistent writing, without the generic AI layer",
    icon: MailIcon,
    transform: (source, voice) =>
      `Hi team,\n\n${source.trim()}\n\nI tightened the structure and kept the ${voice.summary.toLowerCase()} style intact.\n\nBest,\nYou`,
  },
  article: {
    label: "Article",
    eyebrow: "Article intro",
    title: "Why voice consistency matters more than raw generation speed",
    icon: FileTextIcon,
    transform: (source, voice) =>
      `${source.trim()}\n\nSpeed alone does not make AI writing useful. The real difference is whether output still feels authored — with your pacing, vocabulary, and intent intact.`,
  },
  reply: {
    label: "Reply",
    eyebrow: "Reply draft",
    title: "Short, human, on-brand",
    icon: SendIcon,
    transform: (source, voice) =>
      `Thanks — that’s exactly the kind of use case we designed for. ${source.trim()}\n\nThe goal is to keep your ${voice.summary.toLowerCase()} rhythm while adapting it to the moment.`,
  },
}

const initialDraft =
  "We are launching the next version of Voxform. It should sound clear, human, and useful. The message needs to work for a product update, an email, and a short direct message without losing the person behind the writing."

const railItems = [
  { value: "dashboard", icon: LayoutDashboardIcon, label: "Dashboard" },
  { value: "chat", icon: MessageCircleIcon, label: "AI chat" },
  { value: "billing", icon: CreditCardIcon, label: "Billing" },
  { value: "settings", icon: Settings2Icon, label: "Settings" },
] as const

const billingPlans = {
  monthly: [
    {
      name: "Free",
      price: "$0",
      note: "for first analysis",
      description: "Try the core workflow without an account.",
      features: [
        "1 voice profile",
        "5 generations per week",
        "Paste text and file upload",
      ],
      cta: "Start free",
      featured: false,
    },
    {
      name: "Pro",
      price: "$24",
      note: "per month",
      description: "For creators and operators who need daily output.",
      features: [
        "Unlimited generations",
        "Telegram chat imports",
        "Separate business and casual modes",
      ],
      cta: "Join Pro waitlist",
      featured: true,
    },
    {
      name: "Teams",
      price: "$79",
      note: "per workspace",
      description: "For teams that want shared voice systems and review flow.",
      features: [
        "Shared style libraries",
        "Approval-ready draft pipeline",
        "Priority onboarding",
      ],
      cta: "Request access",
      featured: false,
    },
  ],
  yearly: [
    {
      name: "Free",
      price: "$0",
      note: "always free",
      description: "Try the core workflow without an account.",
      features: [
        "1 voice profile",
        "5 generations per week",
        "Paste text and file upload",
      ],
      cta: "Start free",
      featured: false,
    },
    {
      name: "Pro",
      price: "$228",
      note: "per year · save 21%",
      description: "For creators and operators who need daily output.",
      features: [
        "Unlimited generations",
        "Telegram chat imports",
        "Separate business and casual modes",
      ],
      cta: "Join Pro waitlist",
      featured: true,
    },
    {
      name: "Teams",
      price: "$790",
      note: "per year",
      description: "For teams that want shared voice systems and review flow.",
      features: [
        "Shared style libraries",
        "Approval-ready draft pipeline",
        "Priority onboarding",
      ],
      cta: "Request access",
      featured: false,
    },
  ],
} as const

export function DashboardShell() {
  const [activeSection, setActiveSection] =
    useState<DashboardSection>("dashboard")
  const [voices, setVoices] = useState(baseVoices)
  const [activeVoiceId, setActiveVoiceId] = useState(baseVoices[0]?.id ?? "")
  const [sourceText, setSourceText] = useState(initialDraft)
  const [outputKind, setOutputKind] = useState<OutputKind>("post")
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly")
  const [savedCount, setSavedCount] = useState(2)
  const [copied, setCopied] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isVoiceDialogOpen, setIsVoiceDialogOpen] = useState(false)
  const [isVoiceDialogReady, setIsVoiceDialogReady] = useState(false)
  const [voiceDialogKey, setVoiceDialogKey] = useState(0)
  const [openVoiceMenuId, setOpenVoiceMenuId] = useState<string | null>(null)
  const [editingVoiceId, setEditingVoiceId] = useState<string | null>(null)
  const [editingVoiceName, setEditingVoiceName] = useState("")
  const voiceDialogRef = useRef<HTMLDialogElement>(null)
  const voiceLongPressTimerRef = useRef<number | null>(null)
  const voiceLongPressStartRef = useRef({ x: 0, y: 0 })
  const voiceLongPressTriggeredRef = useRef(false)

  useEffect(() => {
    const dialog = voiceDialogRef.current
    if (!dialog) return

    if (isVoiceDialogOpen && !dialog.open) {
      dialog.showModal()
    }

    if (!isVoiceDialogOpen && dialog.open) {
      dialog.close()
    }
  }, [isVoiceDialogOpen])

  useEffect(() => {
    if (!isVoiceDialogOpen) return
    const timer = window.setTimeout(() => setIsVoiceDialogReady(true), 420)
    return () => window.clearTimeout(timer)
  }, [isVoiceDialogOpen, voiceDialogKey])

  useEffect(() => {
    const hasMobileVoiceMenu =
      openVoiceMenuId !== null &&
      window.matchMedia("(max-width: 639px)").matches

    if (!isVoiceDialogOpen && !isMobileMenuOpen && !hasMobileVoiceMenu) return

    const scrollY = window.scrollY
    const body = document.body
    const root = document.documentElement
    const previousBody = {
      position: body.style.position,
      top: body.style.top,
      width: body.style.width,
      overflow: body.style.overflow,
    }
    const previousRootOverflow = root.style.overflow
    const previousRootOverscroll = root.style.overscrollBehavior

    body.style.position = "fixed"
    body.style.top = `-${scrollY}px`
    body.style.width = "100%"
    body.style.overflow = "hidden"
    root.style.overflow = "hidden"
    root.style.overscrollBehavior = "none"

    return () => {
      body.style.position = previousBody.position
      body.style.top = previousBody.top
      body.style.width = previousBody.width
      body.style.overflow = previousBody.overflow
      root.style.overflow = previousRootOverflow
      root.style.overscrollBehavior = previousRootOverscroll
      window.scrollTo(0, scrollY)
    }
  }, [isMobileMenuOpen, isVoiceDialogOpen, openVoiceMenuId])

  useEffect(() => {
    function closeVoiceMenu(event: PointerEvent) {
      const target = event.target
      if (
        !(target instanceof Element) ||
        !target.closest("[data-voice-menu]")
      ) {
        setOpenVoiceMenuId(null)
      }
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpenVoiceMenuId(null)
    }

    document.addEventListener("pointerdown", closeVoiceMenu)
    document.addEventListener("keydown", closeOnEscape)
    return () => {
      document.removeEventListener("pointerdown", closeVoiceMenu)
      document.removeEventListener("keydown", closeOnEscape)
    }
  }, [])

  const activeVoice = useMemo(
    () => voices.find((voice) => voice.id === activeVoiceId) ?? voices[0],
    [activeVoiceId, voices]
  )

  const resultText = useMemo(() => {
    if (!activeVoice) return ""
    return outputTemplates[outputKind].transform(sourceText, activeVoice)
  }, [activeVoice, outputKind, sourceText])

  function addVoice(name: string, analysis?: VoiceAnalysis) {
    const next = voices.length + 1
    const newVoice: VoiceProfile = {
      id: `voice-${next}`,
      name,
      summary: analysis?.summary || "Calm, controlled, multi-format",
      style: analysis?.style,
      lexicon: analysis?.lexicon,
      metrics: analysis?.metrics,
      examples: analysis?.examples,
    }

    setVoices((current) => [...current, newVoice])
    setActiveVoiceId(newVoice.id)
  }

  function finishVoiceAnalysis(name: string, analysis?: VoiceAnalysis) {
    addVoice(name, analysis)
    setIsVoiceDialogReady(false)
    setIsVoiceDialogOpen(false)
  }

  function openVoiceDialog() {
    setIsVoiceDialogReady(false)
    setVoiceDialogKey((current) => current + 1)
    setIsVoiceDialogOpen(true)
  }

  function removeVoice(id: string) {
    setOpenVoiceMenuId(null)
    const remainingVoices = voices.filter((voice) => voice.id !== id)
    setVoices(remainingVoices)

    if (activeVoiceId === id) {
      setActiveVoiceId(remainingVoices[0]?.id ?? "")
    }
  }

  function renameVoice(voice: VoiceProfile) {
    setOpenVoiceMenuId(null)
    setEditingVoiceId(voice.id)
    setEditingVoiceName(voice.name)
  }

  function cancelRename() {
    setEditingVoiceId(null)
    setEditingVoiceName("")
  }

  function saveRename(voice: VoiceProfile) {
    const nextName = editingVoiceName.trim()
    if (!nextName) return
    if (nextName === voice.name) {
      cancelRename()
      return
    }

    setVoices((current) =>
      current.map((item) =>
        item.id === voice.id ? { ...item, name: nextName } : item
      )
    )
    cancelRename()
  }

  function clearVoiceLongPressTimer() {
    if (voiceLongPressTimerRef.current === null) return
    window.clearTimeout(voiceLongPressTimerRef.current)
    voiceLongPressTimerRef.current = null
  }

  function startVoiceLongPress(
    event: React.PointerEvent<HTMLElement>,
    voiceId: string
  ) {
    if (event.pointerType === "mouse") return

    clearVoiceLongPressTimer()
    voiceLongPressTriggeredRef.current = false
    voiceLongPressStartRef.current = { x: event.clientX, y: event.clientY }
    voiceLongPressTimerRef.current = window.setTimeout(() => {
      voiceLongPressTriggeredRef.current = true
      setOpenVoiceMenuId(voiceId)
      navigator.vibrate?.(10)
    }, 520)
  }

  function moveVoiceLongPress(event: React.PointerEvent<HTMLElement>) {
    const { x, y } = voiceLongPressStartRef.current
    if (Math.hypot(event.clientX - x, event.clientY - y) > 8) {
      clearVoiceLongPressTimer()
    }
  }

  function finishVoiceLongPress() {
    clearVoiceLongPressTimer()
  }

  async function copyResult() {
    if (!resultText) return
    await navigator.clipboard.writeText(resultText)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1400)
  }

  function saveResult() {
    const blob = new Blob([resultText], { type: "text/plain;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement("a")
    anchor.href = url
    anchor.download = `voxform-${outputKind}.txt`
    anchor.click()
    URL.revokeObjectURL(url)
    setSavedCount((current) => current + 1)
  }

  const voiceCards = voices
  const openVoice = voices.find((voice) => voice.id === openVoiceMenuId)
  return (
    <main className="dashboard-surface relative min-h-svh overflow-x-hidden bg-background">
      <div
        className="dashboard-pattern pointer-events-none absolute inset-0"
        aria-hidden="true"
      />

      <div className="relative mx-auto min-h-svh w-full max-w-[1720px] p-3 sm:p-4">
        <div className="grid min-h-[calc(100svh-1.5rem)] sm:min-h-[calc(100svh-2rem)] xl:grid-cols-[5.5rem_minmax(0,1fr)]">
          <aside className="hidden min-h-0 flex-col px-2 py-3 xl:flex">
            <div className="flex flex-1 flex-col items-center justify-center gap-3">
              {railItems.map(({ value, icon: Icon, label }) => {
                const isActive = activeSection === value
                return (
                  <button
                    key={value}
                    type="button"
                    aria-label={label}
                    title={label}
                    onClick={() => setActiveSection(value)}
                    className={cn(
                      "flex size-10 items-center justify-center rounded-[10px] transition-[transform,background-color,color] duration-160 ease-[cubic-bezier(0.23,1,0.32,1)] hover:-translate-y-0.5 active:scale-[0.97]",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-[0_8px_18px_rgba(29,30,34,0.12)]"
                        : "text-muted-foreground hover:bg-black/5 hover:text-foreground"
                    )}
                  >
                    <Icon aria-hidden="true" className="size-4" />
                  </button>
                )
              })}
            </div>

            <div className="flex justify-center">
              <button
                type="button"
                aria-label="Add voice"
                title="Add voice"
                onClick={openVoiceDialog}
                className="flex size-10 items-center justify-center rounded-[10px] text-muted-foreground transition-[transform,background-color,color] duration-160 ease-[cubic-bezier(0.23,1,0.32,1)] hover:-translate-y-0.5 hover:bg-black/5 hover:text-foreground active:scale-[0.97]"
              >
                <PlusIcon aria-hidden="true" className="size-4" />
              </button>
            </div>
          </aside>

          <div className="flex min-w-0 flex-col">
            <header className="screen-reveal screen-reveal-delay-1 flex h-16 items-center gap-4 px-4 sm:px-5">
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-[14px] bg-primary text-primary-foreground shadow-[0_10px_24px_rgba(29,30,34,0.12)]">
                  <SparklesIcon aria-hidden="true" className="size-4.5" />
                </span>
                <div className="min-w-0">
                  <p className="text-[0.96rem] font-semibold tracking-[-0.03em]">
                    VOXFORM
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Dashboard preview
                  </p>
                </div>
              </div>

              <div className="ml-auto flex items-center gap-2">
                <LanguageSwitcher />
                <span className="hidden rounded-full border border-border/70 bg-background px-3 py-1 text-xs text-muted-foreground sm:inline-flex">
                  No password yet
                </span>
                <Link
                  href="/"
                  className={cn(
                    buttonVariants({ variant: "outline", size: "sm" }),
                    "hidden h-10 gap-2 px-3 text-xs xl:inline-flex"
                  )}
                >
                  <LogOutIcon data-icon="inline-start" aria-hidden="true" />
                  Log out
                </Link>
                <Dialog.Root
                  open={isMobileMenuOpen}
                  onOpenChange={setIsMobileMenuOpen}
                >
                  <Dialog.Trigger
                    className={cn(
                      buttonVariants({ variant: "outline", size: "sm" }),
                      "h-10 gap-2 px-3 text-xs active:scale-[0.97] xl:hidden"
                    )}
                  >
                    <MenuIcon aria-hidden="true" />
                    Menu
                  </Dialog.Trigger>

                  <Dialog.Portal>
                    <Dialog.Backdrop className="fixed inset-0 bg-black/28 opacity-100 transition-opacity duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] data-[ending-style]:opacity-0 data-[starting-style]:opacity-0" />
                    <Dialog.Popup className="fixed inset-y-0 left-0 flex w-[min(20rem,calc(100vw-2rem))] overscroll-contain bg-background p-4 shadow-[12px_0_36px_rgba(29,30,34,0.14)] transition-transform duration-200 ease-[cubic-bezier(0.32,0.72,0,1)] data-[ending-style]:-translate-x-full data-[starting-style]:-translate-x-full">
                      <div className="flex min-h-0 w-full flex-col">
                        <div className="flex items-center justify-between gap-3 border-b border-border/70 pb-4">
                          <div>
                            <Dialog.Title className="text-lg font-semibold tracking-[-0.03em]">
                              Menu
                            </Dialog.Title>
                            <Dialog.Description className="mt-0.5 text-xs text-muted-foreground">
                              Voxform dashboard
                            </Dialog.Description>
                          </div>
                          <Dialog.Close
                            aria-label="Close menu"
                            className="flex size-11 items-center justify-center rounded-[10px] text-muted-foreground transition-[transform,background-color,color] duration-160 ease-[cubic-bezier(0.23,1,0.32,1)] hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none active:scale-[0.97]"
                          >
                            <XIcon aria-hidden="true" className="size-4" />
                          </Dialog.Close>
                        </div>

                        <nav aria-label="Dashboard navigation" className="mt-4">
                          <ul className="flex flex-col gap-1.5">
                            {railItems.map(({ value, icon: Icon, label }) => {
                              const isActive = activeSection === value
                              return (
                                <li key={value}>
                                  <button
                                    type="button"
                                    aria-current={isActive ? "page" : undefined}
                                    onClick={() => {
                                      setActiveSection(value)
                                      setIsMobileMenuOpen(false)
                                    }}
                                    className={cn(
                                      "flex min-h-11 w-full items-center gap-3 rounded-[10px] px-3 text-left text-sm font-medium transition-[transform,background-color,color] duration-160 ease-[cubic-bezier(0.23,1,0.32,1)] focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none active:scale-[0.98]",
                                      isActive
                                        ? "bg-primary text-primary-foreground"
                                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                    )}
                                  >
                                    <Icon
                                      aria-hidden="true"
                                      className="size-4"
                                    />
                                    {label}
                                  </button>
                                </li>
                              )
                            })}
                          </ul>
                        </nav>

                        <div className="mt-4 border-t border-border/70 pt-4">
                          <button
                            type="button"
                            onClick={() => {
                              setIsMobileMenuOpen(false)
                              window.setTimeout(openVoiceDialog, 220)
                            }}
                            className="flex min-h-11 w-full items-center gap-3 rounded-[10px] px-3 text-left text-sm font-medium text-muted-foreground transition-[transform,background-color,color] duration-160 ease-[cubic-bezier(0.23,1,0.32,1)] hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none active:scale-[0.98]"
                          >
                            <PlusIcon aria-hidden="true" className="size-4" />
                            Add voice
                          </button>
                        </div>

                        <div className="mt-auto border-t border-border/70 pt-4">
                          <Link
                            href="/"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex min-h-11 w-full items-center gap-3 rounded-[10px] px-3 text-sm font-medium text-muted-foreground transition-[transform,background-color,color] duration-160 ease-[cubic-bezier(0.23,1,0.32,1)] hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none active:scale-[0.98]"
                          >
                            <LogOutIcon aria-hidden="true" className="size-4" />
                            Log out
                          </Link>
                        </div>
                      </div>
                    </Dialog.Popup>
                  </Dialog.Portal>
                </Dialog.Root>
              </div>
            </header>

            <div
              className={cn(
                "min-h-0 flex-1 gap-4 px-4 pt-6 pb-4 sm:px-5 sm:pt-7 sm:pb-5",
                "flex"
              )}
            >
              {activeSection === "dashboard" ? (
                <section className="screen-shift screen-shift-visible screen-shift-delay-2 flex min-h-0 w-full flex-1 flex-col gap-5 sm:gap-6">
                  {voices.length === 0 ? (
                    <div className="flex min-h-0 flex-1 items-center justify-center py-10">
                      <div className="flex max-w-sm flex-col items-center text-center">
                        <span className="flex size-14 items-center justify-center rounded-[18px] bg-primary text-primary-foreground shadow-[0_14px_30px_rgba(29,30,34,0.14)]">
                          <SparklesIcon aria-hidden="true" className="size-6" />
                        </span>
                        <p className="mt-6 text-[0.65rem] font-medium tracking-[0.16em] text-muted-foreground uppercase">
                          Voices
                        </p>
                        <h1 className="mt-2 text-[clamp(2rem,4vw,3rem)] leading-[0.98] font-medium tracking-[-0.05em] text-balance">
                          You don’t have voices yet.
                        </h1>
                        <p className="mt-4 max-w-[21rem] text-sm leading-relaxed text-muted-foreground">
                          Add writing samples and create a voice profile for
                          drafts that sound like you.
                        </p>
                        <Button
                          type="button"
                          size="lg"
                          className="mt-7"
                          onClick={openVoiceDialog}
                        >
                          <PlusIcon
                            data-icon="inline-start"
                            aria-hidden="true"
                          />
                          Add a voice
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div>
                        <div>
                          <p className="text-[0.65rem] font-medium tracking-[0.16em] text-muted-foreground uppercase">
                            Voices
                          </p>
                          <h1 className="mt-1 text-[1.5rem] leading-[1] font-medium tracking-[-0.04em] text-balance">
                            Your writing voice library
                          </h1>
                        </div>
                      </div>

                      <div
                        role="region"
                        aria-label="Voice profiles"
                        className="-mx-4 no-scrollbar flex min-w-0 touch-pan-x snap-x snap-mandatory scroll-px-4 gap-2.5 overflow-x-auto overscroll-x-contain px-4 pb-2 sm:mx-0 sm:scroll-px-0 sm:gap-3 sm:px-0"
                      >
                        {voiceCards.map((voice, index) => {
                          const isActive = voice.id === activeVoice?.id
                          return (
                            <article
                              key={voice.id}
                              onPointerDown={(event) =>
                                startVoiceLongPress(event, voice.id)
                              }
                              onPointerMove={moveVoiceLongPress}
                              onPointerUp={finishVoiceLongPress}
                              onPointerCancel={finishVoiceLongPress}
                              onContextMenu={(event) => {
                                event.preventDefault()
                                setOpenVoiceMenuId(voice.id)
                              }}
                              className={cn(
                                "relative h-[4.5rem] w-fit max-w-[13rem] min-w-[10.75rem] shrink-0 touch-pan-x snap-start rounded-[14px] border px-4 py-3.5 text-center select-none [-webkit-touch-callout:none] sm:w-[14rem] sm:max-w-none sm:min-w-[14rem] sm:p-4 sm:pr-11 sm:text-left",
                                isActive
                                  ? "border-primary bg-primary text-primary-foreground"
                                  : "border-border/70 bg-white/72 text-foreground",
                                `screen-shift screen-shift-visible ${index === 0 ? "screen-shift-delay-3" : "screen-shift-delay-4"}`
                              )}
                            >
                              <button
                                type="button"
                                aria-label={`Use ${voice.name}`}
                                onClick={(event) => {
                                  if (voiceLongPressTriggeredRef.current) {
                                    event.preventDefault()
                                    event.stopPropagation()
                                    voiceLongPressTriggeredRef.current = false
                                    return
                                  }
                                  setActiveVoiceId(voice.id)
                                }}
                                className="absolute inset-0 z-0 rounded-[14px] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
                              />
                              {editingVoiceId === voice.id ? (
                                <div className="relative z-20 flex h-full w-full items-center gap-1.5">
                                  <input
                                    autoFocus
                                    value={editingVoiceName}
                                    aria-label="Voice name"
                                    onChange={(event) =>
                                      setEditingVoiceName(event.target.value)
                                    }
                                    onKeyDown={(event) => {
                                      if (event.key === "Enter")
                                        saveRename(voice)
                                      if (event.key === "Escape") cancelRename()
                                    }}
                                    className={cn(
                                      "min-w-0 flex-1 border-0 bg-transparent text-sm font-medium outline-none focus-visible:ring-1 focus-visible:ring-current",
                                      isActive
                                        ? "text-primary-foreground placeholder:text-primary-foreground/50"
                                        : "text-foreground placeholder:text-muted-foreground"
                                    )}
                                  />
                                  <button
                                    type="button"
                                    aria-label="Save voice name"
                                    onClick={() => saveRename(voice)}
                                    className={cn(
                                      "flex size-7 shrink-0 items-center justify-center rounded-[8px] transition-colors",
                                      isActive
                                        ? "text-primary-foreground/85 hover:bg-white/12 hover:text-primary-foreground"
                                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                    )}
                                  >
                                    <CheckIcon
                                      aria-hidden="true"
                                      className="size-4"
                                    />
                                  </button>
                                  <button
                                    type="button"
                                    aria-label="Cancel rename"
                                    onClick={cancelRename}
                                    className={cn(
                                      "flex size-7 shrink-0 items-center justify-center rounded-[8px] transition-colors",
                                      isActive
                                        ? "text-primary-foreground/85 hover:bg-white/12 hover:text-primary-foreground"
                                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                    )}
                                  >
                                    <XIcon
                                      aria-hidden="true"
                                      className="size-4"
                                    />
                                  </button>
                                </div>
                              ) : (
                                <>
                                  <div className="pointer-events-none relative z-10 flex h-full min-w-0 items-center justify-center sm:justify-start">
                                    <p className="max-w-[9rem] truncate text-sm font-medium whitespace-nowrap sm:w-full sm:max-w-none sm:pr-10">
                                      {voice.name}
                                    </p>
                                  </div>
                                  <div
                                    data-voice-menu
                                    className="absolute top-1/2 right-3 z-20 hidden -translate-y-1/2 sm:block"
                                  >
                                    <button
                                      type="button"
                                      aria-label={`More actions for ${voice.name}`}
                                      aria-expanded={
                                        openVoiceMenuId === voice.id
                                      }
                                      aria-controls={`voice-menu-${voice.id}`}
                                      onClick={() =>
                                        setOpenVoiceMenuId((current) =>
                                          current === voice.id ? null : voice.id
                                        )
                                      }
                                      className={cn(
                                        "flex size-8 cursor-pointer list-none items-center justify-center rounded-[10px] transition-[background-color,color] duration-160 [&::-webkit-details-marker]:hidden",
                                        isActive
                                          ? "text-primary-foreground/72 hover:bg-white/12 hover:text-primary-foreground"
                                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                      )}
                                    >
                                      <MoreVerticalIcon
                                        aria-hidden="true"
                                        className="size-4"
                                      />
                                    </button>
                                    {openVoiceMenuId === voice.id ? (
                                      <div
                                        id={`voice-menu-${voice.id}`}
                                        role="menu"
                                        aria-label={`${voice.name} actions`}
                                        className="absolute top-[calc(100%+0.5rem)] right-0 z-30 w-40 rounded-[10px] bg-white p-1.5 text-foreground shadow-[0_12px_28px_rgba(29,30,34,0.16)]"
                                      >
                                        <button
                                          type="button"
                                          role="menuitem"
                                          onClick={() => renameVoice(voice)}
                                          className="flex h-9 w-full items-center gap-2 rounded-[8px] px-2.5 text-left text-sm transition-colors hover:bg-muted"
                                        >
                                          <PencilIcon
                                            aria-hidden="true"
                                            className="size-3.5"
                                          />
                                          Rename
                                        </button>
                                        <button
                                          type="button"
                                          role="menuitem"
                                          onClick={() => removeVoice(voice.id)}
                                          className="flex h-9 w-full items-center gap-2 rounded-[8px] px-2.5 text-left text-sm text-destructive transition-colors hover:bg-destructive/8"
                                        >
                                          <Trash2Icon
                                            aria-hidden="true"
                                            className="size-3.5"
                                          />
                                          Delete
                                        </button>
                                      </div>
                                    ) : null}
                                  </div>
                                </>
                              )}
                            </article>
                          )
                        })}

                        <button
                          type="button"
                          onClick={openVoiceDialog}
                          className="h-[4.5rem] w-fit min-w-[10.75rem] shrink-0 snap-start rounded-[14px] border border-dashed border-border/70 bg-white/48 px-4 py-3 text-left sm:w-[14rem] sm:min-w-[14rem] sm:p-3"
                        >
                          <div className="flex h-full items-center justify-center gap-3 text-center">
                            <div className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                              <PlusIcon
                                aria-hidden="true"
                                className="size-3.5"
                              />
                            </div>
                            <p className="text-sm font-medium">Add another</p>
                          </div>
                        </button>
                      </div>

                      <div className="grid min-h-0 flex-1 gap-3 overflow-hidden lg:grid-cols-[minmax(0,1.12fr)_minmax(0,0.88fr)]">
                        <div className="flex min-h-0 flex-col overflow-hidden rounded-[16px] border border-border/70 bg-white/88 p-5 shadow-[0_14px_36px_rgba(29,30,34,0.06)] sm:p-6">
                          <div className="flex items-center justify-between gap-4">
                            <div>
                              <p className="text-[0.65rem] font-medium tracking-[0.16em] text-muted-foreground uppercase">
                                Workspace
                              </p>
                              <h2 className="mt-1 text-[1.4rem] leading-[1] font-medium tracking-[-0.04em] text-balance">
                                Draft text in your own rhythm
                              </h2>
                            </div>

                            <div className="rounded-full border border-border/70 bg-background px-3 py-1 text-xs text-muted-foreground">
                              {activeVoice?.name}
                            </div>
                          </div>

                          <FieldGroup className="mt-3 flex min-h-0 flex-1 gap-2">
                            <Field className="min-h-0 flex-1">
                              <FieldLabel
                                htmlFor="dashboard-source"
                                className="text-sm"
                              >
                                Source text
                              </FieldLabel>
                              <Textarea
                                id="dashboard-source"
                                value={sourceText}
                                onChange={(event) =>
                                  setSourceText(event.target.value)
                                }
                                className="min-h-0 flex-1 resize-none border-border/80 bg-background/40 text-[0.95rem]"
                              />
                              <FieldDescription className="text-xs leading-relaxed">
                                Left source. Right launch output. Long text
                                scrolls inside the panel.
                              </FieldDescription>
                            </Field>

                            <div className="flex flex-wrap items-center gap-2 pt-1">
                              <span className="rounded-full border border-border/70 bg-background px-3 py-1.5 text-xs text-muted-foreground">
                                Free: 300 chars
                              </span>

                              <Button
                                type="button"
                                className="ml-auto h-11 rounded-[20px] px-5"
                                onClick={() => setOutputKind("post")}
                              >
                                Analyze my voice
                                <ArrowRightIcon
                                  data-icon="inline-end"
                                  aria-hidden="true"
                                />
                              </Button>
                            </div>
                          </FieldGroup>
                        </div>

                        <div className="flex min-h-0 flex-col overflow-hidden rounded-[16px] bg-primary p-5 text-primary-foreground shadow-[0_20px_52px_rgba(29,30,34,0.18)] sm:p-6">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <p className="text-[0.65rem] font-medium tracking-[0.16em] text-primary-foreground/70 uppercase">
                                Launch
                              </p>
                              <h2 className="mt-1 text-[1.4rem] leading-[1] font-medium tracking-[-0.04em] text-balance">
                                Ready result
                              </h2>
                              <p className="mt-2 text-xs leading-relaxed text-primary-foreground/70">
                                Drafted in {activeVoice?.name.toLowerCase()}
                              </p>
                            </div>

                            <div className="flex shrink-0 items-center gap-2">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={copyResult}
                              >
                                <CopyIcon
                                  data-icon="inline-start"
                                  aria-hidden="true"
                                />
                                {copied ? "Copied" : "Copy"}
                              </Button>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={saveResult}
                              >
                                <DownloadIcon
                                  data-icon="inline-start"
                                  aria-hidden="true"
                                />
                                Save
                              </Button>
                            </div>
                          </div>

                          <div className="mt-3 flex flex-wrap gap-1.5">
                            {Object.entries(outputTemplates).map(
                              ([value, config]) => {
                                const Icon = config.icon
                                return (
                                  <button
                                    key={value}
                                    type="button"
                                    onClick={() =>
                                      setOutputKind(value as OutputKind)
                                    }
                                    className={cn(
                                      "flex items-center gap-1.5 rounded-[9px] border px-2.5 py-1.5 text-xs transition-[transform,background-color,border-color,color] duration-160 ease-[cubic-bezier(0.23,1,0.32,1)] hover:-translate-y-0.5 active:scale-[0.97]",
                                      outputKind === value
                                        ? "border-white bg-white text-foreground"
                                        : "border-white/20 text-primary-foreground/78 hover:border-white/40 hover:text-primary-foreground"
                                    )}
                                  >
                                    <Icon
                                      aria-hidden="true"
                                      className="size-3.5"
                                      strokeWidth={1.5}
                                    />
                                    {config.label}
                                  </button>
                                )
                              }
                            )}
                          </div>

                          <div className="mt-3 flex min-h-0 flex-1 flex-col rounded-[16px] bg-white p-4 text-foreground sm:p-5">
                            <div className="flex items-center justify-between gap-3">
                              <p className="text-[0.65rem] font-medium tracking-[0.16em] text-muted-foreground uppercase">
                                {outputTemplates[outputKind].eyebrow}
                              </p>
                              <span className="rounded-full border border-border/70 px-2.5 py-1 text-[0.68rem] text-muted-foreground">
                                {savedCount} saved
                              </span>
                            </div>

                            <h3 className="mt-3 text-[1.2rem] leading-[1.15] font-medium tracking-[-0.03em] text-balance">
                              {outputTemplates[outputKind].title}
                            </h3>

                            <pre className="mt-3 min-h-0 flex-1 overflow-auto font-sans text-sm leading-relaxed whitespace-pre-wrap text-muted-foreground">
                              {resultText}
                            </pre>
                          </div>

                          <div className="mt-3 flex flex-wrap gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                document
                                  .getElementById("dashboard-source")
                                  ?.focus()
                              }
                            >
                              Refine my samples
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => setActiveSection("billing")}
                            >
                              Unlock more outputs
                            </Button>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </section>
              ) : activeSection === "chat" ? (
                <DashboardAiChat
                  voices={voices}
                  selectedVoiceId={activeVoiceId}
                  onSelectVoice={setActiveVoiceId}
                  onAddVoice={openVoiceDialog}
                />
              ) : activeSection === "billing" ? (
                <section className="screen-shift screen-shift-visible screen-shift-delay-2 flex min-h-0 w-full flex-1 flex-col">
                  <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                    <div className="max-w-[43rem]">
                      <p className="text-sm font-medium text-muted-foreground">
                        Pricing
                      </p>
                      <h1 className="mt-2 text-[clamp(2.5rem,4vw,4.25rem)] leading-[0.96] font-medium tracking-[-0.04em] text-balance">
                        Start free. Upgrade when the voice becomes
                        mission-critical.
                      </h1>
                      <p className="mt-4 max-w-[37rem] text-base leading-relaxed text-muted-foreground">
                        The free tier proves the voice fit. Paid plans unlock
                        Telegram imports, more modes, unlimited drafts, and
                        collaborative review.
                      </p>
                    </div>

                    <Tabs
                      value={billingCycle}
                      onValueChange={(value) =>
                        setBillingCycle(value as BillingCycle)
                      }
                    >
                      <TabsList
                        aria-label="Billing cycle"
                        className="h-11 rounded-[20px] bg-white p-1 shadow-[0_8px_20px_rgba(29,30,34,0.06)]"
                      >
                        <TabsTrigger
                          value="monthly"
                          className="h-full min-w-24 rounded-[10px] px-5 text-sm font-medium text-foreground/48 hover:text-foreground/72 data-active:bg-primary data-active:text-primary-foreground data-active:shadow-none data-active:hover:text-primary-foreground"
                        >
                          Monthly
                        </TabsTrigger>
                        <TabsTrigger
                          value="yearly"
                          className="h-full min-w-24 rounded-[10px] px-5 text-sm font-medium text-foreground/48 hover:text-foreground/72 data-active:bg-primary data-active:text-primary-foreground data-active:shadow-none data-active:hover:text-primary-foreground"
                        >
                          Yearly
                        </TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>

                  <div className="mt-7 no-scrollbar flex min-h-0 flex-1 snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain pb-2 lg:grid lg:grid-cols-3 lg:overflow-visible lg:pb-0">
                    {billingPlans[billingCycle].map((plan) => (
                      <article
                        key={plan.name}
                        className={cn(
                          "flex min-h-[30rem] shrink-0 basis-[min(25rem,calc(100vw-3rem))] snap-center flex-col rounded-[16px] p-7 lg:min-h-0 lg:min-w-0 lg:basis-auto lg:p-8",
                          plan.featured
                            ? "bg-primary text-primary-foreground"
                            : "bg-white/84 text-foreground"
                        )}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p
                              className={cn(
                                "text-sm",
                                plan.featured
                                  ? "text-primary-foreground/70"
                                  : "text-muted-foreground"
                              )}
                            >
                              {plan.name}
                            </p>
                            <p className="mt-3 text-[2.8rem] leading-none font-medium tracking-[-0.04em]">
                              {plan.price}
                            </p>
                            <p
                              className={cn(
                                "mt-2 text-sm",
                                plan.featured
                                  ? "text-primary-foreground/70"
                                  : "text-muted-foreground"
                              )}
                            >
                              {plan.note}
                            </p>
                          </div>
                          {plan.featured ? (
                            <span className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/12 px-3 py-1 text-xs font-medium text-primary-foreground/80">
                              <CrownIcon
                                aria-hidden="true"
                                className="size-3.5"
                              />
                              Most wanted
                            </span>
                          ) : null}
                        </div>

                        <p
                          className={cn(
                            "mt-6 text-sm leading-relaxed",
                            plan.featured
                              ? "text-primary-foreground/78"
                              : "text-muted-foreground"
                          )}
                        >
                          {plan.description}
                        </p>

                        <div className="mt-8 flex flex-1 flex-col gap-4">
                          {plan.features.map((feature) => (
                            <div
                              key={feature}
                              className="flex items-start gap-3"
                            >
                              <CheckIcon
                                aria-hidden="true"
                                className="mt-0.5 size-4 shrink-0"
                              />
                              <p
                                className={cn(
                                  "text-sm leading-relaxed",
                                  plan.featured
                                    ? "text-primary-foreground/82"
                                    : "text-foreground/78"
                                )}
                              >
                                {feature}
                              </p>
                            </div>
                          ))}
                        </div>

                        <Button
                          type="button"
                          variant={plan.featured ? "outline" : "default"}
                          size="lg"
                          className="mt-10"
                          onClick={() =>
                            setActiveSection(
                              plan.featured ? "settings" : "dashboard"
                            )
                          }
                        >
                          {plan.cta}
                          <ArrowRightIcon
                            data-icon="inline-end"
                            aria-hidden="true"
                          />
                        </Button>
                      </article>
                    ))}
                  </div>
                </section>
              ) : (
                <section className="screen-shift screen-shift-visible screen-shift-delay-2 flex min-h-0 w-full flex-1 flex-col gap-4">
                  <div className="flex min-h-0 flex-1 flex-col rounded-[28px] border border-border/70 bg-white/88 p-4 shadow-[0_14px_36px_rgba(29,30,34,0.06)]">
                    <p className="text-[0.65rem] font-medium tracking-[0.16em] text-muted-foreground uppercase">
                      Settings
                    </p>
                    <h1 className="mt-1 text-[1.5rem] leading-[1] font-medium tracking-[-0.04em] text-balance">
                      Prepare account controls.
                    </h1>

                    <FieldGroup className="mt-4 flex flex-1 gap-3">
                      <Field>
                        <FieldLabel
                          htmlFor="dashboard-name"
                          className="text-sm"
                        >
                          Workspace
                        </FieldLabel>
                        <Input
                          id="dashboard-name"
                          defaultValue="Voxform preview"
                        />
                      </Field>
                      <Field>
                        <FieldLabel
                          htmlFor="dashboard-email"
                          className="text-sm"
                        >
                          Login layer later
                        </FieldLabel>
                        <Input
                          id="dashboard-email"
                          defaultValue="Google auth coming soon"
                          disabled
                        />
                        <FieldDescription className="text-xs leading-relaxed">
                          Login, theme, and team controls will live here.
                        </FieldDescription>
                      </Field>
                    </FieldGroup>
                  </div>
                </section>
              )}
            </div>
          </div>
        </div>
      </div>

      {openVoice ? (
        <div className="fixed inset-0 z-50 flex items-end bg-primary/24 p-4 backdrop-blur-[2px] sm:hidden">
          <div
            data-voice-menu
            role="menu"
            aria-label={`${openVoice.name} actions`}
            className="w-full rounded-[18px] bg-background p-2 shadow-[0_18px_48px_rgba(29,30,34,0.2)]"
          >
            <div className="px-3 pt-2 pb-3">
              <p className="truncate text-sm font-medium">{openVoice.name}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Voice profile actions
              </p>
            </div>
            <button
              type="button"
              role="menuitem"
              onClick={() => renameVoice(openVoice)}
              className="flex h-12 w-full items-center gap-3 rounded-[12px] px-3 text-left text-sm transition-colors active:bg-muted"
            >
              <PencilIcon aria-hidden="true" className="size-4" />
              Rename
            </button>
            <button
              type="button"
              role="menuitem"
              onClick={() => removeVoice(openVoice.id)}
              className="flex h-12 w-full items-center gap-3 rounded-[12px] px-3 text-left text-sm text-destructive transition-colors active:bg-destructive/8"
            >
              <Trash2Icon aria-hidden="true" className="size-4" />
              Delete
            </button>
            <button
              type="button"
              onClick={() => setOpenVoiceMenuId(null)}
              className="mt-1 h-12 w-full rounded-[12px] bg-muted text-sm font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : null}

      <dialog
        ref={voiceDialogRef}
        aria-labelledby="add-voice-dialog-title"
        onClose={() => {
          setIsVoiceDialogReady(false)
          setIsVoiceDialogOpen(false)
        }}
        className="m-auto no-scrollbar w-[min(68rem,calc(100vw-2rem))] max-w-none overflow-visible rounded-[16px] border-0 bg-transparent p-0 text-foreground backdrop:bg-primary/38 backdrop:backdrop-blur-[3px] max-sm:h-[calc(100svh-2rem)] max-sm:max-h-[calc(100svh-2rem)] max-sm:overflow-hidden"
      >
        <div className="relative h-full min-h-0">
          <h2 id="add-voice-dialog-title" className="sr-only">
            Create a new voice profile
          </h2>
          {isVoiceDialogReady ? (
            <button
              type="button"
              aria-label="Close add voice dialog"
              onClick={() => {
                setIsVoiceDialogReady(false)
                setIsVoiceDialogOpen(false)
              }}
              className="absolute top-3 right-3 z-20 inline-flex size-9 [animation:dialog-close-enter_180ms_cubic-bezier(0.23,1,0.32,1)_forwards] items-center justify-center rounded-[10px] bg-background/92 text-muted-foreground shadow-[0_8px_18px_rgba(29,30,34,0.1)] transition-[transform,background-color,color] duration-160 ease-[cubic-bezier(0.23,1,0.32,1)] hover:bg-background hover:text-foreground active:scale-[0.97]"
            >
              <XIcon aria-hidden="true" className="size-4" />
            </button>
          ) : null}
          <VoiceWorkbench
            key={voiceDialogKey}
            isVisible
            startEmpty
            onVoiceReady={finishVoiceAnalysis}
          />
        </div>
      </dialog>
    </main>
  )
}
