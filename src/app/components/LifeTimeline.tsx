"use client"

import React, { useState, useEffect, useRef, useContext, createContext } from "react"

// ── Local timeline context (self-contained, no Stage dependency) ─────────────
const TimeCtx = createContext(0)
const useTime = () => useContext(TimeCtx)

// ── Easing & helpers ────────────────────────────────────────────────────────
const Easing = {
  easeOutQuad: (t: number) => t * (2 - t),
  easeInOutSine: (t: number) => -(Math.cos(Math.PI * t) - 1) / 2,
}

function clamp(v: number, lo: number, hi: number) { return Math.max(lo, Math.min(hi, v)) }

function interpolate(input: number[], output: number[]) {
  return (t: number) => {
    if (t <= input[0]) return output[0]
    if (t >= input[input.length - 1]) return output[output.length - 1]
    for (let i = 0; i < input.length - 1; i++) {
      if (t >= input[i] && t <= input[i + 1]) {
        const span = input[i + 1] - input[i]
        const local = span === 0 ? 0 : (t - input[i]) / span
        return output[i] + (output[i + 1] - output[i]) * local
      }
    }
    return output[output.length - 1]
  }
}

// ── Constants ───────────────────────────────────────────────────────────────
const TOTAL_DURATION = 28
const CARD_W = 1220
const CARD_H = 380
const HORIZON_Y = 268
const INK = "#180e07"

const CHAPTERS = [
  { id: "istanbul", start: 0,  end: 5,  title: "ISTANBUL",   sub: "born — 1995" },
  { id: "budapest", start: 5,  end: 10, title: "BUDAPEST",   sub: "studies — 2013" },
  { id: "career",   start: 10, end: 15, title: "FIRST DAYS", sub: "career — 2018" },
  { id: "craft",    start: 15, end: 20, title: "THE CRAFT",  sub: "mastering — now" },
  { id: "home",     start: 20, end: 25, title: "HOME",       sub: "someday" },
]

// ── Color helpers ───────────────────────────────────────────────────────────
function parseHex(hex: string) {
  const h = hex.replace("#", "")
  return [parseInt(h.slice(0,2),16), parseInt(h.slice(2,4),16), parseInt(h.slice(4,6),16)]
}
function rgbStr([r,g,b]: number[]) { return `rgb(${r|0}, ${g|0}, ${b|0})` }
function lerpHex(time: number, keys: number[], hexes: string[]) {
  const rgbs = hexes.map(parseHex)
  const r = interpolate(keys, rgbs.map(c=>c[0]))(time)
  const g = interpolate(keys, rgbs.map(c=>c[1]))(time)
  const b = interpolate(keys, rgbs.map(c=>c[2]))(time)
  return [r,g,b]
}
function visWindow(t: number, start: number, end: number, fadeIn=0.7, fadeOut=0.7) {
  if (t < start - fadeIn || t > end + fadeOut) return 0
  if (t < start) return Math.max(0, (t - (start - fadeIn)) / fadeIn)
  if (t > end)   return Math.max(0, 1 - (t - end) / fadeOut)
  return 1
}

