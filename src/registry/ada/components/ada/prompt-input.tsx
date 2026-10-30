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
        <div className="min-w-0 flex-1 rounded-3xl bg-border p-px shadow-[0_8px_30px_-12px_oklch(0.2_0.1_315/15%)] focus-within:bg-primary dark:bg-white/15 dark:shadow-[0_8px_30px_-12px_oklch(0.2_0.1_315/45%)] dark:focus-within:bg-primary">
          <InputGroup
            className="min-h-12 items-end rounded-[23px] border-0 bg-background px-1 text-foreground has-disabled:bg-background has-disabled:opacity-100 has-[[data-slot=input-group-control]:focus-visible]:ring-0 dark:bg-[#26142E] dark:text-white dark:has-disabled:bg-[#26142E]"
            onClick={(event) => {
              if (!(event.target as HTMLElement).closest("button, textarea")) {
                event.currentTarget.querySelector("textarea")?.focus()
              }
            }}
          >
            {recording ? (
              <div className="flex h-12 w-full items-center gap-3 px-2">
                <InputGroupButton
                  size="icon-sm"
                  variant="ghost"
                  className="rounded-full text-foreground hover:text-foreground dark:text-white dark:hover:text-white"
                  aria-label="Cancel recording"
                  onClick={() => stopRecording(false)}
                >
                  <XIcon />
                </InputGroupButton>
                <span className="size-2 shrink-0 animate-pulse rounded-full bg-destructive" />
                <Waveform animated seed={`rec-${seconds > 3}`} bars={72} progress={1} className="h-6 text-foreground dark:text-white" />
                <span className="font-mono text-xs text-foreground tabular-nums dark:text-white">
                  {formatTime(seconds)}
                </span>
                <InputGroupButton
                  size="icon-sm"
                  variant="default"
                  className="rounded-full text-white hover:text-white"
                  aria-label="Send voice note"
                  onClick={() => stopRecording(true)}
                >
                  <CheckIcon />
                </InputGroupButton>
              </div>
            ) : (
              <>
                <InputGroupAddon align="inline-start" className="self-end pb-2 text-foreground dark:text-white">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <InputGroupButton
                        size="icon-sm"
                        className="rounded-full text-foreground hover:bg-muted hover:text-foreground dark:text-white dark:hover:bg-white/10 dark:hover:text-white"
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
                  className="max-h-32 min-h-11 min-w-0 w-0 py-3 text-base text-foreground caret-foreground placeholder:text-muted-foreground sm:max-h-48 sm:text-sm dark:text-white dark:caret-white dark:placeholder:text-white/60"
                  onChange={(event) => setValue(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
                      event.preventDefault()
                      submit()
                    }
                  }}
                />
                <InputGroupAddon align="inline-end" className="self-end gap-1 pb-2 text-foreground dark:text-white">
                  {onVoiceSubmit && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <InputGroupButton
                          size="icon-sm"
                          className="rounded-full text-foreground hover:bg-muted hover:text-foreground dark:text-white dark:hover:bg-white/10 dark:hover:text-white"
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
                    className="rounded-full text-white shadow-[0_0_14px_oklch(0.6_0.28_320/50%)] disabled:opacity-100"
                    aria-label="Send"
                    disabled={disabled || !value.trim()}
                  >
                    <ArrowUpIcon />
                  </InputGroupButton>
                </InputGroupAddon>
              </>
            )}
          </InputGroup>
        </div>
        {actions}
      </div>
      {toolbar}
      {disclaimer !== false && (
        <p className="flex items-center justify-center gap-1 text-center text-[10px] leading-tight text-muted-foreground sm:gap-1.5 sm:text-[11px]">
          <InfoIcon className="size-3 shrink-0" />
          {disclaimer ?? "Ada is a beta release and may give inaccurate or harmful information."}
        </p>
      )}
    </form>
  )
}

export { PromptInput }
