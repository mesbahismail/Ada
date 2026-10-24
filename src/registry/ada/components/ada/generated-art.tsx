"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import type { ArtScene } from "@/registry/ada/lib/ada-data"

type Palette = {
  sky: [string, string, string]
  sun: string
  glow: string
  layers: [string, string, string]
  accents: string[]
}

const palettes: Record<ArtScene, Palette> = {
  sunset: {
    sky: ["#2b0f3a", "#c2366b", "#ffb15c"],
    sun: "#ffe3a3",
    glow: "#ff8a4c",
    layers: ["#7a2350", "#4b1640", "#2a0d2c"],
    accents: ["#ff6f91", "#ffc75f"],
  },
  mountains: {
    sky: ["#0f1b3d", "#4b4c8c", "#e9a6b8"],
    sun: "#fff1e0",
    glow: "#f7b2c4",
    layers: ["#5a5a9a", "#3a3a72", "#1e1d45"],
    accents: ["#9ec5ff", "#f7b2c4"],
  },
  city: {
    sky: ["#140a2e", "#5b2a86", "#f08ab0"],
    sun: "#ffd1e6",
    glow: "#ff7eb6",
    layers: ["#2a1648", "#1a0d33", "#0d0620"],
    accents: ["#ffd36b", "#7ee0ff"],
  },
  bloom: {
    sky: ["#3a0f12", "#d1572c", "#ffd36b"],
    sun: "#fff3c4",
    glow: "#ffb347",
    layers: ["#0f7c8c", "#1a4fb5", "#2bb38a"],
    accents: ["#14c2c2", "#2f6fff", "#ffd700", "#7b2ff7"],
  },
  forest: {
    sky: ["#0c2a22", "#2f7a55", "#f2d58b"],
    sun: "#fff4cf",
    glow: "#ffd27a",
    layers: ["#25573f", "#173d2c", "#0b2219"],
    accents: ["#a6e3a1", "#ffd27a"],
  },
  aurora: {
    sky: ["#030a1c", "#0b2447", "#19376d"],
    sun: "#e0fbff",
    glow: "#57f2c8",
    layers: ["#0f1d33", "#0a1426", "#050b18"],
    accents: ["#57f2c8", "#9b5cff", "#4cc9f0"],
  },
  ocean: {
    sky: ["#0b3a6b", "#3fa7d6", "#ffd9a0"],
    sun: "#fff6d6",
    glow: "#ffc36b",
    layers: ["#1f7fb3", "#155a8a", "#0c3a5e"],
    accents: ["#fbe3b2", "#ffffff"],
  },
  neon: {
    sky: ["#0a0420", "#2d0b55", "#c21fd4"],
    sun: "#ff9df5",
    glow: "#ff3df2",
    layers: ["#1d0a3a", "#120626", "#080314"],
    accents: ["#00f0ff", "#ff3df2", "#ffe600"],
  },
}

