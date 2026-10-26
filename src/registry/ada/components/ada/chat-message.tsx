"use client"

import * as React from "react"
import {
  AudioLinesIcon,
  ClapperboardIcon,
  CopyIcon,
  DownloadIcon,
  FileTextIcon,
  ImageIcon,
  MessageSquareIcon,
  MicIcon,
  RefreshCwIcon,
  SearchIcon,
  SlidersHorizontalIcon,
  SparklesIcon,
  ThumbsDownIcon,
  ThumbsUpIcon,
  Volume2Icon,
  type LucideIcon,
} from "lucide-react"
import { toast } from "sonner"

import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { AdaMark } from "@/registry/ada/components/ada/ada-logo"
import { AudioPlayer } from "@/registry/ada/components/ada/audio-player"
import { ImageGrid, VideoPlayer } from "@/registry/ada/components/ada/media"
import {
  currentUser,
  type AssistantMessage as AssistantMessageData,
  type Message,
  type UserMessage as UserMessageData,
} from "@/registry/ada/lib/ada-data"

const userLabels: Record<string, { icon: LucideIcon; label: string }> = {
  Question: { icon: SearchIcon, label: "Question" },
  Message: { icon: MessageSquareIcon, label: "Message" },
  Script: { icon: FileTextIcon, label: "Script" },
  audio: { icon: MicIcon, label: "Audio" },
}

const assistantLabels: Record<AssistantMessageData["kind"], { icon: LucideIcon; label: string }> = {
  text: { icon: SparklesIcon, label: "Answer" },
  voiceover: { icon: AudioLinesIcon, label: "Voiceover" },
  images: { icon: ImageIcon, label: "Image" },
  video: { icon: ClapperboardIcon, label: "Video" },
}

/** Renders paragraphs; a line wrapped in **double asterisks** becomes a heading. */
function RichText({ content, className }: { content: string; className?: string }) {
  return (
    <div className={cn("space-y-3 text-sm leading-relaxed", className)}>
      {content.split("\n\n").map((block, index) => {
        const [first, ...rest] = block.split("\n")
        const heading = first.match(/^\*\*(.+)\*\*$/)
        if (heading) {
          return (
            <div key={index}>
              <p className="font-semibold text-foreground">{heading[1]}</p>
              {rest.length > 0 && <p className="text-foreground/80">{rest.join(" ")}</p>}
            </div>
          )
        }
        return (
          <p key={index} className="text-foreground/85">
            {block.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
              part.startsWith("**") ? (
                <strong key={i} className="font-semibold text-foreground">
                  {part.slice(2, -2)}
                </strong>
              ) : (
                part
              )
            )}
          </p>
        )
      })}
    </div>
  )
}

function MessageLabel({
  icon: Icon,
  children,
  className,
}: {
  icon: LucideIcon
  children: React.ReactNode
  className?: string
}) {
  return (
    <span className={cn("flex items-center gap-1 text-[11px] font-medium", className)}>
      <Icon className="size-3" />
      {children}
    </span>
  )
}

function UserAvatar({ className }: { className?: string }) {
  return (
    <Avatar className={cn("size-7 ring-2 ring-white/15", className)}>
      <AvatarFallback className="bg-gradient-to-br from-amber-200 to-rose-400 text-[11px] font-semibold text-rose-950">
        {currentUser.initials}
      </AvatarFallback>
    </Avatar>
  )
}

function UserMessage({ message }: { message: UserMessageData }) {
  const meta = userLabels[message.kind === "audio" ? "audio" : message.label]

  return (
    <div
      data-slot="user-message"
      className="flex items-end justify-end gap-2 animate-in fade-in-0 slide-in-from-bottom-2 duration-300"
    >
      <div
        className={cn(
          "flex max-w-[85%] flex-col gap-1 rounded-2xl rounded-br-md bg-bubble-gradient px-3.5 py-2.5 text-bubble-foreground shadow-[0_10px_30px_-12px_oklch(0.6_0.28_320/70%)] sm:max-w-md",
          message.kind === "audio" && "w-80"
        )}
      >
        <MessageLabel icon={meta.icon} className="text-white/75">
          {meta.label}
        </MessageLabel>
        {message.kind === "audio" ? (
          <AudioPlayer variant="bubble" duration={message.duration} seed={message.id} bars={40} />
        ) : (
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
        )}
      </div>
      <UserAvatar />
    </div>
  )
}

type ActionsProps = {
  message: AssistantMessageData
  onRegenerate?: () => void
  onCustomize?: () => void
}

