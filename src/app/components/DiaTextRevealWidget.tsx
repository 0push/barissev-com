"use client"

import { DiaTextReveal } from "./DiaTextReveal"

const label = (text: string) => (
  <span style={{
    fontFamily: "var(--body)",
    fontSize: "9px",
    fontWeight: 500,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: "oklch(74% 0.008 245)",
    display: "block",
    marginBottom: "4px",
  }}>
    {text}
  </span>
)

export default function DiaTextRevealWidget() {
  return (
    <div style={{
      width: "100%",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
    }}>

      {/* 1 — Default colors */}
      <div>
        {label("Default")}
        <p style={{ fontFamily: "var(--display)", fontSize: "22px", fontWeight: 800, letterSpacing: "-0.02em", color: "oklch(9% 0.012 245)", lineHeight: 1 }}>
          <DiaTextReveal
            text="Venture OS"
            textColor="oklch(9% 0.012 245)"
            once={false}
          />
        </p>
      </div>

      {/* 2 — Custom gradient (warm) */}
      <div>
        {label("Custom colors")}
        <p style={{ fontFamily: "var(--display)", fontSize: "22px", fontWeight: 800, letterSpacing: "-0.02em", color: "oklch(9% 0.012 245)", lineHeight: 1 }}>
          <DiaTextReveal
            text="Istanbul"
            colors={["#ff6b35", "#f7c59f", "#efefd0", "#ff6b35"]}
            textColor="oklch(9% 0.012 245)"
            once={false}
          />
        </p>
      </div>

      {/* 3 — Rotating phrases */}
      <div>
        {label("Rotating · repeat")}
        <p style={{ fontFamily: "var(--display)", fontSize: "22px", fontWeight: 800, letterSpacing: "-0.02em", color: "oklch(9% 0.012 245)", lineHeight: 1 }}>
          I&nbsp;
          <DiaTextReveal
            text={["build.", "design.", "ship.", "think."]}
            textColor="oklch(9% 0.012 245)"
            repeat
            repeatDelay={1.2}
            once={false}
          />
        </p>
      </div>

      {/* 4 — Slow + delayed */}
      <div>
        {label("duration=3 · delay=0.4")}
        <p style={{ fontFamily: "var(--display)", fontSize: "22px", fontWeight: 800, letterSpacing: "-0.02em", color: "oklch(9% 0.012 245)", lineHeight: 1 }}>
          <DiaTextReveal
            text="Slow reveal"
            textColor="oklch(9% 0.012 245)"
            duration={3}
            delay={0.4}
            once={false}
          />
        </p>
      </div>

    </div>
  )
}
