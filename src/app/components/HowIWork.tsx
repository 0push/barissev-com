"use client"

import { Stage, useTime, interpolate, tween, Easing, clamp } from "./stage"

// ── Research data ────────────────────────────────────────────────────────────
const AIs = [
  { name: "Perplexity", url: "https://www.google.com/s2/favicons?domain=perplexity.ai&sz=64",    cx: 50, cy: 20, inAt: 0.3 },
  { name: "Claude",     url: "https://www.google.com/s2/favicons?domain=anthropic.com&sz=64",     cx: 80, cy: 50, inAt: 0.7 },
  { name: "ChatGPT",    url: "https://www.google.com/s2/favicons?domain=openai.com&sz=64",        cx: 50, cy: 80, inAt: 1.1 },
  { name: "Gemini",     url: "https://www.google.com/s2/favicons?domain=gemini.google.com&sz=64", cx: 20, cy: 50, inAt: 1.5 },
]

const LINES = [
  { d: "M 50 24 L 50 46", len: 22 },
  { d: "M 76 50 L 54 50", len: 22 },
  { d: "M 50 76 L 50 54", len: 22 },
  { d: "M 24 50 L 46 50", len: 22 },
]

const CONFETTI = Array.from({ length: 10 }, (_, i) => {
  const angle = (i / 10) * Math.PI * 2
  return {
    dx: Math.cos(angle) * 62,
    dy: Math.sin(angle) * 56,
    color: ["#FF5F57","#FFBD2E","#28C840","oklch(58% 0.22 258)","oklch(65% 0.20 20)"][i % 5],
    size: [7,5,9,6,8,5,7,6,9,5][i],
  }
})

// ── Think data ───────────────────────────────────────────────────────────────
const SCRIBBLE_STROKES = [
  { d: "M 12 30 Q 12.4 38 12 45 Q 11.8 48 12 50",                    w: 1.3, inAt: 0.10, dur: 0.14 },
  { d: "M 12 42 Q 17 33 21 42 L 21 50",                               w: 1.3, inAt: 0.22, dur: 0.16 },
  { d: "M 23 42 L 23 50 Q 26 33 29 42 Q 32 33 35 42 L 35 50",         w: 1.3, inAt: 0.36, dur: 0.24 },
  { d: "M 37 42 L 37 50 Q 40 33 43 42 Q 46 33 49 42 L 49 50",         w: 1.3, inAt: 0.58, dur: 0.24 },
  { d: "M 51 42 L 51 50 Q 54 33 57 42 Q 60 33 63 42 L 63 50",         w: 1.3, inAt: 0.80, dur: 0.24 },
  { d: "M 66 49 Q 67 46 68 49",                                        w: 1.6, inAt: 1.02, dur: 0.07 },
  { d: "M 18 57 Q 18.4 63 18 70 Q 17.7 73 18 74",                     w: 1.3, inAt: 1.12, dur: 0.13 },
  { d: "M 18 66 Q 23 57 27 66 L 27 74",                                w: 1.3, inAt: 1.23, dur: 0.15 },
  { d: "M 29 66 L 29 74 Q 32 57 35 66 Q 38 57 41 66 L 41 74",         w: 1.3, inAt: 1.36, dur: 0.22 },
  { d: "M 43 66 L 43 74 Q 46 57 49 66 Q 52 57 55 66 L 55 74",         w: 1.3, inAt: 1.56, dur: 0.22 },
]

const HOUSE_STROKES = [
  { d: "M 32 64 L 68 64",                              w: 1.1, inAt: 0.00, dur: 0.11 },
  { d: "M 34 64 L 34 37",                              w: 1.1, inAt: 0.09, dur: 0.12 },
  { d: "M 66 64 L 66 37",                              w: 1.1, inAt: 0.18, dur: 0.12 },
  { d: "M 34 37 L 50 22",                              w: 1.1, inAt: 0.27, dur: 0.13 },
  { d: "M 66 37 L 50 22",                              w: 1.1, inAt: 0.37, dur: 0.13 },
  { d: "M 44 64 L 44 51 Q 50 48 56 51 L 56 64",        w: 1.1, inAt: 0.47, dur: 0.18 },
  { d: "M 37 52 L 37 43 L 45 43 L 45 52 L 37 52",      w: 1.0, inAt: 0.63, dur: 0.16 },
  { d: "M 60 34 L 60 26 L 65 26 L 65 34",              w: 1.0, inAt: 0.77, dur: 0.13 },
]

