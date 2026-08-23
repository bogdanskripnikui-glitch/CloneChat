import "server-only"

import { localStyleMetrics } from "@/lib/stylelab/metrics"
import { structuredResponse } from "@/lib/stylelab/openai"
import { buildAnalysisInstructions } from "@/lib/stylelab/prompts"
import type { VoiceAnalysis } from "@/lib/stylelab/types"

const ANALYSIS_SCHEMA = {
  type: "object",
  properties: {
    summary: { type: "string" },
    style: {
      type: "object",
      properties: {
        rhythm: { type: "string" },
        tone: { type: "string" },
        directness: { type: "string" },
        formatting: { type: "string" },
      },
      required: ["rhythm", "tone", "directness", "formatting"],
      additionalProperties: false,
    },
    lexicon: { type: "array", items: { type: "string" } },
  },
  required: ["summary", "style", "lexicon"],
  additionalProperties: false,
}

export async function analyzeWriting(samples: string[]): Promise<VoiceAnalysis> {
  const cleanSamples = samples.map((sample) => sample.trim()).filter(Boolean)
  if (!cleanSamples.length) throw new Error("Add a writing sample before analysis.")
  const metrics = localStyleMetrics(cleanSamples)
  const result = await structuredResponse<Omit<VoiceAnalysis, "metrics" | "examples">>({
    instructions: buildAnalysisInstructions(metrics),
    input: [{ role: "user", content: cleanSamples.join("\n\n--- SAMPLE ---\n\n").slice(0, 96_000) }],
    name: "voice_profile_analysis",
    schema: ANALYSIS_SCHEMA,
    maxOutputTokens: 1000,
  })
  return {
    ...result,
    metrics,
    examples: cleanSamples.slice(-32).map((content) => ({ role: "person_a", content })),
  }
}
