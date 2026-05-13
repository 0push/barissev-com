export default function MusicChip() {
  return (
    <div className="widget widget-music">
      <div className="vinyl-scene">
        <div className="vinyl-disc vinyl-left" />
        <div className="vinyl-disc vinyl-center" />
        <div className="vinyl-disc vinyl-right" />
      </div>
      <div className="music-info">
        <span className="widget-label">Now playing</span>
        <span className="music-track">Tycho — Epoch</span>
      </div>
    </div>
  );
}
