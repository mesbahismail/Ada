import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { AiWorkspace } from "@/registry/ada/components/ada/ai-workspace"
import { conversations, getConversation, type AdaMode } from "@/registry/ada/lib/ada-data"

type ConversationPageProps = {
  mode: AdaMode
  params: Promise<{ id: string }>
}

/** Server helper that loads a conversation by id and renders the workspace. */
async function ConversationPage({ mode, params }: ConversationPageProps) {
  const { id } = await params
  const conversation = getConversation(id)

  if (!conversation || conversation.mode !== mode) {
    notFound()
  }

  return <AiWorkspace key={id} mode={mode} conversation={conversation} />
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
