import "server-only"

export function getElevenLabsApiKey() {
  const rawKey = process.env.ELEVENLABS_API_KEY?.trim()
  if (!rawKey) return ""

  const normalizedKey = rawKey
    .replace(/^['"]|['"]$/g, "")
    .replace(/:\d+$/, "")
    .trim()

  return normalizedKey.startsWith("sk_") && normalizedKey.length > 51
    ? normalizedKey.slice(0, 51)
    : normalizedKey
}

export function elevenLabsError(
  status: number,
  payload: { detail?: { message?: string }; message?: string } | null,
  fallback: string
) {
  if (status === 401) {
    return "Voice service authorization failed. Reconnect ElevenLabs and try again."
  }

  return payload?.detail?.message || payload?.message || fallback
}
