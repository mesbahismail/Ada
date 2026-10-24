import type { Metadata } from "next"

import { AiWorkspace } from "@/registry/ada/components/ada/ai-workspace"

export const metadata: Metadata = {
  title: "Search",
}

export default function SearchPage() {
  return <AiWorkspace mode="search" />
}
