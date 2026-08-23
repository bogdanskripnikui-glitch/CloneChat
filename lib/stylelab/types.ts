export type ConversationMessage = {
  role: "assistant" | "user"
  content: string
}

export type VoiceExample = {
  role: "person_a" | "person_b"
  content: string
}

export type VoiceProfile = {
  id: string
  name: string
  summary: string
  style?: {
    rhythm: string
    tone: string
    directness: string
    formatting: string
  }
  lexicon?: string[]
  metrics?: Record<string, number>
  examples?: VoiceExample[]
}

export type VoiceAnalysis = Omit<VoiceProfile, "id" | "name">

export type ChatRequest = {
  message: string
  language?: string
  profile: VoiceProfile
  history?: ConversationMessage[]
  attachmentContext?: string[]
}

export type ChatResponse = {
  messages: string[]
}