const PERSON_STROKES = [
  { d: "M 50 26 Q 57 26 57 33 Q 57 40 50 40 Q 43 40 43 33 Q 43 26 50 26", w: 1.1, inAt: 0.00, dur: 0.28 },
  { d: "M 50 40 L 50 60",                              w: 1.2, inAt: 0.26, dur: 0.10 },
  { d: "M 50 47 L 38 56",                              w: 1.1, inAt: 0.34, dur: 0.10 },
  { d: "M 50 47 L 62 56",                              w: 1.1, inAt: 0.41, dur: 0.10 },
  { d: "M 50 60 L 42 75",                              w: 1.1, inAt: 0.49, dur: 0.12 },
  { d: "M 50 60 L 58 75",                              w: 1.1, inAt: 0.57, dur: 0.12 },
]

// ── Shared cursor pieces ─────────────────────────────────────────────────────
function CursorArrow({ color }: { color: string }) {
  return (
    <svg width="16" height="19" viewBox="0 0 10 12" fill="none">
      <path d="M1 1l8 3.5-3.5 1L4.5 11 1 1z" fill={color} />
    </svg>
  )
}
function CursorLabel({ label, color }: { label: string; color: string }) {
  return (
    <span style={{
      fontFamily: "var(--body)", fontSize: "10px", fontWeight: 700,
      color, letterSpacing: "0.06em", textTransform: "uppercase",
      background: "rgba(255,255,255,0.9)", padding: "1px 5px", borderRadius: 3,
    }}>{label}</span>
  )
}