// ── Sky ─────────────────────────────────────────────────────────────────────
function Sky() {
  const t = useTime()
  const keys = [0,2.5,5,7.5,12.5,15,17.5,20,23,25.5,27,28]
  const tops = ["#f1c197","#f1c197","#e8b48c","#bccbe2","#d5dde8","#dec5a4","#dcb284","#a87a64","#3c3a58","#1b1428","#3a2a40","#f1c197"]
  const mids = ["#f8d2a6","#f8d2a6","#f0c4a0","#cbd9ea","#e1e1d8","#ecccac","#f1c089","#d59166","#604766","#22182f","#5a3a5a","#f8d2a6"]
  const bots = ["#fadcb6","#fadcb6","#f5cea8","#dbe5f0","#e9e4d8","#f1d6b8","#f4c388","#d8946a","#7a586e","#2a1d3a","#7a5066","#fadcb6"]
  const top = rgbStr(lerpHex(t, keys, tops))
  const mid = rgbStr(lerpHex(t, keys, mids))
  const bot = rgbStr(lerpHex(t, keys, bots))
  const horizonPct = (HORIZON_Y / CARD_H) * 100
  return <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to bottom, ${top} 0%, ${mid} ${horizonPct * 0.6}%, ${bot} ${horizonPct}%, ${bot} 100%)` }} />
}

// ── Stars ───────────────────────────────────────────────────────────────────
const STAR_FIELD = Array.from({length: 70}, (_, i) => ({
  x: (i * 137.508) % CARD_W,
  y: 12 + ((i * 73.31) % (HORIZON_Y - 36)),
  size: 0.8 + ((i * 17) % 5) * 0.45,
  o: ((i * 41) % 628) / 100,
}))

function ShootingStar() {
  const t = useTime()
  const start = 22.6, dur = 0.9
  if (t < start || t > start + dur) return null
  const p = (t - start) / dur
  const x = 240 + p * 520
  const y = 70 + p * 90
  const trail = 4 + 56 * Easing.easeOutQuad(p)
  const op = (p < 0.15 ? p / 0.15 : 1) * (p > 0.7 ? Math.max(0, (1 - (p - 0.7) / 0.3)) : 1)
  return <div style={{ position: "absolute", left: x - trail, top: y, width: trail, height: 1.4, background: "linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,246,220,0.9) 100%)", transform: "rotate(22deg)", transformOrigin: "right center", opacity: op, borderRadius: 1 }} />
}

function Stars() {
  const t = useTime()
  const op = clamp((t - 19) / 1.8, 0, 1) * clamp((27 - t) / 1.5, 0, 1)
  if (op < 0.01) return null
  return (
    <>
      {STAR_FIELD.map((s, i) => {
        const tw = 0.55 + 0.45 * Math.sin(t * 2.1 + s.o)
        return <div key={i} style={{ position: "absolute", left: s.x, top: s.y, width: s.size, height: s.size, borderRadius: "50%", background: "#fff6dc", opacity: op * tw, boxShadow: s.size > 1.6 ? "0 0 4px rgba(255,246,220,0.8)" : "none" }} />
      })}
      <ShootingStar />
    </>
  )
}

// ── Sun & Moon ──────────────────────────────────────────────────────────────
function SunMoon() {
  const t = useTime()
  function sunStateAt(tt: number) {
    const sP = clamp(tt / 20, 0, 1)
    const sunX = CARD_W * 0.86 - sP * (CARD_W * 0.74)
    const sunY = HORIZON_Y - 18 - Math.sin(sP * Math.PI) * 200
    const ttC = Math.max(0, Math.min(20, tt))
    const color = rgbStr(lerpHex(ttC, [0,3,8,14,18,20], ["#ffe0b8","#fff2d4","#fffaef","#ffeac0","#ffb070","#ed7038"]))
    const glow = rgbStr(lerpHex(ttC, [0,3,8,14,18,20], ["#ffa970","#ffce8c","#ffe5b8","#ffc888","#ff8a4a","#c84a20"]))
    const op = clamp((tt + 0.4) / 1.2, 0, 1) * clamp((20.4 - tt) / 1, 0, 1)
    const size = 48 + sP * 14
    return { sunX, sunY, color, glow, op, size }
  }
  const sA = sunStateAt(t)
  const sB = sunStateAt(t - TOTAL_DURATION)
  const sun = (sB.op > sA.op) ? sB : sA

  const mP = clamp((t - 20) / 6, 0, 1)
  const moonX = CARD_W - 140 - mP * (CARD_W * 0.55)
  const moonY = 110 + Math.cos(mP * Math.PI - 0.2) * 32
  const moonOp = clamp((t - 19.6) / 1, 0, 1) * clamp((26.6 - t) / 1.2, 0, 1)

  return (
    <>
      <div style={{ position: "absolute", left: sun.sunX - sun.size/2, top: sun.sunY - sun.size/2, width: sun.size, height: sun.size, borderRadius: "50%", background: sun.color, opacity: sun.op, boxShadow: `0 0 40px 12px ${sun.glow}cc, 0 0 90px 30px ${sun.glow}55` }} />
      <div style={{ position: "absolute", left: moonX - 17, top: moonY - 17, width: 34, height: 34, borderRadius: "50%", background: "radial-gradient(circle at 35% 35%, #f8f1dd, #d6c9a8)", opacity: moonOp, boxShadow: "0 0 22px 4px rgba(245,240,224,0.45), 0 0 60px 12px rgba(220,210,190,0.18)" }} />
    </>
  )
}

// ── Ground ──────────────────────────────────────────────────────────────────
function Ground() {
  const t = useTime()
  const c = lerpHex(t, [0,5,10,15,20,25,28], ["#9d7a5e","#897153","#998874","#7a6552","#6a4838","#1c1424","#9d7a5e"])
  const dark = [c[0]*0.5, c[1]*0.5, c[2]*0.5]
  return <div style={{ position: "absolute", left: 0, top: HORIZON_Y - 1, width: CARD_W, height: CARD_H - HORIZON_Y + 1, background: `linear-gradient(to bottom, ${rgbStr(c)} 0%, ${rgbStr(dark)} 100%)` }} />
}

// ── Chapter Layer ───────────────────────────────────────────────────────────
function ChapterLayer({ chap, children }: { chap: typeof CHAPTERS[0]; children: React.ReactNode }) {
  const t = useTime()
  let op = visWindow(t, chap.start, chap.end, 0.8, 0.8)
  let useT = t
  if (chap.start === 0) {
    const tw = t - TOTAL_DURATION
    const opW = visWindow(tw, chap.start, chap.end, 0.8, 0.8)
    if (opW > op) { op = opW; useT = tw }
  }
  if (op < 0.01) return null
  const localT = useT - chap.start
  const span = chap.end - chap.start
  const parallax = -10 * (localT / span)
  return <div style={{ position: "absolute", inset: 0, opacity: op, transform: `translateX(${parallax}px)`, willChange: "transform, opacity" }}>{children}</div>
}

// ── Captions ────────────────────────────────────────────────────────────────
function Captions() {
  const t = useTime()
  return (
    <>
      {CHAPTERS.map((ch) => {
        const mid = (ch.start + ch.end) / 2
        const o = visWindow(t, ch.start + 0.8, ch.end - 0.3, 0.6, 0.6)
        if (o < 0.01) return null
        return (
          <div key={ch.id} style={{ position: "absolute", left: 40, bottom: 20, opacity: o, pointerEvents: "none" }}>
            <p style={{ fontFamily: "var(--display)", fontSize: 18, fontWeight: 700, letterSpacing: "0.08em", color: "rgba(255,255,255,0.85)", margin: 0 }}>{ch.title}</p>
            <p style={{ fontFamily: "var(--body)", fontSize: 11, fontWeight: 400, letterSpacing: "0.04em", color: "rgba(255,255,255,0.5)", margin: "3px 0 0" }}>{ch.sub}</p>
          </div>
        )
      })}
    </>
  )
}

// ── Scene SVGs ──────────────────────────────────────────────────────────────
function Minaret({ x, h, w = 4 }: { x: number; h: number; w?: number }) {
  return (
    <g>
      <rect x={x} y={HORIZON_Y - h} width={w} height={h} />
      <polygon points={`${x-1.5},${HORIZON_Y - h} ${x+w+1.5},${HORIZON_Y - h} ${x+w/2},${HORIZON_Y - h - 11}`} />
      <rect x={x-2} y={HORIZON_Y - h + 18} width={w+4} height={1.5} />
      <rect x={x-2} y={HORIZON_Y - h + 36} width={w+4} height={1.5} />
    </g>
  )
}

function Istanbul() {
  const deckY = HORIZON_Y - 28
  const topY  = HORIZON_Y - 148
  const lowY  = HORIZON_Y - 80
  const anchorL = 88, towerL = 478, towerR = 802, anchorR = 1132

  function cableY(x: number) {
    if (x <= anchorL || x >= anchorR) return deckY
    if (x < towerL) { const u = (x - anchorL) / (towerL - anchorL); return deckY + (topY - deckY) * (u * u) }
    if (x <= towerR) { const mid = (towerL + towerR) / 2; const half = (towerR - towerL) / 2; const u = (x - mid) / half; return topY + (lowY - topY) * (1 - u * u) }
    const u = (x - towerR) / (anchorR - towerR); return topY + (deckY - topY) * (u * u)
  }

  let cablePath = `M ${anchorL} ${deckY}`
  for (let x = anchorL + 6; x <= anchorR; x += 6) cablePath += ` L ${x} ${cableY(x)}`
  const suspenders: { x: number; y1: number; y2: number }[] = []
  for (let x = anchorL + 26; x < anchorR - 20; x += 20) {
    if (Math.abs(x - towerL) < 14 || Math.abs(x - towerR) < 14) continue
    const cY = cableY(x)
    if (cY < deckY - 3) suspenders.push({ x, y1: cY + 0.5, y2: deckY })
  }

  return (
    <svg width={CARD_W} height={CARD_H} viewBox={`0 0 ${CARD_W} ${CARD_H}`} style={{position:"absolute", inset:0}} preserveAspectRatio="none">
      <path d={`M 0 ${HORIZON_Y-3} Q 200 ${HORIZON_Y-22} 420 ${HORIZON_Y-6} Q 640 ${HORIZON_Y-20} 900 ${HORIZON_Y-4} Q 1080 ${HORIZON_Y-16} 1220 ${HORIZON_Y-6} L 1220 ${HORIZON_Y} L 0 ${HORIZON_Y} Z`} fill="#3a2418" opacity="0.42" />
      <g fill={INK} opacity="0.96">
        <rect x="24" y={HORIZON_Y-56} width="22" height="56" /><rect x="50" y={HORIZON_Y-84} width="18" height="84" /><rect x="72" y={HORIZON_Y-70} width="14" height="70" /><rect x="90" y={HORIZON_Y-110} width="22" height="110" /><rect x="114" y={HORIZON_Y-60} width="18" height="60" /><rect x="136" y={HORIZON_Y-96} width="20" height="96" /><rect x="160" y={HORIZON_Y-76} width="14" height="76" /><rect x="178" y={HORIZON_Y-54} width="20" height="54" />
        <rect x="204" y={HORIZON_Y-86} width="18" height="86" /><rect x="200" y={HORIZON_Y-92} width="26" height="6" /><path d={`M 204 ${HORIZON_Y-92} L 222 ${HORIZON_Y-92} L 213 ${HORIZON_Y-110} Z`} /><rect x="211" y={HORIZON_Y-122} width="4" height="12" /><polygon points={`209,${HORIZON_Y-122} 217,${HORIZON_Y-122} 213,${HORIZON_Y-130}`} />
        <rect x="234" y={HORIZON_Y-26} width="38" height="26" /><ellipse cx="253" cy={HORIZON_Y-26} rx="19" ry="13" /><Minaret x={231} h={66} w={3} /><Minaret x={272} h={66} w={3} />
        <rect x="284" y={HORIZON_Y-70} width="16" height="70" /><rect x="302" y={HORIZON_Y-100} width="22" height="100" /><rect x="326" y={HORIZON_Y-78} width="18" height="78" /><rect x="346" y={HORIZON_Y-60} width="20" height="60" /><rect x="368" y={HORIZON_Y-90} width="16" height="90" /><rect x="386" y={HORIZON_Y-70} width="24" height="70" /><rect x="412" y={HORIZON_Y-50} width="30" height="50" /><rect x="444" y={HORIZON_Y-40} width="28" height="40" />
        <rect x="830" y={HORIZON_Y-42} width="38" height="42" /><rect x="870" y={HORIZON_Y-62} width="16" height="62" /><rect x="888" y={HORIZON_Y-84} width="20" height="84" /><rect x="910" y={HORIZON_Y-60} width="16" height="60" /><rect x="928" y={HORIZON_Y-100} width="22" height="100" /><rect x="952" y={HORIZON_Y-70} width="18" height="70" /><rect x="972" y={HORIZON_Y-52} width="20" height="52" />
        <rect x="998" y={HORIZON_Y-168} width="6" height="168" /><ellipse cx="1001" cy={HORIZON_Y-138} rx="12" ry="6" /><ellipse cx="1001" cy={HORIZON_Y-124} rx="9" ry="4" /><rect x="1000" y={HORIZON_Y-200} width="2" height="32" />
        <rect x="1014" y={HORIZON_Y-78} width="18" height="78" /><rect x="1034" y={HORIZON_Y-56} width="20" height="56" /><rect x="1056" y={HORIZON_Y-92} width="16" height="92" /><rect x="1074" y={HORIZON_Y-68} width="22" height="68" /><rect x="1098" y={HORIZON_Y-50} width="18" height="50" /><rect x="1118" y={HORIZON_Y-80} width="20" height="80" /><rect x="1140" y={HORIZON_Y-60} width="16" height="60" /><rect x="1158" y={HORIZON_Y-44} width="22" height="44" /><rect x="1182" y={HORIZON_Y-64} width="18" height="64" /><rect x="1202" y={HORIZON_Y-38} width="18" height="38" />
        <rect x="473" y={HORIZON_Y-148} width="10" height="148" /><polygon points={`471,${HORIZON_Y-148} 485,${HORIZON_Y-148} 478,${HORIZON_Y-156}`} /><rect x="465" y={HORIZON_Y-138} width="26" height="4" /><rect x="465" y={HORIZON_Y-100} width="26" height="3" /><rect x="465" y={HORIZON_Y-60} width="26" height="3" />
        <rect x="797" y={HORIZON_Y-148} width="10" height="148" /><polygon points={`795,${HORIZON_Y-148} 809,${HORIZON_Y-148} 802,${HORIZON_Y-156}`} /><rect x="789" y={HORIZON_Y-138} width="26" height="4" /><rect x="789" y={HORIZON_Y-100} width="26" height="3" /><rect x="789" y={HORIZON_Y-60} width="26" height="3" />
        <rect x={anchorL} y={deckY} width={anchorR - anchorL} height="3.5" /><rect x={anchorL} y={deckY + 4} width={anchorR - anchorL} height="1.5" opacity="0.55" />
        <rect x={anchorL - 8} y={deckY - 4} width="14" height="10" /><rect x={anchorR - 6} y={deckY - 4} width="14" height="10" />
      </g>
      <path d={cablePath} stroke={INK} strokeWidth="1.6" fill="none" />
      <g stroke={INK} strokeWidth="0.75" opacity="0.82">{suspenders.map((s, i) => <line key={i} x1={s.x} y1={s.y1} x2={s.x} y2={s.y2} />)}</g>
      <rect x="0" y={HORIZON_Y} width={CARD_W} height="2" fill="#000" opacity="0.2" />
    </svg>
  )
}

function BirthGlow() {
  const t = useTime()
  function glowAt(tt: number) {
    if (tt < 0.8 || tt > 5.4) return null
    const localT = tt - 0.8, dur = 4.6, p = clamp(localT / dur, 0, 1)
    const x = 640, y = HORIZON_Y - 92 - p * 70
    const op = clamp(localT / 1.2, 0, 1) * clamp((dur - localT) / 1, 0, 1)
    const pulse = 1 + 0.08 * Math.sin(tt * 2.4)
    return { x, y, op, pulse }
  }
  const a = glowAt(t), b = glowAt(t - TOTAL_DURATION)
  const g = (b && b.op > (a ? a.op : 0)) ? b : a
  if (!g) return null
  return <div style={{ position: "absolute", left: g.x - 9, top: g.y - 9, width: 18, height: 18, borderRadius: "50%", background: "radial-gradient(circle, #fff8e0 0%, #ffd690 55%, transparent 78%)", opacity: g.op, transform: `scale(${g.pulse})`, boxShadow: "0 0 26px 9px rgba(255,220,160,0.5), 0 0 52px 18px rgba(255,200,140,0.2)" }} />
}

function Budapest() {
  return (
    <svg width={CARD_W} height={CARD_H} viewBox={`0 0 ${CARD_W} ${CARD_H}`} style={{position:"absolute", inset:0}} preserveAspectRatio="none">
      <rect x="0" y={HORIZON_Y} width={CARD_W} height="3" fill="#1a2030" opacity="0.5" />
      <g fill={INK} opacity="0.95">
        <rect x="540" y={HORIZON_Y-28} width="300" height="28" /><rect x="528" y={HORIZON_Y-36} width="324" height="8" />
        {[572, 612, 768, 808].map((sx, i) => <g key={i}><rect x={sx} y={HORIZON_Y-56} width="10" height="20" /><polygon points={`${sx-2},${HORIZON_Y-56} ${sx+12},${HORIZON_Y-56} ${sx+5},${HORIZON_Y-80}`} /></g>)}
        <rect x="666" y={HORIZON_Y-50} width="48" height="14" /><path d={`M 666 ${HORIZON_Y-50} Q 666 ${HORIZON_Y-84} 690 ${HORIZON_Y-84} Q 714 ${HORIZON_Y-84} 714 ${HORIZON_Y-50} Z`} />
        <rect x="688" y={HORIZON_Y-124} width="4" height="44" /><polygon points={`686,${HORIZON_Y-124} 694,${HORIZON_Y-124} 690,${HORIZON_Y-134}`} /><rect x="684" y={HORIZON_Y-88} width="12" height="4" />
        <rect x="890" y={HORIZON_Y-36} width="6" height="36" /><rect x="990" y={HORIZON_Y-36} width="6" height="36" />
        <polygon points={`890,${HORIZON_Y-36} 896,${HORIZON_Y-36} 893,${HORIZON_Y-46}`} /><polygon points={`990,${HORIZON_Y-36} 996,${HORIZON_Y-36} 993,${HORIZON_Y-46}`} />
      </g>
      <g stroke={INK} strokeWidth="1.3" fill="none" opacity="0.85">
        <path d={`M 880 ${HORIZON_Y} Q 943 ${HORIZON_Y-42} 1006 ${HORIZON_Y}`} /><path d={`M 880 ${HORIZON_Y} Q 943 ${HORIZON_Y-28} 1006 ${HORIZON_Y}`} opacity="0.6" />
        <line x1="880" y1={HORIZON_Y} x2="1006" y2={HORIZON_Y} />
      </g>
      <g fill={INK} opacity="0.95">
        <rect x="60" y={HORIZON_Y-22} width="80" height="22" /><polygon points={`60,${HORIZON_Y-22} 140,${HORIZON_Y-22} 128,${HORIZON_Y-36} 72,${HORIZON_Y-36}`} />
        <rect x="160" y={HORIZON_Y-28} width="100" height="28" /><polygon points={`160,${HORIZON_Y-28} 260,${HORIZON_Y-28} 245,${HORIZON_Y-44} 175,${HORIZON_Y-44}`} />
        <rect x="280" y={HORIZON_Y-24} width="120" height="24" /><polygon points={`280,${HORIZON_Y-24} 400,${HORIZON_Y-24} 386,${HORIZON_Y-38} 294,${HORIZON_Y-38}`} />
        <rect x="200" y={HORIZON_Y-50} width="3" height="14" /><rect x="115" y={HORIZON_Y-44} width="3" height="10" /><rect x="350" y={HORIZON_Y-48} width="3" height="12" />
        <rect x="1020" y={HORIZON_Y-20} width="90" height="20" /><rect x="1120" y={HORIZON_Y-28} width="80" height="28" /><polygon points={`1120,${HORIZON_Y-28} 1200,${HORIZON_Y-28} 1185,${HORIZON_Y-42} 1135,${HORIZON_Y-42}`} />
      </g>
      <g>{[[208, HORIZON_Y-30], [296, HORIZON_Y-22], [332, HORIZON_Y-22], [1056, HORIZON_Y-14]].map(([x,y], i) => <rect key={i} x={x} y={y} width="3" height="4" fill="#ffd989" opacity="0.85" />)}</g>
    </svg>
  )
}

const WINDOW_GRID = (() => {
  const g: { x: number; y: number; idx: number }[] = []
  let idx = 0
  for (let r = 0; r < 8; r++) for (let c = 0; c < 4; c++) g.push({ x: 392 + c*20, y: HORIZON_Y - 126 + r*15, idx: idx++ })
  for (let r = 0; r < 5; r++) for (let c = 0; c < 3; c++) g.push({ x: 498 + c*20, y: HORIZON_Y - 90 + r*15, idx: idx++ })
  for (let r = 0; r < 10; r++) for (let c = 0; c < 2; c++) g.push({ x: 590 + c*22, y: HORIZON_Y - 158 + r*15, idx: idx++ })
  for (let r = 0; r < 7; r++) for (let c = 0; c < 5; c++) g.push({ x: 668 + c*20, y: HORIZON_Y - 112 + r*15, idx: idx++ })
  for (let r = 0; r < 4; r++) for (let c = 0; c < 6; c++) g.push({ x: 796 + c*20, y: HORIZON_Y - 68 + r*15, idx: idx++ })
  for (let r = 0; r < 3; r++) for (let c = 0; c < 7; c++) g.push({ x: 944 + c*20, y: HORIZON_Y - 52 + r*14, idx: idx++ })
  return g
})()

function Career() {
  const t = useTime()
  const localT = t - 10
  return (
    <svg width={CARD_W} height={CARD_H} viewBox={`0 0 ${CARD_W} ${CARD_H}`} style={{position:"absolute", inset:0}} preserveAspectRatio="none">
      <g fill={INK} opacity="0.96">
        <rect x="380" y={HORIZON_Y-138} width="92" height="138" /><rect x="486" y={HORIZON_Y-100} width="80" height="100" /><rect x="580" y={HORIZON_Y-168} width="60" height="168" /><rect x="656" y={HORIZON_Y-122} width="116" height="122" /><rect x="786" y={HORIZON_Y-78} width="130" height="78" /><rect x="932" y={HORIZON_Y-60} width="160" height="60" />
        <rect x="396" y={HORIZON_Y-146} width="60" height="8" /><rect x="592" y={HORIZON_Y-176} width="36" height="8" />
        <rect x="50" y={HORIZON_Y-28} width="120" height="28" /><rect x="180" y={HORIZON_Y-36} width="80" height="36" /><rect x="270" y={HORIZON_Y-24} width="100" height="24" /><rect x="1100" y={HORIZON_Y-26} width="120" height="26" />
        <rect x="608" y={HORIZON_Y-188} width="2" height="14" />
      </g>
      <g fill="#ffd984">
        {WINDOW_GRID.map((w, i) => {
          const stagger = ((w.idx * 0.137) % 1) * 4
          let lit = 0
          if (localT > stagger) lit = Math.min(1, (localT - stagger) / 0.4)
          const flicker = 0.78 + 0.22 * Math.sin(t * 2.8 + w.idx * 0.4)
          return <rect key={i} x={w.x} y={w.y} width="6" height="7" opacity={lit * flicker * 0.92} />
        })}
      </g>
    </svg>
  )
}

function Craft() {
  const t = useTime()
  return (
    <svg width={CARD_W} height={CARD_H} viewBox={`0 0 ${CARD_W} ${CARD_H}`} style={{position:"absolute", inset:0}} preserveAspectRatio="none">
      <path d={`M 0 ${HORIZON_Y-3} Q 300 ${HORIZON_Y-26} 600 ${HORIZON_Y-10} Q 900 ${HORIZON_Y-22} 1220 ${HORIZON_Y-4} L 1220 ${HORIZON_Y} L 0 ${HORIZON_Y} Z`} fill="#7a4424" opacity="0.45" />
      <g fill={INK} opacity="0.95">
        <rect x="540" y={HORIZON_Y-70} width="180" height="70" /><polygon points={`530,${HORIZON_Y-70} 730,${HORIZON_Y-70} 630,${HORIZON_Y-110}`} /><rect x="668" y={HORIZON_Y-124} width="10" height="22" />
        <rect x="464" y={HORIZON_Y-22} width="56" height="22" /><rect x="450" y={HORIZON_Y-28} width="84" height="6" /><rect x="475" y={HORIZON_Y-56} width="3" height="28" /><rect x="468" y={HORIZON_Y-60} width="17" height="5" />
        <rect x="760" y={HORIZON_Y-56} width="3" height="56" /><circle cx="761.5" cy={HORIZON_Y-64} r="12" /><circle cx="753" cy={HORIZON_Y-58} r="9" /><circle cx="770" cy={HORIZON_Y-58} r="9" />
        <rect x="800" y={HORIZON_Y-48} width="3" height="48" /><circle cx="801.5" cy={HORIZON_Y-54} r="10" />
        <rect x="80" y={HORIZON_Y-14} width="60" height="14" /><rect x="150" y={HORIZON_Y-18} width="100" height="18" /><rect x="900" y={HORIZON_Y-14} width="60" height="14" /><rect x="980" y={HORIZON_Y-20} width="180" height="20" />
      </g>
      <ellipse cx="673" cy={HORIZON_Y-110} rx="44" ry="22" fill="#ffb060" opacity="0.18" /><ellipse cx="673" cy={HORIZON_Y-110} rx="20" ry="12" fill="#ffd690" opacity="0.35" />
      <g fill="#ffd07a">
        <rect x="556" y={HORIZON_Y-56} width="10" height="14" opacity={0.85 + 0.15 * Math.sin(t*2.6)} /><rect x="588" y={HORIZON_Y-56} width="10" height="14" opacity={0.85 + 0.15 * Math.sin(t*2.6+1)} />
        <rect x="660" y={HORIZON_Y-56} width="10" height="14" opacity={0.85 + 0.15 * Math.sin(t*2.6+2)} /><rect x="692" y={HORIZON_Y-56} width="10" height="14" opacity={0.85 + 0.15 * Math.sin(t*2.6+3)} />
      </g>
      {Array.from({length: 8}, (_, i) => {
        const phase = ((t * 0.6) + i * 0.4) % 1
        const sx = 673 + Math.sin(t * 1.2 + i) * 6, sy = HORIZON_Y - 110 - phase * 70
        return <circle key={i} cx={sx} cy={sy} r={1 + (1 - phase) * 0.4} fill="#ffd684" opacity={Math.max(0, 1 - phase) * 0.7} />
      })}
    </svg>
  )
}

function HomeScene() {
  const t = useTime()
  return (
    <svg width={CARD_W} height={CARD_H} viewBox={`0 0 ${CARD_W} ${CARD_H}`} style={{position:"absolute", inset:0}} preserveAspectRatio="none">
      <path d={`M 0 ${HORIZON_Y-6} Q 240 ${HORIZON_Y-28} 480 ${HORIZON_Y-10} Q 720 ${HORIZON_Y-32} 980 ${HORIZON_Y-8} Q 1100 ${HORIZON_Y-20} 1220 ${HORIZON_Y-12} L 1220 ${HORIZON_Y} L 0 ${HORIZON_Y} Z`} fill="#0c0820" opacity="0.7" />
      <ellipse cx="640" cy={HORIZON_Y-16} rx="220" ry="80" fill="#ffb86a" opacity="0.14" /><ellipse cx="640" cy={HORIZON_Y-16} rx="120" ry="48" fill="#ffd07a" opacity="0.18" />
      <g fill={INK} opacity="0.98">
        <rect x="572" y={HORIZON_Y-60} width="138" height="60" /><polygon points={`562,${HORIZON_Y-60} 720,${HORIZON_Y-60} 641,${HORIZON_Y-108}`} /><rect x="670" y={HORIZON_Y-110} width="12" height="22" />
        <rect x="710" y={HORIZON_Y-40} width="56" height="40" /><polygon points={`705,${HORIZON_Y-40} 770,${HORIZON_Y-40} 738,${HORIZON_Y-60}`} />
        {Array.from({length: 14}, (_, i) => <rect key={`l${i}`} x={490 + i*8} y={HORIZON_Y-12} width="2" height="12" />)}
        {Array.from({length: 16}, (_, i) => <rect key={`r${i}`} x={780 + i*8} y={HORIZON_Y-12} width="2" height="12" />)}
        <rect x="488" y={HORIZON_Y-8} width="128" height="1.5" /><rect x="778" y={HORIZON_Y-8} width="132" height="1.5" />
      </g>
      <rect x="596" y={HORIZON_Y-46} width="20" height="22" fill="#ffd07a" /><rect x="662" y={HORIZON_Y-46} width="20" height="22" fill="#ffd07a" />
      <line x1="606" y1={HORIZON_Y-46} x2="606" y2={HORIZON_Y-24} stroke={INK} strokeWidth="1.2" /><line x1="596" y1={HORIZON_Y-35} x2="616" y2={HORIZON_Y-35} stroke={INK} strokeWidth="1.2" />
      <line x1="672" y1={HORIZON_Y-46} x2="672" y2={HORIZON_Y-24} stroke={INK} strokeWidth="1.2" /><line x1="662" y1={HORIZON_Y-35} x2="682" y2={HORIZON_Y-35} stroke={INK} strokeWidth="1.2" />
      <rect x="630" y={HORIZON_Y-22} width="22" height="22" fill="#3a2614" /><rect x="722" y={HORIZON_Y-30} width="14" height="14" fill="#ffb869" opacity="0.86" />
      <g fill="#06030a"><rect x="466" y={HORIZON_Y-50} width="6" height="50" /><circle cx="469" cy={HORIZON_Y-64} r="20" /><circle cx="454" cy={HORIZON_Y-56} r="14" /><circle cx="484" cy={HORIZON_Y-56} r="14" /><circle cx="469" cy={HORIZON_Y-80} r="14" /><circle cx="478" cy={HORIZON_Y-72} r="11" /><circle cx="460" cy={HORIZON_Y-72} r="11" /></g>
      {Array.from({length: 5}, (_, i) => {
        const phase = ((t * 0.35) + i * 0.2) % 1
        const sx = 676 + Math.sin(t * 0.6 + i * 1.4) * 8 + phase * 4, sy = HORIZON_Y - 112 - phase * 80
        return <circle key={i} cx={sx} cy={sy} r={4 + phase * 14} fill="#dccbbb" opacity={(1 - phase) * 0.18} />
      })}
    </svg>
  )
}

// ── Figure ──────────────────────────────────────────────────────────────────
function Figure({ x, y, walking, opacity, flip=false, h=24, time }: { x: number; y: number; walking: boolean; opacity: number; flip?: boolean; h?: number; time: number }) {
  const w = 11
  const legSwing = walking ? Math.sin(time * 8.5) * 2.2 : 0
  const armSwing = walking ? Math.sin(time * 8.5) * 1.6 : 0
  if (opacity < 0.01) return null
  return (
    <div style={{ position: "absolute", left: x - w/2, top: y, width: w, height: h, opacity, transform: flip ? "scaleX(-1)" : "none" }}>
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
        <circle cx={w/2} cy="3.5" r="2.7" fill={INK} />
        <rect x={w/2 - 1} y="6.2" width="2" height="10.5" fill={INK} rx="0.6" />
        <line x1={w/2} y1="8.5" x2={w/2 - 3 - armSwing} y2="13" stroke={INK} strokeWidth="1.6" strokeLinecap="round" />
        <line x1={w/2} y1="8.5" x2={w/2 + 3 + armSwing} y2="13" stroke={INK} strokeWidth="1.6" strokeLinecap="round" />
        <line x1={w/2} y1="16" x2={w/2 - 2 + legSwing} y2={h-0.5} stroke={INK} strokeWidth="1.8" strokeLinecap="round" />
        <line x1={w/2} y1="16" x2={w/2 + 2 - legSwing} y2={h-0.5} stroke={INK} strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    </div>
  )
}

function Figures() {
  const t = useTime()
  const primEnter = 4.6, primStopT = 22, primStartX = 60, primStopX = 556
  let p1x: number, p1walk: boolean
  if (t < primEnter) { p1x = primStartX; p1walk = false }
  else if (t < primStopT) { const p = (t - primEnter) / (primStopT - primEnter); p1x = primStartX + Easing.easeInOutSine(p) * (primStopX - primStartX); p1walk = true }
  else { p1x = primStopX; p1walk = false }
  const bob1 = p1walk ? Math.abs(Math.sin(t * 8.5)) * 1.8 : 0
  const p1y = HORIZON_Y - 24 - bob1
  const ageT = clamp((t - 4.6) / 17, 0, 1)
  const p1h = 19 + ageT * 7
  const p1op = clamp((t - 4.4) / 0.6, 0, 1) * clamp((26.8 - t) / 0.8, 0, 1)

  const secEnter = 22.8, secMeet = 24.2, secStartX = 641, secMeetX = 596
  let p2x: number, p2walk: boolean
  if (t < secEnter) { p2x = secStartX; p2walk = false }
  else if (t < secMeet) { const p = (t - secEnter) / (secMeet - secEnter); p2x = secStartX - Easing.easeInOutSine(p) * (secStartX - secMeetX); p2walk = true }
  else { p2x = secMeetX; p2walk = false }
  const bob2 = p2walk ? Math.abs(Math.sin(t * 8.5 + 1.4)) * 1.8 : 0
  const p2y = HORIZON_Y - 24 - bob2
  const p2op = clamp((t - secEnter + 0.1) / 0.7, 0, 1) * clamp((26.8 - t) / 0.8, 0, 1)

  return (
    <>
      <Figure x={p1x} y={p1y} walking={p1walk} opacity={p1op} h={p1h} time={t} />
      <Figure x={p2x} y={p2y} walking={p2walk} opacity={p2op} h={24} time={t} flip={true} />
    </>
  )
}

// ── Vignette ────────────────────────────────────────────────────────────────
function Vignette() {
  return <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.18) 100%)" }} />
}

// ── Main Export ─────────────────────────────────────────────────────────────
export default function LifeTimeline() {
  const [time, setTime] = useState(0)
  const [scale, setScale] = useState(1)
  const rafRef = useRef<number>(0)
  const lastRef = useRef<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const step = (ts: number) => {
      if (lastRef.current == null) lastRef.current = ts
      const dt = Math.min((ts - lastRef.current) / 1000, 0.1)
      lastRef.current = ts
      setTime(t => {
        const next = t + dt
        return next >= TOTAL_DURATION ? next % TOTAL_DURATION : next
      })
      rafRef.current = requestAnimationFrame(step)
    }
    rafRef.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      setScale(Math.max(width / CARD_W, height / CARD_H))
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return (
    <TimeCtx.Provider value={time}>
      <div ref={containerRef} style={{
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        borderRadius: "inherit",
      }}>
        <div style={{
          position: "absolute",
          inset: 0,
          width: CARD_W,
          height: CARD_H,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
        }}>
          <Sky />
          <Stars />
          <SunMoon />
          <Ground />
          <ChapterLayer chap={CHAPTERS[0]}><Istanbul /></ChapterLayer>
          <BirthGlow />
          <ChapterLayer chap={CHAPTERS[1]}><Budapest /></ChapterLayer>
          <ChapterLayer chap={CHAPTERS[2]}><Career /></ChapterLayer>
          <ChapterLayer chap={CHAPTERS[3]}><Craft /></ChapterLayer>
          <ChapterLayer chap={CHAPTERS[4]}><HomeScene /></ChapterLayer>
          <Figures />
          <Captions />
          <Vignette />
        </div>
      </div>
    </TimeCtx.Provider>
  )
}
