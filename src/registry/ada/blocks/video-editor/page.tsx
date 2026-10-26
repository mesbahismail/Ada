import type { Metadata } from "next"
import { VideoEditor } from "@/registry/ada/components/ada/video-editor"

export const metadata: Metadata = { title: "Edit video" }

export default async function VideoEditorPage({ searchParams }: {
  searchParams: Promise<{ conversation?: string | string[]; message?: string | string[] }>
}) {
  const query = await searchParams
  const conversationId = typeof query.conversation === "string" ? query.conversation : "panda-video"
  const messageId = typeof query.message === "string" ? query.message : undefined
  return <VideoEditor key={`${conversationId}-${messageId}`} conversationId={conversationId} messageId={messageId} />
}
