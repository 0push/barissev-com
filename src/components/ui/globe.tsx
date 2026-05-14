"use client"

import { useEffect, useRef, type ReactNode } from "react"
import createGlobe, { type COBEOptions } from "cobe"
import { useMotionValue, useSpring } from "motion/react"

import { cn } from "@/lib/utils"

const MOVEMENT_DAMPING = 1400

const GLOBE_CONFIG: COBEOptions = {
  width: 800,
  height: 800,
  devicePixelRatio: 2,
  phi: 0,
  theta: 0.3,
  dark: 0,
  diffuse: 0.4,
  mapSamples: 16000,
  mapBrightness: 1.2,
  baseColor: [1, 1, 1],
  markerColor: [251 / 255, 100 / 255, 21 / 255],
  glowColor: [1, 1, 1],
  markers: [
    { location: [14.5995, 120.9842], size: 0.03 },
    { location: [19.076, 72.8777], size: 0.1 },
    { location: [23.8103, 90.4125], size: 0.05 },
    { location: [30.0444, 31.2357], size: 0.07 },
    { location: [39.9042, 116.4074], size: 0.08 },
    { location: [-23.5505, -46.6333], size: 0.1 },
    { location: [19.4326, -99.1332], size: 0.1 },
    { location: [40.7128, -74.006], size: 0.1 },
    { location: [34.6937, 135.5022], size: 0.05 },
    { location: [41.0082, 28.9784], size: 0.06 },
  ],
}

export function Globe({
  className,
  canvasClassName,
  config = GLOBE_CONFIG,
  autoRotate = true,
  interactive = true,
  children,
}: {
  className?: string
  canvasClassName?: string
  config?: COBEOptions
  autoRotate?: boolean
  interactive?: boolean
  children?: ReactNode
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const phiRef = useRef(config.phi ?? 0)
  const widthRef = useRef(0)
  const pointerInteracting = useRef<number | null>(null)
  const autoRotateRef = useRef(autoRotate)
  autoRotateRef.current = autoRotate

  const r = useMotionValue(0)
  const rs = useSpring(r, { mass: 1, damping: 30, stiffness: 100 })

  const updatePointerInteraction = (value: number | null) => {
    pointerInteracting.current = value
    if (canvasRef.current) {
      canvasRef.current.style.cursor = value !== null ? "grabbing" : "grab"
    }
  }

  const updateMovement = (clientX: number) => {
    if (pointerInteracting.current !== null) {
      const delta = clientX - pointerInteracting.current
      r.set(r.get() + delta / MOVEMENT_DAMPING)
    }
  }

  useEffect(() => {
    const onResize = () => {
      if (canvasRef.current) {
        widthRef.current = canvasRef.current.offsetWidth
      }
    }
    window.addEventListener("resize", onResize)
    onResize()

    const globe = createGlobe(canvasRef.current!, {
      ...config,
      width: widthRef.current * 2,
      height: widthRef.current * 2,
    })

    let rafId: number
    let tick = 0
    const animate = () => {
      if (autoRotateRef.current && !pointerInteracting.current) {
        phiRef.current += 0.005
      }
      tick++
      // Gentle sway: ±0.12 radians over ~8s cycle
      const sway = Math.sin(tick * 0.005) * 0.12
      globe.update({
        phi: phiRef.current + rs.get() + sway,
        width: widthRef.current * 2,
        height: widthRef.current * 2,
      })
      rafId = requestAnimationFrame(animate)
    }
    animate()

    setTimeout(() => { if (canvasRef.current) canvasRef.current.style.opacity = "1" }, 0)

    return () => {
      cancelAnimationFrame(rafId)
      globe.destroy()
      window.removeEventListener("resize", onResize)
    }
  // config is defined outside components as a const — stable reference, runs once
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rs, config])

  return (
    <div
      className={cn(
        "absolute inset-0 mx-auto aspect-square w-full max-w-150",
        className
      )}
    >
      <canvas
        className={cn(
          "size-full opacity-0 transition-opacity duration-500 contain-[layout_paint_size]",
          canvasClassName
        )}
        ref={canvasRef}
        style={{ cursor: interactive ? undefined : "default" }}
        onPointerDown={interactive ? (e) => {
          pointerInteracting.current = e.clientX
          updatePointerInteraction(e.clientX)
        } : undefined}
        onPointerUp={interactive ? () => updatePointerInteraction(null) : undefined}
        onPointerOut={interactive ? () => updatePointerInteraction(null) : undefined}
        onMouseMove={interactive ? (e) => updateMovement(e.clientX) : undefined}
        onTouchMove={interactive ? (e) =>
          e.touches[0] && updateMovement(e.touches[0].clientX) : undefined
        }
      />
      {children}
    </div>
  )
}
