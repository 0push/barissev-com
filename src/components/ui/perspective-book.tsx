"use client"

import { type ReactNode, useState, useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

const easeOutCubic = (t: number) => { const u = t - 1; return u * u * u + 1 }
const easeInOutCubic = (t: number) => t < 0.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v))

function interpolate(
  input: number[],
  output: number[],
  ease: ((t: number) => number)[],
): (t: number) => number {
  return (t: number) => {
    if (t <= input[0]) return output[0]
    if (t >= input[input.length - 1]) return output[output.length - 1]
    for (let i = 0; i < input.length - 1; i++) {
      if (t >= input[i] && t <= input[i + 1]) {
        const span = input[i + 1] - input[i]
        const local = span === 0 ? 0 : (t - input[i]) / span
        const fn = ease[i] ?? ((x: number) => x)
        return output[i] + (output[i + 1] - output[i]) * fn(local)
      }
    }
    return output[output.length - 1]
  }
}

const DURATION = 9.2
const linear = (t: number) => t

// 0–1.2s: 360 spin intro
const spinFn = interpolate(
  [0, 1.2, 7.8, 9.0],
  [0, 360, 360, 720],
  [easeInOutCubic, linear, easeInOutCubic],
)
const coverFn = interpolate(
  [1.4, 2.0, 2.6, 6.0, 6.7, 7.4],
  [0, 0, -160, -160, 0, 0],
  [linear, easeOutCubic, linear, linear, easeOutCubic],
)
const page1Fn = interpolate(
  [3.0, 3.6, 5.2, 5.7],
  [0, -170, -170, 0],
  [easeOutCubic, linear, easeOutCubic],
)
const page2Fn = interpolate(
  [3.3, 3.9, 4.9, 5.4],
  [0, -170, -170, 0],
  [easeOutCubic, linear, easeOutCubic],
)
const page3Fn = interpolate(
  [3.6, 4.2, 4.6, 5.1],
  [0, -170, -170, 0],
  [easeOutCubic, linear, easeOutCubic],
)
const shiftFn = interpolate(
  [1.4, 2.6, 6.0, 7.4],
  [0, 16, 16, 0],
  [easeOutCubic, linear, easeOutCubic],
)

export function PerspectiveBook({
  coverSrc,
  className,
  hovering = false,
  children,
}: {
  coverSrc?: string
  className?: string
  hovering?: boolean
  children?: ReactNode
}) {
  const [time, setTime] = useState(0)
  const [running, setRunning] = useState(false)
  const rafRef = useRef<number>(0)
  const lastRef = useRef<number | null>(null)
  const wantsLoopRef = useRef(false)

  useEffect(() => {
    if (hovering) {
      wantsLoopRef.current = true
      setRunning(true)
    } else {
      wantsLoopRef.current = false
    }
  }, [hovering])

  useEffect(() => {
    if (!running) {
      lastRef.current = null
      return
    }
    const step = (ts: number) => {
      if (lastRef.current == null) lastRef.current = ts
      const dt = Math.min((ts - lastRef.current) / 1000, 0.1)
      lastRef.current = ts
      setTime(prev => {
        const next = prev + dt
        if (next >= DURATION) {
          if (wantsLoopRef.current) return next % DURATION
          setRunning(false)
          return 0
        }
        return next
      })
      rafRef.current = requestAnimationFrame(step)
    }
    rafRef.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(rafRef.current)
  }, [running])

  const spin = spinFn(time)
  const coverY = coverFn(time)
  const page1 = page1Fn(time)
  const page2 = page2Fn(time)
  const page3 = page3Fn(time)
  const shift = shiftFn(time)

  const pageOpacity = (deg: number) => deg < -90 ? 0 : 1

  return (
    <div className={cn("perspective-book", className)}>
      <div className="book-inner" style={{
        transform: `rotateY(${20 + spin}deg) rotateX(4deg) translateX(${shift}px)`,
      }}>
        <div className="book-spine" />
        <div className="book-page" style={{ zIndex: 1, transform: `rotateY(${page3}deg)`, opacity: pageOpacity(page3) }} />
        <div className="book-page" style={{ zIndex: 2, transform: `rotateY(${page2}deg)`, opacity: pageOpacity(page2) }} />
        <div className="book-page" style={{ zIndex: 3, transform: `rotateY(${page1}deg)`, opacity: pageOpacity(page1) }} />
        <div className="book-cover" style={{ transform: `rotateY(${coverY}deg)` }}>
          {coverSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={coverSrc}
              alt=""
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "2px 6px 6px 2px",
                pointerEvents: "none",
              }}
            />
          ) : null}
          {children && (
            <div className="book-content" style={{ opacity: clamp(1 - Math.abs(coverY) / 60, 0, 1) }}>
              {children}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