function createRandom(input: string) {
  let seed = 0
  for (let i = 0; i < input.length; i++) {
    seed = Math.imul(31, seed) + input.charCodeAt(i)
  }
  return () => {
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function ridge(random: () => number, base: number, amplitude: number) {
  let d = `M0 400 L0 ${base}`
  for (let x = 0; x <= 400; x += 25) {
    const y = base - random() * amplitude
    d += ` L${x} ${y.toFixed(1)}`
  }
  return `${d} L400 400 Z`
}

function wave(offset: number, amplitude: number, phase: number) {
  let d = `M0 400 L0 ${offset}`
  for (let x = 0; x <= 400; x += 10) {
    const y = offset + Math.sin(x / 38 + phase) * amplitude
    d += ` L${x} ${y.toFixed(1)}`
  }
  return `${d} L400 400 Z`
}

type GeneratedArtProps = React.ComponentProps<"svg"> & {
  scene: ArtScene
  seed?: string | number
}

/**
 * Deterministic placeholder artwork for generated images and videos.
 * Swap it for your model output (an <img> or <video>) in production.
 */
function GeneratedArt({ scene, seed = 0, className, ...props }: GeneratedArtProps) {
  const id = React.useId().replace(/:/g, "")
  const palette = palettes[scene]
  const random = createRandom(`${scene}-${seed}`)
  const sunX = 120 + random() * 160
  const sunY = 120 + random() * 70
  const blobs = palette.accents.map((color, index) => ({
    color,
    cx: random() * 400,
    cy: 60 + random() * 220,
    r: 60 + random() * 70,
    key: index,
  }))

  return (
    <svg
      viewBox="0 0 400 400"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label={`Generated ${scene} artwork`}
      className={cn("size-full", className)}
      {...props}
    >
      <defs>
        <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={palette.sky[0]} />
          <stop offset="55%" stopColor={palette.sky[1]} />
          <stop offset="100%" stopColor={palette.sky[2]} />
        </linearGradient>
        <radialGradient id={`${id}-sun`}>
          <stop offset="0%" stopColor={palette.sun} />
          <stop offset="35%" stopColor={palette.sun} stopOpacity="0.9" />
          <stop offset="100%" stopColor={palette.glow} stopOpacity="0" />
        </radialGradient>
        <filter id={`${id}-blur`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="28" />
        </filter>
        <filter id={`${id}-soft`}>
          <feGaussianBlur stdDeviation="3" />
        </filter>
        <filter id={`${id}-grain`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
      </defs>

      <rect width="400" height="400" fill={`url(#${id}-sky)`} />

      <g filter={`url(#${id}-blur)`} opacity="0.55">
        {blobs.map((blob) => (
          <circle key={blob.key} cx={blob.cx} cy={blob.cy} r={blob.r} fill={blob.color} />
        ))}
      </g>

      {scene !== "neon" && scene !== "city" && (
        <circle cx={sunX} cy={sunY} r="110" fill={`url(#${id}-sun)`} />
      )}

      {scene === "aurora" &&
        palette.accents.map((color, index) => (
          <path
            key={color}
            d={`M-20 ${150 + index * 30} C 90 ${60 + index * 40}, 220 ${220 - index * 20}, 420 ${110 + index * 35}`}
            stroke={color}
            strokeWidth={36 - index * 8}
            fill="none"
            opacity="0.6"
            filter={`url(#${id}-soft)`}
          />
        ))}

      {scene === "bloom" && (
        <g transform="translate(200 330)">
          {Array.from({ length: 23 }).map((_, index) => {
            const angle = -170 + index * (160 / 22)
            const color = palette.layers[index % 3]
            const accent = palette.accents[index % palette.accents.length]
            return (
              <g key={index} transform={`rotate(${angle})`}>
                <ellipse cx="150" cy="0" rx="120" ry="14" fill={color} opacity="0.85" />
                <circle cx="240" cy="0" r="16" fill={accent} />
                <circle cx="240" cy="0" r="9" fill={palette.layers[1]} />
                <circle cx="240" cy="0" r="4" fill="#1b1033" />
              </g>
            )
          })}
          <ellipse cx="0" cy="-40" rx="26" ry="70" fill={palette.layers[1]} />
          <circle cx="0" cy="-118" r="20" fill={palette.layers[0]} />
        </g>
      )}

      {(scene === "sunset" || scene === "mountains" || scene === "forest" || scene === "aurora") && (
        <>
          <path d={ridge(random, 250, 70)} fill={palette.layers[0]} opacity="0.85" />
          <path d={ridge(random, 300, 60)} fill={palette.layers[1]} opacity="0.92" />
          <path d={ridge(random, 345, 45)} fill={palette.layers[2]} />
        </>
      )}

      {scene === "forest" &&
        Array.from({ length: 14 }).map((_, index) => {
          const x = index * 30 + random() * 12
          const h = 70 + random() * 70
          return (
            <path
              key={index}
              d={`M${x} 400 L${x} ${400 - h * 0.25} L${x - 16} ${400 - h * 0.25} L${x} ${400 - h} L${x + 16} ${400 - h * 0.25} L${x} ${400 - h * 0.25} Z`}
              fill={palette.layers[2]}
            />
          )
        })}

      {scene === "ocean" && (
        <>
          <path d={wave(270, 6, 0)} fill={palette.layers[0]} opacity="0.85" />
          <path d={wave(305, 8, 1.4)} fill={palette.layers[1]} opacity="0.9" />
          <path d={wave(345, 10, 2.6)} fill={palette.layers[2]} />
          <path d={wave(372, 4, 0.8)} fill={palette.accents[0]} opacity="0.9" />
        </>
      )}

      {(scene === "city" || scene === "neon") && (
        <g>
          {Array.from({ length: 11 }).map((_, index) => {
            const width = 30 + random() * 26
            const x = index * 38 - 10
            const height = 120 + random() * 170
            const layer = palette.layers[index % 2]
            return (
              <g key={index}>
                <rect x={x} y={400 - height} width={width} height={height} fill={layer} />
                {Array.from({ length: Math.floor(height / 22) }).map((_, row) =>
                  [0, 1, 2].map((col) =>
                    random() > 0.55 ? (
                      <rect
                        key={`${row}-${col}`}
                        x={x + 6 + col * ((width - 12) / 3)}
                        y={400 - height + 10 + row * 22}
                        width="5"
                        height="8"
                        fill={palette.accents[(row + col) % palette.accents.length]}
                        opacity="0.85"
                      />
                    ) : null
                  )
                )}
              </g>
            )
          })}
          {scene === "neon" && (
            <g stroke={palette.accents[1]} strokeWidth="1.5" opacity="0.6">
              {Array.from({ length: 8 }).map((_, index) => (
                <line key={index} x1={200} y1={330} x2={-200 + index * 115} y2={400} />
              ))}
            </g>
          )}
        </g>
      )}

      <rect
        width="400"
        height="400"
        filter={`url(#${id}-grain)`}
        opacity="0.12"
        style={{ mixBlendMode: "overlay" }}
      />
    </svg>
  )
}

export { GeneratedArt }
