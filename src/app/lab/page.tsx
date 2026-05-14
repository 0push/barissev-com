import MusicChip from "../components/MusicChip";
import LocationChip from "../components/LocationChip";
import PointerWidget from "../components/PointerWidget";
import DiaTextRevealWidget from "../components/DiaTextRevealWidget";
import ImagesBadgeWidget from "../components/ImagesBadgeWidget";
import { PerspectiveBook } from "@/components/ui/perspective-book";

function Box({
  label,
  flush = false,
  empty = false,
  children,
}: {
  label: string;
  flush?: boolean;
  empty?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <div style={{ width: 300, height: 300, display: "flex", flexDirection: "column", gap: 6 }}>
      <span style={{
        fontFamily: "var(--body)",
        fontSize: "9.5px",
        fontWeight: 500,
        color: "oklch(65% 0.008 245)",
        letterSpacing: "0.10em",
        textTransform: "uppercase",
      }}>
        {label}
      </span>
      <div style={{
        flex: 1,
        background: empty ? "transparent" : "oklch(99.5% 0.003 245)",
        border: empty
          ? "1px dashed oklch(88% 0.006 245)"
          : "1px solid rgba(0,0,0,0.08)",
        borderRadius: "18px",
        overflow: "hidden",
        padding: flush ? 0 : "24px",
        position: "relative",
        display: empty ? "flex" : undefined,
        alignItems: empty ? "center" : undefined,
        justifyContent: empty ? "center" : undefined,
      }}>
        {empty ? (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <rect x="0.5" y="0.5" width="19" height="19" rx="5.5" stroke="oklch(82% 0.006 245)" strokeDasharray="3 2"/>
            <path d="M10 6v8M6 10h8" stroke="oklch(82% 0.006 245)" strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
        ) : children}
      </div>
    </div>
  );
}

export default function Lab() {
  return (
    <div style={{
      background: "oklch(96.5% 0.006 238)",
      minHeight: "100vh",
      padding: "48px 36px",
    }}>
      <header style={{ marginBottom: "40px" }}>
        <p style={{
          fontFamily: "var(--body)",
          fontSize: "10px",
          fontWeight: 500,
          color: "oklch(65% 0.008 245)",
          textTransform: "uppercase",
          letterSpacing: "0.14em",
          marginBottom: "6px",
        }}>
          Widget Lab
        </p>
        <h1 style={{
          fontFamily: "var(--display)",
          fontSize: "28px",
          fontWeight: 800,
          color: "oklch(9% 0.012 245)",
          letterSpacing: "-0.02em",
        }}>
          Sandbox
        </h1>
      </header>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>

        <Box label="music-chip">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
            <MusicChip />
          </div>
        </Box>

        <Box label="location-chip">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
            <LocationChip />
          </div>
        </Box>

        <Box label="pointer">
          <PointerWidget />
        </Box>

        <Box label="dia-text-reveal">
          <DiaTextRevealWidget />
        </Box>

        <Box label="images-badge">
          <ImagesBadgeWidget />
        </Box>

        <Box label="perspective-book">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
            <PerspectiveBook coverSrc="/uploads/sisyphus.jpg" hovering>
              <p style={{ fontFamily: "var(--display)", fontSize: "11px", fontWeight: 600, textAlign: "center", lineHeight: 1.3, color: "#fff" }}>
                The Myth of Sisyphus
              </p>
              <p style={{ fontFamily: "var(--body)", fontSize: "9px", fontWeight: 400, color: "rgba(255,255,255,0.7)", marginTop: 4 }}>
                Albert Camus
              </p>
            </PerspectiveBook>
          </div>
        </Box>

        <Box label="widget-06" empty />
        <Box label="widget-07" empty />
        <Box label="widget-08" empty />

      </div>
    </div>
  );
}
