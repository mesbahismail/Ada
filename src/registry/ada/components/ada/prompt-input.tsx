"use client"

import * as React from "react"
import {
  ArrowUpIcon,
  CheckIcon,
  InfoIcon,
  MicIcon,
  PaperclipIcon,
  XIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "@/components/ui/input-group"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Waveform, formatTime } from "@/registry/ada/components/ada/audio-player"

type PromptInputProps = Omit<React.ComponentProps<"form">, "onSubmit"> & {
  placeholder?: string
  disabled?: boolean
  /** Called with the trimmed prompt when the user presses Enter or Send. */
  onSubmit?: (value: string) => void
  /** Called with the recording length when a voice note is sent. */
  onVoiceSubmit?: (seconds: number) => void
  /** Rendered beside the input, e.g. a "Surprise me" button. */
  actions?: React.ReactNode
  /** Rendered under the input, e.g. voice settings. */
  toolbar?: React.ReactNode
  /** Opens the file picker / import dialog. */
  onAttach?: () => void
  disclaimer?: React.ReactNode | false
}

function PromptInput({
  placeholder = "Message Ada...",
  disabled,
  onSubmit,
  onVoiceSubmit,
  onAttach,
  actions,
  toolbar,
  disclaimer,
  className,
  ...props
}: PromptInputProps) {
  const [value, setValue] = React.useState("")
  const [recording, setRecording] = React.useState(false)
  const [seconds, setSeconds] = React.useState(0)

  React.useEffect(() => {
    if (!recording) return
    const interval = window.setInterval(() => setSeconds((s) => s + 1), 1000)
    return () => window.clearInterval(interval)
  }, [recording])

  function submit() {
    const prompt = value.trim()
    if (!prompt || disabled) return
    onSubmit?.(prompt)
    setValue("")
  }

  function stopRecording(send: boolean) {
    if (send && !disabled) onVoiceSubmit?.(Math.max(seconds, 1))
    setRecording(false)
    setSeconds(0)
  }

  return (
    <form
      data-slot="prompt-input"
      className={cn("mx-auto flex w-full max-w-3xl flex-col gap-2", className)}
      onSubmit={(event) => {
        event.preventDefault()
        submit()
      }}
      {...props}
    >
      <div className="flex items-end gap-2">
        <InputGroup className="min-h-12 items-end rounded-3xl border-border bg-surface px-1 shadow-[0_8px_30px_-12px_oklch(0.2_0.1_315/45%)] backdrop-blur-xl dark:bg-surface">
          {recording ? (
            <div className="flex h-12 w-full items-center gap-3 px-2">
              <InputGroupButton
                size="icon-sm"
                variant="ghost"
                className="rounded-full"
                aria-label="Cancel recording"
                onClick={() => stopRecording(false)}
              >
                <XIcon />
              </InputGroupButton>
              <span className="size-2 shrink-0 animate-pulse rounded-full bg-destructive" />
              <Waveform animated seed={`rec-${seconds > 3}`} bars={72} progress={1} className="h-6 text-primary" />
              <span className="font-mono text-xs text-muted-foreground tabular-nums">
                {formatTime(seconds)}
              </span>
              <InputGroupButton
                size="icon-sm"
                variant="default"
                className="rounded-full"
                aria-label="Send voice note"
                onClick={() => stopRecording(true)}
              >
                <CheckIcon />
              </InputGroupButton>
            </div>
          ) : (
            <>
              <InputGroupAddon align="inline-start" className="self-end pb-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <InputGroupButton
                      size="icon-sm"
                      className="rounded-full text-muted-foreground"
                      aria-label="Attach"
                      onClick={onAttach}
                    >
                      <PaperclipIcon />
                    </InputGroupButton>
                  </TooltipTrigger>
                  <TooltipContent>Attach files</TooltipContent>
                </Tooltip>
              </InputGroupAddon>
              <InputGroupTextarea
                rows={1}
                value={value}
                disabled={disabled}
                placeholder={placeholder}
                aria-label={placeholder}
                className="max-h-48 min-h-11 py-3 text-sm"
                onChange={(event) => setValue(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
                    event.preventDefault()
                    submit()
                  }
                }}
              />
              <InputGroupAddon align="inline-end" className="self-end gap-1 pb-2">
                {onVoiceSubmit && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <InputGroupButton
                        size="icon-sm"
                        className="rounded-full text-muted-foreground"
                        aria-label="Record voice"
                        disabled={disabled}
                        onClick={() => setRecording(true)}
                      >
                        <MicIcon />
                      </InputGroupButton>
                    </TooltipTrigger>
                    <TooltipContent>Voice input</TooltipContent>
                  </Tooltip>
                )}
                <InputGroupButton
                  type="submit"
                  size="icon-sm"
                  variant="default"
                  className="rounded-full shadow-[0_0_14px_oklch(0.6_0.28_320/50%)]"
                  aria-label="Send"
                  disabled={disabled || !value.trim()}
                >
                  <ArrowUpIcon />
                </InputGroupButton>
              </InputGroupAddon>
            </>
          )}
        </InputGroup>
        {actions}
      </div>
      {toolbar}
      {disclaimer !== false && (
        <p className="flex items-center justify-center gap-1.5 text-center text-[11px] text-muted-foreground">
          <InfoIcon className="size-3" />
          {disclaimer ?? "Ada is a beta release and may give inaccurate or harmful information."}
        </p>
      )}
    </form>
  )
}

export { PromptInput }
