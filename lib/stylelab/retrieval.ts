import type { VoiceExample } from "@/lib/stylelab/types"

const TOKEN_RE = /[\p{L}\p{N}]+/gu
const STOP_WORDS = new Set([
  "the", "and", "that", "this", "with", "from", "have", "what", "your",
  "как", "что", "это", "для", "или", "мне", "тебя", "тебе", "меня",
  "і", "та", "це", "для", "що", "як", "або",
])

function tokens(text: string) {
  return (text.toLowerCase().match(TOKEN_RE) ?? []).filter(
    (token) => token.length > 2 && !STOP_WORDS.has(token)
  )
}

export function selectRelevantExamples(
  examples: VoiceExample[],
  query: string,
  limit = 32
) {
  if (examples.length <= limit) return examples
  const queryTokens = new Set(tokens(query))
  if (!queryTokens.size) return examples.slice(-limit)

  const ranked = examples
    .map((example, index) => ({
      index,
      score: tokens(example.content).reduce(
        (score, token) => score + (queryTokens.has(token) ? 1 : 0),
        0
      ),
    }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || b.index - a.index)

  if (!ranked.length) return examples.slice(-Math.min(6, limit))

  const selected = new Set<number>()
  for (const item of ranked.slice(0, 16)) {
    for (
      let index = Math.max(0, item.index - 1);
      index <= Math.min(examples.length - 1, item.index + 1);
      index += 1
    ) {
      selected.add(index)
      if (selected.size >= Math.max(1, limit - 6)) break
    }
  }
  for (let index = examples.length - 1; index >= 0 && selected.size < limit; index -= 1) {
    selected.add(index)
  }
  return [...selected].sort((a, b) => a - b).map((index) => examples[index])
}
