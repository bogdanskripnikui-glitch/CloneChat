"use client"

import { useMemo, useSyncExternalStore } from "react"

import type { VoiceProfile } from "@/lib/stylelab/types"

const STORAGE_KEY = "voxform.voice-profile"
const UPDATE_EVENT = "voxform:voice-profile-updated"

function parseProfile(stored: string | null): VoiceProfile | null {
  if (!stored) return null

  try {
    const profile = JSON.parse(stored) as Partial<VoiceProfile>
    return typeof profile.id === "string" &&
      typeof profile.name === "string" &&
      typeof profile.summary === "string"
      ? (profile as VoiceProfile)
      : null
  } catch {
    return null
  }
}

export function readSavedVoiceProfile() {
  if (typeof window === "undefined") return null
  return parseProfile(window.localStorage.getItem(STORAGE_KEY))
}

export function saveVoiceProfile(profile: VoiceProfile) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profile))
  window.dispatchEvent(new CustomEvent(UPDATE_EVENT))
}

export function useSavedVoiceProfile() {
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

  return useMemo(() => parseProfile(stored), [stored])
}
