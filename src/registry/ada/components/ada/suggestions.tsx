"use client"

import * as React from "react"
import { ArrowUpRightIcon, CornerDownRightIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { AdaOrb } from "@/registry/ada/components/ada/ada-logo"
import type { PromptSuggestion } from "@/registry/ada/lib/ada-data"

function WelcomeHero({
  title = "Hi, how can I help you today?",
  description,
  className,
  ...props
}: Omit<React.ComponentProps<"div">, "title"> & {
  title?: React.ReactNode
  description?: React.ReactNode
}) {
  return (
    <div
      data-slot="welcome-hero"
      className={cn("flex flex-col items-center gap-8 text-center animate-in fade-in-0 zoom-in-95 duration-500", className)}
      {...props}
    >
      <AdaOrb />
      <div className="space-y-2">
        <h2 className="font-heading text-3xl tracking-tight text-balance sm:text-4xl">{title}</h2>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
    </div>
  )
}

type PromptSuggestionsProps = Omit<React.ComponentProps<"div">, "onSelect"> & {
  items: PromptSuggestion[]
  onSelect?: (prompt: string) => void
}

function PromptSuggestions({ items, onSelect, className, ...props }: PromptSuggestionsProps) {
  return (
    <div
      data-slot="prompt-suggestions"
      className={cn("grid w-full gap-2 sm:grid-cols-2", className)}
      {...props}
    >
      {items.map((item) => (
        <button
          key={item.title}
          type="button"
          onClick={() => onSelect?.(item.title)}
          className="group/suggestion flex items-center gap-3 rounded-xl border bg-surface p-3 text-left backdrop-blur-md transition-all outline-none hover:border-primary/50 hover:bg-primary/10 focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <span className="min-w-0 flex-1 space-y-0.5">
            <span className="block truncate text-sm font-medium">{item.title}</span>
            <span className="block truncate text-xs text-muted-foreground">{item.description}</span>
          </span>
          <ArrowUpRightIcon aria-hidden="true" className="size-4 shrink-0 text-primary transition-transform group-hover/suggestion:rotate-45" />
        </button>
      ))}
    </div>
  )
}

type SuggestionChipsProps = Omit<React.ComponentProps<"div">, "onSelect"> & {
  items: string[]
  title?: string
  onSelect?: (prompt: string) => void
}

function SuggestionChips({
  items,
  title = "Suggestions",
  onSelect,
  className,
  ...props
}: SuggestionChipsProps) {
  if (!items.length) return null

  return (
    <div data-slot="suggestion-chips" className={cn("space-y-2", className)} {...props}>
      <p className="font-heading text-lg">{title}</p>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <Button
            key={item}
            variant="outline"
            size="sm"
            className="rounded-full bg-surface backdrop-blur hover:border-primary/50 hover:bg-primary/10 dark:bg-surface"
            onClick={() => onSelect?.(item)}
          >
            {item}
            <CornerDownRightIcon aria-hidden="true" className="text-primary" />
          </Button>
        ))}
      </div>
    </div>
  )
}

export { PromptSuggestions, SuggestionChips, WelcomeHero }
