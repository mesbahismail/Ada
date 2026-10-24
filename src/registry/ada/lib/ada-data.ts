import {
  AudioLinesIcon,
  ClapperboardIcon,
  ImageIcon,
  MessageSquareIcon,
  MusicIcon,
  SearchIcon,
  type LucideIcon,
} from "lucide-react"

export type AdaMode = "search" | "chat" | "voiceover" | "image" | "video"

export type ArtScene =
  | "sunset"
  | "mountains"
  | "city"
  | "bloom"
  | "forest"
  | "aurora"
  | "ocean"
  | "neon"

export type NavItem = {
  title: string
  href: string
  icon: LucideIcon
  badge?: string
}

export const navMain: NavItem[] = [
  { title: "Search", href: "/search", icon: SearchIcon },
  { title: "AI Chat", href: "/chat", icon: MessageSquareIcon },
  { title: "Voiceover", href: "/voiceover", icon: AudioLinesIcon },
  { title: "Image", href: "/image", icon: ImageIcon },
  { title: "Video", href: "/video", icon: ClapperboardIcon },
  { title: "Music", href: "/music", icon: MusicIcon, badge: "Soon" },
]

export const currentUser = {
  name: "Jamie Rivera",
  email: "jamie@ada.app",
  initials: "JR",
  plan: "Starter",
}

/* -------------------------------------------------------------------------- */
/*                                  Messages                                  */
/* -------------------------------------------------------------------------- */

export type UserMessage =
  | {
      id: string
      role: "user"
      kind: "text"
      label: "Question" | "Message" | "Script"
      content: string
    }
  | { id: string; role: "user"; kind: "audio"; duration: number }

export type AssistantMessage =
  | { id: string; role: "assistant"; kind: "text"; content: string }
  | {
      id: string
      role: "assistant"
      kind: "voiceover"
      voice: string
      duration: number
    }
  | {
      id: string
      role: "assistant"
      kind: "images"
      content: string
      images: ArtScene[]
    }
  | {
      id: string
      role: "assistant"
      kind: "video"
      scene: ArtScene
      duration: number
    }

export type Message = UserMessage | AssistantMessage

export type Conversation = {
  id: string
  mode: AdaMode
  title: string
  date: string
  messages: Message[]
  followUps?: string[]
}

const renaissanceAnswer = `Certainly! Here is a short description of each of the Renaissance painters listed.

**Leonardo da Vinci**
A true polymath, Leonardo moved freely between painting, anatomy, engineering and invention. His most celebrated works include the "Mona Lisa" and "The Last Supper".

**Michelangelo Buonarroti**
Sculptor, painter and architect. He painted the ceiling of the Sistine Chapel and carved the marble "David", still one of the most studied sculptures in the world.

**Raphael**
Known for balance, grace and clarity of composition. "The School of Athens" and his many Madonnas defined the High Renaissance ideal.`

const meaningAnswer = `There is no single answer, which is part of what makes the question worth asking. Philosophers have offered a few broad directions:

**Meaning you find** — purpose comes from something larger than yourself, like a faith, a cause or the people you love.

**Meaning you make** — existentialists argue life has no built-in meaning, so you author it through the choices you commit to.

**Meaning you practice** — many traditions suggest it is less a conclusion than a daily habit: curiosity, kindness and attention.`

const achieveAnswer = `Start small and make it concrete. Pick one value that matters to you, then design a weekly habit that expresses it. Review it every Sunday, keep what feels alive and drop what doesn't. Meaning tends to compound when it is practiced, not just pondered.`

