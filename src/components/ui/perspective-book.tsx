"use client"

import { type ReactNode, useState, useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

const easeOutCubic = (t: number) => { const u = t - 1; return u * u * u + 1 }
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

const DURATION = 6
const linear = (t: number) => t

const coverFn = interpolate(
  [0, 0.8, 1.4, 4.5, 5.2, 6.0],
  [0, 0, -160, -160, 0, 0],
  [linear, easeOutCubic, linear, linear, easeOutCubic],
)
const page1Fn = interpolate(
  [1.6, 2.2, 3.8, 4.3],
  [0, -170, -170, 0],
  [easeOutCubic, linear, easeOutCubic],
)
const page2Fn = interpolate(
  [1.9, 2.5, 3.5, 4.0],
  [0, -170, -170, 0],
  [easeOutCubic, linear, easeOutCubic],
)
const page3Fn = interpolate(
  [2.2, 2.8, 3.2, 3.7],
  [0, -170, -170, 0],
  [easeOutCubic, linear, easeOutCubic],
)

export function PerspectiveBook({
  coverSrc,
  className,
  children,
}: {
  coverSrc?: string
  className?: string
  children?: ReactNode
}) {
  const [time, setTime] = useState(0)
  const rafRef = useRef<number>(0)
  const lastRef = useRef<number | null>(null)

  useEffect(() => {
    const step = (ts: number) => {
      if (lastRef.current == null) lastRef.current = ts
      const dt = Math.min((ts - lastRef.current) / 1000, 0.1)
      lastRef.current = ts
      setTime(t => {
        const next = t + dt
        return next >= DURATION ? next % DURATION : next
      })
      rafRef.current = requestAnimationFrame(step)
    }
    rafRef.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  const coverY = coverFn(time)
  const page1 = page1Fn(time)
  const page2 = page2Fn(time)
  const page3 = page3Fn(time)

  return (
    <div className={cn("perspective-book", className)}>
      <div className="book-inner">
        <div className="book-spine" />
        <div className="book-page" style={{ zIndex: 1, transform: `rotateY(${page3}deg)` }} />
        <div className="book-page" style={{ zIndex: 2, transform: `rotateY(${page2}deg)` }} />
        <div className="book-page" style={{ zIndex: 3, transform: `rotateY(${page1}deg)` }} />
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
