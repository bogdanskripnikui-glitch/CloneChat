"use client"

import { useEffect, useRef, useState } from "react"
import {
  AudioLinesIcon,
  MicIcon,
  PauseIcon,
  PlayIcon,
  SquareIcon,
  UploadIcon,
  XIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

const BAR_COUNT = 48

export type VoiceSample = {
  file: File
  duration: number | null
  source: "upload" | "recording"
}

function formatDuration(seconds: number) {
  const minutes = Math.floor(seconds / 60)
  const remainder = seconds % 60
  return `${minutes}:${remainder.toString().padStart(2, "0")}`
}

export function VoiceCapture({
  value,
  error,
  onChange,
  onError,
}: {
  value: VoiceSample | null
  error: string
  onChange: (sample: VoiceSample | null) => void
  onError: (message: string) => void
}) {
  const [isRecording, setIsRecording] = useState(false)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [audioUrl, setAudioUrl] = useState("")
  const [isPlaying, setIsPlaying] = useState(false)
  const [playbackTime, setPlaybackTime] = useState(0)
  const [playbackDuration, setPlaybackDuration] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const audioUrlRef = useRef("")
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const animationFrameRef = useRef(0)
  const timerRef = useRef<number | null>(null)
  const startedAtRef = useRef(0)
  const chunksRef = useRef<Blob[]>([])
  const barRefs = useRef<Array<HTMLSpanElement | null>>([])

  function stopVisualization() {
    if (animationFrameRef.current) {
      window.cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = 0
    }

    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current)
      timerRef.current = null
    }

    streamRef.current?.getTracks().forEach((track) => track.stop())
    streamRef.current = null

    if (audioContextRef.current) {
      void audioContextRef.current.close()
      audioContextRef.current = null
    }
  }

  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current?.state === "recording") {
        mediaRecorderRef.current.stop()
      }
      if (audioUrlRef.current) URL.revokeObjectURL(audioUrlRef.current)
      stopVisualization()
    }
  }, [])

  function preparePlayback(file: File, duration: number | null) {
    if (audioUrlRef.current) URL.revokeObjectURL(audioUrlRef.current)
    const nextUrl = URL.createObjectURL(file)
    audioUrlRef.current = nextUrl
    setAudioUrl(nextUrl)
    setIsPlaying(false)
    setPlaybackTime(0)
    setPlaybackDuration(duration ?? 0)
  }

  function animateWaveform(analyser: AnalyserNode) {
    const frequencyData = new Uint8Array(analyser.frequencyBinCount)
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches
    let lastUpdate = 0

    const draw = (time: number) => {
      if (!reducedMotion || time - lastUpdate > 140) {
        analyser.getByteFrequencyData(frequencyData)

        barRefs.current.forEach((bar, index) => {
          if (!bar) return
          const dataIndex = Math.floor(
            (index / Math.max(BAR_COUNT - 1, 1)) *
              Math.min(frequencyData.length - 1, 220)
          )
          const level = frequencyData[dataIndex] / 255
          bar.style.transform = `scaleY(${Math.max(0.14, level)})`
        })

        lastUpdate = time
      }

      animationFrameRef.current = window.requestAnimationFrame(draw)
    }

    animationFrameRef.current = window.requestAnimationFrame(draw)
  }

  async function startRecording() {
    if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) {
      onError("Voice recording is not supported in this browser.")
      return
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const audioContext = new AudioContext()
      const analyser = audioContext.createAnalyser()
      analyser.fftSize = 256
      analyser.smoothingTimeConstant = 0.72
      audioContext.createMediaStreamSource(stream).connect(analyser)

      const recorder = new MediaRecorder(stream)
      chunksRef.current = []
      recorder.addEventListener("dataavailable", (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data)
      })
      recorder.addEventListener("stop", () => {
        const duration = Math.max(
          1,
          Math.round((performance.now() - startedAtRef.current) / 1000)
        )
        const type = recorder.mimeType || "audio/webm"
        const extension = type.includes("mp4") ? "m4a" : "webm"
        const blob = new Blob(chunksRef.current, { type })
        const file = new File([blob], `voice-recording.${extension}`, { type })

        preparePlayback(file, duration)
        onChange({ file, duration, source: "recording" })
        setElapsedSeconds(duration)
      })

      streamRef.current = stream
      audioContextRef.current = audioContext
      mediaRecorderRef.current = recorder
      startedAtRef.current = performance.now()
      setElapsedSeconds(0)
      setIsRecording(true)
      onError("")
      recorder.start(250)
      animateWaveform(analyser)

      timerRef.current = window.setInterval(() => {
        const elapsed = Math.floor(
          (performance.now() - startedAtRef.current) / 1000
        )
        setElapsedSeconds(elapsed)
      }, 250)
    } catch {
      stopVisualization()
      setIsRecording(false)
      onError("Allow microphone access to record a voice sample.")
    }
  }

  function stopRecording() {
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop()
    }
    stopVisualization()
    setIsRecording(false)
  }

  function handleFile(file: File | undefined) {
    if (!file) return

    if (!file.type.startsWith("audio/")) {
      onError("Choose an audio file such as MP3, WAV, M4A, or WebM.")
      return
    }

    onError("")
    preparePlayback(file, null)
    onChange({ file, duration: null, source: "upload" })
  }

  function clearSample() {
    audioRef.current?.pause()
    if (audioUrlRef.current) URL.revokeObjectURL(audioUrlRef.current)
    audioUrlRef.current = ""
    setAudioUrl("")
    setIsPlaying(false)
    setPlaybackTime(0)
    setPlaybackDuration(0)
    onChange(null)
    onError("")
    setElapsedSeconds(0)
    if (fileInputRef.current) fileInputRef.current.value = ""
    barRefs.current.forEach((bar) => {
      if (bar) bar.style.transform = "scaleY(0.14)"
    })
  }

  async function togglePlayback() {
    const audio = audioRef.current
    if (!audio) return

    if (audio.paused) {
      try {
        await audio.play()
      } catch {
        onError("This audio file cannot be played in your browser.")
      }
      return
    }

    audio.pause()
  }

  function seekPlayback(nextTime: number) {
    const audio = audioRef.current
    if (!audio) return
    audio.currentTime = nextTime
    setPlaybackTime(nextTime)
  }

  return (
    <Field data-invalid={Boolean(error)}>
      <FieldLabel htmlFor="voice-file">Add a voice sample</FieldLabel>

      <div className="rounded-xl border border-border bg-background p-4 sm:p-5">
        <div
          aria-hidden="true"
          className="flex h-20 items-center justify-center gap-1 overflow-hidden rounded-[10px] bg-muted/45 px-3"
        >
          {Array.from({ length: BAR_COUNT }, (_, index) => {
            const restingLevel =
              0.14 +
              ((Math.sin(index * 0.68) + 1) / 2) *
                (0.2 + ((index * 7) % 9) / 24)

            return (
              <span
                key={index}
                ref={(node) => {
                  barRefs.current[index] = node
                }}
                className="h-14 w-0.5 shrink-0 origin-center rounded-full bg-foreground"
                style={{ transform: `scaleY(${restingLevel})` }}
              />
            )
          })}
        </div>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button
            type="button"
            variant={isRecording ? "default" : "outline"}
            aria-pressed={isRecording}
            onClick={isRecording ? stopRecording : startRecording}
          >
            {isRecording ? (
              <SquareIcon data-icon="inline-start" aria-hidden="true" />
            ) : (
              <MicIcon data-icon="inline-start" aria-hidden="true" />
            )}
            {isRecording ? "Stop recording" : "Record voice"}
          </Button>

          <span
            className="text-sm text-muted-foreground"
            role="status"
            aria-live="polite"
          >
            {isRecording
              ? `Recording ${formatDuration(elapsedSeconds)}`
              : value?.source === "recording"
                ? `Recorded ${formatDuration(value.duration ?? elapsedSeconds)}`
                : "Your waveform will react to your voice."}
          </span>

          <span className="hidden text-sm text-muted-foreground sm:inline">
            or
          </span>
          <Input
            ref={fileInputRef}
            id="voice-file"
            name="voiceFile"
            type="file"
            accept="audio/*,.mp3,.wav,.m4a,.webm,.ogg"
            className="sr-only"
            disabled={isRecording}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? "voice-error voice-help" : "voice-help"}
            onChange={(event) => handleFile(event.target.files?.[0])}
          />
          <Button
            type="button"
            variant="ghost"
            disabled={isRecording}
            onClick={() => fileInputRef.current?.click()}
          >
            <UploadIcon data-icon="inline-start" aria-hidden="true" />
            Upload audio
          </Button>
        </div>

        {value && audioUrl ? (
          <div className="mt-4 rounded-[10px] bg-muted/45 px-3 py-2.5 text-sm">
            <audio
              ref={audioRef}
              src={audioUrl}
              preload="metadata"
              onLoadedMetadata={(event) => {
                const duration = Number.isFinite(event.currentTarget.duration)
                  ? event.currentTarget.duration
                  : (value.duration ?? 0)
                setPlaybackDuration(duration)
                if (value.duration === null && duration > 0) {
                  onChange({ ...value, duration: Math.round(duration) })
                }
              }}
              onTimeUpdate={(event) =>
                setPlaybackTime(event.currentTarget.currentTime)
              }
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onEnded={() => {
                setIsPlaying(false)
                setPlaybackTime(0)
              }}
            />

            <div className="flex min-w-0 items-center gap-3">
              <Button
                type="button"
                variant="ghost"
                size="icon-lg"
                aria-label={
                  isPlaying ? "Pause voice sample" : "Play voice sample"
                }
                onClick={togglePlayback}
                className="shrink-0 rounded-[10px]"
              >
                {isPlaying ? (
                  <PauseIcon aria-hidden="true" />
                ) : (
                  <PlayIcon aria-hidden="true" />
                )}
              </Button>
              <AudioLinesIcon aria-hidden="true" className="size-4 shrink-0" />
              <span className="min-w-0 flex-1 truncate font-medium">
                {value.file.name}
              </span>
              <button
                type="button"
                aria-label="Remove voice sample"
                onClick={clearSample}
                className="inline-flex size-8 shrink-0 items-center justify-center rounded-[10px] text-muted-foreground transition-colors duration-160 hover:bg-background hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                <XIcon aria-hidden="true" className="size-4" />
              </button>
            </div>

            <div className="mt-2 flex items-center gap-3 px-1">
              <span className="w-9 text-right text-xs text-muted-foreground tabular-nums">
                {formatDuration(Math.floor(playbackTime))}
              </span>
              <input
                type="range"
                min="0"
                max={Math.max(playbackDuration, 0.1)}
                step="0.1"
                value={Math.min(playbackTime, Math.max(playbackDuration, 0.1))}
                aria-label="Voice sample playback position"
                onChange={(event) => seekPlayback(Number(event.target.value))}
                className="h-1.5 min-w-0 flex-1 cursor-pointer accent-foreground"
              />
              <span className="w-9 text-xs text-muted-foreground tabular-nums">
                {formatDuration(Math.floor(playbackDuration))}
              </span>
            </div>
          </div>
        ) : null}
      </div>

      <FieldDescription id="voice-help">
        Record or upload MP3, WAV, M4A, WebM, or OGG. Clear recordings produce a
        more accurate voice clone.
      </FieldDescription>
      <FieldError id="voice-error">{error}</FieldError>
    </Field>
  )
}
