export default function MusicChip() {
  return (
    <div className="widget widget-music">
      <div className="music-art">
        <div className="music-eq">
          <div className="music-eq-bar" />
          <div className="music-eq-bar" />
          <div className="music-eq-bar" />
          <div className="music-eq-bar" />
          <div className="music-eq-bar" />
          <div className="music-eq-bar" />
        </div>
      </div>
      <div className="music-footer">
        <span className="widget-label">Now playing</span>
        <span className="music-track">Tycho — Epoch</span>
      </div>
    </div>
  );
}
