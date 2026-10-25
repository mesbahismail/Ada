import type { Metadata } from "next"

import { SidebarAutoCollapse } from "@/registry/ada/components/ada/app-sidebar"
import { PageHeader } from "@/registry/ada/components/ada/page-header"
import { SettingsPanels } from "@/registry/ada/components/ada/settings-panels"

export const metadata: Metadata = {
  title: "Settings",
}

export default function SettingsPage() {
  return (
    <div className="flex h-svh min-h-0 flex-col">
      <SidebarAutoCollapse />
      <PageHeader title="Settings" />
      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-4xl px-4 py-6">
          <SettingsPanels />
        </div>
      </div>
    </div>
  )
}
