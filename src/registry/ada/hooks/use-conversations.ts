"use client"

import { useSyncExternalStore } from "react"
import { toast } from "sonner"
import { conversations as examples, type AdaMode, type Conversation, type Message } from "@/registry/ada/lib/ada-data"

const storageKey = "ada-conversations-v1"
type HistoryState = { items: Conversation[]; ready: boolean; pending: Record<string, string> }
const serverState: HistoryState = { items: examples, ready: false, pending: {} }
let state = serverState
const listeners = new Set<() => void>()

function emit() {
  listeners.forEach((listener) => listener())
}

function isConversation(value: unknown): value is Conversation {
  if (!value || typeof value !== "object") return false
  const item = value as Conversation
  return typeof item.id === "string" && typeof item.title === "string" &&
    ["search", "chat", "voiceover", "image", "video"].includes(item.mode) &&
    typeof item.date === "string" && Array.isArray(item.messages) && item.messages.every((message) =>
      message && typeof message.id === "string" && ["user", "assistant"].includes(message.role) &&
      ["text", "audio", "voiceover", "images", "video"].includes(message.kind))
}

function readItems() {
  const saved = localStorage.getItem(storageKey)
  if (!saved) return examples
  const parsed: unknown = JSON.parse(saved)
  if (!Array.isArray(parsed) || !parsed.every(isConversation)) throw new Error("Invalid conversation history")
  return parsed as Conversation[]
}

function initialize() {
  if (state.ready || typeof window === "undefined") return
  try {
    state = { ...state, items: readItems(), ready: true }
  } catch {
    state = { ...state, ready: true }
    toast.error("Saved history could not be loaded. Changes will stay in this session.")
  }
}

function subscribe(listener: () => void) {
  initialize()
  listeners.add(listener)
  const onStorage = (event: StorageEvent) => {
    if (event.key !== storageKey && event.key !== null) return
    try {
      state = { ...state, items: readItems() }
      emit()
    } catch { /* Keep the current session if another tab has invalid data. */ }
  }
  window.addEventListener("storage", onStorage)
  return () => {
    listeners.delete(listener)
    window.removeEventListener("storage", onStorage)
  }
}

function commit(items: Conversation[]) {
  initialize()
  state = { ...state, items }
  try {
    localStorage.setItem(storageKey, JSON.stringify(items))
  } catch {
    toast.error("History could not be saved on this device. Keep this tab open to retain your chats.")
  }
  emit()
}

export function useConversations() {
  return useSyncExternalStore(subscribe, () => state, () => serverState)
}

export function createConversation(mode: AdaMode, message?: Message) {
  initialize()
  const content = message
    ? message.kind === "text" ? message.content : "Voice conversation"
    : `New ${mode === "search" ? "chat" : mode}`
  const item: Conversation = {
    id: crypto.randomUUID(), mode, title: content.replace(/\s+/g, " ").slice(0, 70),
    date: "Today", updatedAt: new Date().toISOString(), messages: message ? [message] : [],
  }
  commit([item, ...state.items])
  return item
}

export function updateMessages(id: string, update: (messages: Message[]) => Message[]) {
  initialize()
  const item = state.items.find((item) => item.id === id)
  if (!item) return
  const messages = update(item.messages)
  const first = messages.find((message) => message.role === "user")
  const title = item.messages.length === 0 && first
    ? (first.kind === "text" ? first.content.replace(/\s+/g, " ").slice(0, 70) : "Voice conversation")
    : item.title
  commit([{ ...item, title, messages, date: "Today", updatedAt: new Date().toISOString() },
    ...state.items.filter((item) => item.id !== id)])
}

export function setConversationPending(id: string, label?: string) {
  state = { ...state, pending: { ...state.pending } }
  if (label) state.pending[id] = label
  else delete state.pending[id]
  emit()
}

export function deleteConversation(id: string) {
  commit(state.items.filter((item) => item.id !== id))
  setConversationPending(id)
}

export function duplicateConversation(id: string) {
  initialize()
  const source = state.items.find((item) => item.id === id)
  if (!source) return
  const copy: Conversation = { ...structuredClone(source), id: crypto.randomUUID(),
    title: `${source.title} (copy)`, date: "Today", updatedAt: new Date().toISOString() }
  commit([copy, ...state.items])
  return copy
}

export function exportConversation(item: Conversation) {
  const url = URL.createObjectURL(new Blob([JSON.stringify(item, null, 2)], { type: "application/json" }))
  const link = document.createElement("a")
  link.href = url
  link.download = `${item.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "conversation"}.json`
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 1000)
}
