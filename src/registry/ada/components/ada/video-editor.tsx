"use client"

import * as React from "react"
import Link from "next/link"
import {
  ArrowLeftIcon, ArrowRightIcon, CheckIcon, ChevronLeftIcon, CopyIcon,
  PauseIcon, PlayIcon, PlusIcon, Redo2Icon, SaveIcon, ScissorsIcon,
  SkipBackIcon, SparklesIcon, Trash2Icon, Undo2Icon,
} from "lucide-react"
import { toast } from "sonner"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { SidebarAutoCollapse } from "@/registry/ada/components/ada/app-sidebar"
import { formatTime } from "@/registry/ada/components/ada/audio-player"
import { GeneratedArt } from "@/registry/ada/components/ada/generated-art"
import { PageHeader } from "@/registry/ada/components/ada/page-header"
import { PromptInput } from "@/registry/ada/components/ada/prompt-input"
import { updateMessages, useConversations } from "@/registry/ada/hooks/use-conversations"
import type { AssistantMessage, Conversation, VideoScene } from "@/registry/ada/lib/ada-data"
import { applySceneDirection, createVideoTimeline, sceneAtTime, splitVideoScene, timelineDuration } from "@/registry/ada/lib/video-editing"

type VideoMessage = Extract<AssistantMessage, { kind: "video" }>

