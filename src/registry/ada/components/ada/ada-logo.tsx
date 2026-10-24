import * as React from "react"
import { cn } from "@/lib/utils"

function AdaBird({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={cn("size-4", className)}
      {...props}
    >
      <path d="M20.6 4.4c-1.3.2-2.5.7-3.5 1.4-1.2.8-2.2 1.9-3 3.1L10.2 3c-.4 2.9.1 5.4 1.6 7.4L4 7.8c1.2 3.2 3.6 5.2 7 5.9l-5.6 6.7 4.3-1.6 3.1-3.3c3.2-.2 5.6-2.4 6.3-5.6l.3-2.3 1.9-1.6c-.2-.6-.4-1.2-.7-1.6Z" />
    </svg>
  )
}

/** Round brand mark with the Ada bird. */
function AdaMark({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="ada-mark"
      className={cn(
        "relative inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-orb text-white shadow-[0_0_16px_oklch(0.6_0.28_320/45%)]",
        className
      )}
      {...props}
    >
      <AdaBird className="size-[58%]" />
    </span>
  )
}

/** Mark + wordmark, used in the sidebar and auth screens. */
function AdaLogo({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="ada-logo"
      className={cn("inline-flex items-center gap-2", className)}
      {...props}
    >
      <AdaMark />
      <span className="font-heading text-2xl leading-none tracking-tight">
        Ada
      </span>
    </span>
  )
}

/** Large glowing orb used on welcome screens. */
function AdaOrb({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="ada-orb"
      className={cn("relative size-20", className)}
      {...props}
    >
      <div className="absolute -inset-6 rounded-full bg-primary/30 blur-2xl motion-safe:animate-pulse" />
      <div className="relative flex size-full items-center justify-center rounded-full bg-orb text-white shadow-glow ring-1 ring-white/20">
        <div className="absolute inset-[3px] rounded-full bg-gradient-to-b from-white/25 to-transparent" />
        <AdaBird className="relative size-[48%] drop-shadow-[0_2px_6px_rgba(0,0,0,0.25)]" />
      </div>
    </div>
  )
}

export { AdaBird, AdaMark, AdaLogo, AdaOrb }
