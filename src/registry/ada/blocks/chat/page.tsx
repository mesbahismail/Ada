import type { Metadata } from "next"

import { AiWorkspace } from "@/registry/ada/components/ada/ai-workspace"

export const metadata: Metadata = {
  title: "AI Chat",
}

export default function ChatPage() {
  return <AiWorkspace mode="chat" />
}
