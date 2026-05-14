"use client"

import { Pointer } from "./Pointer"

export default function PointerWidget() {
  return (
    <div style={{
      width: "100%",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: "12px",
      position: "relative",
    }}>
      <Pointer>
        <svg
          viewBox="0 0 16 16"
          width="28"
          height="28"
          fill="currentColor"
          style={{
            color: "oklch(68% 0.17 30)",
            rotate: "-70deg",
            filter: "drop-shadow(0 2px 6px oklch(68% 0.17 30 / 0.4))",
          }}
        >
          <path d="M14.082 2.182a.5.5 0 0 1 .103.557L8.528 15.467a.5.5 0 0 1-.917-.007L5.57 10.694.803 8.652a.5.5 0 0 1-.006-.916l12.728-5.657a.5.5 0 0 1 .556.103z" />
        </svg>
      </Pointer>

      {/* Visual hint — disappears once you hover */}
      <svg
        viewBox="0 0 16 16"
        width="32"
        height="32"
        fill="oklch(85% 0.008 245)"
        style={{ rotate: "-70deg" }}
      >
        <path d="M14.082 2.182a.5.5 0 0 1 .103.557L8.528 15.467a.5.5 0 0 1-.917-.007L5.57 10.694.803 8.652a.5.5 0 0 1-.006-.916l12.728-5.657a.5.5 0 0 1 .556.103z" />
      </svg>

      <span style={{
        fontFamily: "var(--body)",
        fontSize: "11px",
        fontWeight: 500,
        letterSpacing: "0.10em",
        textTransform: "uppercase",
        color: "oklch(74% 0.008 245)",
      }}>
        Hover me
      </span>
    </div>
  )
}
