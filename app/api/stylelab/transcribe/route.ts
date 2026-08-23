import { NextResponse } from "next/server"

export const runtime = "nodejs"

export async function POST(request: Request) {
  try {
    const key = process.env.ELEVENLABS_API_KEY
    if (!key) {
      return NextResponse.json(
        { error: "ELEVENLABS_API_KEY is not configured on the server." },
        { status: 503 }
      )
    }
    const incoming = await request.formData()
    const file = incoming.get("file")
    if (!(file instanceof File) || file.size === 0) {
      return NextResponse.json({ error: "Audio file is required." }, { status: 400 })
    }
    if (file.size > 25 * 1024 * 1024) {
      return NextResponse.json({ error: "Audio is limited to 25 MB." }, { status: 413 })
    }

    const form = new FormData()
    form.set("file", file, file.name || "voice-sample.webm")
    form.set("model_id", "scribe_v2")
    form.set("tag_audio_events", "true")
    form.set("diarize", "false")
    form.set("timestamps_granularity", "word")

    const response = await fetch("https://api.elevenlabs.io/v1/speech-to-text", {
      method: "POST",
      headers: { "xi-api-key": key },
      body: form,
      signal: AbortSignal.timeout(90_000),
    })
    const payload = (await response.json().catch(() => null)) as
      | { text?: string; detail?: { message?: string }; message?: string }
      | null
    if (!response.ok) {
      return NextResponse.json(
        { error: payload?.detail?.message || payload?.message || `Transcription failed (${response.status}).` },
        { status: response.status }
      )
    }
    const transcript = payload?.text?.trim()
    if (!transcript) {
      return NextResponse.json({ error: "The recording contains no usable speech." }, { status: 422 })
    }
    return NextResponse.json({ transcript })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Voice transcription failed." },
      { status: 500 }
    )
  }
}