export const conversations: Conversation[] = [
  {
    id: "renaissance-painters",
    mode: "search",
    title: "Renaissance painters",
    date: "Today",
    messages: [
      {
        id: "m1",
        role: "user",
        kind: "text",
        label: "Question",
        content: "Give me a description of each one",
      },
      { id: "m2", role: "assistant", kind: "text", content: renaissanceAnswer },
      { id: "m3", role: "user", kind: "audio", duration: 18 },
    ],
    followUps: [
      "Give me more names please",
      "Who was Raphael?",
      "How did they contribute to the Renaissance?",
    ],
  },
  {
    id: "meaning-of-life",
    mode: "chat",
    title: "Meaning of life",
    date: "Today",
    messages: [
      {
        id: "m1",
        role: "user",
        kind: "text",
        label: "Message",
        content: "Hey Ada, what is the meaning of life?",
      },
      { id: "m2", role: "assistant", kind: "text", content: meaningAnswer },
      {
        id: "m3",
        role: "user",
        kind: "text",
        label: "Message",
        content: "But how can you achieve this?",
      },
      { id: "m4", role: "assistant", kind: "text", content: achieveAnswer },
    ],
  },
  {
    id: "milkshake-advertising",
    mode: "voiceover",
    title: "Milkshake advertising",
    date: "Yesterday",
    messages: [
      {
        id: "m1",
        role: "user",
        kind: "text",
        label: "Script",
        content:
          "In a world where every moment matters, where memories are made in an instant, there's a shake that captures the essence of life like never before. Thick, cold and impossibly smooth. Sip the moment.",
      },
      {
        id: "m2",
        role: "assistant",
        kind: "voiceover",
        voice: "Anastasia",
        duration: 22,
      },
    ],
  },
  {
    id: "majestic-peacock",
    mode: "image",
    title: "Majestic peacock",
    date: "Yesterday",
    messages: [
      {
        id: "m1",
        role: "user",
        kind: "text",
        label: "Message",
        content: "Give me a photo of a majestic peacock rising in the sky",
      },
      {
        id: "m2",
        role: "assistant",
        kind: "images",
        content:
          "I've created four variations of a majestic peacock for you. I hope you find it as splendid as I intended it to be!",
        images: ["bloom", "sunset", "aurora", "neon"],
      },
      {
        id: "m3",
        role: "user",
        kind: "text",
        label: "Message",
        content: "Make it look warmer, golden hour please",
      },
    ],
  },
  {
    id: "panda-video",
    mode: "video",
    title: "Panda video",
    date: "Oct 18",
    messages: [
      {
        id: "m1",
        role: "user",
        kind: "text",
        label: "Script",
        content:
          "A playful panda rolling through a bamboo forest at golden hour, slow cinematic camera, soft depth of field.",
      },
      {
        id: "m2",
        role: "assistant",
        kind: "video",
        scene: "forest",
        duration: 12,
      },
    ],
    followUps: [
      "Extend the duration of the video by 10s",
      "Make the animations more subtle",
      "Change the camera angle",
    ],
  },
  {
    id: "weather-in-madrid",
    mode: "search",
    title: "Weather in Madrid",
    date: "Oct 16",
    messages: [
      {
        id: "m1",
        role: "user",
        kind: "text",
        label: "Question",
        content: "What's the weather like in Madrid this weekend?",
      },
      {
        id: "m2",
        role: "assistant",
        kind: "text",
        content:
          "Expect a sunny weekend in Madrid with highs around 24°C and cool evenings near 12°C. Light winds on Saturday, a small chance of clouds on Sunday afternoon. Perfect for a walk through Retiro Park.",
      },
    ],
    followUps: ["What should I pack?", "Best terraces nearby?"],
  },
  {
    id: "economy-changes",
    mode: "chat",
    title: "Changes of economy in the United States",
    date: "Oct 12",
    messages: [
      {
        id: "m1",
        role: "user",
        kind: "text",
        label: "Message",
        content: "Summarize the biggest changes in the US economy this decade.",
      },
      {
        id: "m2",
        role: "assistant",
        kind: "text",
        content:
          "Three shifts stand out: a rapid move to remote and hybrid work, a surge in AI and automation investment, and a reshoring push in manufacturing and chips. Together they changed where people live, which skills are rewarded, and how companies plan supply chains.",
      },
    ],
  },
]

export function getConversation(id: string) {
  return conversations.find((conversation) => conversation.id === id)
}

export const modeRoutes: Record<AdaMode, string> = {
  search: "/search",
  chat: "/chat",
  voiceover: "/voiceover",
  image: "/image",
  video: "/video",
}

/* -------------------------------------------------------------------------- */
/*                                 Suggestions                                */
/* -------------------------------------------------------------------------- */

export type PromptSuggestion = {
  title: string
  description: string
}

export const searchSuggestions: PromptSuggestion[] = [
  {
    title: "Give me today's popular stocks",
    description: "Track the biggest movers of the day",
  },
  {
    title: "What's the weather like today?",
    description: "Local forecast with hourly details",
  },
  {
    title: "What are the best restaurants near me?",
    description: "Top rated places open right now",
  },
  {
    title: "What's the news today?",
    description: "A quick brief of the main headlines",
  },
]

