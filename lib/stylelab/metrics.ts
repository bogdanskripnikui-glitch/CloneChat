const WORD_RE = /[\p{L}\p{N}'’]+/gu
const EMOJI_RE = /\p{Extended_Pictographic}/u

export function detectLanguage(text: string) {
  if (/[іїєґ]/i.test(text)) return "uk"
  if (/[а-яё]/i.test(text)) return "ru"
  if (/[áéíóúüñ¿¡]/i.test(text)) return "es"
  return "en"
}

export function localStyleMetrics(samples: string[]) {
  const messages = samples.map((sample) => sample.trim()).filter(Boolean)
  const joined = messages.join("\n")
  const words = joined.match(WORD_RE) ?? []
  const sentences = joined
    .split(/[.!?]+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean)
  const denominator = Math.max(messages.length, 1)

  return {
    message_count: messages.length,
    word_count: words.length,
    average_words_per_message: words.length / denominator,
    average_words_per_sentence:
      words.length / Math.max(sentences.length, 1),
    short_message_ratio:
      messages.filter((message) => (message.match(WORD_RE) ?? []).length <= 8)
        .length / denominator,
    question_message_ratio:
      messages.filter((message) => message.includes("?")).length / denominator,
    multi_line_message_ratio:
      messages.filter((message) => message.includes("\n")).length / denominator,
    emoji_message_ratio:
      messages.filter((message) => EMOJI_RE.test(message)).length / denominator,
    lowercase_start_ratio:
      messages.filter((message) => /^\p{Ll}/u.test(message)).length / denominator,
  }
}
