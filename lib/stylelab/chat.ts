import "server-only"

import { buildChatInstructions } from "@/lib/stylelab/prompts"
import { structuredResponse } from "@/lib/stylelab/openai"
import type { ChatRequest, ChatResponse } from "@/lib/stylelab/types"

const CHAT_SCHEMA = {
  type: "object",
  properties: {
    messages: { type: "array", items: { type: "string" } },
  },
  required: ["messages"],
  additionalProperties: false,
}

const FORBIDDEN_IDENTITY = [
  "as an ai", "language model", "virtual assistant", "i am an ai",
  "я искусственный интеллект", "я языковая модель", "я чат бот",
  "я штучний інтелект", "я мовна модель", "soy una ia",
]

function normalizedWords(text: string) {
  return text.toLowerCase().match(/[\p{L}\p{N}]+/gu) ?? []
}

function needsRepair(input: string, messages: string[]) {
  if (!messages.length || messages.length > 5) return true
  const joined = messages.join(" ").toLowerCase()
  if (messages.some((message) => !message.trim() || message.includes("—"))) return true
  if (FORBIDDEN_IDENTITY.some((phrase) => joined.includes(phrase))) return true
  const source = normalizedWords(input)
  const reply = messages.flatMap(normalizedWords)
  if (source.length >= 4 && source.some((_, index) => {
    const clause = source.slice(index, index + 4)
    return clause.length === 4 && reply.some((__, replyIndex) =>
      clause.every((word, offset) => reply[replyIndex + offset] === word)
    )
  })) return true
  return false
}

function clean(messages: string[]) {
  return [...new Set(messages.map((message) => message.trim().replaceAll("—", "-")).filter(Boolean))].slice(0, 5)
}

export async function generateChatReply(request: ChatRequest): Promise<ChatResponse> {
  const history = (request.history ?? []).slice(-24)
  const context = (request.attachmentContext ?? []).filter(Boolean).slice(0, 5)
  const input = [
    ...history,
    ...(context.length
      ? [{ role: "user" as const, content: `Private attachment context:\n${context.join("\n\n")}` }]
      : []),
    { role: "user" as const, content: request.message },
  ]
  const instructions = buildChatInstructions(request)
  let result = await structuredResponse<ChatResponse>({
    instructions,
    input,
    name: "voice_chat_reply",
    schema: CHAT_SCHEMA,
  })

  if (needsRepair(request.message, result.messages)) {
    result = await structuredResponse<ChatResponse>({
      instructions: `${instructions}\n\n## Required correction\nThe previous draft failed local validation. Write a fresh reply without echoing the incoming message, em dashes, assistant language, invented personal facts, or more than five bubbles.`,
      input,
      name: "voice_chat_reply_repair",
      schema: CHAT_SCHEMA,
    })
  }

  const messages = clean(result.messages)
  if (!messages.length) throw new Error("The model returned no usable chat messages.")
  return { messages }
}