function MessageActions({ message, onRegenerate, onCustomize }: ActionsProps) {
  const [vote, setVote] = React.useState<"up" | "down" | null>(null)
  const isMedia = message.kind !== "text"

  return (
    <div data-slot="message-actions" className="flex flex-wrap items-center gap-0.5 text-muted-foreground">
      <Button
        variant="ghost"
        size="icon-xs"
        aria-label="Like"
        aria-pressed={vote === "up"}
        className={cn(vote === "up" && "text-primary")}
        onClick={() => setVote(vote === "up" ? null : "up")}
      >
        <ThumbsUpIcon />
      </Button>
      <Button
        variant="ghost"
        size="icon-xs"
        aria-label="Dislike"
        aria-pressed={vote === "down"}
        className={cn(vote === "down" && "text-primary")}
        onClick={() => setVote(vote === "down" ? null : "down")}
      >
        <ThumbsDownIcon />
      </Button>
      {message.kind === "text" && (
        <>
          <Button
            variant="ghost"
            size="xs"
            onClick={() => {
              navigator.clipboard?.writeText(message.content)
              toast.success("Copied to clipboard")
            }}
          >
            <CopyIcon /> Copy
          </Button>
          <Button variant="ghost" size="xs" onClick={() => toast("Reading answer aloud…")}>
            <Volume2Icon /> Read
          </Button>
        </>
      )}
      <Button variant="ghost" size="xs" onClick={onRegenerate}>
        <RefreshCwIcon /> Regenerate
      </Button>
      {isMedia && (
        <Button variant="ghost" size="xs" onClick={() => toast.success("Download started")}>
          <DownloadIcon /> Download
        </Button>
      )}
      {(message.kind === "images" || message.kind === "video") && (
        <Button variant="ghost" size="xs" onClick={onCustomize}>
          <SlidersHorizontalIcon /> Customize
        </Button>
      )}
    </div>
  )
}

function AssistantMessage({ message, onRegenerate, onCustomize }: ActionsProps) {
  const meta = assistantLabels[message.kind]

  return (
    <div
      data-slot="assistant-message"
      className="flex items-end gap-2 animate-in fade-in-0 slide-in-from-bottom-2 duration-300"
    >
      <AdaMark className="mb-1 size-6" />
      <div
        className={cn(
          "flex min-w-0 flex-col gap-2 rounded-2xl rounded-bl-md border bg-card p-3.5 text-card-foreground backdrop-blur-md",
          message.kind === "text" && "max-w-2xl",
          message.kind === "voiceover" && "w-full max-w-sm",
          message.kind === "images" && "w-full max-w-sm",
          message.kind === "video" && "w-full max-w-md"
        )}
      >
        <MessageLabel icon={meta.icon} className="text-primary">
          {meta.label}
        </MessageLabel>
        {message.kind === "text" && <RichText content={message.content} />}
        {message.kind === "voiceover" && (
          <AudioPlayer duration={message.duration} seed={message.id} bars={44} />
        )}
        {message.kind === "images" && (
          <>
            <p className="text-sm text-foreground/85">{message.content}</p>
            <ImageGrid images={message.images} seed={message.id} onOpen={onCustomize} />
          </>
        )}
        {message.kind === "video" && (
          <VideoPlayer scene={message.scene} duration={message.duration} seed={message.id} scenes={message.scenes} />
        )}
        <MessageActions message={message} onRegenerate={onRegenerate} onCustomize={onCustomize} />
      </div>
    </div>
  )
}

function ThinkingIndicator({ label = "Thinking…" }: { label?: string }) {
  return (
    <div data-slot="thinking-indicator" className="flex justify-center animate-in fade-in-0">
      <span className="inline-flex items-center gap-2 rounded-full border bg-surface px-3 py-1 text-xs text-muted-foreground backdrop-blur">
        <Spinner className="size-3 text-primary" />
        <span className="shimmer">{label}</span>
      </span>
    </div>
  )
}

type MessageListProps = React.ComponentProps<"div"> & {
  messages: Message[]
  pending?: string | null
  onRegenerate?: (id: string) => void
  onCustomize?: (id: string) => void
}

function MessageList({
  messages,
  pending,
  onRegenerate,
  onCustomize,
  className,
  ...props
}: MessageListProps) {
  return (
    <div data-slot="message-list" className={cn("flex flex-col gap-6", className)} {...props}>
      {messages.map((message) =>
        message.role === "user" ? (
          <UserMessage key={message.id} message={message} />
        ) : (
          <AssistantMessage
            key={message.id}
            message={message}
            onRegenerate={() => onRegenerate?.(message.id)}
            onCustomize={() => onCustomize?.(message.id)}
          />
        )
      )}
      {pending && <ThinkingIndicator label={pending} />}
    </div>
  )
}

export {
  AssistantMessage,
  MessageActions,
  MessageList,
  RichText,
  ThinkingIndicator,
  UserAvatar,
  UserMessage,
}
