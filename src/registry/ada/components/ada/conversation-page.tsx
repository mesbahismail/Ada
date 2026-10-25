import type { Metadata } from "next"

import { SavedConversation } from "@/registry/ada/components/ada/saved-conversation"
import { conversations, getConversation, type AdaMode } from "@/registry/ada/lib/ada-data"

type ConversationPageProps = {
  mode: AdaMode
  params: Promise<{ id: string }>
}

/** Server helper that loads a conversation by id and renders the workspace. */
async function ConversationPage({ mode, params }: ConversationPageProps) {
  const { id } = await params
  return <SavedConversation key={id} mode={mode} id={id} />
}

function conversationParams(mode: AdaMode) {
  return conversations
    .filter((conversation) => conversation.mode === mode)
    .map((conversation) => ({ id: conversation.id }))
}

async function conversationMetadata(params: Promise<{ id: string }>): Promise<Metadata> {
  const { id } = await params
  return { title: getConversation(id)?.title ?? "Conversation" }
}

export { ConversationPage, conversationMetadata, conversationParams }
