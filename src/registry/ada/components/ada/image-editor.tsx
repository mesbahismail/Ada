"use client"

import * as React from "react"
import Link from "next/link"
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  CheckIcon,
  DownloadIcon,
  RotateCcwIcon,
  ScanSearchIcon,
  SlidersHorizontalIcon,
  WandSparklesIcon,
} from "lucide-react"
import { toast } from "sonner"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { SidebarAutoCollapse } from "@/registry/ada/components/ada/app-sidebar"
import { GeneratedArt } from "@/registry/ada/components/ada/generated-art"
import { PromptInput } from "@/registry/ada/components/ada/prompt-input"
import type { ArtScene } from "@/registry/ada/lib/ada-data"

const ratios = [
  { value: "1/1", w: 14, h: 14 },
  { value: "3/4", w: 11, h: 14 },
  { value: "4/3", w: 14, h: 11 },
  { value: "9/16", w: 9, h: 15 },
  { value: "16/9", w: 16, h: 9 },
]

function Section({
  title,
  children,
  defaultOpen = true,
}: {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
}) {
  return (
    <Collapsible defaultOpen={defaultOpen} className="border-b px-4 py-3 last:border-b-0">
      <CollapsibleTrigger className="group/section flex w-full items-center justify-between rounded-sm text-xs font-medium tracking-wide text-muted-foreground uppercase outline-none focus-visible:ring-2 focus-visible:ring-ring">
        {title}
        <ChevronDownIcon className="size-3.5 transition-transform group-data-[state=open]/section:rotate-180" />
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-3 pt-3">{children}</CollapsibleContent>
    </Collapsible>
  )
}

