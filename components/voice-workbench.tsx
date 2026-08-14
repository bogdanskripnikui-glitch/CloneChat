"use client"

import { type FormEvent, useEffect, useRef, useState } from "react"
import {
  ArrowRightIcon,
  CheckIcon,
  ChevronDownIcon,
  Clock3Icon,
  CrownIcon,
  FileTextIcon,
  LinkIcon,
  LockKeyholeIcon,
  MailIcon,
  MessageSquareTextIcon,
  NotebookPenIcon,
  RotateCcwIcon,
  SendIcon,
  TriangleAlertIcon,
  UploadIcon,
  XIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Progress,
  ProgressIndicator,
  ProgressLabel,
  ProgressTrack,
  ProgressValue,
} from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { VoiceCapture, type VoiceSample } from "@/components/voice-capture"
import { cn } from "@/lib/utils"

const sampleText =
  "I believe clarity is a kindness. Good writing respects the reader’s time by saying what matters and leaving out what doesn’t. I like ideas that are concrete, useful, and honest. I prefer short sentences, active verbs, and a steady rhythm. I write like I think—direct, calm, and human."

type AnalysisStatus = "idle" | "analyzing" | "complete" | "failed"
type AnalysisPhase = "indeterminate" | "determinate"
type VoiceAnalysisFailure = "too_short" | "low_quality"
export type DraftKind = "post" | "message" | "email" | "article" | "reply"
type SourceTab = "paste" | "voice" | "upload" | "sources"
type PaywallReason = "text_limit" | "analysis_limit"

const FREE_CHARACTER_LIMIT = 300
const FREE_ANALYSIS_LIMIT = 2

const sourceSamples = {
  url: {
    title: "Public writing URL",
    label: "Imported from your site",
    text: "I try to make product updates useful in the first sentence. I lead with the outcome, cut filler, and keep the tempo steady. If something matters, I say it directly. If it does not, I leave it out. That habit carries into posts, launch notes, and replies.",
  },
  telegram: {
    title: "Telegram chats",
    label: "Imported from Telegram export",
    text: "Need the short version first: we can ship today if the copy stays simple. I would rather say one clear thing than five vague ones. Keep the tone calm, practical, and a little human. If there is friction, name it. If there is progress, show it without dressing it up.",
  },
  docs: {
    title: "Docs and workspaces",
    label: "Imported from docs",
    text: "I write long-form when the decision needs context, but even then I prefer structure over noise. The point should be visible early. Examples matter more than abstract claims. I want the reader to leave with a direction, not with more ambiguity than they started with.",
  },
} as const

const draftOptions = [
  { value: "post", label: "Post", icon: NotebookPenIcon },
  { value: "message", label: "Message", icon: MessageSquareTextIcon },
  { value: "email", label: "Email", icon: MailIcon },
  { value: "article", label: "Article", icon: FileTextIcon },
  { value: "reply", label: "Reply", icon: SendIcon },
] as const satisfies ReadonlyArray<{
  value: DraftKind
  label: string
  icon: typeof NotebookPenIcon
}>

