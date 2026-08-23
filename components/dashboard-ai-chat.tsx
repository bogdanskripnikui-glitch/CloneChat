"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import {
  FileIcon,
  PaperclipIcon,
  SendIcon,
  SmilePlusIcon,
  SparklesIcon,
  XIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useLanguage, type Locale } from "@/lib/i18n"
import type { ConversationMessage, VoiceProfile } from "@/lib/stylelab/types"
import { cn } from "@/lib/utils"

export type DashboardChatVoice = VoiceProfile

type DashboardAiChatProps = {
  voices: DashboardChatVoice[]
  selectedVoiceId: string
  onSelectVoice: (id: string) => void
  onAddVoice: () => void
}

type Attachment = { id: string; name: string; size: number; content?: string }
type Message = {
  id: number
  role: "assistant" | "user"
  text: string
  attachments?: Attachment[]
}

const emojiGroups = [
  [
    "😀",
    "😃",
    "😄",
    "😁",
    "🥹",
    "😊",
    "🙂",
    "😉",
    "😍",
    "😘",
    "😎",
    "🤔",
    "🤗",
    "🫡",
    "😌",
    "😮",
    "😢",
    "😭",
    "😤",
    "😡",
    "🤯",
    "😴",
    "🤍",
    "✨",
  ],
  [
    "👋",
    "🫶",
    "👏",
    "🙌",
    "👍",
    "👎",
    "🤝",
    "🙏",
    "💪",
    "👀",
    "🧠",
    "🧑‍💻",
    "👩‍💻",
    "👨‍💻",
    "🧑‍🎨",
    "🧑‍🚀",
    "🧑‍💼",
  ],
  [
    "🌱",
    "🌿",
    "🍀",
    "🌸",
    "🌙",
    "⭐",
    "🌈",
    "🔥",
    "💧",
    "🐶",
    "🐱",
    "🦊",
    "🦋",
    "☕",
    "🍋",
    "🍓",
  ],
  [
    "💬",
    "🗯️",
    "💭",
    "📌",
    "📎",
    "📝",
    "📚",
    "📊",
    "📈",
    "📅",
    "✉️",
    "🔒",
    "🔑",
    "⚙️",
    "🔗",
    "🧩",
    "✅",
    "❤️",
    "💯",
    "❗",
    "❓",
    "⚠️",
    "➕",
    "⬆️",
  ],
]

const emojiGroupLabels = ["Smileys", "People", "Nature", "Objects"]

