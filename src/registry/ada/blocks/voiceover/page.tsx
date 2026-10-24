import type { Metadata } from "next"

import { AiWorkspace } from "@/registry/ada/components/ada/ai-workspace"

export const metadata: Metadata = {
  title: "Voiceover",
}

export default function VoiceoverPage() {
  return <AiWorkspace mode="voiceover" />
}
