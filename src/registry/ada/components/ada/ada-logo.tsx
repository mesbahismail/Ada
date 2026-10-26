import * as React from "react"
import { cn } from "@/lib/utils"

function AdaBird({ className, branded = false, ...props }: React.ComponentProps<"svg"> & { branded?: boolean }) {
  return (
    <svg
      viewBox="0 0 320 320"
      fill="none"
      aria-hidden="true"
      className={cn("size-4", className)}
      {...props}
    >
      <path
        className="motion-safe:group-hover/ada-orb:animate-[ada-wing-back_600ms_ease-in-out_1]"
        style={{ transformOrigin: "180px 175px" }}
        d="M128.63 179.414C169.837 95.3291 152.072 73.9865 153.844 34.5639C171.098 52.2502 226.778 144.14 220.072 192.16C211.902 250.665 47.1157 289.593 46.0607 289.842C46.0594 289.844 46.0588 289.844 46.0588 289.844L46.0556 289.843C46.0556 289.843 46.0573 289.843 46.0607 289.842C46.4676 289.372 111.689 213.983 128.63 179.414Z"
        fill={branded ? "#9A29E0" : "currentColor"}
        fillOpacity={branded ? 1 : 0.64}
      />
      <path
        className="motion-safe:group-hover/ada-orb:animate-[ada-wing-front_600ms_ease-in-out_1]"
        style={{ transformOrigin: "154px 178px" }}
        d="M154.64 129.304C110.098 114.956 54.7343 81.7689 23.9023 41.8789C40.6639 108.532 62.4892 189.651 142.526 227.634C207.329 258.387 228.28 176.296 250.187 149.945C267.712 128.864 285.97 117.325 297.399 122.591C293.377 115.264 272.104 99.6436 255.967 99.6583C234.573 99.6778 225.697 113.224 220.206 118.178C213.97 124.113 194.096 142.013 154.64 129.304Z"
        fill={branded ? "#EE28F2" : "currentColor"}
      />
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
      <AdaBird className="size-[72%]" />
    </span>
  )
}

/** Mark + wordmark, used in the sidebar and auth screens. */
function AdaLogo({ className, standalone = false, ...props }: React.ComponentProps<"span"> & { standalone?: boolean }) {
  return (
    <span
      data-slot="ada-logo"
      className={cn("inline-flex items-center gap-2", className)}
      {...props}
    >
      {standalone ? <AdaBird branded className="size-8" /> : <AdaMark />}
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
      className={cn("group/ada-orb relative size-20 motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-out motion-safe:hover:scale-110", className)}
      {...props}
    >
      <div className="absolute -inset-6 rounded-full bg-primary/30 blur-2xl motion-safe:animate-pulse" />
      <div className="relative flex size-full items-center justify-center rounded-full bg-orb text-white shadow-glow">
        <AdaBird className="relative size-[68%] drop-shadow-[0_2px_6px_rgba(0,0,0,0.25)]" />
      </div>
    </div>
  )
}

export { AdaBird, AdaMark, AdaLogo, AdaOrb }
