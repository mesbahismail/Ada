import type { Metadata } from "next"

import { AiWorkspace } from "@/registry/ada/components/ada/ai-workspace"

export const metadata: Metadata = {
  title: "Image",
}

export default function ImagePage() {
  return <AiWorkspace mode="image" />
}
