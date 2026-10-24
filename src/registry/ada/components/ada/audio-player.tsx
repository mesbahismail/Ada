"use client"

import * as React from "react"
import { PauseIcon, PlayIcon } from "lucide-react"

import { cn } from "@/lib/utils"

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`
}

function getBars(seed: string, count: number) {
  let value = 0
  for (let i = 0; i < seed.length; i++) value = (value * 31 + seed.charCodeAt(i)) >>> 0
  return Array.from({ length: count }, (_, index) => {
    value = (value * 1664525 + 1013904223) >>> 0
    const noise = value / 4294967296
    const envelope = Math.sin((index / count) * Math.PI) * 0.5 + 0.5
    return Math.max(0.15, Math.min(1, noise * 0.75 * envelope + 0.18))
  })
}

type WaveformProps = React.ComponentProps<"div"> & {
  seed?: string
  bars?: number
  progress?: number
  animated?: boolean
}

/** Static or animated bar waveform. `progress` (0-1) highlights played bars. */
function Waveform({
  seed = "ada",
  bars = 48,
  progress = 0,
  animated = false,
  className,
  ...props
}: WaveformProps) {
  const heights = React.useMemo(() => getBars(seed, bars), [seed, bars])

  return (
    <div
      data-slot="waveform"
      aria-hidden="true"
      className={cn("flex h-8 min-w-0 flex-1 items-center gap-[2px]", className)}
      {...props}
    >
      {heights.map((height, index) => (
        <span
          key={index}
          className={cn(
            "w-[3px] min-w-[2px] flex-1 rounded-full bg-current transition-opacity",
            index / bars < progress ? "opacity-100" : "opacity-35",
            animated && "origin-center motion-safe:animate-wave"
          )}
          style={{
            height: `${height * 100}%`,
            animationDelay: animated ? `${(index % 12) * 80}ms` : undefined,
          }}
        />
      ))}
    </div>
  )
}

type AudioPlayerProps = Omit<React.ComponentProps<"div">, "children"> & {
  duration: number
  seed?: string
  variant?: "default" | "bubble"
  bars?: number
}

/**
 * Compact audio player with simulated playback.
 * Wire `onPlay` / an <audio> element to real output in production.
 */
function AudioPlayer({
  duration,
  seed,
  variant = "default",
  bars = 56,
  className,
  ...props
}: AudioPlayerProps) {
  const [playing, setPlaying] = React.useState(false)
  const [elapsed, setElapsed] = React.useState(0)

  React.useEffect(() => {
    if (!playing) return
    const interval = window.setInterval(() => {
      setElapsed((value) => {
        if (value + 0.1 >= duration) {
          setPlaying(false)
          return 0
        }
        return value + 0.1
      })
    }, 100)
    return () => window.clearInterval(interval)
  }, [playing, duration])

  return (
    <div
      data-slot="audio-player"
      data-variant={variant}
      className={cn("flex w-full items-center gap-3", className)}
      {...props}
    >
      <button
        type="button"
        onClick={() => setPlaying((value) => !value)}
        aria-label={playing ? "Pause" : "Play"}
        className={cn(
          "flex size-8 shrink-0 items-center justify-center rounded-full transition-transform outline-none focus-visible:ring-3 focus-visible:ring-ring/50 active:scale-95",
          variant === "bubble"
            ? "bg-white text-primary"
            : "bg-primary text-primary-foreground shadow-[0_0_14px_oklch(0.6_0.28_320/45%)]"
        )}
      >
        {playing ? (
          <PauseIcon className="size-3.5 fill-current" />
        ) : (
          <PlayIcon className="size-3.5 translate-x-px fill-current" />
        )}
      </button>
      <Waveform
        seed={seed}
        bars={bars}
        progress={elapsed / duration}
        className={variant === "bubble" ? "text-white" : "text-primary"}
      />
      <span
        className={cn(
          "shrink-0 font-mono text-[11px] tabular-nums",
          variant === "bubble" ? "text-white/80" : "text-muted-foreground"
        )}
      >
        {formatTime(elapsed)}/{formatTime(duration)}
      </span>
    </div>
  )
}

export { AudioPlayer, Waveform, formatTime }
