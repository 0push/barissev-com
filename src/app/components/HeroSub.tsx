"use client"

import { DiaTextReveal } from "./DiaTextReveal"

export default function HeroSub() {
  return (
    <p className="hero-sub">
      <DiaTextReveal
        text="Building products at the intersection of human creativity and AI."
        textColor="oklch(50% 0.010 245)"
        colors={["oklch(74% 0.008 245)", "oklch(50% 0.010 245)", "oklch(74% 0.008 245)"]}
        duration={1.4}
        once={false}
      />
    </p>
  )
}
