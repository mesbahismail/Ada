"use client"

import * as React from "react"
import {
  DownloadIcon,
  Maximize2Icon,
  PauseIcon,
  PlayIcon,
  Volume2Icon,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { GeneratedArt } from "@/registry/ada/components/ada/generated-art"
import { formatTime } from "@/registry/ada/components/ada/audio-player"
import type { ArtScene, MediaPrompt } from "@/registry/ada/lib/ada-data"

type MediaPromptCardProps = Omit<React.ComponentProps<"button">, "onSelect"> & {
  item: MediaPrompt
  kind?: "image" | "video"
  onSelect?: (prompt: string) => void
}

function MediaPromptCard({
  item,
  kind = "image",
  onSelect,
  className,
  ...props
}: MediaPromptCardProps) {
  return (
    <button
      type="button"
      data-slot="media-prompt-card"
      onClick={() => onSelect?.(item.prompt)}
      className={cn(
        "group/media relative aspect-[4/3] w-44 shrink-0 snap-start overflow-hidden rounded-xl text-left ring-1 ring-white/10 transition-all outline-none hover:-translate-y-0.5 hover:ring-primary/60 focus-visible:ring-3 focus-visible:ring-ring sm:w-52",
        className
      )}
      {...props}
    >
      <GeneratedArt
        scene={item.scene}
        seed={item.prompt}
        className="absolute inset-0 transition-transform duration-500 group-hover/media:scale-105"
      />
      <span className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      {kind === "video" && (
        <span className="absolute top-1/2 left-1/2 flex size-9 -translate-1/2 items-center justify-center rounded-full bg-white/20 text-white ring-1 ring-white/40 backdrop-blur-md">
          <PlayIcon className="size-3.5 translate-x-px fill-current" />
        </span>
      )}
      <span className="absolute inset-x-0 bottom-0 line-clamp-2 p-2.5 text-xs leading-snug font-medium text-white">
        {item.prompt}
      </span>
    </button>
  )
}

function MediaCarousel({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="media-carousel"
      className={cn(
        "no-scrollbar -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pt-1 pb-2 scroll-fade-x",
        className
      )}
      {...props}
    />
  )
}

type ImageGridProps = React.ComponentProps<"div"> & {
  images: ArtScene[]
  seed?: string
  onOpen?: (index: number) => void
}

function ImageGrid({ images, seed = "", onOpen, className, ...props }: ImageGridProps) {
  return (
    <div
      data-slot="image-grid"
      className={cn("grid grid-cols-2 gap-2", className)}
      {...props}
    >
      {images.map((scene, index) => (
        <div
          key={`${scene}-${index}`}
          className="group/image relative aspect-square overflow-hidden rounded-lg ring-1 ring-white/10"
        >
          <GeneratedArt scene={scene} seed={`${seed}-${index}`} />
          <div className="absolute inset-0 flex items-end justify-end gap-1 bg-gradient-to-t from-black/50 to-transparent p-1.5 opacity-0 transition-opacity group-hover/image:opacity-100 group-focus-within/image:opacity-100">
            <Button
              size="icon-xs"
              variant="secondary"
              className="bg-black/40 text-white backdrop-blur hover:bg-black/60"
              aria-label="Open in editor"
              onClick={() => onOpen?.(index)}
            >
              <Maximize2Icon />
            </Button>
            <Button
              size="icon-xs"
              variant="secondary"
              className="bg-black/40 text-white backdrop-blur hover:bg-black/60"
              aria-label="Download"
            >
              <DownloadIcon />
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}

type VideoPlayerProps = React.ComponentProps<"div"> & {
  scene: ArtScene
  duration: number
  seed?: string
}

/** Video preview with simulated playback. Replace GeneratedArt with a <video>. */
function VideoPlayer({ scene, duration, seed, className, ...props }: VideoPlayerProps) {
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
      data-slot="video-player"
      className={cn(
        "group/video relative aspect-video w-full overflow-hidden rounded-lg bg-black ring-1 ring-white/10",
        className
      )}
      {...props}
    >
      <GeneratedArt
        scene={scene}
        seed={seed}
        className="absolute inset-0 transition-transform duration-[12s] ease-linear"
        style={{ transform: `scale(${1 + (elapsed / duration) * 0.15})` }}
      />
      {!playing && (
        <button
          type="button"
          aria-label="Play video"
          onClick={() => setPlaying(true)}
          className="absolute inset-0 flex items-center justify-center bg-black/10 outline-none"
        >
          <span className="flex size-12 items-center justify-center rounded-full bg-white/20 text-white ring-1 ring-white/40 backdrop-blur-md transition-transform hover:scale-105">
            <PlayIcon className="size-5 translate-x-px fill-current" />
          </span>
        </button>
      )}
      <div className="absolute inset-x-0 bottom-0 flex items-center gap-2.5 bg-gradient-to-t from-black/75 to-transparent px-3 pt-6 pb-2.5 text-white">
        <button
          type="button"
          aria-label={playing ? "Pause" : "Play"}
          onClick={() => setPlaying((value) => !value)}
          className="flex size-7 shrink-0 items-center justify-center rounded-full bg-white text-black outline-none"
        >
          {playing ? (
            <PauseIcon className="size-3 fill-current" />
          ) : (
            <PlayIcon className="size-3 translate-x-px fill-current" />
          )}
        </button>
        <Slider
          aria-label="Seek"
          value={[elapsed]}
          max={duration}
          step={0.1}
          onValueChange={([value]) => setElapsed(value)}
          className="flex-1 [&_[data-slot=slider-range]]:bg-white [&_[data-slot=slider-thumb]]:size-3 [&_[data-slot=slider-track]]:bg-white/30"
        />
        <span className="font-mono text-[11px] tabular-nums text-white/85">
          {formatTime(elapsed)}/{formatTime(duration)}
        </span>
        <Volume2Icon className="size-4 text-white/85" />
      </div>
    </div>
  )
}

export { MediaPromptCard, MediaCarousel, ImageGrid, VideoPlayer }
