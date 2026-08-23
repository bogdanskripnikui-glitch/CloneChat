"use client"

import { useEffect, useRef, useState } from "react"
import {
  DownloadIcon,
  LoaderCircleIcon,
  SquareIcon,
  Volume2Icon,
  VolumeXIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { useSavedVoiceClone } from "@/lib/stylelab/voice-clone"
import { cn } from "@/lib/utils"

export function VoicePlaybackButton({
  text,
  onRequestVoice,
  inverse = false,
  className,
}: {
  text: string
  onRequestVoice: () => void
  inverse?: boolean
  className?: string
}) {
  const voice = useSavedVoiceClone()
  const [status, setStatus] = useState<"idle" | "loading" | "playing">("idle")
  const [isDownloading, setIsDownloading] = useState(false)
  const [error, setError] = useState("")
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const urlRef = useRef<string | null>(null)

  function resetAudio() {
    audioRef.current?.pause()
    audioRef.current = null
    if (urlRef.current) URL.revokeObjectURL(urlRef.current)
    urlRef.current = null
    setStatus("idle")
  }

  useEffect(() => resetAudio, [])

  async function generateSpeech() {
    if (!voice) throw new Error("A saved voice is required.")

    const response = await fetch("/api/stylelab/speak", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, voiceId: voice.id }),
    })
    if (!response.ok) {
      const payload = (await response.json().catch(() => null)) as {
        error?: string
      } | null
      throw new Error(payload?.error || "Could not generate speech.")
    }

    return response.blob()
  }

  async function handleClick() {
    if (!voice) {
      onRequestVoice()
      return
    }
    if (status === "playing") {
      resetAudio()
      return
    }
    if (status === "loading") return

    setStatus("loading")
    setError("")
    try {
      resetAudio()
      const url = URL.createObjectURL(await generateSpeech())
      const audio = new Audio(url)
      urlRef.current = url
      audioRef.current = audio
      audio.addEventListener("ended", resetAudio, { once: true })
      audio.addEventListener("error", resetAudio, { once: true })
      await audio.play()
      setStatus("playing")
    } catch (playbackError) {
      resetAudio()
      setError(
        playbackError instanceof Error
          ? playbackError.message
          : "Could not generate speech."
      )
    }
  }

  async function handleDownload() {
    if (!voice) {
      onRequestVoice()
      return
    }
    if (isDownloading) return

    setIsDownloading(true)
    setError("")
    try {
      const blob = await generateSpeech()
      const url = URL.createObjectURL(blob)
      const safeVoiceName =
        voice.name
          .trim()
          .toLowerCase()
          .replace(/[^\p{L}\p{N}]+/gu, "-")
          .replace(/^-|-$/g, "") || "voice"
      const link = document.createElement("a")
      link.href = url
      link.download = `voxform-${safeVoiceName}.mp3`
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.setTimeout(() => URL.revokeObjectURL(url), 1000)
    } catch (downloadError) {
      setError(
        downloadError instanceof Error
          ? downloadError.message
          : "Could not download speech."
      )
    } finally {
      setIsDownloading(false)
    }
  }

  const label = !voice
    ? "Add a voice to enable playback"
    : status === "loading"
      ? "Generating speech"
      : status === "playing"
        ? "Stop playback"
        : `Play with ${voice.name}`
  const downloadLabel = !voice
    ? "Add a voice to enable download"
    : isDownloading
      ? "Generating audio file"
      : `Download audio with ${voice.name}`

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="icon-lg"
        aria-label={label}
        title={label}
        onClick={handleClick}
        className={cn(
          "size-11 rounded-xl transition-[transform,background-color,color,opacity] motion-reduce:transition-none",
          inverse
            ? "text-white hover:bg-white/12 hover:text-white"
            : "text-foreground hover:bg-muted",
          !voice && "opacity-42 hover:opacity-70",
          className
        )}
      >
        {status === "loading" ? (
          <LoaderCircleIcon
            className="animate-spin motion-reduce:animate-none"
            aria-hidden="true"
          />
        ) : status === "playing" ? (
          <SquareIcon aria-hidden="true" />
        ) : voice ? (
          <Volume2Icon aria-hidden="true" />
        ) : (
          <VolumeXIcon aria-hidden="true" />
        )}
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon-lg"
        aria-label={downloadLabel}
        title={downloadLabel}
        aria-busy={isDownloading}
        onClick={handleDownload}
        className={cn(
          "size-11 rounded-xl transition-[transform,background-color,color,opacity] motion-reduce:transition-none",
          inverse
            ? "text-white hover:bg-white/12 hover:text-white"
            : "text-foreground hover:bg-muted",
          !voice && "opacity-42 hover:opacity-70",
          className
        )}
      >
        {isDownloading ? (
          <LoaderCircleIcon
            className="animate-spin motion-reduce:animate-none"
            aria-hidden="true"
          />
        ) : (
          <DownloadIcon aria-hidden="true" />
        )}
      </Button>
      {error ? (
        <span className="sr-only" role="alert">
          {error}
        </span>
      ) : null}
    </>
  )
}
