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
  return conversationParams("image")
}

export default function ImageConversationPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  return <ConversationPage mode="image" params={params} />
}
