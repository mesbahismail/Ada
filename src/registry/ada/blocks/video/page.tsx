import type { Metadata } from "next"

import { AiWorkspace } from "@/registry/ada/components/ada/ai-workspace"

export const metadata: Metadata = {
  title: "Video",
}

export default function VideoPage() {
  return <AiWorkspace mode="video" />
}
