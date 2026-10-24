"use client"

import * as React from "react"
import {
  AudioLinesIcon,
  ChevronDownIcon,
  PauseIcon,
  PlayIcon,
  PlusIcon,
  SpellCheckIcon,
  UploadIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  voiceCategories,
  voices as allVoices,
  type Voice,
} from "@/registry/ada/lib/ada-data"

function VoiceAvatar({ voice, className }: { voice: Voice; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "flex size-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white ring-2 ring-white/15",
        className
      )}
      style={{
        backgroundImage: `linear-gradient(135deg, oklch(0.78 0.13 ${voice.hue}), oklch(0.5 0.2 ${voice.hue + 40}))`,
      }}
    >
      {voice.name.slice(0, 2)}
    </span>
  )
}

type VoiceCardProps = Omit<React.ComponentProps<"div">, "onSelect"> & {
  voice: Voice
  selected?: boolean
  onSelect?: (voice: Voice) => void
}

function VoiceCard({ voice, selected, onSelect, className, ...props }: VoiceCardProps) {
  const [previewing, setPreviewing] = React.useState(false)

  React.useEffect(() => {
    if (!previewing) return
    const timeout = window.setTimeout(() => setPreviewing(false), 3000)
    return () => window.clearTimeout(timeout)
  }, [previewing])

  return (
    <div
      data-slot="voice-card"
      data-selected={selected}
      className={cn(
        "group/voice relative flex items-center gap-3 rounded-xl border bg-surface p-2 pr-2.5 backdrop-blur-md transition-all hover:border-primary/50 data-[selected=true]:border-primary data-[selected=true]:bg-primary/15",
        className
      )}
      {...props}
    >
      <button
        type="button"
        className="absolute inset-0 rounded-xl outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        aria-label={`Select ${voice.name}`}
        aria-pressed={selected}
        onClick={() => onSelect?.(voice)}
      />
      <VoiceAvatar voice={voice} />
      <div className="pointer-events-none min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{voice.name}</p>
        <p className="truncate text-xs text-muted-foreground">{voice.language}</p>
      </div>
      <Button
        variant="outline"
        size="icon-sm"
        className="relative rounded-full bg-transparent dark:bg-transparent"
        aria-label={previewing ? `Stop ${voice.name} preview` : `Preview ${voice.name}`}
        onClick={() => setPreviewing((value) => !value)}
      >
        {previewing ? (
          <PauseIcon className="fill-current" />
        ) : (
          <PlayIcon className="translate-x-px fill-current" />
        )}
      </Button>
    </div>
  )
}

const PAGE_SIZE = 6

type VoicePickerDialogProps = {
  value?: Voice
  onValueChange?: (voice: Voice) => void
  children: React.ReactNode
}

