"use client"

import * as React from "react"
import Link from "next/link"
import { PlusIcon, SlidersHorizontalIcon } from "lucide-react"
import { toast } from "sonner"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

function InstructionsButton() {
  const [open, setOpen] = React.useState(false)
  const [instructions, setInstructions] = React.useState("")

  function changeOpen(next: boolean) {
    if (next) {
      try {
        setInstructions(localStorage.getItem("ada-instructions-v1") ?? "")
      } catch {
        toast.error("Instructions could not be loaded from this browser.")
      }
    }
    setOpen(next)
  }

  function save(event: React.FormEvent) {
    event.preventDefault()
    try {
      localStorage.setItem("ada-instructions-v1", instructions.trim())
      setOpen(false)
      toast.success("Instructions saved")
    } catch {
      toast.error("Instructions could not be saved in this browser.")
    }
  }

  return (
    <Dialog open={open} onOpenChange={changeOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="rounded-full" aria-label="Instructions">
          <SlidersHorizontalIcon /> <span className="hidden sm:inline">Instructions</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <form onSubmit={save} className="space-y-5">
          <DialogHeader>
            <DialogTitle>Instructions</DialogTitle>
            <DialogDescription>Save your response preferences for this browser.</DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="response-instructions">How would you like Ada to respond?</Label>
            <Textarea
              id="response-instructions"
              value={instructions}
              onChange={(event) => setInstructions(event.target.value)}
              placeholder="Keep answers concise, use simple language, and include examples when helpful…"
              className="min-h-40 resize-y"
              maxLength={4000}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit">Save instructions</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

type PageHeaderProps = Omit<React.ComponentProps<"header">, "title"> & {
  title: React.ReactNode
  /** Shows the "New" button linking to this route. */
  newHref?: string
  onNew?: () => void
  newLabel?: string
  actions?: React.ReactNode
}

function PageHeader({
  title,
  newHref,
  onNew,
  newLabel = "New",
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
          onNew ? (
            <Button size="sm" className="rounded-full" onClick={onNew}>
              <PlusIcon /> {newLabel}
            </Button>
          ) : (
            <Button asChild size="sm" className="rounded-full">
              <Link href={newHref}><PlusIcon /> {newLabel}</Link>
            </Button>
          )
        )}
        <InstructionsButton />
      </div>
    </header>
  )
}

export { PageHeader }
