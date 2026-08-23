"use client"

import { useEffect, useRef, useState } from "react"
import {
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

      resetAudio()
      const url = URL.createObjectURL(await response.blob())
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

  const label = !voice
    ? "Add a voice to enable playback"
    : status === "loading"
      ? "Generating speech"
      : status === "playing"
        ? "Stop playback"
        : `Play with ${voice.name}`

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
      {error ? (
        <span className="sr-only" role="alert">
          {error}
        </span>
      ) : null}
    </>
  )
}