function VoicePickerDialog({ value, onValueChange, children }: VoicePickerDialogProps) {
  const [open, setOpen] = React.useState(false)
  const [draft, setDraft] = React.useState(value)
  const [category, setCategory] = React.useState("all")
  const [gender, setGender] = React.useState("all")
  const [language, setLanguage] = React.useState("all")
  const [page, setPage] = React.useState(1)

  const languages = React.useMemo(
    () => Array.from(new Set(allVoices.map((voice) => voice.language))).sort(),
    []
  )
  const filtered = allVoices.filter(
    (voice) =>
      (category === "all" || voice.category === category) &&
      (gender === "all" || voice.gender === gender) &&
      (language === "all" || voice.language === language)
  )
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (next) setDraft(value)
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="gap-5 sm:max-w-2xl">
        <DialogHeader className="flex-row flex-wrap items-center justify-between gap-3 pr-8">
          <div className="space-y-1">
            <DialogTitle className="font-heading text-2xl font-normal">Select voice</DialogTitle>
            <DialogDescription>Preview and pick the voice for your script.</DialogDescription>
          </div>
          <div className="flex gap-2">
            <Select value={gender} onValueChange={(next) => { setGender(next); setPage(1) }}>
              <SelectTrigger size="sm" className="w-28" aria-label="Gender">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any voice</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
                <SelectItem value="Male">Male</SelectItem>
              </SelectContent>
            </Select>
            <Select value={language} onValueChange={(next) => { setLanguage(next); setPage(1) }}>
              <SelectTrigger size="sm" className="w-36" aria-label="Language">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All languages</SelectItem>
                {languages.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </DialogHeader>
        <Tabs value={category} onValueChange={(next) => { setCategory(next); setPage(1) }}>
          <TabsList variant="line" className="no-scrollbar w-full justify-start overflow-x-auto">
            <TabsTrigger value="all" className="flex-none">
              All <Badge variant="secondary" className="h-4 px-1.5">{allVoices.length}</Badge>
            </TabsTrigger>
            {voiceCategories.map((item) => (
              <TabsTrigger key={item} value={item} className="flex-none">
                {item}
                <Badge variant="secondary" className="h-4 px-1.5">
                  {allVoices.filter((voice) => voice.category === item).length}
                </Badge>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <div className="grid min-h-48 content-start gap-2 sm:grid-cols-2">
          {visible.map((voice) => (
            <VoiceCard
              key={voice.id}
              voice={voice}
              selected={draft?.id === voice.id}
              onSelect={setDraft}
            />
          ))}
          {!visible.length && (
            <p className="col-span-full py-10 text-center text-sm text-muted-foreground">
              No voices match these filters.
            </p>
          )}
        </div>
        <DialogFooter className="items-center sm:justify-between">
          <Pagination className="mx-0 w-auto">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  text=""
                  aria-disabled={page === 1}
                  className={cn(page === 1 && "pointer-events-none opacity-50")}
                  onClick={(event) => { event.preventDefault(); setPage((p) => Math.max(1, p - 1)) }}
                />
              </PaginationItem>
              {Array.from({ length: pageCount }).map((_, index) => (
                <PaginationItem key={index}>
                  <PaginationLink
                    href="#"
                    size="icon-sm"
                    isActive={page === index + 1}
                    onClick={(event) => { event.preventDefault(); setPage(index + 1) }}
                  >
                    {index + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  text=""
                  aria-disabled={page === pageCount}
                  className={cn(page === pageCount && "pointer-events-none opacity-50")}
                  onClick={(event) => { event.preventDefault(); setPage((p) => Math.min(pageCount, p + 1)) }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
          <div className="flex gap-2">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              disabled={!draft}
              onClick={() => {
                if (draft) onValueChange?.(draft)
                setOpen(false)
              }}
            >
              Use voice
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

const voiceSettings = [
  { id: "pause", label: "Pause", options: ["None", "0.5s", "1s", "2s"] },
  { id: "prosody", label: "Prosody", options: ["Natural", "Calm", "Energetic", "Whisper"] },
  { id: "speed", label: "Speed", options: ["-20%", "-10%", "0%", "+10%", "+20%"] },
  { id: "pitch", label: "Pitch", options: ["-20%", "-10%", "0%", "+10%", "+20%"] },
] as const

type VoiceToolbarProps = React.ComponentProps<"div"> & {
  voice: Voice
  onVoiceChange: (voice: Voice) => void
  onAddPause?: () => void
}

/** Voice + prosody controls displayed under the voiceover composer. */
function VoiceToolbar({ voice, onVoiceChange, onAddPause, className, ...props }: VoiceToolbarProps) {
  const [settings, setSettings] = React.useState<Record<string, string>>({
    pause: "None",
    prosody: "Natural",
    speed: "0%",
    pitch: "0%",
  })

  return (
    <div
      data-slot="voice-toolbar"
      className={cn("flex flex-wrap items-center gap-2", className)}
      {...props}
    >
      <VoicePickerDialog value={voice} onValueChange={onVoiceChange}>
        <Button variant="outline" size="sm" className="shrink-0 rounded-full bg-surface pl-1 backdrop-blur dark:bg-surface">
          <VoiceAvatar voice={voice} className="size-5 text-[8px] ring-0" />
          {voice.name}
          <span className="text-muted-foreground">{voice.language}</span>
          <ChevronDownIcon className="text-muted-foreground" />
        </Button>
      </VoicePickerDialog>
      <div className="flex shrink-0 items-center gap-1 rounded-full border bg-surface p-0.5 backdrop-blur">
        {voiceSettings.map((setting) => (
          <DropdownMenu key={setting.id}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="xs" className="rounded-full">
                {setting.label}
                {setting.id === "speed" || setting.id === "pitch" ? (
                  <span className="text-muted-foreground">{settings[setting.id]}</span>
                ) : null}
                <ChevronDownIcon className="text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="min-w-36">
              <DropdownMenuLabel>{setting.label}</DropdownMenuLabel>
              <DropdownMenuRadioGroup
                value={settings[setting.id]}
                onValueChange={(next) => setSettings((prev) => ({ ...prev, [setting.id]: next }))}
              >
                {setting.options.map((option) => (
                  <DropdownMenuRadioItem key={option} value={option}>
                    {option}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        ))}
      </div>
      <div className="ml-auto flex shrink-0 gap-1">
        <Button variant="ghost" size="xs" className="rounded-full" onClick={onAddPause}>
          <PlusIcon /> Add pause
        </Button>
        <Button variant="ghost" size="xs" className="rounded-full">
          <SpellCheckIcon /> Pronunciation
        </Button>
      </div>
    </div>
  )
}

type ImportScriptDialogProps = React.ComponentProps<typeof Dialog> & {
  onImport?: (text: string, fileName: string) => void
}

/** Drag & drop dialog that reads a plain-text script. */
function ImportScriptDialog({ onImport, onOpenChange, ...props }: ImportScriptDialogProps) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = React.useState(false)

  async function handleFiles(files: FileList | null) {
    const file = files?.[0]
    if (!file) return
    const text = await file.text()
    onImport?.(text.slice(0, 4000), file.name)
    onOpenChange?.(false)
  }

  return (
    <Dialog onOpenChange={onOpenChange} {...props}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-heading text-2xl font-normal">Import script</DialogTitle>
          <DialogDescription>Bring an existing script and Ada will voice it.</DialogDescription>
        </DialogHeader>
        <div
          onDragOver={(event) => {
            event.preventDefault()
            setDragging(true)
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(event) => {
            event.preventDefault()
            setDragging(false)
            handleFiles(event.dataTransfer.files)
          }}
          data-dragging={dragging}
          className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-primary/40 bg-primary/5 px-6 py-12 text-center transition-colors data-[dragging=true]:border-primary data-[dragging=true]:bg-primary/15"
        >
          <span className="flex size-11 items-center justify-center rounded-full bg-primary/15 text-primary">
            <AudioLinesIcon className="size-5" />
          </span>
          <p className="font-heading text-xl">Drop files here</p>
          <p className="text-xs text-muted-foreground">or</p>
          <Button size="sm" className="rounded-full" onClick={() => inputRef.current?.click()}>
            <UploadIcon /> Upload files
          </Button>
          <p className="text-xs text-muted-foreground">Supports .txt, .md and .srt</p>
          <input
            ref={inputRef}
            type="file"
            accept=".txt,.md,.srt,text/plain"
            className="sr-only"
            onChange={(event) => handleFiles(event.target.files)}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}

export { ImportScriptDialog, VoiceAvatar, VoiceCard, VoicePickerDialog, VoiceToolbar }
