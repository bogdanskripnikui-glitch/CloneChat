import { NextResponse } from "next/server"

import { elevenLabsError, getElevenLabsApiKey } from "@/lib/stylelab/elevenlabs"

export const runtime = "nodejs"

export async function POST(request: Request) {
  try {
    const key = getElevenLabsApiKey()
    if (!key) {
      return NextResponse.json(
        { error: "Text to speech is not configured on the server." },
        { status: 503 }
      )
    }

    const body = (await request.json()) as { text?: string; voiceId?: string }
    const text = body.text?.trim()
    const voiceId = body.voiceId?.trim()
    if (!text || !voiceId) {
      return NextResponse.json(
        { error: "Text and a saved voice are required." },
        { status: 400 }
      )
    }

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(voiceId)}?output_format=mp3_44100_128`,
      {
        method: "POST",
        headers: {
          "xi-api-key": key,
          "Content-Type": "application/json",
          Accept: "audio/mpeg",
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_multilingual_v2",
        }),
        signal: AbortSignal.timeout(90_000),
      }
    )

    if (!response.ok) {
      const payload = (await response.json().catch(() => null)) as {
        detail?: { message?: string }
        message?: string
      } | null
      return NextResponse.json(
        {
          error: elevenLabsError(
            response.status,
            payload,
            `Speech generation failed (${response.status}).`
          ),
        },
        { status: response.status }
      )
    }

    return new NextResponse(await response.arrayBuffer(), {
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "no-store",
      },
    })
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Speech generation failed.",
      },
      { status: 500 }
    )
  }
}
