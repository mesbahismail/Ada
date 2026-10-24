import {
  ConversationPage,
  conversationMetadata,
  conversationParams,
} from "@/registry/ada/components/ada/conversation-page"

export function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  return conversationMetadata(params)
}

export function generateStaticParams() {
  return conversationParams("chat")
}

export default function ChatConversationPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  return <ConversationPage mode="chat" params={params} />
}