// ── Research ─────────────────────────────────────────────────────────────────
function Research() {
  const time = useTime()
  const FADE = 6.8
  const END  = 8.0

  const logoVals = AIs.map(({ inAt }) =>
    clamp(interpolate(
      [inAt, inAt+0.3, FADE, END], [0, 1, 1, 0],
      [Easing.easeOutExpo, Easing.linear, Easing.easeInQuad],
    )(time), 0, 1.05)
  )

  const lineData = LINES.map((_, i) => {
    const s = 2.0 + i * 0.22
    return {
      progress: interpolate([s, s+0.45, 3.3, 4.2], [0, 1, 1, 0])(time),
      opacity:  interpolate([s, s+0.45, 3.3, 4.2], [0, 1, 0.4, 0])(time),
    }
  })

  const brainS  = interpolate([2.3, 2.6, 3.1, 3.3], [0, 1, 1, 0], [Easing.easeOutExpo, Easing.linear, Easing.easeInQuad])(time)
  const bubbleS = interpolate([3.4, 3.7, 4.2, 4.4], [0, 1, 1, 0], [Easing.easeOutExpo, Easing.linear, Easing.easeInQuad])(time)

  const circleS = interpolate([4.6, 4.75, 4.9, FADE, END], [0, 1.12, 1.0, 1.0, 0])(time)
  const circleO = interpolate([4.6, 4.8, FADE, END], [0, 1, 1, 0])(time)

  const confItems = CONFETTI.map(({ dx, dy, color, size }, i) => {
    const s = 4.9 + i * 0.032
    const e = 5.9 + i * 0.022
    const o = interpolate([s, s+0.1, e-0.2, e], [0, 1, 0.5, 0])(time)
    const pos = tween({ from: 0, to: 1, start: s, end: e, ease: Easing.easeOutExpo })(time)
    return { dx, dy, color, size, o, pos }
  })

  return (
    <>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
        {LINES.map(({ d, len }, i) => (
          <path key={i} d={d}
            strokeDasharray={len} strokeDashoffset={len * (1 - lineData[i].progress)}
            stroke="oklch(78% 0.010 245)" strokeWidth="0.5"
            fill="none" strokeLinecap="round"
            opacity={lineData[i].opacity}
          />
        ))}
      </svg>

      {AIs.map(({ name, url, cx, cy }, i) => (
        <div key={name} style={{
          position: "absolute", left: `${cx-4.5}%`, top: `${cy-4.5}%`,
          width: "9%", height: "9%",
          opacity: logoVals[i], transform: `scale(${logoVals[i]})`, transformOrigin: "center",
        }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={url} alt={name} style={{ width: "100%", height: "100%", objectFit: "contain", borderRadius: "22%" }} />
        </div>
      ))}

      <div style={{
        position: "absolute", left: "50%", top: "50%",
        transform: `translate(-50%, -50%) scale(${clamp(brainS, 0, 1)})`,
        fontSize: "32px", lineHeight: 1, userSelect: "none",
        opacity: clamp(brainS, 0, 1),
      }}>🧠</div>

      <div style={{
        position: "absolute", left: "50%", top: "50%",
        transform: `translate(-50%, -50%) scale(${clamp(bubbleS, 0, 1)})`,
        fontSize: "30px", lineHeight: 1, userSelect: "none",
        opacity: clamp(bubbleS, 0, 1),
      }}>💭</div>

      <div style={{
        position: "absolute", left: "37%", top: "37%",
        width: "26%", height: "26%",
        borderRadius: "50%",
        border: "2px solid oklch(62% 0.22 145 / 0.7)",
        background: "linear-gradient(135deg, oklch(95% 0.10 145 / 0.45), oklch(88% 0.16 145 / 0.25))",
        display: "flex", alignItems: "center", justifyContent: "center",
        opacity: clamp(circleO, 0, 1),
        transform: `scale(${clamp(circleS, 0, 1.12)})`,
        transformOrigin: "center",
      }}>
        <svg viewBox="0 0 24 24" fill="none" width="52%" height="52%">
          <path d="M5 12l5 5 9-10" stroke="oklch(48% 0.26 145)" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>

      {confItems.map(({ dx, dy, color, size, o, pos }, i) => {
        if (o <= 0) return null
        return (
          <div key={i} style={{
            position: "absolute", left: "50%", top: "50%",
            width: size, height: size,
            borderRadius: i % 2 === 0 ? "2px" : "50%",
            background: color, pointerEvents: "none",
            opacity: o,
            transform: `translate(${dx * pos}px, ${dy * pos}px) scale(${1 - pos * 0.5})`,
          }} />
        )
      })}
    </>
  )
}

// ── Think ─────────────────────────────────────────────────────────────────────
function Think() {
  const time = useTime()
  const S_FADE   = 1.95
  const H_START  = 2.0
  const E_START  = 3.1
  const E_END    = 3.85
  const P_START  = 3.8
  const P_FADE   = 5.05
  const P_END    = 5.5
  const R_START  = 5.25
  const R_FADE   = 6.8
  const END      = 8.0

  const s1 = SCRIBBLE_STROKES.map(({ inAt, dur }) => ({
    drawP: clamp(interpolate([inAt, inAt + dur], [0, 1], Easing.easeOutExpo)(time), 0, 1),
    o: clamp(interpolate([inAt, inAt + dur + 0.05, S_FADE, S_FADE + 0.35], [0, 1, 1, 0])(time), 0, 1),
  }))

  const houseStrokes = HOUSE_STROKES.map(({ inAt, dur }) => {
    const at = H_START + inAt
    return {
      drawP: clamp(interpolate([at, at + dur], [0, 1], Easing.easeOutExpo)(time), 0, 1),
      o: clamp(interpolate([at, at + dur + 0.05, E_END, E_END + 0.08], [0, 1, 1, 0])(time), 0, 1),
    }
  })

  const eraseP = clamp(interpolate([E_START, E_END], [0, 1], Easing.easeInOutCubic)(time), 0, 1)
  const eraserVisible = time >= E_START && time <= E_END + 0.1

  const personStrokes = PERSON_STROKES.map(({ inAt, dur }) => {
    const at = P_START + inAt
    return {
      drawP: clamp(interpolate([at, at + dur], [0, 1], Easing.easeOutExpo)(time), 0, 1),
      o: clamp(interpolate([at, at + dur + 0.05, P_FADE, P_END], [0, 1, 1, 0])(time), 0, 1),
    }
  })

  const s2 = SCRIBBLE_STROKES.map(({ inAt, dur }) => {
    const at = R_START + inAt * 0.58
    const d  = dur * 0.58
    return {
      drawP: clamp(interpolate([at, at + d], [0, 1], Easing.easeOutExpo)(time), 0, 1),
      o: clamp(interpolate([at, at + d + 0.05, R_FADE, END], [0, 1, 1, 0])(time), 0, 1),
    }
  })

  const strokeColor = "oklch(22% 0.012 245)"

  const renderStrokes = (
    data: { d: string; w: number }[],
    anim: { drawP: number; o: number }[],
  ) => data.map(({ d, w }, i) => {
    const { drawP, o } = anim[i]
    if (o < 0.01) return null
    return (
      <path key={i} d={d}
        style={{ stroke: strokeColor }}
        strokeWidth={w} fill="none"
        strokeLinecap="round" strokeLinejoin="round"
        strokeDasharray="200" strokeDashoffset={200 * (1 - drawP)}
        opacity={o}
      />
    )
  })

  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none"
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
      <defs>
        <clipPath id="hiw-house-clip">
          <rect x={eraseP * 100} y="0" width="100" height="100" />
        </clipPath>
      </defs>
      {renderStrokes(SCRIBBLE_STROKES, s1)}
      <g clipPath={eraseP > 0 ? "url(#hiw-house-clip)" : undefined}>
        {renderStrokes(HOUSE_STROKES, houseStrokes)}
      </g>
      {eraserVisible && (
        <rect
          x={eraseP * 100 - 5.5} y="18" width="6" height="64"
          style={{ fill: "oklch(99.5% 0.003 245)", stroke: "rgba(0,0,0,0.09)" }}
          strokeWidth="0.4" rx="0.8"
        />
      )}
      {renderStrokes(PERSON_STROKES, personStrokes)}
      {renderStrokes(SCRIBBLE_STROKES, s2)}
    </svg>
  )
}

