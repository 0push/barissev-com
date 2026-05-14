export default function MusicChip() {
  return (
    <div style={{ width: 96, height: 96, margin: "0 auto", marginTop: 8 }}>
      <div style={{
        width: "100%",
        height: "100%",
        borderRadius: "50%",
        background: "radial-gradient(circle, oklch(18% 0 0) 0%, oklch(18% 0 0) 3.5%, oklch(58% 0.09 48) 3.5%, oklch(64% 0.11 46) 6%, oklch(55% 0.10 44) 6%, oklch(60% 0.10 46) 10%, oklch(62% 0.10 46) 10%, oklch(58% 0.09 48) 30%, oklch(52% 0.08 44) 30%, oklch(52% 0.08 44) 32%, oklch(10% 0.002 240) 32%, oklch(10% 0.002 240) 33%, oklch(16% 0.002 240) 33%, oklch(9% 0.002 240) 37%, oklch(16% 0.002 240) 40%, oklch(9% 0.002 240) 44%, oklch(16% 0.002 240) 47%, oklch(9% 0.002 240) 51%, oklch(16% 0.002 240) 54%, oklch(9% 0.002 240) 58%, oklch(16% 0.002 240) 61%, oklch(9% 0.002 240) 65%, oklch(16% 0.002 240) 68%, oklch(9% 0.002 240) 72%, oklch(16% 0.002 240) 75%, oklch(9% 0.002 240) 79%, oklch(16% 0.002 240) 82%, oklch(9% 0.002 240) 86%, oklch(16% 0.002 240) 89%, oklch(9% 0.002 240) 93%, oklch(13% 0.002 240) 96%, oklch(9% 0.002 240) 100%)",
        animation: "vinylSpin 3.2s linear infinite",
        position: "relative",
      }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/uploads/dust-it-off.jpg"
          alt=""
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            objectFit: "cover",
            opacity: 0.45,
            mixBlendMode: "screen",
            pointerEvents: "none",
          }}
        />
      </div>
    </div>
  )
}
