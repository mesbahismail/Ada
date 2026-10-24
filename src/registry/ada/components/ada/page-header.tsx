"use client"

import * as React from "react"
import Link from "next/link"
import { HistoryIcon, PlusIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar"
import { ModeToggle } from "@/registry/ada/components/ada/mode-toggle"
import { RecentSheet } from "@/registry/ada/components/ada/recent-sheet"

type PageHeaderProps = Omit<React.ComponentProps<"header">, "title"> & {
  title: React.ReactNode
  /** Shows the "New" button linking to this route. */
  newHref?: string
  showRecent?: boolean
  actions?: React.ReactNode
}

function PageHeader({
  title,
  newHref,
  showRecent = true,
  actions,
  className,
  ...props
}: PageHeaderProps) {
  const { isMobile, state } = useSidebar()

  return (
    <header
      data-slot="page-header"
      className={cn(
        "sticky top-0 z-20 flex h-14 shrink-0 items-center gap-2 border-b border-border/60 px-4 backdrop-blur-xl",
        className
      )}
      {...props}
    >
      {(isMobile || state === "collapsed") && (
        <SidebarTrigger className="-ml-1 text-muted-foreground" />
      )}
      <h1 className="min-w-0 truncate font-heading text-2xl leading-none tracking-tight">
        {title}
      </h1>
      <div className="ml-auto flex shrink-0 items-center gap-1.5">
        {actions}
        {newHref && (
          <Button asChild size="sm" className="rounded-full shadow-[0_0_16px_-2px_oklch(0.6_0.28_320/60%)]">
            <Link href={newHref}>
              <PlusIcon /> New
            </Link>
          </Button>
        )}
        {showRecent && (
          <RecentSheet>
            <Button variant="outline" size="sm" className="rounded-full">
              <HistoryIcon /> <span className="hidden sm:inline">Recent</span>
            </Button>
          </RecentSheet>
        )}
        <ModeToggle />
      </div>
    </header>
  )
}

export { PageHeader }
