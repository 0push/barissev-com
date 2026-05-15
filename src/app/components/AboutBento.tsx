"use client"

import { cn } from "@/lib/utils"
import MusicChip from "./MusicChip"
import { Globe } from "@/components/ui/globe"
import { PerspectiveBook } from "@/components/ui/perspective-book"
import { type COBEOptions } from "cobe"
import { type ReactNode, useState } from "react"
import LifeTimeline from "./LifeTimeline"

function Card({ className, children, style }: { className?: string; children: ReactNode; style?: React.CSSProperties }) {
  return (
    <div
      className={cn("relative overflow-hidden rounded-[18px] bg-[var(--card)] border border-[rgba(0,0,0,0.08)]", className)}
      style={style}
    >
      {children}
    </div>
  )
}

// Coordinates
const NL: [number, number] = [52.3676,  4.9041]   // Amsterdam
const TR: [number, number] = [41.0082, 28.9784]   // Istanbul
const HU: [number, number] = [47.4979, 19.0402]   // Budapest

const GLOBE_CONFIG: COBEOptions = {
  width: 800,
  height: 800,
  devicePixelRatio: 2,
  phi: -1.78,
  theta: 0.50,
  dark: 0,
  diffuse: 1.8,
  mapSamples: 16000,
  mapBrightness: 2.5,
  baseColor:   [0.28, 0.52, 0.90] as [number, number, number],
  markerColor: [0.72, 0.72, 0.74] as [number, number, number],
  glowColor:   [0.75, 0.86, 1.0]  as [number, number, number],
  markers: [
    // Outer dots
    { location: NL, size: 0.050, id: "nl" },
    { location: TR, size: 0.060, id: "tr", color: [0.20, 0.82, 0.38] as [number, number, number] },
    { location: HU, size: 0.050, id: "hu" },
    // Inner lighter highlight dots
    { location: NL, size: 0.022, color: [0.90, 0.90, 0.92] as [number, number, number] },
    { location: TR, size: 0.022, color: [0.90, 0.90, 0.92] as [number, number, number] },
    { location: HU, size: 0.022, color: [0.90, 0.90, 0.92] as [number, number, number] },
  ],
  arcs: [
    { from: TR, to: HU },
    { from: HU, to: NL },
  ],
  arcColor:  [0.55, 0.75, 0.98] as [number, number, number],
  arcWidth:  0.6,
  arcHeight: 0.7,
}

const GLOBE_LABELS = [
  { id: "nl", label: "NL" },
  { id: "tr", label: "TR" },
  { id: "hu", label: "HU" },
]

