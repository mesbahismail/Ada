"use client"

import * as React from "react"
import Link from "next/link"
import {
  AudioLinesIcon,
  ClapperboardIcon,
  ImageIcon,
  MessageSquareIcon,
  SearchIcon,
  type LucideIcon,
} from "lucide-react"

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  conversations,
  modeRoutes,
  type AdaMode,
} from "@/registry/ada/lib/ada-data"

const modeIcons: Record<AdaMode, LucideIcon> = {
  search: SearchIcon,
  chat: MessageSquareIcon,
  voiceover: AudioLinesIcon,
  image: ImageIcon,
  video: ClapperboardIcon,
}

function RecentSheet({ children }: { children: React.ReactNode }) {
  const [query, setQuery] = React.useState("")
  const items = conversations.filter((item) =>
    item.title.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="w-full gap-0 border-l-border bg-popover/90 backdrop-blur-2xl sm:max-w-xs">
        <SheetHeader className="gap-3 border-b pb-4">
          <SheetTitle className="font-heading text-2xl font-normal">Recent</SheetTitle>
          <SheetDescription className="sr-only">Your recent conversations</SheetDescription>
          <InputGroup className="h-9 rounded-full">
            <InputGroupAddon>
              <SearchIcon />
            </InputGroupAddon>
            <InputGroupInput
              placeholder="Search history…"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </InputGroup>
        </SheetHeader>
        <nav className="flex-1 space-y-1 overflow-y-auto p-2">
          {items.map((item) => {
            const Icon = modeIcons[item.mode]
            return (
              <SheetClose asChild key={item.id}>
                <Link
                  href={`${modeRoutes[item.mode]}/${item.id}`}
                  className="flex items-center gap-3 rounded-lg p-2 transition-colors outline-none hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border bg-primary/10 text-primary">
                    <Icon className="size-4" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[10px] tracking-wide text-muted-foreground uppercase">
                      {item.date} · {item.mode}
                    </span>
                    <span className="block truncate text-sm">{item.title}</span>
                  </span>
                </Link>
              </SheetClose>
            )
          })}
          {!items.length && (
            <p className="px-2 py-8 text-center text-sm text-muted-foreground">Nothing found.</p>
          )}
        </nav>
      </SheetContent>
    </Sheet>
  )
}

export { RecentSheet }
