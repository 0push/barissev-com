"use client"

import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { useReducedMotion } from "motion/react"

const VIEW_W = 700
const VIEW_H = 330
const WORLD_MIN_X = -140
const WORLD_MAX_X = 900
const WORLD_MIN_Y = 0
const WORLD_MAX_Y = 1240
const MAIN_DURATION = 12
const RETURN_DURATION = 1.55
const RETURN_TRAIL_LENGTH = 155
const GREEN = "#34C759"

const MILESTONES = [
  { x: 72, y: 978, label: "Born" },
  { x: 176, y: 752, label: "Moved to Budapest to Study" },
  { x: 292, y: 548, label: "Graduated" },
  { x: 414, y: 342, label: "Started to Work." },
  { x: 548, y: 126, label: "Moving to Netherlands." },
]

type TimelinePoint = {
  x: number
  y: number
}

function buildMainPath() {
  const [first, ...rest] = MILESTONES
  let d = `M ${first.x} ${first.y}`

  rest.forEach((next, index) => {
    const prev = MILESTONES[index]
    const lift = Math.abs(prev.y - next.y) * 0.48
    d += ` C ${prev.x + 62} ${prev.y - lift} ${next.x - 72} ${next.y + lift} ${next.x} ${next.y}`
  })

  return d
}

function buildMotionPath() {
  return `${buildMainPath()}
    C 624 106 624 172 558 186
    C 498 198 506 106 588 132
    C 662 164 548 486 -34 1064
    C -8 1024 40 998 ${MILESTONES[0].x} ${MILESTONES[0].y}
  `
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value))
}

function smoothstep(value: number) {
  return value * value * (3 - 2 * value)
}

function findPathOffset(path: SVGPathElement, target: TimelinePoint, start: number, end: number) {
  const steps = 320
  let bestOffset = start
  let bestDistance = Number.POSITIVE_INFINITY

  for (let i = 0; i <= steps; i++) {
    const offset = start + ((end - start) * i) / steps
    const point = path.getPointAtLength(offset)
    const distance = (point.x - target.x) ** 2 + (point.y - target.y) ** 2

    if (distance < bestDistance) {
      bestDistance = distance
      bestOffset = offset
    }
  }

  return bestOffset
}

const MAIN_PATH_D = buildMainPath()
const MOTION_PATH_D = buildMotionPath()

