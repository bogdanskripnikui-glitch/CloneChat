"use client"

import { useSyncExternalStore } from "react"

export type SavedVoiceClone = {
  id: string
  name: string
}

const STORAGE_KEY = "voxform.voice-clone"
const UPDATE_EVENT = "voxform:voice-clone-updated"

export function readSavedVoiceClone(): SavedVoiceClone | null {
  if (typeof window === "undefined") return null

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (!stored) return null
    const voice = JSON.parse(stored) as Partial<SavedVoiceClone>
    return typeof voice.id === "string" && typeof voice.name === "string"
      ? { id: voice.id, name: voice.name }
      : null
  } catch {
    return null
  }
}

export function saveVoiceClone(voice: SavedVoiceClone) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(voice))
  window.dispatchEvent(new CustomEvent(UPDATE_EVENT))
}

export function useSavedVoiceClone() {
  const stored = useSyncExternalStore(
    (onStoreChange) => {
      window.addEventListener(UPDATE_EVENT, onStoreChange)
      window.addEventListener("storage", onStoreChange)
      return () => {
        window.removeEventListener(UPDATE_EVENT, onStoreChange)
        window.removeEventListener("storage", onStoreChange)
      }
    },
    () => window.localStorage.getItem(STORAGE_KEY),
    () => null
  )

  if (!stored) return null
  try {
    const voice = JSON.parse(stored) as Partial<SavedVoiceClone>
    return typeof voice.id === "string" && typeof voice.name === "string"
      ? { id: voice.id, name: voice.name }
      : null
  } catch {
    return null
  }
}