function Segmented({
  value,
  onValueChange,
  options,
  label,
}: {
  value: string
  onValueChange: (value: string) => void
  options: string[]
  label: string
}) {
  return (
    <ToggleGroup
      type="single"
      size="sm"
      spacing={0}
      aria-label={label}
      value={value}
      onValueChange={(next) => next && onValueChange(next)}
      className="w-full rounded-lg border bg-muted/50 p-0.5"
    >
      {options.map((option) => (
        <ToggleGroupItem
          key={option}
          value={option}
          className="flex-1 rounded-md! px-1.5 text-xs data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
        >
          {option}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}

function SliderField({
  label,
  value,
  onValueChange,
  min,
  max,
  step = 1,
  format = (v: number) => String(v),
}: {
  label: string
  value: number
  onValueChange: (value: number) => void
  min: number
  max: number
  step?: number
  format?: (value: number) => string
}) {
  const id = React.useId()
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor={id} className="text-xs font-normal">
          {label}
        </Label>
        <Badge variant="outline" className="font-mono tabular-nums">
          {format(value)}
        </Badge>
      </div>
      <Slider
        id={id}
        value={[value]}
        min={min}
        max={max}
        step={step}
        onValueChange={([next]) => onValueChange(next)}
      />
    </div>
  )
}

type Tool = "upscale" | "adjust" | "edit"

/** Full-screen editor for a generated image. */
function ImageEditor({ scene = "bloom" }: { scene?: ArtScene }) {
  const [tool, setTool] = React.useState<Tool>("adjust")
  const [zoom, setZoom] = React.useState("100")
  const [ratio, setRatio] = React.useState("1/1")
  const [sampler, setSampler] = React.useState("DDIM")
  const [masked, setMasked] = React.useState("Noise")
  const [maskMode, setMaskMode] = React.useState("Inpaint masked")
  const [cfg, setCfg] = React.useState(7)
  const [denoise, setDenoise] = React.useState(0.6)
  const [steps, setSteps] = React.useState(32)
  const [scale, setScale] = React.useState("2x")
  const [filters, setFilters] = React.useState({ brightness: 100, contrast: 100, saturate: 100 })
  const [version, setVersion] = React.useState(0)
  const [busy, setBusy] = React.useState(false)

  function run(label: string) {
    setBusy(true)
    window.setTimeout(() => {
      setBusy(false)
      setVersion((v) => v + 1)
      toast.success(label)
    }, 1600)
  }

  return (
    <div className="flex h-svh min-h-0 flex-col">
      <SidebarAutoCollapse />
      <header className="flex h-14 shrink-0 items-center gap-2 border-b border-border/60 px-3 backdrop-blur-xl">
        <SidebarTrigger className="text-muted-foreground md:hidden" />
        <Button asChild variant="ghost" size="icon-sm" className="rounded-full">
          <Link href="/image/majestic-peacock" aria-label="Back to image">
            <ChevronLeftIcon />
          </Link>
        </Button>
        <h1 className="font-heading text-2xl leading-none">Edit image</h1>
        <div className="mx-auto hidden items-center gap-1 rounded-full border bg-surface p-0.5 backdrop-blur md:flex">
          {(
            [
              { id: "upscale", label: "Upscale", icon: ScanSearchIcon },
              { id: "adjust", label: "Adjust", icon: SlidersHorizontalIcon },
              { id: "edit", label: "Edit", icon: WandSparklesIcon },
            ] as const
          ).map((item) => (
            <Button
              key={item.id}
              size="xs"
              variant={tool === item.id ? "default" : "ghost"}
              className="rounded-full"
              aria-pressed={tool === item.id}
              onClick={() => setTool(item.id)}
            >
              <item.icon /> {item.label}
            </Button>
          ))}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="xs" variant="ghost" className="rounded-full font-mono tabular-nums">
                {zoom}% <ChevronDownIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center">
              <DropdownMenuRadioGroup value={zoom} onValueChange={setZoom}>
                {["50", "75", "100", "125"].map((value) => (
                  <DropdownMenuRadioItem key={value} value={value}>
                    {value}%
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="ml-auto flex items-center gap-1.5 md:ml-0">
          <Button size="sm" className="rounded-full" onClick={() => toast.success("Image saved")}>
            <CheckIcon /> Save
          </Button>
          <Button size="sm" variant="outline" className="hidden rounded-full sm:inline-flex">
            <DownloadIcon /> Download
          </Button>
          <Button asChild size="sm" variant="ghost" className="hidden rounded-full sm:inline-flex">
            <Link href="/image/majestic-peacock">Cancel</Link>
          </Button>
        </div>
      </header>

      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto lg:flex-row lg:overflow-hidden">
        <div className="flex min-h-[420px] flex-1 flex-col bg-[radial-gradient(var(--border)_1px,transparent_1px)] [background-size:18px_18px]">
          <div className="flex flex-1 items-center justify-center overflow-hidden p-6">
            <div
              className="relative w-full max-w-md overflow-hidden rounded-xl shadow-2xl ring-1 ring-white/15 transition-all duration-300"
              style={{
                aspectRatio: ratio,
                transform: `scale(${Number(zoom) / 100})`,
                maxHeight: "60svh",
                filter: `brightness(${filters.brightness}%) contrast(${filters.contrast}%) saturate(${filters.saturate}%)`,
              }}
            >
              <GeneratedArt scene={scene} seed={`editor-${version}`} />
              {busy && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                  <span className="shimmer text-sm font-medium text-white">Processing…</span>
                </div>
              )}
            </div>
          </div>
          <div className="px-4 pb-3">
            <PromptInput
              placeholder="Describe what to change, e.g. add a golden sunset…"
              disabled={busy}
              onSubmit={() => run("Edit applied")}
            />
          </div>
        </div>

        <aside className="w-full shrink-0 border-t bg-surface backdrop-blur-xl lg:w-80 lg:overflow-y-auto lg:border-t-0 lg:border-l">
          <div className="flex gap-1 border-b p-2 md:hidden">
            {(["upscale", "adjust", "edit"] as const).map((item) => (
              <Button
                key={item}
                size="xs"
                variant={tool === item ? "default" : "ghost"}
                className="flex-1 rounded-full capitalize"
                onClick={() => setTool(item)}
              >
                {item}
              </Button>
            ))}
          </div>

          {tool === "adjust" && (
            <>
              <Section title="Aspect ratio">
                <ToggleGroup
                  type="single"
                  spacing={1}
                  value={ratio}
                  onValueChange={(next) => next && setRatio(next)}
                  className="w-full justify-between"
                  aria-label="Aspect ratio"
                >
                  {ratios.map((item) => (
                    <ToggleGroupItem
                      key={item.value}
                      value={item.value}
                      aria-label={item.value.replace("/", ":")}
                      className="h-10 flex-1 flex-col gap-1 border bg-muted/40 data-[state=on]:border-primary data-[state=on]:bg-primary/15"
                    >
                      <span
                        className="rounded-[2px] border-[1.5px] border-current"
                        style={{ width: item.w, height: item.h }}
                      />
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              </Section>
              <Section title="Sampling method">
                <Segmented
                  label="Sampling method"
                  value={sampler}
                  onValueChange={setSampler}
                  options={["Euler", "LMS", "Heun", "DDIM", "DPM"]}
                />
              </Section>
              <Section title="Masked content">
                <Segmented
                  label="Masked content"
                  value={masked}
                  onValueChange={setMasked}
                  options={["Fill", "Original", "Noise", "Nothing"]}
                />
              </Section>
              <Section title="Masking mode">
                <Segmented
                  label="Masking mode"
                  value={maskMode}
                  onValueChange={setMaskMode}
                  options={["Inpaint masked", "Inpaint not masked"]}
                />
              </Section>
              <Section title="Advanced">
                <SliderField label="CFG scale" value={cfg} onValueChange={setCfg} min={1} max={30} />
                <SliderField
                  label="Denoising strength"
                  value={denoise}
                  onValueChange={setDenoise}
                  min={0}
                  max={1}
                  step={0.05}
                  format={(v) => v.toFixed(2)}
                />
                <SliderField label="Sampling steps" value={steps} onValueChange={setSteps} min={1} max={150} />
                <Button className="w-full rounded-full" disabled={busy} onClick={() => run("New variation generated")}>
                  <WandSparklesIcon /> Regenerate
                </Button>
              </Section>
            </>
          )}

          {tool === "upscale" && (
            <>
              <Section title="Scale">
                <Segmented label="Scale" value={scale} onValueChange={setScale} options={["2x", "4x", "8x"]} />
                <p className="text-xs text-muted-foreground">
                  Output: {Number(scale.replace("x", "")) * 1024} × {Number(scale.replace("x", "")) * 1024}px
                </p>
              </Section>
              <Section title="Enhance">
                <div className="flex items-center justify-between">
                  <Label htmlFor="face" className="text-xs font-normal">Face restoration</Label>
                  <Switch id="face" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="sharpen" className="text-xs font-normal">Sharpen details</Label>
                  <Switch id="sharpen" />
                </div>
                <Button className="w-full rounded-full" disabled={busy} onClick={() => run(`Upscaled ${scale}`)}>
                  <ScanSearchIcon /> Upscale {scale}
                </Button>
              </Section>
            </>
          )}

          {tool === "edit" && (
            <Section title="Color">
              <SliderField
                label="Brightness"
                value={filters.brightness}
                onValueChange={(brightness) => setFilters((f) => ({ ...f, brightness }))}
                min={50}
                max={150}
                format={(v) => `${v}%`}
              />
              <SliderField
                label="Contrast"
                value={filters.contrast}
                onValueChange={(contrast) => setFilters((f) => ({ ...f, contrast }))}
                min={50}
                max={150}
                format={(v) => `${v}%`}
              />
              <SliderField
                label="Saturation"
                value={filters.saturate}
                onValueChange={(saturate) => setFilters((f) => ({ ...f, saturate }))}
                min={0}
                max={200}
                format={(v) => `${v}%`}
              />
              <Button
                variant="outline"
                className={cn("w-full rounded-full")}
                onClick={() => setFilters({ brightness: 100, contrast: 100, saturate: 100 })}
              >
                <RotateCcwIcon /> Reset
              </Button>
            </Section>
          )}
        </aside>
      </div>
    </div>
  )
}

export { ImageEditor }