// ── Collaborate ───────────────────────────────────────────────────────────────
function Collaborate() {
  const time = useTime()
  const FADE = 6.8
  const END  = 8.0

  const docS = clamp(interpolate([0.5, 0.8, FADE, END], [0, 1, 1, 0], [Easing.easeOutExpo, Easing.linear, Easing.easeInQuad])(time), 0, 1)
  const docO = interpolate([0.5, 0.8, FADE, END], [0, 1, 1, 0])(time)

  const meL = interpolate([0.9, 1.3, 2.1, 5.5, 6.0, FADE], [5,  5, 26, 26, 14, 6 ], Easing.easeOutQuart)(time)
  const meT = interpolate([0.9, 1.3, 2.1, 5.5, 6.0, FADE], [78, 78, 42, 42, 54, 66], Easing.easeOutQuart)(time)
  const meO = interpolate([0.9, 1.3, 5.5, 6.0, FADE], [0, 1, 1, 0.4, 0])(time)

  const aiL = interpolate([1.2, 1.6, 2.4, 5.5, 6.0, FADE], [84, 84, 62, 62, 72, 82], Easing.easeOutQuart)(time)
  const aiT = interpolate([1.2, 1.6, 2.4, 5.5, 6.0, FADE], [8,  8,  42, 42, 30, 18], Easing.easeOutQuart)(time)
  const aiO = interpolate([1.2, 1.6, 5.5, 6.0, FADE], [0, 1, 1, 0.4, 0])(time)

  const ME_LINES = [2.5, 3.0, 3.5]
  const AI_LINES = [2.7, 3.2, 3.7]

  return (
    <>
      <div style={{
        position: "absolute", left: "20%", top: "18%",
        width: "60%", height: "64%",
        background: "white", border: "1px solid rgba(0,0,0,0.08)",
        borderRadius: "8px", overflow: "hidden",
        opacity: clamp(docO, 0, 1), transform: `scale(${docS})`, transformOrigin: "center",
      }}>
        <div style={{
          height: "13%", background: "oklch(97.5% 0.004 245)",
          borderBottom: "1px solid rgba(0,0,0,0.05)",
          display: "flex", alignItems: "center", padding: "0 8%", gap: "4%",
        }}>
          <div style={{ width: "38%", height: "28%", background: "rgba(0,0,0,0.08)", borderRadius: 2 }} />
          <div style={{ width: "22%", height: "28%", background: "rgba(0,0,0,0.05)", borderRadius: 2 }} />
        </div>
        <div style={{ position: "absolute", left: "50%", top: "13%", width: 1, height: "87%", background: "rgba(0,0,0,0.05)" }} />

        {ME_LINES.map((lStart, i) => {
          const v = interpolate([lStart, lStart+0.3, FADE, END], [0, 1, 1, 0])(time)
          return (
            <div key={i} style={{
              position: "absolute", left: "5%", top: `${30 + i*20}%`,
              width: ["38%","28%","34%"][i], height: "7%",
              background: "oklch(22% 0.012 245)", borderRadius: 3,
              opacity: clamp(v, 0, 1), transform: `scaleX(${clamp(v, 0, 1)})`, transformOrigin: "left center",
            }} />
          )
        })}
        {AI_LINES.map((lStart, i) => {
          const v = interpolate([lStart, lStart+0.3, FADE, END], [0, 1, 1, 0])(time)
          return (
            <div key={i} style={{
              position: "absolute", left: "54%", top: `${30 + i*20}%`,
              width: ["30%","38%","24%"][i], height: "7%",
              background: (["oklch(72% 0.18 258/0.7)","oklch(68% 0.16 20/0.7)","oklch(70% 0.14 145/0.7)"] as const)[i],
              borderRadius: 3,
              opacity: clamp(v, 0, 1), transform: `scaleX(${clamp(v, 0, 1)})`, transformOrigin: "left center",
            }} />
          )
        })}
      </div>

      <div style={{
        position: "absolute", left: `${meL}%`, top: `${meT}%`,
        opacity: clamp(meO, 0, 1), display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 3,
      }}>
        <CursorArrow color="oklch(9% 0.012 245)" />
        <CursorLabel label="Me" color="oklch(9% 0.012 245)" />
      </div>

      <div style={{
        position: "absolute", left: `${aiL}%`, top: `${aiT}%`,
        opacity: clamp(aiO, 0, 1), display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 3,
      }}>
        <CursorArrow color="oklch(52% 0.22 260)" />
        <CursorLabel label="AI" color="oklch(52% 0.22 260)" />
      </div>
    </>
  )
}

// ── Widget ────────────────────────────────────────────────────────────────────
const BG = "oklch(99.5% 0.003 245)"

import React from "react"

const STEPS = [
  {
    title: "Gather signal",
    desc: "Research, tools, context. Before building, understand everything.",
    Scene: Research,
  },
  {
    title: "Think it through",
    desc: "Patterns, instinct, judgment. The human part no model replaces.",
    Scene: Think,
  },
  {
    title: "Build with AI",
    desc: "Where direction meets speed. Faster loops, sharper output.",
    Scene: Collaborate,
  },
]

export default function HowIWork() {
  return (
    <div className="hiw-grid">
      {STEPS.map(({ title, desc, Scene }, i) => (
        <React.Fragment key={title}>
          {i > 0 && <div className="hiw-separator" />}
          <div className="hiw-step">
            <Stage duration={8} controls={false} background={BG}>
              <Scene />
            </Stage>
            <div className="hiw-text">
              <p className="hiw-title">{title}</p>
              <p className="hiw-desc">{desc}</p>
            </div>
          </div>
        </React.Fragment>
      ))}
    </div>
  )
}