function VideoEditorSession({ conversation, video, direction }: {
  conversation: Conversation; video: VideoMessage; direction: string
}) {
  const initial = createVideoTimeline(video, direction)
  const [history, setHistory] = React.useState({ past: [] as VideoScene[][], scenes: initial, future: [] as VideoScene[][] })
  const { scenes } = history
  const [selectedId, setSelectedId] = React.useState(initial[0].id)
  const [elapsed, setElapsed] = React.useState(0)
  const [playing, setPlaying] = React.useState(false)
  const [scope, setScope] = React.useState<"scene" | "all">("scene")
  const [feedback, setFeedback] = React.useState("")
  const duration = timelineDuration(scenes)
  const playhead = Math.min(elapsed, duration)
  const isPlaying = playing && elapsed < duration
  const current = sceneAtTime(scenes, playhead)!
  const selectedIndex = Math.max(0, scenes.findIndex((scene) => scene.id === selectedId))
  const selected = scenes[selectedIndex]
  const selectedStart = timelineDuration(scenes.slice(0, selectedIndex))
  const dirty = JSON.stringify(scenes) !== JSON.stringify(initial)
  const backHref = `/video/${encodeURIComponent(conversation.id)}`

  React.useEffect(() => {
    if (!isPlaying) return
    const timer = window.setInterval(() => setElapsed((value) => Math.min(duration, value + 0.1)), 100)
    return () => window.clearInterval(timer)
  }, [isPlaying, duration])

  function commit(next: VideoScene[]) {
    if (!next.length) return
    setPlaying(false)
    setHistory((previous) => ({ past: [...previous.past, previous.scenes].slice(-30), scenes: next, future: [] }))
    setElapsed((time) => Math.min(time, timelineDuration(next)))
  }

  function select(scene: VideoScene, index: number) {
    setSelectedId(scene.id)
    setElapsed(timelineDuration(scenes.slice(0, index)))
    setPlaying(false)
  }

  function updateSelected(update: Partial<VideoScene>) {
    commit(scenes.map((scene) => scene.id === selected.id ? { ...scene, ...update } : scene))
  }

  function move(offset: number) {
    const target = selectedIndex + offset
    if (target < 0 || target >= scenes.length) return
    const next = [...scenes]
    const moved = next[selectedIndex]
    next[selectedIndex] = next[target]
    next[target] = moved
    commit(next)
    setElapsed(timelineDuration(next.slice(0, target)))
  }

  function undo() {
    if (!history.past.length) return
    setPlaying(false)
    setElapsed(0)
    setHistory(({ past, scenes, future }) => ({ past: past.slice(0, -1), scenes: past[past.length - 1], future: [scenes, ...future] }))
  }

  function redo() {
    if (!history.future.length) return
    setPlaying(false)
    setElapsed(0)
    setHistory(({ past, scenes, future }) => ({ past: [...past, scenes], scenes: future[0], future: future.slice(1) }))
  }

  function applyDirection(prompt: string) {
    commit(scenes.map((scene) => scope === "all" || scene.id === selected.id ? applySceneDirection(scene, prompt) : scene))
    setFeedback(`Updated ${scope === "all" ? "all scene directions" : `the direction for ${selected.title}`}. Save changes to keep this version.`)
  }

  function save() {
    updateMessages(conversation.id, (messages) => messages.map((message) =>
      message.id === video.id && message.kind === "video"
        ? { ...message, scenes, scene: scenes[0].scene, duration }
        : message))
    toast.success("Video timeline saved")
    setFeedback("Your timeline and scene directions are saved.")
  }

  return (
    <div className="flex h-svh min-h-0 flex-col">
      <PageHeader title="Edit video" actions={
        <>
          <Button asChild variant="ghost" size="icon-sm" aria-label="Back to video"><Link href={backHref}><ChevronLeftIcon /></Link></Button>
          <span className="mr-2 hidden items-center gap-1 text-xs text-muted-foreground sm:inline-flex">
            {!dirty && <CheckIcon className="size-3" />}{dirty ? "Unsaved changes" : "Saved"}
          </span>
          <Button size="sm" className="rounded-full" onClick={save} disabled={!dirty}><SaveIcon /> Save changes</Button>
        </>
      } />
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto lg:flex-row lg:overflow-hidden">
        <div className="flex min-w-0 flex-1 flex-col lg:min-h-0">
          <div className="flex items-center justify-between gap-3 px-5 py-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{conversation.title}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{scenes.length} scenes · {duration}s · 16:9</p>
            </div>
            <span className="rounded-full border px-2.5 py-1 text-[10px] tracking-wide text-muted-foreground uppercase">Storyboard preview</span>
          </div>
          <div className="flex min-h-56 flex-1 items-center justify-center px-5 pb-4 lg:min-h-0">
            <div className="relative aspect-video w-full max-w-4xl overflow-hidden rounded-2xl border bg-black shadow-xl lg:max-w-[min(56rem,max(280px,calc((100svh_-_420px)*16/9)))]">
              <GeneratedArt scene={current.scene.scene} seed={`${current.scene.id}-${current.scene.direction}`} className="absolute inset-0 motion-safe:transition-transform motion-safe:duration-100" style={{ transform: `scale(${1 + Math.min(1, (playhead - current.start) / current.scene.duration) * 0.08})` }} />
              <span className="absolute top-3 left-3 rounded-full bg-black/50 px-3 py-1 text-xs text-white backdrop-blur">Scene {current.index + 1} · {current.scene.title}</span>
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-4 pt-8 pb-4">
                <p className="line-clamp-2 text-sm text-white">{current.scene.direction || "Select a scene to describe your changes."}</p>
              </div>
            </div>
          </div>
          <section aria-label="Video timeline" className="shrink-0 border-t bg-surface px-5 pt-3 pb-5">
            <div className="mb-3 flex flex-wrap items-center gap-1">
              <Button variant="ghost" size="icon-sm" aria-label="Restart preview" onClick={() => { setElapsed(0); setPlaying(false) }}><SkipBackIcon /></Button>
              <Button size="icon-sm" className="rounded-full" aria-label={isPlaying ? "Pause preview" : "Play preview"} onClick={() => {
                if (isPlaying) setPlaying(false)
                else { if (elapsed >= duration) setElapsed(0); setPlaying(true) }
              }}>{isPlaying ? <PauseIcon /> : <PlayIcon />}</Button>
              <span className="ml-2 font-mono text-xs text-muted-foreground tabular-nums">{formatTime(playhead)} / {formatTime(duration)}</span>
              <div className="ml-auto flex gap-1">
                <Button variant="ghost" size="icon-sm" aria-label="Undo edit" disabled={!history.past.length} onClick={undo}><Undo2Icon /></Button>
                <Button variant="ghost" size="icon-sm" aria-label="Redo edit" disabled={!history.future.length} onClick={redo}><Redo2Icon /></Button>
                <Button variant="outline" size="sm" className="ml-2 rounded-full" onClick={() => {
                  const next: VideoScene = { id: crypto.randomUUID(), title: `Scene ${scenes.length + 1}`, scene: selected.scene, duration: 4, direction: "" }
                  commit([...scenes, next]); setSelectedId(next.id); setElapsed(duration)
                }}><PlusIcon /> Add scene</Button>
              </div>
            </div>
            <Slider aria-label="Timeline playhead" value={[playhead]} max={duration} step={0.1} onValueChange={([value]) => { setElapsed(value); setPlaying(false) }} />
            <div className="my-2 flex justify-between font-mono text-[10px] text-muted-foreground">
              {[0, 0.25, 0.5, 0.75, 1].map((part) => <span key={part}>{formatTime(duration * part)}</span>)}
            </div>
            <div className="overflow-x-auto pb-1">
              <div className="relative flex gap-2" style={{ minWidth: Math.max(300, scenes.length * 120) }}>
                {scenes.map((scene, index) => (
                  <button key={scene.id} type="button" aria-pressed={scene.id === selected.id} aria-label={`Select scene ${index + 1}: ${scene.title}`} onClick={() => select(scene, index)}
                    className={cn("relative h-24 min-w-24 overflow-hidden rounded-xl border-2 text-left outline-none focus-visible:ring-2 focus-visible:ring-ring", scene.id === selected.id ? "border-primary" : "border-transparent opacity-70 hover:opacity-100")}
                    style={{ flexGrow: scene.duration, flexBasis: 80 }}>
                    <GeneratedArt scene={scene.scene} seed={`${scene.id}-${scene.direction}`} className="absolute inset-0" />
                    <span className="absolute top-1 left-1 rounded bg-black/60 px-1.5 text-[10px] text-white">{String(index + 1).padStart(2, "0")}</span>
                    <span className="absolute inset-x-0 bottom-0 bg-black/60 px-2 py-1.5 text-white"><span className="block truncate text-xs">{scene.title}</span><span className="text-[10px] text-white/70">{scene.duration}s</span></span>
                  </button>
                ))}
                <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 z-10 w-0.5 bg-primary shadow-[0_0_8px_#EE28F2]" style={{ left: `${Math.min(99.8, (playhead / duration) * 100)}%` }} />
              </div>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-1">
              <Button variant="ghost" size="sm" disabled={selected.duration < 2} onClick={() => commit(splitVideoScene(scenes, selected.id, playhead > selectedStart && playhead < selectedStart + selected.duration ? playhead - selectedStart : selected.duration / 2, crypto.randomUUID()))}><ScissorsIcon /> Split scene</Button>
              <Button variant="ghost" size="icon-sm" aria-label="Move scene earlier" disabled={selectedIndex === 0} onClick={() => move(-1)}><ArrowLeftIcon /></Button>
              <Button variant="ghost" size="icon-sm" aria-label="Move scene later" disabled={selectedIndex === scenes.length - 1} onClick={() => move(1)}><ArrowRightIcon /></Button>
              <Button variant="ghost" size="icon-sm" aria-label="Duplicate scene" onClick={() => {
                const copy = { ...selected, id: crypto.randomUUID(), title: `${selected.title} (copy)` }
                commit([...scenes.slice(0, selectedIndex + 1), copy, ...scenes.slice(selectedIndex + 1)]); setSelectedId(copy.id)
              }}><CopyIcon /></Button>
              <Button variant="ghost" size="icon-sm" aria-label="Delete scene" disabled={scenes.length === 1} onClick={() => commit(scenes.filter((scene) => scene.id !== selected.id))}><Trash2Icon /></Button>
            </div>
          </section>
        </div>
        <aside className="flex w-full shrink-0 flex-col border-t bg-surface lg:w-80 lg:overflow-y-auto lg:border-t-0 lg:border-l xl:w-96">
          <div className="space-y-5 border-b p-5">
            <div><p className="text-[10px] tracking-widest text-muted-foreground uppercase">Scene {selectedIndex + 1}</p><h2 className="mt-1 font-heading text-2xl">Scene details</h2></div>
            <div className="space-y-2"><Label htmlFor="scene-name">Name</Label><Input id="scene-name" value={selected.title} maxLength={80} onChange={(event) => updateSelected({ title: event.target.value })} /></div>
            <div className="space-y-2"><Label htmlFor="scene-duration">Duration (seconds)</Label><Input id="scene-duration" type="number" min={1} max={60} step={0.1} value={selected.duration} onChange={(event) => {
              const value = Number(event.target.value)
              if (Number.isFinite(value) && value >= 1 && value <= 60) updateSelected({ duration: Math.round(value * 10) / 10 })
            }} /></div>
            {selected.direction && <p className="text-xs leading-relaxed text-muted-foreground">{selected.direction}</p>}
          </div>
          <div className="flex flex-1 flex-col gap-4 p-5">
            <div><h2 className="flex items-center gap-2 font-heading text-2xl"><SparklesIcon className="size-4 text-primary" /> Edit with AI</h2><p className="mt-2 text-xs leading-relaxed text-muted-foreground">Describe a new look, setting or duration for your scenes.</p></div>
            <div className="flex gap-2" role="group" aria-label="Apply changes to">
              <Button size="sm" variant={scope === "scene" ? "default" : "outline"} className="rounded-full" aria-pressed={scope === "scene"} onClick={() => setScope("scene")}>Selected scene</Button>
              <Button size="sm" variant={scope === "all" ? "default" : "outline"} className="rounded-full" aria-pressed={scope === "all"} onClick={() => setScope("all")}>All scenes</Button>
            </div>
            <div className="space-y-2">
              {["Make it golden hour", "Set the duration to 6 seconds", "Change the setting to a neon city"].map((prompt) => <button key={prompt} type="button" className="block w-full rounded-xl border px-3 py-2.5 text-left text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground" onClick={() => applyDirection(prompt)}>{prompt}</button>)}
            </div>
            {feedback && <p role="status" className="rounded-xl border border-primary/20 bg-primary/5 p-3 text-xs leading-relaxed">{feedback}</p>}
            <div className="mt-auto pt-4"><PromptInput className="[&_[data-align=inline-start]]:hidden" placeholder="Describe your changes…" onSubmit={applyDirection} disclaimer={false} /><p className="mt-3 text-[10px] leading-relaxed text-muted-foreground">Demo artwork previews your scene directions. This editor does not render a video file.</p></div>
          </div>
        </aside>
      </div>
    </div>
  )
}

function VideoEditor({ conversationId, messageId }: { conversationId: string; messageId?: string }) {
  const { items, ready } = useConversations()
  const conversation = items.find((item) => item.id === conversationId && item.mode === "video")
  const video = conversation?.messages.find((message): message is VideoMessage => message.kind === "video" && (!messageId || message.id === messageId))
  if (!ready) return <div role="status" className="p-8 text-sm text-muted-foreground">Loading video editor…</div>
  if (!conversation || !video) return <div className="flex h-svh flex-col items-center justify-center gap-4"><h1 className="font-heading text-3xl">Video not found</h1><Button asChild><Link href="/video">Back to videos</Link></Button></div>
  const index = conversation.messages.findIndex((message) => message.id === video.id)
  const prompt = conversation.messages.slice(0, index).reverse().find((message) => message.role === "user" && message.kind === "text")
  return <><SidebarAutoCollapse /><VideoEditorSession conversation={conversation} video={video} direction={prompt?.kind === "text" ? prompt.content : ""} /></>
}

export { VideoEditor }
