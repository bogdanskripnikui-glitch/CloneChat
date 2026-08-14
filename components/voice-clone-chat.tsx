"use client"

import { useEffect, useRef, useState } from "react"
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
import { cn } from "@/lib/utils"

type Attachment = {
  id: string
  name: string
  size: number
}

type ChatMessage = {
  id: number
  role: "assistant" | "user"
  text: string
  attachments?: Attachment[]
}

type EmojiGroup = {
  label: string
  icon: string
  emoji: string[]
}

const initialMessages: ChatMessage[] = [
  {
    id: 1,
    role: "assistant",
    text: "I’ve learned the rhythm of your writing. What would you like to work on?",
  },
  {
    id: 2,
    role: "user",
    text: "Make this update feel clear, warm, and direct.",
  },
  {
    id: 3,
    role: "assistant",
    text: "Absolutely. I’ll keep it concise, human, and close to how you naturally write.",
  },
]

const emojiGroups: EmojiGroup[] = [
  { label: "Smileys", icon: "😀", emoji: ["😀", "😃", "😄", "😁", "😆", "🥹", "😊", "🙂", "🙃", "😉", "😍", "😘", "😎", "🤓", "🥳", "🤩", "😇", "🤔", "🤗", "🤭", "🫡", "😌", "😮", "😢", "😭", "😤", "😡", "🤯", "😴", "🤍"] },
  { label: "People", icon: "👋", emoji: ["👋", "🤚", "🖐️", "✋", "🫶", "👏", "🙌", "👍", "👎", "🤝", "🙏", "💪", "👀", "🧠", "🫀", "👤", "👥", "🧑‍💻", "👩‍💻", "👨‍💻", "🧑‍🎨", "🧑‍🚀", "🧑‍💼", "🕺", "💃"] },
  { label: "Nature", icon: "🌿", emoji: ["🌱", "🌿", "☘️", "🌵", "🌲", "🌳", "🌴", "🍀", "🌸", "🌹", "🌻", "🌙", "⭐", "🌟", "☀️", "🌤️", "🌈", "🔥", "💧", "🌊", "🐶", "🐱", "🦊", "🐼", "🦋"] },
  { label: "Food", icon: "🍋", emoji: ["🍏", "🍋", "🍓", "🍒", "🥑", "🥕", "🥐", "🍞", "🧀", "🍔", "🍕", "🌮", "🍣", "🍜", "🍝", "🍩", "🍪", "🍫", "☕", "🧋", "🍷", "🥂", "🍺", "🫖"] },
  { label: "Activity", icon: "⚽", emoji: ["⚽", "🏀", "🎾", "🏆", "🥇", "🎯", "🎲", "🎮", "🎨", "🎧", "🎸", "🎹", "🎬", "📷", "💡", "🚀", "✈️", "🚗", "🚲", "⌚", "📱", "💻", "⌨️", "🛰️"] },
  { label: "Objects", icon: "💬", emoji: ["💬", "🗯️", "💭", "📌", "📎", "📝", "📚", "📖", "🗂️", "📊", "📈", "📅", "✉️", "📮", "🔒", "🔑", "🛠️", "⚙️", "🔗", "🧩", "🎁", "💎", "🔔", "✅"] },
  { label: "Symbols", icon: "❤️", emoji: ["❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🩶", "🤍", "💯", "✨", "💥", "💫", "💤", "❗", "❓", "‼️", "⚠️", "♻️", "✅", "❌", "➕", "➖", "➡️", "⬆️"] },
  { label: "Flags", icon: "🏳️", emoji: ["🏳️", "🏴", "🇺🇦", "🇺🇸", "🇬🇧", "🇪🇺", "🇨🇦", "🇩🇪", "🇫🇷", "🇮🇹", "🇪🇸", "🇵🇱", "🇯🇵", "🇰🇷", "🇧🇷", "🇦🇺", "🇮🇳", "🇲🇽", "🇹🇷", "🇦🇪"] },
]

const quickEmoji = ["✦", "👍", "💬", "✨"]

function formatSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function makeReply(text: string, hasAttachments: boolean) {
  if (hasAttachments) {
    return "I’ve got the attachment. I’ll use it as context and keep the rewrite clear, warm, and recognisably yours."
  }

  if (text.toLowerCase().includes("email")) {
    return "I’d make this email straightforward and human: lead with the point, keep the pace calm, and leave room for the reader to reply."
  }

  return "Here’s how I’d say it: clear enough to move the conversation forward, warm enough to still sound like you."
}

