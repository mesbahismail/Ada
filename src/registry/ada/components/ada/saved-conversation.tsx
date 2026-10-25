"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AiWorkspace } from "@/registry/ada/components/ada/ai-workspace"
import { useConversations } from "@/registry/ada/hooks/use-conversations"
import { modeRoutes, type AdaMode } from "@/registry/ada/lib/ada-data"

export function SavedConversation({ id, mode }: { id: string; mode: AdaMode }) {
  const { items, ready } = useConversations()
  const conversation = items.find((item) => item.id === id && item.mode === mode)

  if (!ready) return <div role="status" className="p-8 text-sm text-muted-foreground">Loading conversation…</div>
  if (!conversation) {
    return (
      <div className="flex h-svh flex-col items-center justify-center gap-4 px-4 text-center">
        <h1 className="font-heading text-3xl">Conversation not found</h1>
        <p className="text-sm text-muted-foreground">It may have been deleted or saved on another device.</p>
        <Button asChild><Link href={modeRoutes[mode]}>Start a new conversation</Link></Button>
      </div>
    )
  }
  return <AiWorkspace key={id} mode={mode} conversation={conversation} />
}
