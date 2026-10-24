"use client"

import * as React from "react"

import type {
  AdaMode,
  ArtScene,
  AssistantMessage,
  Message,
} from "@/registry/ada/lib/ada-data"

const scenes: ArtScene[] = ["sunset", "mountains", "city", "bloom", "forest", "aurora", "ocean", "neon"]

const pendingLabels: Record<AdaMode, string> = {
  search: "Searching the web…",
  chat: "Thinking…",
  voiceover: "Generating voiceover…",
  image: "Generating images…",
  video: "Rendering video…",
}

const userLabels = {
  search: "Question",
  chat: "Message",
  voiceover: "Script",
  image: "Message",
  video: "Script",
} as const

function createId() {
  return Math.random().toString(36).slice(2, 10)
}

function hash(value: string) {
  let result = 0
  for (let i = 0; i < value.length; i++) result = (result * 31 + value.charCodeAt(i)) >>> 0
  return result
}

/**
 * Mock replies so the template feels alive.
 * Replace this with a call to your model (e.g. the AI SDK's `useChat`).
 */
function createReply(mode: AdaMode, prompt: string, voice?: string): AssistantMessage {
  const id = createId()
  const seed = hash(prompt)

  switch (mode) {
    case "voiceover":
      return {
        id,
        role: "assistant",
        kind: "voiceover",
        voice: voice ?? "Anastasia",
        duration: Math.min(90, Math.max(6, Math.round(prompt.split(/\s+/).length / 2.4))),
      }
    case "image":
      return {
        id,
        role: "assistant",
        kind: "images",
        content: "Here are four takes on your idea. Open one in the editor to refine it.",
        images: [0, 1, 2, 3].map((offset) => scenes[(seed + offset * 3) % scenes.length]),
      }
    case "video":
      return {
        id,
        role: "assistant",
        kind: "video",
        scene: scenes[seed % scenes.length],
        duration: 10 + (seed % 15),
      }
    case "search":
      return {
        id,
        role: "assistant",
        kind: "text",
        content: `Here is a quick overview for "${prompt}".\n\n**Summary**\nAda searched trusted sources and combined the most relevant results into one answer. Connect your search provider to replace this mock response with live data.\n\n**Next steps**\nAsk a follow-up question, or open the sources to dig deeper.`,
      }
    default:
      return {
        id,
        role: "assistant",
        kind: "text",
        content: `Great question! I'm a demo assistant, so this reply is generated locally. Wire the composer to your favourite model and Ada will stream real answers right here.\n\nYou asked: **${prompt}**`,
      }
  }
}

type UseAdaChatOptions = {
  mode: AdaMode
  initialMessages?: Message[]
  voice?: string
}

function useAdaChat({ mode, initialMessages = [], voice }: UseAdaChatOptions) {
  const [messages, setMessages] = React.useState<Message[]>(initialMessages)
  const [pending, setPending] = React.useState<string | null>(null)
  const timers = React.useRef<number[]>([])

  React.useEffect(() => {
    const active = timers.current
    return () => active.forEach((timer) => window.clearTimeout(timer))
  }, [])

  const respond = React.useCallback(
    (prompt: string) => {
      setPending(pendingLabels[mode])
      const delay = mode === "search" || mode === "chat" ? 1200 : 2200
      const timer = window.setTimeout(() => {
        setMessages((prev) => [...prev, createReply(mode, prompt, voice)])
        setPending(null)
      }, delay)
      timers.current.push(timer)
    },
    [mode, voice]
  )

  const send = React.useCallback(
    (prompt: string) => {
      setMessages((prev) => [
        ...prev,
        { id: createId(), role: "user", kind: "text", label: userLabels[mode], content: prompt },
      ])
      respond(prompt)
    },
    [mode, respond]
  )

  const sendAudio = React.useCallback(
    (seconds: number) => {
      setMessages((prev) => [...prev, { id: createId(), role: "user", kind: "audio", duration: seconds }])
      respond("Voice note")
    },
    [respond]
  )

  const regenerate = React.useCallback(
    (messageId: string) => {
      const index = messages.findIndex((message) => message.id === messageId)
      const previous = messages
        .slice(0, index)
        .reverse()
        .find((message) => message.role === "user")
      const prompt = previous && previous.kind === "text" ? previous.content : "Voice note"
      setMessages((prev) => prev.filter((message) => message.id !== messageId))
      respond(prompt)
    },
    [messages, respond]
  )

  return { messages, pending, send, sendAudio, regenerate }
}

export { useAdaChat }
