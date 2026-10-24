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
  return conversationParams("video")
}

export default function VideoConversationPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  return <ConversationPage mode="video" params={params} />
}
