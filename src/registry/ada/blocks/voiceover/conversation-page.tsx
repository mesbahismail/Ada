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
  return conversationParams("voiceover")
}

export default function VoiceoverConversationPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  return <ConversationPage mode="voiceover" params={params} />
}