export function VoiceCloneChat() {
  const [messages, setMessages] = useState(initialMessages)
  const [draft, setDraft] = useState("")
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const [isReplying, setIsReplying] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false)
  const [activeEmojiGroup, setActiveEmojiGroup] = useState(0)
  const responseTimer = useRef<number | null>(null)
  const messageId = useRef(initialMessages.length)
  const scrollerRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const emojiPickerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    return () => {
      if (responseTimer.current) window.clearTimeout(responseTimer.current)
    }
  }, [])

  useEffect(() => {
    const scroller = scrollerRef.current
    if (!scroller) return
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    scroller.scrollTo({ top: scroller.scrollHeight, behavior: reducedMotion ? "auto" : "smooth" })
  }, [messages, isReplying])

  useEffect(() => {
    const node = sectionRef.current
    if (!node) return
    const observer = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting), { threshold: 0.32 })
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (!emojiPickerRef.current?.contains(event.target as Node)) setIsEmojiPickerOpen(false)
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setIsEmojiPickerOpen(false)
    }
    window.addEventListener("pointerdown", handlePointerDown)
    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("pointerdown", handlePointerDown)
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [])

  function addEmoji(emoji: string) {
    setDraft((current) => `${current}${emoji}`)
  }

  function handleFiles(files: FileList | null) {
    if (!files) return
    const nextFiles = Array.from(files).map((file) => ({
      id: `${file.name}-${file.size}-${file.lastModified}`,
      name: file.name,
      size: file.size,
    }))
    setAttachments((current) => [...current, ...nextFiles.filter((file) => !current.some((item) => item.id === file.id))])
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  function removeAttachment(id: string) {
    setAttachments((current) => current.filter((file) => file.id !== id))
  }

  function sendMessage() {
    const text = draft.trim()
    if ((!text && attachments.length === 0) || isReplying) return

    const sentAttachments = attachments
    messageId.current += 1
    setMessages((current) => [...current, { id: messageId.current, role: "user", text, attachments: sentAttachments }])
    setDraft("")
    setAttachments([])
    setIsReplying(true)
    setIsEmojiPickerOpen(false)

    responseTimer.current = window.setTimeout(() => {
      messageId.current += 1
      setMessages((current) => [...current, { id: messageId.current, role: "assistant", text: makeReply(text, sentAttachments.length > 0) }])
      setIsReplying(false)
    }, 650)
  }

  return (
    <section ref={sectionRef} id="ai-clone" aria-labelledby="ai-clone-title" className="flex h-[100svh] min-h-0 snap-start snap-always overflow-hidden bg-transparent">
      <div className="mx-auto flex h-full min-h-0 w-full max-w-[1440px] flex-col overflow-hidden px-4 py-4 sm:px-5 sm:py-7 xl:px-8 xl:pt-32 xl:pb-8">
        <div className="mobile-slide-intro mx-auto max-w-[48rem] shrink-0 text-center">
          <p className={`mobile-slide-kicker screen-shift text-sm font-medium text-muted-foreground ${isVisible ? "screen-shift-visible screen-shift-delay-1" : ""}`}>Talk to Your AI clone</p>
          <h2 id="ai-clone-title" className={`screen-shift mt-2 whitespace-nowrap text-[clamp(1.55rem,4vw,3.75rem)] leading-[0.96] font-medium tracking-[-0.04em] ${isVisible ? "screen-shift-visible screen-shift-delay-2" : ""}`}>AI that sounds like you</h2>
          <p className={`mobile-slide-description screen-shift mx-auto mt-4 max-w-[38rem] text-base leading-relaxed text-muted-foreground sm:text-lg ${isVisible ? "screen-shift-visible screen-shift-delay-3" : ""}`}>It keeps your vocabulary, pacing, and intent — then adapts to the moment and the person you’re talking to.</p>
        </div>

        <div className={`clone-chat-panel screen-shift mx-auto mt-5 flex min-h-0 flex-1 w-full max-w-[48rem] lg:max-w-[42rem] flex-col overflow-hidden rounded-[20px] border border-border/80 bg-white shadow-[0_16px_42px_rgba(29,30,34,0.06)] sm:mt-10 lg:mt-8 lg:h-[38rem] lg:max-h-[calc(100svh-20rem)] lg:flex-none ${isVisible ? "screen-shift-visible screen-shift-delay-4" : ""}`}>
          <div className="clone-chat-header flex shrink-0 items-center gap-3 border-b border-border/70 px-5 py-4">
            <span className="flex size-10 items-center justify-center rounded-[15px] bg-primary text-primary-foreground"><SparklesIcon aria-hidden="true" className="size-4" strokeWidth={1.8} /></span>
            <div><p className="text-sm font-medium">Your AI clone</p><p className="mt-0.5 text-xs text-muted-foreground">Founder voice · ready</p></div>
            <span className="ml-auto size-2 rounded-full bg-primary" aria-label="Online" />
          </div>

          <div ref={scrollerRef} aria-live="polite" className="clone-chat-messages no-scrollbar flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-5 py-5">
            {messages.map((message) => (
              <div key={message.id} className={cn("flex", message.id === 3 && "clone-starter-optional", message.role === "user" ? "justify-end" : "justify-start")}>
                <div className={cn("max-w-[84%] rounded-[15px] px-4 py-3 text-sm leading-relaxed", message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted/58 text-foreground")}>
                  {message.text ? <p>{message.text}</p> : null}
                  {message.attachments?.length ? <div className={cn(message.text ? "mt-3" : "", "flex flex-col gap-2")}>{message.attachments.map((attachment) => <div key={attachment.id} className={cn("flex min-w-44 items-center gap-2 rounded-[10px] border px-2.5 py-2", message.role === "user" ? "border-white/20 bg-white/10" : "border-border/80 bg-background/70")}><FileIcon aria-hidden="true" className="size-4 shrink-0" /><span className="min-w-0 flex-1 truncate text-xs font-medium">{attachment.name}</span><span className="text-[0.65rem] opacity-65">{formatSize(attachment.size)}</span></div>)}</div> : null}
                </div>
              </div>
            ))}
            {isReplying ? <div className="flex justify-start"><span className="rounded-[15px] bg-muted/58 px-4 py-3 text-sm text-muted-foreground">Writing<span className="ml-0.5 inline-flex gap-0.5"><i className="size-1 animate-bounce rounded-full bg-current [animation-delay:-0.2s]" /><i className="size-1 animate-bounce rounded-full bg-current [animation-delay:-0.1s]" /><i className="size-1 animate-bounce rounded-full bg-current" /></span></span></div> : null}
          </div>

          <div className="shrink-0 border-t border-border/70 p-4 sm:p-5">
            {attachments.length ? <div className="mb-3 flex max-h-24 flex-wrap gap-2 overflow-y-auto pr-1">{attachments.map((attachment) => <div key={attachment.id} className="flex max-w-full items-center gap-2 rounded-[10px] border border-border bg-muted/45 px-2.5 py-1.5 text-xs"><FileIcon aria-hidden="true" className="size-3.5 shrink-0" /><span className="max-w-40 truncate sm:max-w-56">{attachment.name}</span><span className="text-muted-foreground">{formatSize(attachment.size)}</span><button type="button" onClick={() => removeAttachment(attachment.id)} aria-label={`Remove ${attachment.name}`} className="rounded p-0.5 text-muted-foreground transition-colors hover:bg-background hover:text-foreground"><XIcon aria-hidden="true" className="size-3.5" /></button></div>)}</div> : null}
            <div className="relative" ref={emojiPickerRef}>
              {isEmojiPickerOpen ? <div role="dialog" aria-label="Emoji picker" className="absolute bottom-[calc(100%+0.75rem)] left-0 z-20 w-[min(21rem,calc(100vw-3rem))] overflow-hidden rounded-[15px] border border-border bg-background p-2 shadow-[0_18px_48px_rgba(29,30,34,0.16)]">
                <div className="no-scrollbar flex gap-1 overflow-x-auto border-b border-border/70 pb-2">{emojiGroups.map((group, index) => <button key={group.label} type="button" aria-label={group.label} aria-pressed={index === activeEmojiGroup} onClick={() => setActiveEmojiGroup(index)} className={cn("flex size-8 shrink-0 items-center justify-center rounded-[10px] text-base transition-colors", index === activeEmojiGroup ? "bg-primary text-primary-foreground" : "hover:bg-muted")}>{group.icon}</button>)}</div>
                <p className="px-1 pt-2 text-xs font-medium text-muted-foreground">{emojiGroups[activeEmojiGroup].label}</p>
                <div className="mt-1 grid grid-cols-8 gap-0.5">{emojiGroups[activeEmojiGroup].emoji.map((emoji, index) => <button key={`${emoji}-${index}`} type="button" aria-label={`Add ${emoji}`} onClick={() => addEmoji(emoji)} className="flex aspect-square items-center justify-center rounded-[10px] text-xl transition-[background-color,transform] hover:bg-muted active:scale-90">{emoji}</button>)}</div>
              </div> : null}
              <div className="flex items-end gap-2 rounded-[15px] border border-border/80 bg-background p-2 transition-colors focus-within:border-foreground/45">
                <input ref={fileInputRef} type="file" className="sr-only" tabIndex={-1} aria-hidden="true" multiple onChange={(event) => handleFiles(event.target.files)} />
                <Button type="button" variant="ghost" size="icon" aria-label="Attach files" onClick={() => fileInputRef.current?.click()} className="size-10 rounded-[10px] text-muted-foreground hover:text-foreground"><PaperclipIcon aria-hidden="true" /></Button>
                <Textarea aria-label="Message your AI clone" value={draft} onChange={(event) => setDraft(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); sendMessage() } }} placeholder="Write to your clone…" className="min-h-10 max-h-28 resize-none border-0 bg-transparent px-1 py-2 text-sm shadow-none focus-visible:ring-0" rows={1} />
                <Button type="button" variant="ghost" size="icon" aria-label="Choose emoji" aria-expanded={isEmojiPickerOpen} onClick={() => setIsEmojiPickerOpen((current) => !current)} className={cn("size-10 rounded-[10px] text-muted-foreground hover:text-foreground", isEmojiPickerOpen && "bg-muted text-foreground")}><SmilePlusIcon aria-hidden="true" /></Button>
                <Button type="button" size="icon" aria-label="Send message" disabled={(!draft.trim() && attachments.length === 0) || isReplying} onClick={sendMessage} className="size-10 rounded-[10px]"><SendIcon aria-hidden="true" /></Button>
              </div>
            </div>
            <p className="clone-composer-hint mt-2 text-center text-[0.68rem] text-muted-foreground">Enter to send · Shift + Enter for a new line</p>
          </div>
        </div>
      </div>
    </section>
  )
}
