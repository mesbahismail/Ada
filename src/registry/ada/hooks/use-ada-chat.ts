"use client"

import * as React from "react"
import { modeRoutes } from "@/registry/ada/lib/ada-data"
import { createConversation, setConversationPending, updateMessages, useConversations } from "@/registry/ada/hooks/use-conversations"

import type {
  AdaMode,
  ArtScene,
  AssistantMessage,
  Message,
  Conversation,
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
  conversation?: Conversation
  voice?: string
}

function useAdaChat({ mode, conversation: initialConversation, voice }: UseAdaChatOptions) {
  const { items, pending: pendingById } = useConversations()
  const [conversationId, setConversationId] = React.useState(initialConversation?.id)
  const conversation = items.find((item) => item.id === conversationId)
  const messages = conversation?.messages ?? []
  const pending = conversationId ? pendingById[conversationId] ?? null : null

  function respond(id: string, prompt: string) {
    setConversationPending(id, pendingLabels[mode])
    // Replies update the saved conversation even if the user opens another chat.
    window.setTimeout(() => {
      updateMessages(id, (previous) => [...previous, createReply(mode, prompt, voice)])
      setConversationPending(id)
    }, mode === "search" || mode === "chat" ? 1200 : 2200)
  }

  function append(message: Message, prompt: string) {
    if (pending) return
    let id = conversationId
    if (!id || !conversation) {
      const created = createConversation(mode, message)
      id = created.id
      setConversationId(id)
      window.history.replaceState(null, "", `${modeRoutes[mode]}/${id}`)
    } else {
      updateMessages(id, (previous) => [...previous, message])
    }
    respond(id, prompt)
  }

  function send(prompt: string) {
    const content = prompt.trim()
    if (!content) return
    append({ id: createId(), role: "user", kind: "text", label: userLabels[mode], content }, content)
  }

  function sendAudio(seconds: number) {
    append({ id: createId(), role: "user", kind: "audio", duration: seconds }, "Voice note")
  }

  function regenerate(messageId: string) {
    if (!conversationId || pending) return
    const index = messages.findIndex((message) => message.id === messageId)
    if (index < 0 || messages[index].role !== "assistant") return
    const previous = messages.slice(0, index).reverse().find((message) => message.role === "user")
    const prompt = previous?.kind === "text" ? previous.content : "Voice note"
    updateMessages(conversationId, (previous) => previous.slice(0, index))
    respond(conversationId, prompt)
  }

  function startNew() {
    const created = createConversation(mode)
    setConversationId(created.id)
    return created
  }

  return { messages, pending, send, sendAudio, regenerate, conversation, startNew,
    reset: () => setConversationId(undefined) }
}

export { useAdaChat }
