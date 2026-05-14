"use client"

import React from "react"

// ── Easing ──────────────────────────────────────────────────────────────────
export type EaseFn = (t: number) => number

export const Easing = {
  linear:        (t: number) => t,
  easeInQuad:    (t: number) => t * t,
  easeOutQuad:   (t: number) => t * (2 - t),
  easeInCubic:   (t: number) => t * t * t,
  easeOutCubic:  (t: number) => { const u = t - 1; return u * u * u + 1 },
  easeInOutCubic:(t: number) => t < 0.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1,
  easeInQuart:   (t: number) => t * t * t * t,
  easeOutQuart:  (t: number) => { const u = t - 1; return 1 - u*u*u*u },
  easeInExpo:    (t: number) => t === 0 ? 0 : Math.pow(2, 10*(t-1)),
  easeOutExpo:   (t: number) => t === 1 ? 1 : 1 - Math.pow(2, -10*t),
  easeInSine:    (t: number) => 1 - Math.cos((t * Math.PI) / 2),
  easeOutSine:   (t: number) => Math.sin((t * Math.PI) / 2),
}

// ── Utilities ────────────────────────────────────────────────────────────────
export const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v))

// multi-segment keyframe interpolation
export function interpolate(
  input: number[],
  output: number[],
  ease: EaseFn | EaseFn[] = Easing.linear,
): (t: number) => number {
  return (t: number) => {
    if (t <= input[0]) return output[0]
    if (t >= input[input.length - 1]) return output[output.length - 1]
    for (let i = 0; i < input.length - 1; i++) {
      if (t >= input[i] && t <= input[i + 1]) {
        const span = input[i + 1] - input[i]
        const local = span === 0 ? 0 : (t - input[i]) / span
        const fn = Array.isArray(ease) ? (ease[i] ?? Easing.linear) : ease
        return output[i] + (output[i + 1] - output[i]) * fn(local)
      }
    }
    return output[output.length - 1]
  }
}

// single-segment tween
export function tween({
  from = 0, to = 1, start = 0, end = 1,
  ease = Easing.easeInOutCubic,
}: { from?: number; to?: number; start?: number; end?: number; ease?: EaseFn }
): (t: number) => number {
  return (t: number) => {
    if (t <= start) return from
    if (t >= end) return to
    return from + (to - from) * ease((t - start) / (end - start))
  }
}

// ── Timeline context ─────────────────────────────────────────────────────────
interface TimelineCtx {
  time: number
  duration: number
  playing: boolean
  setTime: React.Dispatch<React.SetStateAction<number>>
  setPlaying: React.Dispatch<React.SetStateAction<boolean>>
}

const TimelineContext = React.createContext<TimelineCtx>({
  time: 0, duration: 10, playing: false,
  setTime: () => {}, setPlaying: () => {},
})

export const useTime = () => React.useContext(TimelineContext).time
export const useTimeline = () => React.useContext(TimelineContext)

// ── Sprite ────────────────────────────────────────────────────────────────────
// Renders children only while time is in [start, end]; provides localTime + progress.
export interface SpriteCtx {
  localTime: number
  progress: number
  duration: number
  visible: boolean
}

const SpriteContext = React.createContext<SpriteCtx>({
  localTime: 0, progress: 0, duration: 0, visible: false,
})

export const useSprite = () => React.useContext(SpriteContext)

export function Sprite({
  start = 0, end = Infinity, keepMounted = false, children,
}: {
  start?: number
  end?: number
  keepMounted?: boolean
  children: React.ReactNode | ((ctx: SpriteCtx) => React.ReactNode)
}) {
  const { time } = useTimeline()
  const visible = time >= start && time <= end
  if (!visible && !keepMounted) return null

  const dur = end - start
  const localTime = clamp(time - start, 0, dur)
  const progress = dur > 0 && isFinite(dur) ? clamp(localTime / dur, 0, 1) : 0
  const value: SpriteCtx = { localTime, progress, duration: dur, visible }

  return (
    <SpriteContext.Provider value={value}>
      {typeof children === "function" ? children(value) : children}
    </SpriteContext.Provider>
  )
}

// ── Stage ─────────────────────────────────────────────────────────────────────
export function Stage({
  duration = 10,
  background = "#fff",
  loop = true,
  autoplay = true,
  controls = true,
  children,
}: {
  duration?: number
  background?: string
  loop?: boolean
  autoplay?: boolean
  controls?: boolean
  children: React.ReactNode
}) {
  const [time, setTime] = React.useState(0)
  const [playing, setPlaying] = React.useState(autoplay)
  const [hoverTime, setHoverTime] = React.useState<number | null>(null)

  const rafRef = React.useRef<number | null>(null)
  const lastTsRef = React.useRef<number | null>(null)

  // rAF loop
  React.useEffect(() => {
    if (!playing) { lastTsRef.current = null; return }
    const step = (ts: number) => {
      if (lastTsRef.current == null) lastTsRef.current = ts
      const dt = Math.min((ts - lastTsRef.current) / 1000, 0.1) // cap for tab switches
      lastTsRef.current = ts
      setTime(t => {
        const next = t + dt
        if (next >= duration) return loop ? next % duration : duration
        return next
      })
      rafRef.current = requestAnimationFrame(step)
    }
    rafRef.current = requestAnimationFrame(step)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      lastTsRef.current = null
    }
  }, [playing, duration, loop])

  // Keyboard: space, arrows, 0
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName
      if (tag === "INPUT" || tag === "TEXTAREA") return
      if (e.code === "Space") { e.preventDefault(); setPlaying(p => !p) }
      else if (e.code === "ArrowLeft")  setTime(t => clamp(t - (e.shiftKey ? 1 : 0.1), 0, duration))
      else if (e.code === "ArrowRight") setTime(t => clamp(t + (e.shiftKey ? 1 : 0.1), 0, duration))
      else if (e.key === "0") setTime(0)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [duration])

  const displayTime = hoverTime ?? time
  const ctx = React.useMemo<TimelineCtx>(
    () => ({ time: displayTime, duration, playing, setTime, setPlaying }),
    [displayTime, duration, playing],
  )

  return (
    <div style={{ width: "100%", ...(controls && { maxWidth: "520px" }) }}>
      {/* Canvas */}
      <div style={{
        position: "relative", width: "100%", aspectRatio: "1",
        background, border: "1px solid rgba(0,0,0,0.08)",
        borderRadius: "18px", overflow: "hidden",
      }}>
        <TimelineContext.Provider value={ctx}>
          {children}
        </TimelineContext.Provider>
      </div>

      {/* Playback bar — only when controls=true */}
      {controls && (
        <PlaybackBar
          time={displayTime}
          duration={duration}
          playing={playing}
          onPlayPause={() => setPlaying(p => !p)}
          onReset={() => setTime(0)}
          onSeek={t => setTime(t)}
          onHover={setHoverTime}
        />
      )}
    </div>
  )
}

