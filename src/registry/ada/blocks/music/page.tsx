import type { Metadata } from "next"
import { MusicIcon } from "lucide-react"

import { ComingSoon } from "@/registry/ada/components/ada/coming-soon"
import { PageHeader } from "@/registry/ada/components/ada/page-header"

export const metadata: Metadata = {
  title: "Music",
}

export default function MusicPage() {
  return (
    <div className="flex h-svh min-h-0 flex-col">
      <PageHeader title="Music" showRecent={false} />
      <div className="flex flex-1 items-center justify-center p-6">
        <ComingSoon icon={<MusicIcon />} />
      </div>
    </div>
  )
}
