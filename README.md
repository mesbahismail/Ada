# Ada — free AI app template for shadcn/ui

Ada is a dark-purple (with a lavender light mode) AI workspace template built
100% with [shadcn/ui](https://ui.shadcn.com) and distributed as a
[shadcn registry](https://ui.shadcn.com/docs/registry). It covers the screens an
AI product needs: search, chat, voiceover, image generation and editing, video
generation, pricing, settings and auth.

Stack: Next.js 16 (App Router) · React 19 · Tailwind CSS v4 · shadcn/ui (Radix,
Nova preset) · lucide-react · next-themes · sonner.

## Screens

| Route | Block | What it shows |
| --- | --- | --- |
| `/login`, `/signup` | `login`, `signup` | Auth forms, Google button, "What's new" panel |
| `/search`, `/search/[id]` | `search` | Hero, suggestion cards, answers, voice notes, follow-ups |
| `/chat`, `/chat/[id]` | `chat` | Conversational assistant |
| `/voiceover`, `/voiceover/[id]` | `voiceover` | Voice grid, voice picker dialog, prosody toolbar, script import |
| `/image`, `/image/[id]` | `image` | Prompt gallery, 2×2 results, "Surprise me" |
| `/image/edit` | `image-editor` | Upscale / adjust / edit panels, aspect ratio, sampling, sliders |
| `/video`, `/video/[id]` | `video` | Prompt gallery, video player |
| `/music` | `music` | Coming-soon empty state |
| `/pricing` | `pricing` | Three plans with monthly/yearly toggle |
| `/settings` | `settings` | Organization, members, billing, API keys, logs |

Replies are mocked by `hooks/use-ada-chat.ts`, and images/videos use the
`GeneratedArt` SVG placeholder, so the template runs with no API keys. Swap them
for your model calls (for example the AI SDK's `useChat`) and real media.

## Install into your project

1. Point the `@ada` namespace at the deployed registry in `components.json`:

   ```json
   {
     "registries": {
       "@ada": "https://YOUR-DOMAIN/r/{name}.json"
     }
   }
   ```

2. Install the theme first (so its colors replace the defaults), then the app:

   ```bash
   npx shadcn@latest add @ada/theme @ada/app
   ```

   Or pick single blocks, for example `npx shadcn@latest add @ada/theme @ada/search`.

3. Wrap your root layout:

   ```tsx
   import { ThemeProvider } from "@/components/ada/theme-provider"
   import { Toaster } from "@/components/ui/sonner"
   import { TooltipProvider } from "@/components/ui/tooltip"

   export default function RootLayout({ children }: { children: React.ReactNode }) {
     return (
       <html lang="en" suppressHydrationWarning>
         <body>
           <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
             <TooltipProvider>{children}</TooltipProvider>
             <Toaster />
           </ThemeProvider>
         </body>
       </html>
     )
   }
   ```

## Registry items

All items live in [`registry.json`](registry.json); sources are in
[`src/registry/ada`](src/registry/ada).

- **Foundation:** `theme`, `font-heading-instrument-serif`, `data`
- **Components:** `logo`, `theme-toggle`, `generated-art`, `audio-player`,
  `prompt-input`, `media`, `chat-message`, `suggestions`, `voice-picker`,
  `auth-forms`
- **Blocks:** `app-shell`, `workspace`, `search`, `chat`, `voiceover`, `image`,
  `image-editor`, `video`, `music`, `pricing`, `settings`, `login`, `signup`
- **Everything:** `app`

## Develop

```bash
npm install
npm run dev
```

`npm run registry:build` writes the installable JSON to `public/r`
(`npm run build` does it automatically). The demo routes in `src/app` re-export
the blocks from `src/registry/ada/blocks`, so what you see is exactly what gets
installed.

## Publish

1. Update `homepage` in `registry.json` if you host the docs somewhere other than GitHub.
2. Deploy (for example on Vercel); the registry is served from `/r/{name}.json`.
3. To make `@ada/...` work without any config, submit the namespace to the
   [shadcn registry directory](https://ui.shadcn.com/docs/directory).

## License

MIT — free for personal and commercial use. See [LICENSE](LICENSE).