export const chatSuggestions: PromptSuggestion[] = [
  {
    title: "Hey Ada, what is the meaning of life?",
    description: "Explore philosophy together",
  },
  {
    title: "Hey Ada, how can I become a better person?",
    description: "Small habits with a big impact",
  },
  {
    title: "Hey Ada, write a romantic poem for me",
    description: "Short, sweet and personal",
  },
  {
    title: "Hey Ada, why is the sky so blue?",
    description: "Science, explained simply",
  },
]

export type MediaPrompt = {
  prompt: string
  scene: ArtScene
}

export const imagePrompts: MediaPrompt[] = [
  { prompt: "A lonely lighthouse on a misty hill at dawn", scene: "mountains" },
  {
    prompt: "Give me a photo of a man working in an office in a big city",
    scene: "city",
  },
  {
    prompt: "Give me a photo of a majestic peacock rising in the sky",
    scene: "bloom",
  },
  { prompt: "Give me a nice picture of a kid playing in a garden", scene: "forest" },
  { prompt: "Northern lights over a frozen lake", scene: "aurora" },
]

export const videoPrompts: MediaPrompt[] = [
  { prompt: "A road trip through desert canyons", scene: "sunset" },
  { prompt: "Girls playing volleyball on the beach", scene: "ocean" },
  { prompt: "Bears in the forest hunting by the river", scene: "forest" },
  { prompt: "Neon city streets in the rain", scene: "neon" },
]

/* -------------------------------------------------------------------------- */
/*                                   Voices                                   */
/* -------------------------------------------------------------------------- */

export type VoiceCategory =
  | "Corporate"
  | "Advertising"
  | "Narration"
  | "Documentaries"

export type Voice = {
  id: string
  name: string
  language: string
  gender: "Male" | "Female"
  category: VoiceCategory
  hue: number
}

export const voices: Voice[] = [
  { id: "emily", name: "Emily", language: "English (US)", gender: "Female", category: "Narration", hue: 330 },
  { id: "danny", name: "Danny", language: "German (DE)", gender: "Male", category: "Corporate", hue: 280 },
  { id: "san-zhu", name: "San Zhu", language: "Mandarin (CN)", gender: "Male", category: "Documentaries", hue: 20 },
  { id: "dwyer", name: "Dwyer", language: "English (UK)", gender: "Male", category: "Advertising", hue: 200 },
  { id: "anastasia", name: "Anastasia", language: "Spanish (SP)", gender: "Female", category: "Advertising", hue: 300 },
  { id: "paulo", name: "Paulo", language: "Italian (IT)", gender: "Male", category: "Narration", hue: 150 },
  { id: "bernardo", name: "Bernardo", language: "Portuguese (PT)", gender: "Male", category: "Corporate", hue: 40 },
  { id: "christopher", name: "Christopher", language: "English (US)", gender: "Male", category: "Documentaries", hue: 250 },
  { id: "amelie", name: "Amélie", language: "French (FR)", gender: "Female", category: "Advertising", hue: 350 },
  { id: "yuki", name: "Yuki", language: "Japanese (JP)", gender: "Female", category: "Narration", hue: 180 },
  { id: "omar", name: "Omar", language: "Arabic (AR)", gender: "Male", category: "Documentaries", hue: 60 },
  { id: "sofia", name: "Sofia", language: "Spanish (MX)", gender: "Female", category: "Corporate", hue: 310 },
]

export const voiceCategories: VoiceCategory[] = [
  "Corporate",
  "Advertising",
  "Narration",
  "Documentaries",
]

/* -------------------------------------------------------------------------- */
/*                                   Pricing                                  */
/* -------------------------------------------------------------------------- */

export type Plan = {
  id: string
  name: string
  description: string
  monthly: number
  features: { label: string; included: boolean }[]
  popular?: boolean
}

const planFeatures = [
  "Advanced AI reasoning",
  "Unlimited AI chats",
  "Real-time web search",
  "Voiceover studio",
  "Image generation",
  "Video generation",
  "Team workspaces",
  "Priority support",
  "API access",
  "Custom brand voices",
]

function features(count: number) {
  return planFeatures.map((label, index) => ({ label, included: index < count }))
}

export const plans: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    description: "For anyone just getting started",
    monthly: 29,
    features: features(5),
  },
  {
    id: "pro",
    name: "Pro",
    description: "For growing creators and small teams",
    monthly: 49,
    features: features(8),
    popular: true,
  },
  {
    id: "business",
    name: "Business",
    description: "Collaboration across teams and tools",
    monthly: 99,
    features: features(10),
  },
]