// ── PlaybackBar ───────────────────────────────────────────────────────────────
function PlaybackBar({
  time, duration, playing, onPlayPause, onReset, onSeek, onHover,
}: {
  time: number; duration: number; playing: boolean
  onPlayPause: () => void; onReset: () => void
  onSeek: (t: number) => void; onHover: (t: number | null) => void
}) {
  const trackRef = React.useRef<HTMLDivElement>(null)
  const [dragging, setDragging] = React.useState(false)

  const timeFromEvent = React.useCallback((e: MouseEvent | React.MouseEvent) => {
    if (!trackRef.current) return 0
    const r = trackRef.current.getBoundingClientRect()
    return clamp((e.clientX - r.left) / r.width, 0, 1) * duration
  }, [duration])

  React.useEffect(() => {
    if (!dragging) return
    const up = () => setDragging(false)
    const move = (e: MouseEvent) => onSeek(timeFromEvent(e))
    window.addEventListener("mouseup", up)
    window.addEventListener("mousemove", move)
    return () => {
      window.removeEventListener("mouseup", up)
      window.removeEventListener("mousemove", move)
    }
  }, [dragging, timeFromEvent, onSeek])

  const pct = duration > 0 ? (time / duration) * 100 : 0
  const fmt = (t: number) => {
    const s = Math.floor(t)
    const ds = Math.floor(((t - s) * 10))
    return `${String(s).padStart(2, "0")}.${ds}s`
  }

  const btn: React.CSSProperties = {
    width: 24, height: 24, display: "flex",
    alignItems: "center", justifyContent: "center",
    background: "transparent",
    border: "1px solid rgba(0,0,0,0.10)",
    borderRadius: 5,
    color: "oklch(45% 0.010 245)",
    cursor: "pointer", padding: 0, flexShrink: 0,
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 2px", fontFamily: "var(--body)" }}>
      <button onClick={onReset} style={btn} title="Reset (0)">
        <svg width="11" height="11" viewBox="0 0 14 14" fill="none">
          <path d="M3 2v10M12 2L5 7l7 5V2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round"/>
        </svg>
      </button>
      <button onClick={onPlayPause} style={btn} title="Play / Pause (space)">
        {playing ? (
          <svg width="11" height="11" viewBox="0 0 14 14" fill="none">
            <rect x="3" y="2" width="3" height="10" fill="currentColor"/>
            <rect x="8" y="2" width="3" height="10" fill="currentColor"/>
          </svg>
        ) : (
          <svg width="11" height="11" viewBox="0 0 14 14" fill="none">
            <path d="M3 2l9 5-9 5V2z" fill="currentColor"/>
          </svg>
        )}
      </button>

      <span style={{
        fontSize: 11, fontVariantNumeric: "tabular-nums",
        color: "oklch(50% 0.008 245)", letterSpacing: "0.04em",
        width: 46, textAlign: "right", flexShrink: 0,
      }}>
        {fmt(time)}
      </span>

      {/* Scrub track */}
      <div
        ref={trackRef}
        onMouseMove={e => { dragging ? onSeek(timeFromEvent(e)) : onHover(timeFromEvent(e)) }}
        onMouseLeave={() => { if (!dragging) onHover(null) }}
        onMouseDown={e => { setDragging(true); onSeek(timeFromEvent(e)) }}
        style={{ flex: 1, height: 20, position: "relative", cursor: "pointer", display: "flex", alignItems: "center" }}
      >
        <div style={{ position: "absolute", left: 0, right: 0, height: 3, background: "rgba(0,0,0,0.08)", borderRadius: 2 }} />
        <div style={{ position: "absolute", left: 0, width: `${pct}%`, height: 3, background: "oklch(40% 0.012 245)", borderRadius: 2 }} />
        <div style={{
          position: "absolute", left: `${pct}%`,
          width: 10, height: 10, marginLeft: -5, top: "50%", marginTop: -5,
          background: "oklch(9% 0.012 245)", borderRadius: "50%",
          boxShadow: "0 0 0 2px rgba(255,255,255,0.85)",
        }} />
      </div>

      <span style={{
        fontSize: 11, fontVariantNumeric: "tabular-nums",
        color: "oklch(68% 0.006 245)", letterSpacing: "0.04em",
        width: 46, flexShrink: 0,
      }}>
        {fmt(duration)}
      </span>
    </div>
  )
}
