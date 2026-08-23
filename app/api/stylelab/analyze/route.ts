import { NextResponse } from "next/server"

import { analyzeWriting } from "@/lib/stylelab/analyze"

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { samples?: string[] }
    const samples = body.samples?.filter((sample) => typeof sample === "string") ?? []
    return NextResponse.json(await analyzeWriting(samples))
  } catch (error) {
    const message = error instanceof Error ? error.message : "Voice analysis failed."
    return NextResponse.json({ error: message }, { status: message.includes("OPENAI_API_KEY") ? 503 : 500 })
  }
}
