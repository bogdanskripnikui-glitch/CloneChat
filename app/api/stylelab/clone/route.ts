import { NextResponse } from "next/server"

import { elevenLabsError, getElevenLabsApiKey } from "@/lib/stylelab/elevenlabs"

export const runtime = "nodejs"

export async function POST(request: Request) {
  try {
    const key = getElevenLabsApiKey()
    if (!key) {
      return NextResponse.json(
        { error: "Voice cloning is not configured on the server." },
        { status: 503 }
      )
    }

    const incoming = await request.formData()
    const file = incoming.get("file")
    const name = String(incoming.get("name") || "Voxform voice").slice(0, 80)

    if (!(file instanceof File) || file.size === 0) {
      return NextResponse.json(
        { error: "Audio file is required." },
        { status: 400 }
      )
    }
    const form = new FormData()
    form.append("files", file, file.name || "voice-sample.webm")
    form.set("name", name)
    form.set("description", "Voice clone created with Voxform")

    const response = await fetch("https://api.elevenlabs.io/v1/voices/add", {
      method: "POST",
      headers: { "xi-api-key": key },
      body: form,
      signal: AbortSignal.timeout(90_000),
    })
    const payload = (await response.json().catch(() => null)) as {
      voice_id?: string
      detail?: { message?: string }
      message?: string
    } | null

    if (!response.ok || !payload?.voice_id) {
      return NextResponse.json(
        {
          error: elevenLabsError(
            response.status,
            payload,
            `Voice cloning failed (${response.status}).`
          ),
        },
        { status: response.status || 502 }
      )
    }

    return NextResponse.json({ voiceId: payload.voice_id, name })
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Voice cloning failed.",
      },
      { status: 500 }
    )
  }
}