export function VoiceWorkbench({
  isVisible = true,
  onNavigate,
  onVoiceReady,
  startEmpty = false,
}: {
  isVisible?: boolean
  onNavigate?: (href: string) => void
  onVoiceReady?: (name: string) => void
  startEmpty?: boolean
}) {
  const [text, setText] = useState(startEmpty ? "" : sampleText)
  const [status, setStatus] = useState<AnalysisStatus>("idle")
  const [progress, setProgress] = useState(0)
  const [analysisPhase, setAnalysisPhase] =
    useState<AnalysisPhase>("indeterminate")
  const [error, setError] = useState("")
  const [fileName, setFileName] = useState("")
  const [voiceSample, setVoiceSample] = useState<VoiceSample | null>(null)
  const [fileInputKey, setFileInputKey] = useState(0)
  const [sourceTab, setSourceTab] = useState<SourceTab>("paste")
  const [selectedSource, setSelectedSource] = useState<
    keyof typeof sourceSamples | "paste" | "voice" | "upload"
  >("paste")
  const [sourceUrl, setSourceUrl] = useState("")
  const [showInputPanel, setShowInputPanel] = useState(true)
  const [analyzedTab, setAnalyzedTab] = useState<SourceTab>("paste")
  const [analysisCount, setAnalysisCount] = useState(0)
  const [paywallReason, setPaywallReason] = useState<PaywallReason | null>(null)
  const [isPaywallDismissed, setIsPaywallDismissed] = useState(false)
  const [isNamingVoice, setIsNamingVoice] = useState(false)
  const [voiceName, setVoiceName] = useState("")
  const [voiceNameError, setVoiceNameError] = useState("")
  const [voiceAnalysisFailure, setVoiceAnalysisFailure] =
    useState<VoiceAnalysisFailure | null>(null)
  const resultRef = useRef<HTMLDivElement>(null)
  const voiceNameInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!isVisible || !startEmpty) return

    const resetTimer = window.setTimeout(() => {
      setText("")
      setStatus("idle")
      setProgress(0)
      setAnalysisPhase("indeterminate")
      setError("")
      setFileName("")
      setVoiceSample(null)
      setFileInputKey((current) => current + 1)
      setSourceTab("paste")
      setSelectedSource("paste")
      setSourceUrl("")
      setShowInputPanel(true)
      setAnalyzedTab("paste")
      setAnalysisCount(0)
      setPaywallReason(null)
      setIsPaywallDismissed(false)
      setIsNamingVoice(false)
      setVoiceName("")
      setVoiceNameError("")
      setVoiceAnalysisFailure(null)
    }, 0)

    return () => window.clearTimeout(resetTimer)
  }, [isVisible, startEmpty])

  useEffect(() => {
    if (status !== "analyzing") return

    const phaseTimer =
      analysisPhase === "indeterminate"
        ? window.setTimeout(() => {
            setAnalysisPhase("determinate")
            setProgress(18)
          }, 950)
        : null

    const timer = window.setInterval(() => {
      setProgress((current) => {
        if (analysisPhase === "indeterminate") return current

        const next = Math.min(current + 8, 100)

        if (next === 100) {
          if (phaseTimer !== null) {
            window.clearTimeout(phaseTimer)
          }
          window.clearInterval(timer)
          const failure =
            sourceTab === "voice" && voiceSample
              ? voiceSample.duration !== null && voiceSample.duration < 20
                ? "too_short"
                : voiceSample.file.size < 12000
                  ? "low_quality"
                  : null
              : null

          setVoiceAnalysisFailure(failure)
          setShowInputPanel(false)
          setStatus(failure ? "failed" : "complete")
        }

        return next
      })
    }, 120)

    return () => {
      if (phaseTimer !== null) {
        window.clearTimeout(phaseTimer)
      }
      window.clearInterval(timer)
    }
  }, [analysisPhase, sourceTab, status, voiceSample])

  useEffect(() => {
    if (status === "complete" || status === "failed") {
      resultRef.current?.focus()
    }
  }, [status])

  useEffect(() => {
    if (isNamingVoice) {
      voiceNameInputRef.current?.focus()
    }
  }, [isNamingVoice])

  function analyzeVoice() {
    if (sourceTab === "voice" && !voiceSample) {
      setError("Record or upload a voice sample before analysis.")
      return
    }

    if (sourceTab !== "voice" && text.length > FREE_CHARACTER_LIMIT) {
      setIsPaywallDismissed(false)
      setPaywallReason("text_limit")
      setError("")
      setStatus("idle")
      return
    }

    if (analysisCount >= FREE_ANALYSIS_LIMIT) {
      setIsPaywallDismissed(false)
      setPaywallReason("analysis_limit")
      setError("")
      setStatus("idle")
      return
    }

    if (sourceTab !== "voice" && text.trim().length < 180) {
      setError(
        "Add at least 180 characters so the analysis can identify a reliable pattern."
      )
      return
    }

    setError("")
    setIsNamingVoice(false)
    setVoiceNameError("")
    setVoiceAnalysisFailure(null)
    setPaywallReason(null)
    setIsPaywallDismissed(false)
    setAnalyzedTab(sourceTab)
    setAnalysisPhase("indeterminate")
    setProgress(0)
    setStatus("analyzing")
    setAnalysisCount((current) => current + 1)
  }

  function loadSourceSample(source: keyof typeof sourceSamples) {
    setText(sourceSamples[source].text)
    setSelectedSource(source)
    setSourceTab("paste")
    setFileName("")
    setError("")
    setPaywallReason(null)
    setStatus("idle")
    setShowInputPanel(true)
  }

  async function handleFile(file: File | undefined) {
    if (!file) return

    if (!["text/plain", "text/markdown"].includes(file.type)) {
      setError("Choose a .txt or .md file for this prototype.")
      return
    }

    const contents = await file.text()
    setText(contents.slice(0, 10000))
    setFileName(file.name)
    setSelectedSource("upload")
    setError("")
    setPaywallReason(null)
    setStatus("idle")
    setShowInputPanel(true)
  }

  function clearUploadedFile() {
    setFileName("")
    setFileInputKey((current) => current + 1)
    setSelectedSource("paste")
    setText("")
    setError("")
    setPaywallReason(null)
    setStatus("idle")
    setShowInputPanel(true)
  }

  function handleVoiceSample(sample: VoiceSample | null) {
    setVoiceSample(sample)
    setSelectedSource(sample ? "voice" : "paste")
    setError("")
    setPaywallReason(null)
    setStatus("idle")
    setVoiceAnalysisFailure(null)
    setShowInputPanel(true)
  }

  function openFromUrl() {
    const trimmed = sourceUrl.trim()

    if (trimmed.length < 6) {
      setError("Add a source link or choose one of the prepared imports.")
      return
    }

    setText(
      `Imported from ${trimmed}. I prefer clear structure, concrete verbs, and calm phrasing. If the message can be shorter, I shorten it. If a sentence adds no meaning, I cut it. The result should sound deliberate, not generated.`
    )
    setSelectedSource("url")
    setSourceTab("paste")
    setFileName("")
    setError("")
    setPaywallReason(null)
    setStatus("idle")
    setShowInputPanel(true)
  }

  const isResultTab = analyzedTab === sourceTab
  const canShowCollapsedInput =
    (status === "complete" || status === "failed") && isResultTab
  const canShowResult = status === "complete" && isResultTab && !showInputPanel
  const canShowFailure = status === "failed" && isResultTab && !showInputPanel
  const shouldShowInputPanel = !canShowCollapsedInput || showInputPanel
  const isPaywallVisible = paywallReason !== null && !isPaywallDismissed
  const paywallCopy =
    paywallReason === "text_limit"
      ? {
          title: "Try the paid workflow",
          description:
            "Free mode supports up to 300 characters. Upgrade for longer samples, Telegram imports, and unlimited drafts.",
        }
      : {
          title: "Try the paid workflow",
          description:
            "You’ve used both free analyses in this preview. Upgrade for unlimited checks, richer sources, and more output modes.",
        }

  function startNamingVoice() {
    setVoiceName("")
    setVoiceNameError("")
    setIsNamingVoice(true)
  }

  function saveVoiceToLibrary(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextName = voiceName.trim()

    if (!nextName) {
      setVoiceNameError("Give this voice a name to add it to your library.")
      return
    }

    onVoiceReady?.(nextName)
  }

  return (
    <section
      id="voice-workbench"
      aria-labelledby="workbench-title"
      className={`screen-shift relative z-10 min-h-0 w-full max-w-[64rem] min-w-0 justify-self-end max-sm:h-full max-sm:overflow-hidden ${
        isVisible ? "screen-shift-visible screen-shift-delay-4" : ""
      }`}
    >
      <div
        data-magnetic-proximity
        className="relative flex max-h-[calc(100svh-10.5rem)] flex-col overflow-hidden rounded-[14px] bg-card p-8 shadow-[0_20px_60px_rgba(29,30,34,0.07)] max-[920px]:max-h-[calc(100svh-8.5rem)] max-[920px]:p-6 max-sm:h-full max-sm:max-h-none max-sm:pb-[6.5rem] sm:max-h-[calc(100svh-11.5rem)] sm:p-10"
      >
        {isPaywallVisible ? (
          <div className="absolute inset-0 z-30 flex items-center justify-center bg-white/18 p-8 backdrop-blur-xl">
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="upgrade-title"
              aria-describedby="upgrade-description"
              className="w-full max-w-[30rem] text-center"
            >
              <div className="mx-auto inline-flex size-12 items-center justify-center rounded-[14px] bg-primary text-primary-foreground">
                <CrownIcon aria-hidden="true" className="size-5" />
              </div>
              <h3
                id="upgrade-title"
                className="mt-4 text-[1.35rem] leading-tight font-semibold tracking-[-0.03em]"
              >
                {paywallCopy.title}
              </h3>
              <p
                id="upgrade-description"
                className="mt-3 text-sm leading-relaxed text-muted-foreground"
              >
                {paywallCopy.description}
              </p>
              <div className="mt-5 flex flex-col items-center gap-3">
                <Button type="button" onClick={() => onNavigate?.("#pricing")}>
                  See plans
                  <ArrowRightIcon data-icon="inline-end" aria-hidden="true" />
                </Button>
                <button
                  type="button"
                  onClick={() => setIsPaywallDismissed(true)}
                  className="text-sm font-medium text-foreground/64 transition-colors duration-160 hover:text-foreground"
                >
                  Keep free mode
                </button>
              </div>
            </div>
          </div>
        ) : null}

        <div>
          <div>
            <h2
              id="workbench-title"
              className="text-2xl leading-tight font-semibold tracking-[-0.025em]"
            >
              Teach AI how you write
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Start with a few paragraphs. You can refine your voice later.
            </p>
          </div>
        </div>

        <Tabs
          value={sourceTab}
          onValueChange={(value) => {
            setSourceTab(value as SourceTab)
            setError("")
          }}
          className="mt-5 min-h-0 flex-1 overflow-hidden max-[920px]:mt-4"
        >
          <TabsList variant="line" aria-label="Choose a writing source">
            <TabsTrigger value="paste">Paste text</TabsTrigger>
            <TabsTrigger value="voice">Voice</TabsTrigger>
            <TabsTrigger value="upload">Upload file</TabsTrigger>
            <TabsTrigger value="sources">Other sources</TabsTrigger>
          </TabsList>

          {shouldShowInputPanel ? (
            <>
              <TabsContent
                value="paste"
                className="no-scrollbar min-h-0 touch-pan-y overflow-y-auto overscroll-contain pt-4 pr-2 pb-2 [-webkit-overflow-scrolling:touch] max-[920px]:pt-3"
              >
                <FieldGroup>
                  <Field data-invalid={Boolean(error)}>
                    <FieldLabel htmlFor="writing-samples">
                      Your writing samples
                    </FieldLabel>
                    <Textarea
                      id="writing-samples"
                      name="writingSamples"
                      autoComplete="off"
                      value={text}
                      onChange={(event) => {
                        setText(event.target.value.slice(0, 10000))
                        setError("")
                        setStatus("idle")
                      }}
                      aria-invalid={Boolean(error)}
                      aria-describedby={
                        error ? "writing-error writing-help" : "writing-help"
                      }
                      className="h-44 resize-none overflow-y-auto max-[920px]:h-32 max-sm:h-[clamp(9rem,26svh,13rem)] max-sm:text-[0.9375rem]"
                    />
                    <FieldDescription id="writing-help">
                      Use text you wrote yourself. More variety produces a
                      better voice profile.
                    </FieldDescription>
                    <FieldError id="writing-error">{error}</FieldError>
                  </Field>
                </FieldGroup>
              </TabsContent>

              <TabsContent
                value="voice"
                className="no-scrollbar min-h-0 touch-pan-y overflow-y-auto overscroll-contain pt-4 pr-2 pb-2 [-webkit-overflow-scrolling:touch] max-[920px]:pt-3"
              >
                <VoiceCapture
                  value={voiceSample}
                  error={sourceTab === "voice" ? error : ""}
                  onChange={handleVoiceSample}
                  onError={setError}
                />
              </TabsContent>

              <TabsContent
                value="upload"
                className="no-scrollbar min-h-0 touch-pan-y overflow-y-auto overscroll-contain pt-4 pr-2 pb-2 [-webkit-overflow-scrolling:touch] max-[920px]:pt-3"
              >
                <FieldGroup>
                  <Field data-invalid={Boolean(error)}>
                    <FieldLabel htmlFor="writing-file">
                      Upload a writing sample
                    </FieldLabel>
                    <Input
                      key={fileInputKey}
                      id="writing-file"
                      name="writingFile"
                      type="file"
                      accept=".txt,.md,text/plain,text/markdown"
                      aria-invalid={Boolean(error)}
                      aria-describedby="file-help"
                      onChange={(event) => handleFile(event.target.files?.[0])}
                    />
                    <FieldDescription id="file-help">
                      TXT and Markdown files up to 10,000 characters.
                    </FieldDescription>
                    {fileName && (
                      <div className="flex min-w-0 items-center gap-3 text-sm font-medium">
                        <FileTextIcon aria-hidden="true" />
                        <span className="min-w-0 break-all">
                          {fileName} is ready
                        </span>
                        <button
                          type="button"
                          aria-label="Remove uploaded file"
                          onClick={clearUploadedFile}
                          className="inline-flex size-8 shrink-0 items-center justify-center rounded-[10px] border border-border text-muted-foreground transition-colors duration-160 hover:border-foreground hover:text-foreground"
                        >
                          <XIcon aria-hidden="true" className="size-4" />
                        </button>
                      </div>
                    )}
                    <FieldError>{error}</FieldError>
                  </Field>
                </FieldGroup>
              </TabsContent>

              <TabsContent
                value="sources"
                className="no-scrollbar min-h-0 touch-pan-y overflow-y-auto overscroll-contain pt-4 pr-2 pb-2 [-webkit-overflow-scrolling:touch] max-[920px]:pt-3"
              >
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="source-url">
                      Source link or handle
                    </FieldLabel>
                    <div className="flex flex-col gap-3 sm:flex-row">
                      <Input
                        id="source-url"
                        name="sourceUrl"
                        value={sourceUrl}
                        onChange={(event) => {
                          setSourceUrl(event.target.value)
                          setError("")
                        }}
                        placeholder="https://your-site.com/article or @telegram_export"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={openFromUrl}
                      >
                        Use sample import
                      </Button>
                    </div>
                    <FieldDescription>
                      For now this loads a realistic sample flow for URL,
                      Telegram, or docs-based imports.
                    </FieldDescription>
                  </Field>
                </FieldGroup>

                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  {[
                    {
                      key: "url",
                      title: "Public writing URL",
                      description:
                        "Import published posts and keep the same tone in new drafts.",
                      icon: LinkIcon,
                    },
                    {
                      key: "telegram",
                      title: "Telegram chats",
                      description:
                        "Load chat exports and learn your real conversational rhythm.",
                      icon: SendIcon,
                    },
                    {
                      key: "docs",
                      title: "Docs and workspaces",
                      description:
                        "Bring in notes, docs, and internal writing for deeper voice coverage.",
                      icon: UploadIcon,
                    },
                  ].map(({ key, title, description, icon: Icon }) => {
                    const isActive = selectedSource === key

                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() =>
                          loadSourceSample(key as keyof typeof sourceSamples)
                        }
                        className={`flex min-h-36 flex-col rounded-xl border bg-background p-4 text-left transition-[transform,border-color,box-shadow] duration-160 ease-[cubic-bezier(0.23,1,0.32,1)] hover:-translate-y-0.5 ${
                          isActive
                            ? "border-foreground shadow-[0_16px_32px_rgba(29,30,34,0.06)]"
                            : "border-border"
                        }`}
                      >
                        <Icon aria-hidden="true" className="size-5" />
                        <p className="mt-4 font-medium">{title}</p>
                        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                          {description}
                        </p>
                      </button>
                    )
                  })}
                </div>
              </TabsContent>
            </>
          ) : (
            <div className="min-h-0 overflow-y-auto pt-4 pr-2 max-[920px]:pt-3">
              <button
                type="button"
                onClick={() => setShowInputPanel(true)}
                className="flex w-full items-center justify-between rounded-xl border border-border bg-background px-4 py-3 text-left transition-colors duration-160 hover:bg-muted/40"
              >
                <div>
                  <p className="text-sm font-medium">
                    {sourceTab === "voice"
                      ? "Voice sample hidden"
                      : "Writing samples hidden"}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {sourceTab === "voice"
                      ? "Open the recording again to review or replace it."
                      : "Open your source text again and the result panel will collapse."}
                  </p>
                </div>
                <span className="text-sm font-medium text-foreground">
                  {sourceTab === "voice" ? "Open recording" : "Open samples"}
                </span>
              </button>
            </div>
          )}
        </Tabs>

        <div
          className={cn(
            "mt-5 shrink-0 border-t border-border pt-4 max-[920px]:mt-4 max-[920px]:pt-3",
            status === "idle" && !canShowCollapsedInput
              ? "max-sm:absolute max-sm:inset-x-6 max-sm:bottom-[max(1.5rem,env(safe-area-inset-bottom))] max-sm:mt-0 max-sm:border-t-0 max-sm:pt-0"
              : ""
          )}
        >
          {status === "analyzing" ? (
            <Progress
              value={analysisPhase === "indeterminate" ? null : progress}
              aria-label="Voice analysis progress"
              className="gap-4"
            >
              <ProgressLabel>
                {sourceTab === "voice"
                  ? "Finding patterns in your voice…"
                  : "Finding patterns in your writing…"}
              </ProgressLabel>
              <ProgressTrack>
                <ProgressIndicator />
                {analysisPhase === "determinate" ? (
                  <ProgressValue>
                    {(_formattedValue, value) => `${value ?? 0}%`}
                  </ProgressValue>
                ) : (
                  <span className="absolute inset-y-0 right-3 z-10 inline-flex items-center text-[0.72rem] font-medium text-white/82">
                    analyzing
                  </span>
                )}
              </ProgressTrack>
            </Progress>
          ) : canShowResult ? (
            <div
              ref={resultRef}
              tabIndex={-1}
              role="status"
              aria-live="polite"
              className="result-enter rounded-xl bg-primary p-6 text-primary-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:p-7"
            >
              {isNamingVoice ? (
                <form onSubmit={saveVoiceToLibrary} className="max-w-xl">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <CheckIcon aria-hidden="true" />
                    Voice profile ready
                  </div>
                  <h3 className="mt-3 text-xl font-medium tracking-[-0.035em] sm:text-2xl">
                    Name your voice
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-primary-foreground/68">
                    This is how it will appear in your library and drafting
                    workspace.
                  </p>
                  <FieldGroup className="mt-5">
                    <Field data-invalid={Boolean(voiceNameError)}>
                      <FieldLabel
                        className="text-primary-foreground"
                        htmlFor="voice-profile-name"
                      >
                        Voice name
                      </FieldLabel>
                      <Input
                        ref={voiceNameInputRef}
                        id="voice-profile-name"
                        value={voiceName}
                        onChange={(event) => {
                          setVoiceName(event.target.value)
                          setVoiceNameError("")
                        }}
                        aria-invalid={Boolean(voiceNameError)}
                        aria-describedby={
                          voiceNameError ? "voice-name-error" : undefined
                        }
                        placeholder="e.g. Founder voice"
                        className="border-white/24 bg-white text-foreground placeholder:text-muted-foreground"
                      />
                      {voiceNameError ? (
                        <FieldError
                          id="voice-name-error"
                          className="text-primary-foreground"
                        >
                          {voiceNameError}
                        </FieldError>
                      ) : null}
                    </Field>
                  </FieldGroup>
                  <div className="mt-5 flex flex-wrap gap-2">
                    <Button type="submit" variant="outline">
                      Add to library
                      <ArrowRightIcon
                        data-icon="inline-end"
                        aria-hidden="true"
                      />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      className="text-primary-foreground hover:bg-white/10 hover:text-primary-foreground"
                      onClick={() => setIsNamingVoice(false)}
                    >
                      Back
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <CheckIcon aria-hidden="true" />
                      Your voice profile is ready
                    </div>
                    <h3 className="mt-3 text-xl font-medium tracking-[-0.035em] sm:text-2xl">
                      {sourceTab === "voice"
                        ? "We saved the tone, pacing, and delivery from your voice."
                        : "We saved the rhythm, tone, and vocabulary from your writing."}
                    </h3>
                    <p className="mt-2 max-w-xl text-sm leading-relaxed text-primary-foreground/68">
                      We saved a reusable baseline for every new draft and
                      conversation.
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    className="shrink-0"
                    onClick={() => {
                      if (onVoiceReady) {
                        startNamingVoice()
                        return
                      }
                      onNavigate?.("#ai-clone")
                    }}
                  >
                    {onVoiceReady ? "Add to library" : "Try it now"}
                    <ArrowRightIcon data-icon="inline-end" aria-hidden="true" />
                  </Button>
                </div>
              )}
            </div>
          ) : canShowFailure && voiceAnalysisFailure ? (
            <div
              ref={resultRef}
              tabIndex={-1}
              role="alert"
              aria-live="assertive"
              className="result-enter rounded-xl bg-primary p-6 text-primary-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:p-7"
            >
              <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <TriangleAlertIcon aria-hidden="true" />
                    We couldn’t analyze this recording
                  </div>
                  <h3 className="mt-3 text-xl font-medium tracking-[-0.035em] sm:text-2xl">
                    {voiceAnalysisFailure === "too_short"
                      ? "We need a longer voice sample."
                      : "We couldn’t hear your voice clearly enough."}
                  </h3>
                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-primary-foreground/68">
                    {voiceAnalysisFailure === "too_short"
                      ? "This recording is under 20 seconds. Record 20–60 seconds with a few complete sentences."
                      : "The audio is too quiet or unclear. Move closer to the microphone and reduce background noise."}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  className="shrink-0"
                  onClick={() => {
                    handleVoiceSample(null)
                    setSourceTab("voice")
                    setShowInputPanel(true)
                  }}
                >
                  <RotateCcwIcon data-icon="inline-start" aria-hidden="true" />
                  Try another sample
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-2.5 text-sm text-muted-foreground max-sm:hidden">
                <LockKeyholeIcon aria-hidden="true" />
                <span>
                  {sourceTab === "voice"
                    ? "Your voice sample stays private and can be deleted anytime."
                    : "Your text stays private and can be deleted anytime."}
                </span>
              </div>
              <div className="flex items-center justify-between gap-5 max-sm:w-full sm:justify-end">
                <span className="text-sm text-muted-foreground tabular-nums max-sm:hidden">
                  {sourceTab === "voice"
                    ? voiceSample?.duration
                      ? `${Math.floor(voiceSample.duration / 60)}:${(
                          voiceSample.duration % 60
                        )
                          .toString()
                          .padStart(2, "0")}`
                      : voiceSample
                        ? "Audio ready"
                        : "No audio"
                    : `${text.length.toLocaleString()} / 10,000`}
                </span>
                {canShowCollapsedInput ? (
                  <Button
                    type="button"
                    onClick={() => setShowInputPanel(false)}
                  >
                    Back to result
                    <ArrowRightIcon data-icon="inline-end" aria-hidden="true" />
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={analyzeVoice}
                    className="max-sm:h-14 max-sm:w-full max-sm:text-base"
                  >
                    Analyze my voice
                    <ArrowRightIcon data-icon="inline-end" aria-hidden="true" />
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export function WritingModes() {
  const [isVisible, setIsVisible] = useState(false)
  const [beforeText, setBeforeText] = useState(
    "We are excited to announce the launch of our new platform that helps teams improve productivity and streamline workflows across departments."
  )
  const [outputKind, setOutputKind] = useState<DraftKind>("post")
  const [isOutputMenuOpen, setIsOutputMenuOpen] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  const rewrittenText = (() => {
    const source =
      beforeText.trim() ||
      "Add a message, document, or email to rewrite it in your voice."

    switch (outputKind) {
      case "message":
        return `Quick version: ${source}\n\nClear enough to act on, with the same calm, human rhythm.`
      case "email":
        return `Subject: A clearer update\n\n${source}\n\nI kept the message direct, useful, and easy to reply to.`
      case "article":
        return `${source}\n\nThe real value is not simply moving faster. It is keeping the person behind the words while adapting the writing to the format.`
      case "reply":
        return `Thanks — ${source}\n\nThat is the short, clear version in your own voice.`
      default:
        return `${source}\n\nThe point lands faster, the tone stays composed, and the message still sounds recognisably like you.`
    }
  })()

  useEffect(() => {
    const node = sectionRef.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
      },
      { threshold: 0.45 }
    )

    observer.observe(node)

    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="how-it-works"
      aria-labelledby="modes-title"
      className="flex h-[100svh] min-h-0 snap-start snap-always items-stretch overflow-hidden bg-background"
    >
      <div className="mobile-section-safe mx-auto h-full min-h-0 w-full max-w-[1440px] px-4 pt-20 pb-3 sm:px-5 sm:py-6 lg:px-8 lg:py-10 xl:py-28">
        <div className="relative flex h-full min-h-0 flex-col">
          <div className="grid min-h-0 flex-1 items-center gap-6 xl:grid-cols-[minmax(19rem,0.78fr)_minmax(0,1.22fr)] xl:gap-14">
            <div className="hidden h-full items-center xl:flex">
              <div
                className={`screen-shift ${
                  isVisible ? "screen-shift-visible screen-shift-delay-1" : ""
                } flex max-w-[34rem] flex-col justify-center`}
              >
                <h2
                  id="modes-title"
                  className={`screen-shift text-[clamp(2.75rem,4.5vw,4.6rem)] leading-[0.95] font-medium tracking-[-0.04em] text-balance ${
                    isVisible ? "screen-shift-visible screen-shift-delay-2" : ""
                  }`}
                >
                  One voice, shaped for the moment.
                </h2>
                <p
                  className={`screen-shift mt-4 max-w-[30rem] text-lg leading-relaxed text-muted-foreground ${
                    isVisible ? "screen-shift-visible screen-shift-delay-3" : ""
                  }`}
                >
                  Change the context without losing the person behind the words.
                </p>
              </div>
            </div>

            <div
              className={`screen-shift ${
                isVisible ? "screen-shift-visible screen-shift-delay-3" : ""
              }`}
            >
              <div
                data-magnetic-proximity
                className="rounded-2xl bg-white/82 p-4 shadow-[0_24px_70px_rgba(29,30,34,0.06)] sm:p-6 lg:p-7 xl:p-8"
              >
                <div className="flex min-h-0 flex-col gap-4 sm:gap-6">
                  <div className="flex flex-col">
                    <p
                      className={`screen-shift hidden text-sm font-medium text-muted-foreground sm:block ${
                        isVisible
                          ? "screen-shift-visible screen-shift-delay-3"
                          : ""
                      }`}
                    >
                      Adaptive modes
                    </p>
                    <p
                      className={`screen-shift max-w-[22ch] text-[clamp(1.8rem,3.1vw,3rem)] leading-[1.02] font-medium tracking-[-0.04em] text-balance sm:mt-2 sm:text-[clamp(2rem,3.1vw,3rem)] ${
                        isVisible
                          ? "screen-shift-visible screen-shift-delay-4"
                          : ""
                      }`}
                    >
                      Rewrite without losing your baseline voice.
                    </p>
                  </div>

                  <div className="grid min-h-0 grid-cols-1 items-center gap-2 sm:gap-3 lg:grid-cols-[minmax(0,0.94fr)_2rem_minmax(0,1.06fr)] lg:gap-4">
                    <article className="screen-shift screen-shift-visible screen-shift-delay-1 flex h-38 min-h-0 flex-col rounded-2xl bg-background p-4 sm:h-56 sm:p-5 lg:h-[22rem] lg:p-6">
                      <p className="text-sm font-medium">Before</p>
                      <Textarea
                        aria-label="Text to rewrite"
                        value={beforeText}
                        onChange={(event) => setBeforeText(event.target.value)}
                        className="mt-3 min-h-0 flex-1 resize-none border-0 bg-transparent p-0 text-sm leading-relaxed text-muted-foreground shadow-none focus-visible:ring-0 sm:mt-4 sm:text-base"
                      />
                    </article>

                    <ArrowRightIcon
                      aria-hidden="true"
                      className="screen-shift screen-shift-visible screen-shift-delay-2 mx-auto size-4 rotate-90 lg:size-5 lg:rotate-0"
                    />

                    <article className="screen-shift screen-shift-visible screen-shift-delay-3 flex h-38 min-h-0 flex-col rounded-2xl bg-primary p-4 text-primary-foreground sm:h-56 sm:p-5 lg:h-[22rem] lg:p-6">
                      <div className="flex items-center justify-between gap-4">
                        <p className="text-sm font-medium text-primary-foreground/72">
                          In your voice
                        </p>
                        <div
                          className="relative"
                          onBlur={(event) => {
                            if (
                              !event.currentTarget.contains(event.relatedTarget)
                            ) {
                              setIsOutputMenuOpen(false)
                            }
                          }}
                        >
                          <button
                            type="button"
                            aria-haspopup="listbox"
                            aria-expanded={isOutputMenuOpen}
                            onClick={() =>
                              setIsOutputMenuOpen((current) => !current)
                            }
                            className="inline-flex h-9 items-center gap-2 rounded-[10px] border border-white/22 bg-white/8 px-3 text-sm font-medium text-primary-foreground transition-[transform,border-color,background-color] duration-160 hover:border-white/42 hover:bg-white/12 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white active:scale-[0.97]"
                          >
                            {
                              draftOptions.find(
                                (option) => option.value === outputKind
                              )?.label
                            }
                            <ChevronDownIcon
                              aria-hidden="true"
                              className={cn(
                                "size-4 text-primary-foreground/70 transition-transform duration-160",
                                isOutputMenuOpen ? "rotate-180" : ""
                              )}
                            />
                          </button>

                          {isOutputMenuOpen ? (
                            <div
                              role="listbox"
                              aria-label="Output format"
                              className="absolute top-11 right-0 z-10 w-44 rounded-xl bg-white p-1 text-foreground shadow-[0_8px_18px_rgba(29,30,34,0.18)]"
                            >
                              {draftOptions.map(
                                ({ value, label, icon: Icon }) => (
                                  <button
                                    key={value}
                                    type="button"
                                    role="option"
                                    aria-selected={outputKind === value}
                                    onClick={() => {
                                      setOutputKind(value)
                                      setIsOutputMenuOpen(false)
                                    }}
                                    className={cn(
                                      "flex w-full items-center gap-2 rounded-[9px] px-3 py-2 text-left text-sm font-medium transition-colors duration-160",
                                      outputKind === value
                                        ? "bg-primary text-primary-foreground"
                                        : "text-foreground/72 hover:bg-muted hover:text-foreground"
                                    )}
                                  >
                                    <Icon
                                      aria-hidden="true"
                                      className="size-4"
                                      strokeWidth={1.5}
                                    />
                                    {label}
                                  </button>
                                )
                              )}
                            </div>
                          ) : null}
                        </div>
                      </div>
                      <p className="mt-3 min-h-0 flex-1 overflow-y-auto pr-1 text-sm leading-relaxed whitespace-pre-wrap text-primary-foreground/92 sm:mt-5 sm:text-base">
                        {rewrittenText}
                      </p>
                    </article>
                  </div>

                  <div className="hidden flex-wrap items-center gap-x-5 gap-y-2 border-t border-border pt-4 text-sm text-muted-foreground lg:flex">
                    <span className="inline-flex items-center gap-2">
                      <Clock3Icon
                        aria-hidden="true"
                        className="size-4 text-foreground"
                      />
                      Your rhythm stays intact
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <LinkIcon
                        aria-hidden="true"
                        className="size-4 text-foreground"
                      />
                      Paste text, files, or docs
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
