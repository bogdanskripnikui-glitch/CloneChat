import "server-only"

type ResponseInput = { role: "assistant" | "system" | "user"; content: string }

type StructuredRequest = {
  instructions: string
  input: ResponseInput[]
  name: string
  schema: Record<string, unknown>
  maxOutputTokens?: number
}

function responseText(payload: unknown) {
  if (!payload || typeof payload !== "object") return ""
  const value = payload as {
    output_text?: string
    output?: Array<{ content?: Array<{ type?: string; text?: string; refusal?: string }> }>
  }
  if (typeof value.output_text === "string") return value.output_text
  for (const item of value.output ?? []) {
    for (const content of item.content ?? []) {
      if (content.type === "refusal") {
        throw new Error(content.refusal || "The model refused the request.")
      }
      if (content.type === "output_text" && content.text) return content.text
    }
  }
  return ""
}

export async function structuredResponse<T>({
  instructions,
  input,
  name,
  schema,
  maxOutputTokens = 1200,
}: StructuredRequest): Promise<T> {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured on the server.")
  }

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || "gpt-5.6",
      store: false,
      instructions,
      input,
      max_output_tokens: maxOutputTokens,
      text: {
        format: {
          type: "json_schema",
          name,
          strict: true,
          schema,
        },
      },
    }),
    signal: AbortSignal.timeout(60_000),
  })

  const payload = (await response.json().catch(() => null)) as
    | { error?: { message?: string } }
    | null
  if (!response.ok) {
    throw new Error(payload?.error?.message || `OpenAI request failed (${response.status}).`)
  }

  const text = responseText(payload)
  if (!text) throw new Error("The model returned no usable output.")
  return JSON.parse(text) as T
}