export default function LifeTimeline() {
  const prefersReducedMotion = useReducedMotion()
  const [motionPathLen, setMotionPathLen] = useState(0)
  const [mainPathLen, setMainPathLen] = useState(0)
  const [milestoneOffsets, setMilestoneOffsets] = useState<number[]>([])
  const [distance, setDistance] = useState(0)
  const [point, setPoint] = useState<TimelinePoint>(MILESTONES[0])
  const rafRef = useRef<number>(0)
  const lastRef = useRef<number | null>(null)
  const elapsedRef = useRef(0)
  const motionPathRef = useRef<SVGPathElement>(null)
  const mainPathRef = useRef<SVGPathElement>(null)

  useLayoutEffect(() => {
    const motionPath = motionPathRef.current
    const mainPath = mainPathRef.current
    if (!motionPath || !mainPath) return

    const motionLength = motionPath.getTotalLength()
    const mainLength = mainPath.getTotalLength()
    let searchStart = 0
    const offsets = MILESTONES.map((milestone, index) => {
      if (index === 0) return 0

      const offset = findPathOffset(motionPath, milestone, searchStart, motionLength)
      searchStart = offset
      return offset
    })

    setMotionPathLen(motionLength)
    setMainPathLen(mainLength)
    setMilestoneOffsets(offsets)
    setDistance(prefersReducedMotion ? offsets[offsets.length - 1] : 0)
    setPoint(motionPath.getPointAtLength(prefersReducedMotion ? offsets[offsets.length - 1] : 0))
  }, [prefersReducedMotion])

  useEffect(() => {
    if (
      prefersReducedMotion ||
      motionPathLen <= 0 ||
      mainPathLen <= 0 ||
      milestoneOffsets.length < MILESTONES.length
    ) return

    const lastMilestoneOffset = milestoneOffsets[milestoneOffsets.length - 1]
    const returnLength = motionPathLen - lastMilestoneOffset
    const loopDuration = MAIN_DURATION + RETURN_DURATION

    const step = (timestamp: number) => {
      if (lastRef.current == null) lastRef.current = timestamp
      const delta = Math.min((timestamp - lastRef.current) / 1000, 0.08)
      lastRef.current = timestamp
      elapsedRef.current = (elapsedRef.current + delta) % loopDuration

      const motionPath = motionPathRef.current
      if (motionPath) {
        const nextDistance =
          elapsedRef.current <= MAIN_DURATION
            ? (elapsedRef.current / MAIN_DURATION) * lastMilestoneOffset
            : lastMilestoneOffset +
              ((elapsedRef.current - MAIN_DURATION) / RETURN_DURATION) * returnLength

        setDistance(nextDistance)
        setPoint(motionPath.getPointAtLength(nextDistance))
      }

      rafRef.current = requestAnimationFrame(step)
    }

    rafRef.current = requestAnimationFrame(step)

    return () => {
      cancelAnimationFrame(rafRef.current)
      lastRef.current = null
    }
  }, [mainPathLen, milestoneOffsets, motionPathLen, prefersReducedMotion])

  const lastMilestoneOffset = milestoneOffsets[milestoneOffsets.length - 1] ?? mainPathLen
  const returnLength = Math.max(motionPathLen - lastMilestoneOffset, 1)
  const mainProgress = lastMilestoneOffset > 0 ? clamp(distance / lastMilestoneOffset, 0, 1) : 0
  const isReturning = distance > lastMilestoneOffset
  const returnProgress = isReturning ? clamp((distance - lastMilestoneOffset) / returnLength, 0, 1) : 0
  const zoomProgress = isReturning ? 1 - smoothstep(returnProgress) : smoothstep(mainProgress)
  const zoom = prefersReducedMotion ? 1 : 1 + zoomProgress * 0.14
  const viewW = VIEW_W / zoom
  const viewH = VIEW_H / zoom
  const viewX = clamp(point.x - viewW * 0.23, WORLD_MIN_X, WORLD_MAX_X - viewW)
  const viewY = clamp(point.y - viewH * 0.58, WORLD_MIN_Y, WORLD_MAX_Y - viewH)
  const mainDistance = Math.min(distance, lastMilestoneOffset)
  const dashOffset = mainPathLen > 0 ? mainPathLen - mainDistance : 0
  const trailLength = Math.min(RETURN_TRAIL_LENGTH, returnLength)
  const returnTrailOffset = -(distance - trailLength)

  return (
    <div
      aria-label="Life timeline"
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        borderRadius: "inherit",
        background: "var(--card)",
      }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox={`${viewX} ${viewY} ${viewW} ${viewH}`}
        preserveAspectRatio="xMidYMid slice"
        style={{ display: "block" }}
      >
        <defs>
          <filter id="timeline-soft-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <path
          d={MAIN_PATH_D}
          fill="none"
          stroke="oklch(72% 0.008 245 / 0.36)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeDasharray="4 9"
          opacity={isReturning ? 0 : 1}
        />
        <path
          d={MAIN_PATH_D}
          fill="none"
          stroke={GREEN}
          strokeWidth="13"
          strokeLinecap="round"
          strokeDasharray={mainPathLen || 1}
          strokeDashoffset={dashOffset}
          filter="url(#timeline-soft-glow)"
          opacity={isReturning ? 0 : 0.1}
        />
        <path
          ref={mainPathRef}
          d={MAIN_PATH_D}
          fill="none"
          stroke={GREEN}
          strokeWidth="4.2"
          strokeLinecap="round"
          strokeDasharray={mainPathLen || 1}
          strokeDashoffset={dashOffset}
          opacity={isReturning ? 0 : 1}
        />
        <path
          ref={motionPathRef}
          d={MOTION_PATH_D}
          fill="none"
          stroke="transparent"
          strokeWidth="1"
          opacity="0"
        />
        <path
          d={MOTION_PATH_D}
          fill="none"
          stroke={GREEN}
          strokeWidth="4.2"
          strokeLinecap="round"
          strokeDasharray={`${trailLength} ${motionPathLen || 1}`}
          strokeDashoffset={returnTrailOffset}
          opacity={isReturning ? 1 : 0}
        />

        {!isReturning && MILESTONES.map((milestone, index) => {
          const offset = milestoneOffsets[index] ?? 0
          const distanceAfterReveal = distance - Math.max(offset - 95, 0)
          const distanceAfterReach = distance - offset
          const textOpacity = clamp(distanceAfterReveal / 105, 0, 1)
          const dotOpacity = index === 0 ? 1 : clamp(distanceAfterReach / 16, 0, 1)
          const labelX = milestone.x + 22 + (1 - textOpacity) * 14
          const pulse = !prefersReducedMotion && distanceAfterReach > 0 && distanceAfterReach < 28

          return (
            <g key={milestone.label}>
              {pulse && (
                <circle
                  cx={milestone.x}
                  cy={milestone.y}
                  r={9 + distanceAfterReach * 0.65}
                  fill="none"
                  stroke={GREEN}
                  strokeWidth="1.5"
                  opacity={(1 - distanceAfterReach / 28) * 0.38}
                />
              )}
              <circle
                cx={milestone.x}
                cy={milestone.y}
                r="7"
                fill="oklch(99% 0.003 238)"
                stroke={GREEN}
                strokeWidth="2.4"
                opacity={dotOpacity}
              />
              <circle
                cx={milestone.x}
                cy={milestone.y}
                r="2.5"
                fill={GREEN}
                opacity={dotOpacity}
              />
              <text
                x={labelX}
                y={milestone.y - 3}
                fill="var(--text)"
                fontFamily="var(--display)"
                fontSize="17"
                fontWeight="500"
                letterSpacing="0"
                opacity={textOpacity}
              >
                {milestone.label}
              </text>
              <line
                x1={milestone.x + 11}
                y1={milestone.y}
                x2={milestone.x + 17}
                y2={milestone.y}
                stroke={GREEN}
                strokeWidth="1.4"
                strokeLinecap="round"
                opacity={textOpacity * 0.75}
              />
            </g>
          )
        })}

        <circle cx={point.x} cy={point.y} r="10" fill={GREEN} opacity="0.13" />
        <circle cx={point.x} cy={point.y} r="4.4" fill={GREEN} opacity="1" />
      </svg>
    </div>
  )
}
