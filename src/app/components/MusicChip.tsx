export default function MusicChip() {
  return (
    <div className="widget widget-music">
      <div className="widget-vinyl-stack">
        <div className="widget-vinyl" />
        <div className="widget-album">
          <div className="widget-eq">
            <div className="widget-eq-bar" />
            <div className="widget-eq-bar" />
            <div className="widget-eq-bar" />
            <div className="widget-eq-bar" />
          </div>
        </div>
      </div>
      <div className="widget-music-text">
        <span className="widget-label">Listening to</span>
        <span className="widget-track">Tycho — Epoch</span>
      </div>
    </div>
  );
}