function formatSize(bytes: number) {
  return bytes < 1024 * 1024
    ? `${Math.max(1, Math.round(bytes / 1024))} KB`
    : `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function initialMessages(voice: DashboardChatVoice, locale: Locale): Message[] {
  const voiceName =
    locale === "ru"
      ? voice.name === "Founder voice"
        ? "Голос основателя"
        : voice.name === "Operator voice"
          ? "Рабочий голос"
          : voice.name
      : voice.name.toLowerCase()
  return [
    {
      id: 1,
      role: "assistant",
      text:
        locale === "ru"
          ? `Я на связи голосом «${voiceName}». Что обсудим?`
          : `I’m here in your ${voiceName} voice. What would you like to work through?`,
    },
  ]
}

export function DashboardAiChat({
  voices,
  selectedVoiceId,
  onSelectVoice,
  onAddVoice,
}: DashboardAiChatProps) {
  const { locale } = useLanguage()
  const selectedVoice = useMemo(
    () => voices.find((voice) => voice.id === selectedVoiceId) ?? voices[0],
    [selectedVoiceId, voices]
  )
  const [messages, setMessages] = useState<Message[]>(() =>
    selectedVoice ? initialMessages(selectedVoice, locale) : []
  )
  const [draft, setDraft] = useState("")
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const [isReplying, setIsReplying] = useState(false)
  const [requestError, setRequestError] = useState("")
  const [emojiOpen, setEmojiOpen] = useState(false)
  const [emojiGroup, setEmojiGroup] = useState(0)
  const responseTimer = useRef<number | null>(null)
  const messageId = useRef(1)
  const scrollerRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const emojiPickerRef = useRef<HTMLDivElement>(null)

  useEffect(
    () => () => {
      if (responseTimer.current) window.clearTimeout(responseTimer.current)
    },
    []
  )

  useEffect(() => {
    if (!selectedVoice) return
    const resetTimer = window.setTimeout(() => {
      if (responseTimer.current) window.clearTimeout(responseTimer.current)
      responseTimer.current = null
      messageId.current = 1
      setMessages(initialMessages(selectedVoice, locale))
      setDraft("")
      setAttachments([])
      setIsReplying(false)
      setRequestError("")
    }, 0)
    return () => window.clearTimeout(resetTimer)
  }, [locale, selectedVoice])

  useEffect(() => {
    const node = scrollerRef.current
    if (!node) return
    node.scrollTo({
      top: node.scrollHeight,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    })
  }, [messages, isReplying])

  useEffect(() => {
    function closePicker(event: PointerEvent) {
      if (!emojiPickerRef.current?.contains(event.target as Node))
        setEmojiOpen(false)
    }
    function closeEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setEmojiOpen(false)
    }
    window.addEventListener("pointerdown", closePicker)
    window.addEventListener("keydown", closeEscape)
    return () => {
      window.removeEventListener("pointerdown", closePicker)
      window.removeEventListener("keydown", closeEscape)
    }
  }, [])

  async function selectFiles(files: FileList | null) {
    if (!files) return
    const next = await Promise.all(
      Array.from(files).map(async (file) => ({
        id: `${file.name}-${file.size}-${file.lastModified}`,
        name: file.name,
        size: file.size,
        content:
          file.size <= 250_000 &&
          /^(text\/|application\/(json|xml))/.test(file.type)
            ? (await file.text()).slice(0, 50_000)
            : undefined,
      }))
    )
    setAttachments((current) => [
      ...current,
      ...next.filter((file) => !current.some((item) => item.id === file.id)),
    ])
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  function selectVoice(id: string) {
    const nextVoice = voices.find((voice) => voice.id === id)
    if (!nextVoice || nextVoice.id === selectedVoice?.id) return
    if (responseTimer.current) window.clearTimeout(responseTimer.current)
    responseTimer.current = null
    messageId.current = 1
    setMessages(initialMessages(nextVoice, locale))
    setDraft("")
    setAttachments([])
    setIsReplying(false)
    setRequestError("")
    setEmojiOpen(false)
    onSelectVoice(id)
  }

  async function sendMessage() {
    const text = draft.trim()
    if (!selectedVoice || (!text && attachments.length === 0) || isReplying)
      return
    const sentAttachments = attachments
    messageId.current += 1
    setMessages((current) => [
      ...current,
      {
        id: messageId.current,
        role: "user",
        text,
        attachments: sentAttachments,
      },
    ])
    setDraft("")
    setAttachments([])
    setIsReplying(true)
    setRequestError("")
    setEmojiOpen(false)
    const history: ConversationMessage[] = messages
      .slice(-24)
      .map((message) => ({
        role: message.role,
        content: message.text,
      }))
    try {
      const response = await fetch("/api/stylelab/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text || "Use the attached context and respond naturally.",
          language: locale === "ru" ? "Russian" : "English",
          profile: selectedVoice,
          history,
          attachmentContext: sentAttachments.flatMap((attachment) =>
            attachment.content
              ? [`${attachment.name}:\n${attachment.content}`]
              : []
          ),
        }),
      })
      const payload = (await response.json()) as {
        messages?: string[]
        error?: string
      }
      if (!response.ok || !payload.messages?.length) {
        throw new Error(
          payload.error || "The voice model did not return a reply."
        )
      }
      setMessages((current) => [
        ...current,
        ...payload.messages!.map((reply) => ({
          id: ++messageId.current,
          role: "assistant" as const,
          text: reply,
        })),
      ])
    } catch (error) {
      setRequestError(
        error instanceof Error
          ? error.message
          : "The voice model is unavailable."
      )
    } finally {
      setIsReplying(false)
    }
  }

  return (
    <section
      aria-labelledby="dashboard-ai-chat-title"
      className="screen-shift screen-shift-visible screen-shift-delay-2 flex min-h-0 w-full flex-1 flex-col"
    >
      <div className="mb-5 shrink-0 sm:mb-6">
        <p className="text-[0.68rem] font-medium tracking-[0.16em] text-muted-foreground uppercase">
          AI chat
        </p>
        <h1
          id="dashboard-ai-chat-title"
          className="mt-1 text-[clamp(2rem,3.2vw,3rem)] leading-[0.98] font-medium tracking-[-0.05em]"
        >
          Talk in any voice.
        </h1>
        <p className="mt-3 max-w-[39rem] text-sm leading-relaxed text-muted-foreground sm:text-base">
          Choose a saved voice and continue a live conversation with its rhythm,
          vocabulary, and intent.
        </p>
      </div>

      <div className="grid min-h-0 flex-1 gap-4 lg:grid-cols-[14.5rem_minmax(0,1fr)]">
        <aside className="flex min-h-0 flex-col rounded-[16px] border border-border/75 bg-white/84 p-3 sm:p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-medium">Choose a voice</p>
            <span className="text-xs text-muted-foreground">
              {voices.length}
            </span>
          </div>
          {voices.length ? (
            <div className="mt-3 no-scrollbar flex max-h-36 gap-2 overflow-x-auto pb-1 lg:max-h-none lg:flex-1 lg:flex-col lg:overflow-x-hidden lg:overflow-y-auto">
              {voices.map((voice) => (
                <button
                  key={voice.id}
                  type="button"
                  onClick={() => selectVoice(voice.id)}
                  aria-pressed={voice.id === selectedVoice?.id}
                  className={cn(
                    "min-w-40 rounded-[10px] border px-3 py-3 text-left transition-colors lg:min-w-0",
                    voice.id === selectedVoice?.id
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-background hover:border-foreground/30"
                  )}
                >
                  <span className="block truncate text-sm font-medium">
                    {voice.name}
                  </span>
                  <span
                    className={cn(
                      "mt-1 line-clamp-2 block text-xs leading-relaxed",
                      voice.id === selectedVoice?.id
                        ? "text-primary-foreground/70"
                        : "text-muted-foreground"
                    )}
                  >
                    {voice.summary}
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div className="flex flex-1 items-center justify-center py-6 text-center text-xs leading-relaxed text-muted-foreground">
              Your voice library is empty.
            </div>
          )}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-3 w-full"
            onClick={onAddVoice}
          >
            <SparklesIcon data-icon="inline-start" aria-hidden="true" />
            Add voice
          </Button>
        </aside>

        <div className="flex min-h-0 flex-col overflow-hidden rounded-[16px] border border-border/75 bg-white/88">
          <div className="flex items-center gap-3 border-b border-border/70 px-4 py-3 sm:px-5">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-[10px] bg-primary text-primary-foreground">
              <SparklesIcon aria-hidden="true" className="size-4" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">
                {selectedVoice?.name ?? "Your AI clone"}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Online · ready to talk
              </p>
            </div>
            <span
              className="ml-auto size-2 rounded-full bg-primary"
              aria-label="Online"
            />
          </div>

          <div
            ref={scrollerRef}
            aria-live="polite"
            className="no-scrollbar flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-4 py-4 sm:px-5"
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex",
                  message.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "max-w-[86%] rounded-[15px] px-3.5 py-2.5 text-sm leading-relaxed",
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted/58 text-foreground"
                  )}
                >
                  {message.text ? <p>{message.text}</p> : null}
                  {message.attachments?.length ? (
                    <div
                      className={cn(
                        "flex flex-col gap-1.5",
                        message.text && "mt-2"
                      )}
                    >
                      {message.attachments.map((attachment) => (
                        <div
                          key={attachment.id}
                          className={cn(
                            "flex items-center gap-2 rounded-[10px] border px-2 py-1.5",
                            message.role === "user"
                              ? "border-white/20 bg-white/10"
                              : "border-border/70 bg-background/70"
                          )}
                        >
                          <FileIcon
                            aria-hidden="true"
                            className="size-3.5 shrink-0"
                          />
                          <span className="min-w-0 flex-1 truncate text-xs">
                            {attachment.name}
                          </span>
                          <span className="text-[0.62rem] opacity-70">
                            {formatSize(attachment.size)}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>
            ))}
            {isReplying ? (
              <div className="flex justify-start">
                <span className="rounded-[15px] bg-muted/58 px-3.5 py-2.5 text-sm text-muted-foreground">
                  Writing…
                </span>
              </div>
            ) : null}
            {requestError ? (
              <div role="alert" className="flex justify-start">
                <span className="max-w-[86%] rounded-[15px] border border-destructive/25 bg-destructive/5 px-3.5 py-2.5 text-sm text-destructive">
                  {requestError}
                </span>
              </div>
            ) : null}
          </div>

          <div className="border-t border-border/70 p-3 sm:p-4">
            {attachments.length ? (
              <div className="mb-2 flex max-h-16 flex-wrap gap-1.5 overflow-y-auto">
                {attachments.map((file) => (
                  <span
                    key={file.id}
                    className="flex max-w-full items-center gap-1.5 rounded-[10px] border border-border bg-muted/45 px-2 py-1 text-xs"
                  >
                    <FileIcon aria-hidden="true" className="size-3" />
                    <span className="max-w-40 truncate">{file.name}</span>
                    <button
                      type="button"
                      aria-label={`Remove ${file.name}`}
                      onClick={() =>
                        setAttachments((current) =>
                          current.filter((item) => item.id !== file.id)
                        )
                      }
                      className="rounded p-0.5 text-muted-foreground hover:text-foreground"
                    >
                      <XIcon aria-hidden="true" className="size-3" />
                    </button>
                  </span>
                ))}
              </div>
            ) : null}
            <div className="relative" ref={emojiPickerRef}>
              {emojiOpen ? (
                <div
                  role="dialog"
                  aria-label="Emoji picker"
                  className="absolute right-0 bottom-[calc(100%+0.6rem)] z-20 w-[min(19rem,calc(100vw-3rem))] rounded-[15px] border border-border bg-background p-2 shadow-[0_18px_48px_rgba(29,30,34,0.16)]"
                >
                  <div className="flex gap-1 border-b border-border/70 pb-2">
                    {emojiGroups.map((group, index) => (
                      <button
                        key={emojiGroupLabels[index]}
                        type="button"
                        onClick={() => setEmojiGroup(index)}
                        className={cn(
                          "rounded-[10px] px-2 py-1 text-xs transition-colors",
                          emojiGroup === index
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-muted"
                        )}
                      >
                        {emojiGroupLabels[index]}
                      </button>
                    ))}
                  </div>
                  <div className="mt-2 grid grid-cols-8 gap-0.5">
                    {emojiGroups[emojiGroup].map((emoji, index) => (
                      <button
                        key={`${emoji}-${index}`}
                        type="button"
                        aria-label={`Add ${emoji}`}
                        onClick={() =>
                          setDraft((current) => `${current}${emoji}`)
                        }
                        className="flex aspect-square items-center justify-center rounded-[10px] text-lg hover:bg-muted active:scale-90"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}
              <div className="flex items-end gap-1.5 rounded-[15px] border border-border/80 bg-background p-1.5 focus-within:border-foreground/45">
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  className="sr-only"
                  onChange={(event) => selectFiles(event.target.files)}
                />
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  aria-label="Attach files"
                  className="size-9 rounded-[10px] text-muted-foreground"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <PaperclipIcon aria-hidden="true" className="size-4" />
                </Button>
                <Textarea
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && !event.shiftKey) {
                      event.preventDefault()
                      sendMessage()
                    }
                  }}
                  aria-label="Message AI clone"
                  placeholder="Write to your clone…"
                  rows={1}
                  className="max-h-24 min-h-9 resize-none border-0 bg-transparent px-1 py-2 text-sm shadow-none focus-visible:ring-0"
                />
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  aria-label="Choose emoji"
                  aria-expanded={emojiOpen}
                  className={cn(
                    "size-9 rounded-[10px] text-muted-foreground",
                    emojiOpen && "bg-muted text-foreground"
                  )}
                  onClick={() => setEmojiOpen((current) => !current)}
                >
                  <SmilePlusIcon aria-hidden="true" className="size-4" />
                </Button>
                <Button
                  type="button"
                  size="icon"
                  aria-label="Send message"
                  className="size-9 rounded-[10px]"
                  disabled={
                    (!draft.trim() && attachments.length === 0) || isReplying
                  }
                  onClick={sendMessage}
                >
                  <SendIcon aria-hidden="true" className="size-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
