import { NextResponse } from "next/server"

import { rewriteInVoice } from "@/lib/stylelab/rewrite"
import type { RewriteRequest } from "@/lib/stylelab/types"

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RewriteRequest
    if (!body.text?.trim() || !body.profile?.name || !body.kind) {
      return NextResponse.json(
        { error: "Text, output format, and voice profile are required." },
        { status: 400 }
      )
    }
    return NextResponse.json(await rewriteInVoice(body))
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Voice rewrite failed."
    return NextResponse.json(
      { error: message },
      { status: message.includes("OPENAI_API_KEY") ? 503 : 500 }
    )
  }
}
