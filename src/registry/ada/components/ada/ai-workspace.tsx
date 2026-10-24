"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { DicesIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { MessageList } from "@/registry/ada/components/ada/chat-message"
import { MediaCarousel, MediaPromptCard } from "@/registry/ada/components/ada/media"
import { PageHeader } from "@/registry/ada/components/ada/page-header"
import { PromptInput } from "@/registry/ada/components/ada/prompt-input"
import {
  PromptSuggestions,
  SuggestionChips,
  WelcomeHero,
} from "@/registry/ada/components/ada/suggestions"
import {
  ImportScriptDialog,
  VoiceCard,
  VoiceToolbar,
} from "@/registry/ada/components/ada/voice-picker"
import { useAdaChat } from "@/registry/ada/hooks/use-ada-chat"
import {
  chatSuggestions,
  imagePrompts,
  modeRoutes,
  searchSuggestions,
  videoPrompts,
  voices,
  type AdaMode,
  type Conversation,
} from "@/registry/ada/lib/ada-data"

const newTitles: Record<AdaMode, string> = {
  search: "New search",
  chat: "New chat",
  voiceover: "New voiceover",
  image: "New image",
  video: "New video",
}

const placeholders: Record<AdaMode, string> = {
  search: "Ask anything…",
  chat: "Message Ada…",
  voiceover: "Paste or write a script, Ada will voice it…",
  image: "Describe the image you want to create…",
  video: "Describe a scene, Ada will animate it…",
}

const defaultFollowUps: Record<AdaMode, string[]> = {
  search: ["Tell me more", "Show me the sources", "Summarize in 3 bullets"],
  chat: ["Explain it like I'm five", "Give me an example", "Make it shorter"],
  voiceover: [],
  image: ["Make it more vibrant", "Try a different style", "Add a sunset"],
  video: ["Extend the duration by 10s", "Make the animations more subtle", "Change the camera angle"],
}

type AiWorkspaceProps = {
  mode: AdaMode
  conversation?: Conversation
}

/** Shared screen for Search, Chat, Voiceover, Image and Video. */
function AiWorkspace({ mode, conversation }: AiWorkspaceProps) {
  const router = useRouter()
  const [voice, setVoice] = React.useState(voices[4])
  const [importOpen, setImportOpen] = React.useState(false)
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const { messages, pending, send, sendAudio, regenerate } = useAdaChat({
    mode,
    initialMessages: conversation?.messages,
    voice: voice.name,
  })

  React.useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })
  }, [messages.length, pending])

  const empty = messages.length === 0
  const hasAnswer = messages.some((message) => message.role === "assistant")
  const followUps = conversation?.followUps ?? defaultFollowUps[mode]

  return (
    <div className="flex h-svh min-h-0 flex-col">
      <PageHeader
        title={conversation?.title ?? newTitles[mode]}
        newHref={empty ? undefined : modeRoutes[mode]}
      />
      <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto flex min-h-full w-full max-w-3xl flex-col px-4 py-6">
          {empty ? (
            <>
              <div className="flex flex-1 items-center justify-center py-10">
                <WelcomeHero />
              </div>
              {(mode === "search" || mode === "chat") && (
                <PromptSuggestions
                  items={mode === "search" ? searchSuggestions : chatSuggestions}
                  onSelect={send}
                />
              )}
              {mode === "voiceover" && (
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {voices.slice(0, 6).map((item) => (
                    <VoiceCard
                      key={item.id}
                      voice={item}
                      selected={item.id === voice.id}
                      onSelect={setVoice}
                    />
                  ))}
                </div>
              )}
              {(mode === "image" || mode === "video") && (
                <MediaCarousel>
                  {(mode === "image" ? imagePrompts : videoPrompts).map((item) => (
                    <MediaPromptCard key={item.prompt} item={item} kind={mode} onSelect={send} />
                  ))}
                </MediaCarousel>
              )}
            </>
          ) : (
            <>
              <MessageList
                messages={messages}
                pending={pending}
                onRegenerate={regenerate}
                onCustomize={() => router.push("/image/edit")}
              />
              {hasAnswer && !pending && followUps.length > 0 && (
                <SuggestionChips className="mt-10" items={followUps} onSelect={send} />
              )}
            </>
          )}
        </div>
      </div>
      <div className="shrink-0 px-4 pt-2 pb-3">
        <PromptInput
          placeholder={placeholders[mode]}
          disabled={Boolean(pending)}
          onSubmit={send}
          onVoiceSubmit={mode === "search" || mode === "chat" ? sendAudio : undefined}
          onAttach={mode === "voiceover" ? () => setImportOpen(true) : undefined}
          toolbar={
            mode === "voiceover" ? (
              <VoiceToolbar
                voice={voice}
                onVoiceChange={setVoice}
                onAddPause={() => send("[pause 1s]")}
              />
            ) : undefined
          }
          actions={
            mode === "image" ? (
              <Button
                type="button"
                variant="outline"
                className="h-12 shrink-0 rounded-full bg-surface px-4 backdrop-blur dark:bg-surface"
                disabled={Boolean(pending)}
                onClick={() =>
                  send(imagePrompts[Math.floor(Math.random() * imagePrompts.length)].prompt)
                }
              >
                <DicesIcon className="text-primary" />
                <span className="hidden sm:inline">Surprise me</span>
              </Button>
            ) : undefined
          }
        />
      </div>
      {mode === "voiceover" && (
        <ImportScriptDialog
          open={importOpen}
          onOpenChange={setImportOpen}
          onImport={(text) => send(text)}
        />
      )}
    </div>
  )
}

export { AiWorkspace }
