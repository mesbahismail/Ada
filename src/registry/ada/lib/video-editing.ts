import type { AssistantMessage, VideoScene } from "@/registry/ada/lib/ada-data"

type VideoMessage = Extract<AssistantMessage, { kind: "video" }>

export function createVideoTimeline(video: VideoMessage, direction = ""): VideoScene[] {
  if (video.scenes?.length) return structuredClone(video.scenes)
  const duration = Math.max(1, video.duration)
  const count = Math.min(3, Math.floor(duration))
  const part = Math.floor((duration / count) * 10) / 10
  return Array.from({ length: count }, (_, index) => ({
    id: `${video.id}-scene-${index + 1}`,
    title: ["Opening", "Main scene", "Closing"][index],
    scene: video.scene,
    duration: index === count - 1 ? Math.round((duration - part * (count - 1)) * 10) / 10 : part,
    direction,
  }))
}

export function timelineDuration(scenes: VideoScene[]) {
  return Math.round(scenes.reduce((sum, scene) => sum + scene.duration, 0) * 10) / 10
}

export function sceneAtTime(scenes: VideoScene[], time: number) {
  let start = 0
  for (let index = 0; index < scenes.length; index++) {
    if (time < start + scenes[index].duration || index === scenes.length - 1) return { index, start, scene: scenes[index] }
    start += scenes[index].duration
  }
  return undefined
}

export function splitVideoScene(scenes: VideoScene[], id: string, offset: number, newId: string) {
  return scenes.flatMap((scene) => {
    if (scene.id !== id || scene.duration < 2) return [scene]
    const cut = Math.round(Math.max(1, Math.min(scene.duration - 1, offset)) * 10) / 10
    return [{ ...scene, duration: cut }, { ...scene, id: newId, title: `${scene.title} (part 2)`, duration: Math.round((scene.duration - cut) * 10) / 10 }]
  })
}

/** Local storyboard preview; the saved direction can be sent to a video model. */
export function applySceneDirection(scene: VideoScene, direction: string): VideoScene {
  const presets = [
    [/sunset|golden hour|warmer/i, "sunset"], [/ocean|beach|sea\b/i, "ocean"],
    [/forest|bamboo|trees/i, "forest"], [/mountain/i, "mountains"],
    [/neon|cyberpunk/i, "neon"], [/city|urban/i, "city"],
    [/aurora|northern lights/i, "aurora"], [/flower|bloom/i, "bloom"],
  ] as const
  const duration = direction.match(/\b(\d+(?:\.\d+)?)\s*(?:s\b|seconds?\b)/i)
  return { ...scene, direction,
    scene: presets.find(([pattern]) => pattern.test(direction))?.[1] ?? scene.scene,
    duration: duration ? Math.round(Math.max(1, Math.min(60, Number(duration[1]))) * 10) / 10 : scene.duration,
  }
}