function BookCard() {
  const [hovered, setHovered] = useState(false)
  return (
    <Card
      style={{ gridColumn: "3 / span 2", gridRow: "3 / span 3" }}
      className="flex flex-col items-center justify-center"
    >
      <div
        style={{ position: "absolute", inset: 0 }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/uploads/goodreads.svg"
        alt="Goodreads"
        style={{
          position: "absolute",
          top: 14,
          right: 14,
          width: 20,
          height: 20,
          zIndex: 3,
          pointerEvents: "none",
          opacity: 0.5,
        }}
      />
      <PerspectiveBook coverSrc="/uploads/sisyphus.jpg" hovering={hovered}>
        <p style={{ fontFamily: "var(--display)", fontSize: "11px", fontWeight: 600, textAlign: "center", lineHeight: 1.3, color: "#fff" }}>
          The Myth of Sisyphus
        </p>
        <p style={{ fontFamily: "var(--body)", fontSize: "9px", fontWeight: 400, color: "rgba(255,255,255,0.7)", marginTop: 4 }}>
          Albert Camus
        </p>
      </PerspectiveBook>
      <a href="https://goodreads.com/barissev" target="_blank" rel="noopener noreferrer" style={{ fontFamily: "var(--display)", fontSize: "12px", fontWeight: 500, letterSpacing: "-0.01em", color: "var(--t2)", marginTop: 10, textDecoration: "none" }}>
        See my shelf ↗
      </a>
    </Card>
  )
}

export default function AboutBento() {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(6, 1fr)",
      gridTemplateRows: "repeat(7, 1fr)",
      gap: "12px",
      height: "520px",
    }}>

      {/* div1 — bio, 4×2 */}
      <Card style={{ gridColumn: "span 4", gridRow: "span 2" }}
        className="flex items-center justify-center p-6">
        <p style={{ fontFamily: "var(--display)", fontSize: "clamp(28px, 3.5vw, 42px)", fontWeight: 300, letterSpacing: "-0.03em", color: "var(--text)", lineHeight: 1.1, textAlign: "center" }}>
          <span style={{ fontVariantNumeric: "tabular-nums", fontWeight: 500 }}>3.5</span>
          <span style={{ fontSize: "0.5em", fontWeight: 400, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--t3)", verticalAlign: "super", marginLeft: 2 }}>+</span>
          <span style={{ color: "var(--t2)", fontWeight: 300 }}> years of experience</span>
        </p>
      </Card>

      {/* div3 — globe, 2 cols × 7 rows (full height right) */}
      <Card style={{ gridColumn: "5 / span 2", gridRow: "1 / span 7" }}
        className="group/globe flex flex-col">
        {/* Header — default state */}
        <div className="globe-default-header" style={{ padding: "20px 20px 0", zIndex: 2, position: "relative", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "22px" }}>
          <p style={{ fontFamily: "var(--display)", fontSize: "15px", fontWeight: 500, letterSpacing: "-0.02em", color: "var(--text)" }}>
            Current Location
          </p>
          <svg width="14" height="20" viewBox="0 0 12 20" fill="none" style={{ color: "var(--t3)", flexShrink: 0 }}>
            <path d="M6 1v16M2.5 13.5 6 17l3.5-3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span style={{ display: "flex", alignItems: "center", gap: "7px" }}>
            <span className="globe-blip" style={{ width: 7, height: 7, borderRadius: "50%", background: "#34C759", flexShrink: 0 }} />
            <p style={{ fontFamily: "var(--display)", fontSize: "16px", fontWeight: 400, letterSpacing: "-0.02em", color: "var(--t2)", margin: 0 }}>
              Istanbul, TR
            </p>
          </span>
        </div>
        {/* Blue fill overlay — sits above globe */}
        <div className="globe-hover-bg" />
        {/* Header — hover timeline (above blue fill) */}
        <div className="globe-hover-header" style={{ position: "absolute", top: 0, left: 0, right: 0, padding: "22px 16px 0", zIndex: 12, display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
          <div style={{ textAlign: "center" }}>
            <p style={{ fontFamily: "var(--display)", fontSize: "17px", fontWeight: 700, letterSpacing: "-0.02em", color: "#fff", margin: 0 }}>
              🇹🇷 Turkey
            </p>
            <p style={{ fontFamily: "var(--body)", fontSize: "11px", fontWeight: 400, color: "rgba(255,255,255,0.65)", margin: "3px 0 0" }}>
              Born & Raised
            </p>
          </div>
          <svg width="10" height="16" viewBox="0 0 10 16" fill="none" style={{ color: "rgba(255,255,255,0.35)" }}>
            <path d="M5 1v12M2.5 10 5 13l2.5-3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <div style={{ textAlign: "center" }}>
            <p style={{ fontFamily: "var(--display)", fontSize: "17px", fontWeight: 700, letterSpacing: "-0.02em", color: "#fff", margin: 0 }}>
              🇭🇺 Hungary
            </p>
            <p style={{ fontFamily: "var(--body)", fontSize: "11px", fontWeight: 400, color: "rgba(255,255,255,0.65)", margin: "3px 0 0" }}>
              Studied & Worked
            </p>
          </div>
          <svg width="10" height="16" viewBox="0 0 10 16" fill="none" style={{ color: "rgba(255,255,255,0.35)" }}>
            <path d="M5 1v12M2.5 10 5 13l2.5-3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <div style={{ textAlign: "center" }}>
            <p style={{ fontFamily: "var(--display)", fontSize: "17px", fontWeight: 700, letterSpacing: "-0.02em", color: "#fff", margin: 0 }}>
              🇳🇱 Netherlands
            </p>
            <p style={{ fontFamily: "var(--body)", fontSize: "11px", fontWeight: 400, color: "rgba(255,255,255,0.65)", margin: "3px 0 0" }}>
              Moving to
            </p>
          </div>
        </div>
        {/* Globe fills the middle */}
        <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
          <div style={{
            position: "absolute",
            bottom: "-20%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "210%",
            aspectRatio: "1",
          }}>
            <Globe config={GLOBE_CONFIG} className="!absolute !inset-0 !w-full !max-w-none" autoRotate={false} interactive={false}>
              {GLOBE_LABELS.map(({ id, label }) => (
                <div
                  key={id}
                  style={{
                    position: "absolute",
                    // CSS Anchor Positioning (Chrome 125+)
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    positionAnchor: `--cobe-${id}` as any,
                    bottom: "anchor(top)" as any,
                    left: "anchor(center)" as any,
                    translate: "-50% 0",
                    marginBottom: "6px",
                    opacity: `var(--cobe-visible-${id}, 0)`,
                    transition: "opacity 0.3s",
                    pointerEvents: "none",
                    // Fallback position (browsers without anchor positioning)
                    zIndex: 10,
                  } as React.CSSProperties}
                >
                  <span style={{
                    display: "inline-block",
                    fontFamily: "var(--body)",
                    fontSize: "8px",
                    fontWeight: 600,
                    letterSpacing: "0.10em",
                    textTransform: "uppercase",
                    color: "var(--text)",
                    background: "var(--card)",
                    border: "1px solid rgba(0,0,0,0.10)",
                    borderRadius: "4px",
                    padding: "2px 5px",
                    whiteSpace: "nowrap",
                  }}>
                    {label}
                  </span>
                </div>
              ))}
            </Globe>
          </div>
        </div>
      </Card>

      {/* div4 — Now Playing */}
      <div className="music-card" style={{
        gridColumn: "span 2",
        gridRow: "3 / span 3",
        position: "relative",
        overflow: "hidden",
        borderRadius: 18,
        background: "var(--card)",
        border: "1px solid rgba(0,0,0,0.08)",
        display: "grid",
        placeItems: "center",
      }}>
        {/* Apple Music logo — top right */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/uploads/apple-music.svg"
          alt="Apple Music"
          style={{
            position: "absolute",
            top: 14,
            right: 14,
            width: 22,
            height: 22,
            zIndex: 3,
            pointerEvents: "none",
          }}
        />
        {/* Disc + Song info wrapper */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <MusicChip />
          <div style={{ marginTop: 10, textAlign: "center" }}>
            <p style={{ fontFamily: "var(--display)", fontSize: "13px", fontWeight: 500, letterSpacing: "-0.01em", color: "var(--text)", margin: 0, lineHeight: 1.3 }}>
              Dust It Off
            </p>
            <p style={{ fontFamily: "var(--body)", fontSize: "11px", fontWeight: 400, color: "var(--t3)", margin: 0, marginTop: 2 }}>
              The Dø
            </p>
          </div>
        </div>
        {/* Hover overlay — fills from top-right corner */}
        <div className="music-hover-bg" />
        <div className="music-hover-content">
          <a href="https://music.apple.com/hu/playlist/chew-chew/pl.u-leyl1BRcjLBkJrv" target="_blank" rel="noopener noreferrer" style={{ fontFamily: "var(--display)", fontSize: "13px", fontWeight: 500, letterSpacing: "-0.01em", color: "#fff", margin: 0, textAlign: "center", lineHeight: 1.4, padding: "0 20px", textDecoration: "none" }}>
            My Playlist ↗
          </a>
        </div>
      </div>

      {/* div5 — currently reading */}
      <BookCard />

      {/* div6 — life timeline, 4×2 */}
      <Card style={{ gridColumn: "span 4", gridRow: "6 / span 2" }}>
        <LifeTimeline />
      </Card>

    </div>
  )
}
