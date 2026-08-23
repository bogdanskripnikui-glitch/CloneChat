import { NextResponse } from "next/server"

import { generateChatReply } from "@/lib/stylelab/chat"
import type { ChatRequest } from "@/lib/stylelab/types"

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ChatRequest
    if (!body.message?.trim() || !body.profile?.name) {
      return NextResponse.json({ error: "Message and voice profile are required." }, { status: 400 })
    }
    return NextResponse.json(await generateChatReply(body))
  } catch (error) {
    const message = error instanceof Error ? error.message : "Chat generation failed."
    return NextResponse.json({ error: message }, { status: message.includes("OPENAI_API_KEY") ? 503 : 500 })
  }
}
