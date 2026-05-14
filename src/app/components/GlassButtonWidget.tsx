"use client"

import { GlassButton } from "@/components/ui/apple-tahoe-liquid-glass-button"

export default function GlassButtonWidget() {
  return (
    <div style={{
      width: "100%",
      height: "100%",
      background: `
        radial-gradient(ellipse at 30% 40%, oklch(62% 0.28 290) 0%, transparent 55%),
        radial-gradient(ellipse at 75% 65%, oklch(58% 0.30 20) 0%, transparent 50%),
        radial-gradient(ellipse at 55% 20%, oklch(70% 0.26 185) 0%, transparent 45%),
        oklch(14% 0.08 270)
      `,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      "--foreground": "255 255 255",
    } as React.CSSProperties}>
      <GlassButton
        size="lg"
        glassColor="oklch(100% 0 0 / 8%)"
        style={{ color: "white" }}
      >
        Get started →
      </GlassButton>
    </div>
  )
}
